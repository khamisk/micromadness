import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from '@/types'

export function useSocket() {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
      path: '/api/socket',
      addTrailingSlash: false,
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [])

  const emit = useCallback(<Event extends keyof ClientToServerEvents>(
    event: Event,
    ...args: Parameters<ClientToServerEvents[Event]>
  ) => {
    if (socketRef.current) {
      // @ts-ignore - Complex type inference
      socketRef.current.emit(event, ...args)
    }
  }, [])

  const on = useCallback(<Event extends keyof ServerToClientEvents>(
    event: Event,
    handler: ServerToClientEvents[Event]
  ) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler)
    }
  }, [])

  const off = useCallback(<Event extends keyof ServerToClientEvents>(
    event: Event,
    handler?: ServerToClientEvents[Event]
  ) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler)
    }
  }, [])

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
  }
}
