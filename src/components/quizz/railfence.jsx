import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

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
        <Link to="/railfence-tool" className="nav-button secondary">Tools</Link>
        <Link to="/trychallenge" className="nav-button secondary">Try Challenge</Link>
      </nav>

      <Link to="/" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">Railfence Cipher Quiz</h1>

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
            <Link to="/railfence-tool" className="nav-button secondary">
              Back to Railfence Tool
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RailfenceQuiz;
