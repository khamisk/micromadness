'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayer } from '@/contexts/PlayerContext'
import { LobbySettings } from '@/types'
import { useSocket } from '@/hooks/useSocket'
import { trackLobbyCreated } from '@/lib/analytics'

export default function CreateLobbyPage() {
  const router = useRouter()
  const { player } = usePlayer()
  const { emit, on, isConnected } = useSocket()
  
  const [lobbyName, setLobbyName] = useState(`${player?.username}'s Lobby`)
  const [lives, setLives] = useState(5)
  const [isPublic, setIsPublic] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!player || !isConnected) {
      setError('Not connected to server')
      return
    }

    setIsCreating(true)
    setError('')

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
        router.push(`/lobby/${response.lobbyCode}`)
      } else {
        setError(response.error || 'Failed to create lobby')
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="game-card max-w-2xl w-full">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold ml-4 text-primary">Create Lobby</h1>
        </div>

        <div className="space-y-6">
          {/* Lobby Name */}
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

          {/* Lives */}
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

          {/* Public/Private */}
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

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!isConnected && (
            <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded">
              Connecting to server...
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={isCreating || !isConnected || !lobbyName.trim()}
            className="btn-primary w-full py-3 text-lg"
          >
            {isCreating ? 'Creating...' : 'Create Lobby'}
          </button>
        </div>
      </div>
    </main>
  )
}
