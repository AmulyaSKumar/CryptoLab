import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ChallengeStyles.css';

// Caesar Cipher Utils
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shiftChar = (c, shift) => {
  const idx = ALPHABET.indexOf(c.toUpperCase());
  if (idx === -1) return c; // Non-alphabet chars unchanged
  return ALPHABET[(idx + shift + 26) % 26];
};

const caesarEncrypt = (text, shift) => {
  return text
    .toUpperCase()
    .split('')
    .map(c => shiftChar(c, shift))
    .join('');
};

// =========== Puzzle Data ===========

const PUZZLES = {
  Easy: [
    { plaintext: 'HI', shift: 3 },
    { plaintext: 'BYE', shift: 1 },
    { plaintext: 'OK', shift: 5 },
    { plaintext: 'NO', shift: 2 },
    { plaintext: 'AT', shift: 4 },
  ],
  Medium: [
    { plaintext: 'HELLO', shift: 7 },
    { plaintext: 'WORLD', shift: 10 },
    { plaintext: 'CIPHER', shift: 13 },
    { plaintext: 'SECURE', shift: 9 },
    { plaintext: 'TOKEN', shift: 6 },
  ],
  Hard: [
    { plaintext: 'ENCRYPTION', shift: 15 },
    { plaintext: 'DECRYPTION', shift: 19 },
    { plaintext: 'AUTHORITY', shift: 23 },
    { plaintext: 'COMPLEXITY', shift: 17 },
    { plaintext: 'PROTECTION', shift: 21 },
  ],
};

const CHALLENGE_TYPES = ['Encrypt', 'Decrypt', 'Crack Key'];
const DIFFICULTY_SETTINGS = {
  Easy: { puzzles: PUZZLES.Easy, time: 60 },
  Medium: { puzzles: PUZZLES.Medium, time: 45 },
  Hard: { puzzles: PUZZLES.Hard, time: 30 },
};

const MAX_PUZZLES = 5;
const MAX_ATTEMPTS = 3;
const getRandomType = () => CHALLENGE_TYPES[Math.floor(Math.random() * CHALLENGE_TYPES.length)];

const CaesarCipherChallenge = () => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [type, setType] = useState(getRandomType());
  const [plaintext, setPlaintext] = useState('');
  const [shift, setShift] = useState(0);
  const [cipher, setCipher] = useState('');
  const [userVal, setUserVal] = useState('');
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [fb, setFb] = useState('');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS.Easy.time);
  const [hintUsed, setHintUsed] = useState(false);
  const timerRef = useRef(null);

  const play = (s) => {
    const map = {
      correct: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
      incorrect: 'https://actions.google.com/sounds/v1/cartoon/boing.ogg',
      timeout: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
    };
    new Audio(map[s]).play();
  };

  // Generate puzzle based on difficulty and index
  const generate = () => {
    const { puzzles, time } = DIFFICULTY_SETTINGS[difficulty];
    const { plaintext, shift } = puzzles[idx];
    let cipher = caesarEncrypt(plaintext, shift);
    setType(getRandomType());
    setPlaintext(plaintext);
    setShift(shift);
    setCipher(cipher);
    setUserVal('');
    setTries(0);
    setFb('');
    setTimeLeft(time);
    setHintUsed(false);
  };

  useEffect(() => {
    if (started) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, difficulty, started]);

  useEffect(() => {
    if (!started || !plaintext) return; // Wait for puzzle to be generated
    if (timeLeft <= 0) {
      play('timeout');
      const correct = type === 'Decrypt' ? plaintext : type === 'Encrypt' ? cipher : shift.toString();
      setFb(`⏰ Time's up! Correct answer: ${correct}`);
      clearTimeout(timerRef.current);
      setTimeout(() => next(), 2500);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, started, type, plaintext, cipher, shift]);

  const next = () => {
    if (idx + 1 < MAX_PUZZLES) setIdx(i => i + 1);
    else {
      setStarted(false);
      setFb(`🎉 Challenge complete! Your score: ${score}/${MAX_PUZZLES}`);
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    const input = userVal.trim();

    let correct = false;
    if (type === 'Decrypt') {
      correct = input.toUpperCase() === plaintext.toUpperCase();
    } else if (type === 'Encrypt') {
      correct = input.toUpperCase() === cipher.toUpperCase();
    } else if (type === 'Crack Key') {
      correct = parseInt(input) === shift;
    }

    if (correct) {
      play('correct');
      setScore(s => s + 1);
      setFb('✅ Correct!');
      clearTimeout(timerRef.current);
      setTimeout(() => next(), 1500);
    } else {
      play('incorrect');
      const t = tries + 1;
      setTries(t);
      if (t >= MAX_ATTEMPTS) {
        const correctAns = type === 'Decrypt' ? plaintext : type === 'Encrypt' ? cipher : shift.toString();
        setFb(`❌ No tries left. Correct answer: ${correctAns}`);
        clearTimeout(timerRef.current);
        setTimeout(() => next(), 2500);
      } else {
        setFb(`❌ Wrong - ${MAX_ATTEMPTS - t} tries left`);
      }
    }
  };

  const showHint = () => {
    if (!hintUsed) {
      let msg = '';
      if (type === 'Crack Key') {
        msg = `The shift is between 1-25`;
      } else {
        msg = `Remember: A → B is shift 1`;
      }
      setFb(`💡 Hint: ${msg}`);
      setHintUsed(true);
    }
  };

  const prompt = () => {
    if (type === 'Decrypt')
      return <p>🔐 Decrypt the ciphertext: <strong>{cipher}</strong></p>;
    if (type === 'Encrypt')
      return <p>🔒 Encrypt the plaintext: <strong>{plaintext}</strong></p>;
    return (
      <p>🔑 Find the key (shift) used to encrypt "<strong>{plaintext}</strong>" → "<strong>{cipher}</strong>". Enter the shift number (0-25).</p>
    );
  };

  return !started ? (
    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
      <div className="challenge-container">
        <h1 className="challenge-title">Caesar Cipher Challenge</h1>
        <p className="challenge-description">Choose your difficulty to begin:</p>
        <div className="difficulty-buttons">
          {Object.keys(DIFFICULTY_SETTINGS).map(d => (
            <button
              key={d}
              className="difficulty-button"
              onClick={() => {
                setDifficulty(d);
                setIdx(0);
                setScore(0);
                setStarted(true);
                setType(getRandomType());
              }}
            >
              {d}
            </button>
          ))}
        </div>
        {fb && <p className="feedback-message">{fb}</p>}
      </div>
    </div>
  ) : (
    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
      <div className="challenge-container">
        <h2 className="challenge-title">Round {idx + 1} / {MAX_PUZZLES} — {type}</h2>
        <div className="score-display">Score: {score}</div>
        
        <div className="timer-container">
          ⏱ Time left: {timeLeft}s
          <div style={{ width: '100%', height: '8px', background: '#e9ecef', borderRadius: '4px', margin: '8px 0' }}>
            <div 
              style={{ 
                width: `${(timeLeft / DIFFICULTY_SETTINGS[difficulty].time) * 100}%`, 
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
            className="challenge-input"
            value={userVal}
            onChange={e => setUserVal(e.target.value)}
            required
            autoFocus
            placeholder={type === 'Crack Key' ? 'Enter key (shift number)' : 'Enter answer'}
            maxLength={type === 'Crack Key' ? 2 : undefined}
            inputMode={type === 'Crack Key' ? 'numeric' : 'text'}
            pattern={type === 'Crack Key' ? '[0-9]*' : undefined}
          />
          <button className="challenge-submit" type="submit">Submit</button>
        </form>
        
        <button 
          onClick={showHint} 
          disabled={hintUsed} 
          className="nav-button" 
          style={{ marginTop: '1rem', opacity: hintUsed ? 0.6 : 1 }}
        >
          {hintUsed ? 'Hint Used' : 'Show Hint'}
        </button>
        
        {fb && <p className={`feedback-message ${fb.includes('✅') ? 'feedback-success' : 'feedback-error'}`}>{fb}</p>}
      </div>
    </div>
  );
};

export default CaesarCipherChallenge;
