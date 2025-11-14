'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePlayer } from '@/contexts/PlayerContext'
import { useSocket } from '@/hooks/useSocket'
import { LobbyState, MinigameConfig, MinigameOutcome } from '@/types'
import { trackGameStarted, trackGameFinished, trackMinigameStarted, trackMinigameFinished } from '@/lib/analytics'
import MinigameRenderer from '@/components/MinigameRenderer'
import { soundManager } from '@/utils/sounds'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const { player } = usePlayer()
  const { emit, on, off } = useSocket()
  
  const lobbyCode = params?.lobbyCode as string
  const [lobbyState, setLobbyState] = useState<LobbyState | null>(null)
  const [currentMinigame, setCurrentMinigame] = useState<MinigameConfig | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [lastOutcome, setLastOutcome] = useState<MinigameOutcome | null>(null)
  const [gameStartTime] = useState(Date.now())

  useEffect(() => {
    if (!player) return

    console.log('🎮 Game page loaded, setting up listeners')
    trackGameStarted(0) // Will update with actual player count

    const handleLobbyState = (state: LobbyState) => {
      console.log('📊 Game page received lobby state:', state)
      setLobbyState(state)
      if (state.timeRemaining !== undefined) {
        setTimeRemaining(state.timeRemaining)
      }
    }

    const handleMinigameStart = (minigame: MinigameConfig) => {
      console.log('🎯 Minigame started:', minigame.name)
      soundManager.playMinigameStart()
      setCurrentMinigame(minigame)
      setTimeRemaining(minigame.durationSeconds)
      setShowResults(false)
      setLastOutcome(null)
      trackMinigameStarted(minigame.name)
    }

    const handleMinigameEnd = (outcome: MinigameOutcome) => {
      console.log('✅ Minigame ended:', outcome)
      // Check if current player lost a life
      const lostLife = outcome.playersLostLife.includes(player?.playerId || '')
      if (lostLife) {
        soundManager.playLose()
      } else {
        soundManager.playWin()
      }
      setLastOutcome(outcome)
      setShowResults(true)
      if (currentMinigame) {
        trackMinigameFinished(currentMinigame.name)
      }
    }

    const handleGameOver = (winnerId: string, winnerUsername: string) => {
      console.log('🏆 Game over, winner:', winnerUsername)
      const duration = Math.floor((Date.now() - gameStartTime) / 1000)
      trackGameFinished(duration)
      
      // Show winner screen
      setTimeout(() => {
        router.push(`/lobby/${lobbyCode}?winner=${winnerUsername}`)
      }, 5000)
    }

    on('lobbyState', handleLobbyState)
    on('minigameStart', handleMinigameStart)
    on('minigameEnd', handleMinigameEnd)
    on('gameOver', handleGameOver)

    return () => {
      off('lobbyState', handleLobbyState)
      off('minigameStart', handleMinigameStart)
      off('minigameEnd', handleMinigameEnd)
      off('gameOver', handleGameOver)
    }
  }, [player, lobbyCode, router, on, off, emit, currentMinigame, gameStartTime])

  const handleMinigameInput = (data: any) => {
    emit('minigameInput', data)
  }

  if (!lobbyState) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading game...</div>
      </main>
    )
  }

  const { players } = lobbyState
  const currentPlayer = players.find(p => p.playerId === player?.playerId)
  const alivePlayers = players.filter(p => !p.isEliminated)

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Player List Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black bg-opacity-50 p-4 overflow-y-auto">
        <h2 className="text-white font-bold mb-4">Players ({alivePlayers.length})</h2>
        <div className="space-y-2">
          {players.map((p) => (
            <div
              key={p.playerId}
              className={`p-2 rounded ${
                p.isEliminated ? 'opacity-50 grayscale' : 'bg-white bg-opacity-20'
              } ${p.playerId === player?.playerId ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <div className="text-white font-medium text-sm truncate">
                {p.username}
              </div>
              <div className="flex mt-1">
                {Array.from({ length: p.currentLives }).map((_, i) => (
                  <span key={i} className="text-lg">❤️</span>
                ))}
                {p.isEliminated && (
                  <span className="text-xs text-gray-400 ml-2">ELIMINATED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="ml-64 p-8">
        {/* Timer and Title */}
        <div className="text-center mb-8">
          {currentMinigame && (
            <>
              <h1 className="text-4xl font-bold text-white mb-2">
                {currentMinigame.name}
              </h1>
              <p className="text-xl text-white opacity-90 mb-4">
                {currentMinigame.description}
              </p>
              <div className="inline-block bg-white bg-opacity-20 px-8 py-4 rounded-lg">
                <div className="text-5xl font-bold text-white">
                  {timeRemaining}
                </div>
                <div className="text-sm text-white opacity-75">seconds remaining</div>
              </div>
            </>
          )}
        </div>

        {/* Minigame Content */}
        <div className="max-w-4xl mx-auto">
          {currentMinigame && !showResults && (
            <MinigameRenderer
              minigame={currentMinigame}
              onInput={handleMinigameInput}
              isEliminated={currentPlayer?.isEliminated || false}
            />
          )}

          {/* Results Screen */}
          {showResults && lastOutcome && (
            <div className="bg-white bg-opacity-90 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-6">Round Results</h2>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {lastOutcome.playersLostLife.length > 0 && (
                  <div className="bg-red-100 p-4 rounded">
                    <h3 className="font-bold text-red-800 mb-2">Lost a Life:</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {lastOutcome.playersLostLife.map((playerId) => {
                        const p = players.find(pl => pl.playerId === playerId)
                        return (
                          <span key={playerId} className="bg-red-200 px-3 py-1 rounded">
                            {p?.username}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                {lastOutcome.playersEliminated.length > 0 && (
                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-bold text-gray-800 mb-2">Eliminated:</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {lastOutcome.playersEliminated.map((playerId) => {
                        const p = players.find(pl => pl.playerId === playerId)
                        return (
                          <span key={playerId} className="bg-gray-300 px-3 py-1 rounded">
                            {p?.username} 💀
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-gray-600">
                Next round starting soon...
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
