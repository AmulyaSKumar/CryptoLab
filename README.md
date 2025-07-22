# CryptoLab - Interactive Cryptography Learning Platform

CryptoLab is an educational web application designed to help students and enthusiasts learn cryptography through interactive tools, challenges, and quizzes. The platform covers classical ciphers to modern encryption algorithms with hands-on practice.

##  What This Project Does

This is a complete cryptography learning platform that includes:
- **Interactive Cipher Tools** - Try encryption/decryption with step-by-step visualization
- **Educational Content** - Detailed explanations of how each cipher works
- **Practice Challenges** - Solve puzzles to test your understanding
- **Knowledge Quizzes** - Test your theoretical knowledge
- **AI Chat Assistant** - Get help with cryptography concepts

##  Project Structure

### Main Application Files
- **`src/App.jsx`** - Main application component that handles routing between different pages
- **`src/main.jsx`** - Entry point that renders the app and includes global styles
- **`src/index.css`** - Global styling for the entire application
- **`src/overflow-fix.css`** - Responsive fixes to prevent text inputs from overflowing screen

### Core Components

#### Home Page
- **`src/components/Home.jsx`** - Landing page with navigation to all cipher tools and features

#### Cipher Tools (Interactive Learning)
Each cipher has its own component with three main sections:
- **Tool Tab** - Interactive encryption/decryption with step-by-step visualization
- **About Tab** - Comprehensive explanation of the algorithm
- **Challenge/Quiz Links** - Practice and testing options

1. **`src/components/c1-ceaser.jsx`** - Caesar Cipher (shift letters by a fixed number)
2. **`src/components/c2-playfair.jsx`** - Playfair Cipher (5x5 grid encryption using digrams)
3. **`src/components/c3-hill.jsx`** - Hill Cipher (matrix multiplication encryption)
4. **`src/components/c4-otp.jsx`** - One-Time Pad (perfect encryption with random key)
5. **`src/components/c5-vigenere.jsx`** - Vigenère Cipher (keyword-based polyalphabetic substitution)
6. **`src/components/c6-vernam.jsx`** - Vernam Cipher (binary XOR encryption)
7. **`src/components/c7-railfence.jsx`** - Rail Fence Cipher (zigzag pattern transposition)
8. **`src/components/c8-des.jsx`** - DES (Data Encryption Standard with 16 rounds)
9. **`src/components/c9-aes.jsx`** - AES (Advanced Encryption Standard, modern encryption)
10. **`src/components/c10-rsa.jsx`** - RSA (Public key cryptography)

#### Special Components
- **`src/components/byoc.jsx`** - "Bring Your Own Cipher" - Custom cipher implementation tool
- **`src/components/c0-cipher.jsx`** - General cipher introduction and overview

### Challenge Components (Hands-on Practice)
Interactive puzzles where users solve cryptography problems:

- **`src/components/challenges/CaesarChallenge.jsx`** - Solve Caesar cipher puzzles with timer
- **`src/components/challenges/CaesarChallenge_new.jsx`** - Updated version with better UI
- **`src/components/challenges/playfair.jsx`** - Playfair cipher solving challenges
- **`src/components/challenges/playfair_new.jsx`** - Enhanced playfair challenges
- **`src/components/challenges/hill_new.jsx`** - Hill cipher matrix challenges
- **`src/components/challenges/otp_new.jsx`** - One-time pad challenges
- **`src/components/challenges/railfence.jsx`** - Rail fence pattern challenges
- **`src/components/challenges/railfence_new.jsx`** - Updated rail fence challenges
- **`src/components/challenges/vernam.jsx`** - Binary XOR challenges
- **`src/components/challenges/vigenere.jsx`** - Keyword-based cipher challenges

#### Challenge Features:
- **Timer System** - Time limits for each challenge
- **Hint System** - Progressive hints when users get stuck
- **Step-by-step Guidance** - Visual feedback during solving
- **Score Tracking** - Points based on time and hints used

### Quiz Components (Knowledge Testing)
Multiple choice quizzes to test theoretical understanding:

- **`src/components/quizz/caesarquiz.jsx`** - Caesar cipher theory quiz
- **`src/components/quizz/playfair.jsx`** - Playfair cipher concepts quiz
- **`src/components/quizz/hill.jsx`** - Hill cipher mathematics quiz
- **`src/components/quizz/otp.jsx`** - One-time pad security quiz
- **`src/components/quizz/otp_new.jsx`** - Updated OTP quiz format
- **`src/components/quizz/railfence.jsx`** - Rail fence algorithm quiz
- **`src/components/quizz/vernam.jsx`** - Vernam cipher quiz
- **`src/components/quizz/vigenere.jsx`** - Vigenère cipher quiz
- **`src/components/quizz/des.jsx`** - DES algorithm quiz
- **`src/components/quizz/aes.jsx`** - AES modern cryptography quiz
- **`src/components/quizz/rsa.jsx`** - RSA public key cryptography quiz

#### Quiz Features:
- **Multiple Choice Questions** - 4 options per question
- **Instant Feedback** - Immediate right/wrong indication
- **Score Calculation** - Percentage-based scoring
- **Detailed Explanations** - Learn from incorrect answers

### AI Chat System
Intelligent assistant for cryptography help:

- **`src/components/ChatInterface.jsx`** - Main chat interface with message history
- **`src/components/FloatingChatButton.jsx`** - Always-accessible chat button
- **`src/components/chat/UserMessage.jsx`** - User message display component
- **`src/components/chat/AIMessage.jsx`** - AI response display component
- **`src/components/chat/LoadingIndicator.jsx`** - Shows when AI is thinking
- **`src/components/chat/ErrorMessage.jsx`** - Error handling display
- **`src/components/chat/ScreenshotMessage.jsx`** - Screenshot sharing capability

#### AI Features:
- **Context-Aware Help** - Understands which cipher you're working on
- **Screenshot Analysis** - Can analyze your screen to provide specific help
- **Educational Guidance** - Explains concepts rather than just giving answers
- **Multi-language Support** - Responds in multiple languages

### Backend Services

#### AI Integration
- **`src/services/AIChatService.js`** - Handles communication with Gemini AI
- **`src/config/gemini.js`** - AI configuration and API setup
- **`src/hooks/useAIChat.js`** - React hook for chat functionality

#### Utility Services
- **`src/utils/screenshotUtils.jsx`** - Screen capture functionality
- **`src/utils/useScreenshot.js`** - Hook for screenshot management
- **`src/context/CipherContext.jsx`** - Global state management for cipher data
- **`src/context/useCipherIntegration.js`** - Integration between ciphers and AI

### Styling System

#### CSS Organization
- **`src/index.css`** - Global styles, layout, and responsive design
- **`src/App.css`** - Application-specific styling
- **`src/components/ChatInterface.css`** - Chat system styling
- **`src/components/challenges/ChallengeStyles.css`** - Challenge component styles
- **`src/components/quizz/QuizStyles.css`** - Quiz component styles
- **`src/components/chat/MessageStyles.css`** - Chat message styling

#### Design Features:
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark Theme** - Eye-friendly dark color scheme
- **Consistent UI** - Unified design language across all components
- **Accessibility** - Screen reader friendly and keyboard navigation

##  How Each Component Works

### Cipher Tools
1. **User Input** - Enter text and encryption key
2. **Mode Selection** - Choose encrypt or decrypt
3. **Step Visualization** - See each step of the algorithm
4. **Result Display** - Get encrypted/decrypted output
5. **Copy Function** - Easy copying of results

### Challenges
1. **Problem Generation** - Random puzzles created for each attempt
2. **Timer Start** - Countdown begins when challenge starts
3. **User Solving** - Interactive interface for problem solving
4. **Hint System** - Progressive clues available
5. **Validation** - Automatic checking of answers
6. **Score Calculation** - Points based on time and hints used

### Quizzes
1. **Question Display** - Multiple choice questions presented
2. **Answer Selection** - Click to choose answers
3. **Immediate Feedback** - Right/wrong shown instantly
4. **Progress Tracking** - Current question number displayed
5. **Final Score** - Percentage score at completion

### AI Chat
1. **Context Detection** - Knows which page you're on
2. **Question Processing** - Understands cryptography queries
3. **Response Generation** - Educational explanations provided
4. **Screenshot Analysis** - Can analyze visual problems
5. **Follow-up Support** - Continues conversation naturally

##  Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser

### Installation
1. Clone or download this project
2. Open terminal in project folder
3. Run: `npm install` (installs all required packages)
4. Run: `npm run dev` (starts development server)
5. Open browser to `http://localhost:5173`

### Project Configuration
- **Vite** - Fast development server and build tool
- **React** - User interface framework
- **React Router** - Navigation between pages
- **Tailwind CSS** - Utility-first CSS framework
- **Google Gemini AI** - Intelligent chat assistant

