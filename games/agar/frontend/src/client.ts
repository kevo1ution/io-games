import { io } from 'socket.io-client'

// TODO: hard coded for now for simplicity.
const socket = io('http://localhost:3000')

export function setNickname (name: string): void {
  socket.emit('setNickname', name)
}
