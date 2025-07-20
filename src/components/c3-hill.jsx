import React, { useState, useRef, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';

const HillCipherTool = () => {
  const [input, setInput] = useState('');
  const [keyMatrix, setKeyMatrix] = useState([
    [3, 3],
    [2, 5],
  ]);
  const [mode, setMode] = useState('encrypt');
  const [output, setOutput] = useState('');
  const [steps, setSteps] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tool');
  const [isReading, setIsReading] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const navigate = useNavigate();

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const mod = (n, m) => ((n % m) + m) % m;

  const textToNumbers = (text) =>
    text
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('')
      .map((char) => alphabet.indexOf(char));

  const numbersToText = (numbers) =>
    numbers.map((num) => alphabet[mod(num, 26)]).join('');

  const multiplyMatrix = (matrix, vector) => {
    return matrix.map((row) =>
      row.reduce((sum, val, idx) => sum + val * vector[idx], 0)
    );
  };

  const determinant = (matrix) =>
    matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  const modInverse = (a, m) => {
    a = mod(a, m);
    for (let x = 1; x < m; x++) {
      if (mod(a * x, m) === 1) return x;
    }
    return null;
  };

  const inverseMatrix = (matrix) => {
    const det = determinant(matrix);
    const detInv = modInverse(det, 26);
    if (detInv === null) return null;

    const invMatrix = [
      [matrix[1][1], -matrix[0][1]],
      [-matrix[1][0], matrix[0][0]],
    ];

    return invMatrix.map((row) =>
      row.map((val) => mod(val * detInv, 26))
    );
  };

  const handleCompute = () => {
    if (!input.trim()) return;

    const cleanInput = input.toUpperCase().replace(/[^A-Z]/g, '');
    const blockSize = 2;
    let paddedInput = cleanInput;
    if (paddedInput.length % blockSize !== 0) {
      paddedInput += 'X';
    }

    const inputNumbers = textToNumbers(paddedInput);
    const result = [];
    const stepDetails = [];

    const matrix =
      mode === 'encrypt'
        ? keyMatrix
        : inverseMatrix(keyMatrix);

    if (!matrix) {
      setOutput('Invalid key matrix (non-invertible)');
      setSteps([]);
      return;
    }

    for (let i = 0; i < inputNumbers.length; i += blockSize) {
      const block = inputNumbers.slice(i, i + blockSize);
      const multiplied = multiplyMatrix(matrix, block);
      const modded = multiplied.map((num) => mod(num, 26));
      result.push(...modded);

      stepDetails.push({
        block: block.map((num) => alphabet[num]).join(''),
        numbers: block,
        multiplied,
        modded,
        result: modded.map((num) => alphabet[num]).join(''),
      });
    }

    setOutput(numbersToText(result));
    setSteps(stepDetails);
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

  useEffect(() => {
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
        <h1 className="tool-title">Hill Cipher</h1>

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
            onClick={() => navigate('/c-hill')}
          >
            Try Challenge
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/q-hill')}
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
              <label>Key Matrix (2x2)</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {keyMatrix.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    {row.map((val, colIndex) => (
                      <input
                        key={colIndex}
                        type="number"
                        value={val}
                        onChange={(e) => {
                          const newMatrix = [...keyMatrix];
                          newMatrix[rowIndex][colIndex] = parseInt(e.target.value) || 0;
                          setKeyMatrix(newMatrix);
                        }}
                        style={{ width: '50px', marginRight: '0.5rem' }}
                      />
                    ))}
                  </div>
                ))}
              </div>
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
                  {steps.map((step, index) => (
                    <div className="step" key={index}>
                      <div className="step-title">Block: {step.block}</div>
                      <div className="step-content">
                        <p>Numeric: {step.numbers.join(', ')}</p>
                        <p>Multiplied: {step.multiplied.join(', ')}</p>
                        <p>Mod 26: {step.modded.join(', ')}</p>
                        <p>Result: {step.result}</p>
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
              <h2 className="section-title">Hey there!</h2>
              <p>
                Welcome to the Hill Cipher. If you're wondering what this is, don't worry—you're in the right place.
                It's a cool way of hiding a message using math. Sounds scary? It's not. I'll walk you through it.
              </p>
            </section>
          
            <section className="mb-8">
              <h2 className="section-title">What's the big idea?</h2>
              <p>
                Unlike simple ciphers that deal with one letter at a time, the Hill Cipher works on blocks of letters.
                It takes a bunch of letters, turns them into numbers, does some fancy math (matrix multiplication),
                and gives you a jumbled version. To someone else, it just looks like nonsense.
              </p>
            </section>
          
            <section className="mb-8">
              <h2 className="section-title">Can you give me an example?</h2>
              <p>
                Sure. Let’s say your message is <strong>"HI"</strong>. First, we turn that into numbers:
              </p>
              <div className="result-box" style={{ padding: '1rem', marginBottom: '1rem' }}>
                H → 7<br />
                I → 8
              </div>
              <p>
                Then we pick a secret key, which is a small matrix—just a tiny square of numbers. Like this:
              </p>
              <div className="result-box" style={{ padding: '1rem', marginBottom: '1rem' }}>
                [2 4]<br />
                [5 9]
              </div>
              <p>
                Now we multiply those numbers. Don't worry, the tool does all that for you. The result will be two new numbers, and those get turned into letters. Boom—your message is now scrambled!
              </p>
            </section>
          
            <section className="mb-8">
              <h2 className="section-title">So how do I get the message back?</h2>
              <p>
                Good question. You just use the inverse of that matrix (a math way of undoing the process) to turn
                the scrambled text back into the original. Again, don’t worry—the tool handles that for you. You just click decrypt.
              </p>
            </section>
          
            <section className="mb-8">
              <h2 className="section-title">A few quick notes</h2>
              <ul style={{ marginLeft: '1.5rem', listStyle: 'disc' }}>
                <li>The message is split into chunks depending on the matrix size. If the message is too short, we add filler letters like X.</li>
                <li>Your key matrix has to be “invertible” in mod 26. That just means we can undo it later. If it’s not, we’ll let you know.</li>
                <li>This cipher is more complex than Caesar but still easy to break with a computer. It’s a great learning tool, though!</li>
              </ul>
            </section>
          
            <section>
              <h2 className="section-title">Want to give it a try?</h2>
              <p>
                Pop a short message into the tool, pick a key matrix (or use the default one), and click Encrypt. You’ll see the steps and
                how everything transforms. It’s like watching magic happen, except it’s just math in disguise.
              </p>
            </section>
          </div>          
        )}
      </div>
    </div>
  );
};

export default HillCipherTool;
