'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getLocalPlayer, setLocalPlayer } from '@/utils/storage'
import { LocalPlayerData } from '@/types'

interface PlayerContextType {
  player: LocalPlayerData | null
  setPlayer: (player: LocalPlayerData) => void
  updateUsername: (username: string) => void
  isInitialized: boolean
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayerState] = useState<LocalPlayerData | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize player from localStorage
    const localPlayer = getLocalPlayer()
    if (localPlayer) {
      setPlayerState(localPlayer)
    } else {
      // Generate new player ID (username will be set by user)
      const newPlayer: LocalPlayerData = {
        playerId: uuidv4(),
        username: '',
      }
      setPlayerState(newPlayer)
    }
    setIsInitialized(true)
  }, [])

  const setPlayer = (newPlayer: LocalPlayerData) => {
    setPlayerState(newPlayer)
    setLocalPlayer(newPlayer)
  }

  const updateUsername = (username: string) => {
    if (player) {
      const updated = { ...player, username }
      setPlayer(updated)
    }
  }

  return (
    <PlayerContext.Provider value={{ player, setPlayer, updateUsername, isInitialized }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
