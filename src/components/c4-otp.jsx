import React, { useState, useRef } from 'react';
import { Link ,useNavigate } from 'react-router-dom';

const OneTimePad = () => {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [output, setOutput] = useState('');
  const [steps, setSteps] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tool');
  const [isReading, setIsReading] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const navigate = useNavigate();
  const generateRandomKey = (length) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array(length).fill()
      .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
      .join('');
  };

  const otp = (text, key, decrypt = false) => {
    if (!text || !key) return [];
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    text = text.toUpperCase();
    key = key.toUpperCase();
    
    const result = [];
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (alphabet.includes(char)) {
        const textIndex = alphabet.indexOf(char);
        const keyChar = key[keyIndex % key.length];
        const keyValue = alphabet.indexOf(keyChar);
        
        let newIndex;
        if (decrypt) {
          newIndex = (textIndex - keyValue + 26) % 26;
        } else {
          newIndex = (textIndex + keyValue) % 26;
        }
        
        result.push({
          char,
          keyChar,
          textIndex,
          keyValue,
          newIndex,
          shifted: alphabet[newIndex],
          process: `${char}(${textIndex}) ${decrypt ? '-' : '+'} ${keyChar}(${keyValue}) = ${newIndex} → ${alphabet[newIndex]}`
        });
        keyIndex++;
      } else {
        result.push({
          char,
          keyChar: '',
          textIndex: -1,
          keyValue: -1,
          newIndex: -1,
          shifted: char,
          process: 'Not a letter'
        });
      }
    }
    
    return result;
  };

  const handleGenerateKey = () => {
    // Clean the input first to get only alphabetic characters
    const cleanInput = input.toUpperCase().replace(/[^A-Z]/g, '');
    console.log("Input:", input, "CleanInput:", cleanInput);
    if (cleanInput.length === 0) {
      alert('Please enter some text first!');
      return;
    }
    const newKey = generateRandomKey(cleanInput.length);
    console.log("Generated Key:", newKey);
    setKey(newKey);
  };

  const handleCompute = () => {
    if (!input.trim() || !key.trim()) return;
    const result = otp(input, key, mode === 'decrypt');
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
  }, [speechSynthesis]);

  return (
    <div className="main-container">
     <div className="back-nav">
        <Link to="/" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">One Time Pad</h1>

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
            onClick={() => navigate('/c-otp')}
          >
            Try Challenge
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/q-otp')}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>Key</label>
               
              </div>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter or generate key..."
              />
            </div>

            {/* Mode Selection - BYOC Style Toggle */}
<div className="input-group">
  <label>Operation Mode</label>
  <div className="toggle-container" style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '0.5rem', 
    marginTop: '0.5rem',
    background: '#e2e8f0',
    padding: '0.25rem',
    borderRadius: '8px',
    maxWidth: '300px',
    margin: '0.5rem auto'
  }}>
    <label className="toggle-switch" style={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem 1rem',
      backgroundColor: mode === 'encrypt' ? 'var(--primary-color)' : 'transparent',
      color: mode === 'encrypt' ? 'white' : 'var(--text-color)',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      flex: '1',
      fontWeight: mode === 'encrypt' ? 'bold' : 'normal',
      boxShadow: mode === 'encrypt' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
    }}>
      <input
        type="radio"
        name="mode"
        checked={mode === 'encrypt'}
        onChange={() => setMode('encrypt')}
        style={{ display: 'none' }}
      />
      <span className="toggle-label">Encrypt</span>
    </label>
    <label className="toggle-switch" style={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem 1rem',
      backgroundColor: mode === 'decrypt' ? 'var(--primary-color)' : 'transparent',
      color: mode === 'decrypt' ? 'white' : 'var(--text-color)',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      flex: '1',
      fontWeight: mode === 'decrypt' ? 'bold' : 'normal',
      boxShadow: mode === 'decrypt' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
    }}>
      <input
        type="radio"
        name="mode"
        checked={mode === 'decrypt'}
        onChange={() => setMode('decrypt')}
        style={{ display: 'none' }}
      />
      <span className="toggle-label">Decrypt</span>
    </label>
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
                    <div className="step-title">Step 1: Input Text and Key</div>
                    <div className="step-content">
                      {steps.map((step, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div className="char-box" data-index={i}>
                            {step.char}
                          </div>
                          {step.keyChar && (
                            <>
                              <div className="arrow-down">+</div>
                              <div className="char-box">
                                {step.keyChar}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step">
                    <div className="step-title">
                      Step 2: Apply One Time Pad {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
                    </div>
                    <div className="step-content">
                      {steps.map((step, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="char-box">
                              {step.char}
                            </div>
                            {step.keyChar && (
                              <>
                                <div className="arrow-down">↓</div>
                                <div className="char-box">
                                  {step.shifted}
                                </div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-color)', maxWidth: '150px', wordBreak: 'break-word' }}>
                                  {step.process}
                                </div>
                              </>
                            )}
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
              <h2 className="section-title">The Ultimate Secret Keeper! </h2>
              <p>
                Welcome to the One Time Pad - the only cipher that's mathematically proven to be unbreakable! 
                Yes, you heard that right! When used correctly, it's impossible to crack. How cool is that?
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">The Perfect Secret Recipe </h2>
              <p style={{ marginBottom: '1rem' }}>
                Think of it like making a secret recipe. You need:
              </p>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
                <li>A message you want to keep secret</li>
                <li>A random key that's as long as your message</li>
                <li>A promise to never, ever reuse that key </li>
              </ul>
              <p>
                Mix these ingredients together, and voila! You've got an unbreakable secret!
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Let's See How It Works! </h2>
              <p style={{ marginBottom: '1rem' }}>
                Here's a simple example:
              </p>
              <div className="result-box" style={{ padding: '1rem', marginBottom: '1rem' }}>
                Message: HELLO<br/>
                Random Key: XMCKL<br/>
                For each letter:<br/>
                H + X = E (7 + 23 = 30, wrap to 4)<br/>
                E + M = Q (4 + 12 = 16)<br/>
                L + C = N (11 + 2 = 13)<br/>
                L + K = V (11 + 10 = 21)<br/>
                O + L = Z (14 + 11 = 25)<br/>
                Result: EQNVZ
              </div>
              <p>
                Each letter gets its own unique shift! No patterns to find here! 
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Fun History Time! </h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>Invented in 1917 by Gilbert Vernam and Joseph Mauborgne</li>
                <li>Used for super-secret spy messages during World War II</li>
                <li>Still used today for the most sensitive communications</li>
                <li>The only cipher that's proven to be mathematically unbreakable! </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="section-title">The Rules of Perfect Secrecy </h2>
              <p>
                But wait! There's a catch. For the One Time Pad to be truly unbreakable, you MUST follow these rules:
              </p>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>The key must be truly random (no using your birthday! )</li>
                <li>The key must be at least as long as the message</li>
                <li>Never, ever, EVER reuse a key (that's why it's called "one time")</li>
                <li>Keep your key super secret (don't share it on social media )</li>
              </ul>
            </section>

            <section>
              <h2 className="section-title">Why Don't We Use It Everywhere? </h2>
              <p style={{ marginBottom: '1rem' }}>
                If it's unbreakable, why isn't everyone using it? Well...
              </p>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
                <li>Making truly random keys is harder than you think</li>
                <li>Sharing long keys securely is a big challenge</li>
                <li>You need a lot of keys for lots of messages</li>
                <li>One tiny mistake can ruin the perfect security</li>
              </ul>
              <p>
                But for those special times when you need absolute security, nothing beats the One Time Pad! 
                Ready to try it yourself? Head back to the tool and create some unbreakable secrets! 
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default OneTimePad;
