import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all player stats
export async function GET() {
  try {
    const stats = await prisma.playerStats.findMany({
      include: {
        player: {
          select: {
            username: true,
            createdAt: true,
          },
        },
      },
      orderBy: { player: { createdAt: 'desc' } },
    })

    const formattedStats = stats.map((stat: any) => ({
      playerId: stat.playerId,
      username: stat.player.username,
      gamesPlayed: stat.gamesPlayed,
      gamesWon: stat.gamesWon,
      minigamesWon: stat.minigamesWon,
      totalLivesLost: stat.totalLivesLost,
      createdAt: stat.player.createdAt.toISOString(),
    }))

    return NextResponse.json({ stats: formattedStats })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

// PUT - Update player stats
export async function PUT(request: NextRequest) {
  try {
    const { playerId, gamesPlayed, gamesWon, minigamesWon, totalLivesLost } = await request.json()

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID required' },
        { status: 400 }
      )
    }

    await prisma.playerStats.update({
      where: { playerId },
      data: {
        gamesPlayed: gamesPlayed ?? undefined,
        gamesWon: gamesWon ?? undefined,
        minigamesWon: minigamesWon ?? undefined,
        totalLivesLost: totalLivesLost ?? undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    )
  }
}

// DELETE - Delete player stats
export async function DELETE(request: NextRequest) {
  try {
    const { playerId } = await request.json()

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID required' },
        { status: 400 }
      )
    }

    await prisma.playerStats.delete({
      where: { playerId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting stats:', error)
    return NextResponse.json(
      { error: 'Failed to delete stats' },
      { status: 500 }
    )
  }
}
