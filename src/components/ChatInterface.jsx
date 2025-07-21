import React, { useState, useRef, useEffect } from 'react';
import { useCipherContext } from '../context/CipherContext';
import aiChatService from '../services/AIChatService';
import { UserMessage, AIMessage, ErrorMessage, LoadingIndicator, ScreenshotMessage } from './chat';
import './ChatInterface.css';

const ChatInterface = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const cipherContext = useCipherContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Initialize chat with welcome message and load history
  useEffect(() => {
    if (isOpen) {
      const history = aiChatService.getConversationHistory();
      if (history.length === 0) {
        const welcomeMessage = {
          id: Date.now(),
          text: "Hello! I'm CryptoBot, your expert cryptography assistant for CryptoLab! 🔐\n\nI can help you with:\n• Understanding encryption algorithms (Caesar, AES, RSA, etc.)\n• Solving cryptographic challenges\n• Learning cipher techniques and cryptanalysis\n• Explaining mathematical foundations of cryptography\n• Navigating the CryptoLab platform features\n\nWhat would you like to explore in the world of cryptography?",
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          isWelcome: true
        };
        aiChatService.addMessageToHistory(welcomeMessage);
        setMessages([welcomeMessage]);
      } else {
        setMessages(history);
      }
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);
    setIsLoading(true);

    try {
      // Send message to AI service with context
      const response = await aiChatService.sendMessage(
        userMessage.text,
        cipherContext,
        {
          includeScreenshot: includeScreenshot,
          maxRetries: 2
        }
      );

      console.log('🔄 Received response from AI service:', response);

      if (response && response.success) {
        const botMessage = {
          id: response.messageId,
          text: response.message,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          isFormatted: true
        };
        console.log('💬 Adding bot message to UI:', botMessage);
        setMessages(prev => [...prev, botMessage]);
      } else {
        console.error('❌ Response was not successful:', response);
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
      setIncludeScreenshot(false); // Reset screenshot option after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      aiChatService.clearHistory();
      setMessages([]);
      
      // Re-add welcome message
      const welcomeMessage = {
        id: Date.now(),
        text: "Welcome back! I'm CryptoBot, ready to help you with cryptography. What would you like to learn or explore today?",
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        isWelcome: true
      };
      aiChatService.addMessageToHistory(welcomeMessage);
      setMessages([welcomeMessage]);
    }
  };

  const handleExportHistory = () => {
    const historyText = aiChatService.exportHistory('text');
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto-chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`chat-interface ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-title">
          <h3>Crypto Assistant</h3>
          <span className="chat-status">Online</span>
        </div>
        <div className="chat-header-controls">
          {!isMinimized && (
            <>
              <button 
                className="chat-control-btn export-btn" 
                onClick={handleExportHistory}
                aria-label="Export chat history"
                title="Export chat history"
              >
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>↓</span>
              </button>
              <button 
                className="chat-control-btn clear-btn" 
                onClick={handleClearHistory}
                aria-label="Clear chat history"
                title="Clear chat history"
              >
                <span style={{ fontSize: '14px' }}>🗑</span>
              </button>
            </>
          )}
          <button 
            className="chat-control-btn minimize-btn" 
            onClick={handleMinimize}
            aria-label="Minimize chat"
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>−</span>
          </button>
          <button 
            className="chat-control-btn close-btn" 
            onClick={onClose}
            aria-label="Close chat"
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>×</span>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.map((message) => {
              console.log('🎨 Rendering message:', message);
              
              // Handle error messages
              if (message.isError) {
                return (
                  <ErrorMessage
                    key={message.id}
                    error={message.text}
                    timestamp={message.timestamp}
                    onRetry={() => {
                      // Remove the error message and retry
                      setMessages(prev => prev.filter(m => m.id !== message.id));
                      // Resend the last user message
                      const lastUserMessage = messages
                        .filter(m => m.sender === 'user')
                        .pop();
                      if (lastUserMessage) {
                        setInputMessage(lastUserMessage.text);
                        handleSendMessage();
                      }
                    }}
                  />
                );
              }

              // Handle screenshot messages
              if (message.screenshot) {
                return (
                  <ScreenshotMessage
                    key={message.id}
                    screenshot={message.screenshot}
                    message={message.text}
                    timestamp={message.timestamp}
                    sender={message.sender === 'user' ? 'user' : 'ai'}
                  />
                );
              }

              // Handle regular messages
              if (message.sender === 'user') {
                return (
                  <UserMessage
                    key={message.id}
                    message={message.text}
                    timestamp={message.timestamp}
                  />
                );
              } else {
                return (
                  <AIMessage
                    key={message.id}
                    message={message.text}
                    timestamp={message.timestamp}
                  />
                );
              }
            })}
            
            {/* Show typing indicator when AI is responding */}
            {isTyping && <AIMessage isTyping={true} />}
            
            {/* Show loading indicator when processing */}
            {isLoading && !isTyping && (
              <LoadingIndicator message="Processing your request..." />
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-container">
            <div className="chat-input-options">
              <button
                className={`option-button screenshot-btn ${includeScreenshot ? 'active' : ''}`}
                onClick={() => setIncludeScreenshot(!includeScreenshot)}
                title="Include screenshot with message"
                disabled={isLoading}
              >
                <span style={{ fontSize: '14px' }}>📷</span>
                {includeScreenshot && <span className="option-label">Screenshot included</span>}
              </button>
            </div>
            <div className="chat-input-area">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="chat-input"
                rows="1"
                disabled={isLoading}
              />
              <button 
                className="send-button" 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send message"
              >
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>▶</span>
              </button>
            </div>
            {error && (
              <div className="chat-error">
                {error}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
