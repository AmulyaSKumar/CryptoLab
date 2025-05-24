import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home.jsx'
import Crypto101 from './components/c0-cipher.jsx'
import VigenereCipher from './components/c6-vigenere.jsx'
import OneTimePad from './components/c5-otp.jsx'
import RailFenceCipher from './components/c9-railfence.jsx'
import CaesarCipher from './components/c1-ceaser.jsx'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/c0-crypto" element={<Crypto101 />} />
        <Route path="/c1-caesar" element={<CaesarCipher />} />
        <Route path="/c5-otp" element={<OneTimePad />} />
        <Route path="/c6-vigenere" element={<VigenereCipher />} />
        <Route path="/c9-railfence" element={<RailFenceCipher />} />
      </Routes>
    </div>
  )
}

export default App
