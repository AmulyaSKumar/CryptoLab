import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PlayfairCipherQuiz = () => {
  const questions = [
    {
      question: "What is the main idea behind the Playfair cipher?",
      options: [
        "Using a 5x5 letter matrix for encryption",
        "Shifting letters by a fixed key",
        "Replacing letters with numbers",
        "Using prime numbers for key generation"
      ],
      answer: "Using a 5x5 letter matrix for encryption",
      explanation: "Playfair cipher encrypts pairs of letters using a 5x5 matrix constructed from a keyword."
    },
    {
      question: "If you have the keyword 'MONARCHY', how do you construct the matrix?",
      options: [
        "Fill matrix row-wise with keyword letters, then remaining alphabet (I/J combined)",
        "Write keyword vertically, then horizontally",
        "Random letters excluding keyword",
        "Use only vowels from keyword"
      ],
      answer: "Fill matrix row-wise with keyword letters, then remaining alphabet (I/J combined)",
      explanation: "You place the unique letters of the keyword first, then fill remaining spots with other letters (I and J share a cell)."
    },
    {
      question: "Why are the letters I and J combined in the Playfair cipher matrix?",
      options: [
        "Because Playfair uses a 25-letter matrix",
        "To make encryption faster",
        "To confuse attackers",
        "To avoid vowels"
      ],
      answer: "Because Playfair uses a 25-letter matrix",
      explanation: "English alphabet has 26 letters but the 5x5 matrix has only 25 cells, so I and J are combined."
    },
    {
      question: "How do you encrypt a pair of identical letters in Playfair cipher?",
      options: [
        "Insert an 'X' between them",
        "Skip the second letter",
        "Use a different matrix",
        "Replace with numbers"
      ],
      answer: "Insert an 'X' between them",
      explanation: "Identical letters in a pair are separated by adding an 'X' to prevent confusion in encryption."
    },
    {
      question: "Explain what happens if a pair of letters are in the same row of the matrix during encryption.",
      options: [
        "Each letter is replaced by the letter to its right, wrapping around",
        "They remain unchanged",
        "Each letter is replaced by the letter below it",
        "Each letter is swapped"
      ],
      answer: "Each letter is replaced by the letter to its right, wrapping around",
      explanation: "If both letters are in the same row, you replace each with the letter immediately to the right, cycling back to the start if needed."
    },
    {
      question: "What if the letters are in the same column?",
      options: [
        "Replace each letter with the letter below it, wrapping to top",
        "Replace each letter with the letter to its right",
        "Replace with letters in diagonal",
        "Leave them unchanged"
      ],
      answer: "Replace each letter with the letter below it, wrapping to top",
      explanation: "If letters share a column, each is replaced by the letter below it in that column, wrapping to the top if at the bottom."
    },
    {
      question: "If letters form a rectangle in the matrix, how do you encrypt them?",
      options: [
        "Each letter is replaced by the letter in its row but the other letter's column",
        "Swap the letters",
        "Use a random letter",
        "Skip encryption"
      ],
      answer: "Each letter is replaced by the letter in its row but the other letter's column",
      explanation: "Letters at rectangle corners swap columns but keep their own row during encryption."
    },
    {
      question: "Why is Playfair considered more secure than Caesar cipher?",
      options: [
        "Because it encrypts digraphs instead of single letters",
        "Because it uses a larger key",
        "Because it uses numbers",
        "Because it is a hash function"
      ],
      answer: "Because it encrypts digraphs instead of single letters",
      explanation: "Encrypting letter pairs (digraphs) hides letter frequency patterns better than single-letter substitution."
    },
    {
      question: "How does Playfair cipher handle letters that don't form a pair, like a single leftover letter?",
      options: [
        "Add an 'X' or 'Z' to complete the pair",
        "Ignore the leftover letter",
        "Encrypt only the leftover letter",
        "Double the leftover letter"
      ],
      answer: "Add an 'X' or 'Z' to complete the pair",
      explanation: "If the message length is odd, an extra filler letter like 'X' is added to make pairs complete."
    },
    {
      question: "Can Playfair cipher be broken easily? How?",
      options: [
        "It’s more complex but still vulnerable to frequency analysis of digraphs",
        "No, it is unbreakable",
        "Only with quantum computers",
        "By guessing the key directly"
      ],
      answer: "It’s more complex but still vulnerable to frequency analysis of digraphs",
      explanation: "While harder than Caesar, Playfair is still breakable with enough ciphertext and analysis of digraph frequency."
    },
    {
      question: "What would be a typical first step to decrypt a Playfair cipher if the key is unknown?",
      options: [
        "Try possible keywords or use frequency analysis of digraphs",
        "Try all possible shifts like Caesar cipher",
        "Use a dictionary attack on single letters",
        "Decrypt using a hash function"
      ],
      answer: "Try possible keywords or use frequency analysis of digraphs",
      explanation: "Attackers attempt to guess the keyword or analyze common digraphs to break the cipher."
    },
    {
      question: "Why does the Playfair cipher ignore the letter 'J' or combine it with 'I'?",
      options: [
        "To fit the alphabet into a 5x5 matrix",
        "To make the cipher more secure",
        "Because 'J' is a vowel",
        "To confuse attackers"
      ],
      answer: "To fit the alphabet into a 5x5 matrix",
      explanation: "The matrix is 5x5=25 cells, so one letter must be merged or excluded, usually 'I' and 'J' are combined."
    },
    {
      question: "What happens if the keyword contains repeated letters in Playfair cipher?",
      options: [
        "Only the first occurrence is used in the matrix",
        "All repeated letters are included",
        "The keyword is rejected",
        "Repeated letters are replaced with numbers"
      ],
      answer: "Only the first occurrence is used in the matrix",
      explanation: "Duplicate letters in the keyword are ignored when constructing the matrix to keep letters unique."
    },
    {
      question: "Explain why Playfair cipher is categorized as a digraph substitution cipher.",
      options: [
        "Because it encrypts letters in pairs (digraphs)",
        "Because it uses a 2x2 matrix",
        "Because it substitutes digits for letters",
        "Because it uses two keys"
      ],
      answer: "Because it encrypts letters in pairs (digraphs)",
      explanation: "Playfair encrypts pairs of letters at a time, rather than one letter individually."
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
    setShowResult(false);
    setSubmitted(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Playfair Cipher Quiz Results', 105, 15, { align: 'center' });
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
    doc.save('playfair_cipher_quiz.pdf');
  };

  return (
    <div className="main-container" style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      

      <Link to="/c2-playfair" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">Playfair Cipher Quiz</h1>

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
                      style={{
                        ...style,
                        minHeight: '60px',
                        whiteSpace: 'normal',
                        textAlign: 'left',
                        wordBreak: 'break-word'
                      }}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                onClick={handlePrevious}
                disabled={current === 0}
                className="nav-button"
                style={{ width: '48%' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={handleNext}
                disabled={!submitted}
                className="nav-button"
                style={{ width: '48%' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="input-group" style={{ textAlign: 'center' }}>
            <div className="result-box" style={{ padding: '1.5rem', fontSize: '1.2rem', marginBottom: '1rem' }}>
              You've completed the quiz!
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="/playfair-quiz.pdf" className="nav-button" target="_blank" rel="noopener noreferrer" style={{ marginBottom: '0.5rem' }}>
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

export default PlayfairCipherQuiz;
