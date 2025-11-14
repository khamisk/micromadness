import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { playerIds } = await request.json()

    if (!playerIds || !Array.isArray(playerIds)) {
      return NextResponse.json(
        { error: 'Player IDs array is required' },
        { status: 400 }
      )
    }

    // Fetch stats for all players
    const stats = await prisma.playerStats.findMany({
      where: {
        playerId: {
          in: playerIds,
        },
      },
    })

    // Create a map for easy lookup
    const statsMap: Record<string, any> = {}
    stats.forEach(stat => {
      statsMap[stat.playerId] = stat
    })

    return NextResponse.json({ success: true, stats: statsMap })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
