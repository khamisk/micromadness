import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Delete lobbies older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    
    const result = await prisma.lobby.deleteMany({
      where: {
        createdAt: {
          lt: oneHourAgo
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      deleted: result.count,
      message: `Deleted ${result.count} old lobbies`
    })
  } catch (error) {
    console.error('Error cleaning up lobbies:', error)
    return NextResponse.json(
      { error: 'Failed to clean up lobbies' },
      { status: 500 }
    )
  }
}
