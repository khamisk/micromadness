import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all lobbies
export async function GET() {
  try {
    const lobbies = await prisma.lobby.findMany({
      orderBy: { createdAt: 'desc' },
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

// DELETE - Delete a specific lobby
export async function DELETE(request: NextRequest) {
  try {
    const { lobbyId } = await request.json()

    if (!lobbyId) {
      return NextResponse.json(
        { error: 'Lobby ID required' },
        { status: 400 }
      )
    }

    await prisma.lobby.delete({
      where: { id: lobbyId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lobby:', error)
    return NextResponse.json(
      { error: 'Failed to delete lobby' },
      { status: 500 }
    )
  }
}
