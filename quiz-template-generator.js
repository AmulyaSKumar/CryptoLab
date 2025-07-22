// Quiz Template Generator Script
// This script helps create the improved quiz layout for all quiz components

const quizMappings = [
  { file: 'des.jsx', name: 'DES', route: '/des', pdf: 'des-quiz.pdf', title: 'DES Cipher Quiz' },
  { file: 'hill.jsx', name: 'Hill', route: '/hill', pdf: 'hill-quiz.pdf', title: 'Hill Cipher Quiz' },
  { file: 'playfair.jsx', name: 'Playfair', route: '/playfair', pdf: 'playfair-quiz.pdf', title: 'Playfair Cipher Quiz' },
  { file: 'railfence.jsx', name: 'Railfence', route: '/railfence', pdf: 'railfence-quiz.pdf', title: 'Rail Fence Cipher Quiz' },
  { file: 'rsa.jsx', name: 'RSA', route: '/rsa', pdf: 'rsa-quiz.pdf', title: 'RSA Cipher Quiz' },
  { file: 'vernam.jsx', name: 'Vernam', route: '/vernam', pdf: 'vernam-quiz.pdf', title: 'Vernam Cipher Quiz' },
  { file: 'vigenere.jsx', name: 'Vigenere', route: '/vigenere', pdf: 'vigenere-quiz.pdf', title: 'Vigenère Cipher Quiz' }
];

// Template functions to add to each quiz:
const addImports = `import './QuizStyles.css';`;

const stateTemplate = `
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [revealed, setRevealed] = useState(Array(questions.length).fill(false));

  const handleOptionClick = (questionIndex, option) => {
    if (revealed[questionIndex]) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = option;
    setUserAnswers(newAnswers);
    
    // Auto-reveal after selection
    const newRevealed = [...revealed];
    newRevealed[questionIndex] = true;
    setRevealed(newRevealed);
  };
  
  const resetQuiz = () => {
    setUserAnswers(Array(questions.length).fill(null));
    setRevealed(Array(questions.length).fill(false));
  };
  
  const handleSubmitQuiz = () => {
    // Mark all remaining questions as revealed
    const newRevealed = Array(questions.length).fill(true);
    setRevealed(newRevealed);
  };
  
  const calculateScore = () => {
    return userAnswers.filter((answer, index) => 
      answer === questions[index].answer
    ).length;
  };

  const calculatePercentage = () => {
    const score = calculateScore();
    return Math.round((score / questions.length) * 100);
  };`;

function generateHeaderBar(route, pdf, title) {
  return `
    <div className="main-container">
      <div className="back-nav">
        <Link to="${route}" className="nav-button" style={{ minWidth: 'auto' }}>
          ← Back to ${title.replace(' Quiz', '')}
        </Link>
      </div>

      <div className="tool-container">
        <h1 className="tool-title">${title}</h1>
        
        {/* Score and Download Bar */}
        <div className="quiz-header-bar">
          <div className="quiz-progress">
            <span className="progress-text">
              Progress: {userAnswers.filter(answer => answer !== null && answer !== '').length}/{questions.length} questions
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: \`\${(userAnswers.filter(answer => answer !== null && answer !== '').length / questions.length) * 100}%\` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="quiz-actions-header">
            <div className="current-score">
              Score: {calculateScore()}/{questions.length} ({calculatePercentage()}%)
            </div>
            <a 
              href="/${pdf}" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-questions-button"
              title="Download quiz questions as PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Download Questions
            </a>
          </div>
        </div>`;
}

console.log("Quiz Template Generated!");
