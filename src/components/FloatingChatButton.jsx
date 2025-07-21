import React, { useState } from 'react';
import { FaCommentDots, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ChatInterface from './ChatInterface';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide chatbot on challenge and quiz pages
  const hideChatbot = location.pathname.startsWith('/c-') || location.pathname.startsWith('/q-');

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Don't render the chatbot if we're on a challenge or quiz page
  if (hideChatbot) {
    return null;
  }

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
