import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ChallengeStyles.css';

// =========== Hill Cipher Utilities ===========

// Compute modular inverse of a mod m (m=26)
const modInv = (a, m = 26) => {
  a = ((a % m) + m) % m;
  for (let i = 1; i < m; i++) {
    if ((a * i) % m === 1) return i;
  }
  return null;
};

// Multiply matrix (2×2) by vector length 2 mod 26
const mulMatVec = (M, v) => {
  return [
    (M[0][0] * v[0] + M[0][1] * v[1]) % 26,
    (M[1][0] * v[0] + M[1][1] * v[1]) % 26
  ].map(x => (x + 26) % 26);
};

// Encrypt in 2×2 Hill
const hillEncrypt = (text, key) => {
  const P = text.toUpperCase().replace(/[^A-Z]/g, '').padEnd(Math.ceil(text.length / 2) * 2, 'X');
  let out = '';
  for (let i = 0; i < P.length; i += 2) {
    const v = [P.charCodeAt(i) - 65, P.charCodeAt(i + 1) - 65];
    const w = mulMatVec(key, v);
    out += String.fromCharCode(w[0] + 65) + String.fromCharCode(w[1] + 65);
  }
  return out;
};

// Decrypt using inverse key
const hillDecrypt = (cipher, key) => {
  const det = key[0][0] * key[1][1] - key[0][1] * key[1][0];
  const invDet = modInv(det, 26);
  if (invDet === null) return null;
  const invKey = [
    [ key[1][1] * invDet, (-key[0][1]) * invDet ],
    [ (-key[1][0]) * invDet, key[0][0] * invDet ]
  ].map(row => row.map(v => ((v % 26) + 26) % 26));
  
  const C = cipher.toUpperCase().replace(/[^A-Z]/g, '').padEnd(Math.ceil(cipher.length / 2) * 2, 'X');
  let out = '';
  for (let i = 0; i < C.length; i += 2) {
    const v = [C.charCodeAt(i) - 65, C.charCodeAt(i + 1) - 65];
    const w = mulMatVec(invKey, v);
    out += String.fromCharCode(w[0] + 65) + String.fromCharCode(w[1] + 65);
  }
  return out;
};

// Generate a valid Hill key matrix (a,b,c,d must have det coprime with 26)
const generateValidKey = () => {
  // For simplicity, we'll generate matrices with det=1 or det=3
  const coprimes26 = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
  const det = coprimes26[Math.floor(Math.random() * coprimes26.length)];
  
  // For det=1 case, a*d-b*c=1
  // Random a,b,c then compute d = (1+b*c)/a
  let a, b, c, d;
  do {
    a = Math.floor(Math.random() * 26);
    b = Math.floor(Math.random() * 26);
    c = Math.floor(Math.random() * 26);
    
    // Try to choose d such that ad-bc = det
    d = ((det + b*c) % 26) * modInv(a, 26) % 26;
  } while (!a || !modInv(a, 26) || (a*d - b*c) % 26 !== det % 26);
  
  return [[a, b], [c, d]];
};

// =========== Puzzle Data ===========

const PUZZLES = {
  Easy: [
    { plaintext: 'HI', key: [[1, 2], [1, 3]] },
    { plaintext: 'GO', key: [[3, 2], [1, 5]] },
    { plaintext: 'UP', key: [[5, 1], [2, 3]] },
    { plaintext: 'OK', key: [[7, 2], [3, 5]] },
    { plaintext: 'NO', key: [[5, 2], [3, 1]] },
  ],
  Medium: [
    { plaintext: 'HILL', key: [[3, 5], [1, 7]] },
    { plaintext: 'MATH', key: [[5, 6], [3, 5]] },
    { plaintext: 'CODE', key: [[7, 2], [5, 9]] },
    { plaintext: 'EXAM', key: [[9, 4], [5, 3]] },
    { plaintext: 'TEST', key: [[11, 8], [7, 5]] },
  ],
  Hard: [
    { plaintext: 'MATRIX', key: [[11, 8], [7, 6]] },
    { plaintext: 'CIPHER', key: [[15, 6], [9, 7]] },
    { plaintext: 'LINEAR', key: [[17, 10], [11, 9]] },
    { plaintext: 'SECURE', key: [[19, 12], [13, 11]] },
    { plaintext: 'CRYPTO', key: [[21, 14], [15, 13]] },
  ],
};

const CHALLENGE_TYPES = ['Encrypt', 'Decrypt', 'Crack Key'];

const DIFFICULTY_SETTINGS = {
  Easy: { time: 60 },
  Medium: { time: 45 },
  Hard: { time: 30 }
};

const MAX_PUZZLES = 5;
const MAX_ATTEMPTS = 3;

const getRandomType = () => CHALLENGE_TYPES[Math.floor(Math.random() * CHALLENGE_TYPES.length)];

const HillChallenge = () => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [challengeType, setChallengeType] = useState(getRandomType());
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState([[1, 2], [1, 3]]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS.Easy.time);
  const [hintUsed, setHintUsed] = useState(false);
  
  const timerRef = useRef(null);
  const audioRef = useRef({
    correct: new Audio('/sounds/correct.mp3'),
    incorrect: new Audio('/sounds/incorrect.mp3'),
    timeout: new Audio('/sounds/timeout.mp3')
  });

  const play = (sound) => {
    try {
      audioRef.current[sound].currentTime = 0;
      audioRef.current[sound].play();
    } catch (e) {
      console.error('Error playing sound:', e);
    }
  };

  // Initialize new puzzle
  const generatePuzzle = () => {
    const difficultyPuzzles = PUZZLES[difficulty];
    const puzzle = difficultyPuzzles[puzzleIndex];
    
    setPlaintext(puzzle.plaintext);
    setKey(puzzle.key);
    setCiphertext(hillEncrypt(puzzle.plaintext, puzzle.key));
    
    setUserInput('');
    setFeedback('');
    setAttempts(0);
    setHintUsed(false);
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].time);
  };

  // Start the game with selected difficulty
  const startGame = (diffLevel) => {
    setDifficulty(diffLevel);
    setPuzzleIndex(0);
    setScore(0);
    setGameStarted(true);
    setChallengeType(getRandomType());
  };

  // Handle puzzle selection
  useEffect(() => {
    if (gameStarted) {
      generatePuzzle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleIndex, difficulty, challengeType, gameStarted]);

  // Timer logic
  useEffect(() => {
    if (!gameStarted || !plaintext) return; // Wait for puzzle to be generated
    
    if (timeLeft <= 0) {
      play('timeout');
      const correct = challengeType === 'Decrypt' ? plaintext : 
                     challengeType === 'Encrypt' ? ciphertext : 
                     `${key[0][0]},${key[0][1]},${key[1][0]},${key[1][1]}`;
      setFeedback(`⏰ Time's up! Correct answer: ${correct}`);
      clearTimeout(timerRef.current);
      setTimeout(nextPuzzle, 2500);
      return;
    }
    
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameStarted, challengeType, plaintext, ciphertext, key]);

  // Move to next puzzle or end game
  const nextPuzzle = () => {
    if (puzzleIndex + 1 < MAX_PUZZLES) {
      setPuzzleIndex(i => i + 1);
      setChallengeType(getRandomType());
    } else {
      setGameStarted(false);
      setFeedback(`🎉 Challenge complete! Your score: ${score}/${MAX_PUZZLES}`);
    }
  };

  // Handle user submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const input = userInput.trim().toUpperCase();
    
    let correct = false;
    if (challengeType === 'Decrypt') {
      // Use hillDecrypt to verify the answer
      const decryptedText = hillDecrypt(ciphertext, key);
      correct = input === decryptedText || input === plaintext;
    } else if (challengeType === 'Encrypt') {
      correct = input === ciphertext;
    } else if (challengeType === 'Crack Key') {
      // Parse input as "a,b,c,d" format
      const nums = input.split(',').map(n => parseInt(n.trim(), 10));
      if (nums.length === 4 && !nums.some(isNaN)) {
        const inputKey = [[nums[0], nums[1]], [nums[2], nums[3]]];
        // Check if this key produces the same ciphertext
        const testCipher = hillEncrypt(plaintext, inputKey);
        correct = testCipher === ciphertext;
      }
    }
    
    if (correct) {
      play('correct');
      setScore(s => s + 1);
      setFeedback('✅ Correct!');
      clearTimeout(timerRef.current);
      setTimeout(nextPuzzle, 1500);
    } else {
      play('incorrect');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        const correctAnswer = challengeType === 'Decrypt' ? plaintext : 
                            challengeType === 'Encrypt' ? ciphertext : 
                            `${key[0][0]},${key[0][1]},${key[1][0]},${key[1][1]}`;
        setFeedback(`❌ No tries left. Correct answer: ${correctAnswer}`);
        clearTimeout(timerRef.current);
        setTimeout(nextPuzzle, 2500);
      } else {
        setFeedback(`❌ Incorrect - ${MAX_ATTEMPTS - newAttempts} tries left`);
      }
    }
  };

  // Provide a hint
  const handleHint = () => {
    if (!hintUsed) {
      let hintText;
      if (challengeType === 'Crack Key') {
        hintText = `The key is a 2x2 matrix where a*d-b*c is coprime with 26.`;
      } else if (challengeType === 'Encrypt') {
        hintText = `The key is [[${key[0][0]},${key[0][1]}],[${key[1][0]},${key[1][1]}]].`;
      } else {
        hintText = `The plaintext starts with "${plaintext[0]}".`;
      }
      
      setFeedback(`💡 Hint: ${hintText}`);
      setHintUsed(true);
    }
  };

  // Render challenge prompt based on type
  const renderChallengePrompt = () => {
    if (challengeType === 'Decrypt')
      return <p>🔐 Decrypt the ciphertext: <strong>{ciphertext}</strong></p>;
    if (challengeType === 'Encrypt')
      return <p>🔒 Encrypt the plaintext: <strong>{plaintext}</strong></p>;
    return (
      <p>🔑 Find the key matrix that encrypts "<strong>{plaintext}</strong>" to "<strong>{ciphertext}</strong>".<br/>
      Enter as "a,b,c,d" for matrix [[a,b],[c,d]]</p>
    );
  };

  // Render beginning screen or active challenge
  return !gameStarted ? (
    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
      <div className="challenge-container">
        <h1 className="challenge-title">Hill Cipher Challenge</h1>
        <p className="challenge-description">Choose your difficulty to begin:</p>
        <div className="difficulty-buttons">
          {Object.keys(DIFFICULTY_SETTINGS).map(d => (
            <button
              key={d}
              className="difficulty-button"
              onClick={() => startGame(d)}
            >
              {d}
            </button>
          ))}
        </div>
        {feedback && <p className="feedback-message">{feedback}</p>}
      </div>
    </div>
  ) : (
    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
      <div className="challenge-container">
        <h2 className="challenge-title">Challenge {puzzleIndex + 1} of {MAX_PUZZLES} | {challengeType}</h2>
        <div className="score-display">Score: {score}</div>
        
        <div className="timer-container">
          ⏳ Time left: {timeLeft}s
          <div className="timer-progress-container">
            <div 
              className="timer-progress-bar"
              style={{ 
                width: `${(timeLeft / DIFFICULTY_SETTINGS[difficulty].time) * 100}%`
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
            placeholder={challengeType === 'Crack Key' ? "Enter key as a,b,c,d" : "Your answer"}
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

export default HillChallenge;
