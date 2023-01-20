import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  // options
})

io.on('connection', (socket) => {
  console.log('socket connected', socket.id)
  socket.on('setNickname', (name) => {
    console.log('setting nickname', { id: socket.id, name })
    socket.data.nickname = name
  })
  socket.on('move', () => {

  })
})

httpServer.listen(3000)
