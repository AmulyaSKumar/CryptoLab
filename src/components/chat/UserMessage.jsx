import React from 'react';
import './MessageStyles.css';

const UserMessage = ({ message, timestamp }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="message user-message">
      <div className="message-content">
        <div className="message-bubble">
          <p className="message-text">{message}</p>
        </div>
        {timestamp && (
          <div className="message-metadata">
            <span className="message-time">{formatTime(timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessage;
