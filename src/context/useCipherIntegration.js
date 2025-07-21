import { useEffect } from 'react';
import { useCipherContext } from './CipherContext';

/**
 * Hook for cipher components to integrate with the context system
 * @param {Object} config - Configuration object
 * @param {string} config.inputText - Current input text
 * @param {string} config.outputText - Current output text
 * @param {string} config.key - Current encryption key
 * @param {string} config.mode - Current mode (encrypt/decrypt)
 * @param {string} config.activeTab - Current active tab
 * @param {Object} config.additionalParams - Any additional cipher-specific parameters
 */
export const useCipherIntegration = (config) => {
  const { updateCipherState, setActiveTab: updateActiveTab } = useCipherContext();

  // Update context when component state changes
  useEffect(() => {
    if (config) {
      const updates = {};
      
      if (config.inputText !== undefined) updates.inputText = config.inputText;
      if (config.outputText !== undefined) updates.outputText = config.outputText;
      if (config.key !== undefined) updates.key = config.key;
      if (config.mode !== undefined) updates.mode = config.mode;
      if (config.additionalParams !== undefined) updates.additionalParams = config.additionalParams;

      updateCipherState(updates);
    }
  }, [config, updateCipherState]);

  // Update active tab in context
  useEffect(() => {
    if (config?.activeTab) {
      updateActiveTab(config.activeTab);
    }
  }, [config?.activeTab, updateActiveTab]);
};
