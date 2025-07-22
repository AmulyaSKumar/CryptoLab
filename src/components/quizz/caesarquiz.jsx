import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import './QuizStyles.css';

const CaesarQuiz = () => {
  const questions = [
    {
      question: "What type of cipher is the Caesar cipher?",
      options: [
        "Substitution cipher",
        "Transposition cipher",
        "Stream cipher",
        "Block cipher"
      ],
      answer: "Substitution cipher",
      explanation: "Caesar cipher is a substitution cipher where each letter is replaced by a letter some fixed number of positions down the alphabet."
    },
    {
      question: "What is the key in a Caesar cipher?",
      options: [
        "A letter",
        "A shift value",
        "A matrix",
        "A keyword"
      ],
      answer: "A shift value",
      explanation: "The key in Caesar cipher is the number of positions each letter is shifted in the alphabet."
    },
    {
      question: "If the key is 3, what does 'D' encrypt to in Caesar cipher?",
      options: [
        "A",
        "G",
        "H",
        "Z"
      ],
      answer: "G",
      explanation: "With a key of 3, each letter shifts 3 positions forward: D → E → F → G"
    },
    {
      question: "What is the size of the key space in Caesar cipher?",
      options: [
        "26",
        "25",
        "10",
        "256"
      ],
      answer: "25",
      explanation: "There are 25 possible shifts (1-25), as a shift of 0 or 26 would result in the original text."
    },
    {
      question: "Which of these is a weakness of the Caesar cipher?",
      options: [
        "Small key space",
        "Complex implementation",
        "High computational requirements",
        "Vulnerability to rainbow tables"
      ],
      answer: "Small key space",
      explanation: "With only 25 possible keys, it can be easily broken by trying all possibilities (brute force)."
    },
    {
      question: "Which technique can easily break a Caesar cipher?",
      options: [
        "Frequency analysis",
        "Differential cryptanalysis",
        "Linear cryptanalysis",
        "Dictionary attack"
      ],
      answer: "Frequency analysis",
      explanation: "By analyzing letter frequencies in the ciphertext and comparing to known language patterns, the shift can be determined."
    },
    {
      question: "Which historical figure is associated with the Caesar cipher?",
      options: [
        "Julius Caesar",
        "Augustus",
        "Alexander the Great",
        "Cleopatra"
      ],
      answer: "Julius Caesar",
      explanation: "The cipher is named after Julius Caesar, who used it to communicate with his generals."
    },
    {
      question: "What happens if you apply a Caesar cipher with key 26?",
      options: [
        "The text becomes encrypted",
        "The text remains the same",
        "The text becomes reversed",
        "The text becomes unreadable"
      ],
      answer: "The text remains the same",
      explanation: "Since the English alphabet has 26 letters, shifting by 26 positions brings you back to the original letter."
    },
    {
      question: "What is the mathematical operation used in Caesar cipher?",
      options: [
        "Addition modulo 26",
        "Multiplication modulo 26",
        "XOR operation",
        "Matrix multiplication"
      ],
      answer: "Addition modulo 26",
      explanation: "Caesar cipher uses addition modulo 26 for encryption and subtraction modulo 26 for decryption."
    },
    {
      question: "Which of these is NOT a variant of the Caesar cipher?",
      options: [
        "ROT13",
        "Atbash cipher",
        "Vigenère cipher",
        "Hill cipher"
      ],
      answer: "Hill cipher",
      explanation: "Hill cipher uses matrix multiplication and is much more complex than the simple substitution of Caesar cipher."
    },
    {
      question: "In a Caesar cipher with key 3, what does 'Z' encrypt to?",
      options: [
        "C",
        "W",
        "A",
        "X"
      ],
      answer: "C",
      explanation: "Z shifts 3 positions forward, wrapping around the alphabet: Z → A → B → C"
    },
    {
      question: "What is the decryption key if the encryption key is 7?",
      options: [
        "7",
        "19",
        "-7",
        "26-7=19"
      ],
      answer: "19",
      explanation: "To decrypt, you can shift backward by 7 positions, which is equivalent to shifting forward by 26-7=19 positions."
    },
    {
      question: "Which cipher is considered an improvement over the Caesar cipher?",
      options: [
        "Vigenère cipher",
        "Binary cipher",
        "Morse code",
        "ASCII encoding"
      ],
      answer: "Vigenère cipher",
      explanation: "Vigenère cipher uses multiple shift values based on a keyword, making it more secure than Caesar's single shift."
    },
    {
      question: "What is the main reason Caesar cipher is not used for serious encryption today?",
      options: [
        "It's too slow",
        "It's too easily broken",
        "It requires special hardware",
        "It's patented"
      ],
      answer: "It's too easily broken",
      explanation: "With only 25 possible keys and vulnerability to frequency analysis, it provides virtually no security against modern methods."
    },
    {
      question: "Which of these messages is encrypted with a Caesar cipher?",
      options: [
        "KHOOR",
        "H3LL0",
        "01001000",
        "HELLO"
      ],
      answer: "KHOOR",
      explanation: "KHOOR is HELLO shifted by 3 positions (Caesar cipher with key=3)."
    }
  ];

  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [revealed, setRevealed] = useState(Array(questions.length).fill(false));
  
  const handleOptionClick = (questionIndex, option) => {
    if (revealed[questionIndex]) return;
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = option;
    setUserAnswers(newUserAnswers);
    
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
        <Link to="/c1-caesar" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back 
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">Caesar Cipher Quiz</h1>
        
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
              href="/ceaser-quiz.pdf" 
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

export default CaesarQuiz;
