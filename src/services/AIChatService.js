import { startChat, generationConfig, safetySettings } from '../config/gemini';
import { captureCipherToolArea } from '../utils/screenshotUtils.jsx';

class AIChatService {
  constructor() {
    this.chatSession = null;
    this.conversationHistory = [];
    this.isInitialized = false;
    this.contextWindow = 5; // Number of recent messages to include in context
    this.validateConfiguration();
  }

  // Validate API key configuration
  validateConfiguration() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'your_actual_api_key_here') {
      console.warn('⚠️ Gemini API key not properly configured. Please check your .env file.');
      console.warn('Get your API key from: https://aistudio.google.com/app/apikey');
    }
  }

  // Initialize or get existing chat session
  async initializeSession() {
    if (!this.chatSession) {
      try {
        // Convert our conversation history to Gemini format
        // Filter out welcome messages and ensure proper conversation flow
        const conversationMessages = this.conversationHistory
          .filter(msg => msg.sender === 'user' || msg.sender === 'assistant')
          .filter(msg => !msg.isWelcome); // Filter out welcome messages
        
        let geminiHistory = [];
        
        // Only include history if we have actual user-assistant conversation
        // and ensure the first message is from user
        if (conversationMessages.length > 0) {
          // Find the first user message to start the conversation properly
          const firstUserIndex = conversationMessages.findIndex(msg => msg.sender === 'user');
          
          if (firstUserIndex !== -1) {
            // Include messages from the first user message onwards
            const validMessages = conversationMessages.slice(firstUserIndex);
            
            geminiHistory = validMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            }));
          }
        }
        
        // Start chat with properly formatted history
        this.chatSession = startChat(geminiHistory);
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to initialize chat session:', error);
        throw new Error('Failed to initialize AI chat session');
      }
    }
    return this.chatSession;
  }

  // Combine user queries with current context and screenshots
  async createEnhancedPrompt(userQuery, cipherContext, includeScreenshot = false) {
    let prompt = '';
    
    // Add comprehensive system context about the agent's role and the website
    prompt += `You are CryptoBot, an expert cryptography assistant for CryptoLab - an interactive educational platform for learning cryptography and encryption techniques.

ABOUT CRYPTOLAB PLATFORM:
CryptoLab is a comprehensive cryptography learning platform featuring:

🔐 CIPHER TOOLS (Interactive implementations):
• Caesar Cipher - Simple substitution cipher with key shifts
• Playfair Cipher - Digraph substitution cipher using a 5x5 grid
• Hill Cipher - Matrix-based polygraph substitution cipher
• Vigenère Cipher - Polyalphabetic substitution cipher
• Vernam Cipher (One-Time Pad) - Theoretically unbreakable encryption
• Rail Fence Cipher - Transposition cipher using zigzag pattern
• DES (Data Encryption Standard) - Symmetric block cipher
• AES (Advanced Encryption Standard) - Modern symmetric encryption
• RSA - Asymmetric public-key cryptosystem

🎯 CHALLENGE SECTIONS:
Each cipher includes interactive challenges where users can:
- Practice encryption and decryption
- Solve cryptographic puzzles
- Test their understanding with hands-on exercises

📚 QUIZ MODULES:
Comprehensive quizzes for each encryption method to test knowledge and understanding.

🤖 BYOC (Bring Your Own Cipher):
Advanced section where users can implement and test their own custom ciphers.

YOUR EXPERTISE:
You are an expert in all aspects of cryptography including:
- Classical ciphers (Caesar, Playfair, Hill, Vigenère, etc.)
- Modern encryption (AES, DES, RSA)
- Cryptanalysis and cipher breaking techniques
- Mathematical foundations of cryptography
- Security analysis and best practices
- Historical context and evolution of cryptography
- Practical applications in cybersecurity

RESPONSE GUIDELINES:
- Provide accurate, educational explanations
- Use examples relevant to the available cipher tools
- Guide users to appropriate sections of CryptoLab when relevant
- Explain concepts at an appropriate level for learners
- Include practical demonstrations when possible
- Always maintain accuracy about cryptographic principles

CHALLENGE MODE DETECTION:
When users ask for help solving cipher challenges (keywords: decrypt, encrypt, solve, answer, crack, break, decipher, ciphertext, plaintext, solution) or when they're on challenge pages (/c-*), you MUST provide DIRECT ANSWERS in this format:

**Answer:** [the direct solution/decrypted text/key]
**Explanation:** [1-2 sentences maximum explaining the method]

DO NOT provide lengthy explanations for challenges. Users want solutions, not tutorials.

`;
    
    // Add current context if available
    const contextInfo = cipherContext?.getAIContext?.();
    let isInChallengeMode = false;
    
    if (contextInfo && contextInfo.navigation?.cipherInfo?.name) {
      prompt += `CURRENT CONTEXT: User is currently working with ${contextInfo.navigation.cipherInfo.name}`;
      if (contextInfo.navigation.activeTab) {
        prompt += ` in the ${contextInfo.navigation.activeTab} section`;
      }
      
      // Detect if user is in a challenge section
      if (contextInfo.navigation.cipherInfo.type === 'challenge') {
        isInChallengeMode = true;
        prompt += ` (CHALLENGE MODE - Provide direct answers for solving problems)`;
      }
      prompt += `\n\n`;
    }
    
    // Also check URL for challenge detection
    if (typeof window !== 'undefined') {
      const currentPath = window.location?.pathname;
      if (currentPath && currentPath.includes('/c-')) {
        isInChallengeMode = true;
        prompt += `URL CONTEXT: User is on a challenge page (${currentPath}) - CHALLENGE MODE ACTIVE\n\n`;
      }
    }
    
    // Add screenshot context if requested
    if (includeScreenshot) {
      try {
        const screenshot = await captureCipherToolArea();
        if (screenshot.success) {
          prompt += `[Visual context: Screenshot of current cipher tool interface is available for analysis]\n\n`;
        }
      } catch (error) {
        console.warn('Screenshot capture failed:', error);
      }
    }
    
    // Add the user's query with clear instruction
    const challengeKeywords = ['decrypt', 'encrypt', 'solve', 'answer', 'key is', 'what is', 'crack', 'break', 'decipher', 'cipher text', 'ciphertext', 'plaintext', 'solution'];
    const isChallengeSolving = challengeKeywords.some(keyword => 
      userQuery.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (isInChallengeMode || isChallengeSolving) {
      console.log('🎯 CHALLENGE MODE DETECTED:', { isInChallengeMode, isChallengeSolving, userQuery });
      prompt += `USER CHALLENGE REQUEST: ${userQuery}\n\n**IMPORTANT**: This is a CHALLENGE SOLVING request. You MUST:
1. Provide the DIRECT ANSWER first (the decrypted text, key, or solution)
2. Keep explanation to 1-2 sentences maximum
3. Do NOT provide lengthy educational content
4. Focus only on solving the specific problem asked

Respond in this format:
**Answer:** [direct answer here]
**Explanation:** [1-2 sentences only]
`;
    } else {
      console.log('📚 EDUCATIONAL MODE:', { userQuery });
      prompt += `USER QUESTION: ${userQuery}\n\nPlease provide a helpful, educational response as CryptoBot, the cryptography expert for CryptoLab:`;
    }
    
    return prompt;
  }

  // Send message to AI with error handling and retry logic
  async sendMessage(userQuery, cipherContext, options = {}) {
    const {
      includeScreenshot = false,
      maxRetries = 2,
      retryDelay = 1000
    } = options;
    
    let retries = 0;
    
    while (retries <= maxRetries) {
      try {
        // Ensure session is initialized
        await this.initializeSession();
        
        // Create enhanced prompt with context
        const enhancedPrompt = await this.createEnhancedPrompt(
          userQuery, 
          cipherContext, 
          includeScreenshot
        );
        
        console.log('📝 Sending prompt to AI:', enhancedPrompt.substring(0, 200) + '...');
        
        console.log('📝 Sending prompt to AI:', enhancedPrompt);
        
        // Add user message to history
        const userMessage = {
          id: Date.now(),
          text: userQuery,
          sender: 'user',
          timestamp: new Date().toISOString(),
          context: cipherContext?.getAIContext?.()
        };
        this.addMessageToHistory(userMessage);
        
        // Send message to Gemini
        const result = await this.chatSession.sendMessage(enhancedPrompt);
        const response = await result.response;
        const responseText = response.text();
        
        console.log('✅ AI Response received:', responseText.substring(0, 100) + '...');
        
        // Add AI response to history
        const aiMessage = {
          id: Date.now() + 1,
          text: responseText,
          sender: 'assistant',
          timestamp: new Date().toISOString()
        };
        this.addMessageToHistory(aiMessage);
        
        // Format and return response
        const formattedResponse = this.formatResponse(responseText);
        console.log('✅ Formatted response:', formattedResponse.substring(0, 100) + '...');
        
        return {
          success: true,
          message: formattedResponse,
          rawResponse: responseText,
          messageId: aiMessage.id
        };
        
      } catch (error) {
        console.error(`AI request failed (attempt ${retries + 1}):`, error);
        
        // Check for specific error types
        if (error.message?.includes('API key') || error.message?.includes('401') || error.message?.includes('authentication')) {
          throw new Error('Invalid API key. Please check your Gemini API configuration.');
        }
        
        if (error.message?.includes('quota') || error.message?.includes('429')) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        
        if (error.message?.includes('First content should be with role')) {
          // This specific error should be handled by our history formatting fix
          console.warn('Chat history formatting issue detected, clearing session');
          this.chatSession = null;
          this.isInitialized = false;
          throw new Error('Chat session error. Please try again.');
        }
        
        if (retries < maxRetries) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        
        // Final error after all retries
        throw new Error(`Failed to get AI response: ${error.message}`);
      }
    }
    
    // This should never be reached, but just in case
    throw new Error('Unexpected error: failed to get AI response after all retries');
  }

  // Format AI responses for display
  formatResponse(response) {
    // Clean up the response
    let formatted = response.trim();
    
    // Remove any prompt echoing or extra context that might leak through
    formatted = formatted.replace(/^(Context Information:|User Query:|Question:|USER QUESTION:).*$/gm, '');
    formatted = formatted.replace(/^(You are CryptoBot|ABOUT CRYPTOLAB|YOUR EXPERTISE|RESPONSE GUIDELINES|CURRENT CONTEXT).*$/gm, '');
    formatted = formatted.replace(/^You are currently helping.*$/gm, '');
    formatted = formatted.replace(/^Please provide a (direct|helpful).*$/gm, '');
    formatted = formatted.replace(/^(🔐|🎯|📚|🤖).*$/gm, '');
    
    // Clean up extra whitespace
    formatted = formatted.replace(/\n\n+/g, '\n\n');
    formatted = formatted.trim();
    
    // If the response is empty after cleaning, return a fallback
    if (!formatted || formatted.length < 10) {
      formatted = "I'd be happy to help you with cryptography! Could you please rephrase your question?";
    }
    
    // Handle code blocks if present
    formatted = formatted.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });
    
    // Handle inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert bullet points to proper list items
    formatted = formatted.replace(/^[\s]*[-*]\s+(.+)$/gm, '• $1');
    
    return formatted;
  }

  // Maintain conversation history with size limit
  addMessageToHistory(message) {
    this.conversationHistory.push(message);
    
    // Keep conversation history manageable (last 50 messages)
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
  }

  // Get conversation history with optional filtering
  getConversationHistory(options = {}) {
    const { limit, startFrom, sender } = options;
    let history = [...this.conversationHistory];
    
    // Filter by sender if specified
    if (sender) {
      history = history.filter(msg => msg.sender === sender);
    }
    
    // Apply start position
    if (startFrom !== undefined) {
      history = history.slice(startFrom);
    }
    
    // Apply limit
    if (limit) {
      history = history.slice(-limit);
    }
    
    return history;
  }

  // Get recent context for the AI
  getRecentContext() {
    const recentMessages = this.getConversationHistory({ limit: this.contextWindow });
    return recentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
      timestamp: msg.timestamp
    }));
  }

  // Clear conversation history and reset session
  clearHistory() {
    this.conversationHistory = [];
    this.chatSession = null;
    this.isInitialized = false;
  }

  // Export conversation history
  exportHistory(format = 'json') {
    const history = this.getConversationHistory();
    
    if (format === 'json') {
      return JSON.stringify(history, null, 2);
    } else if (format === 'text') {
      return history.map(msg => 
        `[${new Date(msg.timestamp).toLocaleString()}] ${msg.sender.toUpperCase()}: ${msg.text}`
      ).join('\n\n');
    }
    
    return history;
  }

  // Get conversation statistics
  getStatistics() {
    const history = this.getConversationHistory();
    const userMessages = history.filter(msg => msg.sender === 'user');
    const assistantMessages = history.filter(msg => msg.sender === 'assistant');
    
    return {
      totalMessages: history.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      startTime: history[0]?.timestamp || null,
      lastMessageTime: history[history.length - 1]?.timestamp || null,
      isActive: this.isInitialized
    };
  }
}

// Create and export singleton instance
const aiChatService = new AIChatService();
export default aiChatService;

// Also export the class for testing or multiple instances
export { AIChatService };

