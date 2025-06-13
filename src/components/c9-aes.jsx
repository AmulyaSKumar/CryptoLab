// AESDemo.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import CryptoJS from 'crypto-js';

// AES Constants
const SBOX = [
  [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76],
  [0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0],
  [0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15],
  [0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75],
  [0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84],
  [0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf],
  [0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8],
  [0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2],
  [0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73],
  [0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb],
  [0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79],
  [0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08],
  [0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a],
  [0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e],
  [0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf],
  [0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]
];

const INV_SBOX = [
  [0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb],
  [0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb],
  [0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e],
  [0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25],
  [0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92],
  [0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84],
  [0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06],
  [0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b],
  [0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73],
  [0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e],
  [0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b],
  [0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4],
  [0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f],
  [0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef],
  [0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61],
  [0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d]
];

const RCON = [
  [0x00, 0x00, 0x00, 0x00],
  [0x01, 0x00, 0x00, 0x00],
  [0x02, 0x00, 0x00, 0x00],
  [0x04, 0x00, 0x00, 0x00],
  [0x08, 0x00, 0x00, 0x00],
  [0x10, 0x00, 0x00, 0x00],
  [0x20, 0x00, 0x00, 0x00],
  [0x40, 0x00, 0x00, 0x00],
  [0x80, 0x00, 0x00, 0x00],
  [0x1b, 0x00, 0x00, 0x00],
  [0x36, 0x00, 0x00, 0x00]
];

// Utility functions
const hexToBytes = (hex) => {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
};

const bytesToHex = (bytes) => {
  return Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
};

const stringToBytes = (str) => {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
};

const bytesToAscii = (bytes) => {
  let ascii = '';
  for (let i = 0; i < bytes.length; i++) {
    // Only add printable ASCII characters
    if (bytes[i] >= 32 && bytes[i] <= 126) {
      ascii += String.fromCharCode(bytes[i]);
    } else {
      ascii += '.';
    }
  }
  return ascii;
};

const createState = (bytes) => {
  const state = Array(4).fill().map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[j][i] = bytes[i * 4 + j];
    }
  }
  return state;
};

const stateToBytes = (state) => {
  const bytes = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      bytes.push(state[j][i]);
    }
  }
  return bytes;
};

const xorBytes = (a, b) => {
  return a.map((byte, i) => byte ^ b[i]);
};

const subBytes = (state) => {
  const newState = Array(4).fill().map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const byte = state[i][j];
      const row = (byte >> 4) & 0xF;
      const col = byte & 0xF;
      newState[i][j] = SBOX[row][col];
    }
  }
  return newState;
};

const invSubBytes = (state) => {
  const newState = Array(4).fill().map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const byte = state[i][j];
      const row = (byte >> 4) & 0xF;
      const col = byte & 0xF;
      newState[i][j] = INV_SBOX[row][col];
    }
  }
  return newState;
};

const shiftRows = (state) => {
  const newState = Array(4).fill().map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newState[i][j] = state[i][(j + i) % 4];
    }
  }
  return newState;
};

const invShiftRows = (state) => {
  const newState = Array(4).fill().map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newState[i][j] = state[i][(j - i + 4) % 4];
    }
  }
  return newState;
};

const galoisMult = (a, b) => {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if ((b & 1) !== 0) {
      p ^= a;
    }
    const hiBitSet = (a & 0x80) !== 0;
    a <<= 1;
    if (hiBitSet) {
      a ^= 0x1b; // XOR with the irreducible polynomial x^8 + x^4 + x^3 + x + 1
    }
    b >>= 1;
  }
  return p & 0xff;
};

const mixColumns = (state) => {
  const newState = Array(4).fill().map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    newState[0][i] = galoisMult(0x02, state[0][i]) ^ galoisMult(0x03, state[1][i]) ^ state[2][i] ^ state[3][i];
    newState[1][i] = state[0][i] ^ galoisMult(0x02, state[1][i]) ^ galoisMult(0x03, state[2][i]) ^ state[3][i];
    newState[2][i] = state[0][i] ^ state[1][i] ^ galoisMult(0x02, state[2][i]) ^ galoisMult(0x03, state[3][i]);
    newState[3][i] = galoisMult(0x03, state[0][i]) ^ state[1][i] ^ state[2][i] ^ galoisMult(0x02, state[3][i]);
  }
  return newState;
};

const invMixColumns = (state) => {
  const newState = Array(4).fill().map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    newState[0][i] = galoisMult(0x0e, state[0][i]) ^ galoisMult(0x0b, state[1][i]) ^ galoisMult(0x0d, state[2][i]) ^ galoisMult(0x09, state[3][i]);
    newState[1][i] = galoisMult(0x09, state[0][i]) ^ galoisMult(0x0e, state[1][i]) ^ galoisMult(0x0b, state[2][i]) ^ galoisMult(0x0d, state[3][i]);
    newState[2][i] = galoisMult(0x0d, state[0][i]) ^ galoisMult(0x09, state[1][i]) ^ galoisMult(0x0e, state[2][i]) ^ galoisMult(0x0b, state[3][i]);
    newState[3][i] = galoisMult(0x0b, state[0][i]) ^ galoisMult(0x0d, state[1][i]) ^ galoisMult(0x09, state[2][i]) ^ galoisMult(0x0e, state[3][i]);
  }
  return newState;
};

const rotWord = (word) => {
  return [word[1], word[2], word[3], word[0]];
};

const subWord = (word) => {
  return word.map(byte => {
    const row = (byte >> 4) & 0xF;
    const col = byte & 0xF;
    return SBOX[row][col];
  });
};

const keyExpansion = (key) => {
  const keyLength = key.length;
  const Nk = keyLength / 4; // Number of 32-bit words in the key
  const Nr = Nk + 6; // Number of rounds
  const expandedKey = Array(4 * (Nr + 1)).fill().map(() => Array(4).fill(0));
  
  // Copy the key into the first Nk words
  for (let i = 0; i < Nk; i++) {
    expandedKey[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
  }
  
  // Generate the remaining words
  for (let i = Nk; i < 4 * (Nr + 1); i++) {
    let temp = [...expandedKey[i - 1]];
    
    if (i % Nk === 0) {
      temp = subWord(rotWord(temp));
      temp = temp.map((byte, j) => byte ^ RCON[Math.floor(i / Nk)][j]);
    } else if (Nk > 6 && i % Nk === 4) {
      temp = subWord(temp);
    }
    
    expandedKey[i] = temp.map((byte, j) => byte ^ expandedKey[i - Nk][j]);
  }
  
  return expandedKey;
};

const addRoundKey = (state, roundKey) => {
  const newState = Array(4).fill().map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newState[i][j] = state[i][j] ^ roundKey[j][i];
    }
  }
  return newState;
};

const AESDemo = () => {
  const [inputType, setInputType] = useState('text');
  const [keyType, setKeyType] = useState('text');
  const [inputText, setInputText] = useState('');
  const [inputHex, setInputHex] = useState('');
  const [keyText, setKeyText] = useState('');
  const [keyHex, setKeyHex] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [output, setOutput] = useState('');
  const [outputAscii, setOutputAscii] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tool');
  const [isReading, setIsReading] = useState(false);
  const [stringToConvert, setStringToConvert] = useState('');
  const [convertedHex, setConvertedHex] = useState('');
  const [showConverter, setShowConverter] = useState(false);
  const [cryptoJSResult, setCryptoJSResult] = useState('');
  const navigate=useNavigate();
  // Maximum character limits
  const MAX_INPUT_TEXT_LENGTH = 16; // 128 bits (16 characters)
  const MAX_INPUT_HEX_LENGTH = 32; // 128 bits (32 hex characters)
  const MAX_KEY_TEXT_LENGTH = 16; // 128 bits (16 characters)
  const MAX_KEY_HEX_LENGTH = 32; // 128 bits (32 hex characters)

  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);

  const generateRandomKey = () => {
    const hex = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < MAX_KEY_HEX_LENGTH; i++) {
      result += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    setKeyType('hex');
    setKeyHex(result);
  };

  const convertStringToHex = () => {
    if (!stringToConvert) return;
    
    // Convert string to hex
    let hex = '';
    for (let i = 0; i < stringToConvert.length; i++) {
      const charCode = stringToConvert.charCodeAt(i);
      const hexValue = charCode.toString(16);
      hex += hexValue.padStart(2, '0');
    }
    
    setConvertedHex(hex.toUpperCase());
  };

  const applyConvertedHex = (target) => {
    if (!convertedHex) return;
    
    if (target === 'input') {
      setInputType('hex');
      setInputHex(convertedHex);
    } else if (target === 'key') {
      setKeyType('hex');
      setKeyHex(convertedHex);
    }
  };

  const handleCompute = () => {
    // Validate inputs
    if (inputType === 'text' && !inputText) {
      alert('Please enter input text');
      return;
    }
    if (inputType === 'hex' && !inputHex) {
      alert('Please enter input hex');
      return;
    }
    if (keyType === 'text' && !keyText) {
      alert('Please enter key text');
      return;
    }
    if (keyType === 'hex' && !keyHex) {
      alert('Please enter key hex');
      return;
    }

    // Validate hex input if applicable
    if (inputType === 'hex' && !/^[0-9A-Fa-f]+$/.test(inputHex)) {
      alert('Input must be a valid hexadecimal string');
      return;
    }
    if (keyType === 'hex' && !/^[0-9A-Fa-f]+$/.test(keyHex)) {
      alert('Key must be a valid hexadecimal string');
      return;
    }

    // Prepare input and key bytes
    let inputBytes, keyBytes;
    let processedInputHex, processedKeyHex;

    if (inputType === 'text') {
      inputBytes = stringToBytes(inputText);
      processedInputHex = bytesToHex(inputBytes);
    } else {
      // Pad or truncate hex input
      processedInputHex = inputHex.padEnd(MAX_INPUT_HEX_LENGTH, '0').substring(0, MAX_INPUT_HEX_LENGTH);
      inputBytes = hexToBytes(processedInputHex);
    }

    if (keyType === 'text') {
      keyBytes = stringToBytes(keyText);
      processedKeyHex = bytesToHex(keyBytes);
    } else {
      // Pad or truncate hex key
      processedKeyHex = keyHex.padEnd(MAX_KEY_HEX_LENGTH, '0').substring(0, MAX_KEY_HEX_LENGTH);
      keyBytes = hexToBytes(processedKeyHex);
    }

    // Ensure key is 16, 24, or 32 bytes (128, 192, or 256 bits)
    while (keyBytes.length < 16) {
      keyBytes.push(0);
    }
    if (keyBytes.length > 16 && keyBytes.length < 24) {
      keyBytes = keyBytes.slice(0, 16);
    } else if (keyBytes.length > 24 && keyBytes.length < 32) {
      keyBytes = keyBytes.slice(0, 24);
    } else if (keyBytes.length > 32) {
      keyBytes = keyBytes.slice(0, 32);
    }

    // Ensure input is a multiple of 16 bytes (128 bits)
    while (inputBytes.length % 16 !== 0) {
      inputBytes.push(0);
    }

    // Record steps
    let recordedSteps = [];
    recordedSteps.push({ 
      desc: "Initial Setup", 
      inputHex: processedInputHex.toUpperCase(),
      keyHex: processedKeyHex.toUpperCase(),
      mode: mode
    });

    // Generate expanded key
    const expandedKey = keyExpansion(keyBytes);
    recordedSteps.push({ 
      desc: "Key Expansion", 
      expandedKey: expandedKey.map(word => bytesToHex(word))
    });

    // Process each 16-byte block
    let outputBytes = [];
    for (let blockStart = 0; blockStart < inputBytes.length; blockStart += 16) {
      const blockBytes = inputBytes.slice(blockStart, blockStart + 16);
      let state = createState(blockBytes);
      
      recordedSteps.push({ 
        desc: `Block ${Math.floor(blockStart / 16) + 1} Initial State`, 
        state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
        blockHex: bytesToHex(blockBytes)
      });

      if (mode === 'encrypt') {
        // Initial round key addition
        state = addRoundKey(state, expandedKey.slice(0, 4));
        recordedSteps.push({ 
          desc: `Block ${Math.floor(blockStart / 16) + 1} Round 0 (Add Round Key)`, 
          state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          roundKey: expandedKey.slice(0, 4).map(word => bytesToHex(word))
        });

        // Main rounds
        const numRounds = expandedKey.length / 4 - 1;
        for (let round = 1; round < numRounds; round++) {
          const stateBefore = state.map(row => [...row]);
          
          // SubBytes
          state = subBytes(state);
          recordedSteps.push({ 
            desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${round} (SubBytes)`, 
            stateBefore: stateBefore.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
          });

          // ShiftRows
          const stateAfterSubBytes = state.map(row => [...row]);
          state = shiftRows(state);
          recordedSteps.push({ 
            desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${round} (ShiftRows)`, 
            stateBefore: stateAfterSubBytes.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
          });

          // MixColumns
          const stateAfterShiftRows = state.map(row => [...row]);
          state = mixColumns(state);
          recordedSteps.push({ 
            desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${round} (MixColumns)`, 
            stateBefore: stateAfterShiftRows.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
          });

          // AddRoundKey
          const stateAfterMixColumns = state.map(row => [...row]);
          state = addRoundKey(state, expandedKey.slice(round * 4, (round + 1) * 4));
          recordedSteps.push({ 
            desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${round} (AddRoundKey)`, 
            stateBefore: stateAfterMixColumns.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            roundKey: expandedKey.slice(round * 4, (round + 1) * 4).map(word => bytesToHex(word))
          });
        }

        // Final round
        const finalRound = numRounds;
        const stateBefore = state.map(row => [...row]);
        
        // SubBytes
        state = subBytes(state);
        recordedSteps.push({ 
          desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${finalRound} (SubBytes)`, 
          stateBefore: stateBefore.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
        });

        // ShiftRows
        const stateAfterSubBytes = state.map(row => [...row]);
        state = shiftRows(state);
        recordedSteps.push({ 
          desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${finalRound} (ShiftRows)`, 
          stateBefore: stateAfterSubBytes.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
        });

        // AddRoundKey
        const stateAfterShiftRows = state.map(row => [...row]);
        state = addRoundKey(state, expandedKey.slice(finalRound * 4, (finalRound + 1) * 4));
        recordedSteps.push({ 
          desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${finalRound} (AddRoundKey)`, 
          stateBefore: stateAfterShiftRows.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          roundKey: expandedKey.slice(finalRound * 4, (finalRound + 1) * 4).map(word => bytesToHex(word))
        });
      } else {
        // Decryption
        // Initial round key addition
        state = addRoundKey(state, expandedKey.slice(expandedKey.length - 4, expandedKey.length));
        recordedSteps.push({ 
          desc: `Block ${Math.floor(blockStart / 16) + 1} Round 0 (Add Round Key)`, 
          state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          roundKey: expandedKey.slice(expandedKey.length - 4, expandedKey.length).map(word => bytesToHex(word))
        });

        // Main rounds
        const numRounds = expandedKey.length / 4 - 1;
        for (let round = 1; round < numRounds; round++) {
          const stateBefore = state.map(row => [...row]);
          
          // InvShiftRows
          state = invShiftRows(state);
          recordedSteps.push({ 
            desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${round} (InvShiftRows)`, 
            stateBefore: stateBefore.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
          });

          // InvSubBytes
          const stateAfterInvShiftRows = state.map(row => [...row]);
          state = invSubBytes(state);
          recordedSteps.push({ 
            desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${round} (InvSubBytes)`, 
            stateBefore: stateAfterInvShiftRows.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
          });

          // AddRoundKey
          const stateAfterInvSubBytes = state.map(row => [...row]);
          state = addRoundKey(state, expandedKey.slice(expandedKey.length - (round + 1) * 4, expandedKey.length - round * 4));
          recordedSteps.push({ 
            desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${round} (AddRoundKey)`, 
            stateBefore: stateAfterInvSubBytes.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            roundKey: expandedKey.slice(expandedKey.length - (round + 1) * 4, expandedKey.length - round * 4).map(word => bytesToHex(word))
          });

          // InvMixColumns
          const stateAfterAddRoundKey = state.map(row => [...row]);
          state = invMixColumns(state);
          recordedSteps.push({ 
            desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${round} (InvMixColumns)`, 
            stateBefore: stateAfterAddRoundKey.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
            state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
          });
        }

        // Final round
        const finalRound = numRounds;
        const stateBefore = state.map(row => [...row]);
        
        // InvShiftRows
        state = invShiftRows(state);
        recordedSteps.push({ 
          desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${finalRound} (InvShiftRows)`, 
          stateBefore: stateBefore.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
        });

        // InvSubBytes
        const stateAfterInvShiftRows = state.map(row => [...row]);
        state = invSubBytes(state);
        recordedSteps.push({ 
          desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${finalRound} (InvSubBytes)`, 
          stateBefore: stateAfterInvShiftRows.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()))
        });

        // AddRoundKey
        const stateAfterInvSubBytes = state.map(row => [...row]);
        state = addRoundKey(state, expandedKey.slice(0, 4));
        recordedSteps.push({ 
          desc: `Block ${Math.floor(blockStart / 16) + 1} Round ${finalRound} (AddRoundKey)`, 
          stateBefore: stateAfterInvSubBytes.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          state: state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase())),
          roundKey: expandedKey.slice(0, 4).map(word => bytesToHex(word))
        });
      }

      // Convert state back to bytes and add to output
      const blockOutputBytes = stateToBytes(state);
      outputBytes = outputBytes.concat(blockOutputBytes);
      
      recordedSteps.push({ 
        desc: `Block ${Math.floor(blockStart / 16) + 1} Final Output`, 
        outputHex: bytesToHex(blockOutputBytes),
        outputAscii: bytesToAscii(blockOutputBytes)
      });
    }

    // Set output
    const outputHex = bytesToHex(outputBytes);
    setOutput(outputHex);
    setOutputAscii(bytesToAscii(outputBytes));
    setSteps(recordedSteps);
    setStepIndex(0);
    setShowSteps(true);

    // Compare with CryptoJS implementation
    try {
      let cryptoInput, cryptoKey, cryptoResult;

      if (inputType === 'text') {
        cryptoInput = CryptoJS.enc.Utf8.parse(inputText);
      } else {
        cryptoInput = CryptoJS.enc.Hex.parse(processedInputHex);
      }

      if (keyType === 'text') {
        cryptoKey = CryptoJS.enc.Utf8.parse(keyText);
      } else {
        cryptoKey = CryptoJS.enc.Hex.parse(processedKeyHex);
      }
      
      const config = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      };

      if (mode === 'encrypt') {
        cryptoResult = CryptoJS.AES.encrypt(cryptoInput, cryptoKey, config);
        setCryptoJSResult(cryptoResult.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase());
      } else {
        cryptoResult = CryptoJS.AES.decrypt({ ciphertext: cryptoInput }, cryptoKey, config);
        setCryptoJSResult(cryptoResult.toString(CryptoJS.enc.Hex).toUpperCase());
      }
    } catch (error) {
      console.error('CryptoJS error:', error);
      setCryptoJSResult('Error computing CryptoJS result');
    }
  };

  // Move to next step
  const nextStep = () => {
    if (stepIndex + 1 < steps.length) {
      setStepIndex(stepIndex + 1);
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

  // Render state as a formatted string
  const renderState = (state) => {
    if (!state) return '';
    return state.map(row => row.join(' ')).join('');
  };

  // Cleanup speech synthesis when component unmounts
  useEffect(() => {
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
        <h1 className="tool-title">Advanced Encryption Standard (AES)</h1>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('tool')}
            className={`nav-button ${activeTab === 'tool' ? '' : 'secondary'}`}
            style={{ minWidth: '120px' }}
          >
            Tool
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`nav-button ${activeTab === 'about' ? '' : 'secondary'}`}
            style={{ minWidth: '120px' }}
          >
            About
          </button>
          <button
      className="nav-button"
      style={{ marginTop: '1rem', display: 'inline-block' ,minWidth: '120px'}}
      onClick={() => navigate('/q-aes')}
    >
      Take Test
    </button>
        </div>

        {activeTab === 'tool' ? (
          <>
            {/* String to Hex Converter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setShowConverter(!showConverter)}
                className="nav-button secondary"
                style={{ width: '100%', marginBottom: '0.5rem' }}
              >
                {showConverter ? 'Hide' : 'Show'} String to Hex Converter
              </button>
              
              {showConverter && (
                <div style={{ 
                  padding: '1rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }}>
                  <div className="input-group">
                    <label>Enter Text to Convert</label>
                    <textarea
                      value={stringToConvert}
                      onChange={(e) => setStringToConvert(e.target.value)}
                      placeholder="Enter text to convert to hexadecimal"
                      rows="2"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button
                      onClick={convertStringToHex}
                      className="nav-button secondary"
                      style={{ flex: '1' }}
                    >
                      Convert to Hex
                    </button>
                  </div>
                  
                  {convertedHex && (
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.5rem' 
                      }}>
                        <label>Hex Result</label>
                        <div>
                          <button
                            onClick={() => applyConvertedHex('input')}
                            className="text-sm"
                            style={{ color: 'var(--primary-color)', background: 'none', padding: '4px 8px' }}
                          >
                            Use as Input
                          </button>
                          <button
                            onClick={() => applyConvertedHex('key')}
                            className="text-sm"
                            style={{ color: 'var(--primary-color)', background: 'none', padding: '4px 8px' }}
                          >
                            Use as Key
                          </button>
                        </div>
                      </div>
                      <div className="result-box" style={{ marginBottom: '0.5rem' }}>
                        {convertedHex}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>
                        Note: AES requires exactly 32 hex characters (128 bits) for input and key.
                        {convertedHex.length > 32 && (
                          <span style={{ color: 'var(--error-color)' }}> Current value exceeds limit and will be truncated.</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Type Selection */}
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label>Input Format</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={inputType === 'text'}
                    onChange={() => setInputType('text')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Text (ASCII)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={inputType === 'hex'}
                    onChange={() => setInputType('hex')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Hexadecimal
                </label>
              </div>
            </div>

            {/* Input Field */}
            <div className="input-group">
              <label>
                {inputType === 'text' ? 'Enter Plaintext/Ciphertext' : 'Enter Plaintext/Ciphertext (Hex)'}
              </label>
              {inputType === 'text' ? (
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text (max 16 characters)"
                  rows="4"
                  maxLength={MAX_INPUT_TEXT_LENGTH}
                />
              ) : (
                <textarea
                  value={inputHex}
                  onChange={(e) => setInputHex(e.target.value.toUpperCase())}
                  placeholder="Enter hexadecimal value (e.g., 00112233445566778899AABBCCDDEEFF)"
                  rows="4"
                />
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.8rem', 
                color: (inputType === 'hex' && inputHex.length > MAX_INPUT_HEX_LENGTH) || 
                       (inputType === 'text' && inputText.length > MAX_INPUT_TEXT_LENGTH) ? 
                       'var(--error-color)' : 'var(--text-color)' 
              }}>
                {inputType === 'hex' ? (
                  <>
                    <span>Character count: {inputHex.length}/{MAX_INPUT_HEX_LENGTH}</span>
                    {inputHex.length > MAX_INPUT_HEX_LENGTH && (
                      <span>Input will be truncated to {MAX_INPUT_HEX_LENGTH} characters</span>
                    )}
                  </>
                ) : (
                  <>
                    <span>Character count: {inputText.length}/{MAX_INPUT_TEXT_LENGTH}</span>
                    {inputText.length > MAX_INPUT_TEXT_LENGTH && (
                      <span>Input will be truncated to {MAX_INPUT_TEXT_LENGTH} characters</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Key Type Selection */}
            <div className="input-group" style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
              <label>Key Format</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={keyType === 'text'}
                    onChange={() => setKeyType('text')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Text (ASCII)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    checked={keyType === 'hex'}
                    onChange={() => setKeyType('hex')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Hexadecimal
                </label>
              </div>
            </div>

            {/* Key Field */}
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>{keyType === 'text' ? 'Key' : 'Key (Hex)'}</label>
                <button
                  onClick={generateRandomKey}
                  className="text-sm"
                  style={{ color: 'var(--primary-color)', background: 'none', padding: '4px 8px' }}
                >
                  Generate Random Key
                </button>
              </div>
              {keyType === 'text' ? (
                <input
                  type="text"
                  value={keyText}
                  onChange={(e) => setKeyText(e.target.value)}
                  placeholder="Enter key text (exactly 16 characters)"
                  maxLength={MAX_KEY_TEXT_LENGTH}
                />
              ) : (
                <input
                  type="text"
                  value={keyHex}
                  onChange={(e) => setKeyHex(e.target.value.toUpperCase())}
                  placeholder="Enter 128-bit key in hex (e.g., 000102030405060708090A0B0C0D0E0F)"
                />
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.8rem', 
                color: (keyType === 'hex' && keyHex.length > MAX_KEY_HEX_LENGTH) || 
                       (keyType === 'text' && keyText.length > MAX_KEY_TEXT_LENGTH) ? 
                       'var(--error-color)' : 'var(--text-color)' 
              }}>
                {keyType === 'hex' ? (
                  <>
                    <span>Character count: {keyHex.length}/{MAX_KEY_HEX_LENGTH}</span>
                    {keyHex.length > MAX_KEY_HEX_LENGTH && (
                      <span>Key will be truncated to {MAX_KEY_HEX_LENGTH} characters</span>
                    )}
                  </>
                ) : (
                  <>
                    <span>Character count: {keyText.length}/{MAX_KEY_TEXT_LENGTH}</span>
                    {keyText.length !== MAX_KEY_TEXT_LENGTH && keyText.length > 0 && (
                      <span>{keyText.length < MAX_KEY_TEXT_LENGTH ? 'Key will be padded' : 'Key will be truncated'}</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Toggle switch for encrypt/decrypt */}
            <div className="input-group" style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={mode === 'decrypt'}
                  onChange={(e) => setMode(e.target.checked ? 'decrypt' : 'encrypt')}
                />
                <span className="toggle-slider">
                  <span className={`toggle-label ${mode === 'encrypt' ? 'active' : ''}`}>Encrypt</span>
                  <span className={`toggle-label ${mode === 'decrypt' ? 'active' : ''}`}>Decrypt</span>
                </span>
              </label>
            </div>

            <button
              onClick={handleCompute}
              className="nav-button"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} Data
            </button>

            {steps.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ margin: 0 }}>Result</h2>
                  
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="nav-button secondary"
                    style={{ padding: '4px 8px', minWidth: 'auto' }}
                  >
                    {showSteps ? 'Hide Steps' : 'Show Steps'}
                  </button>
                </div>

                {showSteps && (
                  <div className="visualization-steps">
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>Step {stepIndex + 1} of {steps.length}</strong>: {steps[stepIndex].desc}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={prevStep}
                          disabled={stepIndex === 0}
                          className="nav-button secondary"
                          style={{ padding: '4px 8px', minWidth: 'auto', opacity: stepIndex === 0 ? 0.5 : 1 }}
                        >
                          Previous
                        </button>
                        <button
                          onClick={nextStep}
                          disabled={stepIndex === steps.length - 1}
                          className="nav-button secondary"
                          style={{ padding: '4px 8px', minWidth: 'auto', opacity: stepIndex === steps.length - 1 ? 0.5 : 1 }}
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    <div className="step">
                      {stepIndex === 0 && (
                        <div className="step-content">
                          <div style={{ marginBottom: '1rem' }}>
                            <div><strong>Input (Hex):</strong> {steps[0].inputHex}</div>
                            <div><strong>Key (Hex):</strong> {steps[0].keyHex}</div>
                            <div><strong>Mode:</strong> {steps[0].mode === 'encrypt' ? 'Encryption' : 'Decryption'}</div>
                          </div>
                        </div>
                      )}

                      {stepIndex === 1 && (
                        <div className="step-content">
                          <div style={{ marginBottom: '1rem' }}>
                            <div><strong>Key Expansion:</strong></div>
                            <div style={{ marginTop: '0.5rem' }}>
                              {steps[1].expandedKey.map((word, i) => (
                                <div key={i}><strong>Round Key {Math.floor(i / 4)}, Word {i % 4}:</strong> {word}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {stepIndex > 1 && (
                        <div className="step-content">
                          {steps[stepIndex].blockHex && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div><strong>Block Hex:</strong> {steps[stepIndex].blockHex}</div>
                            </div>
                          )}

                          {steps[stepIndex].state && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div><strong>State Matrix:</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderState(steps[stepIndex].state)}
                              </pre>
                            </div>
                          )}

                          {steps[stepIndex].stateBefore && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div><strong>State Before:</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderState(steps[stepIndex].stateBefore)}
                              </pre>
                            </div>
                          )}

                          {steps[stepIndex].roundKey && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div><strong>Round Key:</strong></div>
                              <pre style={{ background: '#ddd', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {steps[stepIndex].roundKey.join('')}
                              </pre>
                            </div>
                          )}

{steps[stepIndex].outputHex && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div><strong>Output (Hex):</strong> {steps[stepIndex].outputHex}</div>
                              {steps[stepIndex].outputAscii && (
                                <div><strong>Output (ASCII):</strong> {steps[stepIndex].outputAscii}</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="result-container" style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label>Output (Hex)</label>
                    <button
                      onClick={copyToClipboard}
                      className="text-sm"
                      style={{ color: 'var(--primary-color)', background: 'none', padding: '4px 8px' }}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="result-box">
                    {output || 'Output will appear here'}
                  </div>
                  
                  {output && (
                    <div style={{ marginTop: '1rem' }}>
                      <label>Output (ASCII)</label>
                      <div className="result-box">
                        {outputAscii || 'Non-printable characters'}
                      </div>
                    </div>
                  )}
                  
                  {cryptoJSResult && (
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                      <div><strong>CryptoJS Result:</strong> {cryptoJSResult}</div>
                      <div style={{ color: output === cryptoJSResult ? 'green' : 'red' }}>
                        {output === cryptoJSResult ? '✓ Results match' : '✗ Results do not match'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
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
              <h2 className="section-title">What Is AES? 🔐</h2>
              <p>
                AES stands for <strong>Advanced Encryption Standard</strong>, and it's the encryption method that powers everything from your messaging apps to your online banking. Think of it like a digital lockbox for your data — super secure and built for speed.
              </p>
              <p>
                Introduced in the early 2000s to replace DES, AES is modern, fast, and strong enough to handle the encryption needs of the internet age.
              </p>
            </section>
          
            <section className="mb-8">
              <h2 className="section-title">How Does AES Work? 🛠️</h2>
              <p>
                AES works on blocks of data (just like DES), but it’s built for today’s tech. It scrambles 128 bits of data using a powerful mix of substitutions, permutations, and key mixing.
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Block Size:</strong> Always 128 bits (16 bytes).</li>
                <li><strong>Key Size:</strong> Can be 128, 192, or 256 bits — more bits, more security!</li>
                <li><strong>Rounds:</strong> AES-128 runs 10 rounds; AES-192 does 12; AES-256 hits 14 rounds.</li>
                <li><strong>SubBytes:</strong> Each byte gets substituted using a fixed S-Box — like a secret decoder ring.</li>
                <li><strong>ShiftRows:</strong> Rows of the data matrix are shifted around to mix things up.</li>
                <li><strong>MixColumns:</strong> Each column is scrambled using matrix math magic.</li>
                <li><strong>AddRoundKey:</strong> Your key gets mixed into the data — the real encryption muscle.</li>
              </ul>
            </section>
          
            <section className="mb-8">
              <h2 className="section-title">AES In Action 🔄</h2>
              <div className="flex justify-center my-6">
                <img src="/images/aes-diagram.png" alt="AES Diagram" className="rounded shadow-md w-full max-w-xl" />
              </div>
              <p className="text-center italic">Above: AES encryption in motion — a series of careful, reversible transformations.</p>
            </section>
          
            <section className="mb-8">
              <h2 className="section-title">Why Is AES Important? 🌍</h2>
              <ul className="list-disc ml-6 mb-4">
                <li>It’s the global standard for symmetric encryption — endorsed by the U.S. government and used worldwide.</li>
                <li>Fast and secure enough for everything from IoT devices to military comms.</li>
                <li>Designed to resist brute-force and cryptanalysis attacks.</li>
              </ul>
              <p>
                In short, if your data is encrypted today, there’s a good chance AES is behind it.
              </p>
            </section>
          
            <section className="mb-8">
              <h2 className="section-title">Is It Still Secure? 🧠</h2>
              <p>
                Absolutely. AES remains secure against all practical attacks. With a 256-bit key, you’d need a mind-boggling amount of computing power (like, universe-breaking levels) to even think about cracking it.
              </p>
            </section>
          
            <section className="mb-8">
              <h2 className="section-title">How Is It Different From DES? 🆚</h2>
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Key Size:</strong> AES allows for longer keys — DES was stuck at 56 bits.</li>
                <li><strong>Security:</strong> AES is way harder to break, even with modern computers.</li>
                <li><strong>Efficiency:</strong> AES was built for both hardware and software, making it faster and more flexible.</li>
              </ul>
            </section>
          
            <section>
              <h2 className="section-title">Try AES Yourself! 🧪</h2>
              <p>
                Plug in a message and a key, and we’ll show you each round of AES as it encrypts your data. It’s a dance of bytes, rows, columns, and keys — and you’ll see it all step by step.
              </p>
              <p>
                Encryption is powerful, and learning how it works puts that power in your hands.
              </p>
            </section>
          </div>          
        )}
      </div>
    </div>
  );
};

export default AESDemo;