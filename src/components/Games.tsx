import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SnakeGame from './SnakeGame';
import TetrisGame from './TetrisGame';
import WordGuess from './WordGuess';
import PokemonGuess from './PokemonGuess';

interface GamesProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameType = 'snake' | 'tetris' | 'word-guess' | 'poke-guess';

export default function Games({ isOpen, onClose }: GamesProps) {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [snakeGameKey, setSnakeGameKey] = useState(0);
  const [tetrisGameKey, setTetrisGameKey] = useState(0);
  const [wordGuessKey, setWordGuessKey] = useState(0);
  const [pokemonGuessKey, setPokemonGuessKey] = useState(0);

  // Prevent body scroll when games are open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('games-open');
    } else {
      document.body.classList.remove('games-open');
    }

    return () => {
      document.body.classList.remove('games-open');
    };
  }, [isOpen]);

  const handleGameSelect = (game: GameType) => {
    setCurrentGame(game);
    setGameOver(false);
    setGameWon(false);
    setFinalScore(0);
  };

  const handleBackToGames = () => {
    setCurrentGame(null);
    setGameOver(false);
    setGameWon(false);
    setFinalScore(0);
  };

  const handleGameOver = (score: number, won: boolean = false) => {
    setGameOver(true);
    setGameWon(won);
    setFinalScore(score);
  };

  const handleRestart = () => {
    setGameOver(false);
    setGameWon(false);
    setFinalScore(0);
    if (currentGame === 'snake') setSnakeGameKey(k => k + 1);
    if (currentGame === 'tetris') setTetrisGameKey(k => k + 1);
    if (currentGame === 'word-guess') setWordGuessKey(k => k + 1);
    if (currentGame === 'poke-guess') setPokemonGuessKey(k => k + 1);
  };

  const containerVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: '100%',
      transition: {
        duration: 0.3
      }
    }
  };

  const fullscreenVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      width: '100vw',
      height: '100vh',
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }
    },
    exit: {
      x: '100%',
      transition: {
        duration: 0.3
      }
    }
  };

  const gameAreaVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  const gameContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  const games = [
    {
      id: 'snake',
      title: 'Snake',
      description: 'Classic snake game. Use WASD keys to control the snake and eat the food to grow!',
      icon: '🐍',
      color: '#00b894'
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Arrange falling blocks to clear lines and score points!. Use WASD to move the blocks.',
      icon: '🧩',
      color: '#6c5ce7'
    },
    {
      id: 'word-guess',
      title: 'Word Guess',
      description: 'Guess the hidden word in 6 tries. Each guess must be a valid word.',
      icon: '🔤',
      color: '#fdcb6e'
    },
    {
      id: 'poke-guess',
      title: 'Pokemon Platinum Guesser',
      description: 'Guess the Pokémon name from Pokemon Platinum.',
      icon: '⚡️',
      color: '#74b9ff'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="games-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="games-panel"
            variants={currentGame ? fullscreenVariants : containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={currentGame ? {
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              background: 'linear-gradient(135deg, var(--background-color) 0%, var(--background-color-secondary) 100%)',
              backdropFilter: 'blur(20px)',
              border: 'none',
              boxShadow: '0 0 50px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              overflow: 'hidden',
              padding: '2rem'
            } : {}}
          >
            {!currentGame ? (
              <>
                <div className="games-header">
                  <button className="close-button" onClick={onClose}>
                    ✕
                  </button>
                  <h2>Game Hub</h2>
                  <p>Take a break and enjoy some games!</p>
                </div>

                <div className="games-grid">
                  {games.map((game) => (
                    <motion.div
                      key={game.id}
                      className="game-card"
                      onClick={() => handleGameSelect(game.id as GameType)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div 
                        className="game-icon"
                        style={{ backgroundColor: game.color }}
                      >
                        {game.icon}
                      </div>
                      <h3 className="game-title">{game.title}</h3>
                      <p className="game-description">{game.description}</p>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div 
                className="game-area"
                variants={gameAreaVariants}
                initial="hidden"
                animate="visible"
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '100%',
                  margin: '0 auto',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* GAME OVER SCREEN */}
                {gameOver && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2000,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <motion.div
                      className="game-over-screen"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        background: 'var(--background-color)',
                        border: '2px solid var(--border-color)',
                        borderRadius: '20px',
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--text-color)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                        minWidth: '300px',
                        maxWidth: '90vw'
                      }}
                    >
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {gameWon ? '🎉' : '𝐋'}
                      </div>
                      <h2 style={{ 
                        color: gameWon ? 'var(--primary-color)' : 'var(--text-color)',
                        marginBottom: '1rem',
                        fontSize: '1.5rem'
                      }}>
                        {gameWon ? 'Victory!' : 'Game Over'}
                      </h2>
                      <p style={{ 
                        color: 'var(--text-color)',
                        marginBottom: '1.5rem',
                        fontSize: '1.1rem'
                      }}>
                        {gameWon ? `Congratulations! You won with a score of ${finalScore}!` : `Final Score: ${finalScore}`}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                          onClick={handleRestart}
                          style={{
                            background: 'var(--primary-color)',
                            color: 'var(--background-color)',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          Play Again
                        </button>
                        <button
                          onClick={handleBackToGames}
                          style={{
                            background: 'var(--accent-color)',
                            color: 'var(--background-color)',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          Back to Games
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

                <motion.div 
                  className="game-header"
                  variants={gameContentVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '0.5rem 0',
                    borderBottom: '2px solid var(--border-color)',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <button 
                    className="back-button" 
                    onClick={handleBackToGames}
                    style={{
                      background: 'var(--primary-color)',
                      color: 'var(--background-color)',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    ← Back to Games
                  </button>
                  <h3 className="game-title" style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontWeight: 'bold',
                    color: 'var(--primary-color)',
                    margin: 0,
                    textAlign: 'center',
                    flex: '1'
                  }}>
                    {games.find(g => g.id === currentGame)?.title}
                  </h3>
                  <div style={{ width: '100px' }}></div> {/* Spacer for centering */}
                </motion.div>
                <motion.div 
                  className="game-canvas"
                  variants={gameContentVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    minHeight: 0,
                    overflow: 'hidden',
                    width: '100%'
                  }}
                >
                  {/* GAME COMPONENTS */}
                  {currentGame === 'snake' && (
                    <SnakeGame key={snakeGameKey} onGameOver={(score) => handleGameOver(score, false)} />
                  )}
                  {currentGame === 'tetris' && (
                    <TetrisGame key={tetrisGameKey} onGameOver={(score) => handleGameOver(score, false)} />
                  )}
                  {currentGame === 'word-guess' && (
                    <WordGuess key={wordGuessKey} onGameOver={(score, won) => handleGameOver(score, won)} />
                  )}
                  {currentGame === 'poke-guess' && (
                    <PokemonGuess 
                      key={pokemonGuessKey}
                      onGameOver={(score, win) => handleGameOver(score, win)}
                    />
                  )}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 