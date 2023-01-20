import { createServer } from 'http'
import { Server } from 'socket.io'
import { getRandomOpenPosition } from './map'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

const players = new Map()

// important events/operations to handle:
// player spawns
// player disconnects
// player eats player
// player eats blob
// player changes direction
// onTick
// - update positions of all players
// - send update in positions and timestep to clients

io.on('connection', (socket) => {
  console.log('socket connected', { id: socket.id })
  socket.on('setNickname', (name) => {
    console.log('setting nickname', { id: socket.id, name })
    socket.data.nickname = name

    const playerPos = getRandomOpenPosition()
  })
  socket.on('setDirection', (dirRadians: number | undefined) => {

  })
})

httpServer.listen(3000)
