import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home.jsx'
import Crypto101 from './components/c0-cipher.jsx'
import VigenereCipher from './components/c5-vigenere.jsx'
import OneTimePad from './components/c4-otp.jsx'
import RailFenceCipher from './components/c7-railfence.jsx'
import CaesarCipher from './components/c1-ceaser.jsx'
import HillCipherTool from './components/c3-hill.jsx'
import PlayfairCipherTool from './components/c2-playfair.jsx'
import DESDemo from './components/c8-DES.jsx'
import RSAVisualizer from './components/c10-rsa.jsx'
import AESDemo from './components/c9-aes.jsx'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/c0-crypto" element={<Crypto101 />} />
        <Route path="/c1-caesar" element={<CaesarCipher />} />
        <Route path="/c2-playfair" element={<PlayfairCipherTool />} />
        <Route path="/c3-hill" element={<HillCipherTool />} />
        <Route path="/c4-otp" element={<OneTimePad />} />
        <Route path="/c5-vigenere" element={<VigenereCipher />} />
        <Route path="/c6-vernam" element={<VigenereCipher />} />
        <Route path="/c7-railfence" element={<RailFenceCipher />} />
        <Route path="/c8-des" element={<DESDemo />} />
        <Route path='/c9-aes' element={<AESDemo/>}/>
        <Route path='/c10-rsa' element={<RSAVisualizer/>} />
      </Routes>
    </div>
  )
}

export default App
