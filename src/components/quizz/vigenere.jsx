import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

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
     
      <Link to="/c5-vigenere" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">Vigenère Cipher Quiz</h1>

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
            <Link to="/vigenere-tool" className="nav-button secondary">
              Back to Vigenère Tool
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VigenereQuiz;
