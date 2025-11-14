import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const players = await prisma.player.findMany({
      include: { stats: true },
      orderBy: {
        stats: {
          totalLobbyWins: 'desc',
        },
      },
      take: limit,
    })

    return NextResponse.json({ players })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
