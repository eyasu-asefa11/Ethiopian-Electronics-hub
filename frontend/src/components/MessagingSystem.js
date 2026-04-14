// Complete Buyer-Seller Messaging System
// This handles Abel's message to Abeba and the seller's response

import React, { useState, useEffect } from 'react';
import './MessagingSystem.css';

const MessagingSystem = ({ currentUser, recipientShop, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Example conversation between Abel and Abeba
  const exampleMessages = [
    {
      id: 1,
      sender: 'buyer',
      senderName: 'Abel',
      content: 'Hello Abeba,\nIs Tecno Spark 10 still available?\nI want to buy it.',
      timestamp: '2026-03-11 10:30 AM',
      type: 'inquiry'
    },
    {
      id: 2,
      sender: 'seller',
      senderName: 'Abeba Electronics',
      content: 'Hello Abel,\nYes it is available.\nWe currently have 5 units.',
      timestamp: '2026-03-11 11:00 AM',
      type: 'response'
    }
  ];

  useEffect(() => {
    setMessages(exampleMessages);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || sendingMessage) return;

    setSendingMessage(true);
    
    // Simulate sending message
    setTimeout(() => {
      const newMessage = {
        id: messages.length + 1,
        sender: 'buyer',
        senderName: currentUser?.username || 'Abel',
        content: message,
        timestamp: new Date().toLocaleString(),
        type: 'inquiry'
      };

      setMessages([...messages, newMessage]);
      setMessage('');
      setSendingMessage(false);
      
      if (onMessageSent) {
        onMessageSent(newMessage);
      }

      // Simulate seller auto-response after 2 seconds
      setTimeout(() => {
        const sellerResponse = {
          id: messages.length + 2,
          sender: 'seller',
          senderName: recipientShop?.name || 'Abeba Electronics',
          content: 'Thank you for your inquiry! I will respond shortly with more details.',
          timestamp: new Date().toLocaleString(),
          type: 'auto-response'
        };
        setMessages(prev => [...prev, sellerResponse]);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="messaging-system">
      <div className="messaging-header">
        <h3>💬 Message to {recipientShop?.name || 'Abeba Electronics'}</h3>
        <div className="shop-info">
          <span className="shop-name">{recipientShop?.name || 'Abeba Electronics'}</span>
          <span className="shop-city">📍 {recipientShop?.city || 'Dilla'}</span>
          <span className="shop-rating">⭐⭐⭐⭐</span>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-header">
                <span className="sender-name">
                  {msg.sender === 'buyer' ? '👤 ' : '🏪 '}
                  {msg.senderName}
                </span>
                <span className="timestamp">{msg.timestamp}</span>
              </div>
              <div className="message-content">
                {msg.content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              <div className="message-type">
                {msg.type === 'inquiry' && <span className="type-badge inquiry">🔍 Product Inquiry</span>}
                {msg.type === 'response' && <span className="type-badge response">✅ Seller Response</span>}
                {msg.type === 'auto-response' && <span className="type-badge auto">🤖 Auto Response</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="message-input-container">
        <div className="input-wrapper">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="message-input"
            rows={3}
            disabled={sendingMessage}
          />
          <button
            onClick={handleSendMessage}
            disabled={sendingMessage || !message.trim()}
            className="send-button"
          >
            {sendingMessage ? '🔄 Sending...' : '📤 Send Message'}
          </button>
        </div>
        
        <div className="quick-responses">
          <h4>Quick Messages:</h4>
          <div className="quick-buttons">
            <button onClick={() => setMessage('Is this product still available?')}>
              Is this product still available?
            </button>
            <button onClick={() => setMessage('Can you tell me more about the warranty?')}>
              Tell me about warranty
            </button>
            <button onClick={() => setMessage('Do you offer delivery to Addis Ababa?')}>
              Delivery to Addis Ababa?
            </button>
            <button onClick={() => setMessage('Is the price negotiable?')}>
              Is the price negotiable?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;
