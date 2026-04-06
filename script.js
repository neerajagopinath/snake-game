const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const speedEl = document.getElementById('speed');
const messageEl = document.getElementById('message');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');

const cellSize = 24;
const gridSize = canvas.width / cellSize;

const vectors = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

let snake;
let direction;
let queuedDirection;
let food;
let intervalId;
let score;
let speed;
let isRunning = false;
let isPaused = false;

const bestScore = Number(localStorage.getItem('snake-best')) || 0;
bestScoreEl.textContent = bestScore;

function placeFood() {
  while (true) {
    const candidate = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };

    if (!snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y)) {
      return candidate;
    }
  }
}

function resetGame() {
  snake = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  queuedDirection = { ...direction };
  food = placeFood();
  score = 0;
  speed = 1;
  isPaused = false;
  scoreEl.textContent = score;
  speedEl.textContent = `${speed.toFixed(1)}x`;
  pauseBtn.textContent = 'Pause';
  messageEl.textContent = 'Good luck!';
  draw();
}

function updateLoopDelay() {
  const delay = Math.max(80, 170 - score * 4);
  clearInterval(intervalId);
  intervalId = setInterval(tick, delay);
}

function tick() {
  direction = queuedDirection;

  const nextHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall =
    nextHead.x < 0 ||
    nextHead.x >= gridSize ||
    nextHead.y < 0 ||
    nextHead.y >= gridSize;

  const hitSelf = snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

  if (hitWall || hitSelf) {
    gameOver();
    return;
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 10;
    speed = 1 + score / 80;
    scoreEl.textContent = score;
    speedEl.textContent = `${speed.toFixed(1)}x`;

    if (score > Number(bestScoreEl.textContent)) {
      bestScoreEl.textContent = score;
      localStorage.setItem('snake-best', String(score));
    }

    food = placeFood();
    updateLoopDelay();
    messageEl.textContent = 'Nice! Keep going.';
  } else {
    snake.pop();
  }

  draw();
}

function drawCell(x, y, color, round = false) {
  const padding = 2;
  ctx.fillStyle = color;

  if (round) {
    const radius = (cellSize - padding * 2) / 2;
    ctx.beginPath();
    ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, radius, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.fillRect(
    x * cellSize + padding,
    y * cellSize + padding,
    cellSize - padding * 2,
    cellSize - padding * 2
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < gridSize; i += 1) {
    for (let j = 0; j < gridSize; j += 1) {
      if ((i + j) % 2 === 0) {
        drawCell(i, j, '#0e1b33');
      } else {
        drawCell(i, j, '#10203a');
      }
    }
  }

  snake.forEach((segment, index) => {
    const color = index === 0 ? '#4cff8f' : '#27b461';
    drawCell(segment.x, segment.y, color);
  });

  drawCell(food.x, food.y, '#ff6b6b', true);
}

function gameOver() {
  clearInterval(intervalId);
  isRunning = false;
  isPaused = false;
  pauseBtn.textContent = 'Pause';
  messageEl.textContent = `Game over! Final score: ${score}. Press Start to try again.`;
}

function startGame() {
  resetGame();
  clearInterval(intervalId);
  updateLoopDelay();
  isRunning = true;
}

function togglePause() {
  if (!isRunning) {
    messageEl.textContent = 'Start a game first.';
    return;
  }

  isPaused = !isPaused;

  if (isPaused) {
    clearInterval(intervalId);
    pauseBtn.textContent = 'Resume';
    messageEl.textContent = 'Paused.';
  } else {
    updateLoopDelay();
    pauseBtn.textContent = 'Pause';
    messageEl.textContent = 'Back in action!';
  }
}

function setDirection(key) {
  const vector = vectors[key];
  if (!vector || !isRunning || isPaused) return;

  const reversing = vector.x === -direction.x && vector.y === -direction.y;
  if (reversing) return;

  queuedDirection = vector;
}

window.addEventListener('keydown', (event) => {
  setDirection(event.key);
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

resetGame();
