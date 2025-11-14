'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayer } from '@/contexts/PlayerContext'
import { useSocket } from '@/hooks/useSocket'
import { trackLobbyJoined } from '@/lib/analytics'

export default function JoinLobbyPage() {
  const router = useRouter()
  const { player } = usePlayer()
  const { emit, isConnected } = useSocket()
  
  const [lobbyCode, setLobbyCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = () => {
    if (!player || !isConnected) {
      setError('Not connected to server')
      return
    }

    if (!lobbyCode.trim()) {
      setError('Please enter a lobby code')
      return
    }

    setIsJoining(true)
    setError('')

    emit('joinLobby', {
      lobbyCode: lobbyCode.trim().toUpperCase(),
      playerId: player.playerId,
      username: player.username,
    }, (response: { success: boolean; error?: string }) => {
      setIsJoining(false)
      
      if (response.success) {
        trackLobbyJoined()
        router.push(`/lobby/${lobbyCode.trim().toUpperCase()}`)
      } else {
        setError(response.error || 'Failed to join lobby')
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="game-card max-w-md w-full">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold ml-4 text-primary">Join Lobby</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Lobby Code</label>
            <input
              type="text"
              className="input-field text-center text-2xl font-bold uppercase"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="XXXXXX"
              maxLength={6}
              autoFocus
            />
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
            onClick={handleJoin}
            disabled={isJoining || !isConnected || !lobbyCode.trim()}
            className="btn-primary w-full py-3 text-lg"
          >
            {isJoining ? 'Joining...' : 'Join Lobby'}
          </button>
        </div>
      </div>
    </main>
  )
}
