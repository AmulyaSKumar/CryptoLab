import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './QuizStyles.css';

const AESQuiz = () => {
  const questions = [
    {
      question: "What type of cipher is AES?",
      options: [
        "Stream cipher",
        "Block cipher",
        "Substitution cipher",
        "Transposition cipher"
      ],
      answer: "Block cipher",
      explanation: "AES is a block cipher that encrypts data in fixed-size blocks."
    },
    {
      question: "What is the block size of AES?",
      options: ["128 bits", "192 bits", "256 bits", "64 bits"],
      answer: "128 bits",
      explanation: "AES operates on 128-bit blocks regardless of key size."
    },
    {
      question: "Which key sizes does AES support?",
      options: [
        "128, 192, and 256 bits",
        "56, 112, and 168 bits",
        "64, 128, and 256 bits",
        "32, 64, and 128 bits"
      ],
      answer: "128, 192, and 256 bits",
      explanation: "AES supports three key sizes: 128, 192, and 256 bits."
    },
    {
      question: "How many rounds does AES-128 use?",
      options: ["10", "12", "14", "16"],
      answer: "10",
      explanation: "AES-128 uses 10 rounds of processing."
    },
    {
      question: "How many rounds does AES-256 use?",
      options: ["10", "12", "14", "16"],
      answer: "14",
      explanation: "AES-256 uses 14 rounds of processing."
    },
    {
      question: "AES is based on which mathematical structure?",
      options: [
        "Substitution-permutation network",
        "Feistel network",
        "Hill cipher",
        "One-time pad"
      ],
      answer: "Substitution-permutation network",
      explanation: "AES uses a substitution-permutation network for encryption."
    },
    {
      question: "What is the size of the AES state?",
      options: ["4x4 bytes", "8x8 bytes", "2x2 bytes", "16x16 bytes"],
      answer: "4x4 bytes",
      explanation: "AES state is a 4x4 matrix of bytes (128 bits)."
    },
    {
      question: "Which step in AES provides diffusion?",
      options: [
        "ShiftRows",
        "SubBytes",
        "AddRoundKey",
        "KeyExpansion"
      ],
      answer: "ShiftRows",
      explanation: "ShiftRows shifts bytes in rows to spread the data (diffusion)."
    },
    {
      question: "Which AES step provides non-linearity?",
      options: [
        "SubBytes",
        "MixColumns",
        "AddRoundKey",
        "ShiftRows"
      ],
      answer: "SubBytes",
      explanation: "SubBytes uses S-box substitutions introducing non-linearity."
    },
    {
      question: "What does the MixColumns step do?",
      options: [
        "Performs matrix multiplication to mix bytes within a column",
        "Shifts the bytes in each row",
        "Adds the round key",
        "Expands the key"
      ],
      answer: "Performs matrix multiplication to mix bytes within a column",
      explanation: "MixColumns mixes the data within each column to enhance diffusion."
    },
    {
      question: "What is the AddRoundKey step in AES?",
      options: [
        "XORing the state with the round key",
        "Substituting bytes with S-box",
        "Shifting rows",
        "Mixing columns"
      ],
      answer: "XORing the state with the round key",
      explanation: "AddRoundKey mixes the current round key by XOR operation."
    },
    {
      question: "How is the AES key schedule generated?",
      options: [
        "Using the Rijndael key schedule algorithm",
        "Using a Feistel network",
        "Randomly for each round",
        "Using DES key schedule"
      ],
      answer: "Using the Rijndael key schedule algorithm",
      explanation: "AES uses Rijndael key schedule to derive round keys."
    },
    {
      question: "Which AES mode provides confidentiality without integrity?",
      options: [
        "ECB",
        "GCM",
        "CCM",
        "Authenticated Encryption"
      ],
      answer: "ECB",
      explanation: "ECB mode encrypts blocks independently and is vulnerable to pattern leaks."
    },
    {
      question: "Which mode of AES combines encryption and authentication?",
      options: [
        "GCM (Galois/Counter Mode)",
        "CBC",
        "CFB",
        "ECB"
      ],
      answer: "GCM (Galois/Counter Mode)",
      explanation: "GCM mode provides both confidentiality and data authenticity."
    },
    {
      question: "Why is ECB mode generally discouraged?",
      options: [
        "Because it leaks data patterns",
        "Because it is slow",
        "Because it requires a large key",
        "Because it is only for streaming"
      ],
      answer: "Because it leaks data patterns",
      explanation: "ECB encrypts identical plaintext blocks to identical ciphertext blocks."
    },
    {
      question: "AES was selected as the standard by which organization?",
      options: [
        "NIST",
        "NSA",
        "FBI",
        "IBM"
      ],
      answer: "NIST",
      explanation: "NIST selected AES as the encryption standard in 2001."
    },
    {
      question: "Which algorithm was AES designed to replace?",
      options: [
        "DES",
        "Blowfish",
        "RC4",
        "Twofish"
      ],
      answer: "DES",
      explanation: "AES replaced DES due to DES’s shorter key size and vulnerabilities."
    },
    {
      question: "How does AES resist differential and linear cryptanalysis?",
      options: [
        "Through multiple rounds of substitution and permutation",
        "By using very large keys",
        "By hashing the plaintext",
        "By compressing data"
      ],
      answer: "Through multiple rounds of substitution and permutation",
      explanation: "The design of AES provides strong resistance to such attacks."
    },
    {
      question: "What is the minimum recommended key size for AES to be secure today?",
      options: [
        "128 bits",
        "56 bits",
        "64 bits",
        "256 bits"
      ],
      answer: "128 bits",
      explanation: "AES-128 is currently considered secure, though 256-bit is preferred for extra security."
    },
    {
      question: "In AES, which operation is applied last in each round except the final?",
      options: [
        "MixColumns",
        "AddRoundKey",
        "SubBytes",
        "ShiftRows"
      ],
      answer: "AddRoundKey",
      explanation: "AddRoundKey is the last step in each round to combine data with the round key."
    }
  ];

  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [revealed, setRevealed] = useState(Array(questions.length).fill(false));

  const handleOptionClick = (questionIndex, option) => {
    if (revealed[questionIndex]) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = option;
    setUserAnswers(newAnswers);
    
    // Auto-reveal after selection
    const newRevealed = [...revealed];
    newRevealed[questionIndex] = true;
    setRevealed(newRevealed);
  };
  
  const resetQuiz = () => {
    setUserAnswers(Array(questions.length).fill(null));
    setRevealed(Array(questions.length).fill(false));
  };
  
  
  const calculateScore = () => {
    return userAnswers.filter((answer, index) => 
      answer === questions[index].answer
    ).length;
  };

  const calculatePercentage = () => {
    const score = calculateScore();
    return Math.round((score / questions.length) * 100);
  };

  return (
    <div className="main-container">
      <div className="back-nav">
        <Link to="/c9-aes" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">AES Cipher Quiz</h1>
        
        {/* Score and Download Bar */}
        <div className="quiz-header-bar">
          <div className="quiz-progress">
            <span className="progress-text">
              Progress: {userAnswers.filter(answer => answer !== null && answer !== '').length}/{questions.length} questions
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(userAnswers.filter(answer => answer !== null && answer !== '').length / questions.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="quiz-actions-header">
            <div className="current-score">
              Score: {calculateScore()}/{questions.length} ({calculatePercentage()}%)
            </div>
            <a 
              href="/aes-quizq.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-questions-button"
              title="Download quiz questions as PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Download Questions
            </a>
          </div>
        </div>
            
        {/* Show all questions */}
        <div className="all-questions-container">
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question-container">
              <div className="question-number" style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'var(--primary-color)',
                marginBottom: '0.5rem'
              }}>
                Question {questionIndex + 1}
              </div>
              <div className="question-text">
                {question.question}
              </div>
              
              <div className="options-container">
                {question.options.map((option, idx) => {
                  const isSelected = userAnswers[questionIndex] === option;
                  const isRevealed = revealed[questionIndex];
                  const isCorrect = option === question.answer;
                  
                  let optionClass = "option-button";
                  if (isRevealed) {
                    if (isSelected && isCorrect) {
                      optionClass += " correct";
                    } else if (isSelected && !isCorrect) {
                      optionClass += " incorrect";
                    } else if (isCorrect) {
                      optionClass += " correct-answer";
                    }
                  } else if (isSelected) {
                    optionClass += " selected";
                  }
                  
                  return (
                    <button
                      key={idx}
                      className={optionClass}
                      onClick={() => handleOptionClick(questionIndex, option)}
                      disabled={isRevealed}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              
              {revealed[questionIndex] && (
                <div className="explanation">
                  {userAnswers[questionIndex] === question.answer ? (
                    <div className="correct-message">Correct! ✓</div>
                  ) : (
                    <div className="incorrect-message">
                      Incorrect! ✗ <br />
                      Correct answer: {question.answer}
                    </div>
                  )}
                  <div className="explanation-text">
                    {question.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="quiz-actions" style={{ textAlign: 'center', marginTop: '2rem' }}>
                   
          <button 
            className="nav-button secondary" 
            onClick={resetQuiz}
            style={{ 
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Reset Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AESQuiz;
