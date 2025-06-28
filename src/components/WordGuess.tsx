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
      padding: isFullscreen ? '2rem' : isMobile ? '1rem' : '1rem',
      paddingBottom: isFullscreen ? '4rem' : isMobile ? '3rem' : '3rem',
      maxWidth: '100%',
      overflow: 'visible',
      minHeight: '100%',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isFullscreen ? '3rem' : isMobile ? '1rem' : '2rem',
      alignItems: 'flex-start',
      justifyContent: 'center'
    }}>
      {/* Game Section - Centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        flex: isMobile ? 'none' : '1',
        justifyContent: 'center',
        width: isMobile ? '100%' : 'auto',
        margin: isMobile ? '0' : '0 auto'
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
          marginBottom: isFullscreen ? '2rem' : isMobile ? '1rem' : '1.5rem',
          maxWidth: '100%',
          overflow: 'visible',
          flex: '0 1 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: isFullscreen ? '400px' : isMobile ? '200px' : '300px',
          maxHeight: isFullscreen ? '500px' : isMobile ? '300px' : '400px',
          margin: '0 auto'
        }}>
          {guesses.map((guess, index) => renderRow(guess, evaluations[index], index))}
          {currentGuess.length > 0 && renderCurrentRow()}
          {renderEmptyRows()}
        </div>

        {/* Mobile Input Field */}
        {isMobile && !gameOver && (
          <div style={{
            marginBottom: '1rem',
            padding: '0 0.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}>
            {/* Input Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: '200px'
            }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                justifyContent: 'center'
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
                    maxWidth: '200px',
                    padding: '0.75rem',
                    fontSize: '1rem',
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
                    padding: '0.75rem 1rem',
                    background: currentGuess.length === WORD_LENGTH ? 'var(--accent-color)' : 'var(--border-color)',
                    color: currentGuess.length === WORD_LENGTH ? 'var(--background-color)' : 'var(--text-color-secondary)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
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
                    padding: '0.75rem',
                    background: currentGuess.length > 0 ? 'var(--card-background)' : 'var(--border-color)',
                    color: currentGuess.length > 0 ? 'var(--text-color)' : 'var(--text-color-secondary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: currentGuess.length > 0 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    minWidth: '44px'
                  }}
                >
                  ←
                </button>
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-color-secondary)',
                textAlign: 'center'
              }}>
                Type {WORD_LENGTH} letters and press Enter
              </div>
            </div>

            {/* Suggestions and Instructions Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: '150px',
              maxWidth: '200px'
            }}>
              {/* Word Suggestions */}
              {showSuggestions && (
                <div style={{ 
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, rgba(184, 169, 201, 0.15) 0%, rgba(184, 169, 201, 0.08) 100%)',
                  borderRadius: '8px',
                  border: '2px solid rgba(184, 169, 201, 0.4)',
                  boxShadow: '0 4px 12px rgba(184, 169, 201, 0.2)',
                  position: 'relative',
                  zIndex: 5
                }}>
                  {wordSuggestions.length > 0 ? (
                    <>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--accent-color)', 
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        textAlign: 'center'
                      }}>
                        💡 Suggestions ({wordSuggestions.length}):
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.25rem', 
                        justifyContent: 'center', 
                        flexWrap: 'wrap' 
                      }}>
                        {wordSuggestions.slice(0, 3).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                              background: 'var(--card-background)',
                              border: '1px solid var(--accent-color)',
                              borderRadius: '4px',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              color: 'var(--text-color)',
                              fontWeight: '600'
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
                    </>
                  ) : (
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: 'var(--text-color-secondary)', 
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}>
                      {currentGuess.length === 0 
                        ? '💡 Start typing for suggestions!' 
                        : '💡 No suggestions found'
                      }
                    </div>
                  )}
                </div>
              )}

              {/* Instructions */}
              <div style={{ 
                fontSize: '0.7rem', 
                color: 'var(--text-color-secondary)', 
                padding: '0.5rem',
                background: 'var(--card-background)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>How to Play:</div>
                <div>• Green = correct position</div>
                <div>• Yellow = wrong position</div>
                <div>• Gray = not in word</div>
              </div>
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
          alignSelf: 'flex-start',
          flex: '0 0 auto'
        }}>
          {/* Suggestion Toggle */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              style={{
                background: showSuggestions ? 'var(--accent-color)' : 'transparent',
                border: '2px solid var(--accent-color)',
                color: showSuggestions ? 'var(--background-color)' : 'var(--accent-color)',
                padding: isFullscreen ? '0.75rem 1.5rem' : '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: isFullscreen ? '1rem' : '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
                boxShadow: showSuggestions ? '0 4px 8px rgba(184, 169, 201, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (!showSuggestions) {
                  e.currentTarget.style.background = 'rgba(184, 169, 201, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
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

          {/* Instructions for Desktop */}
          <div style={{ 
            fontSize: isFullscreen ? '0.9rem' : '0.8rem', 
            color: 'var(--text-color-secondary)', 
            padding: isFullscreen ? '1rem' : '0.75rem',
            background: 'var(--card-background)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            textAlign: 'left'
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
    </div>
  );
} 