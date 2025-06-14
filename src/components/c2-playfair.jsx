import React, { useState, useRef } from 'react'; 
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PlayfairCipherTool = () => {
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

  // Playfair Cipher helper functions
  const generateMatrix = (keyStr) => {
    // Normalize: uppercase, remove J, remove duplicates
    let keyString = keyStr.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let matrix = [];
    let used = new Set();
    for (const ch of keyString) {
      if (!used.has(ch)) {
        matrix.push(ch);
        used.add(ch);
      }
    }
    for (let i = 0; i < 26; i++) {
      const ch = String.fromCharCode(65 + i);
      if (ch === 'J') continue;
      if (!used.has(ch)) {
        matrix.push(ch);
        used.add(ch);
      }
    }
    // Convert to 5x5 matrix
    let result = [];
    for (let i = 0; i < 5; i++) {
      result.push(matrix.slice(i * 5, i * 5 + 5));
    }
    return result;
  };

  const findPosition = (matrix, char) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (matrix[r][c] === char) return [r, c];
      }
    }
    return null;
  };

  const preprocessInput = (text) => {
    // Uppercase, remove non-letters, replace J with I
    let str = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let pairs = [];
    for (let i = 0; i < str.length; i += 2) {
      let first = str[i];
      let second = str[i + 1] || 'X';
      if (first === second) {
        pairs.push([first, 'X']);
        i--; // recheck second letter on next iteration
      } else {
        pairs.push([first, second]);
      }
    }
    return pairs;
  };

  const playfairEncrypt = (text, keyStr) => {
    if (!keyStr.trim()) return [];
    const matrix = generateMatrix(keyStr);
    const pairs = preprocessInput(text);
    const steps = [];
    let result = '';

    pairs.forEach(([a, b], i) => {
      const [r1, c1] = findPosition(matrix, a);
      const [r2, c2] = findPosition(matrix, b);
      let encryptedPair = ['', ''];
      let processDesc = '';

      if (r1 === r2) {
        // same row: shift right
        encryptedPair[0] = matrix[r1][(c1 + (mode === 'encrypt' ? 1 : 4)) % 5];
        encryptedPair[1] = matrix[r2][(c2 + (mode === 'encrypt' ? 1 : 4)) % 5];
        processDesc = `Same row: shift ${mode === 'encrypt' ? 'right' : 'left'}`;
      } else if (c1 === c2) {
        // same column: shift down
        encryptedPair[0] = matrix[(r1 + (mode === 'encrypt' ? 1 : 4)) % 5][c1];
        encryptedPair[1] = matrix[(r2 + (mode === 'encrypt' ? 1 : 4)) % 5][c2];
        processDesc = `Same column: shift ${mode === 'encrypt' ? 'down' : 'up'}`;
      } else {
        // rectangle swap
        encryptedPair[0] = matrix[r1][c2];
        encryptedPair[1] = matrix[r2][c1];
        processDesc = 'Rectangle swap';
      }

      steps.push({
        pair: [a, b],
        positions: [[r1, c1], [r2, c2]],
        encrypted: encryptedPair,
        process: processDesc
      });
      result += encryptedPair.join('');
    });

    return { steps, result, matrix };
  };

  const cleanDecryptedText = (text) => {
    // Remove 'X' between repeated letters: e.g. "LXL" => "LL"
    let result = '';
    for (let i = 0; i < text.length; i++) {
      if (
        i > 0 &&
        i < text.length - 1 &&
        text[i] === 'X' &&
        text[i - 1] === text[i + 1]
      ) {
        // Skip this 'X'
        continue;
      }
      result += text[i];
    }
  
    // Remove trailing 'X' if it was padding
    if (result.endsWith('X')) {
      result = result.slice(0, -1);
    }
  
    return result;
  };
  
  const handleCompute = () => {
    if (!input.trim()) return;
    if (!key.trim()) {
      alert('Please enter a key or generate one!');
      return;
    }
    const { steps, result, matrix } = playfairEncrypt(input, key);
  
    let finalResult = result;
    if (mode === 'decrypt') {
      finalResult = cleanDecryptedText(result);
    }
  
    setSteps(steps);
    setOutput(finalResult);
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

  const generateDefaultKey = () => {
    if (!key.trim()) setKey('MONARCHY');
  };

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
        <h1 className="tool-title">Playfair Cipher</h1>

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
            onClick={() => navigate('/c-playfair')}
          >
            Try Challenge
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/q-playfair')}
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

            <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ flexShrink: 0 }}>Key</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="Enter key (e.g., MONARCHY)"
                style={{ flexGrow: 1, textTransform: 'uppercase' }}
              />
              <button
                onClick={generateDefaultKey}
                className="nav-button"
                style={{ minWidth: '130px', padding: '0.5rem 1rem' }}
              >
                Generate Key
              </button>
            </div>

            <div className="input-group" style={{ display: 'flex', justifyContent: 'center' }}>
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
                <div className="visualization-steps">
                  <div className="step">
                    <div className="step-title">Step 1: Input Pairs</div>
                    <div className="step-content" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {steps.map((step, i) => (
                        <div key={i} className="char-box" data-index={i}>
                          {step.pair[0]}{step.pair[1]}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step">
                    <div className="step-title">Step 2: Apply Playfair Rules ({mode === 'encrypt' ? 'Encrypt' : 'Decrypt'})</div>
                    <div className="step-content" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      {steps.map((step, i) => (
                        <div key={i} style={{ textAlign: 'center', minWidth: '70px' }}>
                          <div className="char-box" data-index={i}>
                            {step.pair[0]}{step.pair[1]}
                          </div>
                          <div className="arrow-down">↓</div>
                          <div className="char-box">
                            {step.encrypted[0]}{step.encrypted[1]}
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
                    <div className="step-content" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {steps.map((step, i) => (
                        <div key={i} className="char-box" data-index={i}>
                          {step.encrypted[0]}{step.encrypted[1]}
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
                So, you wanna play with the Playfair cipher? Awesome! It's a fun way to hide your messages using a secret key. 
                Think of it like a cool puzzle where letters team up in pairs to confuse anyone snooping around.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">How Does It Work? </h2>
              <p>
                Alright, here’s the gist: you take your secret key (like a password), and use it to make a 5x5 letter grid. 
                Then, you split your message into pairs of letters — if two letters are the same, you sneak in an 'X' to keep things tricky. 
                Each pair is then encrypted based on where the letters sit in the grid. It’s kinda like a secret handshake for letters!
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Wanna Try It? </h2>
              <p>
                Just type your message, add a key (or hit that Generate Key button for a classic one like "MONARCHY"), and hit encrypt! 
                To decrypt, just flip the mode — easy peasy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Why Use Playfair? </h2>
              <p>
                Back in the day, it was a huge step up from simple letter shifting ciphers because it hides pairs of letters instead of singles — 
                making it harder for code-breakers. It was even used by armies and spies!
              </p>
            </section>

            <section>
              <h2 className="section-title">Heads up! </h2>
              <p>
                While it’s cooler than Caesar cipher, it’s not unbreakable. Smart folks can still crack it, but hey, it’s a great intro to crypto fun! 
                So, enjoy playing around and learning some neat tricks!
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayfairCipherTool;
