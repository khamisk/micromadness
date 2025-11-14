import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class VoteToKill extends BaseMinigame {
  readonly id = 'vote-to-kill'
  readonly name = 'Vote to Kill'
  readonly description = 'Vote for someone to lose a life'
  readonly type: MinigameType = 'passFail'
  
  private votes: Map<string, string> = new Map() // voter -> target

  constructor(duration: number, players: any[]) {
    super(duration, players)
  }

  protected getGameConfig() {
    return {
      players: this.players.map(p => ({
        playerId: p.playerId,
        username: p.username,
      })),
    }
  }

  handleInput(playerId: string, data: any) {
    const { targetPlayerId } = data
    
    // Can't vote for yourself
    if (targetPlayerId !== playerId) {
      this.votes.set(playerId, targetPlayerId)
    }
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    // Count votes
    const voteCounts = new Map<string, number>()
    
    for (const player of this.players) {
      voteCounts.set(player.playerId, 0)
    }
    
    for (const targetId of this.votes.values()) {
      voteCounts.set(targetId, (voteCounts.get(targetId) || 0) + 1)
    }
    
    // Find most voted
    let maxVotes = -1
    const mostVoted: string[] = []
    
    for (const player of this.players) {
      const votes = voteCounts.get(player.playerId) || 0
      
      if (votes > maxVotes) {
        maxVotes = votes
        mostVoted.length = 0
        mostVoted.push(player.playerId)
      } else if (votes === maxVotes && votes > 0) {
        mostVoted.push(player.playerId)
      }
    }
    
    return mostVoted
  }
}
