const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

const box = 30;
const speed = 200;
const WIN_SCORE = 19;

// Images
const players = [];
for (let i = 1; i <= 4; i++) {
  const img = new Image();
  img.src = `player${i}.png`;
  players.push(img);
}

const foodImg = new Image();
foodImg.src = "food.png";

// Game variables
let x, y;
let dx = 0, dy = 0;
let size;
let food;
let score = 0;
let game = null;

// 🎮 MOVE FUNCTION (KEYBOARD + MOBILE)
window.move = function (dir) {
  if (dir === "UP")    { dx = 0; dy = -box; }
  if (dir === "DOWN")  { dx = 0; dy = box; }
  if (dir === "LEFT")  { dx = -box; dy = 0; }
  if (dir === "RIGHT") { dx = box; dy = 0; }
};

// Keyboard controls (PC)
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move("UP");
  if (e.key === "ArrowDown") move("DOWN");
  if (e.key === "ArrowLeft") move("LEFT");
  if (e.key === "ArrowRight") move("RIGHT");
});

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// 🎯 IMAGE RULES (as you wanted)
function playerImage() {
  if (score === 19) return players[3];  // pic 4
  if (score >= 13) return players[2];   // pic 3
  if (score >= 7)  return players[1];   // pic 2
  return players[0];                    // pic 1
}

// GAME LOOP
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food (safe)
  if (foodImg.complete && foodImg.naturalWidth !== 0) {
    ctx.drawImage(foodImg, food.x, food.y, box, box);
  } else {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Move
  x += dx;
  y += dy;

  // Draw player
  ctx.drawImage(playerImage(), x, y, size, size);

  // Wall collision
  if (
    x < 0 || y < 0 ||
    x + size > canvas.width ||
    y + size > canvas.height
  ) {
    clearInterval(game);
    alert("Game Over");
    return;
  }

  // Eat coin
  if (
    x < food.x + box &&
    x + size > food.x &&
    y < food.y + box &&
    y + size > food.y
  ) {
    score += 3;
    if (score > 19) score = 19;

    size += 6;
    food = randomFood();
    scoreEl.textContent = "Score: " + score;

    if (score === WIN_SCORE) {
      clearInterval(game);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const finalSize = 150;
      ctx.drawImage(
        players[3],
        canvas.width / 2 - finalSize / 2,
        canvas.height / 2 - finalSize / 2 - 30,
        finalSize,
        finalSize
      );

      ctx.fillStyle = "#fff";
      ctx.font = "32px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        " HAPPY BIRTHDAY DODA❤️❤️",
        canvas.width / 2,
        canvas.height / 2 + finalSize / 2 + 20
      );
    }
  }
}

// START
startBtn.addEventListener("click", () => {
  clearInterval(game);

  size = 70;
  x = canvas.width / 2 - size / 2;
  y = canvas.height / 2 - size / 2;

  dx = 0;
  dy = 0;
  score = 0;
  scoreEl.textContent = "Score: 0";
  food = randomFood();

  game = setInterval(loop, speed);
});
