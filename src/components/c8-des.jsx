import React, { useState, useRef } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import CryptoJS from 'crypto-js';

// DES Constants and Tables
const IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

const IP_INV = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

const E = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1
];

const P = [
    16, 7, 20, 21, 29, 12, 28, 17,
    1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9,
    19, 13, 30, 6, 22, 11, 4, 25
];

const PC1 = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
];

const PC2 = [
    14, 17, 11, 24, 1, 5, 3, 28,
    15, 6, 21, 10, 23, 19, 12, 4,
    26, 8, 16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55, 30, 40,
    51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32
];

const SBOXES = [
    // S1
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    // S2
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    // S3
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    // S4
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    // S5
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    // S6
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    // S7
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    // S8
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
];

const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// Utility functions
// Convert hex string to array of bits
const hexToBits = (hex) => {
  const bits = [];
  for (let i = 0; i < hex.length; i++) {
    const decimal = parseInt(hex[i], 16);
    const binary = decimal.toString(2).padStart(4, '0');
    for (let j = 0; j < 4; j++) {
      bits.push(binary[j] === '1' ? 1 : 0);
    }
  }
  return bits;
};

// Convert string to array of bits
const stringToBits = (str) => {
  const bits = [];
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const binary = charCode.toString(2).padStart(8, '0');
    for (let j = 0; j < 8; j++) {
      bits.push(binary[j] === '1' ? 1 : 0);
    }
  }
  // Pad to 64 bits if needed
  while (bits.length < 64) {
    bits.push(0);
  }
  // Truncate to 64 bits if too long
  return bits.slice(0, 64);
};

// Convert array of bits to hex string
const bitsToHex = (bits) => {
  let hex = '';
  for (let i = 0; i < bits.length; i += 4) {
    const chunk = bits.slice(i, i + 4);
    const decimal = chunk.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 3 - idx), 0);
    hex += decimal.toString(16).toUpperCase();
  }
  return hex;
};

// Convert array of bits to ASCII string
const bitsToAscii = (bits) => {
  let ascii = '';
  for (let i = 0; i < bits.length; i += 8) {
    const chunk = bits.slice(i, i + 8);
    const decimal = chunk.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 7 - idx), 0);
    // Only add printable ASCII characters
    if (decimal >= 32 && decimal <= 126) {
      ascii += String.fromCharCode(decimal);
    } else {
      ascii += '.';
    }
  }
  return ascii;
};

// XOR two bit arrays
const xorBits = (a, b) => {
  return a.map((bit, i) => bit ^ b[i]);
};

const permute = (input, table) => {
    const output = [];
    for (let i = 0; i < table.length; i++) {
        output.push(input[table[i] - 1]);
    }
    return output;
};

// Generate subkeys from key bits
const generateSubkeys = (keyBits) => {
  // Apply PC1 permutation
  const pc1Bits = [];
  for (let i = 0; i < PC1.length; i++) {
    pc1Bits.push(keyBits[PC1[i] - 1]);
  }
  
  // Split into left and right halves
  let left = pc1Bits.slice(0, 28);
  let right = pc1Bits.slice(28, 56);
  
  // Generate 16 subkeys
  const subkeys = [];
  for (let i = 0; i < 16; i++) {
    // Apply left shifts
    left = [...left.slice(SHIFTS[i]), ...left.slice(0, SHIFTS[i])];
    right = [...right.slice(SHIFTS[i]), ...right.slice(0, SHIFTS[i])];
    
    // Combine halves
    const combined = [...left, ...right];
    
    // Apply PC2 permutation
    const subkey = [];
    for (let j = 0; j < PC2.length; j++) {
      subkey.push(combined[PC2[j] - 1]);
    }
    
    subkeys.push({
      key: subkey,
      left: [...left],
      right: [...right],
      shifts: SHIFTS[i],
      round: i + 1
    });
  }
  
  return subkeys;
};

const sBox = (input) => {
    let output = [];
    for (let i = 0; i < 8; i++) {
        const block = input.slice(i * 6, (i + 1) * 6);
        const row = (block[0] << 1) | block[5];
        const col = (block[1] << 3) | (block[2] << 2) | (block[3] << 1) | block[4];
        const val = SBOXES[i][row][col];
        const binary = val.toString(2).padStart(4, '0');
        for (let j = 0; j < 4; j++) {
            output.push(binary[j] === '1' ? 1 : 0);
        }
    }
    return output;
};

const feistel = (right, key) => {
    // Expansion
    const expanded = permute(right, E);
    
    // XOR with subkey
    const xored = xorBits(expanded, key);
    
    // S-box substitution
    const substituted = sBox(xored);
    
    // P-box permutation
    const permuted = permute(substituted, P);
    
    return {
        expanded,
        xored,
        substituted,
        permuted
    };
};

const DESDemo = () => {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [output, setOutput] = useState('');
  const [steps, setSteps] = useState([]);
  const [cryptoJSResult, setCryptoJSResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tool');
  const [isReading, setIsReading] = useState(false);
  const [stringToConvert, setStringToConvert] = useState('');
  const [convertedHex, setConvertedHex] = useState('');
  const [showConverter, setShowConverter] = useState(false);
  const [inputType, setInputType] = useState('text'); // Default to text input
  const [inputText, setInputText] = useState('');
  const [inputHex, setInputHex] = useState('');
  const [keyType, setKeyType] = useState('text'); // Default to text key
  const [keyText, setKeyText] = useState('');
  const [keyHex, setKeyHex] = useState('');
  const [outputAscii, setOutputAscii] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate=useNavigate();
  // Maximum character limits
  const MAX_INPUT_TEXT_LENGTH = 8; // 64 bits (8 characters)
  const MAX_INPUT_HEX_LENGTH = 16; // 64 bits (16 hex characters)
  const MAX_KEY_HEX_LENGTH = 16; // 64 bits (16 hex characters)
  const MAX_KEY_TEXT_LENGTH = 8; // 64 bits (8 characters)

  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);
  
  const generateRandomKey = () => {
    const hex = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    setKey(result);
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

    // Prepare input and key bits
    let inputBits, keyBits;
    let processedInputHex, processedKeyHex;

    if (inputType === 'text') {
      inputBits = stringToBits(inputText);
      processedInputHex = bitsToHex(inputBits);
    } else {
      // Pad or truncate hex input
      processedInputHex = inputHex.padEnd(MAX_INPUT_HEX_LENGTH, '0').substring(0, MAX_INPUT_HEX_LENGTH);
      inputBits = hexToBits(processedInputHex);
    }

    if (keyType === 'text') {
      keyBits = stringToBits(keyText);
      processedKeyHex = bitsToHex(keyBits);
    } else {
      // Pad or truncate hex key
      processedKeyHex = keyHex.padEnd(MAX_KEY_HEX_LENGTH, '0').substring(0, MAX_KEY_HEX_LENGTH);
      keyBits = hexToBits(processedKeyHex);
    }

    // Generate subkeys
    const subkeys = generateSubkeys(keyBits);
    const usedSubkeys = mode === 'encrypt' ? subkeys : [...subkeys].reverse();

    // Initial permutation
    let IPBits = permute(inputBits, IP);
    let L = IPBits.slice(0, 32);
    let R = IPBits.slice(32, 64);

    // Record steps
    let recordedSteps = [];
    recordedSteps.push({ 
      desc: "Initial Permutation (IP)", 
      L: [...L], 
      R: [...R],
      inputHex: processedInputHex.toUpperCase(),
      keyHex: processedKeyHex.toUpperCase(),
      mode: mode
    });

    // 16 rounds
    for (let round = 0; round < 16; round++) {
      const oldL = [...L];
      const oldR = [...R];
      const subkey = usedSubkeys[round];
      
      // Feistel function
      const feistelResult = feistel(R, subkey.key);
      
      // Update left and right
      L = R;
      R = xorBits(oldL, feistelResult.permuted);
      
      recordedSteps.push({
        desc: `Round ${round + 1}`,
        L: [...L],
        R: [...R],
        leftBefore: oldL,
        rightBefore: oldR,
        subkey: subkey.key,
        feistel: feistelResult,
        round: round + 1
      });
    }

    // Final permutation
    const combined = R.concat(L); // Note the swap
    const finalBits = permute(combined, IP_INV);

    recordedSteps.push({ 
      desc: "Final Permutation (IP Inverse)", 
      bits: finalBits,
      combined: combined
    });

    // Set output
    const outputHex = bitsToHex(finalBits);
    setOutput(outputHex);
    setOutputAscii(bitsToAscii(finalBits));
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
      
      if (mode === 'encrypt') {
        cryptoResult = CryptoJS.DES.encrypt(
          cryptoInput, 
          cryptoKey, 
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding }
        );
      } else {
        cryptoResult = CryptoJS.DES.decrypt(
          { ciphertext: cryptoInput },
          cryptoKey,
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding }
        );
      }
      
      setCryptoJSResult(cryptoResult.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase());
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

  // Render bits as a string
  const renderBits = (bits) => {
    if (!bits) return '';
    return bits.join('');
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
     <div className="back-nav">
        <Link to="/" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">Data Encryption Standard (DES)</h1>

        {/* Tab Navigation */}
        <div className="cipher-nav-container">
          <button
            onClick={() => setActiveTab('tool')}
            className={`nav-button ${activeTab === 'tool' ? '' : 'secondary'}`}
          >
            Tool
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`nav-button ${activeTab === 'about' ? '' : 'secondary'}`}
          >
            About
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/q-des')}
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
                        Note: DES requires exactly 16 hex characters (64 bits) for input and key.
                        {convertedHex.length > 16 && (
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
                  placeholder="Enter text (max 8 characters)"
                  rows="4"
                  maxLength={MAX_INPUT_TEXT_LENGTH}
                />
              ) : (
                <textarea
                  value={inputHex}
                  onChange={(e) => setInputHex(e.target.value.toUpperCase())}
                  placeholder="Enter hexadecimal value (e.g., 123456ABCDEF0000)"
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
                
              </div>
              {keyType === 'text' ? (
                <input
                  type="text"
                  value={keyText}
                  onChange={(e) => setKeyText(e.target.value)}
                  placeholder="Enter key text (exactly 8 characters)"
                  maxLength={MAX_KEY_TEXT_LENGTH}
                />
              ) : (
                <input
                  type="text"
                  value={keyHex}
                  onChange={(e) => setKeyHex(e.target.value.toUpperCase())}
                  placeholder="Enter 64-bit key in hex (e.g., 133457799BBCDFF1)"
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
                          <div style={{ marginBottom: '1rem' }}>
                            <div><strong>After Initial Permutation:</strong></div>
                            <div><strong>Left Half (L₀):</strong></div>
                            <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                              {renderBits(steps[0].L)}
                            </pre>
                            <div><strong>Right Half (R₀):</strong></div>
                            <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                              {renderBits(steps[0].R)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {stepIndex > 0 && stepIndex < steps.length - 1 && (
                        <div className="step-content">
                          <div style={{ marginBottom: '1rem' }}>
                            <div><strong>Round {steps[stepIndex].round}:</strong></div>
                            <div style={{ marginTop: '0.5rem' }}>
                              <div><strong>Input to Round:</strong></div>
                              <div><strong>L{steps[stepIndex].round - 1}:</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderBits(steps[stepIndex].leftBefore)}
                              </pre>
                              <div><strong>R{steps[stepIndex].round - 1}:</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderBits(steps[stepIndex].rightBefore)}
                              </pre>
                            </div>
                          </div>

                          <div style={{ marginBottom: '1rem' }}>
                            <div><strong>Subkey K{steps[stepIndex].round}:</strong></div>
                            <pre style={{ background: '#ddd', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                              {renderBits(steps[stepIndex].subkey)}
                            </pre>
                          </div>

                          <div style={{ marginBottom: '1rem' }}>
                            <div><strong>Feistel Function Steps:</strong></div>
                            <div style={{ marginTop: '0.5rem' }}>
                              <div><strong>1. Expansion E(R{steps[stepIndex].round - 1}):</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderBits(steps[stepIndex].feistel.expanded)}
                              </pre>
                              <div><strong>2. XOR with Subkey:</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderBits(steps[stepIndex].feistel.xored)}
                              </pre>
                              <div><strong>3. S-Box Substitution:</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderBits(steps[stepIndex].feistel.substituted)}
                              </pre>
                              <div><strong>4. P-Box Permutation:</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderBits(steps[stepIndex].feistel.permuted)}
                              </pre>
                            </div>
                          </div>

                          <div style={{ marginBottom: '1rem' }}>
                            <div><strong>Output of Round:</strong></div>
                            <div><strong>L{steps[stepIndex].round}:</strong></div>
                            <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                              {renderBits(steps[stepIndex].L)}
                            </pre>
                            <div><strong>R{steps[stepIndex].round}:</strong></div>
                            <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                              {renderBits(steps[stepIndex].R)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {stepIndex === steps.length - 1 && (
                        <div className="step-content">
                          <div style={{ marginBottom: '1rem' }}>
                            <div><strong>Final Step:</strong></div>
                            <div style={{ marginTop: '0.5rem' }}>
                              <div><strong>1. 32-bit Swap (R16 + L16):</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderBits(steps[stepIndex].combined)}
                              </pre>
                              <div><strong>2. Final Permutation (IP⁻¹):</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {renderBits(steps[stepIndex].bits)}
                              </pre>
                              <div><strong>3. Final Output (Hex):</strong></div>
                              <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                {output.toUpperCase()}
                              </pre>
                              {outputAscii && (
                                <>
                                  <div><strong>4. Final Output (ASCII, if printable):</strong></div>
                                  <pre style={{ background: '#eee', padding: '0.5rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                                    {outputAscii}
                                  </pre>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

{output && (
  <div className="output-group">
    <div className="flex justify-between items-center mb-2">
      <div className="output-title">Output</div>
      <button
        onClick={copyToClipboard}
        className="text-sm"
        style={{
          color: 'var(--primary-color)',
          background: 'none',
          padding: '4px 8px',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>

    <div className="output-content">
      <div className="result-box">{output.toUpperCase()}</div>
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
            <h2 className="section-title">What Even Is DES? </h2>
            <p>
              Okay, imagine you have a message — like "HELLO" — and you want to send it to a friend without anyone else snooping. That’s where encryption steps in. DES (Data Encryption Standard) is like a secret recipe for scrambling your message so only someone with the right key can unscramble it.
            </p>
            <p>
              It was made way back in the 1970s (yep, disco era), and while it’s not used in serious security stuff today, it totally changed the game back then — and it’s still a fun way to learn the basics of how encryption works!
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">So How Does It Actually Work? </h2>
            <p>
              Think of DES like a super intense blender. You throw your data (called a "block") and your key (like a password) into it, and it runs through 16 intense rounds of scrambling magic. Here’s the vibe:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Initial Permutation (IP):</strong> Just like shuffling the cards before a game, DES mixes up your 64-bit input block.</li>
              <li><strong>16 Rounds:</strong> In each round, half your data gets mixed with a piece of your key (called a "subkey").</li>
              <li><strong>Expansion (E):</strong> We stretch 32 bits into 48 bits — like inflating a balloon — to match the subkey size.</li>
              <li><strong>Key Mixing:</strong> Your data gets XOR’d with the subkey (a fancy way of saying "combine with a secret twist").</li>
              <li><strong>S-Boxes:</strong> These are like mini-maze puzzles that substitute chunks of bits in clever ways to confuse any attacker.</li>
              <li><strong>P Permutation:</strong> The final shuffle to further scramble the bits before heading into the next round.</li>
              <li><strong>Final Permutation (FP):</strong> The last twist to lock the scrambled message into a totally new format — your ciphertext!</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">Let’s Visualize It </h2>
            <div className="flex justify-center my-6">
              <img src="/images/des-diagram.png" alt="DES Diagram" className="rounded shadow-md w-full max-w-xl" />
            </div>
            <p className="text-center italic">Above: A simplified overview of the DES flow — don’t worry if it looks complex! We’ll walk you through it.</p>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">Why DES Matters </h2>
            <ul className="list-disc ml-6 mb-4">
              <li>It was the first encryption method widely adopted by the U.S. government.</li>
              <li>Even though it’s old, its structure inspired modern encryption like AES.</li>
              <li>It taught the world how to make and break ciphers — leading to better security today!</li>
            </ul>
            <p>
              DES isn't just some dusty relic — it’s a stepping stone to understanding cryptography. If you're learning how data protection works, DES is a great place to start.
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">What About Triple DES? </h2>
            <p>
              When people realized DES’s 56-bit key wasn’t strong enough anymore (thanks to faster computers), they didn’t ditch it right away. Instead, they ran DES <strong>three times</strong> with different keys — that’s called <strong>Triple DES</strong>. More secure, but way slower.
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="section-title">Wait... Is It Still Used? </h2>
            <p>
              Not really! It’s mostly retired now. But it’s still taught and used for demos (like this one) because it's compact, clear, and shows how encryption works under the hood.
            </p>
          </section>
        
          <section>
            <h2 className="section-title">Your Turn to Try </h2>
            <p>
              Enter a message and a key above and watch how DES transforms it step by step. We’ve broken down each round for you, so you can peek behind the curtain and really get what’s going on.
            </p>
            <p>
              Encryption doesn't have to be mysterious — and you're about to prove it. Ready? Let's scramble some text!
            </p>
          </section>
        </div>        
        )}
      </div>
    </div>
  );
};

export default DESDemo;