import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const CaesarCipherTool = () => {
  const [input, setInput] = useState('');
  const [key, setKey] = useState(3);
  const [mode, setMode] = useState('encrypt');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tool');
  const [isReading, setIsReading] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);

  const caesar = (str, shift, decrypt = false) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    shift = parseInt(shift);
    if (decrypt) shift = 26 - shift;

    return str.toUpperCase().split('').map(char => {
      const idx = alphabet.indexOf(char);
      if (idx === -1) return char;
      return alphabet[(idx + shift) % 26];
    }).join('');
  };

  const handleCompute = () => {
    if (!input.trim()) return;
    const result = caesar(input, key, mode === 'decrypt');
    setOutput(result);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const readContent = (text) => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = 0.9;
    utteranceRef.current.onend = () => setIsReading(false);
    setIsReading(true);
    speechSynthesis.speak(utteranceRef.current);
  };

  // Cleanup speech synthesis when component unmounts
  React.useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px', minWidth: 'auto' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">Caesar Cipher</h1>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('tool')}
            className={`nav-button ${activeTab === 'tool' ? '' : 'secondary'}`}
            style={{ minWidth: '120px' }}
          >
            Tool
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`nav-button ${activeTab === 'about' ? '' : 'secondary'}`}
            style={{ minWidth: '120px' }}
          >
            About
          </button>
        </div>

        {activeTab === 'tool' ? (
          <>
            <div className="input-group">
              <label>Enter Text</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                rows="4"
              />
            </div>

            <div className="input-group">
              <label>Shift Key: {key}</label>
              <input
                type="range"
                min="1"
                max="25"
                value={key}
                onChange={(e) => setKey(Number(e.target.value))}
                style={{ accentColor: 'var(--primary-color)' }}
              />
              <div className="result-box" style={{ marginTop: '0.5rem', padding: '0.5rem' }}>
                A → {caesar('A', key)} | B → {caesar('B', key)} | C → {caesar('C', key)}
              </div>
            </div>

            <div className="input-group">
              <label>Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="encrypt">Encrypt</option>
                <option value="decrypt">Decrypt</option>
              </select>
            </div>

            <button
              onClick={handleCompute}
              className="nav-button"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} Text
            </button>

            {output && (
              <div className="input-group" style={{ marginTop: '2rem' }}>
                <div className="flex justify-between items-center mb-2">
                  <label>Result</label>
                  <button
                    onClick={copyToClipboard}
                    className="text-sm"
                    style={{ color: 'var(--primary-color)', background: 'none', padding: '4px 8px' }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="result-box">
                  {output}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="about-content">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                onClick={() => readContent(document.querySelector('.about-content').textContent)}
                className={`speaker-button ${isReading ? 'active' : ''}`}
                title={isReading ? 'Stop Reading' : 'Read Content'}
              >
                {isReading ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l5.7-4.8v15.4L6.5 15.2H3a1 1 0 01-1-1v-4.4a1 1 0 011-1h3.5z" />
                  </svg>
                )}
              </button>
            </div>

            <section className="mb-8">
              <h2 className="section-title">Hey there! 👋</h2>
              <p>
                Welcome to the Caesar Cipher - one of the oldest and most famous encryption methods in history! 
                Ever wondered how Julius Caesar sent secret messages to his generals? Well, you're about to find out! 😎
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">How Does It Work? 🤔</h2>
              <p style={{ marginBottom: '1rem' }}>
                It's super simple! Take each letter in your message and shift it forward in the alphabet by a certain number. 
                That number is your secret key! Let's see an example:
              </p>
              <div className="result-box" style={{ padding: '1rem', marginBottom: '1rem' }}>
                Message: AMAZON<br/>
                Key: 2 (shift each letter forward by 2)<br/>
                A → C (A+2)<br/>
                M → O (M+2)<br/>
                A → C (A+2)<br/>
                Z → B (Z+2, wraps around!)<br/>
                O → Q (O+2)<br/>
                N → P (N+2)<br/>
                Result: COCBQP
              </div>
              <p>
                See how each letter "jumps" forward by 2 spots? And when we get to Z, we wrap around to the start! 
                Pretty clever, right? 🎯
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Quick Tips! 💡</h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>The key can be any number from 1 to 25</li>
                <li>Numbers and special characters stay the same</li>
                <li>Spaces are preserved</li>
                <li>It doesn't matter if you use upper or lower case</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Fun Facts! 🎨</h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>Julius Caesar used a shift of 3 for his messages</li>
                <li>It was used for military communication</li>
                <li>ROT13 is a special version that uses a shift of 13</li>
                <li>It's still used today in puzzles and games!</li>
              </ul>
            </section>

            <section>
              <h2 className="section-title">Is It Secure? 🔒</h2>
              <p style={{ marginBottom: '1rem' }}>
                Well... not really! 😅 Here's why:
              </p>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
                <li>There are only 25 possible keys</li>
                <li>Someone could try all keys quickly (brute force)</li>
                <li>Letter patterns stay the same</li>
              </ul>
              <p>
                But don't worry! This is just the beginning of our crypto journey. More secure methods are coming up! 
                For now, have fun playing with this historical cipher! 🚀
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaesarCipherTool;
