import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

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

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionClick = (option) => {
    if (!submitted) {
      setSelected(option);
    }
  };

  const handleNext = () => {
    if (!submitted) {
      if (selected === questions[current].answer) {
        setScore(score + 1);
      }
      setSubmitted(true);
    } else {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
        setSubmitted(false);
      } else {
        setShowResult(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setSubmitted(false);
  };

  return (
    <div className="main-container" style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
     

      <Link to="/c3-hill" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">Hill Cipher Quiz</h1>

        {!showResult ? (
          <>
            <div className="input-group">
              <label>Question {current + 1} of {questions.length}</label>
              <div className="box" style={{ padding: '1rem', fontWeight: 'bold' }}>
                {questions[current].question}
              </div>
            </div>

            <div className="input-group">
              {questions[current].options.map((opt, idx) => {
                let style = {
                  width: '100%',
                  marginBottom: '0.5rem',
                  cursor: submitted ? 'default' : 'pointer',
                  pointerEvents: submitted ? 'none' : 'auto',
                  border: '3px solid transparent',
                  backgroundColor: 'white',
                  color: 'black',
                  textAlign: 'left',
                  padding: '0.6rem 1rem',
                  fontSize: '1rem',
                  borderRadius: '5px',
                  transition: 'all 0.3s ease',
                };

                if (!submitted && selected === opt) {
                  style.backgroundColor = '#cce5ff';
                  style.borderColor = '#339af0';
                }

                if (submitted) {
                  if (opt === questions[current].answer) {
                    style.borderColor = 'green';
                    style.backgroundColor = '#d4edda';
                    style.color = 'green';
                  } else if (opt === selected) {
                    style.borderColor = 'red';
                    style.backgroundColor = '#f8d7da';
                    style.color = 'red';
                  }
                }

                return (
                  <div key={idx}>
                    <button
                      onClick={() => handleOptionClick(opt)}
                      className="nav-button"
                      style={style}
                    >
                      {opt}
                    </button>

                    {submitted && selected === opt && (
                      <div style={{ marginTop: '0.3rem', color: style.borderColor, fontStyle: 'italic' }}>
                        {questions[current].explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={selected === null}
              className="nav-button"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {submitted ? (current < questions.length - 1 ? 'Next' : 'Finish') : 'Submit'}
            </button>
          </>
        ) : (
          <div className="input-group" style={{ textAlign: 'center' }}>
            <div className="result-box" style={{ padding: '1.5rem', fontSize: '1.2rem', marginBottom: '1rem' }}>
              You've completed the quiz!
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="/hill-quiz.pdf" className="nav-button" target="_blank" rel="noopener noreferrer" style={{ marginBottom: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={{ marginRight: '8px' }} viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                Download Quiz PDF
              </a>
              <button className="nav-button" onClick={handleRestart} style={{ marginBottom: '0.5rem' }}>
                Restart Quiz
              </button>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HillCipherQuiz;
