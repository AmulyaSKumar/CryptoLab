import React, { useState, useRef } from 'react';
import { Link , useNavigate } from 'react-router-dom';

const VernamCipherTool = () => {
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
  const cleanText = (text) =>
    text.toUpperCase().replace(/[^A-Z]/g, '');
  // Generate random key same length as input
  const generateKey = (length) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array(length).fill()
      .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
      .join('');
  };

  // Convert letter to 0-25 number
  const charToNum = (c) => c.charCodeAt(0) - 65;
  // Convert number to letter A-Z
  const numToChar = (n) => String.fromCharCode(n + 65);

  // Vernam encryption/decryption (same function)
  // XOR numeric values mod 26
  const vernam = (text, key) => {
    const steps = [];
    const textNums = text.split('').map(charToNum);
    const keyNums = key.split('').map(charToNum);

    let result = '';

    for (let i = 0; i < textNums.length; i++) {
      const textNum = textNums[i];
      const keyNum = keyNums[i];
      const xorNum = textNum ^ keyNum; // XOR operation

      steps.push({
        index: i,
        char: text[i],
        charNum: textNum,
        keyChar: key[i],
        keyNum: keyNum,
        xorNum: xorNum,
        resultChar: numToChar(xorNum),
        process: `${text[i]} (${textNum}) XOR ${key[i]} (${keyNum}) = ${numToChar(xorNum)} (${xorNum})`
      });

      result += numToChar(xorNum);
    }

    return { result, steps };
  };

  const handleGenerateKey = () => {
    if (!input.trim()) {
      alert('Please enter some text first!');
      return;
    }
    const cleaned = cleanText(input);
    console.log("Vernam Input:", input, "Cleaned:", cleaned);
    const genKey = generateKey(cleaned.length);
    console.log("Vernam Generated Key:", genKey);
    setKey(genKey);
  };

  const handleCompute = () => {
    if (!input.trim()) return alert('Please enter some text!');
    const cleanedInput = cleanText(input);
    const cleanedKey = cleanText(key);

    if (cleanedKey.length !== cleanedInput.length) {
      alert('Key length must match input length!');
      return;
    }

    const { result, steps } = vernam(cleanedInput, cleanedKey);
    setSteps(steps);
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
        <h1 className="tool-title">Vernam Cipher</h1>

        {/* Tabs */}
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
            onClick={() => navigate('/c-vernam')}
          >
            Try Challenge
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/q-vernam')}
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
                placeholder="Type your message here (letters only)..."
                rows="3"
              />
              <small style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>
                Only letters A-Z will be used; spaces and symbols ignored.
              </small>
            </div>

            <div className="input-group" style={{ position: 'relative' }}>
              <label>Enter Key</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                placeholder="Key (same length as text)"
              />
              <button
                onClick={handleGenerateKey}
                className="nav-button"
                style={{ position: 'absolute', right: '0.5rem', top: '2.5rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                title="Generate Random Key"
              >
                Generate Key
              </button>
            </div>

            <div className="input-group" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <label className="toggle-switch ">
                <input
                  type="checkbox"
                  checked={mode === 'decrypt'}
                  onChange={(e) => setMode(e.target.checked ? 'decrypt' : 'encrypt')}
                />
                <span className="toggle-slider">
                  <span className={`toggle-label ${mode === 'encrypt' ? 'active' : ''}`}>Encrypt</span>
                  <span className={`toggle-label ${mode === 'decrypt' ? 'active' : ''}`}>Decrypt</span>
                </span>
              </label>
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
                <div className="visualization-steps" style={{ marginTop: '2rem' }}>
                  <div className="step">
                    <div className="step-title">Step 1: Input Text & Key</div>
                    <div className="step-content" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {steps.map((step, i) => (
                        <div key={i} className="char-box" data-index={i} title={`Text: ${step.char}, Key: ${step.keyChar}`}>
                          {step.char}
                        </div>
                      ))}
                    </div>
                    <div className="step-content" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {steps.map((step, i) => (
                        <div key={i} className="char-box key" data-index={i} title={`Key: ${step.keyChar}`}>
                          {step.keyChar}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step" style={{ marginTop: '1rem' }}>
                    <div className="step-title">
                      Step 2: XOR Operation for Each Character
                    </div>
                    <div className="step-content" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {steps.map((step, i) => (
                        <div key={i} style={{ textAlign: 'center', fontSize: '0.75rem' }}>
                          <div className="char-box" data-index={i}>
                            {step.char}
                          </div>
                          <div className="arrow-down">↓</div>
                          <div className="char-box key" data-index={i}>
                            {step.keyChar}
                          </div>
                          <div className="arrow-equal">=</div>
                          <div className="char-box result" data-index={i}>
                            {step.resultChar}
                          </div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-color)', marginTop: '0.25rem' }}>
                            {step.process}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step" style={{ marginTop: '1rem' }}>
                    <div className="step-title">Final Result</div>
                    <div className="step-content" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {steps.map((step, i) => (
                        <div key={i} className="char-box result" data-index={i}>
                          {step.resultChar}
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
                  <div className="result-box" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                    {output}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="about-content" style={{ lineHeight: 1.5 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                onClick={() => readContent(document.querySelector('.about-content').textContent)}
                className={`speaker-button ${isReading ? 'active' : ''}`}
                title={isReading ? 'Stop Reading' : 'Read Content'}
              >
                {isReading ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={24} height={24}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={24} height={24}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l5.7-4.8v15.4L6.5 15.2H3a1 1 0 01-1-1v-4.4a1 1 0 011-1h3.5z" />
                  </svg>
                )}
              </button>
            </div>

            <section className="mb-8">
              <h2 className="section-title">Hey! Let's talk Vernam Cipher 😊</h2>
              <p>
                So you want to send a secret message with a magic key, huh? Vernam cipher is a super cool way to do just that! Think of it like a secret handshake between you and your friend, where only you two know the moves.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">How does it work?</h2>
              <p>
                It’s like a letter-by-letter secret code — each letter of your message is combined with a letter from a secret key, and voila! You get a mysterious scrambled message.
              </p>
              <p>
                The neat part? If you use the exact same key again, you can turn the scrambled message back into the original message. It’s like magic!
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Quick tips to get started:</h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>Your key needs to be exactly the same length as your message.</li>
                <li>The key should be random letters — the more random, the better!</li>
                <li>Spaces and symbols aren’t used here — just letters.</li>
                <li>You can generate a random key right from the tool — handy, right?</li>
              </ul>
            </section>

            <section>
              <h2 className="section-title">Try it out!</h2>
              <p>Type your secret message and generate a key, then encrypt or decrypt your message. Easy peasy.</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default VernamCipherTool;
