'use client'

import { ReactNode } from 'react'
import { PlayerProvider } from '@/contexts/PlayerContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PlayerProvider>
      {children}
    </PlayerProvider>
  )
}
