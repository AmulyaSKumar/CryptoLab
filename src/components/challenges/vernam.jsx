import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ChallengeStyles.css';

// XOR-based Vernam (One-Time Pad)
const vernamEncrypt = (plaintext, key) => {
  const A = 'A'.charCodeAt(0);
  return plaintext
    .toUpperCase()
    .split('')
    .map((c, i) => String.fromCharCode(((c.charCodeAt(0) - A) ^ (key.charCodeAt(i) - A)) + A))
    .join('');
};

// Sample puzzles
const PUZZLES = {
  Easy: [
    { plaintext: 'HELLO', key: 'XMCKL' },
    { plaintext: 'WORLD', key: 'KEYAB' },
    { plaintext: 'APPLE', key: 'XMXYZ' },
    { plaintext: 'HOUSE', key: 'ABCDE' },
    { plaintext: 'LIGHT', key: 'QWERT' },
  ],
  Medium: [
    { plaintext: 'COMPUTER', key: 'VIGENERE' },
    { plaintext: 'NETWORKS', key: 'ENIGMAZZ' },
    { plaintext: 'SOFTWARE', key: 'SECURITY' },
    { plaintext: 'PUZZLEME', key: 'MYSTERYS' },
    { plaintext: 'MATRIXES', key: 'CRYPTOSS' },
  ],
  Hard: [
    { plaintext: 'CRYPTOGRAPHY', key: 'ONEPADKEYSZZ' },
    { plaintext: 'DECRYPTIONXX', key: 'XMASKEYABCDZ' },
    { plaintext: 'SECURITYKEYS', key: 'LONGKEYPADZZ' },
    { plaintext: 'ALGORITHMSXX', key: 'RANDOMKEYZZZ' },
    { plaintext: 'INFORMATIONX', key: 'SECUREKEYZZZ' },
  ],
};

const CHALLENGE_TYPES = ['Decrypt', 'Encrypt', 'Crack Key'];

const DIFFICULTY_SETTINGS = {
  Easy: { puzzles: PUZZLES.Easy, time: 45 },
  Medium: { puzzles: PUZZLES.Medium, time: 45 },
  Hard: { puzzles: PUZZLES.Hard, time: 45 },
};

const MAX_PUZZLES = 5;
const MAX_ATTEMPTS = 3;

const getRandomType = () => CHALLENGE_TYPES[Math.floor(Math.random() * CHALLENGE_TYPES.length)];

const VernamChallenge = () => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [type, setType] = useState(getRandomType());
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS.Easy.time);
  const [hintUsed, setHintUsed] = useState(false);
  const timerRef = useRef(null);

  const play = (sound) => {
    const sounds = {
      correct: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
      incorrect: 'https://actions.google.com/sounds/v1/cartoon/boing.ogg',
      timeout: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
    };
    new Audio(sounds[sound]).play();
  };

  const generatePuzzle = () => {
    const { puzzles, time } = DIFFICULTY_SETTINGS[difficulty];
    const { plaintext, key } = puzzles[index];
    const ciphertext = vernamEncrypt(plaintext, key);

    setType(getRandomType());
    setPlaintext(plaintext);
    setKey(key);
    setCiphertext(ciphertext);
    setUserInput('');
    setAttempts(0);
    setFeedback('');
    setTimeLeft(time);
    setHintUsed(false);
  };

  useEffect(() => {
    if (!gameStarted) return;
    generatePuzzle();
  }, [index, difficulty, gameStarted]);

  useEffect(() => {
    if (!gameStarted || !plaintext) return; // Wait for puzzle to be generated
    if (timeLeft <= 0) {
      play('timeout');
      let correctAns = '';
      if (type === 'Decrypt') correctAns = plaintext;
      else if (type === 'Encrypt') correctAns = ciphertext;
      else correctAns = key;

      setFeedback(`Time's up! Correct answer: ${correctAns}`);
      clearTimeout(timerRef.current);
      setTimeout(nextPuzzle, 2500);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameStarted]);

  const nextPuzzle = () => {
    if (index + 1 < MAX_PUZZLES) setIndex(i => i + 1);
    else {
      setGameStarted(false);
      setFeedback(`Challenge complete! Your score: ${score}/${MAX_PUZZLES}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = userInput.trim().toUpperCase();
    let correct = false;

    if (type === 'Decrypt') correct = input === plaintext;
    else if (type === 'Encrypt') correct = input === ciphertext;
    else correct = input === key;

    if (correct) {
      play('correct');
      setScore(s => s + 1);
      setFeedback('Correct!');
      clearTimeout(timerRef.current);
      setTimeout(nextPuzzle, 1500);
    } else {
      play('incorrect');
      const tries = attempts + 1;
      setAttempts(tries);
      if (tries >= MAX_ATTEMPTS) {
        let correctAns = type === 'Decrypt' ? plaintext : type === 'Encrypt' ? ciphertext : key;
        setFeedback(`No attempts left. Answer was: ${correctAns}`);
        clearTimeout(timerRef.current);
        setTimeout(nextPuzzle, 2500);
      } else {
        setFeedback(`Incorrect. Attempts left: ${MAX_ATTEMPTS - tries}`);
      }
    }
  };

  const showHint = () => {
    if (!hintUsed) {
      let hintMessage = '';
      if (type === 'Crack Key') {
        hintMessage = `The key is ${key.length} letters long. In Vernam cipher, each letter of the plaintext is XORed with the corresponding letter of the key.`;
      } else if (type === 'Decrypt') {
        hintMessage = `The key starts with "${key[0]}". To decrypt, XOR each letter of the ciphertext with the corresponding letter of the key.`;
      } else { // Encrypt
        hintMessage = `The key starts with "${key[0]}". To encrypt, XOR each letter of the plaintext with the corresponding letter of the key.`;
      }
      setFeedback(`Hint: ${hintMessage}`);
      setHintUsed(true);
    }
  };

  const renderPrompt = () => {
    if (type === 'Decrypt') {
      return <p>Decrypt: <strong>{ciphertext}</strong> using the key.</p>;
    } else if (type === 'Encrypt') {
      return <p>Encrypt: <strong>{plaintext}</strong> using the key.</p>;
    } else {
      return <p>Crack Key: Given <strong>{plaintext}</strong> → <strong>{ciphertext}</strong>, enter the key.</p>;
    }
  };

  if (!gameStarted) {
    return (
      <div className="main-container">
        <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
        <div className="challenge-container">
          <h1 className="challenge-title">Vernam Cipher Challenge</h1>
          <p className="challenge-description">Choose your difficulty to begin:</p>
          <div className="difficulty-buttons">
            {Object.keys(DIFFICULTY_SETTINGS).map(diff => (
              <button
                key={diff}
                className="difficulty-button"
                onClick={() => {
                  setDifficulty(diff);
                  setIndex(0);
                  setScore(0);
                  setGameStarted(true);
                }}
              >
                {diff}
              </button>
            ))}
          </div>
          {feedback && <p className="feedback-message">{feedback}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
      <div className="challenge-container">
        <h2 className="challenge-title">Round {index + 1}/{MAX_PUZZLES} — {type}</h2>
        <div className="score-display">Score: {score}</div>
        
        <div className="timer-container">
          Time left: {timeLeft}s
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
          {type === 'Encrypt' ? (
            <p>Encrypt: <strong>{plaintext}</strong> with key <strong>{key}</strong></p>
          ) : (
            <p>Decrypt: <strong>{ciphertext}</strong> with key <strong>{key}</strong></p>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="challenge-input"
            placeholder="Your answer"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="challenge-submit">Submit</button>
        </form>
        
        {feedback && <p className={`feedback-message ${feedback.includes('Correct') ? 'feedback-success' : 'feedback-error'}`}>{feedback}</p>}
      </div>
    </div>
  );
};

export default VernamChallenge;
