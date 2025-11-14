import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class DeadlyCorners extends BaseMinigame {
  readonly id = 'deadly-corners'
  readonly name = 'Deadly Corners'
  readonly description = 'Move to a safe corner'
  readonly type: MinigameType = 'passFail'
  
  private playerCorners: Map<string, string> = new Map() // A, B, C, D
  private lethalCorner: string

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // All players start without a corner
    for (const player of players) {
      const result = this.results.get(player.playerId)
      if (result) result.passed = true
    }
    
    // Randomly select lethal corner
    const corners = ['A', 'B', 'C', 'D']
    this.lethalCorner = corners[Math.floor(Math.random() * corners.length)]
  }

  protected getGameConfig() {
    return {
      corners: ['A', 'B', 'C', 'D'],
    }
  }

  handleInput(playerId: string, data: any) {
    const { corner } = data
    
    if (['A', 'B', 'C', 'D'].includes(corner)) {
      this.playerCorners.set(playerId, corner)
    }
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    const losers: string[] = []
    
    for (const player of this.players) {
      const corner = this.playerCorners.get(player.playerId)
      
      if (corner === this.lethalCorner) {
        losers.push(player.playerId)
      }
    }
    
    return losers
  }
}
