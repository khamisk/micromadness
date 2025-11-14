import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class MemoryGrid extends BaseMinigame {
  readonly id = 'memory-grid'
  readonly name = 'One-Second Memory Grid'
  readonly description = 'Remember and click the lit tiles'
  readonly type: MinigameType = 'performance'
  
  private litTiles: number[] = []
  private readonly gridSize = 5

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Select 8-12 random tiles to light up
    const totalTiles = this.gridSize * this.gridSize
    const numLit = 8 + Math.floor(Math.random() * 5)
    
    const allTiles = Array.from({ length: totalTiles }, (_, i) => i)
    for (let i = 0; i < numLit; i++) {
      const idx = Math.floor(Math.random() * allTiles.length)
      this.litTiles.push(allTiles[idx])
      allTiles.splice(idx, 1)
    }
  }

  protected getGameConfig() {
    return {
      gridSize: this.gridSize,
      litTiles: this.litTiles,
      flashDuration: 1000,
    }
  }

  handleInput(playerId: string, data: any) {
    const result = this.results.get(playerId)
    if (!result) return

    const { clickedTiles } = data
    
    // Calculate score: +1 for correct, -1 for wrong
    let score = 0
    const clickedSet = new Set(clickedTiles)
    const litSet = new Set(this.litTiles)
    
    for (const tile of clickedTiles) {
      if (litSet.has(tile)) {
        score++ // Correct
      } else {
        score-- // Wrong
      }
    }
    
    result.performanceMetric = score
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
