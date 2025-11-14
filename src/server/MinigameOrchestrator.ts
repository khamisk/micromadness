import { MinigameConfig, LobbySettings, MinigameOutcome, MinigameResult } from '@/types'
import { getDurationRange, getRandomInRange, shuffleArray } from '@/utils/helpers'
import { GameManager } from './GameManager'
import * as Minigames from './minigames'

export class MinigameOrchestrator {
  private gameManager: GameManager
  private currentMinigame: any = null
  private recentMinigames: string[] = []
  private readonly MAX_RECENT = 3

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager
  }

  selectRandomMinigame(settings: LobbySettings): MinigameConfig {
    const alivePlayers = this.gameManager.getPlayers().filter(p => !p.isEliminated)
    const playerCount = alivePlayers.length

    // Get all available minigames
    const availableMinigames = [
      Minigames.PerfectStopwatch,
      Minigames.AdaptiveMashChallenge,
      Minigames.SpeedTypist,
      playerCount % 2 === 0 ? Minigames.TeamTugOfWar : null,
      Minigames.PrecisionMaze,
      Minigames.StickmanDodgefall,
      Minigames.StickmanParkour,
      Minigames.StayInCircle,
      Minigames.MemoryGrid,
      Minigames.TerritoryGrab,
      Minigames.AverageBait,
      Minigames.VoteToKill,
      Minigames.BulletHell,
      Minigames.ReverseAPM,
      Minigames.DeadlyCorners,
      Minigames.GroupCoinflip,
      Minigames.CursorChainReaction,
      Minigames.StickmanCannonJump,
      Minigames.MathFlashRush,
    ].filter(m => m !== null) as any[]

    // Filter out recently played
    const filtered = availableMinigames.filter(
      M => !this.recentMinigames.includes(M.name)
    )

    const candidates = filtered.length > 0 ? filtered : availableMinigames
    const MinigameClass = candidates[Math.floor(Math.random() * candidates.length)]

    // Add to recent
    this.recentMinigames.push(MinigameClass.name)
    if (this.recentMinigames.length > this.MAX_RECENT) {
      this.recentMinigames.shift()
    }

    // Determine duration
    const [min, max] = getDurationRange(settings.minigameDuration)
    const duration = getRandomInRange(min, max)

    // Instantiate minigame
    this.currentMinigame = new MinigameClass(duration, alivePlayers)

    return this.currentMinigame.getConfig()
  }

  handlePlayerInput(playerId: string, data: any) {
    if (this.currentMinigame) {
      this.currentMinigame.handleInput(playerId, data)
    }
  }

  endMinigame(): MinigameOutcome {
    if (!this.currentMinigame) {
      return {
        minigameId: 'unknown',
        results: [],
        playersLostLife: [],
        playersEliminated: [],
      }
    }

    const outcome = this.currentMinigame.getResults()
    this.currentMinigame = null
    return outcome
  }
}
