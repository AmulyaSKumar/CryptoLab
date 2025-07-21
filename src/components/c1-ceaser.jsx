import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const CaesarCipherTool = () => {
  const [input, setInput] = useState('');
  const [key, setKey] = useState(3);
  const [mode, setMode] = useState('encrypt');
  const [output, setOutput] = useState('');
  const [steps, setSteps] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tool');
  const [isReading, setIsReading] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);
    const navigate = useNavigate();


  const caesar = (str, shift, decrypt = false) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    shift = parseInt(shift);
    if (decrypt) shift = 26 - shift;

    const chars = str.toUpperCase().split('');
    const result = chars.map((char) => {
      const idx = alphabet.indexOf(char);
      if (idx === -1) return { char, shifted: char, process: 'Not a letter' };
      
      const newIdx = (idx + shift) % 26;
      const shiftedChar = alphabet[newIdx];
      
      return {
        char,
        alphabetIndex: idx,
        shift,
        newIndex: newIdx,
        shifted: shiftedChar,
        process: `${char} (${idx}) ${decrypt ? '-' : '+'} ${shift} = ${newIdx} → ${shiftedChar}`
      };
    });

    return result;
  };

  const handleCompute = () => {
    if (!input.trim()) return;
    const result = caesar(input, key, mode === 'decrypt');
    setSteps(result);
    setOutput(result.map(r => r.shifted).join(''));
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
      <div className="back-nav">
        <Link to="/" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">Caesar Cipher</h1>

        {/* Tab Navigation */}
        <div className="cipher-nav-container">
          <button
            onClick={() => setActiveTab('tool')}
            className={`nav-button ${activeTab === 'tool' ? '' : 'secondary'}`}
          >
            Tool
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`nav-button ${activeTab === 'about' ? '' : 'secondary'}`}
          >
            About
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/c-caesar')}
          >
            Try Challenge
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/q-caesar')}
          >
            Take Test
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
              
            </div>

            {/* Mode Selection - Standardized Toggle */}
<div className="input-group">
  <label>Operation Mode</label>
  <div className="operation-mode-toggle">
    <button 
      className={`operation-mode-option ${mode === 'encrypt' ? 'active' : ''}`}
      onClick={() => setMode('encrypt')}
    >
      <input
        type="radio"
        name="mode"
        checked={mode === 'encrypt'}
        onChange={() => setMode('encrypt')}
      />
      Encrypt
    </button>
    <button 
      className={`operation-mode-option ${mode === 'decrypt' ? 'active' : ''}`}
      onClick={() => setMode('decrypt')}
    >
      <input
        type="radio"
        name="mode"
        checked={mode === 'decrypt'}
        onChange={() => setMode('decrypt')}
      />
      Decrypt
    </button>
  </div>
</div>

            <button
              onClick={handleCompute}
              className="nav-button"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} Text
            </button>

            {steps.length > 0 && (
              <>
                <div className="visualization-steps">
                  <div className="step">
                    <div className="step-title">Step 1: Input Text</div>
                    <div className="step-content">
                      {steps.map((step, i) => (
                        <div key={i} className="char-box" data-index={i}>
                          {step.char}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step">
                    <div className="step-title">
                      Step 2: {mode === 'encrypt' ? 'Shift Forward' : 'Shift Backward'} by {key}
                    </div>
                    <div className="step-content">
                      {steps.map((step, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div className="char-box" data-index={i}>
                            {step.char}
                          </div>
                          <div className="arrow-down">↓</div>
                          <div className="char-box">
                            {step.shifted}
                          </div>
                          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-color)' }}>
                            {step.process}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step">
                    <div className="step-title">Final Result</div>
                    <div className="step-content">
                      {steps.map((step, i) => (
                        <div key={i} className="char-box" data-index={i}>
                          {step.shifted}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
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
              </>
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
              <h2 className="section-title">Hey there! </h2>
              <p>
                Welcome to the Caesar Cipher - one of the oldest and most famous encryption methods in history! 
                Ever wondered how Julius Caesar sent secret messages to his generals? Well, you're about to find out! 
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">How Does It Work? </h2>
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
                Pretty clever, right? 
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Quick Tips! </h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>The key can be any number from 1 to 25</li>
                <li>Numbers and special characters stay the same</li>
                <li>Spaces are preserved</li>
                <li>It doesn't matter if you use upper or lower case</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Fun Facts! </h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>Julius Caesar used a shift of 3 for his messages</li>
                <li>It was used for military communication</li>
                <li>ROT13 is a special version that uses a shift of 13</li>
                <li>It's still used today in puzzles and games!</li>
              </ul>
            </section>

            <section>
              <h2 className="section-title">Is It Secure? </h2>
              <p style={{ marginBottom: '1rem' }}>
                Well... not really!  Here's why:
              </p>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
                <li>There are only 25 possible keys</li>
                <li>Someone could try all keys quickly (brute force)</li>
                <li>Letter patterns stay the same</li>
              </ul>
              <p>
                But don't worry! This is just the beginning of our crypto journey. More secure methods are coming up! 
                For now, have fun playing with this historical cipher! 
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaesarCipherTool;
