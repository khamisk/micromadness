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
    const { position, action } = data
    
    if (action === 'move') {
      this.playerPositions.set(playerId, Math.max(0, Math.min(100, position)))
    } else if (action === 'hit') {
      const result = this.results.get(playerId)
      if (result) {
        result.passed = false
      }
    }
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    return results.filter(r => !r.passed).map(r => r.playerId)
  }
}
