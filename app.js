document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid') // 返回当前文档中第一个类名为grid的元素
  let squares = Array.from(document.querySelectorAll('.grid div')) // Array.from('foo')); Expected output: Array ["f", "o", "o"]，再调用index功能，就相当于给200个格子都编了号
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#startbutton')
  const width = 10 // width of grid
  let nextRan = 0
  let timeId
  let score = 0
  const colors = [
    'orange',
    'pink',
    'white',
    'gray',
    'yellow'
  ]

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width*2+1, width+2],
    [width, width+1, width+2, width*2+1],
    [width, 1, width+1, width*2+1]
  ]

  const zTetromino = [
    [width*2, width+1, width*2+1, width+2],
    [0, width, width+1, width*2+1],
    [width*2, width+1, width*2+1, width+2],
    [0, width, width+1, width*2+1]
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const theTetrominos = [iTetromino, zTetromino, tTetromino, oTetromino, lTetromino]

  let currentPosition = 4
  let currentRotation = 0

  console.log(theTetrominos[0][0])

  let random = Math.floor(Math.random()*theTetrominos.length)// Math.random()取0-1，*theTetrominos.length后取0-5，math.fllor()向下取整，取0-4（包括0与4
  // console.log(random)
  let current = theTetrominos[random][currentRotation] // （？）为什么不直接给第二个index赋值0？

  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino') // 给squares增加了一个叫tetromino的class，即css中设定的样式
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  // draw()

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino') // 给squares增加了一个叫tetromino的class，即css中设定的样式
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }


  // timerId= setInterval(moveDown, 800) // 每秒执行一次函数moveDown

  function control(e){
    if(e.keyCode === 37){
      moveLeft()
    } else if(e.keyCode === 38){
      rotate()
    } else if(e.keyCode === 39) {
      moveRight()
    } else if(e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  function moveDown() {
    undraw()
    currentPosition += width // x=x+y 意思是shape一格一格往下掉
    draw()
    frozen()
  }

  function frozen() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      random = nextRan
      nextRan = Math.floor(Math.random() * theTetrominos.length)
      current = theTetrominos[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }


  function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0 )

    if(!isAtLeftEdge) currentPosition -=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition +=1
    }
    draw()
  }

  function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1 )

    if(!isAtRightEdge) currentPosition +=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -=1
    }
   draw()
  }

  function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation === current.length){
      currentRotation = 0
    }
    current = theTetrominos[random][currentRotation]
    draw()
  }

  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0
  const upNextTetro = [
   [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
   [displayWidth * 2, displayWidth + 1, displayWidth * 2 + 1, displayWidth + 2],
   [1, displayWidth, displayWidth + 1, displayWidth + 2],
   [0, 1, displayWidth, displayWidth + 1],
   [1, displayWidth + 1, displayWidth * 2 + 1, 2]
   // 如果这个顺序与theTetrominos中的顺序不一致，就会出现不匹配的问题
 ]

  function displayShape() {
    displaySquares.forEach(item => {
      item.classList.remove('tetromino')
      item.style.backgroundColor = ''
    })
    upNextTetro[nextRan].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRan]
    })
  }

  startBtn.addEventListener('click', () => {
     if (timeId){
       clearInterval(timeId)
       timeId = null
     } else {
       draw()
       timeId = setInterval(moveDown, 400)
       nextRan = Math.floor(Math.random()*theTetrominos.length)
       displayShape()
     }

  })

  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timeId)
    }
  }







})
