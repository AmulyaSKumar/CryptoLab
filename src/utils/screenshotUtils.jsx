import html2canvas from 'html2canvas';
import React from 'react';

/**
 * Captures a screenshot of a specific element and converts it to base64
 * @param {HTMLElement|string} element - The element to capture or its selector
 * @param {Object} options - Configuration options for the screenshot
 * @returns {Promise<{success: boolean, data?: string, error?: string}>}
 */
export const captureScreenshot = async (element, options = {}) => {
  try {
    // Get the element if a selector string is provided
    const targetElement = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;

    if (!targetElement) {
      throw new Error('Target element not found');
    }

    // Default options for html2canvas
    const defaultOptions = {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true, // Handle cross-origin images
      allowTaint: true,
      ignoreElements: (elem) => {
        // Exclude chat widget and floating button from screenshots
        return elem.classList.contains('chat-interface') || 
               elem.classList.contains('floating-chat-button') ||
               elem.classList.contains('chat-widget') ||
               elem.getAttribute('data-exclude-screenshot') === 'true';
      },
      ...options
    };

    // Capture the screenshot
    const canvas = await html2canvas(targetElement, defaultOptions);

    // Convert to base64
    const base64Image = canvas.toDataURL('image/png');

    return {
      success: true,
      data: base64Image
    };
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to capture screenshot'
    };
  }
};

/**
 * Captures a screenshot of the main cipher tool area
 * @param {Object} options - Configuration options
 * @returns {Promise<{success: boolean, data?: string, error?: string}>}
 */
export const captureCipherToolArea = async (options = {}) => {
  try {
    // Try to find the main tool container
    const toolContainer = document.querySelector('.tool-container') || 
                         document.querySelector('.main-container') ||
                         document.querySelector('[data-screenshot-area="main"]');

    if (!toolContainer) {
      throw new Error('Cipher tool container not found');
    }

    return await captureScreenshot(toolContainer, options);
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to capture cipher tool area'
    };
  }
};

/**
 * Downloads a base64 image as a file
 * @param {string} base64Data - The base64 image data
 * @param {string} filename - The filename for download
 */
export const downloadScreenshot = (base64Data, filename = 'screenshot.png') => {
  try {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true };
  } catch (error) {
    console.error('Download failed:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to download screenshot' 
    };
  }
};

/**
 * Copies base64 image to clipboard (if supported)
 * @param {string} base64Data - The base64 image data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const copyScreenshotToClipboard = async (base64Data) => {
  try {
    // Convert base64 to blob
    const response = await fetch(base64Data);
    const blob = await response.blob();

    // Check if clipboard API is available
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      return { success: true };
    } else {
      throw new Error('Clipboard API not supported');
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to copy screenshot to clipboard' 
    };
  }
};

/**
 * Helper function to capture screenshot with loading state
 * @param {Function} Component - React component that needs screenshot functionality
 * @returns {Function} - Enhanced component with screenshot capability
 */
export const withScreenshotCapability = (Component) => {
  return function WithScreenshot(props) {
    const [isCapturing, setIsCapturing] = React.useState(false);
    const [captureError, setCaptureError] = React.useState(null);

    const handleCapture = async (options = {}) => {
      setIsCapturing(true);
      setCaptureError(null);

      const result = await captureCipherToolArea(options);

      if (!result.success) {
        setCaptureError(result.error);
      }

      setIsCapturing(false);
      return result;
    };

    return (
      <Component 
        {...props} 
        onCaptureScreenshot={handleCapture}
        isCapturingScreenshot={isCapturing}
        screenshotError={captureError}
      />
    );
  };
};

// Export all utilities
export default {
  captureScreenshot,
  captureCipherToolArea,
  downloadScreenshot,
  copyScreenshotToClipboard,
  withScreenshotCapability
};
