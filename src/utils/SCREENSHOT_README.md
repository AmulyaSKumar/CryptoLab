# Screenshot Functionality Documentation

This document explains how to use the screenshot capture functionality in the CryptoLab application.

## Overview

The screenshot utility allows you to:
- Capture screenshots of cipher tool areas
- Convert screenshots to base64 format
- Download screenshots as PNG files
- Copy screenshots to clipboard
- Exclude chat widgets from captures
- Handle errors gracefully

## Installation

The `html2canvas` library is already installed. No additional setup required.

## Basic Usage

### 1. Using the Hook (Recommended)

```jsx
import React from 'react';
import { useScreenshot } from '../utils/useScreenshot';

function MyCipherTool() {
  const screenshot = useScreenshot();

  const handleScreenshot = async () => {
    // Capture the cipher tool area
    const result = await screenshot.captureTool();
    
    if (result.success) {
      // Download the screenshot
      screenshot.download('caesar-cipher-result.png');
    }
  };

  return (
    <div className="tool-container">
      {/* Your cipher tool content */}
      
      <button 
        onClick={handleScreenshot}
        disabled={screenshot.isCapturing}
      >
        {screenshot.isCapturing ? 'Capturing...' : 'Take Screenshot'}
      </button>
      
      {screenshot.error && (
        <p style={{ color: 'red' }}>Error: {screenshot.error}</p>
      )}
    </div>
  );
}
```

### 2. Using Utility Functions Directly

```jsx
import { captureCipherToolArea, downloadScreenshot } from '../utils/screenshotUtils';

async function takeScreenshot() {
  const result = await captureCipherToolArea();
  
  if (result.success) {
    // Download the screenshot
    downloadScreenshot(result.data, 'my-screenshot.png');
  } else {
    console.error('Screenshot failed:', result.error);
  }
}
```

### 3. Capturing Specific Elements

```jsx
import { captureScreenshot } from '../utils/screenshotUtils';

// By selector
const result = await captureScreenshot('.my-specific-element');

// By element reference
const element = document.getElementById('myElement');
const result = await captureScreenshot(element);
```

## Advanced Features

### Custom Options

```jsx
const result = await captureCipherToolArea({
  backgroundColor: '#f0f0f0',  // Custom background
  scale: 3,                    // Higher quality (default: 2)
  logging: true,               // Enable logging for debugging
});
```

### Copy to Clipboard

```jsx
const screenshot = useScreenshot();

const handleCopyScreenshot = async () => {
  await screenshot.captureTool();
  const result = await screenshot.copyToClipboard();
  
  if (result.success) {
    alert('Screenshot copied to clipboard!');
  }
};
```

### Excluding Elements

To exclude elements from screenshots, use one of these methods:

1. **Add specific class names:**
   - `chat-interface`
   - `floating-chat-button`
   - `chat-widget`

2. **Add data attribute:**
   ```html
   <div data-exclude-screenshot="true">
     This won't be in the screenshot
   </div>
   ```

## Error Handling

The utilities handle errors gracefully and return consistent error objects:

```jsx
const result = await captureCipherToolArea();

if (!result.success) {
  // Handle error
  console.error('Screenshot failed:', result.error);
  // result.error contains a user-friendly error message
}
```

## Complete Example Component

See `screenshotExample.jsx` for a complete working example with UI controls.

## Important Notes

1. **Container Classes**: Make sure your cipher tool has either `tool-container` or `main-container` class for automatic detection.

2. **Browser Support**: The clipboard functionality requires modern browser support. Always check the result for fallback handling.

3. **Performance**: Screenshots of large areas may take a moment. The `isCapturing` state helps show loading feedback.

4. **Chat Widget**: The chat widget and floating button are automatically excluded from screenshots.

## API Reference

### useScreenshot Hook

```typescript
const {
  // State
  isCapturing: boolean,      // Loading state
  lastCapture: string,        // Base64 image data
  error: string,              // Error message
  hasCapture: boolean,        // Whether a capture exists
  
  // Methods
  capture,                    // Capture specific element
  captureTool,               // Capture cipher tool area
  download,                  // Download last capture
  copyToClipboard,          // Copy to clipboard
  clear                     // Clear capture data
} = useScreenshot(options);
```

### Utility Functions

- `captureScreenshot(element, options)` - Capture any element
- `captureCipherToolArea(options)` - Capture tool area
- `downloadScreenshot(base64Data, filename)` - Download image
- `copyScreenshotToClipboard(base64Data)` - Copy to clipboard
