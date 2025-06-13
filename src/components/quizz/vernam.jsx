import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

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
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem' }}>
        <Link to="/vernam-tool" className="nav-button secondary">Tools</Link>
        <Link to="/trychallenge" className="nav-button secondary">Try Challenge</Link>
      </nav>

      <Link to="/" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">Vernam Cipher Quiz</h1>

        {!showResult ? (
          <>
            <div className="input-group">
              <label>Question {current + 1} of {questions.length}</label>
              <div className="result-box" style={{ padding: '1rem', fontWeight: 'bold' }}>
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
              You scored {score} out of {questions.length}!
            </div>
            <button className="nav-button" onClick={handleRestart} style={{ marginBottom: '1rem' }}>
              Restart Quiz
            </button>
            <Link to="/vernam-tool" className="nav-button secondary">
              Back to Vernam Tool
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VernamQuiz;
