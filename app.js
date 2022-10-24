const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

let connections = []

io.on('connection', (socket) => {
  connections.push(socket)

  // socket.on('updatestroke', (data) => {
  //   connections.forEach((con) => {
  //     if (con.id !== socket.id) {
  //       con.emit('onupdatestroke', data)
  //     }
  //   })
  // })

  // socket.on('updateline', (data) => {
  //   connections.forEach((con) => {
  //     if (con.id !== socket.id) {
  //       con.emit('onupdatelinewidth', data)
  //     }
  //   })
  // })

  socket.on('mousedown', (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit('onmousedown', data)
      }
    })
  })

  socket.on('mouseup', () => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit('onmouseup')
      }
    })
  })

  socket.on('draw', (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit('ondraw', data)
      }
    })
  })

  socket.on('clear', (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit('onclear', data)
      }
    })
  })

  socket.on('disconnect', (reason) => {
    console.log(reason)
    connections = connections.filter(item => item.id !== socket.id)
  })
})

app.use(express.static("public"))

server.listen(3000, () => {
  console.log('listening to port 3000')
})