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
  { name: "DES", path: "/c8-des" },
  { name: "AES", path: "/c9-aes" },
  { name: "RSA", path: "/c10-rsa" },
  {name:"BYOC" ,path:"/byoc"},
];

const Home = () => {
  const intro = tools[0];
  const rest = tools.slice(1);

  return (
    <div className="main-container">
      <div className="title-container">
        <h1 className="main-title">CryptoLab</h1>
        <p className="subtitle">
          From beginner to breaker — learn by doing.<br />
          Learn. Encrypt. Decrypt. Repeat.
        </p>
      </div>

      <div className="button-container flex flex-col items-center gap-4">
        {/* INTRODUCTION (single full-width button) */}
        <Link to={intro.path} className="nav-button w-full max-w-sm">
          {intro.name}
        </Link>

        {/* 2-column grid for remaining tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          {rest.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="nav-button block w-full text-center"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
