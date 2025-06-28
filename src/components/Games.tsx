import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SnakeGame from './SnakeGame';
import TetrisGame from './TetrisGame';
import WordGuess from './WordGuess';
import PokemonGuess from './PokemonGuess';

interface GamesProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameType = 'snake' | 'tetris' | 'word-guess' | 'pokedle';

export default function Games({ isOpen, onClose }: GamesProps) {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);

  const handleGameSelect = (game: GameType) => {
    setCurrentGame(game);
  };

  const handleBackToGames = () => {
    setCurrentGame(null);
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
      id: 'pokedle',
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
                  <h2>🎮 Fun Games</h2>
                  <p>Take a break and enjoy some classic games!</p>
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
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '1400px',
                  margin: '0 auto'
                }}
              >
                <motion.div 
                  className="game-header"
                  variants={gameContentVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    padding: '1rem 0',
                    borderBottom: '2px solid var(--border-color)'
                  }}
                >
                  <button 
                    className="back-button" 
                    onClick={handleBackToGames}
                    style={{
                      background: 'var(--primary-color)',
                      color: 'var(--background-color)',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
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
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: 'var(--primary-color)',
                    margin: 0
                  }}>
                    {games.find(g => g.id === currentGame)?.title}
                  </h3>
                  <div style={{ width: '120px' }}></div> {/* Spacer for centering */}
                </motion.div>
                <motion.div 
                  className="game-canvas"
                  variants={gameContentVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    minHeight: '0'
                  }}
                >
                  {currentGame === 'snake' && (
                    <SnakeGame onGameOver={() => {}} />
                  )}
                  {currentGame === 'tetris' && (
                    <TetrisGame onGameOver={() => {}} />
                  )}
                  {currentGame === 'word-guess' && (
                    <WordGuess onGameOver={() => {}} />
                  )}
                  {currentGame === 'pokedle' && (
                    <PokemonGuess onGameOver={() => {}} />
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