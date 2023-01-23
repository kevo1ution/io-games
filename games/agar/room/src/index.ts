import { createServer } from 'http'
import { Server } from 'socket.io'
import { config, Player } from 'agar-shared'
import { createPlayer, updatePlayerPositionOnTick } from './player'

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

  socket.on('setDirection', (dirRadians?: number) => {
    console.log('set direction of player', { id, dirRadians })
    const player = players.get(id)
    if (player == null) {
      console.error('player is not spawned in yet!', { id, dirRadians })
    } else {
      player.direction = dirRadians
      players.set(id, player)
    }
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

function gameLoopTick (startTimeMs: number): void {
  const newStartTimeMs = Date.now()
  const dtMs = newStartTimeMs - startTimeMs
  console.log(dtMs)
  try {
    // update position of all players
    players.forEach((player, id) => {
      updatePlayerPositionOnTick(player, dtMs)
    })

    console.log(players)

    const newTickState = {
      serverTimeISO: new Date().toISOString(),
      players: Object.fromEntries(players)
    }
    io.emit('newTickState', newTickState)
  } catch (error) {
    console.error('unexpected error in the game loop!', error)
  }
  setTimeout(() => { gameLoopTick(newStartTimeMs) }, config.server.tickTimeoutMs)
}

httpServer.listen(3000)
gameLoopTick(Date.now())
