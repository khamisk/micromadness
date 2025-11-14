import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class GroupCoinflip extends BaseMinigame {
  readonly id = 'group-coinflip'
  readonly name = 'Group Coinflip'
  readonly description = 'Guess heads or tails'
  readonly type: MinigameType = 'passFail'
  
  private choices: Map<string, 'heads' | 'tails'> = new Map()
  private result: 'heads' | 'tails'

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Flip the coin
    this.result = Math.random() < 0.5 ? 'heads' : 'tails'
  }

  protected getGameConfig() {
    return {}
  }

  handleInput(playerId: string, data: any) {
    const { choice } = data
    
    if (choice === 'heads' || choice === 'tails') {
      this.choices.set(playerId, choice)
    }
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    const losers: string[] = []
    
    for (const player of this.players) {
      const choice = this.choices.get(player.playerId)
      
      // No choice or wrong choice = lose life
      if (!choice || choice !== this.result) {
        losers.push(player.playerId)
      }
    }
    
    return losers
  }
}
