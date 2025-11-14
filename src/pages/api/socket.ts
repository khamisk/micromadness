import { Server as NetServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/types/socket'
import { GameManager } from '@/server/GameManager'

const gameManagers = new Map<string, GameManager>()

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...')

    const httpServer: NetServer = res.socket.server as any
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? [process.env.RAILWAY_PUBLIC_DOMAIN || '*'] 
          : '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
    })

    io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id)

      socket.on('createLobby', async (data, callback) => {
        try {
          const { name, settings, playerId, username } = data
          const gameManager = new GameManager(io)
          const result = await gameManager.createLobby(name, settings, playerId, username)
          
          if (result.success && result.lobbyCode) {
            gameManagers.set(result.lobbyCode, gameManager)
            socket.join(result.lobbyCode)
            socket.data.lobbyCode = result.lobbyCode
            socket.data.playerId = playerId
            callback({ success: true, lobbyCode: result.lobbyCode })
          } else {
            callback({ success: false, error: result.error || 'Failed to create lobby' })
          }
        } catch (error) {
          console.error('Error creating lobby:', error)
          callback({ success: false, error: 'Internal server error' })
        }
      })

      socket.on('joinLobby', async (data, callback) => {
        try {
          const { lobbyCode, playerId, username } = data
          const gameManager = gameManagers.get(lobbyCode)
          
          if (!gameManager) {
            callback({ success: false, error: 'Lobby not found' })
            return
          }

          const result = await gameManager.joinLobby(lobbyCode, playerId, username, socket.id)
          
          if (result.success) {
            socket.join(lobbyCode)
            socket.data.lobbyCode = lobbyCode
            socket.data.playerId = playerId
            callback({ success: true })
          } else {
            callback({ success: false, error: result.error || 'Failed to join lobby' })
          }
        } catch (error) {
          console.error('Error joining lobby:', error)
          callback({ success: false, error: 'Internal server error' })
        }
      })

      socket.on('leaveLobby', () => {
        const lobbyCode = socket.data.lobbyCode
        const playerId = socket.data.playerId
        
        if (lobbyCode && playerId) {
          const gameManager = gameManagers.get(lobbyCode)
          if (gameManager) {
            gameManager.playerLeft(playerId)
            
            // Clean up empty lobbies
            if (gameManager.getPlayerCount() === 0) {
              gameManagers.delete(lobbyCode)
            }
          }
          
          socket.leave(lobbyCode)
          socket.data.lobbyCode = undefined
          socket.data.playerId = undefined
        }
      })

      socket.on('toggleReady', () => {
        const lobbyCode = socket.data.lobbyCode
        const playerId = socket.data.playerId
        
        if (lobbyCode && playerId) {
          const gameManager = gameManagers.get(lobbyCode)
          if (gameManager) {
            gameManager.togglePlayerReady(playerId)
          }
        }
      })

      socket.on('startGame', () => {
        const lobbyCode = socket.data.lobbyCode
        const playerId = socket.data.playerId
        
        if (lobbyCode && playerId) {
          const gameManager = gameManagers.get(lobbyCode)
          if (gameManager) {
            gameManager.startGame(playerId)
          }
        }
      })

      socket.on('minigameInput', (data) => {
        const lobbyCode = socket.data.lobbyCode
        const playerId = socket.data.playerId
        
        if (lobbyCode && playerId) {
          const gameManager = gameManagers.get(lobbyCode)
          if (gameManager) {
            gameManager.handleMinigameInput(playerId, data)
          }
        }
      })

      socket.on('kickPlayer', (kickPlayerId) => {
        const lobbyCode = socket.data.lobbyCode
        const playerId = socket.data.playerId
        
        if (lobbyCode && playerId) {
          const gameManager = gameManagers.get(lobbyCode)
          if (gameManager && gameManager.isHost(playerId)) {
            gameManager.kickPlayer(kickPlayerId)
          }
        }
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
        
        const lobbyCode = socket.data.lobbyCode
        const playerId = socket.data.playerId
        
        if (lobbyCode && playerId) {
          const gameManager = gameManagers.get(lobbyCode)
          if (gameManager) {
            gameManager.playerDisconnected(playerId)
            
            // Clean up empty lobbies
            if (gameManager.getPlayerCount() === 0) {
              gameManagers.delete(lobbyCode)
            }
          }
        }
      })
    })

    res.socket.server.io = io
  } else {
    console.log('Socket.IO server already initialized')
  }

  // Health check response
  if (req.method === 'GET') {
    res.status(200).json({ 
      status: 'ok', 
      connected: res.socket.server.io?.engine?.clientsCount || 0,
      lobbies: gameManagers.size 
    })
  } else {
    res.end()
  }
}
