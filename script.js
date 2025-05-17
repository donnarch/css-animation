const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScoreEl = document.getElementById("final-score");
const eatSound = document.getElementById("eat-sound");
const gameOverSound = document.getElementById("game-over-sound");
const mobileControls = document.getElementById("mobile-controls");

let snake = [];
let direction = { x: 0, y: 0 };
let food = {};
let score = 0;
let interval;
const gridSize = 20;
const tileCount = canvas.width / gridSize;

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = randomFood();
  score = 0;
  scoreEl.textContent = "Score: 0";

  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  canvas.style.display = "block";
  mobileControls.style.display = "block";

  clearInterval(interval);
  interval = setInterval(gameLoop, 100);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2);
}

function gameLoop() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
    score++;
    scoreEl.textContent = "Score: " + score;
    eatSound.play();
  } else {
    snake.pop();
  }

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(food.x, food.y, "red");
  snake.forEach((segment, index) => {
    drawRect(segment.x, segment.y, index === 0 ? "lime" : "green");
  });
}

function gameOver() {
  clearInterval(interval);
  canvas.style.display = "none";
  mobileControls.style.display = "none";
  gameOverScreen.style.display = "block";
  finalScoreEl.textContent = "Your score was: " + score;
  gameOverSound.play();
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

function setDirection(x, y) {
  if (
    (direction.x !== -x || direction.y !== -y) &&
    (direction.x !== x || direction.y !== y)
  ) {
    direction = { x, y };
  }
}
