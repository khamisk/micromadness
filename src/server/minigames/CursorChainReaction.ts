import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

interface Ball {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export class CursorChainReaction extends BaseMinigame {
  readonly id = 'cursor-chain-reaction'
  readonly name = 'Cursor Chain Reaction'
  readonly description = 'Avoid the bouncing balls that multiply'
  readonly type: MinigameType = 'passFail'
  
  private balls: Ball[] = []
  private explosionTime = 3000 // Explodes after 3 seconds

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Initialize all players as passed
    for (const player of players) {
      const result = this.results.get(player.playerId)
      if (result) result.passed = true
    }
    
    // Start with one ball
    this.balls.push({
      id: 'ball-0',
      x: 50,
      y: 50,
      vx: 2 + Math.random() * 2,
      vy: 2 + Math.random() * 2,
      radius: 30,
    })
  }

  protected getGameConfig() {
    return {
      initialBall: this.balls[0],
      explosionTime: this.explosionTime,
    }
  }

  handleInput(playerId: string, data: any) {
    const { action } = data
    
    if (action === 'hit') {
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
