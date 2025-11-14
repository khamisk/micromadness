import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

const SENTENCES = [
  'The quick brown fox jumps over the lazy dog',
  'Programming is the art of telling another human what one wants the computer to do',
  'A journey of a thousand miles begins with a single step',
  'Time flies like an arrow fruit flies like a banana',
  'To be or not to be that is the question',
  'The early bird catches the worm but the second mouse gets the cheese',
  'All that glitters is not gold and silence is golden',
  'Practice makes perfect but nobody is perfect so why practice',
]

export class SpeedTypist extends BaseMinigame {
  readonly id = 'speed-typist'
  readonly name = 'Speed Typist'
  readonly description = 'Type the sentence as fast as you can'
  readonly type: MinigameType = 'hybrid'
  
  private sentence: string

  constructor(duration: number, players: any[]) {
    super(duration, players)
    this.sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)]
  }

  protected getGameConfig() {
    return { sentence: this.sentence }
  }

  handleInput(playerId: string, data: any) {
    const result = this.results.get(playerId)
    if (!result || result.passed) return

    const { text, timestamp } = data
    
    if (text === this.sentence) {
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
      if (result.completionTime !== undefined) {
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
