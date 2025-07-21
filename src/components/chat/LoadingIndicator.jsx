import React from 'react';
import './MessageStyles.css';

const LoadingIndicator = ({ message = "Processing your request..." }) => {
  return (
    <div className="loading-indicator">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
