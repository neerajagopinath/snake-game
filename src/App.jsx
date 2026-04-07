import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Controls from './components/Controls';
import GameBoard from './components/GameBoard';
import ScorePanel from './components/ScorePanel';

const GRID_SIZE = 20;
const START_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
const BASE_DELAY = 190;

const directionMap = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

function randomFood(snake) {
  while (true) {
    const candidate = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y)) {
      return candidate;
    }
  }
}

function App() {
  const [snake, setSnake] = useState(START_SNAKE);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [queuedDirection, setQueuedDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(() => randomFood(START_SNAKE));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('snake-best')) || 0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [status, setStatus] = useState('idle');

  const tickTimerRef = useRef(null);

  const isRunning = status === 'running';
  const isGameOver = status === 'gameover';
  const isPaused = status === 'paused';

  const resetGame = useCallback(() => {
    setSnake(START_SNAKE);
    setDirection({ x: 1, y: 0 });
    setQueuedDirection({ x: 1, y: 0 });
    setFood(randomFood(START_SNAKE));
    setScore(0);
    setStatus('idle');
  }, []);

  const restartGame = useCallback(() => {
    setSnake(START_SNAKE);
    setDirection({ x: 1, y: 0 });
    setQueuedDirection({ x: 1, y: 0 });
    setFood(randomFood(START_SNAKE));
    setScore(0);
    setStatus('running');
  }, []);

  useEffect(() => {
    const keyHandler = (event) => {
      const next = directionMap[event.key];
      if (!next || !isRunning) return;

      setQueuedDirection((current) => {
        const reversing = next.x === -current.x && next.y === -current.y;
        return reversing ? current : next;
      });
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(tickTimerRef.current);
      return;
    }

    const delay = Math.max(65, BASE_DELAY / speedMultiplier - score * 0.5);

    tickTimerRef.current = setInterval(() => {
      setSnake((currentSnake) => {
        const nextDirection = queuedDirection;
        setDirection(nextDirection);

        const head = currentSnake[0];
        const nextHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        const hitWall =
          nextHead.x < 0 ||
          nextHead.y < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y >= GRID_SIZE;

        const hitSelf = currentSnake.some(
          (segment) => segment.x === nextHead.x && segment.y === nextHead.y
        );

        if (hitWall || hitSelf) {
          setStatus('gameover');
          return currentSnake;
        }

        const updatedSnake = [nextHead, ...currentSnake];
        const ateFood = nextHead.x === food.x && nextHead.y === food.y;

        if (ateFood) {
          setScore((value) => {
            const nextScore = value + 10;
            setBestScore((best) => {
              if (nextScore > best) {
                localStorage.setItem('snake-best', String(nextScore));
                return nextScore;
              }
              return best;
            });
            return nextScore;
          });
          setFood(randomFood(updatedSnake));
          return updatedSnake;
        }

        updatedSnake.pop();
        return updatedSnake;
      });
    }, delay);

    return () => clearInterval(tickTimerRef.current);
  }, [food, isRunning, queuedDirection, score, speedMultiplier]);

  useEffect(() => {
    return () => clearInterval(tickTimerRef.current);
  }, []);

  const gameMessage = useMemo(() => {
    if (isGameOver) return `Game Over — Final Score: ${score}`;
    if (isPaused) return 'Paused';
    if (isRunning) return 'Hunt the glowing prey.';
    return 'Press Start to begin.';
  }, [isGameOver, isPaused, isRunning, score]);

  return (
    <main className="app-shell">
      <header className="title-wrap">
        <h1>Snake Reimagined</h1>
        <p>A modern React snake game with smooth motion and real-time speed control.</p>
      </header>

      <ScorePanel
        score={score}
        bestScore={bestScore}
        speedMultiplier={speedMultiplier}
        onSpeedChange={setSpeedMultiplier}
      />

      <GameBoard
        gridSize={GRID_SIZE}
        snake={snake}
        food={food}
        isGameOver={isGameOver}
        gameMessage={gameMessage}
      />

      <Controls
        status={status}
        onStart={() => setStatus('running')}
        onPause={() => setStatus('paused')}
        onResume={() => setStatus('running')}
        onRestart={restartGame}
        onReset={resetGame}
      />
    </main>
  );
}

export default App;
