import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const VigenereCipher = () => {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tool');
  const [isReading, setIsReading] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);

  const vigenere = (text, key, decrypt = false) => {
    if (!text || !key) return '';
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    text = text.toUpperCase();
    key = key.toUpperCase();
    
    let result = '';
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
        
        result += alphabet[newIndex];
        keyIndex++;
      } else {
        result += char;
      }
    }
    
    return result;
  };

  const handleCompute = () => {
    if (!input.trim() || !key.trim()) return;
    const result = vigenere(input, key, mode === 'decrypt');
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
        <h1 className="tool-title">Vigenère Cipher</h1>

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
              <label>Keyword</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter keyword..."
              />
              <div className="result-box" style={{ marginTop: '0.5rem', padding: '0.5rem' }}>
                Example with key "{key || 'KEY'}": <br/>
                A → {vigenere('A', key || 'KEY')} | 
                B → {vigenere('B', key || 'KEY')} | 
                C → {vigenere('C', key || 'KEY')}
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
