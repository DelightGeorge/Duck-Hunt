let highScore = localStorage.getItem('highscore') || 0
document.getElementById('highscore').innerText = highScore
console.log('hs', highScore)

// Reusable sounds (created ONCE)
const shootSound = new Audio('sound/duck-shot.mp3')
const duckQuack = new Audio('sound/duck-quack.mp3')
const duckFlap = new Audio('sound/duck-flap.mp3')
const dogSound = new Audio('sound/dog-score.mp3')

// Improve responsiveness
duckQuack.preload = 'auto'
duckFlap.preload = 'auto'
dogSound.preload = 'auto'

// Optional tuning
duckQuack.volume = 0.7
duckFlap.volume = 0.6
dogSound.volume = 0.8

// ========================================
// STEP 1: GAME CONFIGURATION
// ========================================

let ducks = []
let duckCount//this tells how many ducks can display in screen
let gameLevel = 1

let duckImageNames = ['duck-left.gif', 'duck-right.gif']

let duckwidth = 96
let duckHeight = 93

let gameWidth
let gameHeight

function updateGameSize () {
  gameWidth = window.innerWidth
  gameHeight = window.innerHeight * 0.75
}

let duckVelocityX = 4
let duckVelocityY = 4
let score = 0

// ========================================
// STEP 2: START GAME AFTER PAGE LOAD
// ========================================

const startButton = document.getElementById('startButton')

startButton.addEventListener('click', () => {
  // Remove start button
  startButton.style.display = 'none'

  // Initialize game
  updateGameSize()
  setTimeout(() => {
    // ****** ADD DUCKS TO START THE GAME
    addDucks()
    // this will involve creating ducks (step3) which also has an event listener for shooting ducks
    //Also uses random position helper function
    // ******
  }, 1000)

  // Start game loop
  setInterval(() => {
    moveDuck()
  }, 1000 / 60)
})

// ========================================
// STEP 3: CREATE DUCKS
// ========================================

function addDucks () {
  ducks = []
  duckCount = Math.floor(Math.random() * 2) + 1

  for (let i = 0; i < duckCount; i++) {
    let currentImage =
      duckImageNames[Math.floor(Math.random() * duckImageNames.length)]

    let currentDuck = document.createElement('div')
    currentDuck.style.width = `${duckwidth}px`
    currentDuck.style.height = `${duckHeight}px`
    currentDuck.style.position = 'absolute'
    currentDuck.style.backgroundRepeat = 'no-repeat'
    currentDuck.style.backgroundSize = 'contain'
    currentDuck.style.backgroundPosition = 'center'
    currentDuck.style.backgroundImage = `url("images/${currentImage}")`
    currentDuck.draggable = false

    //randomize initial velocity direction using the image direction
    let velocityX =
      currentImage === duckImageNames[0] ? -duckVelocityX : duckVelocityX

    let duck = {
      currentDuck,
      x: randomPosition(gameWidth - duckwidth),
      y: randomPosition(gameHeight - duckHeight),
      velocityX,
      velocityY: duckVelocityY
    }

    // 🔊 Duck appears → quack
    //Also set the random duck position before quack
    duckQuack.currentTime = 0
    duckQuack.play()
    currentDuck.style.left = `${duck.x}px`
    currentDuck.style.top = `${duck.y}px`

    //store the duck in the DOM(duck array)
    document.body.append(currentDuck)
    ducks.push(duck)

    //listen to events that trigger when duck is clicked
    duck.currentDuck.addEventListener('pointerdown', e => {
      e.preventDefault()
      e.stopPropagation()

      // 🔫 Shoot sound
      shootSound.currentTime = 0
      shootSound.play()

      score++

      if (highScore < score) {
        highScore = score
        localStorage.setItem('highscore', highScore)
      }

      document.getElementById('score').innerText = score
      document.getElementById('highscore').innerText = highScore


      //remove duck from dom and stored ducks array
      document.body.removeChild(duck.currentDuck)
      ducks = ducks.filter(d => d !== duck)

      // If all ducks are gone, add a dog
      if (ducks.length === 0) {
        addDog()
        gameLevel += 1
        document.getElementById('level').innerText = gameLevel
      }
    })
  }
}

// ========================================
// STEP 4: RANDOM POSITION HELPER
// ========================================

function randomPosition (limit) {
  return Math.floor(Math.random() * limit)
}

// ========================================
// STEP 5: MOVE DUCKS EACH FRAME
// ========================================
function moveDuck () {
  for (let duck of ducks) {
    duck.x += duck.velocityX
    duck.y += duck.velocityY

    if (duck.x <= 0 || duck.x >= gameWidth - duckwidth) {
      duck.velocityX *= -1
      duckFlap.currentTime = 0
      duckFlap.play()
      updateDuckDirection(duck)
    }

    if (duck.y <= 0 || duck.y >= gameHeight - duckHeight) {
      duck.velocityY *= -1
      duckFlap.currentTime = 0
      duckFlap.play()
    }

    duck.currentDuck.style.left = `${duck.x}px`
    duck.currentDuck.style.top = `${duck.y}px`
  }
}

// ========================================
// STEP 6: UPDATE DUCK IMAGE BASED ON VELOCITY
// ========================================

function updateDuckDirection (duck) {
  duck.currentDuck.style.backgroundImage =
    duck.velocityX < 0
      ? `url("images/${duckImageNames[0]}")`
      : `url("images/${duckImageNames[1]}")`
}

// ========================================
// STEP 7: ADD DOG
// ========================================

function addDog () {
  const one = `url("images/dog-duck1.png")`
  const two = `url("images/dog-duck2.png")`

  let dog = document.createElement('div')
  dog.style.backgroundImage = duckCount === 2 ? two : one
  dog.style.width = duckCount === 2 ? '224px' : '172px'
  dog.style.height = '152px'
  dog.style.backgroundRepeat = 'no-repeat'
  dog.style.backgroundSize = 'contain'
  dog.style.backgroundPosition = 'center'
  dog.style.position = 'fixed'

  dog.setAttribute('id', 'dog')
  // dog.style.left = '50%'
  dog.draggable = false

  // 🐕 Dog sound
  dogSound.currentTime = 0
  dogSound.play()

  document.body.append(dog)

  setTimeout(() => {
    document.body.removeChild(dog)
    duckVelocityX += 0.2
    duckVelocityY += 0.2

    console.log('velx:', duckVelocityX)
    console.log('vely:', duckVelocityY)

    addDucks()
  }, 5000)
}
