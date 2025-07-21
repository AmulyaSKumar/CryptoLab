import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Create the context
const CipherContext = createContext();

// Custom hook to use the cipher context
export const useCipherContext = () => {
  const context = useContext(CipherContext);
  if (!context) {
    throw new Error('useCipherContext must be used within a CipherContextProvider');
  }
  return context;
};

// Cipher type mapping based on routes
const CIPHER_TYPES = {
  '/c0-crypto': { name: 'Crypto 101', type: 'educational' },
  '/c1-caesar': { name: 'Caesar Cipher', type: 'classical' },
  '/c2-playfair': { name: 'Playfair Cipher', type: 'classical' },
  '/c3-hill': { name: 'Hill Cipher', type: 'classical' },
  '/c4-otp': { name: 'One Time Pad', type: 'classical' },
  '/c5-vigenere': { name: 'Vigenere Cipher', type: 'classical' },
  '/c6-vernam': { name: 'Vernam Cipher', type: 'classical' },
  '/c7-railfence': { name: 'Rail Fence Cipher', type: 'classical' },
  '/c8-des': { name: 'DES', type: 'modern' },
  '/c9-aes': { name: 'AES', type: 'modern' },
  '/c10-rsa': { name: 'RSA', type: 'modern' },
  '/byoc': { name: 'Custom Cipher Builder', type: 'custom' },
  // Challenges
  '/c-caesar': { name: 'Caesar Challenge', type: 'challenge' },
  '/c-playfair': { name: 'Playfair Challenge', type: 'challenge' },
  '/c-hill': { name: 'Hill Challenge', type: 'challenge' },
  '/c-otp': { name: 'One Time Pad Challenge', type: 'challenge' },
  '/c-vigenere': { name: 'Vigenere Challenge', type: 'challenge' },
  '/c-vernam': { name: 'Vernam Challenge', type: 'challenge' },
  '/c-railfence': { name: 'Rail Fence Challenge', type: 'challenge' },
  // Quizzes
  '/q-caesar': { name: 'Caesar Quiz', type: 'quiz' },
  '/q-playfair': { name: 'Playfair Quiz', type: 'quiz' },
  '/q-railfence': { name: 'Rail Fence Quiz', type: 'quiz' },
  '/q-otp': { name: 'One Time Pad Quiz', type: 'quiz' },
  '/q-hill': { name: 'Hill Quiz', type: 'quiz' },
  '/q-vigenere': { name: 'Vigenere Quiz', type: 'quiz' },
  '/q-vernam': { name: 'Vernam Quiz', type: 'quiz' },
  '/q-rsa': { name: 'RSA Quiz', type: 'quiz' },
  '/q-aes': { name: 'AES Quiz', type: 'quiz' },
  '/q-des': { name: 'DES Quiz', type: 'quiz' },
};

export const CipherContextProvider = ({ children }) => {
  const location = useLocation();
  const [cipherState, setCipherState] = useState({
    inputText: '',
    outputText: '',
    key: '',
    mode: 'encrypt',
    selectedCipher: null,
    additionalParams: {}
  });

  // Track active tab in cipher tools
  const [activeTab, setActiveTab] = useState('tool');

  // Get current cipher info based on route
  const getCurrentCipherInfo = () => {
    const pathInfo = CIPHER_TYPES[location.pathname];
    if (pathInfo) {
      return {
        ...pathInfo,
        path: location.pathname,
        isHome: false
      };
    }
    return {
      name: 'Home',
      type: 'navigation',
      path: location.pathname,
      isHome: location.pathname === '/'
    };
  };

  // Format context for AI consumption
  const getAIContext = () => {
    const cipherInfo = getCurrentCipherInfo();
    
    return {
      navigation: {
        currentPath: location.pathname,
        cipherInfo: cipherInfo,
        activeTab: activeTab
      },
      cipherState: {
        ...cipherState,
        hasInput: !!cipherState.inputText,
        hasOutput: !!cipherState.outputText,
        hasKey: !!cipherState.key
      },
      userActivity: {
        isOnCipherTool: cipherInfo.type === 'classical' || cipherInfo.type === 'modern',
        isOnChallenge: cipherInfo.type === 'challenge',
        isOnQuiz: cipherInfo.type === 'quiz',
        isOnCustomBuilder: cipherInfo.type === 'custom',
        isOnEducational: cipherInfo.type === 'educational'
      },
      suggestions: getSuggestionsForContext(cipherInfo, cipherState)
    };
  };

  // Get context-aware suggestions
  const getSuggestionsForContext = (cipherInfo, state) => {
    const suggestions = [];

    if (cipherInfo.isHome) {
      suggestions.push('You can explore different cipher tools from the home page');
      suggestions.push('Try starting with Caesar Cipher for a simple introduction');
    }

    if (cipherInfo.type === 'classical' || cipherInfo.type === 'modern') {
      if (!state.hasInput) {
        suggestions.push(`Enter some text to ${state.mode} using ${cipherInfo.name}`);
      }
      if (state.hasInput && !state.hasKey && cipherInfo.name !== 'Rail Fence Cipher') {
        suggestions.push('Don\'t forget to set the encryption key');
      }
      if (activeTab === 'about') {
        suggestions.push(`Learn more about how ${cipherInfo.name} works`);
      }
    }

    if (cipherInfo.type === 'challenge') {
      suggestions.push('Try to solve the cipher challenge');
      suggestions.push('Use the hints if you get stuck');
    }

    if (cipherInfo.type === 'quiz') {
      suggestions.push('Test your knowledge about ' + cipherInfo.name.replace(' Quiz', ''));
    }

    return suggestions;
  };

  // Update cipher state (to be called by cipher components)
  const updateCipherState = (updates) => {
    setCipherState(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Clear cipher state when changing routes
  useEffect(() => {
    setCipherState({
      inputText: '',
      outputText: '',
      key: '',
      mode: 'encrypt',
      selectedCipher: getCurrentCipherInfo().name,
      additionalParams: {}
    });
    setActiveTab('tool');
  }, [location.pathname]);

  const contextValue = {
    // Current state
    cipherState,
    activeTab,
    currentCipherInfo: getCurrentCipherInfo(),
    
    // Update functions
    updateCipherState,
    setActiveTab,
    
    // AI context
    getAIContext,
    
    // Utility functions
    clearState: () => setCipherState({
      inputText: '',
      outputText: '',
      key: '',
      mode: 'encrypt',
      selectedCipher: getCurrentCipherInfo().name,
      additionalParams: {}
    })
  };

  return (
    <CipherContext.Provider value={contextValue}>
      {children}
    </CipherContext.Provider>
  );
};
