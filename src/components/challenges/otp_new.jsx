import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ChallengeStyles.css';

// One-Time Pad encryption/decryption
const otpCipher = (text, key, decrypt = false) => {
  const A = 'A'.charCodeAt(0);
  let result = '';
  text = text.toUpperCase();
  key = key.toUpperCase();
  
  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i) - A;
    const keyChar = key.charCodeAt(i % key.length) - A;
    
    let resultChar;
    if (decrypt) {
      resultChar = (textChar - keyChar + 26) % 26;
    } else {
      resultChar = (textChar + keyChar) % 26;
    }
    
    result += String.fromCharCode(resultChar + A);
  }
  
  return result;
};

// Generate a random key of given length
const generateKey = (length) => {
  let key = '';
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < length; i++) {
    key += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return key;
};

const PUZZLES = {
  Easy: ['HELLO', 'WORLD', 'APPLE', 'PAPER', 'CLOCK'],
  Medium: ['CRYPTO', 'SECRET', 'CIPHER', 'PUZZLE', 'ENIGMA'],
  Hard: ['ONETIME', 'SECURITY', 'PASSWORD', 'COMPUTER', 'DATABASE']
};

const DIFFICULTY_SETTINGS = {
  Easy: { time: 60 },
  Medium: { time: 45 },
  Hard: { time: 30 }
};

const MAX_PUZZLES = 5;
const MAX_ATTEMPTS = 3;
const CHALLENGE_TYPES = ['Encrypt', 'Decrypt'];

const OTPChallenge = () => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [challengeType, setChallengeType] = useState('Encrypt');
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS[difficulty].time);
  const [hintUsed, setHintUsed] = useState(false);
  const timerRef = useRef(null);

  const playSound = (type) => {
    const sounds = {
      correct: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
      incorrect: 'https://actions.google.com/sounds/v1/cartoon/boing.ogg',
      timeout: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'
    };
    new Audio(sounds[type]).play();
  };

  const generatePuzzle = () => {
    const text = PUZZLES[difficulty][puzzleIndex];
    const newKey = generateKey(text.length);
    const type = CHALLENGE_TYPES[Math.floor(Math.random() * CHALLENGE_TYPES.length)];
    const cipher = otpCipher(text, newKey);
    
    setChallengeType(type);
    setPlaintext(text);
    setKey(newKey);
    setCiphertext(cipher);
    setUserInput('');
    setAttempts(0);
    setFeedback('');
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].time);
    setHintUsed(false);
  };

  useEffect(() => {
    if (gameStarted) generatePuzzle();
  }, [puzzleIndex, difficulty, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    if (timeLeft <= 0) {
      playSound('timeout');
      const correctAnswer = challengeType === 'Encrypt' ? ciphertext : plaintext;
      setFeedback(`⏰ Time's up! Correct answer was: ${correctAnswer}`);
      setTimeout(() => nextPuzzle(), 3000);
      return;
    }

    timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameStarted, challengeType, ciphertext, plaintext]);

  const nextPuzzle = () => {
    if (puzzleIndex + 1 < MAX_PUZZLES) {
      setPuzzleIndex(puzzleIndex + 1);
    } else {
      setGameStarted(false);
      setFeedback(`🎉 Challenge complete! Final score: ${score}/${MAX_PUZZLES}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const answer = userInput.trim().toUpperCase();
    let isCorrect = false;

    if (challengeType === 'Encrypt') {
      isCorrect = answer === ciphertext;
    } else {
      isCorrect = answer === plaintext;
    }

    if (isCorrect) {
      playSound('correct');
      setScore(score + 1);
      setFeedback('✅ Correct!');
      clearTimeout(timerRef.current);
      setTimeout(() => nextPuzzle(), 2000);
    } else {
      playSound('incorrect');
      const tries = attempts + 1;
      setAttempts(tries);
      if (tries >= MAX_ATTEMPTS) {
        const correctAnswer = challengeType === 'Encrypt' ? ciphertext : plaintext;
        setFeedback(`❌ No attempts left! Answer was: ${correctAnswer}`);
        clearTimeout(timerRef.current);
        setTimeout(() => nextPuzzle(), 2500);
      } else {
        setFeedback(`❌ Incorrect. Attempts left: ${MAX_ATTEMPTS - tries}`);
      }
    }
  };

  const handleHint = () => {
    if (!hintUsed) {
      setFeedback(`💡 Hint: Remember to add modulo 26 for each letter when encrypting and subtract modulo 26 when decrypting.`);
      setHintUsed(true);
    }
  };

  const renderChallengePrompt = () => {
    if (challengeType === 'Encrypt') {
      return <p>🔒 Encrypt: <strong>{plaintext}</strong> using key <strong>{key}</strong></p>;
    } else {
      return <p>🔐 Decrypt: <strong>{ciphertext}</strong> using key <strong>{key}</strong></p>;
    }
  };

  if (!gameStarted) {
    return (
      <div className="main-container">
        <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
        <div className="challenge-container">
          <h1 className="challenge-title">One-Time Pad Challenge</h1>
          <p className="challenge-description">Choose your difficulty to begin:</p>
          <div className="difficulty-buttons">
            {Object.keys(DIFFICULTY_SETTINGS).map(diff => (
              <button
                key={diff}
                className="difficulty-button"
                onClick={() => {
                  setDifficulty(diff);
                  setGameStarted(true);
                  setPuzzleIndex(0);
                  setScore(0);
                  setTimeLeft(DIFFICULTY_SETTINGS[diff].time);
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
        <h2 className="challenge-title">Challenge {puzzleIndex + 1} of {MAX_PUZZLES} | {challengeType}</h2>
        <div className="score-display">Score: {score}</div>
        
        <div className="timer-container">
          ⏳ Time left: {timeLeft}s
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
          {renderChallengePrompt()}
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
        
        <button 
          onClick={handleHint} 
          disabled={hintUsed} 
          className="nav-button" 
          style={{ marginTop: '1rem', opacity: hintUsed ? 0.6 : 1 }}
        >
          {hintUsed ? 'Hint Used' : 'Show Hint'}
        </button>
        
        {feedback && <p className={`feedback-message ${feedback.includes('Correct') ? 'feedback-success' : 'feedback-error'}`}>{feedback}</p>}
      </div>
    </div>
  );
};

export default OTPChallenge;
