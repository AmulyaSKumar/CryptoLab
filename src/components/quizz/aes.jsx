import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AESQuiz = () => {
  const questions = [
    {
      question: "What type of cipher is AES?",
      options: [
        "Stream cipher",
        "Block cipher",
        "Substitution cipher",
        "Transposition cipher"
      ],
      answer: "Block cipher",
      explanation: "AES is a block cipher that encrypts data in fixed-size blocks."
    },
    {
      question: "What is the block size of AES?",
      options: ["128 bits", "192 bits", "256 bits", "64 bits"],
      answer: "128 bits",
      explanation: "AES operates on 128-bit blocks regardless of key size."
    },
    {
      question: "Which key sizes does AES support?",
      options: [
        "128, 192, and 256 bits",
        "56, 112, and 168 bits",
        "64, 128, and 256 bits",
        "32, 64, and 128 bits"
      ],
      answer: "128, 192, and 256 bits",
      explanation: "AES supports three key sizes: 128, 192, and 256 bits."
    },
    {
      question: "How many rounds does AES-128 use?",
      options: ["10", "12", "14", "16"],
      answer: "10",
      explanation: "AES-128 uses 10 rounds of processing."
    },
    {
      question: "How many rounds does AES-256 use?",
      options: ["10", "12", "14", "16"],
      answer: "14",
      explanation: "AES-256 uses 14 rounds of processing."
    },
    {
      question: "AES is based on which mathematical structure?",
      options: [
        "Substitution-permutation network",
        "Feistel network",
        "Hill cipher",
        "One-time pad"
      ],
      answer: "Substitution-permutation network",
      explanation: "AES uses a substitution-permutation network for encryption."
    },
    {
      question: "What is the size of the AES state?",
      options: ["4x4 bytes", "8x8 bytes", "2x2 bytes", "16x16 bytes"],
      answer: "4x4 bytes",
      explanation: "AES state is a 4x4 matrix of bytes (128 bits)."
    },
    {
      question: "Which step in AES provides diffusion?",
      options: [
        "ShiftRows",
        "SubBytes",
        "AddRoundKey",
        "KeyExpansion"
      ],
      answer: "ShiftRows",
      explanation: "ShiftRows shifts bytes in rows to spread the data (diffusion)."
    },
    {
      question: "Which AES step provides non-linearity?",
      options: [
        "SubBytes",
        "MixColumns",
        "AddRoundKey",
        "ShiftRows"
      ],
      answer: "SubBytes",
      explanation: "SubBytes uses S-box substitutions introducing non-linearity."
    },
    {
      question: "What does the MixColumns step do?",
      options: [
        "Performs matrix multiplication to mix bytes within a column",
        "Shifts the bytes in each row",
        "Adds the round key",
        "Expands the key"
      ],
      answer: "Performs matrix multiplication to mix bytes within a column",
      explanation: "MixColumns mixes the data within each column to enhance diffusion."
    },
    {
      question: "What is the AddRoundKey step in AES?",
      options: [
        "XORing the state with the round key",
        "Substituting bytes with S-box",
        "Shifting rows",
        "Mixing columns"
      ],
      answer: "XORing the state with the round key",
      explanation: "AddRoundKey mixes the current round key by XOR operation."
    },
    {
      question: "How is the AES key schedule generated?",
      options: [
        "Using the Rijndael key schedule algorithm",
        "Using a Feistel network",
        "Randomly for each round",
        "Using DES key schedule"
      ],
      answer: "Using the Rijndael key schedule algorithm",
      explanation: "AES uses Rijndael key schedule to derive round keys."
    },
    {
      question: "Which AES mode provides confidentiality without integrity?",
      options: [
        "ECB",
        "GCM",
        "CCM",
        "Authenticated Encryption"
      ],
      answer: "ECB",
      explanation: "ECB mode encrypts blocks independently and is vulnerable to pattern leaks."
    },
    {
      question: "Which mode of AES combines encryption and authentication?",
      options: [
        "GCM (Galois/Counter Mode)",
        "CBC",
        "CFB",
        "ECB"
      ],
      answer: "GCM (Galois/Counter Mode)",
      explanation: "GCM mode provides both confidentiality and data authenticity."
    },
    {
      question: "Why is ECB mode generally discouraged?",
      options: [
        "Because it leaks data patterns",
        "Because it is slow",
        "Because it requires a large key",
        "Because it is only for streaming"
      ],
      answer: "Because it leaks data patterns",
      explanation: "ECB encrypts identical plaintext blocks to identical ciphertext blocks."
    },
    {
      question: "AES was selected as the standard by which organization?",
      options: [
        "NIST",
        "NSA",
        "FBI",
        "IBM"
      ],
      answer: "NIST",
      explanation: "NIST selected AES as the encryption standard in 2001."
    },
    {
      question: "Which algorithm was AES designed to replace?",
      options: [
        "DES",
        "Blowfish",
        "RC4",
        "Twofish"
      ],
      answer: "DES",
      explanation: "AES replaced DES due to DES’s shorter key size and vulnerabilities."
    },
    {
      question: "How does AES resist differential and linear cryptanalysis?",
      options: [
        "Through multiple rounds of substitution and permutation",
        "By using very large keys",
        "By hashing the plaintext",
        "By compressing data"
      ],
      answer: "Through multiple rounds of substitution and permutation",
      explanation: "The design of AES provides strong resistance to such attacks."
    },
    {
      question: "What is the minimum recommended key size for AES to be secure today?",
      options: [
        "128 bits",
        "56 bits",
        "64 bits",
        "256 bits"
      ],
      answer: "128 bits",
      explanation: "AES-128 is currently considered secure, though 256-bit is preferred for extra security."
    },
    {
      question: "In AES, which operation is applied last in each round except the final?",
      options: [
        "MixColumns",
        "AddRoundKey",
        "SubBytes",
        "ShiftRows"
      ],
      answer: "AddRoundKey",
      explanation: "AddRoundKey is the last step in each round to combine data with the round key."
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
    <div className="main-container" style={{ maxWidth: 650, margin: '2rem auto', padding: '1rem' }}>
      
      <Link to="/c9-aes" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">AES Cipher Quiz</h1>

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
              You scored {score} out of {questions.length}!
            </div>
            <a href="/aes-quiz.pdf" className="nav-button" target="_blank" rel="noopener noreferrer" style={{ marginBottom: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={{ marginRight: '8px' }} viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Download Quiz PDF
            </a>
            <button className="nav-button" onClick={handleRestart} style={{ marginBottom: '1rem' }}>
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AESQuiz;
