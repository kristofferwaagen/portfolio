import React, { useEffect, useRef, useState } from 'react';

interface SnakeGameProps {
  onGameOver: (score: number) => void;
}

const BOARD_SIZE = 8;
const INITIAL_SNAKE = [ [4, 4] ];
const INITIAL_DIRECTION = [0, 1];
const SPEED = 200;

function getRandomFood(snake: number[][]): number[] {
  let food: number[];
  do {
    food = [
      Math.floor(Math.random() * BOARD_SIZE),
      Math.floor(Math.random() * BOARD_SIZE)
    ];
  } while (snake.some(([x, y]) => x === food[0] && y === food[1]));
  return food;
}

const directions: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  w: [-1, 0],
  s: [1, 0],
  a: [0, -1],
  d: [0, 1],
};

export default function SnakeGame({ onGameOver }: SnakeGameProps) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const moveRef = useRef(direction);
  const gameOverRef = useRef(false);

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
      const dir = directions[e.key];
      if (dir) {
        setDirection((prev) => {
          // Prevent reversing
          if (prev[0] + dir[0] === 0 && prev[1] + dir[1] === 0) return prev;
          return dir;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);

  // Touch controls
  useEffect(() => {
    if (!gameStarted) return;
    
    let startX = 0, startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20) setDirection((prev) => prev[1] === -1 ? prev : [0, 1]); // right
        else if (dx < -20) setDirection((prev) => prev[1] === 1 ? prev : [0, -1]); // left
      } else {
        if (dy > 20) setDirection((prev) => prev[0] === -1 ? prev : [1, 0]); // down
        else if (dy < -20) setDirection((prev) => prev[0] === 1 ? prev : [-1, 0]); // up
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameStarted]);

  // Game loop
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    moveRef.current = direction;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const newHead = [prev[0][0] + moveRef.current[0], prev[0][1] + moveRef.current[1]];
        // Check wall collision
        if (
          newHead[0] < 0 || newHead[0] >= BOARD_SIZE ||
          newHead[1] < 0 || newHead[1] >= BOARD_SIZE ||
          prev.some(([x, y]) => x === newHead[0] && y === newHead[1])
        ) {
          setGameOver(true);
          gameOverRef.current = true;
          onGameOver(score);
          return prev;
        }
        let newSnake = [newHead, ...prev];
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setFood(getRandomFood(newSnake));
          setScore((s) => s + 10);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, gameStarted, onGameOver, score]);

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    gameOverRef.current = false;
  };

  return (
    <div className="snake-game" style={{ textAlign: 'center', padding: isFullscreen ? '2rem' : '1rem', position: 'relative' }}>
      <div className="game-board" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gap: '1px',
        maxWidth: isFullscreen ? '600px' : '400px',
        margin: '0 auto',
        background: 'var(--border-color)',
        borderRadius: '8px',
        padding: isFullscreen ? '12px' : '8px'
      }}>
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
          const x = Math.floor(i / BOARD_SIZE);
          const y = i % BOARD_SIZE;
          const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          const isHead = snake[0][0] === x && snake[0][1] === y;
          const isFood = food[0] === x && food[1] === y;
          return (
            <div
              key={i}
              className={`game-cell${isSnake ? ' snake' : ''}${isHead ? ' head' : ''}${isFood ? ' food' : ''}`}
              style={{
                width: '100%',
                height: '100%',
                minHeight: isFullscreen ? '30px' : '20px',
                aspectRatio: '1',
                background: isFood ? '#fdcb6e' : isHead ? '#00b894' : isSnake ? '#55efc4' : 'var(--card-background)',
                borderRadius: isFood ? '50%' : 2,
                border: '1px solid var(--border-color)',
                transition: 'all 0.1s ease'
              }}
            />
          );
        })}
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
          <h3 style={{ marginBottom: isFullscreen ? '1.5rem' : '1rem', color: 'var(--primary-color)', fontSize: isFullscreen ? '2rem' : '1.5rem' }}>Snake Game</h3>
          <p style={{ marginBottom: isFullscreen ? '2rem' : '1.5rem', color: 'var(--text-color-secondary)', fontSize: isFullscreen ? '1.1rem' : '1rem' }}>
            Use WASD or arrow keys to control the snake. Eat the yellow food to grow and score points!
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
      
      <div style={{ 
        marginTop: isFullscreen ? '2rem' : '1rem', 
        textAlign: 'center', 
        color: 'var(--primary-color)',
        fontSize: isFullscreen ? '1.8rem' : '1.2rem',
        fontWeight: 'bold'
      }}>
        Score: {score}
      </div>
      {gameOver && (
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
          <h3 style={{ marginBottom: isFullscreen ? '1.5rem' : '1rem', fontSize: isFullscreen ? '2rem' : '1.5rem' }}>Game Over!</h3>
          <p style={{ marginBottom: isFullscreen ? '2rem' : '1.5rem', fontSize: isFullscreen ? '1.3rem' : '1rem' }}>Final Score: {score}</p>
          <button 
            onClick={handleRestart}
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
            Play Again
          </button>
        </div>
      )}
      <div style={{ 
        fontSize: isFullscreen ? '1rem' : '0.9rem', 
        color: 'var(--text-color-secondary)', 
        marginTop: isFullscreen ? '2rem' : '1rem',
        padding: isFullscreen ? '1.5rem' : '1rem',
        background: 'var(--card-background)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        maxWidth: isFullscreen ? '600px' : '400px',
        margin: isFullscreen ? '2rem auto 0' : '1rem auto 0'
      }}>
        <div style={{ fontWeight: '600', marginBottom: isFullscreen ? '1rem' : '0.5rem', fontSize: isFullscreen ? '1.2rem' : '1rem' }}>Controls:</div>
        <div style={{ fontSize: isFullscreen ? '1rem' : '0.9rem' }}>• Use WASD or Arrow keys to move</div>
        <div style={{ fontSize: isFullscreen ? '1rem' : '0.9rem' }}>• Swipe on mobile devices</div>
        <div style={{ fontSize: isFullscreen ? '1rem' : '0.9rem' }}>• Eat the yellow food to grow and score points!</div>
      </div>
    </div>
  );
} 