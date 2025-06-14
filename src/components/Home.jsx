import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="main-container px-4">
      <div className="title-container text-center mb-8">
        <h1 className="main-title text-4xl font-bold">CryptoLab</h1>
        <p className="subtitle text-lg text-gray-600 mt-2">
          Code it. Break it. Own it.<br />
          Learn cryptography by doing.
        </p>
      </div>

      <div className="button-container flex flex-col items-center gap-6">
        {/* INTRODUCTION */}
        <Link to="/c0-crypto" className="nav-button w-full max-w-sm text-center">
          INTRODUCTION
        </Link>

        {/* Ciphers Grid */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-6 w-full max-w-3xl">
          <Link to="/c1-caesar" className="nav-button block w-auto text-center">
            CAESAR CIPHER
          </Link>
          <Link to="/c2-playfair" className="nav-button block w-auto text-center">
            PLAYFAIR CIPHER
          </Link>
          <Link to="/c3-hill" className="nav-button block w-auto text-center">
            HILL CIPHER
          </Link>
          <Link to="/c4-otp" className="nav-button block w-auto text-center">
            ONE TIME PAD
          </Link>
          <Link to="/c5-vigenere" className="nav-button block w-auto text-center">
            VIGENERE CIPHER
          </Link>
          <Link to="/c6-vernam" className="nav-button block w-auto text-center">
            VERNAM CIPHER
          </Link>
          <Link to="/c7-railfence" className="nav-button block w-auto text-center">
            RAIL FENCE CIPHER
          </Link>
          <Link to="/c8-des" className="nav-button block w-auto text-center">
            DES (Data Encryption Standard)
          </Link>
          <Link to="/c9-aes" className="nav-button block w-auto text-center">
            AES (Advanced Encryption Standard)
          </Link>
          <Link to="/c10-rsa" className="nav-button block w-auto text-center">
            RSA (Rivest–Shamir–Adleman)
          </Link>
        </div>

        {/* BYOC Button */}
        <Link to="/byoc" className="nav-button w-full max-w-sm text-center">
          BYOC <br /> Build your own Cipher
        </Link>
      </div>
<br/><br/>
      
    </div>
  );
};

export default Home;
