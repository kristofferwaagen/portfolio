import React, { useEffect, useRef, useState } from 'react';

interface TetrisGameProps {
  onGameOver: (score: number) => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

// Tetris pieces (tetrominoes)
const PIECES = [
  // I piece
  [
    [1, 1, 1, 1]
  ],
  // O piece
  [
    [1, 1],
    [1, 1]
  ],
  // T piece
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  // S piece
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  // Z piece
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  // J piece
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
  // L piece
  [
    [0, 0, 1],
    [1, 1, 1]
  ]
];

const COLORS = ['#00b894', '#6c5ce7', '#fdcb6e', '#e17055', '#fd79a8', '#74b9ff', '#a29bfe'];

function createBoard(): number[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
}

function createPiece(): { shape: number[][]; color: number; x: number; y: number } {
  const pieceIndex = Math.floor(Math.random() * PIECES.length);
  return {
    shape: PIECES[pieceIndex],
    color: pieceIndex + 1,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(PIECES[pieceIndex][0].length / 2),
    y: 0
  };
}

function rotatePiece(piece: number[][]): number[][] {
  const rows = piece.length;
  const cols = piece[0].length;
  const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = piece[i][j];
    }
  }
  return rotated;
}

function isValidMove(board: number[][], piece: number[][], x: number, y: number): boolean {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col]) {
        const newX = x + col;
        const newY = y + row;
        
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        if (newY >= 0 && board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
}

function placePiece(board: number[][], piece: number[][], x: number, y: number, color: number): number[][] {
  const newBoard = board.map(row => [...row]);
  
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col]) {
        const newX = x + col;
        const newY = y + row;
        if (newY >= 0) {
          newBoard[newY][newX] = color;
        }
      }
    }
  }
  return newBoard;
}

function clearLines(board: number[][]): { newBoard: number[][]; linesCleared: number } {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    if (row.every(cell => cell !== 0)) {
      linesCleared++;
      return false;
    }
    return true;
  });
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  
  return { newBoard, linesCleared };
}

export default function TetrisGame({ onGameOver }: TetrisGameProps) {
  const [board, setBoard] = useState(createBoard());
  const [currentPiece, setCurrentPiece] = useState(createPiece());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef(0);

  // Check if in fullscreen mode
  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(window.innerWidth >= 1200 && window.innerHeight >= 800);
    };
    checkFullscreen();
    window.addEventListener('resize', checkFullscreen);
    return () => window.removeEventListener('resize', checkFullscreen);
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!gameStarted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || isPaused) return;
      
      switch (e.key.toLowerCase()) {
        case 'a':
          setCurrentPiece(prev => {
            const newX = prev.x - 1;
            return isValidMove(board, prev.shape, newX, prev.y) 
              ? { ...prev, x: newX } 
              : prev;
          });
          break;
        case 'd':
          setCurrentPiece(prev => {
            const newX = prev.x + 1;
            return isValidMove(board, prev.shape, newX, prev.y) 
              ? { ...prev, x: newX } 
              : prev;
          });
          break;
        case 's':
          setCurrentPiece(prev => {
            const newY = prev.y + 1;
            return isValidMove(board, prev.shape, prev.x, newY) 
              ? { ...prev, y: newY } 
              : prev;
          });
          break;
        case 'w':
          setCurrentPiece(prev => {
            const rotated = rotatePiece(prev.shape);
            return isValidMove(board, rotated, prev.x, prev.y) 
              ? { ...prev, shape: rotated } 
              : prev;
          });
          break;
        case ' ':
          // Hard drop
          setCurrentPiece(prev => {
            let dropY = prev.y;
            while (isValidMove(board, prev.shape, prev.x, dropY + 1)) {
              dropY++;
            }
            return { ...prev, y: dropY };
          });
          break;
        case 'p':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver, isPaused, gameStarted]);

  // Touch controls
  useEffect(() => {
    if (!gameStarted) return;
    
    let startX = 0, startY = 0;
    let lastTapTime = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (gameOver || isPaused) return;
      
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const currentTime = Date.now();
      
      // Check for tap (rotation)
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
        if (currentTime - lastTapTime < 300) {
          // Double tap for hard drop
          setCurrentPiece(prev => {
            let dropY = prev.y;
            while (isValidMove(board, prev.shape, prev.x, dropY + 1)) {
              dropY++;
            }
            return { ...prev, y: dropY };
          });
        } else {
          // Single tap for rotation
          setCurrentPiece(prev => {
            const rotated = rotatePiece(prev.shape);
            return isValidMove(board, rotated, prev.x, prev.y) 
              ? { ...prev, shape: rotated } 
              : prev;
          });
        }
        lastTapTime = currentTime;
      } else if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 30) {
          setCurrentPiece(prev => {
            const newX = prev.x + 1;
            return isValidMove(board, prev.shape, newX, prev.y) 
              ? { ...prev, x: newX } 
              : prev;
          });
        } else if (dx < -30) {
          setCurrentPiece(prev => {
            const newX = prev.x - 1;
            return isValidMove(board, prev.shape, newX, prev.y) 
              ? { ...prev, x: newX } 
              : prev;
          });
        }
      } else {
        // Vertical swipe
        if (dy > 30) {
          setCurrentPiece(prev => {
            const newY = prev.y + 1;
            return isValidMove(board, prev.shape, prev.x, newY) 
              ? { ...prev, y: newY } 
              : prev;
          });
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [board, gameOver, isPaused, gameStarted]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused || !gameStarted) return;

    const gameLoop = () => {
      const currentTime = Date.now();
      const speed = Math.max(50, INITIAL_SPEED - (level - 1) * 50);
      
      if (currentTime - lastTimeRef.current > speed) {
        setCurrentPiece(prev => {
          const newY = prev.y + 1;
          if (isValidMove(board, prev.shape, prev.x, newY)) {
            return { ...prev, y: newY };
          } else {
            // Place piece and create new one
            const newBoard = placePiece(board, prev.shape, prev.x, prev.y, prev.color);
            const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
            
            if (linesCleared > 0) {
              const points = [0, 100, 300, 500, 800][linesCleared];
              setScore(s => {
                const newScore = s + points * level;
                setLevel(Math.floor(newScore / 1000) + 1);
                return newScore;
              });
            }
            
            setBoard(clearedBoard);
            
            const newPiece = createPiece();
            if (!isValidMove(clearedBoard, newPiece.shape, newPiece.x, newPiece.y)) {
              setGameOver(true);
              onGameOver(score + (linesCleared > 0 ? [0, 100, 300, 500, 800][linesCleared] * level : 0));
            }
            return newPiece;
          }
        });
        lastTimeRef.current = currentTime;
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [board, level, gameOver, isPaused, onGameOver, score, gameStarted]);

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleRestart = () => {
    setBoard(createBoard());
    setCurrentPiece(createPiece());
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(false);
    lastTimeRef.current = 0;
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const x = currentPiece.x + col;
          const y = currentPiece.y + row;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            displayBoard[y][x] = currentPiece.color;
          }
        }
      }
    }
    
    return displayBoard;
  };

  return (
    <div className="tetris-game" style={{ textAlign: 'center', padding: isFullscreen ? '2rem' : '1rem', position: 'relative' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: isFullscreen ? '3rem' : '2rem', 
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        <div>
          <div className="game-board" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
            gap: '1px',
            background: 'var(--border-color)',
            padding: '1px',
            borderRadius: '8px',
            maxWidth: isFullscreen ? '450px' : '300px',
            margin: '0 auto'
          }}>
            {renderBoard().flat().map((cell, i) => (
              <div
                key={i}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: isFullscreen ? '22px' : '15px',
                  aspectRatio: '1',
                  background: cell ? COLORS[cell - 1] : 'var(--card-background)',
                  borderRadius: '2px',
                  transition: 'all 0.1s ease'
                }}
              />
            ))}
          </div>
          
          <div style={{ marginTop: isFullscreen ? '2rem' : '1rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--primary-color)', marginBottom: isFullscreen ? '1rem' : '0.5rem', fontSize: isFullscreen ? '1.8rem' : '1.2rem', fontWeight: 'bold' }}>
              Score: {score}
            </div>
            <div style={{ color: 'var(--accent-color)', marginBottom: isFullscreen ? '1rem' : '0.5rem', fontSize: isFullscreen ? '1.4rem' : '1rem' }}>
              Level: {level}
            </div>
          </div>
        </div>
        
        <div style={{ 
          minWidth: isFullscreen ? '300px' : '200px',
          maxWidth: isFullscreen ? '400px' : '300px',
          background: 'var(--card-background)',
          padding: isFullscreen ? '2rem' : '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h4 style={{ color: 'var(--primary-color)', marginBottom: isFullscreen ? '1.5rem' : '1rem', fontSize: isFullscreen ? '1.5rem' : '1.2rem' }}>Controls</h4>
          <div style={{ fontSize: isFullscreen ? '1.1rem' : '0.9rem', color: 'var(--text-color-secondary)' }}>
            <div style={{ marginBottom: isFullscreen ? '1rem' : '0.5rem' }}>
              <strong>Keyboard:</strong>
            </div>
            <div style={{ marginBottom: isFullscreen ? '0.5rem' : '0.25rem' }}>A/D - Move Left/Right</div>
            <div style={{ marginBottom: isFullscreen ? '0.5rem' : '0.25rem' }}>W - Rotate</div>
            <div style={{ marginBottom: isFullscreen ? '0.5rem' : '0.25rem' }}>S - Soft Drop</div>
            <div style={{ marginBottom: isFullscreen ? '0.5rem' : '0.25rem' }}>Space - Hard Drop</div>
            <div style={{ marginBottom: isFullscreen ? '1rem' : '0.5rem' }}>P - Pause</div>
            <div style={{ marginTop: isFullscreen ? '1rem' : '0.5rem', marginBottom: isFullscreen ? '1rem' : '0.5rem' }}>
              <strong>Touch:</strong>
            </div>
            <div style={{ marginBottom: isFullscreen ? '0.5rem' : '0.25rem' }}>Swipe Left/Right - Move</div>
            <div style={{ marginBottom: isFullscreen ? '0.5rem' : '0.25rem' }}>Tap - Rotate</div>
            <div style={{ marginBottom: isFullscreen ? '0.5rem' : '0.25rem' }}>Double Tap - Hard Drop</div>
            <div style={{ marginBottom: isFullscreen ? '0.5rem' : '0.25rem' }}>Swipe Down - Soft Drop</div>
          </div>
        </div>
      </div>
      
      {!gameStarted && !gameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--card-background)',
          padding: isFullscreen ? '3rem' : '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          maxWidth: isFullscreen ? '500px' : '90vw',
          width: isFullscreen ? '500px' : '300px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginBottom: isFullscreen ? '1.5rem' : '1rem', color: 'var(--primary-color)', fontSize: isFullscreen ? '2rem' : '1.5rem' }}>Tetris</h3>
          <p style={{ marginBottom: isFullscreen ? '2rem' : '1.5rem', color: 'var(--text-color-secondary)', fontSize: isFullscreen ? '1.1rem' : '1rem' }}>
            Use WASD to move and rotate pieces. Clear lines to score points and level up!
          </p>
          <button 
            onClick={handleStart}
            style={{
              background: 'var(--primary-color)',
              color: 'var(--background-color)',
              border: 'none',
              padding: isFullscreen ? '1rem 2rem' : '0.75rem 1.5rem',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isFullscreen ? '1.2rem' : '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Start Game
          </button>
        </div>
      )}
      
      {(gameOver || isPaused) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--card-background)',
          padding: isFullscreen ? '3rem' : '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          maxWidth: isFullscreen ? '500px' : '90vw',
          width: isFullscreen ? '500px' : '300px'
        }}>
          <h3 style={{ marginBottom: isFullscreen ? '1.5rem' : '1rem', fontSize: isFullscreen ? '2rem' : '1.5rem' }}>{gameOver ? 'Game Over!' : 'Paused'}</h3>
          {gameOver && <p style={{ marginBottom: isFullscreen ? '2rem' : '1.5rem', fontSize: isFullscreen ? '1.3rem' : '1rem' }}>Final Score: {score}</p>}
          <button 
            onClick={gameOver ? handleRestart : () => setIsPaused(false)}
            style={{
              background: 'var(--primary-color)',
              color: 'var(--background-color)',
              border: 'none',
              padding: isFullscreen ? '1rem 2rem' : '0.75rem 1.5rem',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isFullscreen ? '1.2rem' : '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {gameOver ? 'Play Again' : 'Resume'}
          </button>
        </div>
      )}
    </div>
  );
} 