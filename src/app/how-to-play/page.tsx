'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { pageview } from '@/lib/analytics'

export default function HowToPlayPage() {
  const router = useRouter()

  useEffect(() => {
    pageview('/how-to-play')
  }, [])

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto">
        <div className="game-card">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 dark:text-gray-400 hover:text-primary"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold ml-4 text-primary">How to Play</h1>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Game Overview</h2>
            <p>
              MicroMadness is a fast-paced minigame battle royale. Compete in rapid-fire challenges
              where losers lose lives. The last player standing wins!
            </p>

            <h2>Getting Started</h2>
            <ol>
              <li><strong>Create or Join a Lobby</strong> - Start your own game or enter a lobby code</li>
              <li><strong>Wait for Players</strong> - Games need at least 2 players</li>
              <li><strong>Ready Up</strong> - Mark yourself as ready (host can start anytime)</li>
              <li><strong>Survive!</strong> - Complete minigames to stay alive</li>
            </ol>

            <h2>Game Rules</h2>
            <ul>
              <li>Each player starts with 3-15 lives (configurable)</li>
              <li>Minigames last 8-20 seconds each</li>
              <li>After each minigame, one or more players lose a life</li>
              <li>When you reach 0 lives, you're eliminated (but can spectate)</li>
              <li>Last player with lives remaining wins</li>
            </ul>

            <h2>Minigame Types</h2>
            
            <h3>Performance-Based</h3>
            <p>
              All players compete, and the worst performer loses a life. Examples:
            </p>
            <ul>
              <li><strong>Perfect Stopwatch</strong> - Click at exactly the target time</li>
              <li><strong>Memory Grid</strong> - Remember and recreate a pattern</li>
              <li><strong>Territory Grab</strong> - Claim the most tiles</li>
            </ul>

            <h3>Pass/Fail</h3>
            <p>
              Complete the objective or lose a life. Examples:
            </p>
            <ul>
              <li><strong>Stickman Dodgefall</strong> - Dodge falling objects</li>
              <li><strong>Deadly Corners</strong> - Choose a safe corner</li>
              <li><strong>Group Coinflip</strong> - Guess the coin flip result</li>
            </ul>

            <h3>Hybrid</h3>
            <p>
              Failures lose lives. If everyone succeeds, the slowest loses. Examples:
            </p>
            <ul>
              <li><strong>Speed Typist</strong> - Type the sentence quickly</li>
              <li><strong>Precision Maze</strong> - Navigate without touching walls</li>
              <li><strong>Stickman Parkour</strong> - Complete the obstacle course</li>
            </ul>

            <h2>All Minigames</h2>
            <div className="grid md:grid-cols-2 gap-4 not-prose">
              {[
                'Perfect Stopwatch',
                'Adaptive Mash Challenge',
                'Speed Typist',
                'Team Tug-of-War',
                'Precision Maze',
                'Stickman Dodgefall',
                'Stickman Parkour',
                'Stay in the Circle',
                'Memory Grid',
                'Territory Grab',
                'Average Bait',
                'Vote to Kill',
                'Bullet Hell',
                'Reverse APM Test',
                'Deadly Corners',
                'Group Coinflip',
              ].map((game) => (
                <div key={game} className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <span className="font-medium">{game}</span>
                </div>
              ))}
            </div>

            <h2>Tips</h2>
            <ul>
              <li>Stay focused - minigames switch quickly!</li>
              <li>Read instructions carefully at the start of each game</li>
              <li>Practice makes perfect - learn the minigames to improve</li>
              <li>Keep an eye on other players' lives</li>
              <li>Have fun and don't take it too seriously!</li>
            </ul>

            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/')}
                className="btn-primary px-8 py-3"
              >
                Start Playing
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
