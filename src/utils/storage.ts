import { LocalPlayerData } from '@/types'

const STORAGE_KEY = 'micromadness_player'

export function getLocalPlayer(): LocalPlayerData | null {
  if (typeof window === 'undefined') return null
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

export function setLocalPlayer(data: LocalPlayerData): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

export function clearLocalPlayer(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}
