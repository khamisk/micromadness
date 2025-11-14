import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { playerId, minigameWins, lobbyWin, livesLost, gameCompleted } = await request.json()

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    // Update player stats
    const updateData: any = {}
    
    if (minigameWins) {
      updateData.minigamesWon = { increment: minigameWins }
      updateData.totalMinigameWins = { increment: minigameWins }
    }
    
    if (lobbyWin !== undefined) {
      updateData.totalLobbyWins = { increment: lobbyWin ? 1 : 0 }
      if (lobbyWin) {
        updateData.gamesWon = { increment: 1 }
      }
    }
    
    if (livesLost) {
      updateData.totalLivesLost = { increment: livesLost }
    }
    
    if (gameCompleted) {
      updateData.gamesPlayed = { increment: 1 }
    }

    const stats = await prisma.playerStats.upsert({
      where: { playerId },
      update: updateData,
      create: {
        playerId,
        minigamesWon: minigameWins || 0,
        totalMinigameWins: minigameWins || 0,
        totalLobbyWins: lobbyWin ? 1 : 0,
        gamesWon: lobbyWin ? 1 : 0,
        totalLivesLost: livesLost || 0,
        gamesPlayed: gameCompleted ? 1 : 0,
        totalTimePlayedSeconds: 0,
      },
    })

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    )
  }
}
