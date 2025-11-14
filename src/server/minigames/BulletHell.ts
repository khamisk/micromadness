import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

interface Bullet {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  type: 'horizontal' | 'vertical' | 'diagonal'
}

export class BulletHell extends BaseMinigame {
  readonly id = 'bullet-hell'
  readonly name = 'Bullet Hell Cursor Fight'
  readonly description = 'Dodge bullets with your cursor'
  readonly type: MinigameType = 'passFail'
  
  private bullets: Bullet[] = []

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Initialize all players as passed
    for (const player of players) {
      const result = this.results.get(player.playerId)
      if (result) result.passed = true
    }
    
    // Generate bullet patterns
    for (let i = 0; i < 30; i++) {
      const type = ['horizontal', 'vertical', 'diagonal'][Math.floor(Math.random() * 3)] as any
      
      let x = 0, y = 0, vx = 0, vy = 0
      
      if (type === 'horizontal') {
        x = Math.random() < 0.5 ? -10 : 110
        y = Math.random() * 100
        vx = x < 50 ? 3 : -3
        vy = 0
      } else if (type === 'vertical') {
        x = Math.random() * 100
        y = Math.random() < 0.5 ? -10 : 110
        vx = 0
        vy = y < 50 ? 3 : -3
      } else {
        x = Math.random() < 0.5 ? -10 : 110
        y = Math.random() < 0.5 ? -10 : 110
        vx = x < 50 ? 2 : -2
        vy = y < 50 ? 2 : -2
      }
      
      this.bullets.push({
        id: `bullet-${i}`,
        x, y, vx, vy,
        type,
      })
    }
  }

  protected getGameConfig() {
    return {
      bullets: this.bullets,
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
