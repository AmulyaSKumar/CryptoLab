import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Crypto101 from './components/c0-cipher.jsx'
import VigenereCipher from './components/c5-vigenere.jsx'
import RailFenceCipher from './components/c7-railfence.jsx'
import CaesarCipher from './components/c1-ceaser.jsx'
import HillCipherTool from './components/c3-hill.jsx'
import PlayfairCipherTool from './components/c2-playfair.jsx'
import DESDemo from './components/c8-des.jsx'
import RSAVisualizer from './components/c10-rsa.jsx'
import AESDemo from './components/c9-aes.jsx'
import CaesarChallenge from './components/challenges/CaesarChallenge.jsx'
import CaesarCipherQuiz from './components/quizz/caesarquiz.jsx'
import RailfenceQuiz from './components/quizz/railfence.jsx'
import RailFenceChallenge from './components/challenges/railfence.jsx'
import CustomCipherBuilder from './components/byoc.jsx'
import PlayfairChallenge from './components/challenges/playfair_new.jsx'
import HillChallenge from './components/challenges/hill.jsx'
import VernamChallenge from './components/challenges/vernam.jsx'
import PlayfairCipherQuiz from './components/quizz/playfair.jsx'
import HillCipherQuiz from './components/quizz/hill.jsx'
import VigenereQuiz from './components/quizz/vigenere.jsx'
import VernamQuiz from './components/quizz/vernam.jsx'
import RSAQuiz from './components/quizz/rsa.jsx'
import AESQuiz from './components/quizz/aes.jsx'
import DESQuiz from './components/quizz/des.jsx'
import VigenereChallenge from './components/challenges/vigenere.jsx'
import VernamCipherTool from './components/c6-vernam.jsx'
import FloatingChatButton from './components/FloatingChatButton.jsx'
import { CipherContextProvider } from './context/CipherContext.jsx'
import './App.css'

function App() {
  return (
    <CipherContextProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/c0-crypto" element={<Crypto101 />} />
          <Route path="/c1-caesar" element={<CaesarCipher />} />
          <Route path="/c2-playfair" element={<PlayfairCipherTool />} />
          <Route path="/c3-hill" element={<HillCipherTool />} />
          <Route path="/c5-vigenere" element={<VigenereCipher />} />
          <Route path="/c6-vernam" element={<VernamCipherTool />} />
          <Route path="/c7-railfence" element={<RailFenceCipher />} />
          <Route path="/c8-des" element={<DESDemo />} />
          <Route path='/c9-aes' element={<AESDemo/>}/>
          <Route path='/c10-rsa' element={<RSAVisualizer/>} />
          <Route path='/byoc' element={<CustomCipherBuilder/>} />
          <Route path='/c-caesar' element={<CaesarChallenge/>} />
          <Route path='/c-playfair' element={<PlayfairChallenge/>}/>
          <Route path='/c-hill' element={<HillChallenge/>} />
          <Route path='/c-vigenere' element={<VigenereChallenge/>} />
          <Route path='/c-vernam' element={<VernamChallenge/>} />
          <Route path='/c-railfence' element={<RailFenceChallenge/>} />
          <Route path='/q-caesar' element={<CaesarCipherQuiz/>} />
          <Route path='/q-playfair' element={<PlayfairCipherQuiz/>}/>
          <Route path='/q-railfence' element={<RailfenceQuiz/>} />
          <Route path='/q-hill' element={<HillCipherQuiz/>} />
          <Route path='/q-vigenere' element={<VigenereQuiz/>} />
          <Route path='/q-vernam' element={<VernamQuiz/>} />
          <Route path='/q-rsa' element={<RSAQuiz/>} />
          <Route path='/q-aes' element={<AESQuiz/>} />
          <Route path='/q-des' element={<DESQuiz/>} />
        </Routes>
        <FloatingChatButton />
      </div>
    </CipherContextProvider>
  )
}

export default App
