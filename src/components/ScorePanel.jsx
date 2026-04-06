function ScorePanel({ score, bestScore, speedMultiplier, onSpeedChange }) {
  return (
    <section className="hud">
      <article>
        <p>Score</p>
        <strong>{score}</strong>
      </article>
      <article>
        <p>Best</p>
        <strong>{bestScore}</strong>
      </article>
      <article>
        <p>Speed</p>
        <strong>{speedMultiplier.toFixed(1)}x</strong>
      </article>

      <label className="speed-control">
        <span>Adjust Speed</span>
        <input
          type="range"
          min="0.7"
          max="2.5"
          step="0.1"
          value={speedMultiplier}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
        />
      </label>
    </section>
  );
}

export default ScorePanel;
