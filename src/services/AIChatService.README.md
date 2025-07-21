# AI Chat Service Documentation

## Overview

The AI Chat Service is a comprehensive service layer that manages Gemini AI chat sessions for the CryptoLab application. It handles API calls, maintains conversation history, combines user queries with context and screenshots, and provides error handling with retry logic.

## Features

- **Session Management**: Initializes and maintains Gemini AI chat sessions
- **Context Integration**: Combines user queries with current cipher tool context
- **Screenshot Support**: Can include screenshots in AI prompts (for vision models)
- **Conversation History**: Maintains and manages conversation history
- **Error Handling**: Robust error handling with retry logic
- **Response Formatting**: Formats AI responses for better display
- **Export Functionality**: Export conversations in JSON or text format
- **Statistics Tracking**: Tracks conversation statistics

## Usage

### Basic Integration

```javascript
import aiChatService from '../services/AIChatService';

// Send a simple message
const response = await aiChatService.sendMessage(
  "How does Caesar cipher work?",
  cipherContext
);

// Access the formatted response
console.log(response.message);
```

### Using the Hook

```javascript
import useAIChat from '../hooks/useAIChat';

function MyComponent() {
  const { sendMessage, isLoading, error } = useAIChat();
  
  const handleChat = async () => {
    try {
      const response = await sendMessage("Explain RSA encryption");
      // Handle response
    } catch (err) {
      // Handle error
    }
  };
}
```

### Advanced Options

```javascript
// Send message with screenshot
const response = await aiChatService.sendMessage(
  "What's wrong with my cipher configuration?",
  cipherContext,
  {
    includeScreenshot: true,
    maxRetries: 3,
    retryDelay: 2000
  }
);

// Get conversation history
const recentMessages = aiChatService.getConversationHistory({
  limit: 10,
  sender: 'user'
});

// Export conversation
const conversationData = aiChatService.exportHistory('text');

// Get statistics
const stats = aiChatService.getStatistics();
```

## API Reference

### AIChatService Methods

#### `initializeSession()`
Initializes or retrieves the existing chat session.

#### `sendMessage(userQuery, cipherContext, options)`
Sends a message to the AI with context.

**Parameters:**
- `userQuery` (string): The user's message
- `cipherContext` (object): The cipher context from CipherContext
- `options` (object): Optional configuration
  - `includeScreenshot` (boolean): Include screenshot in prompt
  - `maxRetries` (number): Maximum retry attempts (default: 2)
  - `retryDelay` (number): Delay between retries in ms (default: 1000)

**Returns:** Promise<{success, message, rawResponse, messageId}>

#### `getConversationHistory(options)`
Retrieves conversation history with optional filtering.

**Parameters:**
- `options` (object): Filtering options
  - `limit` (number): Maximum messages to return
  - `startFrom` (number): Starting index
  - `sender` (string): Filter by sender ('user' or 'assistant')

#### `clearHistory()`
Clears conversation history and resets the session.

#### `exportHistory(format)`
Exports conversation history in specified format.

**Parameters:**
- `format` (string): Export format ('json' or 'text')

#### `getStatistics()`
Returns conversation statistics.

## Context Integration

The service automatically integrates with the CipherContext to provide contextual information to the AI:

```javascript
// Context information included in prompts:
- Current cipher tool being used
- Activity type (tool, challenge, quiz)
- Active tab
- Whether input text exists
- Whether encryption key is set
- Current mode (encrypt/decrypt)
- Context-based suggestions
```

## Error Handling

The service includes comprehensive error handling:

- API key validation errors
- Quota exceeded errors
- Network errors with retry logic
- Graceful degradation

## Best Practices

1. **Always provide context**: Pass the cipherContext to get better AI responses
2. **Use screenshots sparingly**: Screenshots increase API usage
3. **Handle errors gracefully**: Always wrap calls in try-catch blocks
4. **Monitor usage**: Check statistics regularly to track API usage
5. **Clear history periodically**: Prevent memory buildup in long sessions

## Example Implementation

See `src/examples/AIChatServiceExample.jsx` for a complete implementation example.

## Configuration

The service uses the Gemini configuration from `src/config/gemini.js`. Ensure your API key is properly set:

```javascript
// .env
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

## Security Considerations

- API keys are never exposed in the frontend
- Conversation history is stored in memory only
- No sensitive data is persisted
- User data is not sent to external services beyond the AI API
