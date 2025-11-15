import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class TerritoryGrab extends BaseMinigame {
  readonly id = 'territory-grab'
  readonly name = 'Territory Grab'
  readonly description = 'Claim the most tiles by clicking them'
  readonly type: MinigameType = 'performance'
  
  private readonly gridSize = 10
  private tileClaims: Map<number, string> = new Map()
  private playerColors: Map<string, string> = new Map()
  private tileClaimTimes: Map<number, number> = new Map()

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Assign unique colors to each player
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
    let colorIndex = 0
    for (const player of this.players) {
      this.playerColors.set(player.playerId, colors[colorIndex % colors.length])
      colorIndex++
    }
  }

  protected getGameConfig() {
    const playerColors: Record<string, string> = {}
    for (const [playerId, color] of this.playerColors) {
      playerColors[playerId] = color
    }
    
    const playerInfo: Record<string, { username: string, color: string }> = {}
    for (const player of this.players) {
      playerInfo[player.playerId] = {
        username: player.username,
        color: this.playerColors.get(player.playerId) || '#888888',
      }
    }
    
    return {
      gridSize: this.gridSize,
      playerColors,
      playerInfo,
    }
  }

  handleInput(playerId: string, data: any) {
    const { claimed, timestamp } = data
    const tileIndex = claimed
    
    // Last click wins the tile
    this.tileClaims.set(tileIndex, playerId)
    this.tileClaimTimes.set(tileIndex, Date.now())
    
    // Broadcast the claim to all players immediately
    this.emitToAll('territoryClaimed', {
      tileIndex,
      playerId,
      color: this.playerColors.get(playerId),
      timestamp: Date.now(),
    })
    
    // Also broadcast current standings
    this.broadcastStandings()
  }

  private broadcastStandings() {
    const tileCounts = new Map<string, number>()
    for (const player of this.players) {
      tileCounts.set(player.playerId, 0)
    }
    
    for (const [tile, playerId] of this.tileClaims) {
      tileCounts.set(playerId, (tileCounts.get(playerId) || 0) + 1)
    }
    
    const standings: Record<string, number> = {}
    for (const [playerId, count] of tileCounts) {
      standings[playerId] = count
    }
    
    this.emitToAll('territoryStandings', standings)
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
