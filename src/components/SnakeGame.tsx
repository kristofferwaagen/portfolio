import { useEffect, useRef, useState } from 'react';

interface SnakeGameProps {
  onGameOver: (score: number) => void;
}

const BOARD_SIZE = 8;
const INITIAL_SNAKE = [ [4, 4] ];
const INITIAL_DIRECTION = [0, 1];
const SPEED = 200;

function getRandomFood(snake: number[][]): number[] {
  // Check if the board is full (snake length equals board size)
  if (snake.length >= BOARD_SIZE * BOARD_SIZE) {
    // Board is full, return a default position (this shouldn't happen in normal gameplay)
    return [0, 0];
  }

  // Create a set of occupied positions for faster lookup
  const occupiedPositions = new Set(snake.map(([x, y]) => `${x},${y}`));
  
  // Try to find an empty position with a reasonable number of attempts
  let attempts = 0;
  const maxAttempts = 1000; // Prevent infinite loops
  
  while (attempts < maxAttempts) {
    const food = [
      Math.floor(Math.random() * BOARD_SIZE),
      Math.floor(Math.random() * BOARD_SIZE)
    ];
    
    const foodKey = `${food[0]},${food[1]}`;
    if (!occupiedPositions.has(foodKey)) {
      return food;
    }
    
    attempts++;
  }
  
  // If we can't find a random position after many attempts, 
  // find the first available position systematically
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const foodKey = `${x},${y}`;
      if (!occupiedPositions.has(foodKey)) {
        return [x, y];
      }
    }
  }
  
  // This should never happen, but just in case
  return [0, 0];
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const moveRef = useRef(direction);
  const gameOverRef = useRef(false);

  // Check if in fullscreen mode and mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsFullscreen(window.innerWidth >= 1200 && window.innerHeight >= 800);
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Keyboard controls
  useEffect(() => {
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
  }, []);

  // Mobile control handlers
  const handleMobileControl = (dir: [number, number]) => {
    setDirection((prev) => {
      // Prevent reversing
      if (prev[0] + dir[0] === 0 && prev[1] + dir[1] === 0) return prev;
      return dir;
    });
  };

  // Game loop
  useEffect(() => {
    if (gameOver || !ready) return;
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
          // Check if the board is full (win condition)
          if (newSnake.length >= BOARD_SIZE * BOARD_SIZE) {
            setGameOver(true);
            gameOverRef.current = true;
            onGameOver(score + 10); // Add points for the last food
            return newSnake;
          }
          setFood(getRandomFood(newSnake));
          setScore((s) => s + 10);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, onGameOver, score, ready]);

  // Show ready prompt on mount
  useEffect(() => {
    setReady(false);
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    gameOverRef.current = false;
  }, []);

  return (
    <div className="snake-game" style={{ 
      textAlign: 'center', 
      padding: isMobile ? '0.25rem' : '0.5rem', 
      position: 'relative',
      maxWidth: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '0.5rem' : '1rem',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: 0
    }}>
      {/* Ready Overlay */}
      {!ready && !gameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--background-color)',
          padding: isFullscreen ? '3rem' : '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          border: '2px solid var(--border-color)',
          color: 'var(--text-color)',
          zIndex: 10,
          maxWidth: isFullscreen ? '500px' : '90vw',
          width: isFullscreen ? '500px' : '300px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginBottom: isFullscreen ? '1.5rem' : '1rem', color: 'var(--primary-color)', fontSize: isFullscreen ? '2rem' : '1.5rem' }}>Ready to play?</h3>
          <p style={{ marginBottom: isFullscreen ? '2rem' : '1.5rem', color: 'var(--text-color-secondary)', fontSize: isFullscreen ? '1.1rem' : '1rem' }}>
            Use WASD or arrow keys to control the snake. Eat the yellow food to grow and score points!
          </p>
          <button 
            onClick={() => setReady(true)}
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
      {/* Game Board Section - Centered */}
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
        <div className="game-board" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gap: '1px',
          maxWidth: isMobile ? '250px' : 'min(90vw, 400px)',
          width: '100%',
          aspectRatio: '1',
          background: 'var(--border-color)',
          borderRadius: '8px',
          padding: isMobile ? '2px' : '4px',
          margin: '0 auto'
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
        
        {/* Mobile Controls */}
        {isMobile && (
          <div className="mobile-controls">
            <div className="snake-controls">
              <button 
                className="control-button arrow-left"
                onClick={() => handleMobileControl([0, -1])}
                aria-label="Move Left"
              />
              <button 
                className="control-button arrow-right"
                onClick={() => handleMobileControl([0, 1])}
                aria-label="Move Right"
              />
              <button 
                className="control-button arrow-up"
                onClick={() => handleMobileControl([-1, 0])}
                aria-label="Move Up"
              />
              <button 
                className="control-button arrow-down"
                onClick={() => handleMobileControl([1, 0])}
                aria-label="Move Down"
              />
            </div>
          </div>
        )}
        
        <div style={{ 
          textAlign: 'center', 
          color: 'var(--primary-color)',
          fontSize: isFullscreen ? '1.8rem' : '1.2rem',
          fontWeight: 'bold'
        }}>
          Score: {score}
        </div>
      </div>

      {/* Instructions and Controls Section - Right Sidebar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        minWidth: isMobile ? 'auto' : '200px',
        maxWidth: isMobile ? '100%' : '250px',
        alignSelf: 'flex-start',
        flex: isMobile ? 'none' : '0 0 auto',
        overflow: 'hidden'
      }}>
        <div style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-color-secondary)', 
          padding: '0.75rem',
          background: 'var(--card-background)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          textAlign: 'left'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Controls:</div>
          <div style={{ fontSize: '0.8rem' }}>• Use WASD or Arrow keys to move</div>
          <div style={{ fontSize: '0.8rem' }}>• Use on-screen controls on mobile</div>
          <div style={{ fontSize: '0.8rem' }}>• Eat the yellow food to grow and score points!</div>
        </div>
      </div>
    </div>
  );
} 