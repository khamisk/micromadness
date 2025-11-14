import { Server as SocketIOServer } from 'socket.io'
import { prisma } from '@/lib/prisma'
import { 
  Lobby, 
  LobbyPlayer, 
  LobbySettings, 
  LobbyState,
  MinigameConfig,
  MinigameOutcome,
} from '@/types'
import { generateLobbyCode, getDurationRange, getRandomInRange } from '@/utils/helpers'
import { MinigameOrchestrator } from './MinigameOrchestrator'

export class GameManager {
  private io: SocketIOServer
  private lobby: Lobby | null = null
  private players: Map<string, LobbyPlayer> = new Map()
  private minigameOrchestrator: MinigameOrchestrator
  private gameStartTime: number | null = null
  private currentMinigame: MinigameConfig | null = null
  private minigameStartTime: number | null = null

  constructor(io: SocketIOServer) {
    this.io = io
    this.minigameOrchestrator = new MinigameOrchestrator(this)
  }

  async createLobby(
    name: string, 
    settings: LobbySettings, 
    hostPlayerId: string, 
    username: string
  ): Promise<{ success: boolean; lobbyCode?: string; error?: string }> {
    try {
      const lobbyCode = generateLobbyCode()

      // Create lobby in database
      const lobby = await prisma.lobby.create({
        data: {
          lobbyCode,
          name,
          hostPlayerId,
          status: 'waiting',
          settings: JSON.stringify(settings),
          password: settings.password || null,
          isPublic: settings.isPublic,
        },
      })

      this.lobby = {
        ...lobby,
        settings: settings,
        playerCount: 1,
        maxPlayers: 16,
        status: lobby.status as 'waiting' | 'in-progress' | 'finished',
      }

      // Add host as first player
      const hostPlayer: LobbyPlayer = {
        lobbyId: lobby.id,
        playerId: hostPlayerId,
        username,
        currentLives: settings.lives,
        isEliminated: false,
        joinedAt: new Date(),
        isReady: false,
        isConnected: true,
        isSpectator: false,
      }

      this.players.set(hostPlayerId, hostPlayer)
      await this.updateLobbyPlayerCount()
      this.broadcastLobbyState()

      return { success: true, lobbyCode }
    } catch (error) {
      console.error('Error creating lobby:', error)
      return { success: false, error: 'Failed to create lobby' }
    }
  }

  async joinLobby(
    lobbyCode: string, 
    playerId: string, 
    username: string,
    socketId: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.lobby || this.lobby.lobbyCode !== lobbyCode) {
      return { success: false, error: 'Lobby not found' }
    }

    // Check password if lobby has one (but skip for host)
    const isHost = this.lobby.hostPlayerId === playerId
    if (!isHost && this.lobby.settings.password && this.lobby.settings.password !== password) {
      return { success: false, error: 'Incorrect password' }
    }

    if (this.players.size >= 16) {
      return { success: false, error: 'Lobby is full' }
    }

    // Check if player already in lobby
    if (this.players.has(playerId)) {
      // Already in lobby - just reconnect, don't add again
      const player = this.players.get(playerId)!
      player.isConnected = true
      console.log(`Player ${playerId} reconnected to lobby ${lobbyCode}`)
      this.broadcastLobbyState(socketId)
      return { success: true }
    }

    const isGameInProgress = this.lobby.status !== 'waiting'
    
    const newPlayer: LobbyPlayer = {
      lobbyId: this.lobby.id,
      playerId,
      username,
      currentLives: this.lobby.settings.lives,
      isEliminated: false,
      joinedAt: new Date(),
      isReady: false,
      isConnected: true,
      isSpectator: isGameInProgress,
    }

    this.players.set(playerId, newPlayer)
    
    // Broadcast to all players
    this.io.to(lobbyCode).emit('playerJoined', newPlayer)
    await this.updateLobbyPlayerCount()
    this.broadcastLobbyState(socketId)

    return { success: true }
  }

  async playerLeft(playerId: string) {
    const player = this.players.get(playerId)
    if (!player || !this.lobby) return

    this.players.delete(playerId)
    
    // If no players left, delete lobby from database
    if (this.players.size === 0) {
      console.log(`Deleting empty lobby ${this.lobby.lobbyCode} from database`)
      try {
        await prisma.lobby.delete({
          where: { id: this.lobby.id }
        })
      } catch (error) {
        console.error('Error deleting empty lobby:', error)
      }
      return
    }
    
    // Transfer host if needed
    if (this.lobby.hostPlayerId === playerId && this.players.size > 0) {
      const newHost = Array.from(this.players.values())[0]
      this.lobby.hostPlayerId = newHost.playerId
    }

    this.io.to(this.lobby.lobbyCode).emit('playerLeft', playerId)
    await this.updateLobbyPlayerCount()
    this.broadcastLobbyState()
  }

  playerDisconnected(playerId: string) {
    const player = this.players.get(playerId)
    if (!player) return

    player.isConnected = false
    this.broadcastLobbyState()
  }

  isPlayerConnected(playerId: string): boolean {
    const player = this.players.get(playerId)
    return player ? player.isConnected : false
  }

  togglePlayerReady(playerId: string) {
    const player = this.players.get(playerId)
    if (!player || !this.lobby) return

    // Host doesn't need to ready
    if (playerId === this.lobby.hostPlayerId) return

    player.isReady = !player.isReady
    
    this.io.to(this.lobby.lobbyCode).emit('playerReady', playerId, player.isReady)
    this.broadcastLobbyState()
  }

  startGame(playerId: string) {
    if (!this.lobby || !this.isHost(playerId)) return

    // Check if at least 2 players
    if (this.players.size < 2) {
      this.io.to(this.lobby.lobbyCode).emit('error', 'Need at least 2 players to start')
      return
    }

    // Check if all non-host players are ready
    const allReady = Array.from(this.players.values()).every(
      p => p.playerId === this.lobby!.hostPlayerId || p.isReady
    )

    if (!allReady) {
      this.io.to(this.lobby.lobbyCode).emit('error', 'Not all players are ready')
      return
    }

    this.lobby.status = 'in-progress'
    this.gameStartTime = Date.now()
    
    // Update lobby status in database
    prisma.lobby.update({
      where: { id: this.lobby.id },
      data: { status: 'in-progress' }
    }).catch((err: any) => console.error('Error updating lobby status:', err))
    
    this.io.to(this.lobby.lobbyCode).emit('gameStarted')
    
    // Broadcast state immediately after game starts
    this.broadcastLobbyState()
    
    // Broadcast again after delays to ensure game page receives it
    setTimeout(() => {
      this.broadcastLobbyState()
    }, 500)
    setTimeout(() => {
      this.broadcastLobbyState()
    }, 1000)
    setTimeout(() => {
      this.broadcastLobbyState()
    }, 2000)

    // Start game loop
    this.runGameLoop()
  }

  private async runGameLoop() {
    if (!this.lobby) return

    while (this.getAlivePlayerCount() > 1) {
      // Broadcast lobby state before each minigame
      this.broadcastLobbyState()
      
      // Wait before starting next minigame
      await this.sleep(3000)

      // Select random minigame
      const minigame = this.minigameOrchestrator.selectRandomMinigame(this.lobby.settings)
      this.currentMinigame = minigame
      this.minigameStartTime = Date.now()

      // Broadcast minigame start
      this.io.to(this.lobby.lobbyCode).emit('minigameStart', minigame)
      
      // Broadcast lobby state again with minigame info
      this.broadcastLobbyState()

      // Wait for minigame duration
      await this.sleep(minigame.durationSeconds * 1000)

      // End minigame and get results
      const outcome = this.minigameOrchestrator.endMinigame()
      
      // Apply life changes
      this.applyMinigameOutcome(outcome)

      // Broadcast results
      this.io.to(this.lobby.lobbyCode).emit('minigameEnd', outcome)
      this.broadcastLobbyState()

      this.currentMinigame = null
      this.minigameStartTime = null
    }

    // Game over
    await this.sleep(2000)
    this.endGame()
  }

  private async applyMinigameOutcome(outcome: MinigameOutcome) {
    // Find winners (players who didn't lose a life)
    const allPlayerIds = Array.from(this.players.keys())
    const winners = allPlayerIds.filter(id => !outcome.playersLostLife.includes(id))
    
    // Update stats for winners
    for (const winnerId of winners) {
      await this.updatePlayerStats(winnerId, false, 0, 1, 0) // 1 minigame win, 0 lives lost
    }
    
    // Update stats and lives for losers
    for (const playerId of outcome.playersLostLife) {
      const player = this.players.get(playerId)
      if (player && !player.isEliminated) {
        player.currentLives--
        
        // Update stats for life lost
        await this.updatePlayerStats(playerId, false, 0, 0, 1)
        
        if (player.currentLives <= 0) {
          player.isEliminated = true
        }
      }
    }
  }

  private async endGame() {
    if (!this.lobby) return

    // Find winner
    const alivePlayers = Array.from(this.players.values()).filter(p => !p.isEliminated)
    const winner = alivePlayers[0]

    if (winner) {
      this.io.to(this.lobby.lobbyCode).emit('gameOver', {
        winnerId: winner.playerId,
        winnerUsername: winner.username
      })
    }

    // Update stats
    const gameEndTime = Date.now()
    const gameDuration = this.gameStartTime ? Math.floor((gameEndTime - this.gameStartTime) / 1000) : 0

    for (const player of this.players.values()) {
      const isWinner = player.playerId === winner?.playerId
      await this.updatePlayerStats(player.playerId, isWinner, gameDuration)
    }

    // Reset all players' lives and elimination status
    for (const player of this.players.values()) {
      player.currentLives = this.lobby.settings.lives
      player.isEliminated = false
      player.isReady = false
    }

    // Return to waiting status
    this.lobby.status = 'waiting'
    
    // Update lobby status in database
    prisma.lobby.update({
      where: { id: this.lobby.id },
      data: { status: 'waiting' }
    }).catch((err: any) => console.error('Error updating lobby status:', err))

    this.broadcastLobbyState()
    
    // Tell clients to return to lobby
    this.io.to(this.lobby.lobbyCode).emit('returnToLobby')
  }

  private async updatePlayerStats(
    playerId: string, 
    isLobbyWinner: boolean, 
    gameDuration: number,
    minigameWins: number = 0,
    livesLost: number = 0
  ) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/stats/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          minigameWins,
          lobbyWin: isLobbyWinner,
          livesLost,
          gameCompleted: isLobbyWinner !== undefined && gameDuration > 0,
        }),
      })
    } catch (error) {
      console.error('Error updating player stats:', error)
    }
  }

  handleMinigameInput(playerId: string, data: any) {
    this.minigameOrchestrator.handlePlayerInput(playerId, data)
  }

  kickPlayer(playerId: string) {
    if (!this.lobby) return

    const player = this.players.get(playerId)
    if (!player) return

    this.players.delete(playerId)
    
    // Notify kicked player
    const sockets = this.io.sockets.sockets
    for (const [socketId, socket] of sockets) {
      if ((socket as any).data.playerId === playerId) {
        socket.emit('kicked')
        socket.leave(this.lobby.lobbyCode)
      }
    }

    this.io.to(this.lobby.lobbyCode).emit('playerLeft', playerId)
    this.broadcastLobbyState()
  }

  isHost(playerId: string): boolean {
    return this.lobby?.hostPlayerId === playerId
  }

  getPlayerCount(): number {
    return this.players.size
  }

  private getAlivePlayerCount(): number {
    return Array.from(this.players.values()).filter(p => !p.isEliminated).length
  }

  getLobbyCode(): string | null {
    return this.lobby?.lobbyCode || null
  }

  getPlayers(): LobbyPlayer[] {
    return Array.from(this.players.values())
  }

  private broadcastLobbyState(includeSocketId?: string) {
    if (!this.lobby) return

    const state: LobbyState = {
      lobby: this.lobby,
      players: Array.from(this.players.values()),
      currentMinigame: this.currentMinigame || undefined,
      minigameStartTime: this.minigameStartTime || undefined,
      timeRemaining: this.currentMinigame && this.minigameStartTime 
        ? Math.max(0, this.currentMinigame.durationSeconds - Math.floor((Date.now() - this.minigameStartTime) / 1000))
        : undefined,
    }

    // Emit to room
    this.io.to(this.lobby.lobbyCode).emit('lobbyState', state)
    
    // Also emit directly to the socket that just joined (if provided)
    if (includeSocketId) {
      this.io.to(includeSocketId).emit('lobbyState', state)
    }
  }

  private async updateLobbyPlayerCount() {
    if (!this.lobby) return

    const playerCount = this.players.size
    
    try {
      await prisma.lobby.update({
        where: { id: this.lobby.id },
        data: { playerCount },
      })
      
      this.lobby.playerCount = playerCount
    } catch (error) {
      console.error('Error updating lobby player count:', error)
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
