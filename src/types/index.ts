// Player types
export interface Player {
  id: string
  username: string
  createdAt: Date
}

export interface PlayerStats {
  playerId: string
  totalMinigameWins: number
  totalTimePlayedSeconds: number
  totalLobbyWins: number
}

// Lobby types
export interface LobbySettings {
  lives: number // 3-15
  isPublic: boolean
}

export interface Lobby {
  id: string
  lobbyCode: string
  name: string
  hostPlayerId: string
  createdAt: Date
  status: 'waiting' | 'in-progress' | 'finished'
  settings: LobbySettings
  playerCount?: number
  maxPlayers?: number
}

// Runtime lobby player state (held in memory)
export interface LobbyPlayer {
  lobbyId: string
  playerId: string
  username: string
  currentLives: number
  isEliminated: boolean
  joinedAt: Date
  isReady: boolean
  isConnected: boolean
  isSpectator: boolean
}

// Minigame types
export type MinigameType = 'passFail' | 'performance' | 'hybrid'

export interface MinigameConfig {
  id: string
  name: string
  description: string
  durationSeconds: number
  type: MinigameType
  config?: any // Game-specific configuration
}

export interface MinigameResult {
  playerId: string
  passed: boolean
  performanceMetric?: number
  completionTime?: number
  score?: number
}

export interface MinigameOutcome {
  minigameId: string
  results: MinigameResult[]
  playersLostLife: string[]
  playersEliminated: string[]
}

// WebSocket event types
export interface ServerToClientEvents {
  lobbyState: (state: LobbyState) => void
  playerJoined: (player: LobbyPlayer) => void
  playerLeft: (playerId: string) => void
  playerReady: (playerId: string, isReady: boolean) => void
  gameStarted: () => void
  minigameStart: (minigame: MinigameConfig) => void
  minigameUpdate: (data: any) => void
  minigameEnd: (outcome: MinigameOutcome) => void
  gameOver: (winnerId: string, winnerUsername: string) => void
  error: (message: string) => void
  kicked: () => void
}

export interface ClientToServerEvents {
  createLobby: (data: { name: string; settings: LobbySettings; playerId: string; username: string }, callback: (response: { success: boolean; lobbyCode?: string; error?: string }) => void) => void
  joinLobby: (data: { lobbyCode: string; playerId: string; username: string }, callback: (response: { success: boolean; error?: string }) => void) => void
  leaveLobby: () => void
  toggleReady: () => void
  startGame: () => void
  minigameInput: (data: any) => void
  kickPlayer: (playerId: string) => void
}

export interface LobbyState {
  lobby: Lobby
  players: LobbyPlayer[]
  currentMinigame?: MinigameConfig
  minigameStartTime?: number
  timeRemaining?: number
}

// Local storage types
export interface LocalPlayerData {
  playerId: string
  username: string
}
