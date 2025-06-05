import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { API_ROUTES } from '../../../app/router';
import "../Style/Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [userTags, setUserTags] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        // Fetch user info, tags, and role from unified endpoint
        const response = await fetch(API_ROUTES.PERSON_ME, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch user info');
        const user = await response.json();
        console.log("User primit de la backend:", user); // DEBUG: vezi structura user-ului
        setCurrentUser({
          id: user.userId || user.id, // asigură-te că iei id-ul corect
          name: user.username || user.name,
          role: user.role,
        });
        setUserTags(user.tags || []);
        // Prepare tag IDs for channel fetch
        const tagIds = (user.tags || []).map(tag => tag.id);
        // Only fetch channels if user has tags
        if (tagIds.length === 0) {
          setChannels([]);
          setActiveChannel(null);
        } else {
          // Always send Authorization header for channel fetch
          const channelsResponse = await fetch(
            `${API_ROUTES.CHANNEL_WITH_TAGS}?tagIds=${tagIds.join(',')}`,
            { headers: { 'Authorization': `Bearer ${token}` } },
          );
          if (!channelsResponse.ok) throw new Error('Failed to fetch channels');
          const channelsData = await channelsResponse.json();
          // Sorteaza canalele lexicografic si seteaza primul ca activ
          const sorted = channelsData.slice().sort((a, b) => a.name.localeCompare(b.name));
          setChannels(sorted);
          if (sorted.length > 0) {
            setActiveChannel(sorted[0]);
            loadChannelMessages(sorted[0].id, token);
          } else {
            setActiveChannel(null);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadChannelMessages = async (channelId, tokenOverride) => {
    try {
      setMessages([]);
      const token = tokenOverride || localStorage.getItem('token');
      const response = await fetch(`${API_ROUTES.CHAT_GET_CHATS}/${channelId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch channel messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currentUser || !activeChannel) return;

    const socket = new SockJS(`http://localhost:34101/ws?token=${token}`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);

      const subscription = client.subscribe(
        `/topic/channel/${activeChannel.id}`,
        (message) => {
          const newMessage = JSON.parse(message.body);
          
          // Remove from pending if it was our temp message
          setPendingMessages(prev => 
            prev.filter(msg => msg.tempId !== newMessage.tempId)
          );

          // Only add if not already present
          setMessages(prev => {
            const exists = prev.some(msg => 
              msg.id === newMessage.id || 
              msg.tempId === newMessage.tempId
            );
            return exists ? prev : [...prev, newMessage];
          });
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    });

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [currentUser, activeChannel]);

  const displayMessages = [
    ...messages,
    ...pendingMessages.filter(msg => 
      msg.channelId === activeChannel?.id && 
      !messages.some(m => m.tempId === msg.tempId)
    )
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingMessages, activeChannel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !stompClient || !activeChannel) return;

    const tempId = Date.now();
    const chatMessage = {
      sender: currentUser.id, // Send only the user ID to backend
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'CHAT',
      channelId: activeChannel.id,
      tempId,
    };

    // DEBUG: Verifică dacă currentUser are id
    console.log("currentUser la trimitere:", currentUser);
    console.log("Trimitem mesaj:", chatMessage);

    // Optimistic update with temporary message (for UI)
    setPendingMessages(prev => [...prev, {
      ...chatMessage,
      sender: { id: currentUser.id, name: "You" } // For UI display only
    }]);
    
    setNewMessage("");

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
  };

  const handleChannelChange = (channel) => {
    // Clear messages before switching
    setMessages([]);
    setPendingMessages([]);
    
    setActiveChannel(channel);
    loadChannelMessages(channel.id);

    if (stompClient && stompClient.connected) {
      stompClient.disconnect();
      setStompClient(null);
    }
  };

  const getChannelTypeClass = (channel) => {
    if (!channel || !channel.tags || !Array.isArray(channel.tags)) return 'general';

    const tagTypes = channel.tags.map(tag => tag.type);

    if (tagTypes.includes('GENERAL')) return 'general';
    if (tagTypes.includes('AN')) return 'an';
    if (tagTypes.includes('MATERIE')) return 'materie';
    if (tagTypes.includes('GRUPA')) return 'grupa';
    if (tagTypes.includes('SEMIAN')) return 'semian';

    return 'general';
  };

  // Fetch all users for name lookup
  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ROUTES.PERSON_GET_ALL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch all users');
      const data = await response.json();
      setAllUsers(data);
    } catch (err) {
      console.error('Error fetching all users:', err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    // ...existing code...
  }, []);

  // Helper to get full name by userId
  const getUserNameById = (userId) => {
    const user = allUsers.find(u => u.userId === userId || u.id === userId);
    if (!user) return `User ${userId}`;
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };

  if (loading) return <div className="loading">Se încarcă...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentUser) return <div className="error">Nu ești autentificat</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat</h1>
      </div>

      <div className="chat-layout">
        <div className="chat-main">
          {activeChannel && (
            <>
              <div className="chat-channel-header">
                <h2>{activeChannel.name}</h2>
                <span className={`channel-type-badge ${getChannelTypeClass(activeChannel)}`}>
                  {getChannelTypeClass(activeChannel).toUpperCase()}
                </span>
              </div>

              <div className="chat-messages" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                {displayMessages.length === 0 ? (
                  <div className="no-messages">Nu există mesaje în acest canal.</div>
                ) : (
                  displayMessages.map((message) => {
                    // Determină id-ul senderului (poate fi number sau object)
                    const senderId = typeof message.sender === "object" ? message.sender?.id : message.sender;
                    const isSentByCurrentUser = senderId === currentUser.id;
                    return (
                      <div
                        key={message.id || message.tempId}
                        className={`message ${isSentByCurrentUser ? 'sent' : 'received'}`}
                      >
                        <div className="message-sender">
                          {isSentByCurrentUser
                            ? 'Tu'
                            : getUserNameById(senderId)}
                        </div>
                        <div className="message-text">{message.message}</div>
                        <div className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString('ro-RO', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Scrie un mesaj..."
                  required
                />
                <button type="submit">Trimite</button>
              </form>
            </>
          )}
        </div>

        <div className="chat-sidebar">
          <h2>Canale disponibile</h2>
          <ul className="channel-list">
            {channels
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((channel) => (
                <li
                  key={channel.id}
                  className={`channel-item ${activeChannel?.id === channel.id ? 'active' : ''}`}
                  onClick={() => handleChannelChange(channel)}
                >
                  <span className={`channel-name ${getChannelTypeClass(channel)}`}>
                    {channel.name}
                  </span>
                  <span className="channel-type">
                    {getChannelTypeClass(channel)}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Chat;