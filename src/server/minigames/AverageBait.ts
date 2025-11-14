import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class AverageBait extends BaseMinigame {
  readonly id = 'average-bait'
  readonly name = 'Average Bait'
  readonly description = 'Choose a number - furthest from average loses'
  readonly type: MinigameType = 'performance'
  
  private choices: Map<string, number> = new Map()

  constructor(duration: number, players: any[]) {
    super(duration, players)
  }

  protected getGameConfig() {
    return {
      minNumber: 1,
      maxNumber: 100,
    }
  }

  handleInput(playerId: string, data: any) {
    const { number } = data
    
    if (number >= 1 && number <= 100) {
      this.choices.set(playerId, number)
    }
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    // Calculate average
    let sum = 0
    let count = 0
    
    for (const choice of this.choices.values()) {
      sum += choice
      count++
    }
    
    const average = count > 0 ? sum / count : 50
    
    // Calculate distances and find furthest
    let maxDistance = -1
    const furthestPlayers: string[] = []
    
    for (const player of this.players) {
      const choice = this.choices.get(player.playerId) || 50
      const distance = Math.abs(choice - average)
      
      const result = this.results.get(player.playerId)
      if (result) {
        result.performanceMetric = distance
        result.passed = true
      }
      
      if (distance > maxDistance) {
        maxDistance = distance
        furthestPlayers.length = 0
        furthestPlayers.push(player.playerId)
      } else if (distance === maxDistance) {
        furthestPlayers.push(player.playerId)
      }
    }
    
    return furthestPlayers
  }
}
