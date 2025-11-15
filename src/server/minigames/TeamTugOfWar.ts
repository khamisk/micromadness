import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'
import { shuffleArray } from '@/utils/helpers'

export class TeamTugOfWar extends BaseMinigame {
  readonly id = 'team-tug-of-war'
  readonly name = 'Team Tug-of-War'
  readonly description = 'Spam spacebar to pull the rope to your side'
  readonly type: MinigameType = 'passFail'
  
  private teams: Map<string, 'left' | 'right'> = new Map()
  private teamMembers: { left: any[], right: any[] } = { left: [], right: [] }
  private leftScore = 0
  private rightScore = 0
  private playerPresses: Map<string, number> = new Map()
  private lastBroadcast = 0

  constructor(duration: number, players: any[]) {
    super(duration, players)
    
    // Divide into two teams
    const shuffled = shuffleArray([...players])
    const mid = Math.floor(shuffled.length / 2)
    
    for (let i = 0; i < shuffled.length; i++) {
      const player = shuffled[i]
      const team = i < mid ? 'left' : 'right'
      this.teams.set(player.playerId, team)
      this.teamMembers[team].push(player)
      this.playerPresses.set(player.playerId, 0)
    }
  }

  protected getGameConfig() {
    const teamAssignments: Record<string, string> = {}
    for (const [playerId, team] of this.teams) {
      teamAssignments[playerId] = team
    }
    return { 
      teams: teamAssignments,
      teamMembers: this.teamMembers,
      leftScore: this.leftScore,
      rightScore: this.rightScore,
    }
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
      
      this.playerPresses.set(playerId, (this.playerPresses.get(playerId) || 0) + 1)
      
      // Broadcast state update (throttled to 60fps)
      const now = Date.now()
      if (now - this.lastBroadcast > 16) {
        this.lastBroadcast = now
        this.broadcastState()
      }
    }
  }

  private broadcastState() {
    const ropePosition = (this.leftScore - this.rightScore) / 10 // Normalized
    const playerStats: Record<string, number> = {}
    for (const [playerId, presses] of this.playerPresses) {
      playerStats[playerId] = presses
    }
    
    this.emitToAll('tugOfWarUpdate', {
      ropePosition: Math.max(-50, Math.min(50, ropePosition)),
      leftScore: this.leftScore,
      rightScore: this.rightScore,
      playerStats,
    })
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
