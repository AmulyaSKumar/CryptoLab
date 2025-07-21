import React from 'react';
import { FaTimes, FaMinus, FaPaperPlane, FaCamera, FaDownload, FaTrash } from 'react-icons/fa';

// Test component to verify React Icons are working
const TestIcons = () => {
  return (
    <div style={{ padding: '20px', background: 'white' }}>
      <h3>Icon Test</h3>
      <div style={{ display: 'flex', gap: '10px', fontSize: '24px' }}>
        <FaTimes title="Times" />
        <FaMinus title="Minus" />
        <FaPaperPlane title="PaperPlane" />
        <FaCamera title="Camera" />
        <FaDownload title="Download" />
        <FaTrash title="Trash" />
      </div>
    </div>
  );
};

export default TestIcons;
