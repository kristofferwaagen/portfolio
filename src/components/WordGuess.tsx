import { useEffect, useState, useMemo } from 'react';

interface WordGuessProps {
  onGameOver: (score: number, won: boolean) => void;
  onHint?: (revealLetter: () => void) => void;
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

function getRandomWord(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
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

export default function WordGuess({ onGameOver, onHint }: WordGuessProps) {
  const [words, setWords] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<LetterState[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

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
    if (!words.length || currentGuess.length < 1 || !showSuggestions) return [];
    
    const pattern = currentGuess.toUpperCase();
    const suggestions = words.filter(word => 
      word.startsWith(pattern) && word !== targetWord
    ).slice(0, isMobile ? 4 : 6); // Show more suggestions
    
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
      const newGuesses = [...guesses, currentGuess.toUpperCase()];
      const newEvaluations = [...evaluations, evaluateGuess(targetWord, currentGuess.toUpperCase())];
      setGuesses(newGuesses);
      setEvaluations(newEvaluations);
      setCurrentGuess('');
      setShowSuggestions(false);
      if (currentGuess.toUpperCase() === targetWord) {
        setGameOver(true);
        onGameOver(MAX_ATTEMPTS - newGuesses.length + 1, true);
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameOver(true);
        onGameOver(0, false);
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
    
    // Only add keyboard listener on desktop
    if (!isMobile) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [currentGuess, gameOver, loading, words, targetWord, guesses, evaluations, isMobile]);

  // Mobile input handlers
  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameOver || loading) return;
    
    const value = e.target.value.toUpperCase();
    // Only allow letters and limit to WORD_LENGTH
    const lettersOnly = value.replace(/[^A-Z]/g, '').slice(0, WORD_LENGTH);
    setCurrentGuess(lettersOnly);
  };

  const handleMobileSubmit = () => {
    if (gameOver || loading) return;
    
    if (currentGuess.length !== WORD_LENGTH) {
      setMessage('Word must be 5 letters long');
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
      setGameOver(true);
      onGameOver(MAX_ATTEMPTS - newGuesses.length + 1, true);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      onGameOver(0, false);
    }
  };

  const handleMobileBackspace = () => {
    if (gameOver || loading) return;
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleRestart = () => {
    if (!words.length) return;
    const newWord = getRandomWord(words);
    setTargetWord(newWord);
    setCurrentGuess('');
    setGuesses([]);
    setEvaluations([]);
    setGameOver(false);
    setMessage('');
    setShowSuggestions(false);
    setHintUsed(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentGuess(suggestion);
    setShowSuggestions(false);
  };

  // HINT: Reveal a random unrevealed letter
  const revealLetter = () => {
    if (gameOver || loading || hintUsed) return;
    
    // Check if hint was already used
    if (hintUsed) {
      setMessage('You have already used your hint for this game!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    
    // Find indices of unrevealed letters
    const revealed = new Set(guesses.join('').split(''));
    const unrevealedIndices = targetWord
      .split('')
      .map((char, idx) => (revealed.has(char) ? null : idx))
      .filter(idx => idx !== null) as number[];
    if (unrevealedIndices.length === 0) {
      setMessage('All letters already revealed!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    const randomIdx = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    const letter = targetWord[randomIdx];
    setMessage(`Hint: The letter "${letter}" is in position ${randomIdx + 1}`);
    setHintUsed(true);
    setTimeout(() => setMessage(''), 4000);
  };

  // Expose hint function to parent
  useEffect(() => {
    if (onHint) onHint(revealLetter);
    // eslint-disable-next-line
  }, [onHint, guesses, targetWord, gameOver, loading]);

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
      padding: isMobile ? '0.25rem' : '0.5rem',
      maxWidth: '100%',
      overflow: 'hidden',
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '0.5rem' : '1rem',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Game Section - Centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        flex: isMobile ? 'none' : '1',
        justifyContent: 'center',
        width: isMobile ? '100%' : 'auto',
        margin: isMobile ? '0' : '0 auto',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* Game Grid */}
        <div style={{ 
          marginBottom: '0.5rem',
          maxWidth: '100%',
          overflow: 'hidden',
          flex: '0 1 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          maxHeight: isMobile ? '40vh' : '60vh',
          margin: '0 auto'
        }}>
          {guesses.map((guess, index) => renderRow(guess, evaluations[index], index))}
          {currentGuess.length > 0 && renderCurrentRow()}
          {renderEmptyRows()}
        </div>

        {/* Mobile Input Field */}
        {isMobile && !gameOver && (
          <div style={{
            marginBottom: '0.5rem',
            padding: '0 0.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            {/* Input Section */}
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '300px'
            }}>
              <input
                type="text"
                value={currentGuess}
                onChange={handleMobileInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleMobileSubmit();
                  }
                }}
                placeholder="Type your guess..."
                style={{
                  flex: '1',
                  maxWidth: '150px',
                  padding: '0.5rem',
                  fontSize: '0.9rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  background: 'var(--card-background)',
                  color: 'var(--text-color)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
                maxLength={WORD_LENGTH}
                autoFocus
              />
              <button
                onClick={handleMobileSubmit}
                disabled={currentGuess.length !== WORD_LENGTH}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: currentGuess.length === WORD_LENGTH ? 'var(--accent-color)' : 'var(--border-color)',
                  color: currentGuess.length === WORD_LENGTH ? 'var(--background-color)' : 'var(--text-color-secondary)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: currentGuess.length === WORD_LENGTH ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                Enter
              </button>
              <button
                onClick={handleMobileBackspace}
                disabled={currentGuess.length === 0}
                style={{
                  padding: '0.5rem',
                  background: currentGuess.length > 0 ? 'var(--card-background)' : 'var(--border-color)',
                  color: currentGuess.length > 0 ? 'var(--text-color)' : 'var(--text-color-secondary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: currentGuess.length > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  minWidth: '40px'
                }}
              >
                ←
              </button>
            </div>

            {/* Mobile Button Row */}
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleRestart}
                style={{
                  background: 'var(--accent-color)',
                  color: 'var(--background-color)',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                New Word
              </button>

              <button
                onClick={revealLetter}
                disabled={hintUsed}
                style={{
                  background: hintUsed ? 'var(--border-color)' : 'transparent',
                  border: '2px solid var(--accent-color)',
                  color: hintUsed ? 'var(--text-color-secondary)' : 'var(--accent-color)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: hintUsed ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  opacity: hintUsed ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!hintUsed) {
                    e.currentTarget.style.background = 'rgba(184, 169, 201, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hintUsed) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {hintUsed ? '🔒 Hint Used' : '💡 Hint'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Instructions and Controls Section - Right Sidebar */}
      {!isMobile && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: isFullscreen ? '300px' : '250px',
          maxWidth: isFullscreen ? '400px' : '300px',
          alignSelf: 'center',
          flex: '0 0 auto'
        }}>
          {/* Button Row - New Word and Suggestions at same level */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* New Word Button */}
            <button
              onClick={handleRestart}
              style={{
                background: 'var(--accent-color)',
                color: 'var(--background-color)',
                border: 'none',
                padding: isFullscreen ? '16px 32px' : '12px 24px',
                borderRadius: '12px',
                fontSize: isFullscreen ? '1.2rem' : '1rem',
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
              New Word
            </button>

            {/* Hint Button */}
            <button
              onClick={revealLetter}
              disabled={hintUsed}
              style={{
                background: hintUsed ? 'var(--border-color)' : 'transparent',
                border: '2px solid var(--accent-color)',
                color: hintUsed ? 'var(--text-color-secondary)' : 'var(--accent-color)',
                padding: isFullscreen ? '16px 32px' : '12px 24px',
                borderRadius: '12px',
                fontSize: isFullscreen ? '1.2rem' : '1rem',
                cursor: hintUsed ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                opacity: hintUsed ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!hintUsed) {
                  e.currentTarget.style.background = 'rgba(184, 169, 201, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!hintUsed) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {hintUsed ? '🔒 Hint Used' : '💡 Reveal Letter'}
            </button>

            {/* Suggestion Toggle */}
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              style={{
                background: showSuggestions ? 'var(--accent-color)' : 'transparent',
                border: '2px solid var(--accent-color)',
                color: showSuggestions ? 'var(--background-color)' : 'var(--accent-color)',
                padding: isFullscreen ? '16px 32px' : '12px 24px',
                borderRadius: '12px',
                fontSize: isFullscreen ? '1.2rem' : '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 'bold',
                boxShadow: showSuggestions ? '0 4px 8px rgba(184, 169, 201, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (!showSuggestions) {
                  e.currentTarget.style.background = 'rgba(184, 169, 201, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showSuggestions) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {showSuggestions ? '🔒 Hide Suggestions' : '💡 Show Suggestions'}
            </button>
          </div>

          {/* Word Suggestions for Desktop */}
          {showSuggestions && (
            <div style={{ 
              padding: isFullscreen ? '1.5rem' : '1rem',
              background: 'linear-gradient(135deg, rgba(184, 169, 201, 0.15) 0%, rgba(184, 169, 201, 0.08) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(184, 169, 201, 0.4)',
              boxShadow: '0 4px 12px rgba(184, 169, 201, 0.2)',
              position: 'relative',
              zIndex: 5
            }}>
              {wordSuggestions.length > 0 ? (
                <>
                  <div style={{ 
                    fontSize: isFullscreen ? '1rem' : '0.9rem', 
                    color: 'var(--accent-color)', 
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    textAlign: 'center'
                  }}>
                    💡 Word Suggestions ({wordSuggestions.length} found):
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: isFullscreen ? '0.75rem' : '0.5rem', 
                    justifyContent: 'center', 
                    flexWrap: 'wrap' 
                  }}>
                    {wordSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          background: 'var(--card-background)',
                          border: '2px solid var(--accent-color)',
                          borderRadius: '8px',
                          padding: isFullscreen ? '0.6rem 1rem' : '0.5rem 0.75rem',
                          fontSize: isFullscreen ? '1rem' : '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          color: 'var(--text-color)',
                          fontWeight: '600',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--accent-color)';
                          e.currentTarget.style.color = 'var(--background-color)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--card-background)';
                          e.currentTarget.style.color = 'var(--text-color)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ 
                  fontSize: isFullscreen ? '0.9rem' : '0.8rem', 
                  color: 'var(--text-color-secondary)', 
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  {currentGuess.length === 0 
                    ? '💡 Start typing to see word suggestions!' 
                    : '💡 No suggestions found for "' + currentGuess.toUpperCase() + '". Try a different letter!'
                  }
                </div>
              )}
            </div>
          )}

          {/* Instructions for Desktop - Aligned with game grid top */}
          <div style={{ 
            fontSize: isFullscreen ? '0.9rem' : '0.8rem', 
            color: 'var(--text-color-secondary)', 
            padding: isFullscreen ? '1rem' : '0.75rem',
            background: 'var(--card-background)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            textAlign: 'left',
            marginTop: '0'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>How to Play:</div>
            <div>• Type letters to guess the 5-letter word</div>
            <div>• Green = correct letter in correct position</div>
            <div>• Yellow = correct letter in wrong position</div>
            <div>• Gray = letter not in the word</div>
            <div style={{ 
              marginTop: '0.5rem', 
              fontSize: isFullscreen ? '0.8rem' : '0.7rem', 
              color: 'var(--accent-color)' 
            }}>
              💡 Tip: Use the suggestion feature to get help with valid words!
            </div>
          </div>
        </div>
      )}
      
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
          margin: isMobile ? '0 0.5rem 1rem' : '0 0 1rem',
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100
        }}>
          {message}
        </div>
      )}
    </div>
  );
} 