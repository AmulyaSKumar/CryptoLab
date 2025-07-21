import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import './MessageStyles.css';

const ErrorMessage = ({ error, onRetry, timestamp }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'An unexpected error occurred. Please try again.';
  };

  return (
    <div className="message error-message">
      <div className="message-content">
        <div className="error-icon">
          <FaExclamationTriangle />
        </div>
        <div className="message-bubble error-bubble">
          <div className="error-header">
            <h4>Error</h4>
          </div>
          <p className="error-text">{getErrorMessage(error)}</p>
          {onRetry && (
            <button className="retry-button" onClick={onRetry}>
              <FaRedo />
              <span>Retry</span>
            </button>
          )}
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

export default ErrorMessage;
