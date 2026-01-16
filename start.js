//**Game Configuration starts

let highScore = localStorage.getItem("highscore") || 0;
// Set highscore in DOM
document.getElementById("highscore").innerText = highScore;
let score = 0;

// Set initial score in DOM
document.getElementById("score").innerText = score;
console.log("score", score);
console.log("hs", highScore);

// stores created ducks in javascript variables, so they can be referenced later
let ducks = [];

// duck image names
let duckImageNames = ["images/duck-left.gif", "images/duck-right.gif"];

//game level variable
let gameLevel = 1;
let duckCount; //this tells how many ducks can display in screen

//duck size variables
let duckwidth = 96;
let duckHeight = 93;

//game direction variables
let gameWidth;
let gameHeight;

// Set game dimensions based on window size
function setGameDimensions() {
  gameWidth = window.innerWidth;
  gameHeight = window.innerHeight * 0.75;
}

// duck velocity variables
let duckVelocityX = 4;
let duckVelocityY = 4;

// Reusable sounds (created ONCE)
const shootSound = new Audio("sound/duck-shot.mp3");
const duckQuack = new Audio("sound/duck-quack.mp3");
const duckFlap = new Audio("sound/duck-flap.mp3");
const dogSound = new Audio("sound/dog-score.mp3");

// Improve responsiveness
duckQuack.preload = "auto";
duckFlap.preload = "auto";
dogSound.preload = "auto";

// Optional tuning
duckQuack.volume = 0.7;
duckFlap.volume = 0.6;
dogSound.volume = 0.8;
//**Game configuration end function

//**Step 1 Game start function after page loads
const startButton = document.getElementById("startButton");

//listen for click on start button
startButton.addEventListener("click", () => {
  //step1 remove start button
  startButton.style.display = "none";

  //step 2 Add ducks to start the game after a short delay
  setTimeout(() => {
    setGameDimensions();
    addDucks();
  }, 1000);

  //   //step 3 move duck
  //   setInterval(() => {
  //     moveDucks();
  //   }, 1000 / 60);
});

/**Add Ducks */
function addDucks() {
  // reset ducks array
  ducks = [];

  // decide how many ducks to spawn (1 or 2)
  const spawnCount = Math.floor(Math.random() * 2) + 1;

  // track how many ducks are killed in this wave
  let ducksKilledInWave = 0;

  for (let i = 0; i < spawnCount; i++) {
    //create duck element

    const currentDuck = document.createElement("div");

    //style current duck
    currentDuck.style.width = "96px";
    currentDuck.style.height = "96px";
    currentDuck.style.backgroundPosition = "center";
    currentDuck.style.backgroundSize = "cover";
    currentDuck.style.position = "absolute";
    currentDuck.draggable = false;

    //choose duck image randomly
    const currentImage = Math.floor(Math.random() * duckImageNames.length);
    currentDuck.style.backgroundImage = `url("${duckImageNames[currentImage]}")`;

    //set initial velocity based on image direction
    let velocityX = currentImage === 0 ? -duckVelocityX : duckVelocityX;

    const duck = {
      currentDuck,
      x: randomPosition(gameWidth - duckwidth),
      y: randomPosition(gameHeight - duckHeight),
      velocityX,
      velocityY: duckVelocityY,
    };

    // 🔊 Duck appears → quack
    duckQuack.currentTime = 0;
    duckQuack.play();

    // set duck position
    currentDuck.style.left = `${duck.x}px`;
    currentDuck.style.top = `${duck.y}px`;

    //store duck in the DOM and in the ducks array
    document.body.appendChild(currentDuck);
    ducks.push(duck);

    //add event listener to shoot the duck
    currentDuck.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      //play shoot sound
      shootSound.currentTime = 0;
      shootSound.play();

      //remove duck from ducks array and remove duck from screen
      document.body.removeChild(currentDuck);
      ducks = ducks.filter((d) => d.currentDuck !== currentDuck);

      // track ducks killed in this wave
      ducksKilledInWave++;

      // ✅ ONLY LEVEL UP AND UPDATE SCORE WHEN ALL DUCKS IN THIS WAVE ARE DEAD
      if (ducks.length === 0) {
        // increment score by total ducks killed in this wave
        score += ducksKilledInWave;
            addDog();

        // update highscore if needed
        if (highScore < score) {
          highScore = score;
          localStorage.setItem("highscore", highScore);
        }

        // update score and highscore in DOM
        document.getElementById("score").innerText = score;
        document.getElementById("highscore").innerText = highScore;

        console.log("Level cleared");

        // increase level
        gameLevel++;
        document.getElementById("level").innerText = gameLevel;

        // optional: increase difficulty per level
        duckVelocityX += 0.5;
        duckVelocityY += 0.5;

        // spawn next wave after a short delay
      }
    });
  }
}

//generate random position within limit
function randomPosition(limit) {
  return Math.floor(Math.random() * limit);
}

//**Move Ducks */

/**ADD DOG */
function addDog() {
  const one = "/images/dog-duck1.png";
  const two = "/images/dog-duck2.png";

  //width and height
  const dogHeight = "150px";
  const dogWidth = "280px";
  const dogWidth2 = "320px";

  //create dog element
  const dog = document.createElement("div");
  dog.setAttribute("id", "dog");
  dog.style.width = duckCount === 1 ? dogWidth : dogWidth2;
  dog.style.height = dogHeight;
  dog.style.backgroundImage = duckCount === 1 ? `url("${one}")` : `url("${two}")`;
  dog.style.backgroundPosition = "center";
  dog.style.backgroundSize = "contain";
  dog.draggable = false;
  dog.style.position = "absolute";
  dog.style.bottom = "0px";
  dog.style.transform = "translateX(-50%)";

  //play dog sound
  dogSound.currentTime = 0;
  dogSound.play();
  document.body.append(dog);

  setTimeout(() => {
    document.body.removeChild(dog);
    addDucks();
  }, 800);
}
