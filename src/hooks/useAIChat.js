import { useState, useCallback, useEffect } from 'react';
import aiChatService from '../services/AIChatService';
import { useCipherContext } from '../context/CipherContext';

/**
 * Custom hook for interacting with the AI Chat Service
 * Provides a simplified interface for components to use AI chat functionality
 */
export const useAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const cipherContext = useCipherContext();

  // Update statistics periodically
  useEffect(() => {
    const updateStats = () => {
      setStatistics(aiChatService.getStatistics());
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Send a message to the AI
  const sendMessage = useCallback(async (message, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiChatService.sendMessage(
        message,
        cipherContext,
        options
      );
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cipherContext]);

  // Get formatted conversation history
  const getHistory = useCallback((options = {}) => {
    return aiChatService.getConversationHistory(options);
  }, []);

  // Clear conversation history
  const clearHistory = useCallback(() => {
    aiChatService.clearHistory();
    setStatistics(aiChatService.getStatistics());
  }, []);

  // Export conversation
  const exportConversation = useCallback((format = 'json') => {
    return aiChatService.exportHistory(format);
  }, []);

  // Get context-aware suggestions
  const getSuggestions = useCallback(() => {
    const context = cipherContext?.getAIContext?.();
    return context?.suggestions || [];
  }, [cipherContext]);

  // Check if AI is ready
  const isReady = useCallback(() => {
    return aiChatService.isInitialized;
  }, []);

  return {
    // State
    isLoading,
    error,
    statistics,
    
    // Methods
    sendMessage,
    getHistory,
    clearHistory,
    exportConversation,
    getSuggestions,
    isReady,
    
    // Direct service access (for advanced use)
    service: aiChatService
  };
};

export default useAIChat;
