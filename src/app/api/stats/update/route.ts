import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { playerId, minigameWins, lobbyWin, timePlayedSeconds } = await request.json()

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    // Update player stats
    const stats = await prisma.playerStats.upsert({
      where: { playerId },
      update: {
        totalMinigameWins: {
          increment: minigameWins || 0,
        },
        totalLobbyWins: {
          increment: lobbyWin ? 1 : 0,
        },
        totalTimePlayedSeconds: {
          increment: timePlayedSeconds || 0,
        },
      },
      create: {
        playerId,
        totalMinigameWins: minigameWins || 0,
        totalLobbyWins: lobbyWin ? 1 : 0,
        totalTimePlayedSeconds: timePlayedSeconds || 0,
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
