import { memo } from 'react';
import Food from './Food';
import Snake from './Snake';

function GameBoard({ gridSize, snake, food, isGameOver, gameMessage }) {
  return (
    <section className="board-wrap" aria-live="polite">
      <div
        className={`game-board ${isGameOver ? 'shake' : ''}`}
        style={{ '--grid-size': gridSize }}
        role="img"
        aria-label="Snake game board"
      >
        <Snake segments={snake} />
        <Food position={food} />
      </div>

      <style>{`
        @keyframes foodPulse {
          0%, 100% { transform: scale(0.95); }
          50% { transform: scale(1.06); }
        }

        @keyframes foodGlow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>

      <p className="status-message">{gameMessage}</p>
      {isGameOver ? <div className="game-over-overlay">Game Over</div> : null}
    </section>
  );
}

export default memo(GameBoard);