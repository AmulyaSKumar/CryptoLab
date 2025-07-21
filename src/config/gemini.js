import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client with your API key
// Make sure to keep your API key secure and never commit it to version control
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE';

// Check if API key is properly configured
if (API_KEY === 'YOUR_API_KEY_HERE' || !API_KEY) {
  console.error('⚠️ Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Get the generative model - you can choose between different models
// gemini-2.0-flash: Latest fast and efficient model with improved capabilities
// gemini-1.5-flash: Fast and efficient model
// gemini-1.5-pro: More capable model for complex tasks
export const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Configuration options for the AI model
export const generationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Safety settings to filter harmful content
export const safetySettings = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
];

// Helper function to start a chat session
export const startChat = (history = []) => {
  try {
    // Ensure history has proper format and valid starting state
    const validHistory = history.length > 0 ? history : [];
    
    // Validate history format for Gemini API
    if (validHistory.length > 0) {
      const firstMessage = validHistory[0];
      if (firstMessage.role !== 'user') {
        console.warn('⚠️ Chat history should start with user message. Clearing history to prevent errors.');
        return model.startChat({
          generationConfig,
          safetySettings,
          history: [],
        });
      }
    }
    
    return model.startChat({
      generationConfig,
      safetySettings,
      history: validHistory,
    });
  } catch (error) {
    console.error('Error starting chat session:', error);
    throw error;
  }
};

// Helper function to generate content from a prompt
export const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

// Helper function to stream content (for real-time responses)
export const generateContentStream = async (prompt) => {
  try {
    const result = await model.generateContentStream(prompt);
    return result.stream;
  } catch (error) {
    console.error('Error generating content stream:', error);
    throw error;
  }
};

export default genAI;
