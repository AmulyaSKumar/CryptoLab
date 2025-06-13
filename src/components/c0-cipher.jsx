import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Introduction = () => {
  const [isReading, setIsReading] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);

  const readContent = (text) => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = 0.9;
    utteranceRef.current.onend = () => setIsReading(false);
    setIsReading(true);
    speechSynthesis.speak(utteranceRef.current);
  };

  // Cleanup speech synthesis when component unmounts
  React.useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px', minWidth: 'auto' }}>
        ← Back
      </Link>

      <div className="tool-container">
        <h1 className="tool-title">Welcome to CryptoLab!</h1>

        <div className="about-content">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button
              onClick={() => readContent(document.querySelector('.about-content').textContent)}
              className={`speaker-button ${isReading ? 'active' : ''}`}
              title={isReading ? 'Stop Reading' : 'Read Content'}
            >
              {isReading ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l5.7-4.8v15.4L6.5 15.2H3a1 1 0 01-1-1v-4.4a1 1 0 011-1h3.5z" />
                </svg>
              )}
            </button>
          </div>

          <section className="mb-8">
            <h2 className="section-title">Hey there!</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              How are you? I'm excited to be your guide into the fascinating world of cryptography!
              Ever wondered how your messages stay secret when you send them online? Or how your passwords
              are kept safe? That's where cryptography comes in!
            </p>
          </section>

          <section className="mb-8">
            <h2 className="section-title">What's This All About? </h2>
            <p style={{ marginBottom: '1rem' }}>
              Imagine you want to send a secret message to your friend, but you're worried someone else might read it.
              What do you do? You could:
            </p>
            <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginBottom: '1rem' }}>
              <li>Write it in a special code only your friend knows</li>
              <li>Scramble the letters in a specific pattern</li>
              <li>Replace each letter with a different one</li>
            </ul>
            <p>
              That's exactly what cryptography does! It's like having a secret language between you and your friends
              that nobody else can understand. Cool, right?
            </p>
          </section>

          <section className="mb-8">
            <h2 className="section-title">Let's Break It Down </h2>
            <div className="result-box" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>Original Message:</strong> "HELLO FRIEND"</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>Secret Code Applied:</strong> *some magic happens*</p>
              <p><strong>Scrambled Message:</strong> "KHOOR IULHQG"</p>
            </div>
            <p>
              In cryptography, we call:
            </p>
            <ul style={{ marginLeft: '1.5rem', listStyle: 'disc', marginTop: '0.5rem' }}>
              <li>The original message → <strong>Plaintext</strong></li>
              <li>The scrambled message → <strong>Ciphertext</strong></li>
              <li>The secret code → <strong>Cipher</strong></li>
              <li>The special trick to scramble → <strong>Key</strong></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="section-title">What's in Our Lab?</h2>
            <p style={{ marginBottom: '1rem' }}>
              We've got some really cool ciphers for you to play with! Each one has its own special way of keeping messages secret:
            </p>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">1. Caesar Cipher</h3>
              <p>
                Used by Julius Caesar himself! It's like shifting each letter in your message by a certain number.
                Think of it as moving each letter a few steps forward in the alphabet.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">2. Vigenère Cipher</h3>
              <p>
                Like Caesar's cipher but on steroids! Instead of shifting all letters by the same amount,
                each letter gets its own special shift. Tricky, huh?
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">3. Rail Fence Cipher</h3>
              <p>
                This one's fun! It writes your message in a zigzag pattern and then reads it off row by row.
                It's like making your message ride a roller coaster!
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">4. One Time Pad</h3>
              <p>
                The unbreakable one! If used correctly, it's mathematically impossible to crack.
                It's like having a different secret code for every single letter!
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">5. Hill Cipher</h3>
              <p>
                It's all about matrices and multiplication! This cipher turns letters into numbers, groups them,
                and scrambles them using some math magic.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">6. Playfair Cipher</h3>
              <p>
                Say goodbye to single-letter encryption! Playfair encrypts letters in pairs using a 5x5 matrix.
                It’s a clever twist that even fooled enemies during wartime.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">7. DES (Data Encryption Standard)</h3>
              <p>
                A classic from the 70s! DES mixes your message through 16 rounds of shifting, substituting, and permuting.
                It’s like putting your text through a digital blender.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">8. AES (Advanced Encryption Standard)</h3>
              <p>
                Modern, powerful, and fast! AES is the gold standard for secure encryption today.
                Your message gets transformed with multiple layers of substitution and permutation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">9. RSA (Rivest–Shamir–Adleman)</h3>
              <p>
                The king of public-key cryptography! RSA uses big prime numbers to lock your message.
                It’s like a digital safe with two keys – one to lock, one to unlock.
              </p>
            </div>
          </section>

          <section>
            <h2 className="section-title">Ready to Start? </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              Head back to the home page and pick any cipher to try out! Each one has its own story and special way of
              working. Don't worry if it seems tricky at first - we'll explain everything step by step!
            </p>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>
              Remember: The best way to learn is by trying things out yourself. So go ahead, encrypt some messages,
              and have fun being a cryptographer!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
