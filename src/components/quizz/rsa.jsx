import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../quizz/QuizStyles.css";

const RSAQuiz = () => {
  const questions = [
    {
      question: "What type of cryptographic algorithm is RSA?",
      options: [
        "Symmetric key algorithm",
        "Asymmetric key algorithm",
        "Hash function",
        "Stream cipher",
      ],
      answer: "Asymmetric key algorithm",
      explanation:
        "RSA is an asymmetric algorithm using a public and private key pair.",
    },
    {
      question: "RSA is based on the difficulty of which mathematical problem?",
      options: [
        "Integer factorization",
        "Discrete logarithm",
        "Elliptic curves",
        "Modular exponentiation",
      ],
      answer: "Integer factorization",
      explanation:
        "RSA’s security relies on the difficulty of factoring large composite numbers.",
    },
    {
      question: "In RSA, what do the public and private keys consist of?",
      options: [
        "Public key: (e, n); Private key: (d, n)",
        "Public key: (d, n); Private key: (e, n)",
        "Public key: (p, q); Private key: (n, e)",
        "Public key: (d, p); Private key: (e, q)",
      ],
      answer: "Public key: (e, n); Private key: (d, n)",
      explanation:
        "Public key is the exponent e and modulus n; private key is exponent d and modulus n.",
    },
    {
      question: "How is the modulus n computed in RSA?",
      options: [
        "n = p × q",
        "n = p + q",
        "n = e × d",
        "n = e + d",
      ],
      answer: "n = p × q",
      explanation:
        "The modulus n is the product of two large primes p and q.",
    },
    {
      question: "What is the role of Euler's Totient function φ(n) in RSA?",
      options: [
        "To help compute the private key d",
        "To encrypt the message",
        "To decrypt the message",
        "To generate random keys",
      ],
      answer: "To help compute the private key d",
      explanation:
        "φ(n) = (p-1)(q-1) is used to find d such that d × e ≡ 1 mod φ(n).",
    },
    {
      question: "Which equation must hold true between e and d in RSA?",
      options: [
        "e × d ≡ 1 (mod φ(n))",
        "e + d = n",
        "e × d = p × q",
        "e - d = φ(n)",
      ],
      answer: "e × d ≡ 1 (mod φ(n))",
      explanation:
        "The private exponent d is the modular inverse of e modulo φ(n).",
    },
    {
      question: "What is the typical choice for the public exponent e?",
      options: [
        "65537",
        "3",
        "17",
        "Any random large number",
      ],
      answer: "65537",
      explanation:
        "65537 is commonly chosen because it is a prime and efficient for encryption.",
    },
    {
      question: "How does RSA encryption work?",
      options: [
        "Ciphertext = plaintext^e mod n",
        "Ciphertext = plaintext^d mod n",
        "Ciphertext = (plaintext + e) mod n",
        "Ciphertext = (plaintext × d) mod n",
      ],
      answer: "Ciphertext = plaintext^e mod n",
      explanation:
        "Encryption raises the plaintext to the power of e modulo n.",
    },
    {
      question: "How does RSA decryption work?",
      options: [
        "Plaintext = ciphertext^d mod n",
        "Plaintext = ciphertext^e mod n",
        "Plaintext = (ciphertext - d) mod n",
        "Plaintext = (ciphertext × e) mod n",
      ],
      answer: "Plaintext = ciphertext^d mod n",
      explanation:
        "Decryption raises the ciphertext to the power of d modulo n.",
    },
    {
      question: "Why must p and q be large prime numbers?",
      options: [
        "To make factoring n difficult",
        "To speed up encryption",
        "To simplify key generation",
        "To reduce key size",
      ],
      answer: "To make factoring n difficult",
      explanation:
        "Large primes ensure n is hard to factor, securing RSA.",
    },
    {
      question: "Which of the following is a major weakness if implemented incorrectly in RSA?",
      options: [
        "Using small or predictable primes",
        "Choosing a large e",
        "Encrypting with d",
        "Using large modulus n",
      ],
      answer: "Using small or predictable primes",
      explanation:
        "Small or predictable primes make it easy to factor n and break RSA.",
    },
    {
      question: "What is the purpose of padding schemes like OAEP in RSA?",
      options: [
        "To prevent certain attacks and ensure semantic security",
        "To compress the message",
        "To speed up encryption",
        "To generate keys",
      ],
      answer: "To prevent certain attacks and ensure semantic security",
      explanation:
        "Padding helps defend against chosen plaintext and other attacks.",
    },
    {
      question: "What does RSA digital signature provide?",
      options: [
        "Authentication and integrity",
        "Encryption only",
        "Compression",
        "Key exchange",
      ],
      answer: "Authentication and integrity",
      explanation:
        "Signatures verify the sender’s identity and that data hasn’t been altered.",
    },
    {
      question: "Which operation is used for signing in RSA?",
      options: [
        "Signature = message^d mod n",
        "Signature = message^e mod n",
        "Signature = message × d mod n",
        "Signature = message × e mod n",
      ],
      answer: "Signature = message^d mod n",
      explanation:
        "The signer uses the private key exponent d to generate the signature.",
    },
    {
      question: "What is a common key size for RSA today to ensure security?",
      options: [
        "2048 bits or higher",
        "512 bits",
        "1024 bits",
        "256 bits",
      ],
      answer: "2048 bits or higher",
      explanation:
        "2048-bit keys are currently recommended; smaller keys are vulnerable.",
    },
    {
      question: "Why is RSA considered slower than symmetric algorithms like AES?",
      options: [
        "Because of complex mathematical operations on large numbers",
        "Because it uses longer keys",
        "Because it encrypts larger blocks",
        "Because it uses multiple rounds",
      ],
      answer: "Because of complex mathematical operations on large numbers",
      explanation:
        "RSA uses modular exponentiation on large numbers, which is computationally intensive.",
    },
    {
      question: "What is hybrid encryption?",
      options: [
        "Using RSA to encrypt a symmetric key, then AES to encrypt data",
        "Using RSA alone for all encryption",
        "Using AES to encrypt the RSA keys",
        "Using symmetric encryption only",
      ],
      answer: "Using RSA to encrypt a symmetric key, then AES to encrypt data",
      explanation:
        "Hybrid encryption combines strengths of asymmetric and symmetric cryptography.",
    },
    {
      question: "Which of these is NOT an RSA usage?",
      options: [
        "Encrypting large data files directly",
        "Key exchange",
        "Digital signatures",
        "Secure communication setup",
      ],
      answer: "Encrypting large data files directly",
      explanation:
        "RSA is usually not used for large data due to inefficiency; symmetric keys encrypt data instead.",
    },
    {
      question: "What is the RSA assumption?",
      options: [
        "Factoring n is hard",
        "Discrete log is hard",
        "Hashing is one-way",
        "Primes are easy to find",
      ],
      answer: "Factoring n is hard",
      explanation:
        "RSA’s security assumes factoring the modulus n is computationally infeasible.",
    },
  ];

  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [revealed, setRevealed] = useState(Array(questions.length).fill(false));

  const handleOptionClick = (questionIndex, option) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = option;
    setUserAnswers(newAnswers);
    
    // Auto-reveal answer when option is clicked
    const newRevealed = [...revealed];
    newRevealed[questionIndex] = true;
    setRevealed(newRevealed);
  };

  const resetQuiz = () => {
    setUserAnswers(Array(questions.length).fill(null));
    setRevealed(Array(questions.length).fill(false));
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return answer === questions[index].answer ? score + 1 : score;
    }, 0);
  };

  const calculatePercentage = () => {
    const score = calculateScore();
    return Math.round((score / questions.length) * 100);
  };

  return (
    <div className="main-container">
      <div className="back-nav">
        <Link to="/c10-rsa" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">RSA Cipher Quiz</h1>
        
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
              href="/rsa-quizq.pdf" 
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

export default RSAQuiz;
