let canvas = document.querySelector('canvas')
let context = canvas.getContext('2d')
let score = document.querySelector('.score-value')
let finalScore = document.querySelector('.results > span')
let menu = document.querySelector('.menu')
let playButton = document.querySelector('.btn-custom')
let map = document.querySelector('.mapping')

let size = 30
let snake = [
  { x: 270, y: 240 }
]
let movingDirection, loopNumber
//Incrementação de 30 a 30 (tamanho da snake)


let randomAudio = () => {
  let audioNumber = Math.round(Math.random() * 3)

  switch (audioNumber) {
    case 0:
      return 'audios/eat.wav'
    case 1:
      return 'audios/eat1.wav'
    case 3:
      return 'audios/eat2.wav'
  }
}
let audio = new Audio(randomAudio())

let deathAudio = new Audio('audios/death.mp3')
deathAudio.loop = false;

let gameAudio = new Audio('audios/ost.mp3')
gameAudio.loop = false;


let scorePoints = () => {
  score.innerText = parseInt(score.innerText) + 10
}



let randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

let randomPosition = () => {
  let number = randomNumber(0, canvas.width - size)
  return Math.round(number / 30) * 30
}

let randomFruitColor = () => {
  let red = randomNumber(0, 255)
  let green = randomNumber(0, 255)
  let blue = randomNumber(0, 255)

  return `rgb(${red}, ${green}, ${blue})`
}




let fruit = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomFruitColor()
}

let randomFruit = () => {

  let { x, y, color } = fruit

  context.shadowColor = color
  context.shadowBlur = 50
  context.fillStyle = color
  context.fillRect(x, y, size, size)
  context.shadowBlur = 0
}


let snakeMaker = () => {
  context.fillStyle = "limegreen"
  //fillrect establece a construção de um retangulo prenchido. (X, Y, X, Y)
  snake.forEach((position, index) => {
    //index possui a posição, se a posição for a ultima o ultimo quadrado do array sera prenchido
    if (index == snake.length - 1) {
      context.fillStyle = "green"
    }

    context.fillRect(position.x, position.y, size, size)
  })
}

let moveSnake = () => {
  //se o movimento de direção for igual a nulo retorna a função
  if (!movingDirection) return

  let head = snake[snake.length - 1]
  snake.shift()

  if (movingDirection == "right") {
    snake.push({ x: head.x + size, y: head.y })
  }

  if (movingDirection == "left") {
    snake.push({ x: head.x - size, y: head.y })
  }

  if (movingDirection == "down") {
    snake.push({ x: head.x, y: head.y + size })
  }

  if (movingDirection == "top") {
    snake.push({ x: head.x, y: head.y - size })
  }
}

let snakeGrid = () => {
  context.lineWidth = 1
  context.strokeStyle = "#191919"

  for (let i = 30; i < canvas.width; i += 30) {
    context.beginPath()
    context.lineTo(i, 0)
    context.lineTo(i, 600)
    context.stroke()

    context.beginPath()
    context.lineTo(0, i)
    context.lineTo(600, i)
    context.stroke()
  }
}

let checkEat = () => {
  let head = snake[snake.length - 1]

  if (head.x == fruit.x && head.y == fruit.y) {
    scorePoints()
    snake.push(head)
    audio.play()


    let x = randomPosition()
    let y = randomPosition()

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition()
      y = randomPosition()
    }

    fruit.x = x
    fruit.y = y
    fruit.color = randomFruitColor()
  }
}

let collision = () => {
  let head = snake[snake.length - 1]
  let limit = canvas.width - size
  let headLimit = snake.length - 2
  let wallCollision = head.x < 0 || head.x > limit || head.y < 0 || head.y > limit
  let selfCollision = snake.find((position, index) => {
    return index < headLimit && position.x == head.x && position.y == head.y
  })
  if (wallCollision || selfCollision) {
    gameOver()
  }
}

const gameOver = () => {
  gameAudio.pause()
  deathAudio.play()
  movingDirection = undefined
  menu.style.display = "flex"
  finalScore.innerText = score.innerText
  canvas.style.filter = "blur(3px)"
}



let looping = () => {
  clearInterval(loopNumber)
  gameAudio.play()
  context.clearRect(0, 0, 600, 600)
  snakeGrid()
  randomFruit()
  moveSnake()
  snakeMaker()
  checkEat()
  collision()

  loopNumber = setTimeout(() => {
    looping()
  }, 300);
}
looping()




document.addEventListener("keydown", ({ key }) => {

  if (key == "ArrowRight" && movingDirection != "left") {
    movingDirection = "right"
  }

  if (key == "ArrowLeft" && movingDirection != "right") {
    movingDirection = "left"
  }

  if (key == "ArrowDown" && movingDirection != "top") {
    movingDirection = "down"
  }

  if (key == "ArrowUp" && movingDirection != "down") {
    movingDirection = "top"
  }

})
snakeGrid()

playButton.addEventListener("click", () => {
  score.innerText = "00"
  menu.style.display = "none"
  canvas.style.filter = "none"
  deathAudio.pause()

  snake = [{ x: 270, y: 240 }]
})



