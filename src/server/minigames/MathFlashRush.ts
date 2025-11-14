import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

interface MathEquation {
  id: number
  equation: string
  answer: number
}

export class MathFlashRush extends BaseMinigame {
  readonly id = 'math-flash-rush'
  readonly name = 'Math Flash Rush'
  readonly description = 'Solve math equations quickly'
  readonly type: MinigameType = 'hybrid'
  
  private equations: MathEquation[] = []
  private playerAnswers: Map<string, Array<{ questionId: number; answer: number; timestamp: number }>> = new Map()

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Generate 8-10 equations
    const count = 8 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i++) {
      this.equations.push(this.generateEquation(i))
    }
    
    // Initialize player answers
    for (const player of players) {
      this.playerAnswers.set(player.playerId, [])
    }
  }

  private generateEquation(id: number): MathEquation {
    const operations = ['+', '-', '*']
    const op = operations[Math.floor(Math.random() * operations.length)]
    
    let a: number, b: number, answer: number, equation: string
    
    switch (op) {
      case '+':
        a = Math.floor(Math.random() * 50) + 1
        b = Math.floor(Math.random() * 50) + 1
        answer = a + b
        equation = `${a} + ${b}`
        break
      case '-':
        a = Math.floor(Math.random() * 50) + 20
        b = Math.floor(Math.random() * (a - 1)) + 1
        answer = a - b
        equation = `${a} - ${b}`
        break
      case '*':
        a = Math.floor(Math.random() * 12) + 1
        b = Math.floor(Math.random() * 12) + 1
        answer = a * b
        equation = `${a} × ${b}`
        break
      default:
        a = 5
        b = 5
        answer = 10
        equation = '5 + 5'
    }
    
    return { id, equation, answer }
  }

  protected getGameConfig() {
    return {
      equations: this.equations,
      timePerEquation: 700, // 0.7 seconds
    }
  }

  handleInput(playerId: string, data: any) {
    const { questionId, answer, timestamp } = data
    
    const playerAnswerList = this.playerAnswers.get(playerId)
    if (playerAnswerList) {
      playerAnswerList.push({ questionId, answer, timestamp })
    }
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    // Check each player's answers
    for (const player of this.players) {
      const result = this.results.get(player.playerId)
      if (!result) continue
      
      const answers = this.playerAnswers.get(player.playerId) || []
      
      // Check if all answers are correct
      let allCorrect = true
      let totalTime = 0
      
      for (const eq of this.equations) {
        const playerAnswer = answers.find(a => a.questionId === eq.id)
        
        if (!playerAnswer || playerAnswer.answer !== eq.answer) {
          allCorrect = false
          break
        }
        
        totalTime += playerAnswer.timestamp
      }
      
      if (allCorrect) {
        result.passed = true
        result.performanceMetric = totalTime / this.equations.length // Average response time
      } else {
        result.passed = false
      }
    }
    
    const failed = results.filter(r => !r.passed).map(r => r.playerId)
    
    if (failed.length > 0) {
      return failed
    }
    
    // All passed, find slowest average response time
    let slowestTime = -1
    const slowestPlayers: string[] = []

    for (const result of results) {
      if (result.performanceMetric !== undefined && result.passed) {
        if (result.performanceMetric > slowestTime) {
          slowestTime = result.performanceMetric
          slowestPlayers.length = 0
          slowestPlayers.push(result.playerId)
        } else if (result.performanceMetric === slowestTime) {
          slowestPlayers.push(result.playerId)
        }
      }
    }

    return slowestPlayers
  }
}
