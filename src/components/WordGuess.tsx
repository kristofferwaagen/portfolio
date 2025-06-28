import { useEffect, useState, useMemo } from 'react';

interface WordGuessProps {
  onGameOver: (score: number) => void;
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

function getRandomWord(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

function isValidWord(word: string, words: string[]): boolean {
  return words.includes(word.toUpperCase());
}

type LetterState = 'correct' | 'present' | 'absent' | 'unused';

function evaluateGuess(target: string, guess: string): LetterState[] {
  const result: LetterState[] = new Array(WORD_LENGTH).fill('absent');
  const targetArray = target.split('');
  const guessArray = guess.split('');
  const used = new Array(WORD_LENGTH).fill(false);

  // First pass: mark correct letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArray[i] === targetArray[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] !== 'correct') {
      for (let j = 0; j < WORD_LENGTH; j++) {
        if (!used[j] && guessArray[i] === targetArray[j]) {
          result[i] = 'present';
          used[j] = true;
          break;
        }
      }
    }
  }

  return result;
}

export default function WordGuess({ onGameOver }: WordGuessProps) {
  const [words, setWords] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<LetterState[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if device is mobile and if in fullscreen mode
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    const checkFullscreen = () => {
      setIsFullscreen(window.innerWidth >= 1200 && window.innerHeight >= 800);
    };
    checkMobile();
    checkFullscreen();
    window.addEventListener('resize', () => {
      checkMobile();
      checkFullscreen();
    });
    return () => window.removeEventListener('resize', () => {
      checkMobile();
      checkFullscreen();
    });
  }, []);

  useEffect(() => {
    fetch('/word-guess-words.json')
      .then(res => res.json())
      .then((data: string[]) => {
        setWords(data);
        setLoading(false);
        const newWord = getRandomWord(data);
        setTargetWord(newWord);
      })
      .catch(error => {
        console.error('Error loading words:', error);
        setLoading(false);
        setMessage('Error loading game. Please refresh the page.');
      });
  }, []);

  // Generate word suggestions based on current pattern
  const wordSuggestions = useMemo(() => {
    if (!words.length || currentGuess.length < 2 || !showSuggestions) return [];
    
    const pattern = currentGuess.toUpperCase();
    const suggestions = words.filter(word => 
      word.startsWith(pattern) && word !== targetWord
    ).slice(0, isMobile ? 3 : 5); // Show fewer suggestions on mobile
    
    return suggestions;
  }, [currentGuess, words, targetWord, showSuggestions, isMobile]);

  const handleKeyPress = (key: string) => {
    if (gameOver || loading) return;
    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        setMessage('Word must be 5 letters long');
        setTimeout(() => setMessage(''), 2000);
        return;
      }
      if (!isValidWord(currentGuess, words)) {
        setMessage('Not a valid word');
        setTimeout(() => setMessage(''), 2000);
        return;
      }
      const newGuesses = [...guesses, currentGuess.toUpperCase()];
      const newEvaluations = [...evaluations, evaluateGuess(targetWord, currentGuess.toUpperCase())];
      setGuesses(newGuesses);
      setEvaluations(newEvaluations);
      setCurrentGuess('');
      setShowSuggestions(false);
      if (currentGuess.toUpperCase() === targetWord) {
        setGameWon(true);
        setGameOver(true);
        onGameOver(MAX_ATTEMPTS - newGuesses.length + 1);
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameOver(true);
        onGameOver(0);
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver, loading, words, targetWord, guesses, evaluations]);

  const handleRestart = () => {
    if (!words.length) return;
    const newWord = getRandomWord(words);
    setTargetWord(newWord);
    setCurrentGuess('');
    setGuesses([]);
    setEvaluations([]);
    setGameOver(false);
    setGameWon(false);
    setMessage('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentGuess(suggestion);
    setShowSuggestions(false);
  };

  const renderCell = (letter: string, state: LetterState, index: number) => {
    const getBackgroundColor = () => {
      switch (state) {
        case 'correct': return '#00b894';
        case 'present': return '#fdcb6e';
        case 'absent': return '#636e72';
        default: return 'transparent';
      }
    };

    // Responsive cell sizing with fullscreen support
    const cellSize = isFullscreen ? 70 : isMobile ? 35 : 50;
    const fontSize = isFullscreen ? '2rem' : isMobile ? '1.2rem' : '1.5rem';

    return (
      <div
        key={index}
        style={{
          width: cellSize,
          height: cellSize,
          border: '2px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: fontSize,
          fontWeight: 'bold',
          color: state === 'unused' ? 'var(--text-color)' : 'white',
          background: getBackgroundColor(),
          borderRadius: '4px',
          margin: isFullscreen ? '3px' : isMobile ? '1px' : '2px',
          transition: 'all 0.3s ease'
        }}
      >
        {letter}
      </div>
    );
  };

  const renderRow = (guess: string, evaluation: LetterState[], index: number) => {
    const cells = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
      cells.push(renderCell(guess[i] || '', evaluation[i] || 'unused', i));
    }
    return (
      <div key={index} style={{ display: 'flex', justifyContent: 'center', marginBottom: isFullscreen ? '8px' : isMobile ? '4px' : '6px' }}>
        {cells}
      </div>
    );
  };

  const renderCurrentRow = () => {
    const cells = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
      cells.push(renderCell(currentGuess[i] || '', 'unused', i));
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isFullscreen ? '8px' : isMobile ? '4px' : '6px' }}>
        {cells}
      </div>
    );
  };

  const renderEmptyRows = () => {
    const emptyRows = [];
    const remainingRows = MAX_ATTEMPTS - guesses.length - (currentGuess.length > 0 ? 1 : 0);
    
    for (let i = 0; i < remainingRows; i++) {
      const cells = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        cells.push(renderCell('', 'unused', j));
      }
      emptyRows.push(
        <div key={`empty-${i}`} style={{ display: 'flex', justifyContent: 'center', marginBottom: isFullscreen ? '8px' : isMobile ? '4px' : '6px' }}>
          {cells}
        </div>
      );
    }
    return emptyRows;
  };

  if (loading) {
    return (
      <div className="word-guess" style={{ textAlign: 'center', padding: isMobile ? '1rem' : '2rem' }}>
        <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: 'var(--text-color)' }}>
          Loading Word Guess Game...
        </div>
      </div>
    );
  }

  return (
    <div className="word-guess" style={{ 
      textAlign: 'center', 
      position: 'relative',
      padding: isFullscreen ? '2rem' : isMobile ? '0.5rem' : '1rem',
      maxWidth: '100%',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* New Word Button - Positioned at the top */}
      <div style={{ marginBottom: isFullscreen ? '2rem' : isMobile ? '1rem' : '1.5rem' }}>
        <button
          onClick={handleRestart}
          style={{
            background: 'var(--accent-color)',
            color: 'var(--background-color)',
            border: 'none',
            padding: isFullscreen ? '16px 32px' : isMobile ? '10px 20px' : '12px 24px',
            borderRadius: '12px',
            fontSize: isFullscreen ? '1.2rem' : isMobile ? '0.9rem' : '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          🎯 New Word
        </button>
      </div>

      {/* Game Grid */}
      <div style={{ 
        marginBottom: isFullscreen ? '3rem' : isMobile ? '1rem' : '2rem',
        maxWidth: '100%',
        overflow: 'visible',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        minHeight: isFullscreen ? '500px' : isMobile ? '300px' : '400px'
      }}>
        {guesses.map((guess, index) => renderRow(guess, evaluations[index], index))}
        {currentGuess.length > 0 && renderCurrentRow()}
        {renderEmptyRows()}
      </div>

      {/* Word Suggestions */}
      {wordSuggestions.length > 0 && (
        <div style={{ 
          marginBottom: '1rem',
          padding: isMobile ? '0.75rem' : '1rem',
          background: 'rgba(184, 169, 201, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(184, 169, 201, 0.3)',
          margin: isMobile ? '0 0.5rem 1rem' : '0 0 1rem'
        }}>
          <div style={{ 
            fontSize: isMobile ? '0.8rem' : '0.9rem', 
            color: 'var(--accent-color)', 
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            💡 Word Suggestions:
          </div>
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '0.25rem' : '0.5rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap' 
          }}>
            {wordSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  background: 'var(--card-background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: isMobile ? '0.4rem 0.6rem' : '0.5rem 0.75rem',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: 'var(--text-color)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-color)';
                  e.currentTarget.style.color = 'var(--background-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--card-background)';
                  e.currentTarget.style.color = 'var(--text-color)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestion Toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-color)',
            padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(184, 169, 201, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {showSuggestions ? '🔒 Hide Suggestions' : '💡 Show Suggestions'}
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{ 
          color: '#e74c3c', 
          marginBottom: '1rem', 
          fontSize: isMobile ? '0.9rem' : '1rem',
          fontWeight: '600',
          padding: '0.5rem',
          background: 'rgba(231, 76, 60, 0.1)',
          borderRadius: '4px',
          margin: isMobile ? '0 0.5rem 1rem' : '0 0 1rem'
        }}>
          {message}
        </div>
      )}

      {/* Game Over Modal */}
      {(gameOver || gameWon) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--card-background)',
          padding: isMobile ? '1.5rem' : '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          maxWidth: isMobile ? '90vw' : '400px',
          width: isMobile ? '90vw' : '400px'
        }}>
          <h3 style={{ 
            marginBottom: '1rem',
            fontSize: isMobile ? '1.2rem' : '1.5rem'
          }}>
            {gameWon ? '🎉 Congratulations!' : '😔 Game Over'}
          </h3>
          <p style={{ 
            marginBottom: '1.5rem',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            {gameWon 
              ? `You found the word in ${guesses.length} tries!` 
              : `The word was: ${targetWord}`
            }
          </p>
          <button 
            onClick={handleRestart}
            style={{
              background: 'var(--primary-color)',
              color: 'var(--background-color)',
              border: 'none',
              padding: isMobile ? '0.6rem 1.2rem' : '0.75rem 1.5rem',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        fontSize: isMobile ? '0.8rem' : '0.9rem', 
        color: 'var(--text-color-secondary)', 
        marginTop: '1rem',
        padding: isMobile ? '0.75rem' : '1rem',
        background: 'var(--card-background)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        margin: isMobile ? '1rem 0.5rem 0' : '1rem 0 0'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>How to Play:</div>
        <div>• Type letters to guess the 5-letter word</div>
        <div>• Green = correct letter in correct position</div>
        <div>• Yellow = correct letter in wrong position</div>
        <div>• Gray = letter not in the word</div>
        <div style={{ 
          marginTop: '0.5rem', 
          fontSize: isMobile ? '0.7rem' : '0.8rem', 
          color: 'var(--accent-color)' 
        }}>
          💡 Tip: Use the suggestion feature to get help with valid words!
        </div>
      </div>
    </div>
  );
} 