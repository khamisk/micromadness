import { MinigameConfig, MinigameOutcome, MinigameResult, LobbyPlayer, MinigameType } from '@/types'

export abstract class BaseMinigame {
  protected duration: number
  protected players: LobbyPlayer[]
  protected results: Map<string, MinigameResult> = new Map()
  
  abstract readonly id: string
  abstract readonly name: string
  abstract readonly description: string
  abstract readonly type: MinigameType

  constructor(duration: number, players: LobbyPlayer[]) {
    this.duration = duration
    this.players = players
    
    // Initialize results for all players
    for (const player of players) {
      this.results.set(player.playerId, {
        playerId: player.playerId,
        passed: false,
        performanceMetric: 0,
      })
    }
  }

  abstract handleInput(playerId: string, data: any): void

  getConfig(): MinigameConfig {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      durationSeconds: this.duration,
      type: this.type,
      config: this.getGameConfig(),
    }
  }

  protected getGameConfig(): any {
    return {}
  }

  getResults(): MinigameOutcome {
    const results = Array.from(this.results.values())
    const playersLostLife = this.calculatePlayersLostLife(results)
    
    return {
      minigameId: this.id,
      results,
      playersLostLife,
      playersEliminated: [], // Will be calculated by GameManager
    }
  }

  protected abstract calculatePlayersLostLife(results: MinigameResult[]): string[]
}
