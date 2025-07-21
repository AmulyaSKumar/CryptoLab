import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
      setSubmitted(true);
    }
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(null);
      setSubmitted(false);
    }
  };
  
  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setSubmitted(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Vigenère Cipher Quiz Results', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Your completed quiz with answers and explanations', 105, 25, { align: 'center' });
    
    // Add date
    const today = new Date();
    doc.setFontSize(10);
    doc.text(`Generated on: ${today.toLocaleDateString()}`, 105, 35, { align: 'center' });
    
    // Add content for each question
    let yPos = 45;
    
    questions.forEach((q, index) => {
      // Add question
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Question ${index + 1}: ${q.question}`, 15, yPos);
      yPos += 10;
      
      // Add options
      doc.setFont(undefined, 'normal');
      q.options.forEach((opt, idx) => {
        const isCorrect = opt === q.answer;
        doc.setTextColor(isCorrect ? [0, 128, 0] : [0, 0, 0]);
        doc.text(`${String.fromCharCode(65 + idx)}. ${opt}${isCorrect ? ' ✓' : ''}`, 20, yPos);
        yPos += 7;
      });
      
      // Add explanation
      doc.setTextColor(0, 0, 150);
      doc.setFont(undefined, 'italic');
      
      // Split explanation text to fit within page width
      const splitExplanation = doc.splitTextToSize(q.explanation, 170);
      doc.text(splitExplanation, 20, yPos);
      yPos += splitExplanation.length * 7 + 10;
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Add a new page if needed
      if (yPos > 270 && index < questions.length - 1) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Save the PDF
    doc.save('vigenere_cipher_quiz.pdf');
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

            <div className="arrow-nav">
              <button
                onClick={handlePrevious}
                disabled={current === 0}
                className="arrow-button"
                title="Previous Question"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={handleNext}
                disabled={!submitted}
                className="arrow-button"
                title="Next Question"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="input-group" style={{ textAlign: 'center' }}>
            <div className="result-box" style={{ padding: '1.5rem', fontSize: '1.2rem', marginBottom: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px' }}>
              <div style={{ marginBottom: '10px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
              </div>
              <div>Congratulations! You've completed the Vigenère Cipher Quiz.</div>
              <div style={{ fontSize: '0.9rem', marginTop: '10px', fontStyle: 'italic' }}>You've learned about one of the most important historical ciphers!</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="/vigenere-quiz.pdf" className="nav-button" target="_blank" rel="noopener noreferrer" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
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

export default VigenereQuiz;
