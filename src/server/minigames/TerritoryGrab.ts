import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class TerritoryGrab extends BaseMinigame {
  readonly id = 'territory-grab'
  readonly name = 'Territory Grab'
  readonly description = 'Claim the most tiles by clicking them'
  readonly type: MinigameType = 'performance'
  
  private readonly gridSize = 10
  private tileClaims: Map<number, string> = new Map()

  constructor(duration: number, players: any[]) {
    super(duration, players)
  }

  protected getGameConfig() {
    const playerColors: Record<string, string> = {}
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
    
    let colorIndex = 0
    for (const player of this.players) {
      playerColors[player.playerId] = colors[colorIndex % colors.length]
      colorIndex++
    }
    
    return {
      gridSize: this.gridSize,
      playerColors,
    }
  }

  handleInput(playerId: string, data: any) {
    const { tileIndex, timestamp } = data
    
    // Last click wins the tile
    this.tileClaims.set(tileIndex, playerId)
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    // Count tiles per player
    const tileCounts = new Map<string, number>()
    
    for (const player of this.players) {
      tileCounts.set(player.playerId, 0)
    }
    
    for (const [tile, playerId] of this.tileClaims) {
      tileCounts.set(playerId, (tileCounts.get(playerId) || 0) + 1)
    }
    
    // Update results
    for (const player of this.players) {
      const result = this.results.get(player.playerId)
      if (result) {
        result.performanceMetric = tileCounts.get(player.playerId) || 0
        result.passed = true
      }
    }
    
    // Find lowest
    let lowestCount = Infinity
    const worstPlayers: string[] = []

    for (const [playerId, count] of tileCounts) {
      if (count < lowestCount) {
        lowestCount = count
        worstPlayers.length = 0
        worstPlayers.push(playerId)
      } else if (count === lowestCount) {
        worstPlayers.push(playerId)
      }
    }

    return worstPlayers
  }
}
