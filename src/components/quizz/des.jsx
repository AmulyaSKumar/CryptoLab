import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import './QuizStyles.css';

const DESQuiz = () => {
  const questions = [
    {
      question: "What type of cipher is DES?",
      options: [
        "Stream cipher",
        "Block cipher",
        "Substitution cipher",
        "Transposition cipher"
      ],
      answer: "Block cipher",
      explanation: "DES is a block cipher encrypting data in 64-bit blocks."
    },
    {
      question: "What is the block size of DES?",
      options: ["56 bits", "64 bits", "128 bits", "32 bits"],
      answer: "64 bits",
      explanation: "DES processes data in 64-bit blocks."
    },
    {
      question: "What is the key size of DES?",
      options: ["56 bits", "64 bits", "128 bits", "112 bits"],
      answer: "56 bits",
      explanation: "Although key input is 64 bits, only 56 bits are used as key."
    },
    {
      question: "How many rounds of processing does DES use?",
      options: ["8", "10", "16", "32"],
      answer: "16",
      explanation: "DES performs 16 rounds of Feistel network processing."
    },
    {
      question: "DES is based on which structure?",
      options: ["Feistel network", "Substitution-permutation network", "Caesar cipher", "Hill cipher"],
      answer: "Feistel network",
      explanation: "DES uses a Feistel structure for encryption and decryption."
    },
    {
      question: "What is the function of the S-boxes in DES?",
      options: [
        "Permute the bits",
        "Substitute bits to introduce non-linearity",
        "Generate keys",
        "Expand the block size"
      ],
      answer: "Substitute bits to introduce non-linearity",
      explanation: "S-boxes perform substitution to enhance security."
    },
    {
      question: "Which of these is NOT part of the DES round function?",
      options: [
        "Expansion permutation",
        "Key mixing (XOR)",
        "Substitution with S-boxes",
        "Hashing the block"
      ],
      answer: "Hashing the block",
      explanation: "Hashing is not part of the DES round function."
    },
    {
      question: "What is the role of the initial permutation (IP) in DES?",
      options: [
        "Encrypt the block",
        "Rearrange input bits for processing",
        "Generate the key",
        "Pad the input data"
      ],
      answer: "Rearrange input bits for processing",
      explanation: "IP rearranges bits but does not add security itself."
    },
    {
      question: "How is the DES key schedule generated?",
      options: [
        "By rotating key bits in each round",
        "By hashing the key",
        "By using a random key for each round",
        "By permuting and selecting bits from the key"
      ],
      answer: "By permuting and selecting bits from the key",
      explanation: "Key schedule uses permutation and rotation to generate round keys."
    },
    {
      question: "What is the length of each subkey used in DES rounds?",
      options: ["48 bits", "56 bits", "64 bits", "32 bits"],
      answer: "48 bits",
      explanation: "Each round uses a 48-bit subkey derived from the main key."
    },
    {
      question: "Which mode is commonly used with DES for encrypting multiple blocks?",
      options: ["ECB", "CBC", "CFB", "All of the above"],
      answer: "All of the above",
      explanation: "DES can be used in multiple modes like ECB, CBC, CFB, etc."
    },
    {
      question: "What is a major weakness of DES today?",
      options: [
        "Small key size vulnerable to brute force",
        "Too slow for modern use",
        "Cannot encrypt binary data",
        "Not well documented"
      ],
      answer: "Small key size vulnerable to brute force",
      explanation: "56-bit key is now too short, vulnerable to brute-force attacks."
    },
    {
      question: "What does the 'E' expansion permutation do in DES?",
      options: [
        "Expands 32-bit half-block to 48 bits",
        "Compresses 64-bit block to 32 bits",
        "Generates keys",
        "Permutes the ciphertext"
      ],
      answer: "Expands 32-bit half-block to 48 bits",
      explanation: "The E expansion duplicates bits to match subkey length."
    },
    {
      question: "How does DES achieve diffusion?",
      options: [
        "Through substitution in S-boxes",
        "Through permutation and Feistel rounds",
        "By XOR with the key",
        "By compressing the data"
      ],
      answer: "Through permutation and Feistel rounds",
      explanation: "Multiple rounds and permutations spread plaintext bits across ciphertext."
    },
    {
      question: "What is the final permutation (FP) in DES?",
      options: [
        "It reverses the initial permutation",
        "It generates the key",
        "It pads the input",
        "It adds non-linearity"
      ],
      answer: "It reverses the initial permutation",
      explanation: "FP undoes the IP to produce final ciphertext."
    },
    {
      question: "In DES, what is the size of the right half-block processed each round?",
      options: ["64 bits", "32 bits", "16 bits", "48 bits"],
      answer: "32 bits",
      explanation: "DES splits 64-bit blocks into two 32-bit halves."
    },
    {
      question: "What cryptanalytic method was famously used to break DES?",
      options: [
        "Differential cryptanalysis",
        "Linear cryptanalysis",
        "Brute force",
        "All of the above"
      ],
      answer: "All of the above",
      explanation: "Various methods including brute force and differential attacks have been used."
    },
    {
      question: "Triple DES (3DES) increases security by:",
      options: [
        "Using three different keys to encrypt data",
        "Doubling block size",
        "Using a different algorithm",
        "Compressing the key"
      ],
      answer: "Using three different keys to encrypt data",
      explanation: "3DES applies DES encryption three times with different keys."
    },
    {
      question: "Why was DES replaced by AES as a standard?",
      options: [
        "AES supports larger keys and blocks",
        "DES was too slow",
        "AES is older",
        "DES was too complicated"
      ],
      answer: "AES supports larger keys and blocks",
      explanation: "AES offers better security with larger key sizes and block sizes."
    },
    {
      question: "Which organization originally developed DES?",
      options: [
        "NSA",
        "NIST",
        "IBM",
        "FBI"
      ],
      answer: "IBM",
      explanation: "IBM developed DES, then it was adopted as a standard by NIST."
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
        <Link to="/c8-des" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">DES Cipher Quiz</h1>
        
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
              href="/des-quizq.pdf" 
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

        {/* All Questions */}
        <div className="questions-container">
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {questionIndex + 1}</span>
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

export default DESQuiz;
