import { useState, useCallback } from 'react';
import { 
  captureScreenshot,
  captureCipherToolArea,
  downloadScreenshot,
  copyScreenshotToClipboard
} from './screenshotUtils.jsx';

/**
 * Custom hook for screenshot functionality
 * @param {Object} options - Configuration options
 * @returns {Object} Screenshot utilities and state
 */
export const useScreenshot = (options = {}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCapture, setLastCapture] = useState(null);
  const [error, setError] = useState(null);

  // Capture screenshot of specific element
  const capture = useCallback(async (element, customOptions = {}) => {
    setIsCapturing(true);
    setError(null);

    try {
      const result = await captureScreenshot(element, {
        ...options,
        ...customOptions
      });

      if (result.success) {
        setLastCapture(result.data);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorResult = {
        success: false,
        error: err.message || 'Screenshot failed'
      };
      setError(errorResult.error);
      return errorResult;
    } finally {
      setIsCapturing(false);
    }
  }, [options]);

  // Capture cipher tool area
  const captureTool = useCallback(async (customOptions = {}) => {
    setIsCapturing(true);
    setError(null);

    try {
      const result = await captureCipherToolArea({
        ...options,
        ...customOptions
      });

      if (result.success) {
        setLastCapture(result.data);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorResult = {
        success: false,
        error: err.message || 'Screenshot failed'
      };
      setError(errorResult.error);
      return errorResult;
    } finally {
      setIsCapturing(false);
    }
  }, [options]);

  // Download the last captured screenshot
  const download = useCallback((filename) => {
    if (!lastCapture) {
      setError('No screenshot to download');
      return { success: false, error: 'No screenshot to download' };
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultFilename = `screenshot-${timestamp}.png`;
    
    return downloadScreenshot(lastCapture, filename || defaultFilename);
  }, [lastCapture]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!lastCapture) {
      setError('No screenshot to copy');
      return { success: false, error: 'No screenshot to copy' };
    }

    const result = await copyScreenshotToClipboard(lastCapture);
    if (!result.success) {
      setError(result.error);
    }
    return result;
  }, [lastCapture]);

  // Clear the last capture
  const clear = useCallback(() => {
    setLastCapture(null);
    setError(null);
  }, []);

  return {
    // State
    isCapturing,
    lastCapture,
    error,
    hasCapture: !!lastCapture,

    // Methods
    capture,
    captureTool,
    download,
    copyToClipboard,
    clear
  };
};

export default useScreenshot;
