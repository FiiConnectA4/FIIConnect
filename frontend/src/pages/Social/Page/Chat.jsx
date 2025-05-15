import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
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

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch current user
        const userResponse = await fetch("http://localhost:34101/auth/current-user");
        if (!userResponse.ok) throw new Error("Failed to fetch current user");
        const userData = await userResponse.json();
        const currentUserObj = {
          id: userData.id,
          name: userData.username,
          type: userData.type,
        };
        setCurrentUser(currentUserObj);

        // 2. Fetch user's tags
        const tagsResponse = await fetch(`http://localhost:34101/users/${userData.id}/tags`);
        if (!tagsResponse.ok) throw new Error("Failed to fetch user tags");
        const tagsData = await tagsResponse.json();
        setUserTags(tagsData);

        // 3. Prepare tag IDs
        const tagIds = tagsData.map(tag => tag.id);

        // 4. Fetch channels
        const channelsResponse = await fetch(
          `http://localhost:34101/channel/with-tags?tagIds=${tagIds.join(',')}`
        );
        if (!channelsResponse.ok) throw new Error("Failed to fetch channels");
        const channelsData = await channelsResponse.json();
        console.log("Channels data:", channelsData);
        setChannels(channelsData);

        // 5. Set first channel as active if available
        if (channelsData.length > 0) {
          setActiveChannel(channelsData[0]);
          loadChannelMessages(channelsData[0].id);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadChannelMessages = async (channelId) => {
    try {
      const response = await fetch(`http://localhost:34101/chat/get-chats/${channelId}`);
      if (!response.ok) throw new Error("Failed to fetch channel messages");
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!currentUser || !activeChannel) return;

    const socket = new SockJS('http://localhost:34101/ws');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);

      client.subscribe(`/topic/channel/${activeChannel.id}`, (message) => {
        const newMessage = JSON.parse(message.body);

        setPendingMessages(prev =>
          prev.filter(msg => msg.tempId !== newMessage.tempId)
        );

        setMessages(prev => {
          const exists = prev.some(msg =>
            msg.id === newMessage.id || msg.tempId === newMessage.tempId
          );
          return exists ? prev : [...prev, newMessage];
        });
      });
    });

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [currentUser, activeChannel]);

  const displayMessages = [
    ...messages,
    ...pendingMessages.filter(msg => msg.channelId === activeChannel?.id),
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeChannel]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !stompClient || !activeChannel) return;

    const tempId = Date.now();
    const chatMessage = {
      sender: currentUser,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'CHAT',
      channelId: activeChannel.id,
      tempId,
    };

    setPendingMessages(prev => [...prev, chatMessage]);
    setNewMessage("");
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
  };

  const handleChannelChange = (channel) => {
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
    if (tagTypes.includes('SEMINAR')) return 'seminar';

    return 'general';
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
                  displayMessages.map((message) => (
                    <div
                      key={message.id || message.tempId}
                      className={`message ${message.sender?.id === currentUser.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-sender">
                        {message.sender?.id === currentUser.id ? 'Tu' : message.sender?.name}
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
                  ))
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
            {channels.map((channel) => (
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
