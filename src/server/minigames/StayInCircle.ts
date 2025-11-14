import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class StayInCircle extends BaseMinigame {
  readonly id = 'stay-in-circle'
  readonly name = 'Stay in the Circle'
  readonly description = 'Keep your cursor inside the moving circle'
  readonly type: MinigameType = 'performance'
  
  private circlePositions: Array<{ x: number; y: number; timestamp: number }> = []

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Generate circle movement path
    const steps = duration * 2 // Update every 0.5 seconds
    for (let i = 0; i < steps; i++) {
      this.circlePositions.push({
        x: 30 + Math.random() * 40, // 30-70% of screen
        y: 30 + Math.random() * 40,
        timestamp: i * 500,
      })
    }
  }

  protected getGameConfig() {
    return {
      circlePositions: this.circlePositions,
      circleRadius: 50,
    }
  }

  handleInput(playerId: string, data: any) {
    const result = this.results.get(playerId)
    if (!result) return

    const { timeInside } = data
    result.performanceMetric = timeInside
    result.passed = true
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    let lowestTime = Infinity
    const worstPlayers: string[] = []

    for (const result of results) {
      const time = result.performanceMetric || 0
      if (time < lowestTime) {
        lowestTime = time
        worstPlayers.length = 0
        worstPlayers.push(result.playerId)
      } else if (time === lowestTime) {
        worstPlayers.push(result.playerId)
      }
    }

    return worstPlayers
  }
}
