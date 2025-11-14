import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from '@/types'

export function useSocket() {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(socketUrl, {
      path: '/api/socket',
      addTrailingSlash: false,
      transports: ['polling', 'websocket'], // Try polling first
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 20000,
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id)
      setIsConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error.message, error)
      setIsConnected(false)
    })

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt #${attemptNumber}`)
    })

    socket.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect after all attempts')
    })

    console.log('🔌 Attempting to connect to:', socketUrl, 'with path:', '/api/socket')

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
      socketRef.current.on(event, handler as any)
    }
  }, [])

  const off = useCallback(<Event extends keyof ServerToClientEvents>(
    event: Event,
    handler?: ServerToClientEvents[Event]
  ) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler as any)
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
