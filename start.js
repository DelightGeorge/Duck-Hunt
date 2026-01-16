//**Game Configuration starts

let highScore = localStorage.getItem("highscore") || 0;
document.getElementById("highscore").innerText = highScore;

let score = 0;
document.getElementById("score").innerText = score;

// stores created ducks
let ducks = [];

// duck images
let duckImageNames = ["images/duck-left.gif", "images/duck-right.gif"];

// game variables
let gameLevel = 1;
let duckCount;

let duckwidth = 96;
let duckHeight = 93;

// game boundaries
let gameWidth;
let gameHeight;

// ✅ FIX: FULL SCREEN HEIGHT
function setGameDimensions() {
  gameWidth = window.innerWidth;
  gameHeight = window.innerHeight;
}

// velocity
let duckVelocityX = 4;
let duckVelocityY = 4;

// sounds
const shootSound = new Audio("sound/duck-shot.mp3");
const duckQuack = new Audio("sound/duck-quack.mp3");
const duckFlap = new Audio("sound/duck-flap.mp3");
const dogSound = new Audio("sound/dog-score.mp3");

duckQuack.preload = "auto";
duckFlap.preload = "auto";
dogSound.preload = "auto";

duckQuack.volume = 0.7;
duckFlap.volume = 0.6;
dogSound.volume = 0.8;

// ========================================
// GAME START
// ========================================

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  startButton.style.display = "none";

  setTimeout(() => {
    setGameDimensions();
    addDucks();
  }, 1000);

  // ✅ movement interval restored
  setInterval(() => {
    moveDucks();
  }, 1000 / 60);
});

// ========================================
// ADD DUCKS
// ========================================

function addDucks() {
  ducks = [];
  duckCount = Math.floor(Math.random() * 2) + 1;
  let ducksKilledInWave = 0;

  for (let i = 0; i < duckCount; i++) {
    const currentDuck = document.createElement("div");

    currentDuck.style.width = `${duckwidth}px`;
    currentDuck.style.height = `${duckHeight}px`;
    currentDuck.style.position = "absolute";
    currentDuck.style.backgroundSize = "cover";
    currentDuck.style.backgroundPosition = "center";
    currentDuck.draggable = false;

    const imageIndex = Math.floor(Math.random() * duckImageNames.length);
    currentDuck.style.backgroundImage = `url("${duckImageNames[imageIndex]}")`;

    let velocityX = imageIndex === 0 ? -duckVelocityX : duckVelocityX;

    const duck = {
      currentDuck,
      x: randomPosition(gameWidth - duckwidth),
      y: randomPosition(gameHeight - duckHeight),
      velocityX,
      velocityY: duckVelocityY
    };

    duckQuack.currentTime = 0;
    duckQuack.play();

    currentDuck.style.left = `${duck.x}px`;
    currentDuck.style.top = `${duck.y}px`;

    document.body.appendChild(currentDuck);
    ducks.push(duck);

    currentDuck.addEventListener("pointerdown", e => {
      e.preventDefault();
      e.stopPropagation();

      shootSound.currentTime = 0;
      shootSound.play();

      document.body.removeChild(currentDuck);
      ducks = ducks.filter(d => d.currentDuck !== currentDuck);

      ducksKilledInWave++;

      if (ducks.length === 0) {
        score += ducksKilledInWave;
        addDog();

        if (score > highScore) {
          highScore = score;
          localStorage.setItem("highscore", highScore);
        }

        document.getElementById("score").innerText = score;
        document.getElementById("highscore").innerText = highScore;

        gameLevel++;
        document.getElementById("level").innerText = gameLevel;

        duckVelocityX += 0.5;
        duckVelocityY += 0.5;
      }
    });
  }
}

// ========================================
// MOVE DUCKS
// ========================================

function moveDucks() {
  for (let duck of ducks) {
    duck.x += duck.velocityX;
    duck.y += duck.velocityY;

    if (duck.x <= 0 || duck.x >= gameWidth - duckwidth) {
      duck.velocityX *= -1;
      duckFlap.currentTime = 0;
      duckFlap.play();
      updateDuckDirection(duck);
    }

    if (duck.y <= 0 || duck.y >= gameHeight - duckHeight) {
      duck.velocityY *= -1;
      duckFlap.currentTime = 0;
      duckFlap.play();
    }

    duck.currentDuck.style.left = `${duck.x}px`;
    duck.currentDuck.style.top = `${duck.y}px`;
  }
}

// ========================================
// DIRECTION IMAGE
// ========================================

function updateDuckDirection(duck) {
  duck.currentDuck.style.backgroundImage =
    duck.velocityX < 0
      ? `url("${duckImageNames[0]}")`
      : `url("${duckImageNames[1]}")`;
}

// ========================================
// RANDOM POSITION
// ========================================

function randomPosition(limit) {
  return Math.floor(Math.random() * limit);
}

// ========================================
// ADD DOG
// ========================================

function addDog() {
  const one = "/images/dog-duck1.png";
  const two = "/images/dog-duck2.png";

  const dog = document.createElement("div");
  dog.id = "dog";
  dog.style.width = duckCount === 1 ? "280px" : "320px";
  dog.style.height = "150px";
  dog.style.backgroundImage =
    duckCount === 1 ? `url("${one}")` : `url("${two}")`;
  dog.style.backgroundSize = "contain";
  dog.style.backgroundPosition = "center";
  dog.style.position = "absolute";
  dog.style.bottom = "0";
  dog.style.left = "50%";
  dog.style.transform = "translateX(-50%)";
  dog.draggable = false;

  dogSound.currentTime = 0;
  dogSound.play();
  document.body.appendChild(dog);

  setTimeout(() => {
    document.body.removeChild(dog);
    duckVelocityX += 0.2;
    duckVelocityY += 0.2;
    addDucks();
  }, 800);
}
