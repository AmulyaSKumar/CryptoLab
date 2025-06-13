import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ChallengeStyles.css';

// Rail Fence encryption function
const railFenceEncrypt = (text, rails) => {
  if (rails === 1) return text;

  const fence = Array.from({ length: rails }, () => []);
  let rail = 0, direction = 1;

  for (const char of text) {
    fence[rail].push(char);
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  return fence.flat().join('');
};

// Rail Fence decryption function
const railFenceDecrypt = (ciphertext, rails) => {
  if (rails === 1) return ciphertext;

  const len = ciphertext.length;
  const fence = Array.from({ length: rails }, () => Array(len).fill(null));
  let rail = 0, direction = 1;

  for (let i = 0; i < len; i++) {
    fence[rail][i] = '*';
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  let idx = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < len; c++) {
      if (fence[r][c] === '*' && idx < len) {
        fence[r][c] = ciphertext[idx++];
      }
    }
  }

  let result = '';
  rail = 0;
  direction = 1;
  for (let i = 0; i < len; i++) {
    result += fence[rail][i];
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  return result;
};

const PUZZLES = {
  Easy: ['HELLO', 'WORLD', 'RAIL', 'CIPHER', 'CODE'],
  Medium: ['ENCRYPT', 'SECURITY', 'PUZZLE', 'NETWORK', 'CHALLENGE'],
  Hard: ['CRYPTOGRAPHY', 'DECRYPTION', 'TRANSPOSE', 'ALGORITHM', 'ENIGMA']
};

const CHALLENGE_TYPES = ['Decrypt', 'Encrypt', 'Crack Key'];

const DIFFICULTY_SETTINGS = {
  Easy: { rails: 2, puzzleTime: 60 },
  Medium: { rails: 3, puzzleTime: 45 },
  Hard: { rails: 4, puzzleTime: 30 }
};

const MAX_PUZZLES = 5;
const MAX_ATTEMPTS = 3;

const getRandomType = () => CHALLENGE_TYPES[Math.floor(Math.random() * CHALLENGE_TYPES.length)];

const RailFenceChallenge = () => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [challengeType, setChallengeType] = useState(getRandomType());
  const [plaintext, setPlaintext] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [railsUsed, setRailsUsed] = useState(2);
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
    const audio = new Audio(sounds[type]);
    audio.play();
  };

  const generatePuzzle = () => {
    const newChallengeType = getRandomType();
    const newPlaintext = PUZZLES[difficulty][puzzleIndex].toUpperCase();
    const rails = DIFFICULTY_SETTINGS[difficulty].rails;
    const randomRails = Math.floor(Math.random() * (rails + 2 - 2 + 1)) + 2;
    const cipher = railFenceEncrypt(newPlaintext, randomRails);

    setChallengeType(newChallengeType);
    setPlaintext(newPlaintext);
    setRailsUsed(randomRails);
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
    if (!gameStarted) return;

    if (timeLeft <= 0) {
      playSound('timeout');
      let correctAnswer = '';
      if (challengeType === 'Decrypt') correctAnswer = plaintext;
      else if (challengeType === 'Encrypt') correctAnswer = cipherText;
      else correctAnswer = railsUsed;

      setFeedback(`⏰ Time's up! Correct answer was: ${correctAnswer}`);
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
      setFeedback(`🎉 Challenge complete! Final score: ${score}/${MAX_PUZZLES}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const answer = userInput.trim().toUpperCase();
    let isCorrect = false;

    if (challengeType === 'Decrypt') {
      isCorrect = answer === plaintext;
    } else if (challengeType === 'Encrypt') {
      isCorrect = answer === cipherText;
    } else if (challengeType === 'Crack Key') {
      isCorrect = parseInt(answer) === railsUsed;
    }

    if (isCorrect) {
      playSound('correct');
      setScore(score + 1);
      setFeedback('✅ Correct!');
      clearTimeout(timerRef.current);
      setTimeout(nextPuzzle, 2000);
    } else {
      playSound('incorrect');
      const tries = attempts + 1;
      setAttempts(tries);
      if (tries >= MAX_ATTEMPTS) {
        const correctAnswer = challengeType === 'Decrypt' ? plaintext
          : challengeType === 'Encrypt' ? cipherText : railsUsed;
        setFeedback(`❌ No attempts left! Answer was: ${correctAnswer}`);
        clearTimeout(timerRef.current);
        setTimeout(nextPuzzle, 2500);
      } else {
        setFeedback(`❌ Incorrect. Attempts left: ${MAX_ATTEMPTS - tries}`);
      }
    }
  };

  const handleHint = () => {
    if (!hintUsed) {
      setFeedback(`💡 Hint: Rail count is between 2 and ${DIFFICULTY_SETTINGS[difficulty].rails + 2}`);
      setHintUsed(true);
    }
  };

  const renderChallengePrompt = () => {
    if (challengeType === 'Decrypt') {
      return <p>🔐 Decrypt the following: <strong>{cipherText}</strong></p>;
    } else if (challengeType === 'Encrypt') {
      return <p>🔒 Encrypt the following: <strong>{plaintext}</strong> using {railsUsed} rails</p>;
    } else {
      return <p>🔑 Find the number of rails used to encrypt: <strong>{cipherText}</strong> → <em>{plaintext}</em></p>;
    }
  };

  if (!gameStarted) {
    return (
      <div className="main-container">
        <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
        <div className="challenge-container">
          <h1 className="challenge-title">Rail Fence Cipher Challenge</h1>
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
          ⏳ Time left: {timeLeft}s
          <div style={{ width: '100%', height: '8px', background: '#e9ecef', borderRadius: '4px', margin: '8px 0' }}>
            <div 
              style={{ 
                width: `${(timeLeft / DIFFICULTY_SETTINGS[difficulty].puzzleTime) * 100}%`, 
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

export default RailFenceChallenge;
