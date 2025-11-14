import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const lobbies = await prisma.lobby.findMany({
      where: {
        isPublic: true,
        status: {
          in: ['waiting', 'in-progress']
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
