import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

interface FallingObject {
  id: string
  x: number
  y: number
  speed: number
}

export class StickmanDodgefall extends BaseMinigame {
  readonly id = 'stickman-dodgefall'
  readonly name = 'Stickman Dodgefall'
  readonly description = 'Dodge falling objects'
  readonly type: MinigameType = 'passFail'
  
  private playerPositions: Map<string, number> = new Map()
  private fallingObjects: FallingObject[] = []

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Initialize all players at center
    for (const player of players) {
      this.playerPositions.set(player.playerId, 50) // Center at 50%
      const result = this.results.get(player.playerId)
      if (result) result.passed = true
    }

    // Generate falling objects
    for (let i = 0; i < 20; i++) {
      this.fallingObjects.push({
        id: `obj-${i}`,
        x: Math.random() * 100,
        y: Math.random() * -200,
        speed: 2 + Math.random() * 3,
      })
    }
  }

  protected getGameConfig() {
    return {
      fallingObjects: this.fallingObjects,
      playerStartPositions: Object.fromEntries(this.playerPositions),
    }
  }

  handleInput(playerId: string, data: any) {
    const { position, action, x, survived } = data
    
    if (action === 'move') {
      const newPos = Math.max(0, Math.min(100, position || x || 50))
      this.playerPositions.set(playerId, newPos)
      // Broadcast positions to all players
      this.broadcastPositions()
    } else if (action === 'hit') {
      const result = this.results.get(playerId)
      if (result) {
        result.passed = false
      }
      this.broadcastPositions()
    }
  }

  private broadcastPositions() {
    const positions = Array.from(this.playerPositions.entries())
      .map(([id, x]) => {
        const player = this.players.find(p => p.playerId === id)
        const result = this.results.get(id)
        return {
          username: player?.username || 'Player',
          x,
          survived: result?.passed ?? true
        }
      })
    this.emitToAll('dodgefallPositions', positions)
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    return results.filter(r => !r.passed).map(r => r.playerId)
  }
}
