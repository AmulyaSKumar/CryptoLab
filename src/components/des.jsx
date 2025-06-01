import React, { useState } from "react";
import CryptoJS from "crypto-js";
// Permutation and S-box tables used in DES
const IP = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7,
];

const IP_INV = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25,
];

const E = [
  32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1,
];

const P = [
  16, 7, 20, 21,
  29, 12, 28, 17,
  1, 15, 23, 26,
  5, 18, 31, 10,
  2, 8, 24, 14,
  32, 27, 3, 9,
  19, 13, 30, 6,
  22, 11, 4, 25,
];

const S_BOXES = [
  [
    [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],
    [0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],
    [4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],
    [15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
  ],
  [
    [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],
    [3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],
    [0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],
    [13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
  ],
  [
    [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],
    [13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],
    [13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],
    [1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
  ],
  [
    [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],
    [13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],
    [10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],
    [3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
  ],
  [
    [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],
    [14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],
    [4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],
    [11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
  ],
  [
    [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],
    [10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],
    [9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],
    [4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
  ],
  [
    [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],
    [13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],
    [1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],
    [6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
  ],
  [
    [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],
    [1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],
    [7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],
    [2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11],
  ],
];

// PC1 and PC2 for key scheduling
const PC1 = [
  57,49,41,33,25,17,9,
  1,58,50,42,34,26,18,
  10,2,59,51,43,35,27,
  19,11,3,60,52,44,36,
  63,55,47,39,31,23,15,
  7,62,54,46,38,30,22,
  14,6,61,53,45,37,29,
  21,13,5,28,20,12,4,
];

const PC2 = [
  14,17,11,24,1,5,
  3,28,15,6,21,10,
  23,19,12,4,26,8,
  16,7,27,20,13,2,
  41,52,31,37,47,55,
  30,40,51,45,33,48,
  44,49,39,56,34,53,
  46,42,50,36,29,32,
];

// Left rotations per round
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// Utility functions

// Permute bits array with given table (1-based)
function permute(bits, table) {
  return table.map((pos) => bits[pos - 1]);
}

// Left rotate bits array by n positions
function leftRotate(bits, n) {
  return bits.slice(n).concat(bits.slice(0, n));
}

// Convert string to 64-bit array of bits (pad or truncate)
function stringToBits(str) {
  let bits = [];
  for (let i = 0; i < 8; i++) {
    let charCode = i < str.length ? str.charCodeAt(i) : 0;
    for (let b = 7; b >= 0; b--) {
      bits.push((charCode >> b) & 1);
    }
  }
  return bits;
}

// Convert bits array to hex string
function bitsToHex(bits) {
  let hex = "";
  for (let i = 0; i < bits.length; i += 4) {
    let nibble = bits.slice(i, i + 4).join("");
    let decimal = parseInt(nibble, 2);
    hex += decimal.toString(16);
  }
  return hex.toUpperCase();
}

// Convert bits array to ASCII string
function bitsToAscii(bits) {
  let ascii = "";
  for (let i = 0; i < bits.length; i += 8) {
    let byte = bits.slice(i, i + 8).join("");
    let decimal = parseInt(byte, 2);
    ascii += String.fromCharCode(decimal);
  }
  return ascii;
}

// XOR two bits arrays
function xorBits(a, b) {
  return a.map((bit, idx) => bit ^ b[idx]);
}

// S-box substitution for 48 bits to 32 bits
function sBoxSubstitution(bits48) {
  let output = [];
  for (let i = 0; i < 8; i++) {
    let block = bits48.slice(i * 6, i * 6 + 6);
    let row = (block[0] << 1) | block[5];
    let col = (block[1] << 3) | (block[2] << 2) | (block[3] << 1) | block[4];
    let val = S_BOXES[i][row][col];
    for (let j = 3; j >= 0; j--) {
      output.push((val >> j) & 1);
    }
  }
  return output;
}

// Generate 16 subkeys of 48 bits each from 64-bit key
function generateSubkeys(keyBits) {
  const key56 = permute(keyBits, PC1); // 56 bits
  let C = key56.slice(0, 28);
  let D = key56.slice(28, 56);
  let subkeys = [];

  for (let i = 0; i < 16; i++) {
    C = leftRotate(C, SHIFTS[i]);
    D = leftRotate(D, SHIFTS[i]);
    let combined = C.concat(D);
    let subkey = permute(combined, PC2); // 48 bits
    subkeys.push(subkey);
  }
  return subkeys;
}

// Feistel function f(R, K)
function feistel(R, K) {
  const expandedR = permute(R, E); // 48 bits
  const xorWithKey = xorBits(expandedR, K);
  const sboxOutput = sBoxSubstitution(xorWithKey);
  const fOutput = permute(sboxOutput, P); // 32 bits
  return fOutput;
}

export default function DESDemo() {
  const [inputText, setInputText] = useState("");
  const [keyText, setKeyText] = useState("");
  const [mode, setMode] = useState("encrypt"); // "encrypt" or "decrypt"
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [finalOutput, setFinalOutput] = useState(null);

  // Start the encryption or decryption process
  const startProcess = () => {
    if (inputText.length > 8) {
      alert("Input max 8 characters");
      return;
    }
    if (keyText.length !== 8) {
      alert("Key must be exactly 8 characters");
      return;
    }

    const inputBits = stringToBits(inputText);
    const keyBits = stringToBits(keyText);

    const subkeys = generateSubkeys(keyBits);
    const usedSubkeys = mode === "encrypt" ? subkeys : [...subkeys].reverse();

    let IPBits = permute(inputBits, IP);
    let L = IPBits.slice(0, 32);
    let R = IPBits.slice(32, 64);

    let recordedSteps = [];
    recordedSteps.push({ desc: "Initial Permutation (IP)", L: [...L], R: [...R] });

    for (let round = 0; round < 16; round++) {
      const oldR = [...R];
      const fOut = feistel(R, usedSubkeys[round]);
      R = xorBits(L, fOut);
      L = oldR;

      recordedSteps.push({
        desc: `Round ${round + 1}`,
        L: [...L],
        R: [...R],
        subkey: usedSubkeys[round],
        fOut,
      });
    }

    // Combine R and L (note the swap after last round)
    const combined = R.concat(L);
    const finalBits = permute(combined, IP_INV);

    recordedSteps.push({ desc: "Final Permutation (IP Inverse)", bits: finalBits });

    setSteps(recordedSteps);
    setStepIndex(0);
    setFinalOutput(null);
  };

  // Move to next step
  const nextStep = () => {
    if (stepIndex + 1 < steps.length) {
      setStepIndex(stepIndex + 1);
    } else {
      // Show final output
      const finalBits = steps[steps.length - 1].bits;
      setFinalOutput({
        binary: finalBits.join(""),
        hex: bitsToHex(finalBits),
        ascii: bitsToAscii(finalBits),
      });
    }
  };

  const renderBits = (bits) => bits.join("");

  return (
    <div style={{ fontFamily: "monospace", padding: 20 }}>
      <h2>DES Encryption / Decryption Step-by-Step</h2>
      <div>
        <label>
          Input Text (max 8 chars):{" "}
          <input
            maxLength={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Key (exactly 8 chars):{" "}
          <input
            maxLength={8}
            value={keyText}
            onChange={(e) => setKeyText(e.target.value)}
          />
        </label>
      </div>
      <div style={{ margin: "10px 0" }}>
        <label>
          <input
            type="radio"
            name="mode"
            checked={mode === "encrypt"}
            onChange={() => setMode("encrypt")}
          />
          Encrypt
        </label>
        <label style={{ marginLeft: 20 }}>
          <input
            type="radio"
            name="mode"
            checked={mode === "decrypt"}
            onChange={() => setMode("decrypt")}
          />
          Decrypt
        </label>
      </div>
      <button onClick={startProcess}>Start {mode === "encrypt" ? "Encryption" : "Decryption"}</button>

      {stepIndex >= 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Step {stepIndex + 1} / {steps.length}</h3>
          <div><b>{steps[stepIndex].desc}</b></div>

          {"L" in steps[stepIndex] && "R" in steps[stepIndex] ? (
            <>
              <div>
                <b>L:</b> <pre style={{ background: "#eee", padding: 5 }}>{renderBits(steps[stepIndex].L)}</pre>
              </div>
              <div>
                <b>R:</b> <pre style={{ background: "#eee", padding: 5 }}>{renderBits(steps[stepIndex].R)}</pre>
              </div>
            </>
          ) : null}

          {steps[stepIndex].subkey && (
            <>
              <div>
                <b>Subkey:</b>{" "}
                <pre style={{ background: "#ddd", padding: 5 }}>
                  {renderBits(steps[stepIndex].subkey)}
                </pre>
              </div>
              <div>
                <b>f(R, K):</b>{" "}
                <pre style={{ background: "#ddd", padding: 5 }}>
                  {renderBits(steps[stepIndex].fOut)}
                </pre>
              </div>
            </>
          )}

          {steps[stepIndex].bits && (
            <div>
              <b>Result bits after final permutation:</b>
              <pre style={{ background: "#eee", padding: 5 }}>
                {renderBits(steps[stepIndex].bits)}
              </pre>
            </div>
          )}

          <button onClick={nextStep} style={{ marginTop: 10 }}>
            Next Step
          </button>
        </div>
      )}

{finalOutput && (
  <div style={{ marginTop: 20 }}>
    <h3>Final Output (Using CryptoJS)</h3>

    {/* Encrypt using CryptoJS for display */}
    {(() => {
      // Convert key to WordArray (UTF-8)
      const keyWA = CryptoJS.enc.Utf8.parse(keyText);

      // Encrypt original plaintext with DES ECB mode, no padding (match your DES logic)
      const encrypted = CryptoJS.DES.encrypt(finalOutput.ascii, keyWA, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding,
      });

      // Decrypt back to plaintext
      const decrypted = CryptoJS.DES.decrypt(encrypted, keyWA, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding,
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      return (
        <>
          <div>
            <b>Original Plaintext:</b> {finalOutput.ascii}
          </div>

          <div>
            <b>Encrypted Hex (CryptoJS):</b>
            <pre style={{ background: "#f9f9f9", padding: 10, overflowX: "auto" }}>
              {encrypted.ciphertext.toString(CryptoJS.enc.Hex)}
            </pre>
          </div>

          <div>
            <b>Encrypted (Base64, readable):</b> {encrypted.toString()}
          </div>

          <div>
            <b>Decrypted Text (CryptoJS):</b> {decryptedText}
          </div>
        </>
      );
    })()}
  </div>
)}

    </div>
  );
}
