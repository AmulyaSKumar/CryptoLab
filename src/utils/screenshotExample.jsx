import React from 'react';
import { FaCamera, FaDownload, FaCopy } from 'react-icons/fa';
import { 
  captureCipherToolArea, 
  downloadScreenshot, 
  copyScreenshotToClipboard 
} from './screenshotUtils';

/**
 * Example component showing how to integrate screenshot functionality
 * This can be added to any cipher tool component
 */
const ScreenshotExample = () => {
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [lastCapture, setLastCapture] = React.useState(null);
  const [message, setMessage] = React.useState('');

  const handleCaptureScreenshot = async () => {
    setIsCapturing(true);
    setMessage('');

    try {
      // Capture the cipher tool area
      const result = await captureCipherToolArea({
        backgroundColor: '#f5f5f5',
        scale: 2,
        // Add custom options if needed
      });

      if (result.success) {
        setLastCapture(result.data);
        setMessage('Screenshot captured successfully!');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = () => {
    if (!lastCapture) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cipher-tool-${timestamp}.png`;
    
    const result = downloadScreenshot(lastCapture, filename);
    if (result.success) {
      setMessage('Screenshot downloaded!');
    } else {
      setMessage(`Download failed: ${result.error}`);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!lastCapture) return;
    
    const result = await copyScreenshotToClipboard(lastCapture);
    if (result.success) {
      setMessage('Screenshot copied to clipboard!');
    } else {
      setMessage(`Copy failed: ${result.error}`);
    }
  };

  return (
    <div className="screenshot-controls" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'white',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={handleCaptureScreenshot}
          disabled={isCapturing}
          style={{
            padding: '8px 16px',
            background: isCapturing ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isCapturing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <FaCamera />
          {isCapturing ? 'Capturing...' : 'Screenshot'}
        </button>

        {lastCapture && (
          <>
            <button
              onClick={handleDownload}
              style={{
                padding: '8px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              title="Download screenshot"
            >
              <FaDownload />
            </button>

            <button
              onClick={handleCopyToClipboard}
              style={{
                padding: '8px',
                background: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              title="Copy to clipboard"
            >
              <FaCopy />
            </button>
          </>
        )}
      </div>

      {message && (
        <div style={{
          marginTop: '10px',
          padding: '5px',
          fontSize: '12px',
          color: message.includes('Error') ? 'red' : 'green'
        }}>
          {message}
        </div>
      )}

      {/* Preview thumbnail */}
      {lastCapture && (
        <div style={{ marginTop: '10px' }}>
          <img 
            src={lastCapture} 
            alt="Screenshot preview" 
            style={{
              width: '100px',
              height: 'auto',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ScreenshotExample;

/**
 * Usage in cipher tool components:
 * 
 * 1. Import the screenshot utilities:
 *    import { captureCipherToolArea, downloadScreenshot } from '../utils/screenshotUtils';
 * 
 * 2. Add the screenshot button to your component
 * 
 * 3. Make sure your main container has the class 'tool-container' or 'main-container'
 * 
 * 4. To exclude elements from screenshots, add:
 *    - Class: 'chat-interface', 'floating-chat-button', or 'chat-widget'
 *    - Attribute: data-exclude-screenshot="true"
 */
