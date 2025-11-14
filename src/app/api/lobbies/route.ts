import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Clean up old lobbies (older than 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    await prisma.lobby.deleteMany({
      where: {
        createdAt: {
          lt: twoHoursAgo
        }
      }
    })

    // Get active public lobbies
    const lobbies = await prisma.lobby.findMany({
      where: {
        isPublic: true,
        status: {
          in: ['waiting', 'in-progress']
        },
        createdAt: {
          gte: twoHoursAgo // Only show recent lobbies
        }
      },
      orderBy: [
        { status: 'asc' }, // waiting first
        { createdAt: 'desc' }
      ],
      take: 20
    })

    return NextResponse.json({ lobbies })
  } catch (error) {
    console.error('Error fetching lobbies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lobbies' },
      { status: 500 }
    )
  }
}
