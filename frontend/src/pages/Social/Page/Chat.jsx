import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "../Style/Chat.css"

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Fetch current user and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch current user
        const userResponse = await fetch("http://localhost:34101/auth/current-user");
        if (!userResponse.ok) throw new Error("Failed to fetch current user");
        const userData = await userResponse.json();
        setCurrentUser({
          id: userData.id,
          name: userData.username,
          type: userData.type
        });

        // Load all messages (single channel)
        const messagesResponse = await fetch("http://localhost:34101/chat");
        if (!messagesResponse.ok) throw new Error("Failed to fetch messages");
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!currentUser || stompClient) return;

    const socket = new SockJS('http://localhost:34101/ws');
    const client = Stomp.over(socket);
    
    client.connect({}, () => {
      setStompClient(client);
      
      // Subscribe to public topic with duplicate prevention
      client.subscribe('/topic/public', (message) => {
        const newMessage = JSON.parse(message.body);
        if (newMessage.type === 'CHAT') {
          setMessages(prev => {
            // Using message ID if available, otherwise use timestamp+sender+content as fallback
            if (newMessage.id && prev.some(msg => msg.id === newMessage.id)) {
              return prev;
            }
            // Fallback duplicate check
            const isDuplicate = prev.some(msg => 
              msg.timestamp === newMessage.timestamp && 
              msg.sender?.id === newMessage.sender?.id &&
              msg.message === newMessage.message
            );
            return isDuplicate ? prev : [...prev, newMessage];
          });
        }
      });
    });

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [currentUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !stompClient) return;

    const chatMessage = {
      sender: currentUser,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'CHAT'
    };

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    setNewMessage("");
  };

  if (loading) return <div className="loading">Se încarcă...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentUser) return <div className="error">Nu ești autentificat</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat</h1>
      </div>

      <div className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="no-messages">Nu există mesaje în chat.</div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${
                  message.sender?.id === currentUser.id ? 'sent' : 'received'
                }`}
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
                    year: 'numeric'
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
      </div>
    </div>
  );
}

export default Chat;