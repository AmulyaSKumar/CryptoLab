import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import './MessageStyles.css';

const AIMessage = ({ message, timestamp, isTyping = false }) => {
  const [formattedContent, setFormattedContent] = useState('');

  useEffect(() => {
    if (message && !isTyping) {
      // Configure marked options for better rendering
      marked.setOptions({
        breaks: true,
        gfm: true,
        highlight: function(code, lang) {
          return `<pre class="code-block"><code class="language-${lang}">${code}</code></pre>`;
        }
      });

      // Convert markdown to HTML
      const rawHtml = marked(message);
      
      // Sanitize the HTML to prevent XSS
      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ['class'],
        ADD_TAGS: ['pre', 'code']
      });

      setFormattedContent(cleanHtml);
    }
  }, [message, isTyping]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isTyping) {
    return (
      <div className="message ai-message">
        <div className="message-content">
          <div className="ai-avatar">AI</div>
          <div className="message-bubble">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message ai-message">
      <div className="message-content">
        <div className="ai-avatar">AI</div>
        <div className="message-bubble">
          <div 
            className="message-text markdown-content"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </div>
        {timestamp && (
          <div className="message-metadata">
            <span className="message-time">{formatTime(timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMessage;
