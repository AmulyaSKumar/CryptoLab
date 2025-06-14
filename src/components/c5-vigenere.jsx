import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VigenereCipher = () => {
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
  const navigate =useNavigate();

  const vigenere = (text, key, decrypt = false) => {
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

  const handleCompute = () => {
    if (!input.trim() || !key.trim()) return;
    const result = vigenere(input, key, mode === 'decrypt');
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

  const generateRandomKey = (length) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array(length).fill()
      .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
      .join('');
  };

  const handleGenerateKey = () => {
    const cleanInput = input.toUpperCase().replace(/[^A-Z]/g, '');
    console.log("Vigenere Input:", input, "CleanInput:", cleanInput);
    if (cleanInput.length === 0) {
      alert('Please enter some text first!');
      return;
    }
    const newKey = generateRandomKey(cleanInput.length);
    console.log("Vigenere Generated Key:", newKey);
    setKey(newKey);
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
        <h1 className="tool-title">Vigenère Cipher</h1>

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
            onClick={() => navigate('/c-vigenere')}
          >
            Try Challenge
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/q-vigenere')}
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
                <label>Keyword</label>
                <button
                  onClick={handleGenerateKey}
                  className="nav-button secondary"
                  style={{ padding: '4px 8px', minWidth: 'auto', marginTop: '0' }}
                >
                  Generate Random Key
                </button>
              </div>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter keyword..."
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
                      Step 2: Apply Vigenère {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
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
              <h2 className="section-title">Hi there! ^_^</h2>
              <p>
                Ready to learn about the "unbreakable cipher"? Well, that's what they called the Vigenère cipher 
                for nearly 300 years! Let me tell you why it was so special... :D
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">What Makes It Special? o.O</h2>
              <p>
                Remember the Caesar cipher? It was pretty cool, but it had one big problem - every letter 
                was shifted by the same amount. The Vigenère cipher fixed that by using a keyword to shift 
                each letter differently. Sneaky, right? ;)
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Let's See How It Works! :D</h2>
              <p style={{ marginBottom: '1rem' }}>
                Instead of using just one number to shift letters, we use a whole word! Each letter in 
                that word tells us how much to shift. Let's try an example:
              </p>
              <div className="result-box" style={{ padding: '1rem', marginBottom: '1rem' }}>
                Message: HELLO<br/>
                Keyword: KEY (we repeat it: KEYK)<br/>
                H + K (shift by 10) = R<br/>
                E + E (shift by 4) = I<br/>
                L + Y (shift by 24) = J<br/>
                L + K (shift by 10) = V<br/>
                O + E (shift by 4) = S<br/>
                Result: RIJVS
              </div>
              <p>
                See what happened? Each letter got its own special shift! Much trickier to crack than 
                Caesar's cipher. B-)
              </p>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Pro Tips! ;)</h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>Pick a keyword that's easy to remember but hard to guess</li>
                <li>Longer keywords are usually better</li>
                <li>Avoid using the same keyword twice</li>
                <li>Keep your keyword secret! That's your key to the castle :P</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="section-title">Fun History Time! :O</h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>Named after Blaise de Vigenère (though he didn't invent it... oops! ^^')</li>
                <li>Was actually created by Giovan Battista Bellaso in 1553</li>
                <li>People called it "le chiffre indéchiffrable" (the unbreakable cipher)</li>
                <li>Took 300 years before someone figured out how to break it! O_O</li>
              </ul>
            </section>

            <section>
              <h2 className="section-title">Is It Really Unbreakable? :/</h2>
              <p style={{ marginBottom: '1rem' }}>
                Well... not anymore. Here's why:
              </p>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
                <li>The keyword eventually repeats (that's a clue for codebreakers)</li>
                <li>Smart people found patterns in the repetitions</li>
                <li>Modern computers can try many possibilities very quickly</li>
              </ul>
              <p>
                But hey, it's still WAY better than the Caesar cipher! And it's super fun to use. 
                Ready to try it yourself? Head back to the tool and give it a shot! ^_^
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default VigenereCipher;
