function Controls({ status, onStart, onPause, onResume, onRestart, onReset }) {
  const isRunning = status === 'running';
  const isPaused = status === 'paused';

  return (
    <section className="controls-row">
      <button onClick={onStart} disabled={isRunning}>
        Start
      </button>
      <button onClick={isPaused ? onResume : onPause} disabled={status === 'idle' || status === 'gameover'}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button onClick={onRestart}>Restart</button>
      <button onClick={onReset}>Reset</button>
    </section>
  );
}

export default Controls;
