// src/components/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const tools = [
  { name: "INTRODUCTION", path: "/c0-crypto" },
  { name: "CAESAR CIPHER", path: "/c1-caesar" },
  { name: "PLAYFAIR CIPHER", path: "/c2-playfair" },
  { name: "HILL CIPHER", path: "/c3-hill" },
  { name: "ONE TIME PAD", path: "/c4-otp" },
  { name: "VIGENERE CIPHER", path: "/c5-vigenere" },
  { name: "VERNAM CIPHER", path: "/c6-vernam" },
  { name: "RAIL FENCE CIPHER", path: "/c7-railfence" },
];

const Home = () => {
  return (
    <div className="main-container">
      <div className="title-container">
        <h1 className="main-title">CryptoLab</h1>
        <p className="subtitle">
        From beginner to breaker — learn by doing.<br />
        Learn. Encrypt. Decrypt. Repeat.
        </p>
      </div>

      <div className="button-container">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="nav-button"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
