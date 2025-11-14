'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayer } from '@/contexts/PlayerContext'
import { formatTime } from '@/utils/helpers'
import { pageview } from '@/lib/analytics'

interface PlayerWithStats {
  id: string
  username: string
  stats: {
    totalMinigameWins: number
    totalTimePlayedSeconds: number
    totalLobbyWins: number
  } | null
}

export default function StatsPage() {
  const router = useRouter()
  const { player } = usePlayer()
  
  const [playerStats, setPlayerStats] = useState<PlayerWithStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<PlayerWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    pageview('/stats')
    
    if (player?.playerId) {
      fetchStats()
      fetchLeaderboard()
    }
  }, [player])

  const fetchStats = async () => {
    if (!player?.playerId) return

    try {
      const response = await fetch(`/api/player/stats?playerId=${player.playerId}`)
      const data = await response.json()
      
      if (data.player) {
        setPlayerStats(data.player)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard?limit=10')
      const data = await response.json()
      
      if (data.players) {
        setLeaderboard(data.players)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card max-w-md w-full text-center">
          <div className="animate-pulse">Loading stats...</div>
        </div>
      </main>
    )
  }

  const stats = playerStats?.stats || {
    totalMinigameWins: 0,
    totalTimePlayedSeconds: 0,
    totalLobbyWins: 0,
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="game-card mb-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 dark:text-gray-400 hover:text-primary"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold ml-4 text-primary">Your Stats</h1>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-2">{player?.username}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Player ID: {player?.playerId.substring(0, 8)}...
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-300">
                {stats.totalLobbyWins}
              </div>
              <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                Lobby Wins
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-300">
                {stats.totalMinigameWins}
              </div>
              <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                Minigame Wins
              </div>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-300">
                {formatTime(stats.totalTimePlayedSeconds)}
              </div>
              <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                Time Played
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="game-card">
          <h2 className="text-2xl font-bold mb-4">🏆 Top Players</h2>
          
          {leaderboard.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No players on the leaderboard yet. Be the first!
            </p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((p, index) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-4 rounded ${
                    p.id === player?.playerId
                      ? 'bg-primary bg-opacity-20 border-2 border-primary'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold w-8 text-center">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div>
                      <div className="font-bold">{p.username}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(p.stats?.totalTimePlayedSeconds || 0)} played
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {p.stats?.totalLobbyWins || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      wins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
