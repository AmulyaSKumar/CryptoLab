import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ChallengeStyles.css';

// Vigenère cipher encryption
const vigenereEncrypt = (text, key) => {
  let result = '';
  const A = 'A'.charCodeAt(0);
  text = text.toUpperCase();
  key = key.toUpperCase();
  for (let i = 0; i < text.length; i++) {
    const t = text.charCodeAt(i) - A;
    const k = key.charCodeAt(i % key.length) - A;
    result += String.fromCharCode((t + k) % 26 + A);
  }
  return result;
};

// Vigenère cipher decryption
const vigenereDecrypt = (cipher, key) => {
  let result = '';
  const A = 'A'.charCodeAt(0);
  cipher = cipher.toUpperCase();
  key = key.toUpperCase();
  for (let i = 0; i < cipher.length; i++) {
    const c = cipher.charCodeAt(i) - A;
    const k = key.charCodeAt(i % key.length) - A;
    result += String.fromCharCode((c - k + 26) % 26 + A);
  }
  return result;
};

const PUZZLES = {
  Easy: ['APPLE', 'HOUSE', 'LIGHT', 'MUSIC', 'PLANE'],
  Medium: ['SECURE', 'SECRET', 'TARGET', 'GADGET', 'BUTTON'],
  Hard: ['ENCRYPTION', 'VIGENERE', 'ALGORITHM', 'CHALLENGE', 'KEYBOARD']
};

const DIFFICULTY_SETTINGS = {
  Easy: { keyLength: 3, puzzleTime: 45 },
  Medium: { keyLength: 4, puzzleTime: 45 },
  Hard: { keyLength: 5, puzzleTime: 45 }
};

const MAX_PUZZLES = 5;
const MAX_ATTEMPTS = 3;
const CHALLENGE_TYPES = ['Encrypt', 'Decrypt', 'Crack Key'];

const getRandomKey = (length) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length }, () => letters[Math.floor(Math.random() * 26)]).join('');
};

const getRandomType = () => CHALLENGE_TYPES[Math.floor(Math.random() * CHALLENGE_TYPES.length)];

const VigenereChallenge = () => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [challengeType, setChallengeType] = useState(getRandomType());
  const [plaintext, setPlaintext] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [keyUsed, setKeyUsed] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS[difficulty].puzzleTime);
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
    const newChallengeType = getRandomType();
    const newPlaintext = PUZZLES[difficulty][puzzleIndex].toUpperCase();
    const keyLength = DIFFICULTY_SETTINGS[difficulty].keyLength;
    const newKey = getRandomKey(keyLength);
    const cipher = vigenereEncrypt(newPlaintext, newKey);

    setChallengeType(newChallengeType);
    setPlaintext(newPlaintext);
    setKeyUsed(newKey);
    setCipherText(cipher);
    setUserInput('');
    setAttempts(0);
    setFeedback('');
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].puzzleTime);
    setHintUsed(false);
  };

  useEffect(() => {
    if (gameStarted) generatePuzzle();
  }, [puzzleIndex, difficulty, gameStarted]);

  useEffect(() => {
    if (!gameStarted || !plaintext) return; // Wait for puzzle to be generated

    if (timeLeft <= 0) {
      playSound('timeout');
      let correctAnswer = '';
      if (challengeType === 'Decrypt') correctAnswer = plaintext;
      else if (challengeType === 'Encrypt') correctAnswer = cipherText;
      else correctAnswer = keyUsed;

      setFeedback(`Time's up! Correct answer was: ${correctAnswer}`);
      setTimeout(nextPuzzle, 3000);
      return;
    }

    timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameStarted]);

  const nextPuzzle = () => {
    if (puzzleIndex + 1 < MAX_PUZZLES) {
      setPuzzleIndex(puzzleIndex + 1);
    } else {
      setGameStarted(false);
      setFeedback(`Challenge complete! Final score: ${score}/${MAX_PUZZLES}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const answer = userInput.trim().toUpperCase();
    let isCorrect = false;

    if (challengeType === 'Decrypt') {
      // Use vigenereDecrypt to verify the answer
      const decryptedText = vigenereDecrypt(cipherText, keyUsed);
      isCorrect = answer === decryptedText || answer === plaintext;
    } else if (challengeType === 'Encrypt') {
      isCorrect = answer === cipherText;
    } else if (challengeType === 'Crack Key') {
      // Verify the key by encrypting plaintext and checking if it matches ciphertext
      const testCipher = vigenereEncrypt(plaintext, answer);
      isCorrect = testCipher === cipherText || answer === keyUsed;
    }

    if (isCorrect) {
      playSound('correct');
      setScore(score + 1);
      setFeedback('Correct!');
      clearTimeout(timerRef.current);
      setTimeout(nextPuzzle, 2000);
    } else {
      playSound('incorrect');
      const tries = attempts + 1;
      setAttempts(tries);
      if (tries >= MAX_ATTEMPTS) {
        const correctAnswer = challengeType === 'Decrypt' ? plaintext
          : challengeType === 'Encrypt' ? cipherText : keyUsed;
        setFeedback(`No attempts left! Answer was: ${correctAnswer}`);
        clearTimeout(timerRef.current);
        setTimeout(nextPuzzle, 2500);
      } else {
        setFeedback(`Incorrect. Attempts left: ${MAX_ATTEMPTS - tries}`);
      }
    }
  };

  const handleHint = () => {
    if (!hintUsed) {
      let hintMessage = '';
      if (challengeType === 'Decrypt') {
        hintMessage = `The key length is ${DIFFICULTY_SETTINGS[difficulty].keyLength}. For each letter, subtract the corresponding key letter value (A=0, B=1, etc.) and wrap around if needed.`;
      } else if (challengeType === 'Encrypt') {
        hintMessage = `The key length is ${DIFFICULTY_SETTINGS[difficulty].keyLength}. For each letter, add the corresponding key letter value (A=0, B=1, etc.) and wrap around if needed.`;
      } else { // Crack Key
        hintMessage = `The key length is ${DIFFICULTY_SETTINGS[difficulty].keyLength}. Try working backwards from the plaintext to the ciphertext to determine each letter of the key.`;
      }
      setFeedback(`Hint: ${hintMessage}`);
      setHintUsed(true);
    }
  };

  const renderChallengePrompt = () => {
    if (challengeType === 'Decrypt') {
      return <p>Decrypt the message: <strong>{cipherText}</strong> using key <em>{keyUsed}</em></p>;
    } else if (challengeType === 'Encrypt') {
      return <p>Encrypt the message: <strong>{plaintext}</strong> using key <em>{keyUsed}</em></p>;
    } else {
      return <p>Find the key used for encryption: <strong>{cipherText}</strong> → <em>{plaintext}</em></p>;
    }
  };

  if (!gameStarted) {
    return (
      <div className="main-container">
        <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
        <div className="challenge-container">
          <h1 className="challenge-title">Vigenère Cipher Challenge</h1>
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
                  setTimeLeft(DIFFICULTY_SETTINGS[diff].puzzleTime);
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
          Time left: {timeLeft}s
          <div className="timer-progress-container">
            <div 
              className="timer-progress-bar"
              style={{ 
                width: `${(timeLeft / DIFFICULTY_SETTINGS[difficulty].puzzleTime) * 100}%`
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

export default VigenereChallenge;
