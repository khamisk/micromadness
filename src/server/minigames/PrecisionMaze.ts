import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class PrecisionMaze extends BaseMinigame {
  readonly id = 'precision-maze'
  readonly name = 'Precision Maze'
  readonly description = 'Navigate through the maze without touching walls'
  readonly type: MinigameType = 'hybrid'
  
  private maze: number[][] // Simple maze representation

  constructor(duration: number, players: any[]) {
    super(duration, players)
    this.maze = this.generateMaze()
  }

  private generateMaze(): number[][] {
    // Simple 10x10 maze (0 = path, 1 = wall)
    const maze = Array(10).fill(0).map(() => Array(10).fill(0))
    
    // Add some walls
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (Math.random() < 0.25 && !(i === 0 && j === 0) && !(i === 9 && j === 9)) {
          maze[i][j] = 1
        }
      }
    }
    
    return maze
  }

  protected getGameConfig() {
    return { maze: this.maze }
  }

  handleInput(playerId: string, data: any) {
    const result = this.results.get(playerId)
    if (!result) return

    const { action, timestamp } = data
    
    if (action === 'touchedWall') {
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
