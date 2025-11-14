'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePlayer } from '@/contexts/PlayerContext'
import { useSocket } from '@/hooks/useSocket'
import { LobbyState } from '@/types'
import { soundManager } from '@/utils/sounds'

export default function LobbyPage() {
  const params = useParams()
  const router = useRouter()
  const { player, updateUsername } = usePlayer()
  const { emit, on, off, isConnected } = useSocket()
  
  const lobbyCode = params?.lobbyCode as string
  const [lobbyState, setLobbyState] = useState<LobbyState | null>(null)
  const [error, setError] = useState('')
  const [hasJoined, setHasJoined] = useState(false)
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [usernameError, setUsernameError] = useState('')

  // Set up socket event listeners
  useEffect(() => {
    if (!isConnected || !player) return

    // Listen for lobby updates
    const handleLobbyState = (state: LobbyState) => {
      console.log('📊 Received lobby state:', state)
      const oldPlayerCount = lobbyState?.players.length || 0
      const newPlayerCount = state.players.length
      
      // Play sounds for player join/leave
      if (newPlayerCount > oldPlayerCount) {
        soundManager.playLobbyJoin()
      } else if (newPlayerCount < oldPlayerCount) {
        soundManager.playLobbyLeave()
      }
      
      setLobbyState(state)
    }

    const handleGameStarted = () => {
      console.log('🎮 Game started, redirecting...')
      soundManager.playCountdown()
      router.push(`/game/${lobbyCode}`)
    }

    const handleError = (message: string) => {
      console.error('❌ Lobby error:', message)
      setError(message)
    }

    const handleKicked = () => {
      alert('You have been kicked from the lobby')
      router.push('/')
    }

    on('lobbyState', handleLobbyState)
    on('gameStarted', handleGameStarted)
    on('error', handleError)
    on('kicked', handleKicked)

    return () => {
      off('lobbyState', handleLobbyState)
      off('gameStarted', handleGameStarted)
      off('error', handleError)
      off('kicked', handleKicked)
    }
  }, [isConnected, player, lobbyCode, router, on, off])

  // Check if username exists on mount
  useEffect(() => {
    if (!player?.username || player.username.trim() === '') {
      setShowUsernamePrompt(true)
    }
  }, [player])

  // Join lobby once when connected
  useEffect(() => {
    if (!isConnected || !player || !player.username || hasJoined) return

    console.log('🎮 Attempting to join lobby:', lobbyCode)
    setHasJoined(true)

    // Auto-join lobby
    emit('joinLobby', {
      lobbyCode,
      playerId: player.playerId,
      username: player.username,
    }, (response: { success: boolean; error?: string }) => {
      console.log('📡 Join lobby response:', response)
      if (!response.success) {
        setError(response.error || 'Failed to join lobby')
        setTimeout(() => router.push('/'), 2000)
      }
    })

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (!lobbyState) {
        console.error('⏱️ Lobby load timeout')
        setError('Connection timeout - lobby may not exist')
        setTimeout(() => router.push('/'), 2000)
      }
    }, 15000)

    return () => {
      clearTimeout(timeout)
    }
  }, [isConnected, player, hasJoined, lobbyCode, emit, router, lobbyState])

  const handleToggleReady = () => {
    soundManager.playReady()
    emit('toggleReady')
  }

  const handleStartGame = () => {
    soundManager.playClick()
    emit('startGame')
  }

  const handleKickPlayer = (playerId: string) => {
    if (confirm('Are you sure you want to kick this player?')) {
      emit('kickPlayer', playerId)
    }
  }

  const handleLeaveLobby = () => {
    emit('leaveLobby')
    router.push('/')
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lobbyCode)
    alert('Lobby code copied!')
  }

  const handleUsernameSubmit = async () => {
    if (!usernameInput || usernameInput.trim().length < 2) {
      setUsernameError('Username must be at least 2 characters')
      return
    }
    if (usernameInput.length > 16) {
      setUsernameError('Username must be 16 characters or less')
      return
    }
    
    await updateUsername(usernameInput.trim())
    setShowUsernamePrompt(false)
    setUsernameError('')
  }

  // Show username prompt if no username
  if (showUsernamePrompt) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Enter Your Name</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You need a username to join this lobby
          </p>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                className="input-field w-full"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                placeholder="Enter username..."
                maxLength={16}
                autoFocus
              />
              {usernameError && (
                <p className="text-red-500 text-sm mt-1">{usernameError}</p>
              )}
            </div>
            
            <button
              onClick={handleUsernameSubmit}
              className="btn-primary w-full py-3 text-lg"
            >
              Join Lobby
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!lobbyState) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card max-w-md w-full text-center">
          {error ? (
            <div>
              <div className="text-red-500 mb-4">{error}</div>
              <div className="text-sm text-gray-500">Redirecting...</div>
            </div>
          ) : !isConnected ? (
            <div>
              <div className="animate-pulse mb-2">Connecting to server...</div>
              <div className="text-sm text-gray-500">Please wait</div>
            </div>
          ) : (
            <div>
              <div className="animate-pulse mb-2">Loading lobby...</div>
              <div className="text-sm text-gray-500">Joining {lobbyCode}</div>
            </div>
          )}
        </div>
      </main>
    )
  }

  const { lobby, players } = lobbyState
  const isHost = player?.playerId === lobby.hostPlayerId
  const currentPlayer = players.find(p => p.playerId === player?.playerId)
  const allReady = players.every(p => p.playerId === lobby.hostPlayerId || p.isReady)

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="game-card mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">{lobby.name}</h1>
            <button
              onClick={handleLeaveLobby}
              className="btn-danger"
            >
              Leave Lobby
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded">
              <span className="text-sm text-gray-600 dark:text-gray-400">Lobby Code:</span>
              <button
                onClick={handleCopyCode}
                className="ml-2 text-2xl font-bold hover:text-primary"
              >
                {lobbyCode}
              </button>
            </div>
            
            <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded">
              <span className="text-sm">
                {lobby.status === 'waiting' ? 'Waiting to start' : 'In Progress'}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Player List */}
          <div className="md:col-span-2 game-card">
            <h2 className="text-xl font-bold mb-4">
              Players ({players.length})
            </h2>
            
            <div className="space-y-2">
              {players.map((p) => (
                <div
                  key={p.playerId}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${p.isReady ? 'bg-success' : 'bg-gray-400'}`} />
                    <span className="font-medium">{p.username}</span>
                    {p.playerId === lobby.hostPlayerId && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                        HOST
                      </span>
                    )}
                    {!p.isConnected && (
                      <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                        Disconnected
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: p.currentLives }).map((_, i) => (
                        <span key={i} className="text-red-500">❤️</span>
                      ))}
                    </div>
                    
                    {isHost && p.playerId !== player?.playerId && (
                      <button
                        onClick={() => handleKickPlayer(p.playerId)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Kick
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Settings & Controls */}
          <div className="space-y-4">
            <div className="game-card">
              <h2 className="text-xl font-bold mb-4">Game Settings</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Lives:</span>
                  <span className="ml-2 font-bold">{lobby.settings.lives}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Visibility:</span>
                  <span className="ml-2 font-bold">{lobby.settings.isPublic ? '🌐 Public' : '🔒 Private'}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Players:</span>
                  <span className="ml-2 font-bold">{players.length} / 16</span>
                </div>
              </div>
            </div>

            {!isHost && (
              <div className="game-card">
                <button
                  onClick={handleToggleReady}
                  className={`w-full py-3 rounded font-bold transition-colors ${
                    currentPlayer?.isReady
                      ? 'bg-success text-white'
                      : 'bg-gray-300 dark:bg-gray-700 hover:bg-success hover:text-white'
                  }`}
                >
                  {currentPlayer?.isReady ? 'Ready!' : 'Not Ready'}
                </button>
              </div>
            )}

            {isHost && (
              <div className="game-card">
                {!allReady && players.length >= 2 && (
                  <div className="mb-3 text-sm text-warning">
                    ⚠️ Not all players are ready
                  </div>
                )}
                
                <button
                  onClick={handleStartGame}
                  disabled={players.length < 2}
                  className="btn-primary w-full py-3 text-lg"
                >
                  {players.length < 2 ? 'Need 2+ Players' : 'Start Game'}
                </button>
              </div>
            )}

            <div className="game-card text-sm">
              <h3 className="font-bold mb-2">How to Play</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Complete rapid minigames</li>
                <li>• Losers lose a life</li>
                <li>• Last player standing wins</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
