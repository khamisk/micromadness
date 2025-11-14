import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class AdaptiveMashChallenge extends BaseMinigame {
  readonly id = 'adaptive-mash'
  readonly name = 'Adaptive Mash Challenge'
  readonly description = 'Press the changing keys as fast as you can'
  readonly type: MinigameType = 'performance'
  
  private keySequence: string[]
  private segmentDuration = 2000

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Generate key sequence
    const keys = ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
    const segments = Math.floor(duration / 2)
    this.keySequence = []
    for (let i = 0; i < segments; i++) {
      this.keySequence.push(keys[Math.floor(Math.random() * keys.length)])
    }
  }

  protected getGameConfig() {
    return { 
      keySequence: this.keySequence,
      segmentDuration: this.segmentDuration,
    }
  }

  handleInput(playerId: string, data: any) {
    const result = this.results.get(playerId)
    if (!result) return

    const { key, timestamp, segmentIndex } = data
    
    if (segmentIndex >= 0 && segmentIndex < this.keySequence.length) {
      if (key.toUpperCase() === this.keySequence[segmentIndex]) {
        result.performanceMetric = (result.performanceMetric || 0) + 1
      }
    }
    result.passed = true
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    let lowestScore = Infinity
    const worstPlayers: string[] = []

    for (const result of results) {
      const score = result.performanceMetric || 0
      if (score < lowestScore) {
        lowestScore = score
        worstPlayers.length = 0
        worstPlayers.push(result.playerId)
      } else if (score === lowestScore) {
        worstPlayers.push(result.playerId)
      }
    }

    return worstPlayers
  }
}
