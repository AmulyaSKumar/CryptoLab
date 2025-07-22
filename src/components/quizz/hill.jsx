import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import './QuizStyles.css';

const HillCipherQuiz = () => {
  const questions = [
    {
      question: "What is the Hill Cipher primarily based on?",
      options: [
        "Substitution of letters",
        "Matrix multiplication",
        "Frequency analysis",
        "Bitwise operations"
      ],
      answer: "Matrix multiplication",
      explanation: "Hill Cipher uses linear algebra concepts like matrix multiplication over mod 26 to encrypt plaintext."
    },
    {
      question: "What must the key matrix of Hill Cipher be for successful decryption?",
      options: [
        "Singular matrix",
        "Invertible matrix mod 26",
        "Zero matrix",
        "Diagonal matrix"
      ],
      answer: "Invertible matrix mod 26",
      explanation: "The key matrix must have an inverse modulo 26 for decryption to be possible."
    },
    {
      question: "What happens if the key matrix is not invertible mod 26?",
      options: [
        "Encryption is impossible",
        "Decryption is impossible",
        "Both encryption and decryption fail",
        "No effect on cipher"
      ],
      answer: "Decryption is impossible",
      explanation: "Without an inverse key matrix modulo 26, you cannot decrypt the ciphertext."
    },
    {
      question: "Hill Cipher operates on blocks of letters. What is the typical block size?",
      options: ["1", "2 or more", "3 only", "5"],
      answer: "2 or more",
      explanation: "Hill Cipher processes plaintext in blocks (vectors) of size equal to the key matrix dimension (usually 2x2 or 3x3)."
    },
    {
      question: "Which of these is a common modulus used in Hill Cipher?",
      options: ["26", "128", "256", "100"],
      answer: "26",
      explanation: "Mod 26 corresponds to the number of letters in the English alphabet."
    },
    {
      question: "How is plaintext represented mathematically in Hill Cipher?",
      options: [
        "As numbers mod 26",
        "As ASCII values",
        "As binary bits",
        "As decimal digits"
      ],
      answer: "As numbers mod 26",
      explanation: "Each letter is converted to a number between 0 and 25 to work with modulo arithmetic."
    },
    {
      question: "If the key matrix is 3x3, how many letters are encrypted at once?",
      options: ["1", "2", "3", "4"],
      answer: "3",
      explanation: "The block size matches the key matrix dimension, so 3 letters are encrypted together."
    },
    {
      question: "What type of cipher is Hill Cipher considered?",
      options: [
        "Substitution cipher",
        "Transposition cipher",
        "Polyalphabetic substitution cipher",
        "Hash function"
      ],
      answer: "Polyalphabetic substitution cipher",
      explanation: "Hill Cipher replaces blocks of letters with other blocks using matrix multiplication, making it polyalphabetic."
    },
    {
      question: "Which property of matrices is crucial for the Hill Cipher key matrix?",
      options: [
        "Determinant must be 0",
        "Determinant must be 1",
        "Determinant must be coprime with 26",
        "Determinant must be negative"
      ],
      answer: "Determinant must be coprime with 26",
      explanation: "The determinant must be invertible mod 26, meaning it must be coprime with 26."
    },
    {
      question: "Why is Hill Cipher more secure than Caesar Cipher?",
      options: [
        "Uses larger key space with matrices",
        "Only shifts letters by one",
        "Encrypts letters independently",
        "Uses symmetric keys"
      ],
      answer: "Uses larger key space with matrices",
      explanation: "Hill Cipher’s use of matrix keys and block encryption increases complexity and resists simple frequency analysis."
    },
    {
      question: "What is the decryption key in Hill Cipher?",
      options: [
        "The transpose of the key matrix",
        "The inverse of the key matrix modulo 26",
        "The negative of the key matrix",
        "The same as encryption key"
      ],
      answer: "The inverse of the key matrix modulo 26",
      explanation: "Decryption involves multiplying by the inverse key matrix modulo 26."
    },
    {
      question: "Can Hill Cipher encrypt messages of arbitrary length directly?",
      options: [
        "Yes, without padding",
        "No, it requires padding to fill blocks",
        "Only if length is prime",
        "Only if length is even"
      ],
      answer: "No, it requires padding to fill blocks",
      explanation: "Plaintext length must be a multiple of the block size, so padding is used if necessary."
    },
    {
      question: "What kind of mathematical object is used as the key in Hill Cipher?",
      options: ["Vector", "Matrix", "Scalar", "Polynomial"],
      answer: "Matrix",
      explanation: "The key is a square matrix used for linear transformations of plaintext blocks."
    },
    {
      question: "Is Hill Cipher a symmetric or asymmetric cipher?",
      options: [
        "Symmetric, uses same key for encryption and decryption",
        "Asymmetric, uses different keys",
        "Symmetric, but keys are public",
        "Asymmetric, based on matrix factorization"
      ],
      answer: "Symmetric, uses same key for encryption and decryption",
      explanation: "Hill Cipher is symmetric since encryption and decryption use the same key matrix and its inverse."
    },
    {
      question: "Why can Hill Cipher be vulnerable if the key matrix is small?",
      options: [
        "Small keys are slow to compute",
        "Small matrices make brute force feasible",
        "They cannot be inverted",
        "They encrypt less text"
      ],
      answer: "Small matrices make brute force feasible",
      explanation: "Small key sizes reduce complexity, making it easier to attack via brute force or known-plaintext attacks."
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
        <Link to="/c3-hill" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back 
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">Hill Cipher Quiz</h1>
        
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
              href="/hill-quizq.pdf" 
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

export default HillCipherQuiz;
