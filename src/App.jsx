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

const aiMoves = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

function randomFood(snake) {
  while (true) {
    const candidate = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((s) => s.x === candidate.x && s.y === candidate.y)) {
      return candidate;
    }
  }
}

function isOppositeDirection(a, b) {
  return a.x === -b.x && a.y === -b.y;
}

function getAIMove({ head, food, snakeBody, gridSize, currentDirection }) {
  const safeMoves = aiMoves.filter((move) => {
    if (isOppositeDirection(move, currentDirection)) return false;

    const next = {
      x: head.x + move.x,
      y: head.y + move.y,
    };

    const hitWall =
      next.x < 0 || next.y < 0 || next.x >= gridSize || next.y >= gridSize;

    const hitSelf = snakeBody.some(
      (s) => s.x === next.x && s.y === next.y
    );

    return !hitWall && !hitSelf;
  });

  if (!safeMoves.length) return currentDirection;

  return safeMoves.reduce((best, move) => {
    const bestDist =
      Math.abs(head.x + best.x - food.x) +
      Math.abs(head.y + best.y - food.y);

    const moveDist =
      Math.abs(head.x + move.x - food.x) +
      Math.abs(head.y + move.y - food.y);

    return moveDist < bestDist ? move : best;
  }, safeMoves[0]);
}

function App() {
  const [snake, setSnake] = useState(START_SNAKE);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [queuedDirection, setQueuedDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(() => randomFood(START_SNAKE));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem('snake-best')) || 0
  );
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [status, setStatus] = useState('idle');
  const [aiEnabled, setAiEnabled] = useState(false);

  const tickTimerRef = useRef(null);
  const directionRef = useRef(direction);

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
    directionRef.current = { x: 1, y: 0 };
  }, []);

  const restartGame = useCallback(() => {
    setSnake(START_SNAKE);
    setDirection({ x: 1, y: 0 });
    setQueuedDirection({ x: 1, y: 0 });
    setFood(randomFood(START_SNAKE));
    setScore(0);
    setStatus('running');
    directionRef.current = { x: 1, y: 0 };
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const keyHandler = (e) => {
      const next = directionMap[e.key];
      if (!next || !isRunning || aiEnabled) return;

      setQueuedDirection((curr) => {
        const reversing = next.x === -curr.x && next.y === -curr.y;
        return reversing ? curr : next;
      });
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [isRunning, aiEnabled]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(tickTimerRef.current);
      return;
    }

    const delay = Math.max(65, BASE_DELAY / speedMultiplier - score * 0.5);

    tickTimerRef.current = setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const currentDirection = directionRef.current;

        const nextDirection = aiEnabled
          ? getAIMove({
              head,
              food,
              snakeBody: currentSnake.slice(0, -1),
              gridSize: GRID_SIZE,
              currentDirection,
            })
          : queuedDirection;

        setDirection(nextDirection);
        directionRef.current = nextDirection;

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
          (s) => s.x === nextHead.x && s.y === nextHead.y
        );

        if (hitWall || hitSelf) {
          setStatus('gameover');
          return currentSnake;
        }

        const updated = [nextHead, ...currentSnake];
        const ate = nextHead.x === food.x && nextHead.y === food.y;

        if (ate) {
          setScore((val) => {
            const next = val + 10;
            setBestScore((best) => {
              if (next > best) {
                localStorage.setItem('snake-best', String(next));
                return next;
              }
              return best;
            });
            return next;
          });
          setFood(randomFood(updated));
          return updated;
        }

        updated.pop();
        return updated;
      });
    }, delay);

    return () => clearInterval(tickTimerRef.current);
  }, [aiEnabled, food, isRunning, queuedDirection, score, speedMultiplier]);

  useEffect(() => {
    return () => clearInterval(tickTimerRef.current);
  }, []);

  const gameMessage = useMemo(() => {
    if (isGameOver) return `Game Over — Final Score: ${score}`;
    if (isPaused) return 'Paused';
    if (isRunning && aiEnabled) return 'AI is hunting the prey.';
    if (isRunning) return 'Hunt the glowing prey.';
    return 'Press Start to begin.';
  }, [aiEnabled, isGameOver, isPaused, isRunning, score]);

  return (
    <main className="app-shell">
      <header className="title-wrap">
        <h1>Snake Reimagined</h1>
        <p>A modern React snake game with AI auto-play.</p>
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

      <button onClick={() => setAiEnabled((v) => !v)}>
        {aiEnabled ? 'AI ON 🤖' : 'AI OFF 🎮'}
      </button>
    </main>
  );
}

export default App;