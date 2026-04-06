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
      <p className="status-message">{gameMessage}</p>
      {isGameOver ? <div className="game-over-overlay">Game Over</div> : null}
    </section>
  );
}

export default GameBoard;
