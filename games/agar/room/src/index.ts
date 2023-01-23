import { createServer } from 'http'
import { Server } from 'socket.io'
import { config, Player } from 'agar-shared'
import { createPlayer } from './player'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

const players = new Map<string, Player>()

io.on('connection', (socket) => {
  const id = socket.id
  console.log('socket connected', { id })
  socket.on('spawnPlayer', (name) => {
    console.log('spawning player', { id, name })
    if (players.has(id)) {
      console.error('player already spawned!', { id, name })
    } else {
      players.set(id, createPlayer(id, name))
    }
  })

  socket.on('setDirection', (dirRadians: number | undefined) => {

  })

  socket.on('disconnect', (reason) => {
    console.log('player disconnected', { reason, id })
    players.delete(id)
  })
})

// important events/operations to handle:
// player spawns
// player disconnects
// player eats player
// player eats blob
// player changes direction

function gameLoopTick (): void {
  try {
    // TODO: update positions of all players
    const newTickState = {
      serverTimeISO: new Date().toISOString(),
      players: Object.fromEntries(players)
    }
    io.emit('newTickState', newTickState)
  } catch (error) {
    console.error('unexpected error in the game loop!', error)
  }
  setTimeout(gameLoopTick, config.server.tickTimeoutMs)
}

httpServer.listen(3000)
gameLoopTick()
