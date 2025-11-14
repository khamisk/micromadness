import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'
import { getRandomInRange } from '@/utils/helpers'

export class PerfectStopwatch extends BaseMinigame {
  readonly id = 'perfect-stopwatch'
  readonly name = 'Perfect Stopwatch'
  readonly description = 'Click at exactly the target time'
  readonly type: MinigameType = 'performance'
  
  private targetSeconds: number

  constructor(duration: number, players: any[]) {
    super(duration, players)
    this.targetSeconds = getRandomInRange(5, 10)
  }

  protected getGameConfig() {
    return { targetSeconds: this.targetSeconds }
  }

  handleInput(playerId: string, data: any) {
    const result = this.results.get(playerId)
    if (!result || result.completionTime !== undefined) return

    const { clickTime } = data
    const accuracy = Math.abs(clickTime - this.targetSeconds * 1000) / 1000
    
    result.performanceMetric = accuracy
    result.completionTime = clickTime
    result.passed = true
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    // Find worst accuracy (highest value)
    let worstAccuracy = -1
    const worstPlayers: string[] = []

    for (const result of results) {
      if (result.performanceMetric !== undefined) {
        if (result.performanceMetric > worstAccuracy) {
          worstAccuracy = result.performanceMetric
          worstPlayers.length = 0
          worstPlayers.push(result.playerId)
        } else if (result.performanceMetric === worstAccuracy) {
          worstPlayers.push(result.playerId)
        }
      }
    }

    return worstPlayers
  }
}
