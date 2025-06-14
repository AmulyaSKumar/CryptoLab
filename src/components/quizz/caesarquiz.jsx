import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

const CaesarCipherQuiz = () => {
  const questions = [
    {
      question: "What is the Caesar Cipher primarily used for?",
      options: ["Data compression", "Encrypting text", "Sorting data", "Decoding barcodes"],
      answer: "Encrypting text",
      explanation: "The Caesar Cipher is a type of substitution cipher used mainly for encrypting text by shifting letters."
    },
    {
      question: "If 'A' becomes 'D', what is the shift key?",
      options: ["2", "3", "4", "5"],
      answer: "3",
      explanation: "Since A shifted to D is a shift of 3 letters forward, the key is 3."
    },
    {
      question: "What happens if you apply Caesar Cipher twice with key 13?",
      options: ["You get the original text", "It becomes undecipherable", "It's encrypted stronger", "It loops endlessly"],
      answer: "You get the original text",
      explanation: "Applying the cipher twice with a key of 13 returns you to the original text because 13 is half the alphabet length."
    },
    {
      question: "Which of these letters does NOT change with a Caesar Cipher key of 0?",
      options: ["A", "M", "Z", "All of them"],
      answer: "All of them",
      explanation: "A shift key of 0 means no change; all letters remain the same."
    },
    {
  question: "Why is the Caesar Cipher considered a weak encryption method?",
  options: [
    "It uses complex mathematical functions",
    "It can be easily broken by frequency analysis",
    "It requires a large key",
    "It encrypts binary data only"
  ],
  answer: "It can be easily broken by frequency analysis",
  explanation: "Caesar Cipher shifts letters uniformly and does not disguise letter frequency, making it vulnerable to simple frequency analysis."
},
{
  question: "What is the size of the key space for a Caesar Cipher applied to the English alphabet?",
  options: ["26", "25", "128", "256"],
  answer: "25",
  explanation: "Because a shift of 0 or 26 results in the original text, there are only 25 meaningful keys."
},
{
  question: "How does the Caesar Cipher handle non-alphabetic characters like numbers or punctuation?",
  options: [
    "Encrypts them the same way as letters",
    "Leaves them unchanged",
    "Removes them",
    "Converts them to letters before encrypting"
  ],
  answer: "Leaves them unchanged",
  explanation: "Typically, Caesar Cipher only shifts alphabetic characters and leaves others like numbers and punctuation unchanged."
},
{
  question: "Explain how to decrypt a message encoded with a Caesar Cipher if the key is unknown.",
  options: [
    "Try all possible shifts (brute force)",
    "Use a one-time pad",
    "Apply the same key twice",
    "Use a hash function"
  ],
  answer: "Try all possible shifts (brute force)",
  explanation: "Since the key space is small, one can try all 25 possible shifts and check which one produces meaningful text."
},
{
  question: "Is the Caesar Cipher symmetric or asymmetric encryption? Why?",
  options: [
    "Symmetric, because the same key is used for encryption and decryption",
    "Asymmetric, because it uses two different keys",
    "Symmetric, because it uses public keys",
    "Asymmetric, because it uses private keys"
  ],
  answer: "Symmetric, because the same key is used for encryption and decryption",
  explanation: "Caesar Cipher uses the same key (the shift value) for both encrypting and decrypting, making it symmetric encryption."
},
{
  question: "Can the Caesar Cipher be used securely for modern communication? Explain.",
  options: [
    "Yes, because it's very complex",
    "No, because it's easily broken",
    "Yes, if the key is very large",
    "No, because it only encrypts numbers"
  ],
  answer: "No, because it's easily broken",
  explanation: "The Caesar Cipher is too simple and vulnerable to attacks, so it’s not suitable for secure modern communication."
},
{
  question: "What is the relationship between Caesar Cipher and ROT13?",
  options: [
    "ROT13 is a Caesar Cipher with a shift of 13",
    "ROT13 is a type of hash function",
    "ROT13 doubles the shift each time",
    "ROT13 is unrelated to Caesar Cipher"
  ],
  answer: "ROT13 is a Caesar Cipher with a shift of 13",
  explanation: "ROT13 is a special case of Caesar Cipher where the shift key is fixed at 13."
},
{
  question: "If you apply the Caesar Cipher with a shift of 26 to any text, what is the result?",
  options: [
    "The original text",
    "The text is fully scrambled",
    "Only vowels are shifted",
    "An error occurs"
  ],
  answer: "The original text",
  explanation: "A shift of 26 equals the alphabet length, so the text remains unchanged."
},
{
  question: "Can the Caesar Cipher be combined with other ciphers for better security? Give an example.",
  options: [
    "Yes, for example combining with Vigenère Cipher",
    "No, it cannot be combined",
    "Yes, it encrypts images better",
    "No, it’s a hashing algorithm"
  ],
  answer: "Yes, for example combining with Vigenère Cipher",
  explanation: "Caesar Cipher can be part of a multi-layer encryption system to increase security, such as in polyalphabetic ciphers like Vigenère."
}

  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track if answer submitted

  const handleOptionClick = (option) => {
    if (!submitted) {
      setSelected(option);
    }
  };

  const handleNext = () => {
    if (!submitted) {
      // Submit answer
      if (selected === questions[current].answer) {
        setScore(score + 1);
      }
      setSubmitted(true);
    } else {
      // Next question or show results
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
     
      <Link to="/c1-caesar" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">Caesar Cipher Quiz</h1>

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
                // Before submitting: highlight selected with blue bg
                // After submitting: green border for correct, red border for wrong selected
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
                  style.backgroundColor = '#cce5ff'; // light blue
                  style.borderColor = '#339af0'; // blue border
                }

                if (submitted) {
                  if (opt === questions[current].answer) {
                    style.borderColor = 'green';
                    style.backgroundColor = '#d4edda'; // light green
                    style.color = 'green';
                  } else if (opt === selected) {
                    style.borderColor = 'red';
                    style.backgroundColor = '#f8d7da'; // light red
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

                    {/* Explanation below selected after submission */}
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
            <Link to="/caesarcipher" className="nav-button secondary">
              Back to Caesar Tool
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaesarCipherQuiz;
