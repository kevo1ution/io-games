import { io } from 'socket.io-client'

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

export function setNickname (name: string): void {
  socket.emit('setNickname', name)
}
