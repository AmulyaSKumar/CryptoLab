import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

const DESQuiz = () => {
  const questions = [
    {
      question: "What type of cipher is DES?",
      options: [
        "Stream cipher",
        "Block cipher",
        "Substitution cipher",
        "Transposition cipher"
      ],
      answer: "Block cipher",
      explanation: "DES is a block cipher encrypting data in 64-bit blocks."
    },
    {
      question: "What is the block size of DES?",
      options: ["56 bits", "64 bits", "128 bits", "32 bits"],
      answer: "64 bits",
      explanation: "DES processes data in 64-bit blocks."
    },
    {
      question: "What is the key size of DES?",
      options: ["56 bits", "64 bits", "128 bits", "112 bits"],
      answer: "56 bits",
      explanation: "Although key input is 64 bits, only 56 bits are used as key."
    },
    {
      question: "How many rounds of processing does DES use?",
      options: ["8", "10", "16", "32"],
      answer: "16",
      explanation: "DES performs 16 rounds of Feistel network processing."
    },
    {
      question: "DES is based on which structure?",
      options: ["Feistel network", "Substitution-permutation network", "Caesar cipher", "Hill cipher"],
      answer: "Feistel network",
      explanation: "DES uses a Feistel structure for encryption and decryption."
    },
    {
      question: "What is the function of the S-boxes in DES?",
      options: [
        "Permute the bits",
        "Substitute bits to introduce non-linearity",
        "Generate keys",
        "Expand the block size"
      ],
      answer: "Substitute bits to introduce non-linearity",
      explanation: "S-boxes perform substitution to enhance security."
    },
    {
      question: "Which of these is NOT part of the DES round function?",
      options: [
        "Expansion permutation",
        "Key mixing (XOR)",
        "Substitution with S-boxes",
        "Hashing the block"
      ],
      answer: "Hashing the block",
      explanation: "Hashing is not part of the DES round function."
    },
    {
      question: "What is the role of the initial permutation (IP) in DES?",
      options: [
        "Encrypt the block",
        "Rearrange input bits for processing",
        "Generate the key",
        "Pad the input data"
      ],
      answer: "Rearrange input bits for processing",
      explanation: "IP rearranges bits but does not add security itself."
    },
    {
      question: "How is the DES key schedule generated?",
      options: [
        "By rotating key bits in each round",
        "By hashing the key",
        "By using a random key for each round",
        "By permuting and selecting bits from the key"
      ],
      answer: "By permuting and selecting bits from the key",
      explanation: "Key schedule uses permutation and rotation to generate round keys."
    },
    {
      question: "What is the length of each subkey used in DES rounds?",
      options: ["48 bits", "56 bits", "64 bits", "32 bits"],
      answer: "48 bits",
      explanation: "Each round uses a 48-bit subkey derived from the main key."
    },
    {
      question: "Which mode is commonly used with DES for encrypting multiple blocks?",
      options: ["ECB", "CBC", "CFB", "All of the above"],
      answer: "All of the above",
      explanation: "DES can be used in multiple modes like ECB, CBC, CFB, etc."
    },
    {
      question: "What is a major weakness of DES today?",
      options: [
        "Small key size vulnerable to brute force",
        "Too slow for modern use",
        "Cannot encrypt binary data",
        "Not well documented"
      ],
      answer: "Small key size vulnerable to brute force",
      explanation: "56-bit key is now too short, vulnerable to brute-force attacks."
    },
    {
      question: "What does the 'E' expansion permutation do in DES?",
      options: [
        "Expands 32-bit half-block to 48 bits",
        "Compresses 64-bit block to 32 bits",
        "Generates keys",
        "Permutes the ciphertext"
      ],
      answer: "Expands 32-bit half-block to 48 bits",
      explanation: "The E expansion duplicates bits to match subkey length."
    },
    {
      question: "How does DES achieve diffusion?",
      options: [
        "Through substitution in S-boxes",
        "Through permutation and Feistel rounds",
        "By XOR with the key",
        "By compressing the data"
      ],
      answer: "Through permutation and Feistel rounds",
      explanation: "Multiple rounds and permutations spread plaintext bits across ciphertext."
    },
    {
      question: "What is the final permutation (FP) in DES?",
      options: [
        "It reverses the initial permutation",
        "It generates the key",
        "It pads the input",
        "It adds non-linearity"
      ],
      answer: "It reverses the initial permutation",
      explanation: "FP undoes the IP to produce final ciphertext."
    },
    {
      question: "In DES, what is the size of the right half-block processed each round?",
      options: ["64 bits", "32 bits", "16 bits", "48 bits"],
      answer: "32 bits",
      explanation: "DES splits 64-bit blocks into two 32-bit halves."
    },
    {
      question: "What cryptanalytic method was famously used to break DES?",
      options: [
        "Differential cryptanalysis",
        "Linear cryptanalysis",
        "Brute force",
        "All of the above"
      ],
      answer: "All of the above",
      explanation: "Various methods including brute force and differential attacks have been used."
    },
    {
      question: "Triple DES (3DES) increases security by:",
      options: [
        "Using three different keys to encrypt data",
        "Doubling block size",
        "Using a different algorithm",
        "Compressing the key"
      ],
      answer: "Using three different keys to encrypt data",
      explanation: "3DES applies DES encryption three times with different keys."
    },
    {
      question: "Why was DES replaced by AES as a standard?",
      options: [
        "AES supports larger keys and blocks",
        "DES was too slow",
        "AES is older",
        "DES was too complicated"
      ],
      answer: "AES supports larger keys and blocks",
      explanation: "AES offers better security with larger key sizes and block sizes."
    },
    {
      question: "Which organization originally developed DES?",
      options: [
        "NSA",
        "NIST",
        "IBM",
        "FBI"
      ],
      answer: "IBM",
      explanation: "IBM developed DES, then it was adopted as a standard by NIST."
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
      {/* Navigation */}
          <Link to="/c8-des" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">DES Cipher Quiz</h1>

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
            <Link to="/des-tool" className="nav-button secondary">
              Back to DES Tool
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DESQuiz;
