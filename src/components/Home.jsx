// src/components/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const tools = [
  { name: "INTRODUCTION", path: "/c0-crypto" },
  { name: "CAESAR CIPHER", path: "/c1-caesar" },
  { name: "ONE TIME PAD", path: "/c5-otp" },
  { name: "VIGENERE CIPHER", path: "/c6-vigenere" },
  { name: "RAIL FENCE CIPHER", path: "/c9-railfence" },
];

const Home = () => {
  return (
    <div className="main-container">
      <div className="title-container">
        <h1 className="main-title">CryptoLab</h1>
        <p className="subtitle">
          Read the posts. Interact with tools.<br />
          Discover the techniques. and Enjoy.
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
