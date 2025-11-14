import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class ReverseAPM extends BaseMinigame {
  readonly id = 'reverse-apm'
  readonly name = 'Reverse APM Test'
  readonly description = 'Click buttons in descending order: 20 to 0'
  readonly type: MinigameType = 'hybrid'

  constructor(duration: number, players: any[]) {
    super(duration, players)
  }

  protected getGameConfig() {
    return {
      buttonCount: 21, // 20, 19, ..., 0
    }
  }

  handleInput(playerId: string, data: any) {
    const result = this.results.get(playerId)
    if (!result || result.passed) return

    const { action, timestamp } = data
    
    if (action === 'completed') {
      result.passed = true
      result.completionTime = timestamp
    }
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    const failed = results.filter(r => !r.passed).map(r => r.playerId)
    
    if (failed.length > 0) {
      return failed
    }

    // All passed, find slowest
    let slowestTime = -1
    const slowestPlayers: string[] = []

    for (const result of results) {
      if (result.completionTime !== undefined && result.passed) {
        if (result.completionTime > slowestTime) {
          slowestTime = result.completionTime
          slowestPlayers.length = 0
          slowestPlayers.push(result.playerId)
        } else if (result.completionTime === slowestTime) {
          slowestPlayers.push(result.playerId)
        }
      }
    }

    return slowestPlayers
  }
}
