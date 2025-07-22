import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import './QuizStyles.css';

const PlayfairCipherQuiz = () => {
  const questions = [
    {
      question: "What is the main idea behind the Playfair cipher?",
      options: [
        "Using a 5x5 letter matrix for encryption",
        "Shifting letters by a fixed key",
        "Replacing letters with numbers",
        "Using prime numbers for key generation"
      ],
      answer: "Using a 5x5 letter matrix for encryption",
      explanation: "Playfair cipher encrypts pairs of letters using a 5x5 matrix constructed from a keyword."
    },
    {
      question: "If you have the keyword 'MONARCHY', how do you construct the matrix?",
      options: [
        "Fill matrix row-wise with keyword letters, then remaining alphabet (I/J combined)",
        "Write keyword vertically, then horizontally",
        "Random letters excluding keyword",
        "Use only vowels from keyword"
      ],
      answer: "Fill matrix row-wise with keyword letters, then remaining alphabet (I/J combined)",
      explanation: "You place the unique letters of the keyword first, then fill remaining spots with other letters (I and J share a cell)."
    },
    {
      question: "Why are the letters I and J combined in the Playfair cipher matrix?",
      options: [
        "Because Playfair uses a 25-letter matrix",
        "To make encryption faster",
        "To confuse attackers",
        "To avoid vowels"
      ],
      answer: "Because Playfair uses a 25-letter matrix",
      explanation: "English alphabet has 26 letters but the 5x5 matrix has only 25 cells, so I and J are combined."
    },
    {
      question: "How do you encrypt a pair of identical letters in Playfair cipher?",
      options: [
        "Insert an 'X' between them",
        "Skip the second letter",
        "Use a different matrix",
        "Replace with numbers"
      ],
      answer: "Insert an 'X' between them",
      explanation: "Identical letters in a pair are separated by adding an 'X' to prevent confusion in encryption."
    },
    {
      question: "Explain what happens if a pair of letters are in the same row of the matrix during encryption.",
      options: [
        "Each letter is replaced by the letter to its right, wrapping around",
        "They remain unchanged",
        "Each letter is replaced by the letter below it",
        "Each letter is swapped"
      ],
      answer: "Each letter is replaced by the letter to its right, wrapping around",
      explanation: "If both letters are in the same row, you replace each with the letter immediately to the right, cycling back to the start if needed."
    },
    {
      question: "What if the letters are in the same column?",
      options: [
        "Replace each letter with the letter below it, wrapping to top",
        "Replace each letter with the letter to its right",
        "Replace with letters in diagonal",
        "Leave them unchanged"
      ],
      answer: "Replace each letter with the letter below it, wrapping to top",
      explanation: "If letters share a column, each is replaced by the letter below it in that column, wrapping to the top if at the bottom."
    },
    {
      question: "If letters form a rectangle in the matrix, how do you encrypt them?",
      options: [
        "Each letter is replaced by the letter in its row but the other letter's column",
        "Swap the letters",
        "Use a random letter",
        "Skip encryption"
      ],
      answer: "Each letter is replaced by the letter in its row but the other letter's column",
      explanation: "Letters at rectangle corners swap columns but keep their own row during encryption."
    },
    {
      question: "Why is Playfair considered more secure than Caesar cipher?",
      options: [
        "Because it encrypts digraphs instead of single letters",
        "Because it uses a larger key",
        "Because it uses numbers",
        "Because it is a hash function"
      ],
      answer: "Because it encrypts digraphs instead of single letters",
      explanation: "Encrypting letter pairs (digraphs) hides letter frequency patterns better than single-letter substitution."
    },
    {
      question: "How does Playfair cipher handle letters that don't form a pair, like a single leftover letter?",
      options: [
        "Add an 'X' or 'Z' to complete the pair",
        "Ignore the leftover letter",
        "Encrypt only the leftover letter",
        "Double the leftover letter"
      ],
      answer: "Add an 'X' or 'Z' to complete the pair",
      explanation: "If the message length is odd, an extra filler letter like 'X' is added to make pairs complete."
    },
    {
      question: "Can Playfair cipher be broken easily? How?",
      options: [
        "It’s more complex but still vulnerable to frequency analysis of digraphs",
        "No, it is unbreakable",
        "Only with quantum computers",
        "By guessing the key directly"
      ],
      answer: "It’s more complex but still vulnerable to frequency analysis of digraphs",
      explanation: "While harder than Caesar, Playfair is still breakable with enough ciphertext and analysis of digraph frequency."
    },
    {
      question: "What would be a typical first step to decrypt a Playfair cipher if the key is unknown?",
      options: [
        "Try possible keywords or use frequency analysis of digraphs",
        "Try all possible shifts like Caesar cipher",
        "Use a dictionary attack on single letters",
        "Decrypt using a hash function"
      ],
      answer: "Try possible keywords or use frequency analysis of digraphs",
      explanation: "Attackers attempt to guess the keyword or analyze common digraphs to break the cipher."
    },
    {
      question: "Why does the Playfair cipher ignore the letter 'J' or combine it with 'I'?",
      options: [
        "To fit the alphabet into a 5x5 matrix",
        "To make the cipher more secure",
        "Because 'J' is a vowel",
        "To confuse attackers"
      ],
      answer: "To fit the alphabet into a 5x5 matrix",
      explanation: "The matrix is 5x5=25 cells, so one letter must be merged or excluded, usually 'I' and 'J' are combined."
    },
    {
      question: "What happens if the keyword contains repeated letters in Playfair cipher?",
      options: [
        "Only the first occurrence is used in the matrix",
        "All repeated letters are included",
        "The keyword is rejected",
        "Repeated letters are replaced with numbers"
      ],
      answer: "Only the first occurrence is used in the matrix",
      explanation: "Duplicate letters in the keyword are ignored when constructing the matrix to keep letters unique."
    },
    {
      question: "Explain why Playfair cipher is categorized as a digraph substitution cipher.",
      options: [
        "Because it encrypts letters in pairs (digraphs)",
        "Because it uses a 2x2 matrix",
        "Because it substitutes digits for letters",
        "Because it uses two keys"
      ],
      answer: "Because it encrypts letters in pairs (digraphs)",
      explanation: "Playfair encrypts pairs of letters at a time, rather than one letter individually."
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
        <Link to="/c2-playfair" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">Playfair Cipher Quiz</h1>
        
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
              href="/playfair-quizq.pdf" 
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

export default PlayfairCipherQuiz;
