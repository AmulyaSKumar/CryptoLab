import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import './QuizStyles.css';

const OneTimePadQuiz = () => {
  const questions = [
    {
      question: "What is the key characteristic of a One-Time Pad (OTP)?",
      options: [
        "Key is reused multiple times",
        "Key is truly random and used once",
        "Key is derived from plaintext",
        "Key is a fixed pattern"
      ],
      answer: "Key is truly random and used once",
      explanation: "The One-Time Pad key must be random, as long as the message, and used only once for perfect secrecy."
    },
    {
      question: "What type of cipher is the One-Time Pad considered?",
      options: [
        "Symmetric substitution cipher",
        "Asymmetric cipher",
        "Stream cipher",
        "Block cipher"
      ],
      answer: "Stream cipher",
      explanation: "OTP is a type of stream cipher encrypting one bit or character at a time."
    },
    {
      question: "Why is the One-Time Pad theoretically unbreakable?",
      options: [
        "Because the key is kept secret",
        "Because the key is random and as long as the message",
        "Because it uses complex math",
        "Because it uses multiple rounds"
      ],
      answer: "Because the key is random and as long as the message",
      explanation: "Perfect secrecy is achieved when the key is truly random, never reused, and at least as long as the message."
    },
    {
      question: "What operation is commonly used in One-Time Pad encryption?",
      options: [
        "Modular exponentiation",
        "Bitwise XOR",
        "Matrix multiplication",
        "Substitution"
      ],
      answer: "Bitwise XOR",
      explanation: "Encryption is done by XORing each bit/character of the plaintext with the corresponding key bit/character."
    },
    {
      question: "What happens if the One-Time Pad key is reused?",
      options: [
        "It becomes unbreakable",
        "Security is severely compromised",
        "Nothing changes",
        "The message is corrupted"
      ],
      answer: "Security is severely compromised",
      explanation: "Key reuse allows attackers to perform statistical analysis, eliminating the perfect secrecy property."
    },
    {
      question: "Claude Shannon proved that One-Time Pad offers:",
      options: [
        "Probabilistic security",
        "Perfect secrecy",
        "Computational security",
        "Partial security"
      ],
      answer: "Perfect secrecy",
      explanation: "Shannon proved mathematically that OTP provides perfect secrecy when implemented correctly."
    },
    {
      question: "What is a practical limitation of One-Time Pad?",
      options: [
        "It's too slow",
        "It's easily broken",
        "Key distribution and management",
        "It's too simple"
      ],
      answer: "Key distribution and management",
      explanation: "The requirement for secure key exchange and storage of keys as long as all messages is a major practical limitation."
    },
    {
      question: "If an OTP message is 10,000 bits long, how long must the key be?",
      options: [
        "100 bits",
        "1,000 bits",
        "At least 10,000 bits",
        "10,000 bits times 8"
      ],
      answer: "At least 10,000 bits",
      explanation: "The key must be at least as long as the message for theoretical security."
    },
    {
      question: "Which organization famously used One-Time Pads?",
      options: [
        "Amazon",
        "KGB and CIA during Cold War",
        "World Health Organization",
        "Internet Engineering Task Force"
      ],
      answer: "KGB and CIA during Cold War",
      explanation: "Intelligence agencies like the KGB and CIA used OTP for highly secure communications."
    },
    {
      question: "What form of One-Time Pad was used before computers?",
      options: [
        "Binary OTP",
        "Linguistic OTP",
        "Paper pads with random characters",
        "Quantum OTP"
      ],
      answer: "Paper pads with random characters",
      explanation: "Physical pads with randomly generated characters were used, giving the cipher its name."
    }
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false);

  const handleOptionClick = (opt) => {
    if (!submitted) {
      setSelected(opt);
      setShowAnswerExplanation(false);
    }
  };

  const handleNext = () => {
    if (!submitted) {
      setSubmitted(true);
      if (selected === questions[current].answer) {
        setScore(score + 1);
      }
      setShowAnswerExplanation(true);
    } else {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
        setSubmitted(false);
        setShowAnswerExplanation(false);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setSubmitted(false);
    setQuizCompleted(false);
    setShowAnswerExplanation(false);
  };

  const calculateProgress = () => {
    return ((current + 1) / questions.length) * 100;
  };

  return (
    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: 20, left: 20 }}>← Back</Link>
      <div className="quiz-container">
        <h1 className="quiz-title">One-Time Pad Quiz</h1>
        
        {!quizCompleted ? (
          <>
            <div className="quiz-progress">
              <div className="progress-text">Question {current + 1} of {questions.length}</div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="question-container">
              <h3 className="question-text">{questions[current].question}</h3>
              
              <div className="options-container">
                {questions[current].options.map((opt, idx) => {
                  let optionClass = "option-button";
                  
                  if (!submitted && selected === opt) {
                    optionClass += " selected";
                  }
                  
                  if (submitted) {
                    if (opt === questions[current].answer) {
                      optionClass += " correct";
                    } else if (opt === selected && opt !== questions[current].answer) {
                      optionClass += " incorrect";
                    }
                  }
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt)}
                      className={optionClass}
                      disabled={submitted}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              
              {showAnswerExplanation && (
                <div className="explanation-box">
                  <div className="explanation-title">
                    {selected === questions[current].answer ? 
                      "✅ Correct!" : 
                      "❌ Incorrect. The correct answer is: " + questions[current].answer
                    }
                  </div>
                  <div className="explanation-text">
                    {questions[current].explanation}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="quiz-button primary"
            >
              {submitted ? (current < questions.length - 1 ? 'Next Question' : 'See Results') : 'Submit Answer'}
            </button>
          </>
        ) : (
          <div className="results-container">
            <h2 className="results-title">Quiz Completed!</h2>
            <div className="results-score">
              You scored <span>{score}</span> out of <span>{questions.length}</span>
              <div className="score-percentage">
                ({Math.round((score/questions.length) * 100)}%)
              </div>
            </div>
            
            <div className="results-message">
              {score === questions.length ? 
                "🎉 Perfect score! You're an OTP master!" : 
                score >= questions.length * 0.8 ? 
                "🌟 Great job! You have a solid understanding of One-Time Pads." :
                score >= questions.length * 0.6 ?
                "👍 Good effort! You know the basics of One-Time Pads." :
                "📚 Keep studying! One-Time Pads have some challenging concepts."
              }
            </div>
            
            <div className="results-buttons">
              <button className="quiz-button primary" onClick={handleRestart}>
                Try Again
              </button>
              <Link to="/c4-otp" className="quiz-button secondary">
                Go to OTP Tool
              </Link>
              <Link to="/" className="quiz-button secondary">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OneTimePadQuiz;
