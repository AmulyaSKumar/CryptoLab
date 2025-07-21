import React, { useState } from 'react';
import { FaCommentDots, FaTimes } from 'react-icons/fa';
import ChatInterface from './ChatInterface';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="floating-chat-button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <div className={`icon-wrapper ${isOpen ? 'rotate-out' : 'rotate-in'}`}>
          {isOpen ? <FaTimes /> : <FaCommentDots />}
        </div>
      </button>
      <ChatInterface isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default FloatingChatButton;
