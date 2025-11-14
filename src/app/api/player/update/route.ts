import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateUsername } from '@/utils/helpers'

export async function POST(request: NextRequest) {
  try {
    const { playerId, username } = await request.json()

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    const validation = validateUsername(username)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Upsert player
    const player = await prisma.player.upsert({
      where: { id: playerId },
      update: { username: username.trim() },
      create: {
        id: playerId,
        username: username.trim(),
      },
    })

    // Ensure player has stats record
    await prisma.playerStats.upsert({
      where: { playerId: player.id },
      update: {},
      create: {
        playerId: player.id,
      },
    })

    return NextResponse.json({ success: true, player })
  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    )
  }
}
