import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'
import { shuffleArray } from '@/utils/helpers'

export class TeamTugOfWar extends BaseMinigame {
  readonly id = 'team-tug-of-war'
  readonly name = 'Team Tug-of-War'
  readonly description = 'Spam spacebar to pull the rope to your side'
  readonly type: MinigameType = 'passFail'
  
  private teams: Map<string, 'left' | 'right'> = new Map()
  private leftScore = 0
  private rightScore = 0

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Divide into two teams
    const shuffled = shuffleArray([...players])
    const mid = Math.floor(shuffled.length / 2)
    
    for (let i = 0; i < shuffled.length; i++) {
      this.teams.set(shuffled[i].playerId, i < mid ? 'left' : 'right')
    }
  }

  protected getGameConfig() {
    const teamAssignments: Record<string, string> = {}
    for (const [playerId, team] of this.teams) {
      teamAssignments[playerId] = team
    }
    return { teams: teamAssignments }
  }

  handleInput(playerId: string, data: any) {
    const team = this.teams.get(playerId)
    if (!team) return

    if (data.action === 'press') {
      if (team === 'left') {
        this.leftScore++
      } else {
        this.rightScore++
      }
    }
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    const losingTeam = this.leftScore > this.rightScore ? 'right' : 'left'
    const losers: string[] = []

    for (const [playerId, team] of this.teams) {
      if (team === losingTeam) {
        losers.push(playerId)
      }
    }

    return losers
  }
}
