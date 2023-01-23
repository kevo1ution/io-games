import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = (): {
  socket?: Socket
  spawnPlayer: (name: string) => void
} => {
  const [socket, setSocket] = useState<Socket | undefined>()
  useEffect(() => {
    // TODO: hard coded URL for simplicity; it should be dynamic based on dedicated game server
    const newSocket = io('http://localhost:3000')

    newSocket.on('connect', () => {
      console.log('socket connected', { id: newSocket.id })
    })

    newSocket.on('disconnect', (reason) => {
      console.warn('socket disconnect:', { reason })
    })

    newSocket.on('connect_error', (error) => {
      console.error('socket connect_error:', error)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return {
    socket,
    spawnPlayer: (name: string): void => {
      if (socket == null) {
        throw new Error('socket is not defined!')
      } else {
        socket.emit('spawnPlayer', name)
      }
    }
  }
}
