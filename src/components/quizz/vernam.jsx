import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import './QuizStyles.css';

const VernamQuiz = () => {
  const questions = [
    {
      question: "What type of cipher is the Vernam cipher?",
      options: [
        "Polyalphabetic substitution cipher",
        "One-Time Pad (OTP)",
        "Transposition cipher",
        "Stream cipher"
      ],
      answer: "One-Time Pad (OTP)",
      explanation: "The Vernam cipher is a type of One-Time Pad cipher using XOR operation."
    },
    {
      question: "What operation is used in Vernam cipher encryption?",
      options: [
        "Modular addition",
        "XOR (exclusive OR)",
        "Matrix multiplication",
        "Caesar shift"
      ],
      answer: "XOR (exclusive OR)",
      explanation: "Vernam cipher uses XOR between plaintext and key bits for encryption."
    },
    {
      question: "What is the key requirement for the Vernam cipher to be perfectly secure?",
      options: [
        "Key must be shorter than plaintext",
        "Key must be reused multiple times",
        "Key must be truly random and as long as the plaintext",
        "Key can be any string"
      ],
      answer: "Key must be truly random and as long as the plaintext",
      explanation: "Security depends on using a random key of the same length as plaintext, used only once."
    },
    {
      question: "What happens if the Vernam key is reused?",
      options: [
        "Encryption becomes more secure",
        "The cipher can be broken easily",
        "The key resets automatically",
        "Nothing changes"
      ],
      answer: "The cipher can be broken easily",
      explanation: "Reusing key compromises security and allows attackers to find plaintext."
    },
    {
      question: "What is the main advantage of the Vernam cipher?",
      options: [
        "Simple to implement and perfectly secure with right key",
        "Works with any length key",
        "No need to share the key",
        "Based on prime numbers"
      ],
      answer: "Simple to implement and perfectly secure with right key",
      explanation: "With a truly random key used once, Vernam cipher is theoretically unbreakable."
    },
    {
      question: "What is the output if you XOR a bit with itself in Vernam cipher?",
      options: [
        "1",
        "0",
        "Same bit",
        "Depends on bit"
      ],
      answer: "0",
      explanation: "XOR of a bit with itself is always 0."
    },
    {
      question: "How is decryption done in Vernam cipher?",
      options: [
        "Using modular subtraction",
        "Using XOR of ciphertext with the key",
        "Reversing ciphertext",
        "Applying matrix inverse"
      ],
      answer: "Using XOR of ciphertext with the key",
      explanation: "Decryption is identical to encryption: ciphertext XOR key yields plaintext."
    },
    {
      question: "Which historical figure is associated with the invention of the Vernam cipher?",
      options: [
        "Claude Shannon",
        "Gilbert Vernam",
        "Alan Turing",
        "August Kerckhoffs"
      ],
      answer: "Gilbert Vernam",
      explanation: "Gilbert Vernam invented the cipher in 1917."
    },
    {
      question: "The Vernam cipher is best classified as:",
      options: [
        "Symmetric key cipher",
        "Asymmetric key cipher",
        "Hash function",
        "Public key algorithm"
      ],
      answer: "Symmetric key cipher",
      explanation: "The same key is used for both encryption and decryption."
    },
    {
      question: "If the key in Vernam cipher is all zeros, what is the ciphertext?",
      options: [
        "All ones",
        "Same as plaintext",
        "Random",
        "All zeros"
      ],
      answer: "Same as plaintext",
      explanation: "XOR with zero leaves plaintext unchanged."
    },
    {
      question: "Why is key distribution a major challenge for Vernam cipher?",
      options: [
        "Keys are too short",
        "Keys must be securely shared and as long as plaintext",
        "Keys are public",
        "No keys are required"
      ],
      answer: "Keys must be securely shared and as long as plaintext",
      explanation: "Securely distributing long random keys is difficult in practice."
    },
    {
      question: "Which modern technique is similar in principle to Vernam cipher?",
      options: [
        "AES encryption",
        "Stream ciphers using XOR",
        "RSA algorithm",
        "Hashing"
      ],
      answer: "Stream ciphers using XOR",
      explanation: "Many stream ciphers XOR plaintext with a pseudorandom keystream."
    },
    {
      question: "What happens to ciphertext if the key bit is flipped in Vernam cipher?",
      options: [
        "Corresponding ciphertext bit flips",
        "No change",
        "All ciphertext bits change",
        "Only first bit changes"
      ],
      answer: "Corresponding ciphertext bit flips",
      explanation: "XOR changes bit only at positions where key bit is flipped."
    },
    {
      question: "Which of these is NOT true about Vernam cipher?",
      options: [
        "Key must never be reused",
        "Perfect secrecy is guaranteed with random key",
        "Ciphertext length equals plaintext length",
        "Uses modular addition for encryption"
      ],
      answer: "Uses modular addition for encryption",
      explanation: "Vernam cipher uses XOR, not modular addition."
    },
    {
      question: "Vernam cipher encryption and decryption can be performed efficiently on computers because:",
      options: [
        "XOR operation is fast and simple",
        "It requires complex math",
        "It uses large prime numbers",
        "It needs quantum computers"
      ],
      answer: "XOR operation is fast and simple",
      explanation: "XOR is a simple bitwise operation, very efficient to compute."
    }
  ];

  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [revealed, setRevealed] = useState(Array(questions.length).fill(false));

  const handleOptionClick = (questionIndex, option) => {
    if (revealed[questionIndex]) return;
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = option;
    setUserAnswers(newAnswers);
    
    // Auto-reveal the answer when clicked
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
        <Link to="/c6-vernam" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">Vernam Cipher Quiz</h1>
        
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
              href="/vernam-quizq.pdf" 
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

export default VernamQuiz;
