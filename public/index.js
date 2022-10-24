const canvas = document.getElementById('drawing-board')
const toolbar = document.getElementById('toolbar')
const button = document.getElementById('clear')
const ctx = canvas.getContext('2d')
const socket = io("http://localhost:3000")

const canvasOffSetX = canvas.offsetLeft;
const canvasOffSetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffSetX
canvas.height = window.innerHeight - canvasOffSetY

let isPainting = false
let lineWidth = 5
let startX;
let startY;

button.addEventListener('click', (e) => {
  e.preventDefault()
  const canvasArea = { width: canvas.width, height: canvas.height }
  socket.emit('clear', canvasArea)
  clearDrawing(canvas)
})

toolbar.addEventListener('change', (e) => {
  if (e.target.id === 'stroke') {
    ctx.strokeStyle = e.target.value
  }

  if (e.target.id === 'lineWidth') {
    lineWidth = e.target.value
  }
})

canvas.addEventListener('mousedown',(e) => {
  const coordinate = { x: e.clientX, y: e.clientY }
  socket.emit('mousedown', coordinate)
  startDraw(coordinate)
})

canvas.addEventListener('mouseup', () => {
  socket.emit('mouseup')
  endDraw()
})

const beginDraw = (e) => {
  if (!isPainting) return
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  draw(e)
}

const draw = (e) => {
  const coordinate = { x: e.clientX - canvasOffSetX, y: e.clientY }
  socket.emit('draw', coordinate)
  drawing(coordinate)
}

canvas.addEventListener('mousemove', beginDraw)

// Socket
socket.on('onmousedown', (coordinate) => startDraw(coordinate))

socket.on('onmouseup', () => endDraw())

socket.on('ondraw', (coordinate) => drawing(coordinate))

socket.on('onclear', (data) => clearDrawing(data))

// Canvas Action
function startDraw ({ x, y }) {
  console.log(x,y)
  isPainting = true
  startX = x
  startY = y
}

function endDraw () {
  isPainting = false
  ctx.stroke()
  ctx.beginPath()
}

function drawing ({ x, y }) {
  ctx.lineTo(x, y);
  ctx.stroke();
}

function clearDrawing (data) {
  ctx.clearRect(0, 0, data.width, data.height)
} 