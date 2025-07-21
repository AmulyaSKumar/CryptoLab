import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ChallengeStyles.css';

// =========== Playfair Cipher Utilities ===========

const ALPHABET = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Standard 5x5 (J omitted)

const generateMatrix = (key) => {
  key = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const seen = new Set();
  const arr = [];
  for (let ch of key) {
    if (!seen.has(ch) && ALPHABET.includes(ch)) {
      seen.add(ch);
      arr.push(ch);
    }
  }
  for (let ch of ALPHABET) {
    if (!seen.has(ch)) {
      seen.add(ch);
      arr.push(ch);
    }
  }
  const matrix = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(arr.slice(i * 5, i * 5 + 5));
  }
  return matrix;
};

const findCoords = (matrix, ch) => {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c] === ch) return [r, c];
    }
  }
  return null;
};

const preprocess = (text) => {
  text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const pairs = [];
  for (let i = 0; i < text.length; i++) {
    let a = text[i], b = text[i + 1];
    if (!b || a === b) { b = 'X'; } else { i++; }
    pairs.push(a + b);
  }
  return pairs;
};

const playfairTransform = (matrix, pair, encrypt = true) => {
  let [[r1, c1], [r2, c2]] = [findCoords(matrix, pair[0]), findCoords(matrix, pair[1])];
  const shift = encrypt ? 1 : 4;
  if (r1 === r2) {
    c1 = (c1 + shift) % 5;
    c2 = (c2 + shift) % 5;
  } else if (c1 === c2) {
    r1 = (r1 + shift) % 5;
    r2 = (r2 + shift) % 5;
  } else {
    [c1, c2] = [c2, c1];
  }
  return matrix[r1][c1] + matrix[r2][c2];
};

const playfairEncrypt = (text, key) => {
  const matrix = generateMatrix(key);
  return preprocess(text).map(pair => playfairTransform(matrix, pair, true)).join('');
};

const playfairDecrypt = (cipher, key) => {
  const matrix = generateMatrix(key);
  const AT = [];
  for (let i = 0; i < cipher.length; i += 2) {
    const pair = cipher.substr(i, 2);
    AT.push(playfairTransform(matrix, pair, false));
  }
  return AT.join('');
};

// =========== React Component ===========

const PUZZLES = {
  Easy: [
    { text: 'HELLO', key: 'KEY' },
    { text: 'WORLD', key: 'KEY' },
    { text: 'PLAYFAIR', key: 'KEY' },
    { text: 'CIPHER', key: 'DOG' },
    { text: 'SECRET', key: 'SUN' },
  ],
  Medium: [
    { text: 'SECURITY', key: 'PROTECT' },
    { text: 'COMPUTER', key: 'KEYBOARD' },
    { text: 'PUZZLE', key: 'RIDDLE' },
    { text: 'NETWORK', key: 'SYSTEM' },
    { text: 'CHALLENGE', key: 'MYSTERY' },
  ],
  Hard: [
    { text: 'CRYPTOGRAPHY', key: 'ENIGMA' },
    { text: 'DECRYPTION', key: 'SECRETKEY' },
    { text: 'TRANSPOSE', key: 'MATRIX' },
    { text: 'ALGORITHM', key: 'KEYCIPHER' },
    { text: 'INFORMATION', key: 'IMPORTANT' },
  ],
};

const CHALLENGE_TYPES = ['Encrypt', 'Decrypt', 'Crack Key'];
const DIFFICULTY_SETTINGS = {
  Easy: { puzzles: PUZZLES.Easy, time: 45 },
  Medium: { puzzles: PUZZLES.Medium, time: 45 },
  Hard: { puzzles: PUZZLES.Hard, time: 45 },
};

const MAX_PUZZLES = 5;
const MAX_ATTEMPTS = 3;
const getRandomType = () => CHALLENGE_TYPES[Math.floor(Math.random() * CHALLENGE_TYPES.length)];

const PlayfairChallenge = () => {
  const [diff, setDiff] = useState('Easy');
  const [start, setStart] = useState(false);
  const [idx, setIdx] = useState(0);
  const [type, setType] = useState(getRandomType());
  const [plaintext, setPlain] = useState('');
  const [keyText, setKeyText] = useState('');
  const [cipher, setCipher] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [fb, setFb] = useState('');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS.Easy.time);
  const [hint, setHint] = useState(false);
  const timerRef = useRef(null);

  const sounds = {
    correct: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
    incorrect: 'https://actions.google.com/sounds/v1/cartoon/boing.ogg',
    timeout: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
  };
  const play = (s) => new Audio(sounds[s]).play();

  const genPuzzle = () => {
    const { puzzles, time } = DIFFICULTY_SETTINGS[diff];
    const { text, key } = puzzles[idx];
    const enc = playfairEncrypt(text, key);

    setType(getRandomType());
    setPlain(text);
    setKeyText(key);
    setCipher(enc);
    setInputVal('');
    setTries(0);
    setFb('');
    setTimeLeft(time);
    setHint(false);
  };

  useEffect(() => { if (start) genPuzzle(); }, [idx, diff, start]);
  useEffect(() => {
    if (!start || !plaintext) return; // Wait for puzzle to be generated
    if (timeLeft <= 0) {
      play('timeout');
      const correctAns = (type === 'Encrypt' ? cipher : type === 'Decrypt' ? plaintext : keyText);
      setFb(`Time's up! Correct answer: ${correctAns}`);
      clearTimeout(timerRef.current);
      setTimeout(next, 2500);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, start]);

  const next = () => {
    if (idx + 1 < MAX_PUZZLES) setIdx(i => i + 1);
    else { setStart(false); setFb(`Challenge complete! Score: ${score}/${MAX_PUZZLES}`); }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const ans = inputVal.toUpperCase().replace(/[^A-Z]/g, '');
    let correct = false;

    if (type === 'Decrypt') correct = ans === plaintext;
    else if (type === 'Encrypt') correct = ans === cipher;
    else correct = ans === keyText.toUpperCase();

    if (correct) {
      play('correct');
      setScore(s => s + 1);
      setFb('Correct!');
      clearTimeout(timerRef.current);
      setTimeout(next, 1500);
    } else {
      play('incorrect');
      const t = tries + 1;
      setTries(t);
      if (t >= MAX_ATTEMPTS) {
        const correctAns = (type === 'Decrypt' ? plaintext : type === 'Encrypt' ? cipher : keyText);
        setFb(`No attempts left. Answer: ${correctAns}`);
        clearTimeout(timerRef.current);
        setTimeout(next, 2500);
      } else setFb(`Incorrect, ${MAX_ATTEMPTS - t} tries left.`);
    }
  };

  const showHint = () => {
    if (!hint) {
      let msg = '';
      if (type === 'Crack Key') {
        msg = `The key has ${keyText.length} characters. Remember that the Playfair cipher uses a 5x5 matrix where each cell contains a letter.`;
      } else if (type === 'Decrypt') {
        msg = `The key starts with "${keyText.charAt(0)}". In Playfair decryption, you need to reverse the encryption rules: same row (shift left), same column (shift up), rectangle (swap columns).`;
      } else { // Encrypt
        msg = `The key starts with "${keyText.charAt(0)}". In Playfair encryption, pairs in the same row shift right, pairs in the same column shift down, and rectangle pairs swap columns.`;
      }
      setFb(`Hint: ${msg}`);
      setHint(true);
    }
  };

  const prompt = () => {
    if (type === 'Decrypt') return <p>Decrypt <strong>{cipher}</strong></p>;
    if (type === 'Encrypt') return <p>Encrypt <strong>{plaintext}</strong> with key</p>;
    return <p>Find key for: {plaintext} → {cipher}</p>;
  };

  if (!start) {
    return (
      <div className="main-container">
        <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
        <div className="challenge-container">
          <h1 className="challenge-title">Playfair Cipher Challenge</h1>
          <p className="challenge-description">Choose your difficulty to begin:</p>
          <div className="difficulty-buttons">
            {Object.keys(DIFFICULTY_SETTINGS).map(d => (
              <button
                key={d}
                className="difficulty-button"
                onClick={() => {
                  setDiff(d);
                  setIdx(0);
                  setScore(0);
                  setStart(true);
                }}
              >
                {d}
              </button>
            ))}
          </div>
          {fb && <p className="feedback-message">{fb}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
      <div className="challenge-container">
        <h2 className="challenge-title">Round {idx+1}/{MAX_PUZZLES} – {type}</h2>
        <div className="score-display">Score: {score}</div>
        
        <div className="timer-container">
          Time left: {timeLeft}s
          <div style={{ width: '100%', height: '8px', background: '#e9ecef', borderRadius: '4px', margin: '8px 0' }}>
            <div 
              style={{ 
                width: `${(timeLeft / DIFFICULTY_SETTINGS[diff].time) * 100}%`, 
                height: '100%', 
                background: 'linear-gradient(to right, #4caf50, #8bc34a)', 
                borderRadius: '4px',
                transition: 'width 1s linear'
              }} 
            />
          </div>
        </div>
        
        <div className="puzzle-display">
          {prompt()}
        </div>
        
        <form onSubmit={onSubmit}>
          <input 
            type="text" 
            placeholder="Your answer"
            className="challenge-input"
            value={inputVal} 
            onChange={e => setInputVal(e.target.value)}
            required 
            autoFocus
          />
          <button type="submit" className="challenge-submit">Submit</button>
        </form>
        
        <button 
          onClick={showHint} 
          disabled={hint} 
          className="nav-button" 
          style={{ marginTop: '1rem', opacity: hint ? 0.6 : 1 }}
        >
          {hint ? 'Hint Used' : 'Show Hint'}
        </button>
        
        {fb && <p className={`feedback-message ${fb.includes('✅') ? 'feedback-success' : 'feedback-error'}`}>{fb}</p>}
      </div>
    </div>
  );
};

export default PlayfairChallenge;
