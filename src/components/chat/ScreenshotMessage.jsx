import React, { useState } from 'react';
import { FaExpand, FaTimes, FaDownload } from 'react-icons/fa';
import './MessageStyles.css';

const ScreenshotMessage = ({ screenshot, message, timestamp, sender = 'user' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `screenshot-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <div className={`message ${sender}-message screenshot-message`}>
        <div className="message-content">
          {sender === 'ai' && <div className="ai-avatar">AI</div>}
          <div className="message-bubble">
            <div className="screenshot-container">
              <img 
                src={screenshot} 
                alt="Screenshot" 
                className="screenshot-thumbnail"
                onClick={toggleFullscreen}
              />
              <div className="screenshot-actions">
                <button 
                  className="screenshot-action-btn"
                  onClick={toggleFullscreen}
                  title="View fullscreen"
                >
                  <FaExpand />
                </button>
                <button 
                  className="screenshot-action-btn"
                  onClick={handleDownload}
                  title="Download screenshot"
                >
                  <FaDownload />
                </button>
              </div>
            </div>
            {message && <p className="message-text">{message}</p>}
          </div>
          {timestamp && (
            <div className="message-metadata">
              <span className="message-time">{formatTime(timestamp)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="screenshot-fullscreen-modal" onClick={toggleFullscreen}>
          <div className="fullscreen-content">
            <button 
              className="fullscreen-close-btn"
              onClick={toggleFullscreen}
            >
              <FaTimes />
            </button>
            <img 
              src={screenshot} 
              alt="Screenshot fullscreen" 
              className="screenshot-fullscreen"
            />
            <div className="fullscreen-actions">
              <button 
                className="fullscreen-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
              >
                <FaDownload />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScreenshotMessage;
