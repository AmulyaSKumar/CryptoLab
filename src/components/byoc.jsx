import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const CustomCipherBuilder = () => {
  // State for input, operations, and results
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('text'); // text, binary, hex
  const [operations, setOperations] = useState([]);
  const [cipherName, setCipherName] = useState('My Custom Cipher');
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState([]);
  const [activeTab, setActiveTab] = useState('tool');
  const [mode, setMode] = useState('encrypt'); // encrypt or decrypt
  
  // Refs for animation
  const operationsRef = useRef(null);
  
  // Convert input based on selected type
  const convertInput = (value, fromType, toType) => {
    if (fromType === toType) return value;
    
    let intermediate;
    
    // Convert to intermediate (text)
    if (fromType === 'binary') {
      intermediate = value.replace(/\s+/g, '')
        .match(/.{1,8}/g)?.map(byte => String.fromCharCode(parseInt(byte, 2)))
        .join('') || '';
    } else if (fromType === 'hex') {
      intermediate = value.replace(/\s+/g, '')
        .match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16)))
        .join('') || '';
    } else {
      intermediate = value;
    }
    
    // Convert from intermediate to target
    if (toType === 'binary') {
      return Array.from(intermediate)
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
    } else if (toType === 'hex') {
      return Array.from(intermediate)
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(' ');
    } else {
      return intermediate;
    }
  };
    // Add a new operation to the pipeline
  const addOperation = (type) => {
    let newOp = { type, id: Date.now() };
    
    if (type === 'shift') {
      newOp.value = 3; // Default shift value
    } else if (type === 'xor') {
      newOp.value = '01'; // Default XOR value in hex
    } else if (type === 'swap') {
      newOp.positions = [0, 1]; // Default positions to swap
    } else if (type === 'substitution') {
      // Default substitution map (A→@, E→3, etc.)
      newOp.map = {
        'A': '@', 'E': '3', 'I': '1', 'O': '0', 'S': '$', 'T': '7',
        'a': '@', 'e': '3', 'i': '1', 'o': '0', 's': '$', 't': '7'
      };
    }
    
    setOperations([...operations, newOp]);
    
    // Scroll to the new operation
    setTimeout(() => {
      if (operationsRef.current) {
        operationsRef.current.scrollTop = operationsRef.current.scrollHeight;
      }
    }, 100);
  };
    // Helper function to check if input is valid
  const validateInput = () => {
    return input.trim().length > 0;
  };
  
  // Remove an operation from the pipeline
  const removeOperation = (id) => {
    setOperations(operations.filter(op => op.id !== id));
  };
  
  // Update an operation's parameters
  const updateOperation = (id, updates) => {
    setOperations(operations.map(op => 
      op.id === id ? { ...op, ...updates } : op
    ));
  };
  // Apply operations to input and compute result
  const computeResult = () => {
    if (!input) return;
    
    let currentValue = input;
    let currentType = inputType;
    let stepResults = [];
    
    // First convert to working format (text)
    let workingValue = convertInput(currentValue, currentType, 'text');
    stepResults.push({
      description: `Initial input (${currentType}):`,
      value: currentValue,
      type: currentType
    });
    
    if (currentType !== 'text') {
      stepResults.push({
        description: 'Converted to text:',
        value: workingValue,
        type: 'text'
      });
    }
    
    // Get operations in the correct order based on mode
    const opsToApply = mode === 'encrypt' 
      ? operations 
      : [...operations].reverse();
    
    // Apply each operation
    opsToApply.forEach((op) => {
      let description = '';
      
      if (op.type === 'shift') {
        const shiftValue = mode === 'encrypt' ? op.value : -op.value;
        description = `${mode === 'encrypt' ? 'Applied' : 'Reversed'} shift of ${op.value}:`;
        workingValue = Array.from(workingValue)
          .map(char => {
            const code = char.charCodeAt(0);
            return String.fromCharCode(code + shiftValue);
          })
          .join('');
      } else if (op.type === 'xor') {
        const xorValue = parseInt(op.value, 16);
        // XOR is its own inverse, so encrypt and decrypt are the same
        description = `Applied XOR with ${op.value} (hex):`;
        workingValue = Array.from(workingValue)
          .map(char => {
            const code = char.charCodeAt(0);
            return String.fromCharCode(code ^ xorValue);
          })
          .join('');
      } else if (op.type === 'swap') {
        const [pos1, pos2] = op.positions;
        description = `${mode === 'encrypt' ? 'Swapped' : 'Unswapped'} positions ${pos1} and ${pos2}:`;
        
        if (pos1 < workingValue.length && pos2 < workingValue.length) {
          const chars = Array.from(workingValue);
          [chars[pos1], chars[pos2]] = [chars[pos2], chars[pos1]];
          workingValue = chars.join('');
        }
      } else if (op.type === 'reverse') {
        description = `${mode === 'encrypt' ? 'Reversed' : 'Unreversed'} text:`;
        workingValue = Array.from(workingValue).reverse().join('');
      } else if (op.type === 'caseFlip') {
        description = 'Flipped character cases:';
        workingValue = Array.from(workingValue)
          .map(char => {
            if (char >= 'a' && char <= 'z') {
              return char.toUpperCase();
            } else if (char >= 'A' && char <= 'Z') {
              return char.toLowerCase();
            }
            return char;
          })
          .join('');
      } else if (op.type === 'removeVowels') {
        if (mode === 'decrypt') {
          description = 'Warning: Cannot restore removed vowels (lossy operation):';
        } else {
          description = 'Removed vowels:';
          workingValue = workingValue.replace(/[aeiouAEIOU]/g, '');
        }
      } else if (op.type === 'substitution') {
        if (mode === 'encrypt') {
          description = 'Applied character substitution:';
          workingValue = Array.from(workingValue)
            .map(char => op.map[char] || char)
            .join('');
        } else {
          // For decryption, reverse the substitution map
          description = 'Reversed character substitution:';
          const reverseMap = {};
          Object.entries(op.map).forEach(([from, to]) => {
            reverseMap[to] = from;
          });
          
          workingValue = Array.from(workingValue)
            .map(char => reverseMap[char] || char)
            .join('');
        }
      }
      
      stepResults.push({
        description,
        value: workingValue,
        type: 'text'
      });
    });
    
    // Convert back to the original input type if needed
    if (inputType !== 'text') {
      const finalValue = convertInput(workingValue, 'text', inputType);
      stepResults.push({
        description: `Converted back to ${inputType}:`,
        value: finalValue,
        type: inputType
      });
      workingValue = finalValue;
    }
    
    setResult(workingValue);
    setSteps(stepResults);
  };
  // Generate PDF with cipher definition
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(cipherName, 20, 20);
    
    // Add description
    doc.setFontSize(12);
    doc.text('Custom Cipher Definition', 20, 30);
    
    // Add input type
    doc.text(`Input Type: ${inputType.toUpperCase()}`, 20, 40);
    
    // Add operations
    doc.text('Encryption Algorithm:', 20, 50);
    
    let y = 60;
    operations.forEach((op, index) => {
      let description = '';
      
      if (op.type === 'shift') {
        description = `${index + 1}. Shift each character by ${op.value}`;
      } else if (op.type === 'xor') {
        description = `${index + 1}. XOR each character with ${op.value} (hex)`;
      } else if (op.type === 'swap') {
        description = `${index + 1}. Swap positions ${op.positions[0]} and ${op.positions[1]}`;
      } else if (op.type === 'reverse') {
        description = `${index + 1}. Reverse the text`;
      } else if (op.type === 'caseFlip') {
        description = `${index + 1}. Flip the case of each letter (A→a, a→A)`;
      } else if (op.type === 'removeVowels') {
        description = `${index + 1}. Remove all vowels (a, e, i, o, u)`;
      } else if (op.type === 'substitution') {        
        description = `${index + 1}. Substitute characters according to custom mapping`;
        
        // Add substitution map details on next line
        doc.text(description, 20, y);
        y += 10;
        
        // Format the substitution map
        const mapEntries = Object.entries(op.map).map(([from, to]) => `${from}→${to}`);
        const mapChunks = [];
        for (let i = 0; i < mapEntries.length; i += 5) {
          mapChunks.push(mapEntries.slice(i, i + 5).join(', '));
        }
        
        mapChunks.forEach(chunk => {
          doc.text(`   ${chunk}`, 20, y);
          y += 8;
        });
        
        // Skip the rest for this iteration
        return;
      }
      
      doc.text(description, 20, y);
      y += 10;
      
      // Add a new page if needed
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
    });
    
    // Add decryption details
    y += 10;
    doc.text('Decryption Algorithm:', 20, y);
    y += 10;
    doc.text('Apply the same operations in reverse order:', 20, y);
    y += 10;
    
    // List reversed operations
    const reversedOps = [...operations].reverse();
    reversedOps.forEach((op, index) => {
      let description = '';
      
      if (op.type === 'shift') {
        description = `${index + 1}. Shift each character by -${op.value}`;
      } else if (op.type === 'xor') {
        description = `${index + 1}. XOR each character with ${op.value} (hex) - XOR is its own inverse`;
      } else if (op.type === 'swap') {
        description = `${index + 1}. Swap positions ${op.positions[0]} and ${op.positions[1]} - same as encryption`;
      } else if (op.type === 'reverse') {
        description = `${index + 1}. Reverse the text - same as encryption`;
      } else if (op.type === 'caseFlip') {
        description = `${index + 1}. Flip the case of each letter - same as encryption`;
      } else if (op.type === 'removeVowels') {
        description = `${index + 1}. Warning: Cannot restore removed vowels (lossy operation)`;
      } else if (op.type === 'substitution') {
        description = `${index + 1}. Apply inverse substitution (swap the mappings)`;
      }
      
      doc.text(description, 20, y);
      y += 10;
      
      // Add a new page if needed
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    
    // Add example
    y += 10;
    if (input && result) {
      if (mode === 'encrypt') {
        doc.text('Example (Encryption):', 20, y);
        y += 10;
        doc.text(`Plaintext: ${input.substring(0, 30)}${input.length > 30 ? '...' : ''}`, 20, y);
        y += 10;
        doc.text(`Ciphertext: ${result.substring(0, 30)}${result.length > 30 ? '...' : ''}`, 20, y);
      } else {
        doc.text('Example (Decryption):', 20, y);
        y += 10;
        doc.text(`Ciphertext: ${input.substring(0, 30)}${input.length > 30 ? '...' : ''}`, 20, y);
        y += 10;
        doc.text(`Plaintext: ${result.substring(0, 30)}${result.length > 30 ? '...' : ''}`, 20, y);
      }
    }
    
    // Save the PDF
    doc.save(`${cipherName.replace(/\s+/g, '_')}.pdf`);
  };
    return (    <div className="main-container">
      <Link to="/" className="nav-button" style={{ position: 'absolute', top: '20px', left: '20px', minWidth: 'auto' }}>
        ← Back
      </Link>
      
      <div className="tool-container">        <h1 className="tool-title">Build Your Own Cipher</h1>
       
          <div className="tool-section">            {/* Cipher Name */}
            <div className="input-group">
              <label htmlFor="cipher-name">Cipher Name</label>
              <input
                id="cipher-name"
                type="text"
                value={cipherName}
                onChange={(e) => setCipherName(e.target.value)}
              />
            </div>{/* Mode Selection (Encrypt/Decrypt) */}
            <div className="input-group">
              <label>Mode</label>
              <div className="toggle-container" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <label className="toggle-switch" style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === 'encrypt'}
                    onChange={() => setMode('encrypt')}
                  />
                  <span className="toggle-label"> Encrypt</span>
                </label>
                <label className="toggle-switch" style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === 'decrypt'}
                    onChange={() => setMode('decrypt')}
                  />
                  <span className="toggle-label"> Decrypt</span>
                </label>
              </div>
            </div>            {/* Input Type Selection */}
            <div className="input-group">
              <label>Input Type</label>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                {['text', 'binary', 'hex'].map(type => (
                  <label className="toggle-switch" key={type} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="inputType"
                      checked={inputType === type}
                      onChange={() => setInputType(type)}
                    />
                    <span className="toggle-label">
                      {type === 'text' ? 'c' : type === 'binary' ? '01 ' : '0x '}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>              {/* Input */}
            <div className="input-group">
              <label htmlFor="input">
                {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} 
                <span style={{ fontSize: '0.8rem', color: '#777', marginLeft: '0.5rem' }}>
                  ({input.length} chars)
                </span>
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows="4"
                style={{ 
                  fontFamily: inputType !== 'text' ? 'monospace' : 'inherit'
                }}
                placeholder={
                  inputType === 'binary' ? '01001000 01100101 01101100 01101100 01101111' :
                  inputType === 'hex' ? '48 65 6c 6c 6f' :
                  mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter ciphertext to decrypt...'
                }
              />
            </div>
              {/* Operations */}
            <div className="input-group">
              <label>Operations</label>
              <div className="operations-container" style={{ border: '2px solid #e2e8f0', borderRadius: '4px', padding: '1rem', marginBottom: '1rem' }}>
                <div 
                  ref={operationsRef}
                  className="operations-list" 
                  style={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    padding: '0.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                  }}
                >                  {operations.length === 0 ? (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
                      No operations added yet. Use the buttons below to add operations.
                    </div>
                  ) : (
                    operations.map((op, index) => (
                      <div 
                        key={op.id} 
                        className="operation-item"
                        style={{
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderLeft: '4px solid var(--primary-color)',
                          borderRadius: '4px',
                          marginBottom: '0.75rem',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          position: 'relative',
                          animation: 'fadeIn 0.3s ease-out'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="order-controls" style={{ marginRight: '10px' }}>
                              <button 
                                onClick={() => {
                                  const newOps = [...operations];
                                  if (index > 0) {
                                    [newOps[index], newOps[index-1]] = [newOps[index-1], newOps[index]];
                                    setOperations(newOps);
                                  }
                                }}
                                disabled={index === 0}
                                style={{
                                  background: index === 0 ? '#f5f5f5' : '#f0f8ff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '4px 4px 0 0',
                                  padding: '2px 6px',
                                  cursor: index === 0 ? 'default' : 'pointer',
                                  opacity: index === 0 ? 0.5 : 1,
                                  display: 'block'
                                }}
                              >
                                ▲
                              </button>
                              <button 
                                onClick={() => {
                                  const newOps = [...operations];
                                  if (index < operations.length - 1) {
                                    [newOps[index], newOps[index+1]] = [newOps[index+1], newOps[index]];
                                    setOperations(newOps);
                                  }
                                }}
                                disabled={index === operations.length - 1}
                                style={{
                                  background: index === operations.length - 1 ? '#f5f5f5' : '#f0f8ff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '0 0 4px 4px',
                                  padding: '2px 6px',
                                  cursor: index === operations.length - 1 ? 'default' : 'pointer',
                                  opacity: index === operations.length - 1 ? 0.5 : 1,
                                  display: 'block'
                                }}
                              >
                                ▼
                              </button>
                            </div>
                            <strong>Operation {index + 1}: {op.type.charAt(0).toUpperCase() + op.type.slice(1)}</strong>
                          </div>
                          <button 
                            onClick={() => removeOperation(op.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ff5555',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              padding: '0 0.5rem'
                            }}
                          >
                            ×
                          </button>
                        </div>
                        
                        {op.type === 'shift' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label>Shift value:</label>
                            <input
                              type="range"
                              min="-26"
                              max="26"
                              value={op.value}
                              onChange={(e) => updateOperation(op.id, { value: parseInt(e.target.value) })}
                              className="input-range"
                              style={{ flex: 1 }}
                            />
                            <span style={{ minWidth: '30px', textAlign: 'center' }}>{op.value}</span>
                          </div>
                        )}
                        
                        {op.type === 'xor' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label>XOR value (hex):</label>
                            <input
                              type="text"
                              value={op.value}
                              onChange={(e) => {
                                const hexValue = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
                                updateOperation(op.id, { value: hexValue });
                              }}
                              style={{ 
                                padding: '0.25rem 0.5rem', 
                                width: '60px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontFamily: 'monospace'
                              }}
                              maxLength={2}
                            />
                          </div>
                        )}
                        
                        {op.type === 'swap' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label>Swap positions:</label>
                            <input
                              type="number"
                              min="0"
                              value={op.positions[0]}
                              onChange={(e) => {
                                const pos = parseInt(e.target.value) || 0;
                                updateOperation(op.id, { 
                                  positions: [pos, op.positions[1]] 
                                });
                              }}
                              style={{ 
                                padding: '0.25rem 0.5rem', 
                                width: '60px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                              }}
                            />
                            <span>and</span>
                            <input
                              type="number"
                              min="0"
                              value={op.positions[1]}
                              onChange={(e) => {
                                const pos = parseInt(e.target.value) || 0;
                                updateOperation(op.id, { 
                                  positions: [op.positions[0], pos] 
                                });
                              }}
                              style={{ 
                                padding: '0.25rem 0.5rem', 
                                width: '60px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                              }}
                            />
                          </div>
                        )}
                        
                        {op.type === 'reverse' && (
                          <div className="operation-info">
                            <p>Reverses the entire text (e.g., "HELLO" → "OLLEH")</p>
                          </div>
                        )}

                        {op.type === 'caseFlip' && (
                          <div className="operation-info">
                            <p>Flips the case of all letters (e.g., "Hello" → "hELLO")</p>
                          </div>
                        )}

                        {op.type === 'removeVowels' && (
                          <div className="operation-info">
                            <p>Removes all vowels (a, e, i, o, u) from the text</p>
                            <p><strong>Note:</strong> This is a lossy transformation and cannot be reversed!</p>
                          </div>
                        )}
                        
                        {op.type === 'substitution' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <p>Substitute characters according to the mapping:</p>
                            <div style={{ 
                              maxHeight: '120px', 
                              overflowY: 'auto', 
                              padding: '8px',
                              backgroundColor: '#f9f9f9', 
                              borderRadius: '4px',
                              border: '1px solid #ddd' 
                            }}>
                              {Object.entries(op.map).map(([from, to], i) => (
                                <div key={i} style={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  marginBottom: '4px',
                                  gap: '4px'
                                }}>
                                  <input
                                    type="text"
                                    value={from}
                                    maxLength={1}
                                    onChange={(e) => {
                                      const newKey = e.target.value.charAt(0);
                                      const newMap = {...op.map};
                                      const oldValue = newMap[from];
                                      delete newMap[from];
                                      if (newKey) {
                                        newMap[newKey] = oldValue;
                                      }
                                      updateOperation(op.id, { map: newMap });
                                    }}
                                    style={{ 
                                      width: '30px', 
                                      textAlign: 'center',
                                      padding: '2px',
                                      borderRadius: '2px',
                                      border: '1px solid #ccc'
                                    }}
                                  />
                                  <span>→</span>
                                  <input
                                    type="text"
                                    value={to}
                                    maxLength={1}
                                    onChange={(e) => {
                                      const newValue = e.target.value.charAt(0);
                                      const newMap = {...op.map};
                                      if (newValue) {
                                        newMap[from] = newValue;
                                      } else {
                                        delete newMap[from];
                                      }
                                      updateOperation(op.id, { map: newMap });
                                    }}
                                    style={{ 
                                      width: '30px', 
                                      textAlign: 'center',
                                      padding: '2px',
                                      borderRadius: '2px',
                                      border: '1px solid #ccc'
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      const newMap = {...op.map};
                                      delete newMap[from];
                                      updateOperation(op.id, { map: newMap });
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#ff5555',
                                      cursor: 'pointer',
                                      padding: '0 4px'
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  const newMap = {...op.map};
                                  let newKey = 'A';
                                  // Find an unused key
                                  while (newMap[newKey]) {
                                    // Try next character
                                    newKey = String.fromCharCode(newKey.charCodeAt(0) + 1);
                                    if (newKey > 'Z') newKey = 'a';
                                    if (newKey > 'z') newKey = '0';
                                    if (newKey > '9') break;
                                  }
                                  newMap[newKey] = '?';
                                  updateOperation(op.id, { map: newMap });
                                }}
                                style={{
                                  backgroundColor: '#e7f3ff',
                                  border: '1px solid #bedcf3',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Add Mapping
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>                <div className="add-operations" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                  <button 
                    className="nav-button secondary"
                    onClick={() => addOperation('shift')}
                    style={{ minWidth: '130px', padding: '0.5rem' }}
                  >
                    Add Shift
                  </button>
                  <button 
                    className="nav-button secondary"
                    onClick={() => addOperation('xor')}
                    style={{ minWidth: '130px', padding: '0.5rem' }}
                  >
                    Add XOR
                  </button>
                  <button 
                    className="nav-button secondary"
                    onClick={() => addOperation('swap')}
                    style={{ minWidth: '130px', padding: '0.5rem' }}
                  >
                    Add Swap
                  </button>
                  <button 
                    className="nav-button secondary"
                    onClick={() => addOperation('reverse')}
                    style={{ minWidth: '130px', padding: '0.5rem' }}
                  >
                    Add Reverse
                  </button>
                  <button 
                    className="nav-button secondary"
                    onClick={() => addOperation('caseFlip')}
                    style={{ minWidth: '130px', padding: '0.5rem' }}
                  >
                    Add Case Flip
                  </button>
                  <button 
                    className="nav-button secondary"
                    onClick={() => addOperation('removeVowels')}
                    style={{ minWidth: '130px', padding: '0.5rem' }}
                  >
                    Add Remove Vowels
                  </button>
                  <button 
                    className="nav-button secondary"
                    onClick={() => addOperation('substitution')}
                    style={{ minWidth: '130px', padding: '0.5rem' }}
                  >
                    Add Substitution
                  </button>
                </div>
              </div>
            </div>            {/* Compute Button */}
            <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
              <button 
                className="nav-button"
                onClick={computeResult}
                disabled={!validateInput() || operations.length === 0}
                style={{ 
                  opacity: (!validateInput() || operations.length === 0) ? 0.6 : 1,
                  minWidth: '200px'
                }}
              >
                {mode === 'encrypt' ? ' Encrypt' : ' Decrypt'}
              </button>
            </div>
              {/* Result */}
            {result && (
              <div className="input-group">
                <label>Result</label>
                <div className="result-box">
                  {result}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      alert('Result copied to clipboard!');
                    }}
                    className="nav-button secondary"
                    style={{ minWidth: '120px' }}
                  >
                    Copy Result
                  </button>
                  
                  {/* Download PDF Button */}
                  <button 
                    className="nav-button"
                    onClick={generatePDF}
                    style={{ minWidth: '180px' }}
                  >
                    Download Definition
                  </button>
                </div>
              </div>
            )}
              {/* Visualization */}
            {steps.length > 0 && (
              <div className="input-group">
                <label>Step-by-Step Visualization</label>
                <div className="steps-container">
                  {steps.map((step, index) => (
                    <div key={index} className="step">
                      <div className="step-header">
                        <span className="step-number">{index + 1}</span>
                        <span className="step-description">{step.description}</span>
                      </div>
                      <div className="step-content" style={{ 
                        fontFamily: step.type !== 'text' ? 'monospace' : 'inherit'
                      }}>
                        {step.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
       
      </div>
        {/* Add some CSS for animations and styling */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .steps-container {
          border: 2px solid var(--accent-color);
          border-radius: 4px;
          background-color: #f8fafc;
          padding: 1rem;
        }

        .step {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .step:last-child {
          margin-bottom: 0;
        }

        .step-header {
          margin-bottom: 0.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          margin-right: 0.5rem;
          font-size: 0.8rem;
        }

        .step-content {
          padding: 0.75rem;
          background-color: #f0f8ff;
          border-radius: 4px;
          word-break: break-all;
        }

        .toggle-switch {
          margin-right: 10px;
        }

        .toggle-switch input[type="radio"] {
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
};

export default CustomCipherBuilder;