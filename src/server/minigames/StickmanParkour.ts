import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class StickmanParkour extends BaseMinigame {
  readonly id = 'stickman-parkour'
  readonly name = 'Stickman Parkour'
  readonly description = 'Complete the obstacle course'
  readonly type: MinigameType = 'hybrid'
  
  private obstacles: any[]

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Generate simple obstacle course
    this.obstacles = [
      { type: 'gap', x: 200, width: 100 },
      { type: 'platform', x: 350, y: 150, width: 100 },
      { type: 'gap', x: 500, width: 120 },
      { type: 'spikes', x: 700, width: 80 },
      { type: 'goal', x: 900 },
    ]
  }

  protected getGameConfig() {
    return { obstacles: this.obstacles }
  }

  handleInput(playerId: string, data: any) {
    const result = this.results.get(playerId)
    if (!result) return

    const { action, timestamp } = data
    
    if (action === 'died') {
      result.passed = false
    } else if (action === 'completed') {
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
