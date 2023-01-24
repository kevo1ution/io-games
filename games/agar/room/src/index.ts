import { createServer } from 'http'
import { Server } from 'socket.io'
import { config, Player, Dot } from 'agar-shared'
import {
  createPlayer, updatePlayerPositionOnTick, updatePlayerScoreDecayOnTick
} from './player'
import { startSpawningDots } from './map'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

const players = new Map<string, Player>()
const dots = new Map<string, Dot>()

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

function gameLoopTick (startTimeMs: number): void {
  const newStartTimeMs = Date.now()
  const dtMs = newStartTimeMs - startTimeMs
  try {
    // update position of all players
    players.forEach((player, id) => {
      updatePlayerPositionOnTick(player, dtMs)
      updatePlayerScoreDecayOnTick(player, dtMs)
    })

    // TODO: check if any players have eaten any dots

    // TODO: check if any players have eaten any other players

    const newTickState = {
      serverTimeISO: new Date().toISOString(),
      players: Object.fromEntries(players),
      dots: Object.fromEntries(dots)
    }
    io.emit('newTickState', newTickState)
  } catch (error) {
    console.error('unexpected error in the game loop!', error)
  }
  setTimeout(() => { gameLoopTick(newStartTimeMs) }, config.server.tickTimeoutMs)
}

httpServer.listen(3000)
gameLoopTick(Date.now())
startSpawningDots(dots)
