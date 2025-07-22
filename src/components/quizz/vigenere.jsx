import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import './QuizStyles.css';

const VigenereQuiz = () => {
  const questions = [
    {
      question: "What type of cipher is the Vigenère cipher?",
      options: [
        "Substitution cipher",
        "Transposition cipher",
        "Polyalphabetic substitution cipher",
        "Stream cipher"
      ],
      answer: "Polyalphabetic substitution cipher",
      explanation: "Vigenère cipher uses multiple Caesar ciphers with different shift values based on a keyword."
    },
    {
      question: "How is the key used in the Vigenère cipher?",
      options: [
        "Repeated cyclically to match plaintext length",
        "Used once and discarded",
        "Added to the plaintext",
        "Multiplied with plaintext"
      ],
      answer: "Repeated cyclically to match plaintext length",
      explanation: "The key is repeated to match the length of the plaintext for encryption."
    },
    {
      question: "Which of these is the main weakness of the Vigenère cipher?",
      options: [
        "Key length is too long",
        "Key is reused and can be detected",
        "Only works with numbers",
        "It’s a symmetric cipher"
      ],
      answer: "Key is reused and can be detected",
      explanation: "Repeated keys can be detected via frequency analysis, making Vigenère vulnerable."
    },
    {
      question: "Which method is commonly used to attack the Vigenère cipher?",
      options: [
        "Brute force",
        "Frequency analysis",
        "Kasiski examination",
        "Chosen plaintext attack"
      ],
      answer: "Kasiski examination",
      explanation: "Kasiski examination finds repeated sequences to guess key length."
    },
    {
      question: "In the Vigenère cipher, encryption of a letter involves:",
      options: [
        "Adding key letter shift mod 26",
        "XORing with key letter",
        "Multiplying ASCII codes",
        "Reversing plaintext"
      ],
      answer: "Adding key letter shift mod 26",
      explanation: "Each plaintext letter is shifted by the key letter’s position in the alphabet."
    },
    {
      question: "If the key length equals the plaintext length and key is random, the Vigenère cipher becomes:",
      options: [
        "Caesar cipher",
        "One-Time Pad",
        "Hill cipher",
        "Transposition cipher"
      ],
      answer: "One-Time Pad",
      explanation: "A Vigenère cipher with a truly random key as long as plaintext is effectively a One-Time Pad."
    },
    {
      question: "What alphabet does the classic Vigenère cipher use?",
      options: [
        "Binary digits",
        "English alphabet (A-Z)",
        "ASCII characters",
        "Unicode characters"
      ],
      answer: "English alphabet (A-Z)",
      explanation: "It typically uses the 26 letters A-Z."
    },
    {
      question: "Which of the following best describes the key in the Vigenère cipher?",
      options: [
        "Numeric string",
        "Alphabetic string",
        "Random binary string",
        "Matrix"
      ],
      answer: "Alphabetic string",
      explanation: "The key is an alphabetic string repeated for encryption."
    },
    {
      question: "What does the Vigenère square or table contain?",
      options: [
        "Rows of shifted alphabets",
        "Random numbers",
        "XOR operations",
        "Matrices"
      ],
      answer: "Rows of shifted alphabets",
      explanation: "Each row is a Caesar shifted alphabet used to encrypt letters."
    },
    {
      question: "Vigenère cipher was considered unbreakable for:",
      options: [
        "Thousands of years",
        "About 300 years",
        "Almost a century",
        "Until computers were invented"
      ],
      answer: "Almost a century",
      explanation: "It was called “le chiffre indéchiffrable” for a long time before attacks like Kasiski’s were found."
    },
    {
      question: "What is the main difference between the Caesar cipher and the Vigenère cipher?",
      options: [
        "Vigenère uses multiple keys, Caesar uses one",
        "Caesar uses multiple keys, Vigenère uses one",
        "Both use same key length",
        "Caesar cipher is polyalphabetic"
      ],
      answer: "Vigenère uses multiple keys, Caesar uses one",
      explanation: "Vigenère uses a keyword to shift letters differently, unlike Caesar's single fixed shift."
    },
    {
      question: "How do you decrypt a Vigenère ciphertext?",
      options: [
        "Add the key letters modulo 26",
        "Subtract the key letters modulo 26",
        "XOR with key letters",
        "Multiply by inverse matrix"
      ],
      answer: "Subtract the key letters modulo 26",
      explanation: "Decryption is done by subtracting the key’s letter values from the ciphertext letters."
    },
    {
      question: "Which modern cryptography concept was inspired by the polyalphabetic idea in Vigenère?",
      options: [
        "Public key cryptography",
        "Block cipher",
        "Stream cipher",
        "Quantum cryptography"
      ],
      answer: "Stream cipher",
      explanation: "Stream ciphers use varying keys like polyalphabetic ciphers to increase security."
    },
    {
      question: "What is the complexity of brute forcing a Vigenère cipher dependent on?",
      options: [
        "Size of the alphabet",
        "Length of the key",
        "Length of plaintext",
        "Speed of computer"
      ],
      answer: "Length of the key",
      explanation: "Longer keys increase the complexity of brute force attacks exponentially."
    },
    {
      question: "In the Vigenère cipher, what happens if the key is the letter 'A' repeated?",
      options: [
        "No encryption happens",
        "Plaintext shifts by 1",
        "Ciphertext is reversed",
        "Encryption is strongest"
      ],
      answer: "No encryption happens",
      explanation: "‘A’ corresponds to zero shift, so plaintext remains unchanged."
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
        <Link to="/c5-vigenere" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">Vigenère Cipher Quiz</h1>
        
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
              href="/vigenere-quizq.pdf" 
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

export default VigenereQuiz;
