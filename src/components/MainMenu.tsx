'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayer } from '@/contexts/PlayerContext'
import { validateUsername } from '@/utils/helpers'
import { pageview } from '@/lib/analytics'
import { useSocket } from '@/hooks/useSocket'
import { LobbySettings } from '@/types'
import { trackLobbyCreated } from '@/lib/analytics'

interface LobbyListItem {
  id: string
  lobbyCode: string
  name: string
  status: string
  playerCount: number
  maxPlayers: number
  settings: string
}

export default function MainMenu() {
  const router = useRouter()
  const { player, updateUsername, isInitialized } = usePlayer()
  const { emit, isConnected } = useSocket()
  
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [lobbies, setLobbies] = useState<LobbyListItem[]>([])
  const [isLoadingLobbies, setIsLoadingLobbies] = useState(true)
  
  // Create lobby form
  const [lobbyName, setLobbyName] = useState('')
  const [lives, setLives] = useState(5)
  const [isPublic, setIsPublic] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    if (isInitialized) {
      pageview('/')
      if (player?.username) {
        setUsername(player.username)
        setLobbyName(`${player.username}'s Lobby`)
      } else {
        setShowUsernamePrompt(true)
      }
    }
  }, [isInitialized, player])

  useEffect(() => {
    if (player?.username) {
      fetchLobbies()
      const interval = setInterval(fetchLobbies, 3000) // Refresh every 3 seconds
      return () => clearInterval(interval)
    }
  }, [player])

  const fetchLobbies = async () => {
    try {
      const response = await fetch('/api/lobbies')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      if (data.lobbies) {
        console.log('Fetched lobbies:', data.lobbies.length)
        setLobbies(data.lobbies)
      }
    } catch (error) {
      console.error('Error fetching lobbies:', error)
    } finally {
      setIsLoadingLobbies(false)
    }
  }

  const handleUsernameSubmit = async () => {
    const validation = validateUsername(username)
    if (!validation.valid) {
      setUsernameError(validation.error || '')
      return
    }

    // Update username in DB
    try {
      const response = await fetch('/api/player/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: player?.playerId,
          username: username.trim(),
        }),
      })

      if (response.ok) {
        updateUsername(username.trim())
        setShowUsernamePrompt(false)
        setUsernameError('')
        setLobbyName(`${username.trim()}'s Lobby`)
      } else {
        const data = await response.json()
        setUsernameError(data.error || 'Failed to update username')
      }
    } catch (error) {
      console.error('Error updating username:', error)
      setUsernameError('Failed to update username')
    }
  }

  const handleCreateLobby = async () => {
    if (!player || !isConnected) {
      setCreateError('Not connected to server')
      return
    }

    setIsCreating(true)
    setCreateError('')

    const settings: LobbySettings = {
      lives,
      isPublic,
    }

    emit('createLobby', {
      name: lobbyName,
      settings,
      playerId: player.playerId,
      username: player.username,
    }, (response: { success: boolean; lobbyCode?: string; error?: string }) => {
      setIsCreating(false)
      
      if (response.success && response.lobbyCode) {
        trackLobbyCreated()
        setShowCreateModal(false)
        router.push(`/lobby/${response.lobbyCode}`)
      } else {
        setCreateError(response.error || 'Failed to create lobby')
      }
    })
  }

  const handleJoinLobby = (lobbyCode: string) => {
    if (!player || !isConnected) return

    emit('joinLobby', {
      lobbyCode,
      playerId: player.playerId,
      username: player.username,
    }, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        router.push(`/lobby/${lobbyCode}`)
      } else {
        alert(response.error || 'Failed to join lobby')
      }
    })
  }

  const parseLobbySettings = (settingsJson: string) => {
    try {
      return JSON.parse(settingsJson)
    } catch {
      return { lives: 5 }
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="game-card max-w-md w-full text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (showUsernamePrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              MicroMadness
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose your username to begin
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username (3-16 characters)
              </label>
              <input
                id="username"
                type="text"
                className="input-field text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                placeholder="Enter username..."
                maxLength={16}
                autoFocus
              />
              {usernameError && (
                <p className="text-danger text-sm mt-1">{usernameError}</p>
              )}
            </div>
            
            <button
              onClick={handleUsernameSubmit}
              className="btn-primary w-full py-3 text-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MicroMadness
              </h1>
              <span className="text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full">
                19 Minigames
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Playing as</p>
                <p className="font-bold text-lg">{username}</p>
              </div>
              <button
                onClick={() => setShowUsernamePrompt(true)}
                className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Change
              </button>
              <button
                onClick={() => router.push('/stats')}
                className="btn-secondary"
              >
                📊 Stats
              </button>
              <button
                onClick={() => router.push('/how-to-play')}
                className="btn-secondary"
              >
                ❓ How to Play
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="btn-secondary text-xs"
                title="Admin Panel"
              >
                🔧
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Create Lobby Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!isConnected}
            className="btn-primary text-xl py-4 px-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            ➕ Create New Lobby
          </button>
          {!isConnected && (
            <div className="mt-2">
              <p className="text-yellow-300 text-sm">Connecting to server...</p>
              <p className="text-yellow-200 text-xs">If this persists, try refreshing the page</p>
            </div>
          )}
        </div>

        {/* Public Lobbies */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🌐 Public Lobbies</h2>
            <button
              onClick={fetchLobbies}
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              🔄 Refresh
            </button>
          </div>

          {isLoadingLobbies ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin text-4xl mb-2">⚙️</div>
              <p>Loading lobbies...</p>
            </div>
          ) : lobbies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-6xl mb-4">🎮</p>
              <p className="text-xl">No public lobbies available</p>
              <p className="text-sm mt-2">Be the first to create one!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lobbies.map((lobby) => {
                const settings = parseLobbySettings(lobby.settings)
                const isInProgress = lobby.status === 'in-progress'
                
                return (
                  <div
                    key={lobby.id}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg truncate">{lobby.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                          {lobby.lobbyCode}
                        </p>
                      </div>
                      {isInProgress && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Live
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Players:</span>
                        <span className="font-bold">{lobby.playerCount} / {lobby.maxPlayers}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Lives:</span>
                        <span className="font-bold">
                          {Array.from({ length: settings.lives || 5 }).map((_, i) => (
                            <span key={i}>❤️</span>
                          ))}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleJoinLobby(lobby.lobbyCode)}
                      disabled={!isConnected}
                      className={`w-full py-2 px-4 rounded-lg font-bold transition-all ${
                        isInProgress
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      } disabled:opacity-50`}
                    >
                      {isInProgress ? '👁️ Spectate' : '▶️ Join'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Lobby Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create Lobby</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Lobby Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={lobbyName}
                  onChange={(e) => setLobbyName(e.target.value)}
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lives: {lives}
                </label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={lives}
                  onChange={(e) => setLives(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3</span>
                  <span>15</span>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2 w-4 h-4"
                />
                <label htmlFor="isPublic" className="text-sm">
                  Public Lobby (visible to everyone)
                </label>
              </div>

              {createError && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                  {createError}
                </div>
              )}

              <button
                onClick={handleCreateLobby}
                disabled={isCreating || !isConnected || !lobbyName.trim()}
                className="btn-primary w-full py-3 text-lg"
              >
                {isCreating ? 'Creating...' : 'Create Lobby'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
