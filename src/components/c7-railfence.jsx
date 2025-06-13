import React, { useState, useRef } from 'react';
import { Link,useNavigate } from 'react-router-dom';

const RailFenceCipher = () => {
  const [input, setInput] = useState('');
  const [rails, setRails] = useState(3);
  const [mode, setMode] = useState('encrypt');
  const [output, setOutput] = useState('');
  const [steps, setSteps] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tool');
  const [isReading, setIsReading] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const navigate = useNavigate();
  const railFence = (str, rails, decrypt = false) => {
    if (!str || rails < 2) return { fence: [], result: '', steps: [] };
    
    const fence = Array(rails).fill().map(() => Array(str.length).fill(''));
    let rail = 0;
    let dir = 1;
    const steps = [];

    if (!decrypt) {
      // Encryption
      const pattern = [];
      for (let i = 0; i < str.length; i++) {
        fence[rail][i] = str[i];
        pattern.push({ rail, pos: i, char: str[i] });
        rail += dir;
        if (rail === rails - 1 || rail === 0) dir *= -1;
      }
      
      const result = fence.map(row => row.filter(char => char !== '').join('')).join('');
      steps.push({
        type: 'pattern',
        fence: JSON.parse(JSON.stringify(fence)),
        description: 'Writing text in zigzag pattern'
      });
      
      steps.push({
        type: 'reading',
        fence: JSON.parse(JSON.stringify(fence)),
        result,
        description: 'Reading text row by row'
      });

      return { fence, result, steps, pattern };
    } else {
      // Decryption
      // First, mark the pattern
      const pattern = [];
      for (let i = 0; i < str.length; i++) {
        fence[rail][i] = '*';
        pattern.push({ rail, pos: i });
        rail += dir;
        if (rail === rails - 1 || rail === 0) dir *= -1;
      }
      
      steps.push({
        type: 'pattern',
        fence: JSON.parse(JSON.stringify(fence)),
        description: 'Marking zigzag pattern'
      });
      
      // Fill in the letters
      let index = 0;
      for (let i = 0; i < rails; i++) {
        for (let j = 0; j < str.length; j++) {
          if (fence[i][j] === '*' && index < str.length) {
            fence[i][j] = str[index++];
          }
        }
      }
      
      steps.push({
        type: 'filling',
        fence: JSON.parse(JSON.stringify(fence)),
        description: 'Filling in the letters'
      });
      
      // Read off the decrypted message
      rail = 0;
      dir = 1;
      let result = '';
      for (let i = 0; i < str.length; i++) {
        result += fence[rail][i];
        rail += dir;
        if (rail === rails - 1 || rail === 0) dir *= -1;
      }
      
      steps.push({
        type: 'reading',
        fence: JSON.parse(JSON.stringify(fence)),
        result,
        description: 'Reading text in zigzag pattern'
      });
      
      return { fence, result, steps, pattern };
    }
  };

  const handleCompute = () => {
    if (!input.trim()) return;
    const { result, steps } = railFence(input, rails, mode === 'decrypt');
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
        <h1 className="tool-title">Rail Fence Cipher</h1>

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
          <button
      className="nav-button"
      style={{ marginTop: '1rem', display: 'inline-block' ,minWidth: '120px'}}
      onClick={() => navigate('/c-railfence')}
    >
      Try Challenge
    </button><button
      className="nav-button"
      style={{ marginTop: '1rem', display: 'inline-block' ,minWidth: '120px'}}
      onClick={() => navigate('/q-railfence')}
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
              <label>Number of Rails: {rails}</label>
              <input
                type="range"
                min="2"
                max="10"
                value={rails}
                onChange={(e) => setRails(Number(e.target.value))}
                style={{ accentColor: 'var(--primary-color)' }}
              />
            </div>

            {/* Replace dropdown with toggle switch */}
            <div className="input-group" style={{ display: 'flex', justifyContent: 'center' }}>
              <label className="toggle-switch">
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
                  {steps.map((step, index) => (
                    <div key={index} className="step">
                      <div className="step-title">Step {index + 1}: {step.description}</div>
                      <div className="step-content" style={{ fontFamily: 'monospace' }}>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          {step.fence.map((row, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              {row.map((char, j) => (
                                <div
                                  key={j}
                                  className="char-box"
                                  style={{
                                    opacity: char === '' ? 0.3 : 1,
                                    border: char === '*' ? '2px dashed var(--primary-color)' : undefined
                                  }}
                                >
                                  {char === '*' ? '' : char}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        {step.result && (
                          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            Result: <strong>{step.result}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
              <h2 className="section-title">Welcome to the Rail Fence! ^_^</h2>
              <p>
                Ever tried writing a message in a zigzag pattern? That's exactly what we're going to do here! 
                The Rail Fence cipher is like sending your message on a roller coaster ride. Sounds fun? 
                Let's dive in! :D
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">How Does It Work? o.O</h2>
              <p style={{ marginBottom: '1rem' }}>
                Instead of shifting letters like other ciphers, we're going to write our message in a special zigzag pattern, 
                like this:
              </p>
              <div className="result-box" style={{ padding: '1rem', marginBottom: '1rem', fontFamily: 'monospace' }}>
                Message: HELLO WORLD<br/>
                With 3 rails:<br/>
                H . . . O . . . R . .<br/>
                . E . L . W . L . D .<br/>
                . . L . . . O . . . .<br/>
                Then read row by row: HORELWLDLO
              </div>
              <p>
                See how the letters go up and down? It's like they're playing on a fence! :P
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Cool Things to Know! :D</h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>More rails = more zigzags = more scrambled message</li>
                <li>No special keys needed - just remember the number of rails</li>
                <li>Works with any language (but spaces might disappear)</li>
                <li>It's super fast to encrypt and decrypt! ^_^</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Fun Facts! :O</h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>Used during the American Civil War</li>
                <li>One of the simplest transposition ciphers</li>
                <li>Named after the zigzag pattern that looks like a rail fence</li>
                <li>Sometimes called "zigzag cipher" too! ;)</li>
              </ul>
            </section>

            <section>
              <h2 className="section-title">But Is It Safe? :/</h2>
              <p style={{ marginBottom: '1rem' }}>
                Well... let's be honest here:
              </p>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
                <li>Not many rail options (usually 2-10 rails are practical)</li>
                <li>Pattern is pretty easy to spot</li>
                <li>Computer can try all possibilities in seconds</li>
                <li>Better for fun than serious secrets ^^'</li>
              </ul>
              <p>
                But hey, it's super fun to use and perfect for learning about transposition ciphers! 
                Want to try it out? Head back to the tool and watch your message zigzag! \o/
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default RailFenceCipher;
