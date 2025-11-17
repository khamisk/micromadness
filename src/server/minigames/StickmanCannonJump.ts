import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class StickmanCannonJump extends BaseMinigame {
  readonly id = 'stickman-cannon-jump'
  readonly name = 'Stickman Cannon Jump'
  readonly description = 'Jump over the cannonballs'
  readonly type: MinigameType = 'passFail'
  
  private cannonballSpeed = 3
  private cannonballs: Array<{ id: string; x: number; y: number; speed: number }> = []
  private playerYPositions: Map<string, number> = new Map()

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Initialize all players as passed
    for (const player of players) {
      const result = this.results.get(player.playerId)
      if (result) result.passed = true
      this.playerYPositions.set(player.playerId, 280) // Ground position
    }
    
    // Generate cannonball timings (fire every 2 seconds, speed increases)
    const shotCount = Math.floor(duration / 2)
    for (let i = 0; i < shotCount; i++) {
      this.cannonballs.push({
        id: `cannon-${i}`,
        x: 0,
        y: 80, // Ground level
        speed: this.cannonballSpeed + (i * 0.5), // Speed increases
      })
    }
  }

  protected getGameConfig() {
    return {
      cannonballs: this.cannonballs,
      fireInterval: 2000,
    }
  }

  handleInput(playerId: string, data: any) {
    const { action, y } = data
    
    if (action === 'hit') {
      const result = this.results.get(playerId)
      if (result) {
        result.passed = false
      }
    } else if (action === 'jump' && y !== undefined) {
      // Update player Y position
      this.playerYPositions.set(playerId, y)
      // Broadcast all player positions
      this.broadcastPositions()
    }
  }

  private broadcastPositions() {
    const positions = Array.from(this.playerYPositions.entries())
      .map(([id, y]) => {
        const player = this.players.find(p => p.playerId === id)
        return {
          username: player?.username || 'Player',
          y,
          color: this.getPlayerColor(id)
        }
      })
    this.emitToAll('cannonJumpPositions', positions)
  }

  private getPlayerColor(playerId: string): string {
    const colors = ['#ef4444', '#22c55e', '#3b82f6', '#fbbf24', '#a855f7']
    const index = this.players.findIndex(p => p.playerId === playerId)
    return colors[index % colors.length]
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    return results.filter(r => !r.passed).map(r => r.playerId)
  }
}
