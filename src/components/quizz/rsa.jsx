import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    <div
      className="main-container"
      style={{ maxWidth: 650, margin: "2rem auto", padding: "1rem" }}
    >
     

      <Link
        to="/c10-rsa"
        className="nav-button"
        style={{ position: "absolute", top: "20px", left: "20px" }}
      >
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">RSA Cipher Quiz</h1>

        {!showResult ? (
          <>
            <div className="input-group">
              <label>
                Question {current + 1} of {questions.length}
              </label>
              <div
                className="box"
                style={{ padding: "1rem", fontWeight: "bold" }}
              >
                {questions[current].question}
              </div>
            </div>

            <div className="input-group">
              {questions[current].options.map((opt, idx) => {
                let style = {
                  width: "100%",
                  marginBottom: "0.5rem",
                  cursor: submitted ? "default" : "pointer",
                  pointerEvents: submitted ? "none" : "auto",
                  border: "3px solid transparent",
                  backgroundColor: "white",
                  color: "black",
                  textAlign: "left",
                  padding: "0.6rem 1rem",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  transition: "all 0.3s ease",
                };

                if (!submitted && selected === opt) {
                  style.backgroundColor = "#cce5ff";
                  style.borderColor = "#339af0";
                }

                if (submitted) {
                  if (opt === questions[current].answer) {
                    style.borderColor = "green";
                    style.backgroundColor = "#d4edda";
                    style.color = "green";
                  } else if (opt === selected) {
                    style.borderColor = "red";
                    style.backgroundColor = "#f8d7da";
                    style.color = "red";
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
                      <div
                        style={{
                          marginTop: "0.3rem",
                          color: style.borderColor,
                          fontStyle: "italic",
                        }}
                      >
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
              style={{ width: "100%", marginTop: "1rem" }}
            >
              {submitted
                ? current < questions.length - 1
                  ? "Next"
                  : "Finish"
                : "Submit"}
            </button>
          </>
        ) : (
          <div className="input-group" style={{ textAlign: "center" }}>
            <div
              className="result-box"
              style={{ padding: "1.5rem", fontSize: "1.2rem", marginBottom: "1rem" }}
            >
              You scored {score} out of {questions.length}!
            </div>
            <a href="/rsa-quiz.pdf" className="nav-button" target="_blank" rel="noopener noreferrer" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Download Quiz PDF
            </a>
            <button
              className="nav-button"
              onClick={handleRestart}
              style={{ marginBottom: "1rem" }}
            >
              Restart Quiz
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default RSAQuiz;
