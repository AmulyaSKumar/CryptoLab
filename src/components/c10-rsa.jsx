import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const primeList = [
  61, 53, 47, 43, 41, 37, 31, 29, 23, 19, 17, 13, 11, 7, 5, 3, 2
];

const RSAVisualizer = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [p, setP] = useState(61);
  const [q, setQ] = useState(53);
  const [e, setE] = useState(17);
  const [n, setN] = useState(null);
  const [phi, setPhi] = useState(null);
  const [d, setD] = useState(null);
  const [output, setOutput] = useState('');
  const [steps, setSteps] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tool');
  const navigate =useNavigate();
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const [isReading, setIsReading] = useState(false);

  // Greatest Common Divisor (Euclid's Algorithm)
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  // Extended Euclidean Algorithm for Modular Inverse
  const modInverse = (e, phi) => {
    let [a, b] = [phi, e];
    let [x0, x1] = [0, 1];
    while (b !== 0) {
      const q = Math.floor(a / b);
      [a, b] = [b, a % b];
      [x0, x1] = [x1, x0 - q * x1];
    }
    return x0 < 0 ? x0 + phi : x0;
  };

  // Modular Exponentiation (Square-and-Multiply)
  const modPow = (base, exp, mod) => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % mod;
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  const textToNumbers = (text) => text.split('').map(c => c.charCodeAt(0));
  const numbersToText = (nums) => nums.map(n => String.fromCharCode(n)).join('');

  const handleCompute = () => {
    const nVal = p * q;
    const phiVal = (p - 1) * (q - 1);

    // Validate e
    if (gcd(e, phiVal) !== 1) {
      alert("Public exponent e must be coprime with φ(n). Please choose a different e.");
      return;
    }

    const dVal = modInverse(e, phiVal);
    setN(nVal);
    setPhi(phiVal);
    setD(dVal);

    // Parse input numbers or text
    let numbers = [];
    if (mode === 'encrypt') {
      // If encrypt mode, input can be text or numbers separated by comma
      // Try to parse input as numbers, else treat as text
      const maybeNums = input.split(',').map(s => s.trim());
      if (maybeNums.every(s => /^\d+$/.test(s))) {
        numbers = maybeNums.map(Number);
      } else {
        numbers = textToNumbers(input);
      }
    } else {
      // Decrypt mode: input must be comma-separated numbers
      numbers = input.split(',').map(s => parseInt(s.trim()));
      if (numbers.some(isNaN)) {
        alert("Please enter only numbers separated by commas for decryption.");
        return;
      }
    }

    const stepsLog = [];

    const result = numbers.map((num) => {
      const exponent = mode === 'encrypt' ? e : dVal;
      const res = modPow(num, exponent, nVal);

      stepsLog.push({
        original: num,
        result: res,
        exponent,
        mod: nVal,
      });

      return res;
    });

    setSteps(stepsLog);

    setOutput(mode === 'encrypt' ? result.join(', ') : numbersToText(result));
  };

  const convertToNumbers = () => {
    const nums = textToNumbers(input);
    setInput(nums.join(', '));
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
        <h1 className="tool-title">RSA Encryption & Decryption</h1>

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
            onClick={() => navigate('/q-rsa')}
          >
            Take Test
          </button>
        </div>

        {activeTab === 'tool' ? (
          <>
            <div className="input-group">
              <label>Input (comma-separated numbers or text)</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hello → 72, 101, 108, 108, 111"
              />
              <button className="nav-button" style={{ marginTop: '0.5rem' }} onClick={convertToNumbers}>
                Convert Text to Numbers
              </button>
            </div>

            <div className="input-group">
              <label>Prime p</label>
              <select value={p} onChange={(e) => setP(parseInt(e.target.value))}>
                {primeList.map(pr => <option key={pr} value={pr}>{pr}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Prime q</label>
              <select value={q} onChange={(e) => setQ(parseInt(e.target.value))}>
                {primeList.map(pr => <option key={pr} value={pr}>{pr}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Public Exponent e</label>
              <input type="number" value={e} onChange={(e) => setE(Number(e.target.value))} />
            </div>

            {/* Mode Selection - Standardized Toggle */}
            <div className="input-group">
              <label>Operation Mode</label>
              <div className="operation-mode-toggle">
                <label className={`operation-mode-option ${mode === 'encrypt' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === 'encrypt'}
                    onChange={() => setMode('encrypt')}
                  />
                  <span>Encrypt</span>
                </label>
                <label className={`operation-mode-option ${mode === 'decrypt' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === 'decrypt'}
                    onChange={() => setMode('decrypt')}
                  />
                  <span>Decrypt</span>
                </label>
              </div>
            </div>

            <button className="nav-button" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCompute}>
              {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
            </button>

            {steps.length > 0 && (
              <>
                <div className="visualization-steps">
                  <div className="step">
                    <div className="step-title">RSA Parameters</div>
                    <div className="step-content">
                      <div>n = p × q = {p} × {q} = {n}</div>
                      <div>φ(n) = ({p}-1) × ({q}-1) = {phi}</div>
                      <div>Public Key (e, n): ({e}, {n})</div>
                      <div>Private Key (d, n): ({d}, {n})</div>
                    </div>
                  </div>

                  {steps.map((step, i) => (
                    <div key={i} className="step">
                      <div className="step-title">Step {i + 1}: {mode === 'encrypt' ? 'Encryption' : 'Decryption'}</div>
                      <div className="step-content">
                        <div>Input: {step.original}</div>
                        <div>{step.original}<sup>{step.exponent}</sup> mod {step.mod} = {step.result}</div>
                      </div>
                    </div>
                  ))}

                  <div className="step">
                    <div className="step-title">Final Result</div>
                    <div className="step-content">
                      {output}
                    </div>
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Result</label>
                    <button onClick={copyToClipboard} className="text-sm">
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="result-box">{output}</div>
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
            <h2 className="section-title">RSA: Your Friendly Secret Keeper! </h2>
            <p>
              So, you wanna keep messages secret? RSA is like a magic lockbox with two keys — one you share, one you keep secret. It’s how computers securely talk on the internet every day!
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">The Secret Sauce </h2>
            <p style={{ marginBottom: '1rem' }}>
              Here’s how RSA cooks up your secret:
            </p>
            <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
              <li>Pick two big secret prime numbers, <code>p</code> and <code>q</code>.</li>
              <li>Multiply them to get <code>n = p × q</code>, part of the public key everyone can see.</li>
              <li>Calculate <code>φ(n) = (p - 1) × (q - 1)</code>, a special helper number.</li>
              <li>Choose a public exponent <code>e</code> that’s coprime with <code>φ(n)</code> — this goes in the public key.</li>
              <li>Find the private exponent <code>d</code>, the secret key to unlock messages.</li>
            </ul>
            <p>
              Now you have a public key (<code>e, n</code>) to lock messages, and a private key (<code>d, n</code>) to unlock them.
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">Locking Up Your Message </h2>
            <p style={{ marginBottom: '1rem' }}>
              To encrypt, turn your message into numbers (like ASCII codes), then for each number, compute <code>cipher = (message^e) mod n</code>. This scrambles your message so only the private key can unlock it.
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">Unlocking the Secret </h2>
            <p style={{ marginBottom: '1rem' }}>
              To decrypt, use your private key: <code>message = (cipher^d) mod n</code>. The original message numbers pop right back out, ready to turn back into letters.
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">Why’s RSA So Secure? </h2>
            <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
              <li>Multiplying two big primes is easy for computers, but factoring them back is insanely hard.</li>
              <li>This “hard problem” keeps your private key safe, like a treasure chest locked tight.</li>
              <li>The bigger your primes, the tougher the lock!</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">A Little RSA History </h2>
            <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
              <li>Invented in 1977 by Rivest, Shamir, and Adleman — that’s where “RSA” comes from!</li>
              <li>RSA secures things like your bank website, emails, and more.</li>
              <li>Because it’s slow for big data, it’s usually used to securely exchange keys for faster methods.</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">Try It Yourself! </h2>
            <p>
              Type a message, see it get scrambled by RSA encryption, then watch it come back with decryption — it’s like your own mini spy game!
            </p>
            <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
              Got questions or want to know more crypto secrets? Just ask — I’m here to help you crack the code!
            </p>
          </section>
        </div>
        
        
        )}
      </div>
    </div>
  );
};

export default RSAVisualizer;
