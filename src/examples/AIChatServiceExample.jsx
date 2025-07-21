import React, { useState } from 'react';
import useAIChat from '../hooks/useAIChat';
import { useCipherContext } from '../context/CipherContext';

/**
 * Example component demonstrating how to use the AI Chat Service
 * This shows various features and integration patterns
 */
const AIChatServiceExample = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { 
    sendMessage, 
    isLoading, 
    error, 
    statistics, 
    getSuggestions,
    clearHistory,
    exportConversation 
  } = useAIChat();
  
  const cipherContext = useCipherContext();

  // Example: Send a simple message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    try {
      // Add user message to UI
      const userMsg = { id: Date.now(), text: userInput, sender: 'user' };
      setMessages(prev => [...prev, userMsg]);
      
      // Send to AI service
      const response = await sendMessage(userInput);
      
      // Add AI response to UI
      const aiMsg = { 
        id: response.messageId, 
        text: response.message, 
        sender: 'assistant' 
      };
      setMessages(prev => [...prev, aiMsg]);
      
      setUserInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Example: Send message with screenshot
  const handleSendWithScreenshot = async () => {
    if (!userInput.trim()) return;

    try {
      const response = await sendMessage(userInput, { 
        includeScreenshot: true,
        maxRetries: 3 
      });
      
      console.log('Message sent with screenshot:', response);
    } catch (err) {
      console.error('Failed to send message with screenshot:', err);
    }
  };

  // Example: Get contextual help
  const handleGetContextualHelp = async () => {
    const context = cipherContext.getAIContext();
    const helpQuery = `I need help with ${context.navigation.cipherInfo.name}. ${
      context.cipherState.hasInput 
        ? 'I have already entered some text.' 
        : 'I haven\'t entered any text yet.'
    }`;

    try {
      const response = await sendMessage(helpQuery);
      console.log('Contextual help received:', response);
    } catch (err) {
      console.error('Failed to get contextual help:', err);
    }
  };

  // Example: Export conversation
  const handleExport = () => {
    const data = exportConversation('text');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ai-chat-example">
      <h2>AI Chat Service Example</h2>
      
      {/* Statistics Display */}
      {statistics && (
        <div className="stats">
          <h3>Chat Statistics</h3>
          <p>Total Messages: {statistics.totalMessages}</p>
          <p>User Messages: {statistics.userMessages}</p>
          <p>AI Messages: {statistics.assistantMessages}</p>
          <p>Active: {statistics.isActive ? 'Yes' : 'No'}</p>
        </div>
      )}

      {/* Suggestions */}
      <div className="suggestions">
        <h3>Current Suggestions</h3>
        <ul>
          {getSuggestions().map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>

      {/* Messages Display */}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
        
        <button onClick={handleSendWithScreenshot} disabled={isLoading}>
          Send with Screenshot
        </button>
        
        <button onClick={handleGetContextualHelp} disabled={isLoading}>
          Get Help
        </button>
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={clearHistory}>Clear History</button>
        <button onClick={handleExport}>Export Conversation</button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && <div className="loading">Processing...</div>}
    </div>
  );
};

export default AIChatServiceExample;
