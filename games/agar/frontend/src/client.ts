import { io } from 'socket.io-client'
import { Player } from 'agar-shared'

// TODO: hard coded for now for simplicity.
const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('socket successfully connected!')
})

socket.on('disconnect', (reason) => {
  console.warn('socket disconnect:', { reason })
})

socket.on('connect_error', (error) => {
  console.error('socket connect_error:', error)
})

socket.on('newTickState', ({ players }) => {
  const playersMap = new Map<string, Player>(Object.entries(players))
})

export function spawnPlayer (name: string): void {
  socket.emit('spawnPlayer', name)
}
