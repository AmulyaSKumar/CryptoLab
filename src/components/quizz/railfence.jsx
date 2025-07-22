import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import './QuizStyles.css';
const RailfenceQuiz = () => {
  const questions = [
    {
      question: "What type of cipher is the Railfence cipher?",
      options: [
        "Substitution cipher",
        "Transposition cipher",
        "Stream cipher",
        "Block cipher"
      ],
      answer: "Transposition cipher",
      explanation: "Railfence is a transposition cipher that rearranges letters."
    },
    {
      question: "How does the Railfence cipher encrypt a message?",
      options: [
        "By substituting letters with others",
        "By writing letters diagonally over rails and reading row-wise",
        "By XORing letters with a key",
        "By shifting letters by a fixed number"
      ],
      answer: "By writing letters diagonally over rails and reading row-wise",
      explanation: "Plaintext is written in zigzag across rails, then read line by line."
    },
    {
      question: "What is the key in the Railfence cipher?",
      options: [
        "A numeric shift value",
        "The number of rails",
        "A substitution alphabet",
        "A random key string"
      ],
      answer: "The number of rails",
      explanation: "The key is the number of rails (rows) used in zigzag writing."
    },
    {
      question: "For the plaintext 'HELLO' and 2 rails, what is the ciphertext?",
      options: [
        "HLOEL",
        "HOELL",
        "HELLO",
        "HLLOE"
      ],
      answer: "HLOEL",
      explanation: "Zigzag: H L O (top), E L (bottom), read rows: H L O E L."
    },
    {
      question: "What happens if you use only 1 rail in Railfence cipher?",
      options: [
        "It becomes a substitution cipher",
        "Ciphertext equals plaintext",
        "Encryption fails",
        "Text is reversed"
      ],
      answer: "Ciphertext equals plaintext",
      explanation: "With 1 rail, letters stay in order, no change occurs."
    },
    {
      question: "How is decryption performed in Railfence cipher?",
      options: [
        "Reversing the zigzag pattern based on key",
        "Using modular arithmetic",
        "Applying XOR with the key",
        "Shifting letters backward"
      ],
      answer: "Reversing the zigzag pattern based on key",
      explanation: "Decryption reconstructs the zigzag shape to read plaintext."
    },
    {
      question: "Which of these best describes Railfence cipher security?",
      options: [
        "Very strong and unbreakable",
        "Weak, vulnerable to frequency analysis",
        "Moderate, vulnerable to brute force",
        "Perfect secrecy"
      ],
      answer: "Moderate, vulnerable to brute force",
      explanation: "Simple transposition can be brute forced easily with small keys."
    },
    {
      question: "If the key (number of rails) is 3, how are letters arranged?",
      options: [
        "In three horizontal rows with zigzag pattern",
        "In a single row",
        "Randomly distributed",
        "Only in two rows"
      ],
      answer: "In three horizontal rows with zigzag pattern",
      explanation: "Letters placed diagonally across 3 rails forming zigzag."
    },
    {
      question: "Railfence cipher is a type of:",
      options: [
        "Monoalphabetic cipher",
        "Polyalphabetic cipher",
        "Permutation cipher",
        "Steganographic technique"
      ],
      answer: "Permutation cipher",
      explanation: "It permutes (rearranges) the letters without substitution."
    },
    {
      question: "What is the ciphertext of 'WEAREDISCOVERED' with 2 rails?",
      options: [
        "WRSOEVEAEDCIRD",
        "WESVDEAECRRDIO",
        "WECRLTEERDSOEEFEAOCVDE",
        "WAEICDRSDVOREE"
      ],
      answer: "WRSOEVEAEDCIRD",
      explanation: "Letters written in zigzag across 2 rails and read row-wise."
    },
    {
      question: "Which property does Railfence NOT possess?",
      options: [
        "Substitution of letters",
        "Rearrangement of letters",
        "Uses key as number of rails",
        "Can be decrypted with key"
      ],
      answer: "Substitution of letters",
      explanation: "Railfence does not substitute letters, only reorders them."
    },
    {
      question: "Railfence cipher can be combined with which cipher to increase security?",
      options: [
        "Caesar cipher",
        "Vigenère cipher",
        "Hill cipher",
        "Any substitution cipher"
      ],
      answer: "Any substitution cipher",
      explanation: "Combining transposition with substitution ciphers improves security."
    },
    {
      question: "Why is Railfence cipher considered a classical cipher?",
      options: [
        "It uses modern encryption techniques",
        "It is simple and was used historically",
        "It is based on quantum principles",
        "It requires computers"
      ],
      answer: "It is simple and was used historically",
      explanation: "Railfence is one of the earliest ciphers, simple and manual."
    },
    {
      question: "The zigzag pattern in Railfence cipher means:",
      options: [
        "Letters are written diagonally down and up across rails",
        "Letters are shifted by key",
        "Letters are replaced by numbers",
        "Letters are sorted alphabetically"
      ],
      answer: "Letters are written diagonally down and up across rails",
      explanation: "Zigzag means moving down and up over rails while writing letters."
    },
    {
      question: "What is a major weakness of Railfence cipher?",
      options: [
        "The key space is very small",
        "It uses complex mathematics",
        "It needs large keys",
        "It is computationally expensive"
      ],
      answer: "The key space is very small",
      explanation: "Number of rails is usually small, making brute force easy."
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
        <Link to="/c7-railfence" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">Railfence Cipher Quiz</h1>
        
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
              href="/railfence-quizq.pdf" 
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

export default RailfenceQuiz;
