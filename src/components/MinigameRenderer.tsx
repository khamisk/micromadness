'use client'

import { MinigameConfig } from '@/types'
import { useState, useEffect, useRef } from 'react'

interface MinigameRendererProps {
  minigame: MinigameConfig
  onInput: (data: any) => void
  isEliminated: boolean
}

export default function MinigameRenderer({ minigame, onInput, isEliminated }: MinigameRendererProps) {
  if (isEliminated) {
    return (
      <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">You've been eliminated!</h2>
        <p className="text-gray-600">Watch the remaining players compete</p>
      </div>
    )
  }

  // Render different minigames based on ID
  switch (minigame.id) {
    case 'perfect-stopwatch':
      return <PerfectStopwatchGame minigame={minigame} onInput={onInput} />
    
    case 'adaptive-mash':
      return <AdaptiveMashGame minigame={minigame} onInput={onInput} />
    
    case 'speed-typist':
      return <SpeedTypistGame minigame={minigame} onInput={onInput} />
    
    case 'team-tug-of-war':
      return <TeamTugOfWarGame minigame={minigame} onInput={onInput} />
    
    case 'precision-maze':
      return <PrecisionMazeGame minigame={minigame} onInput={onInput} />
    
    case 'stickman-dodgefall':
      return <StickmanDodgefallGame minigame={minigame} onInput={onInput} />
    
    case 'stickman-parkour':
      return <StickmanParkourGame minigame={minigame} onInput={onInput} />
    
    case 'stay-in-circle':
      return <StayInCircleGame minigame={minigame} onInput={onInput} />
    
    case 'memory-grid':
      return <MemoryGridGame minigame={minigame} onInput={onInput} />
    
    case 'territory-grab':
      return <TerritoryGrabGame minigame={minigame} onInput={onInput} />
    
    case 'average-bait':
      return <AverageBaitGame minigame={minigame} onInput={onInput} />
    
    case 'vote-to-kill':
      return <VoteToKillGame minigame={minigame} onInput={onInput} />
    
    case 'bullet-hell':
      return <BulletHellGame minigame={minigame} onInput={onInput} />
    
    case 'reverse-apm':
      return <ReverseAPMGame minigame={minigame} onInput={onInput} />
    
    case 'deadly-corners':
      return <DeadlyCornersGame minigame={minigame} onInput={onInput} />
    
    case 'group-coinflip':
      return <GroupCoinflipGame minigame={minigame} onInput={onInput} />
    
    case 'cursor-chain-reaction':
      return <CursorChainReactionGame minigame={minigame} onInput={onInput} />
    
    case 'stickman-cannon-jump':
      return <StickmanCannonJumpGame minigame={minigame} onInput={onInput} />
    
    case 'math-flash-rush':
      return <MathFlashRushGame minigame={minigame} onInput={onInput} />
    
    default:
      return <DefaultMinigameUI minigame={minigame} onInput={onInput} />
  }
}

// Perfect Stopwatch - Click at exact time
function PerfectStopwatchGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const targetSeconds = minigame.config?.targetSeconds || 7
  const [startTime] = useState(Date.now())
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    if (clicked) return
    setClicked(true)
    const clickTime = Date.now() - startTime
    onInput({ clickTime })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-2xl font-bold mb-8">
        Click at exactly {targetSeconds}.00 seconds!
      </h3>
      <button
        onClick={handleClick}
        disabled={clicked}
        className="bg-primary hover:bg-primary-dark text-white font-bold py-8 px-16 rounded-full text-3xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {clicked ? 'Clicked!' : 'CLICK'}
      </button>
      <p className="mt-6 text-gray-600 text-sm">
        No timer shown - you must feel the time!
      </p>
    </div>
  )
}

// Adaptive Mash - Press changing keys
function AdaptiveMashGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const keySequence = minigame.config?.keySequence || []
  const segmentDuration = minigame.config?.segmentDuration || 2000
  const [currentSegment, setCurrentSegment] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSegment(prev => Math.min(prev + 1, keySequence.length - 1))
    }, segmentDuration)

    return () => clearInterval(interval)
  }, [keySequence.length, segmentDuration])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentSegment < keySequence.length) {
        const expectedKey = keySequence[currentSegment]
        if (e.key.toUpperCase() === expectedKey) {
          setScore(prev => prev + 1)
          onInput({ key: e.key, timestamp: Date.now(), segmentIndex: currentSegment })
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSegment, keySequence, onInput])

  const currentKey = keySequence[currentSegment] || '?'

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <div className="mb-8">
        <div className="text-sm text-gray-600 mb-2">Press:</div>
        <div className="text-9xl font-bold text-primary animate-pulse">
          {currentKey}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-700">
        Score: {score}
      </div>
    </div>
  )
}

// Speed Typist - Type the sentence
function SpeedTypistGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const sentence = minigame.config?.sentence || 'Type this sentence!'
  const [input, setInput] = useState('')
  const [completed, setCompleted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    
    if (value === sentence && !completed) {
      setCompleted(true)
      onInput({ text: value, timestamp: Date.now() })
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12">
      <div className="text-center mb-8">
        <div className="text-3xl font-mono font-bold bg-gray-900 text-white p-6 rounded mb-6">
          {sentence}
        </div>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onPaste={handlePaste}
          disabled={completed}
          className="input-field text-2xl text-center w-full max-w-2xl font-mono"
          placeholder="Type here..."
          autoFocus
        />
        {completed && (
          <div className="mt-4 text-green-600 font-bold text-xl">
            ✓ Complete!
          </div>
        )}
      </div>
    </div>
  )
}

// Team Tug of War - Spam spacebar
function TeamTugOfWarGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [presses, setPresses] = useState(0)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setPresses(prev => prev + 1)
        onInput({ action: 'press', timestamp: Date.now() })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onInput])

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-2xl font-bold mb-8">Spam SPACEBAR!</h3>
      <div className="text-9xl font-bold text-primary mb-4">{presses}</div>
      <p className="text-gray-600">Presses</p>
    </div>
  )
}

// Precision Maze - Navigate without touching walls
function PrecisionMazeGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [completed, setCompleted] = useState(false)
  const [touched, setTouched] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // More complex maze path with narrower corridors
    const path = [
      [50, 50],
      [150, 50],
      [150, 150],
      [250, 150],
      [250, 50],
      [350, 50],
      [350, 200],
      [200, 200],
      [200, 300],
      [400, 300],
      [400, 350]
    ]
    const pathWidth = 35 // Narrower path

    const drawMaze = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Dark background
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw walls (thicker lines)
      ctx.strokeStyle = '#2a2a2a'
      ctx.lineWidth = pathWidth + 20
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(path[0][0], path[0][1])
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0], path[i][1])
      }
      ctx.stroke()
      
      // Draw path
      ctx.strokeStyle = '#444'
      ctx.lineWidth = pathWidth
      ctx.beginPath()
      ctx.moveTo(path[0][0], path[0][1])
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0], path[i][1])
      }
      ctx.stroke()

      // Start circle (green)
      ctx.fillStyle = started ? '#00aa00' : '#00ff00'
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(path[0][0], path[0][1], 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // End circle (red)
      ctx.fillStyle = '#ff0000'
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(path[path.length - 1][0], path[path.length - 1][1], 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const pixel = ctx.getImageData(x, y, 1, 1).data
      
      // Check if on start circle
      const startDist = Math.sqrt((x - path[0][0]) ** 2 + (y - path[0][1]) ** 2)
      if (startDist <= 20 && !started) {
        setStarted(true)
        drawMaze()
      }
      
      // Only check for completion if started
      if (started) {
        // Check if touched wall (dark background)
        if (pixel[0] < 50 && pixel[1] < 50 && pixel[2] < 50) {
          if (!touched) {
            setTouched(true)
            onInput({ action: 'touched_wall', timestamp: Date.now() })
          }
        }

        // Check if reached end
        const endDist = Math.sqrt((x - path[path.length - 1][0]) ** 2 + (y - path[path.length - 1][1]) ** 2)
        if (endDist <= 20 && !completed && !touched) {
          setCompleted(true)
          onInput({ action: 'completed', timestamp: Date.now(), touched: false })
        }
      }
    }

    drawMaze()
    canvas.addEventListener('mousemove', handleMove)

    return () => {
      canvas.removeEventListener('mousemove', handleMove)
    }
  }, [minigame.config, onInput, completed, touched, started])

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-8 text-center">
      <h3 className="text-xl font-bold mb-4">
        {!started ? 'Start on the GREEN circle!' : 'Navigate to RED without touching walls!'}
      </h3>
      <canvas ref={canvasRef} width={450} height={400} className="border-4 border-gray-800 mx-auto rounded" />
      {touched && <p className="text-red-600 font-bold mt-4 text-2xl">❌ Touched wall - FAILED!</p>}
      {completed && <p className="text-green-600 font-bold mt-4 text-2xl">✅ Success!</p>}
    </div>
  )
}

// Stickman Dodgefall - Dodge falling objects
function StickmanDodgefallGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [playerX, setPlayerX] = useState(250)
  const [dodges, setDodges] = useState(0)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPlayerX(prev => Math.max(50, prev - 30))
        onInput({ action: 'move', direction: 'left', timestamp: Date.now() })
      } else if (e.key === 'ArrowRight') {
        setPlayerX(prev => Math.min(450, prev + 30))
        onInput({ action: 'move', direction: 'right', timestamp: Date.now() })
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onInput])

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Dodge falling objects! (Arrow keys)</h3>
      <div className="relative w-full h-96 bg-gray-200 rounded">
        <div 
          className="absolute bottom-4 w-12 h-16 bg-blue-500 rounded transition-all"
          style={{ left: `${playerX}px`, transform: 'translateX(-50%)' }}
        />
      </div>
      <p className="mt-4 text-gray-700">Dodges: {dodges}</p>
    </div>
  )
}

// Stickman Parkour - Jump platforms
function StickmanParkourGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [jumps, setJumps] = useState(0)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setJumps(prev => prev + 1)
        onInput({ action: 'jump', timestamp: Date.now() })
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onInput])

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Jump platforms! (Spacebar)</h3>
      <div className="text-6xl font-bold text-primary mb-4">{jumps}</div>
      <p className="text-gray-600">Successful Jumps</p>
    </div>
  )
}

// Stay In Circle - Keep cursor in shrinking circle
function StayInCircleGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [inCircle, setInCircle] = useState(true)
  const [radius, setRadius] = useState(150)

  useEffect(() => {
    const shrink = setInterval(() => {
      setRadius(prev => Math.max(30, prev - 2))
    }, 100)

    return () => clearInterval(shrink)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = inCircle ? '#00ff0033' : '#ff000033'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 3
      ctx.stroke()
    }

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      const inside = distance <= radius
      
      if (inside !== inCircle) {
        setInCircle(inside)
        if (!inside) {
          onInput({ action: 'left_circle', timestamp: Date.now() })
        }
      }
    }

    const interval = setInterval(draw, 16)
    canvas.addEventListener('mousemove', handleMove)

    return () => {
      clearInterval(interval)
      canvas.removeEventListener('mousemove', handleMove)
    }
  }, [radius, inCircle, onInput])

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-8 text-center">
      <h3 className="text-xl font-bold mb-4">Keep your cursor in the circle!</h3>
      <canvas ref={canvasRef} width={500} height={500} className="border-4 border-gray-800 mx-auto" />
      <p className={`mt-4 font-bold ${inCircle ? 'text-green-600' : 'text-red-600'}`}>
        {inCircle ? 'Inside!' : 'Outside!'}
      </p>
    </div>
  )
}

// Memory Grid - Remember pattern
function MemoryGridGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const pattern = minigame.config?.pattern || [0, 4, 8, 12]
  const [showPattern, setShowPattern] = useState(true)
  const [selected, setSelected] = useState<number[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setShowPattern(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = (index: number) => {
    if (showPattern) return
    
    const newSelected = [...selected, index]
    setSelected(newSelected)
    
    onInput({ selected: newSelected, timestamp: Date.now() })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">
        {showPattern ? 'Memorize the pattern!' : 'Click the pattern!'}
      </h3>
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {Array.from({ length: 16 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-20 h-20 rounded transition-all ${
              showPattern && pattern.includes(i)
                ? 'bg-yellow-400'
                : selected.includes(i)
                ? 'bg-blue-400'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            disabled={showPattern}
          />
        ))}
      </div>
    </div>
  )
}

// Territory Grab - Click tiles to claim
function TerritoryGrabGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [claimed, setClaimed] = useState<Set<number>>(new Set())

  const handleClick = (index: number) => {
    if (claimed.has(index)) return
    
    const newClaimed = new Set(claimed)
    newClaimed.add(index)
    setClaimed(newClaimed)
    
    onInput({ claimed: index, total: newClaimed.size, timestamp: Date.now() })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Claim tiles by clicking! ({claimed.size}/25)</h3>
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {Array.from({ length: 25 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-16 h-16 rounded transition-all ${
              claimed.has(i) ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Average Bait - Enter a strategic number
function AverageBaitGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (submitted || !value) return
    setSubmitted(true)
    onInput({ value: parseFloat(value), timestamp: Date.now() })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Enter a number 0-100</h3>
      <p className="text-gray-600 mb-6">Closest to 2/3 of the average wins!</p>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={submitted}
        className="input-field text-3xl text-center w-48 mb-4"
        placeholder="0-100"
        min="0"
        max="100"
      />
      <br />
      <button
        onClick={handleSubmit}
        disabled={submitted || !value}
        className="btn btn-primary text-xl px-8 py-3"
      >
        {submitted ? 'Submitted!' : 'Submit'}
      </button>
    </div>
  )
}

// Vote To Kill - Vote for a player
function VoteToKillGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const players = minigame.config?.players || ['Player 1', 'Player 2', 'Player 3']
  const [voted, setVoted] = useState(false)

  const handleVote = (playerName: string) => {
    if (voted) return
    setVoted(true)
    onInput({ vote: playerName, timestamp: Date.now() })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Vote to eliminate a player!</h3>
      <div className="space-y-3">
        {players.map((playerName: string, i: number) => (
          <button
            key={i}
            onClick={() => handleVote(playerName)}
            disabled={voted}
            className="btn btn-primary w-64 text-lg"
          >
            {playerName}
          </button>
        ))}
      </div>
      {voted && <p className="text-green-600 font-bold mt-4">Vote submitted!</p>}
    </div>
  )
}

// Bullet Hell - Avoid projectiles
function BulletHellGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [playerPos, setPlayerPos] = useState({ x: 250, y: 400 })
  const [survived, setSurvived] = useState(true)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPlayerPos({ x: e.clientX, y: e.clientY })
      onInput({ position: { x: e.clientX, y: e.clientY }, timestamp: Date.now() })
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [onInput])

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Dodge the bullets!</h3>
      <div className="relative w-full h-96 bg-gray-900 rounded overflow-hidden">
        <div 
          className="absolute w-6 h-6 bg-blue-500 rounded-full"
          style={{ left: `${playerPos.x}px`, top: `${playerPos.y}px`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <p className={`mt-4 font-bold ${survived ? 'text-green-600' : 'text-red-600'}`}>
        {survived ? 'Surviving!' : 'Hit!'}
      </p>
    </div>
  )
}

// Reverse APM - Click slowly
function ReverseAPMGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [clicks, setClicks] = useState(0)
  const [lastClick, setLastClick] = useState(0)

  const handleClick = () => {
    const now = Date.now()
    setClicks(prev => prev + 1)
    setLastClick(now)
    onInput({ clicks: clicks + 1, timestamp: now })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Click SLOWLY!</h3>
      <p className="text-gray-600 mb-6">Fewer clicks = better score</p>
      <button
        onClick={handleClick}
        className="btn btn-primary text-3xl px-16 py-8"
      >
        Click ({clicks})
      </button>
    </div>
  )
}

// Deadly Corners - Pick a corner every round
function DeadlyCornersGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [selectedCorner, setSelectedCorner] = useState<string | null>(null)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(5)
  const [lethalCorner, setLethalCorner] = useState<string | null>(null)
  const [eliminated, setEliminated] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Round ends
          const corners = ['A', 'B', 'C', 'D']
          const deadly = corners[Math.floor(Math.random() * corners.length)]
          setLethalCorner(deadly)
          
          if (selectedCorner === deadly) {
            setEliminated(true)
            onInput({ action: 'eliminated', corner: selectedCorner, round, timestamp: Date.now() })
          } else {
            onInput({ action: 'survived', corner: selectedCorner, round, timestamp: Date.now() })
          }
          
          // Next round
          setTimeout(() => {
            if (!eliminated && selectedCorner !== deadly) {
              setLethalCorner(null)
              setSelectedCorner(null)
              setRound(prev => prev + 1)
              return 5
            }
          }, 2000)
          
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedCorner, round, eliminated, onInput])

  const handleSelectCorner = (corner: string) => {
    if (lethalCorner || eliminated) return
    setSelectedCorner(corner)
  }

  const corners = [
    { id: 'A', label: 'A', color: 'bg-red-500', position: 'top-0 left-0' },
    { id: 'B', label: 'B', color: 'bg-blue-500', position: 'top-0 right-0' },
    { id: 'C', label: 'C', color: 'bg-green-500', position: 'bottom-0 left-0' },
    { id: 'D', label: 'D', color: 'bg-yellow-500', position: 'bottom-0 right-0' },
  ]

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Pick a Corner Every Round!</h3>
      <p className="text-gray-600 mb-2">Round {round} - {timeLeft}s left</p>
      {eliminated && <p className="text-red-600 font-bold text-2xl mb-4">❌ ELIMINATED!</p>}
      
      <div className="relative w-96 h-96 mx-auto bg-gray-800 rounded-lg">
        {corners.map((corner) => (
          <button
            key={corner.id}
            onClick={() => handleSelectCorner(corner.id)}
            disabled={!!lethalCorner || eliminated}
            className={`absolute w-44 h-44 ${corner.position} ${corner.color} 
              ${selectedCorner === corner.id ? 'ring-8 ring-white' : ''}
              ${lethalCorner === corner.id ? 'opacity-50' : ''}
              hover:opacity-80 transition-all flex items-center justify-center text-white text-6xl font-bold`}
          >
            {lethalCorner === corner.id && '💀'}
            {lethalCorner && lethalCorner !== corner.id && '✅'}
            {!lethalCorner && corner.label}
          </button>
        ))}
        
        {/* Center display */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-900 bg-opacity-90 rounded-full w-32 h-32 flex items-center justify-center text-white text-4xl font-bold">
            {timeLeft}
          </div>
        </div>
      </div>
      
      {selectedCorner && !lethalCorner && (
        <p className="text-blue-600 font-bold mt-4">Selected: {selectedCorner}</p>
      )}
    </div>
  )
}

// Group Coinflip - Choose heads or tails
function GroupCoinflipGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [choice, setChoice] = useState<string | null>(null)
  const [flipping, setFlipping] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)

  const handleChoice = (side: string) => {
    if (choice) return
    setChoice(side)
    onInput({ choice: side, timestamp: Date.now() })
    
    // Simulate coin flip after choice
    setTimeout(() => {
      setFlipping(true)
      const flipResult = Math.random() < 0.5 ? 'heads' : 'tails'
      
      // Animate flip
      let rotations = 0
      const flipInterval = setInterval(() => {
        rotations += 180
        setRotation(rotations)
        if (rotations >= 1440) { // 8 flips
          clearInterval(flipInterval)
          setResult(flipResult)
          setFlipping(false)
        }
      }, 100)
    }, 1000)
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Choose Heads or Tails!</h3>
      <p className="text-gray-600 mb-6">Wrong choice = lose a life!</p>
      
      {/* Coin Display */}
      <div className="mb-8">
        <div 
          className="w-48 h-48 mx-auto rounded-full shadow-2xl flex items-center justify-center text-6xl font-bold transition-transform duration-100"
          style={{ 
            transform: `rotateY(${rotation}deg)`,
            background: rotation % 360 < 180 ? 'linear-gradient(145deg, #FFD700, #FFA500)' : 'linear-gradient(145deg, #C0C0C0, #808080)',
            border: '8px solid #DAA520'
          }}
        >
          {!flipping && !result && '?'}
          {flipping && '💫'}
          {result && (result === 'heads' ? '👑' : '🦅')}
        </div>
        {result && (
          <p className={`mt-4 text-3xl font-bold ${result === choice ? 'text-green-600' : 'text-red-600'}`}>
            {result === 'heads' ? 'HEADS!' : 'TAILS!'}
            <br />
            {result === choice ? '✅ You Win!' : '❌ You Lose!'}
          </p>
        )}
      </div>
      
      {!choice && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleChoice('heads')}
            className="btn btn-primary text-2xl px-12 py-8"
          >
            👑 Heads
          </button>
          <button
            onClick={() => handleChoice('tails')}
            className="btn btn-primary text-2xl px-12 py-8"
          >
            🦅 Tails
          </button>
        </div>
      )}
      
      {choice && !result && (
        <p className="text-blue-600 font-bold text-xl">
          {flipping ? '🎲 Flipping...' : `Selected: ${choice === 'heads' ? '👑 Heads' : '🦅 Tails'}`}
        </p>
      )}
    </div>
  )
}

// Cursor Chain Reaction - Avoid bouncing balls
function CursorChainReactionGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [balls, setBalls] = useState<Array<{x: number, y: number, vx: number, vy: number, radius: number}>>([])
  const [hit, setHit] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 225, y: 225 })

  useEffect(() => {
    // Start with one ball
    setBalls([{
      x: Math.random() * 400 + 25,
      y: Math.random() * 400 + 25,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      radius: 20
    }])

    // Add new ball every 3 seconds
    const addBallInterval = setInterval(() => {
      setBalls(prev => [...prev, {
        x: Math.random() * 400 + 25,
        y: Math.random() * 400 + 25,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        radius: 20
      }])
    }, 3000)

    return () => clearInterval(addBallInterval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || hit) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw balls
      const newBalls = balls.map(ball => {
        let newX = ball.x + ball.vx
        let newY = ball.y + ball.vy
        let newVx = ball.vx
        let newVy = ball.vy

        // Bounce off walls
        if (newX - ball.radius < 0 || newX + ball.radius > canvas.width) {
          newVx = -newVx
          newX = ball.x + newVx
        }
        if (newY - ball.radius < 0 || newY + ball.radius > canvas.height) {
          newVy = -newVy
          newY = ball.y + newVy
        }

        // Draw ball
        ctx.fillStyle = '#ff4444'
        ctx.beginPath()
        ctx.arc(newX, newY, ball.radius, 0, Math.PI * 2)
        ctx.fill()

        // Check collision with mouse
        const dist = Math.sqrt((newX - mousePos.x) ** 2 + (newY - mousePos.y) ** 2)
        if (dist < ball.radius + 10 && !hit) {
          setHit(true)
          onInput({ action: 'hit', timestamp: Date.now() })
        }

        return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy }
      })

      setBalls(newBalls)

      // Draw cursor
      ctx.fillStyle = hit ? '#ff0000' : '#00ff00'
      ctx.beginPath()
      ctx.arc(mousePos.x, mousePos.y, 10, 0, Math.PI * 2)
      ctx.fill()
    }

    const animationId = setInterval(animate, 1000 / 60)
    return () => clearInterval(animationId)
  }, [balls, mousePos, hit, onInput])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Avoid the bouncing balls!</h3>
      <p className="text-gray-600 mb-4">Balls: {balls.length} | {hit ? '❌ HIT!' : '✅ Surviving'}</p>
      <canvas 
        ref={canvasRef} 
        width={450} 
        height={450}
        onMouseMove={handleMouseMove}
        className="border-4 border-gray-800 mx-auto rounded cursor-none"
      />
    </div>
  )
}

// Stickman Cannon Jump - Time your jumps
function StickmanCannonJumpGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [power, setPower] = useState(0)
  const [launched, setLaunched] = useState(false)

  useEffect(() => {
    if (launched) return

    const interval = setInterval(() => {
      setPower(prev => (prev + 5) % 100)
    }, 50)

    return () => clearInterval(interval)
  }, [launched])

  const handleLaunch = () => {
    if (launched) return
    setLaunched(true)
    onInput({ power, timestamp: Date.now() })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Click at max power!</h3>
      <div className="mb-6">
        <div className="w-full h-12 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
            style={{ width: `${power}%` }}
          />
        </div>
        <p className="text-4xl font-bold mt-2">{power}%</p>
      </div>
      <button
        onClick={handleLaunch}
        disabled={launched}
        className="btn btn-primary text-2xl px-12 py-6"
      >
        {launched ? 'Launched!' : 'LAUNCH'}
      </button>
    </div>
  )
}

// Math Flash Rush - Solve math quickly
function MathFlashRushGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [problem, setProblem] = useState({ a: 5, b: 3, op: '+' })
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)

  useEffect(() => {
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    const ops = ['+', '-', '*']
    const op = ops[Math.floor(Math.random() * ops.length)]
    setProblem({ a, b, op })
  }, [])

  const checkAnswer = () => {
    let correct = 0
    switch (problem.op) {
      case '+': correct = problem.a + problem.b; break
      case '-': correct = problem.a - problem.b; break
      case '*': correct = problem.a * problem.b; break
    }

    const isCorrect = parseInt(answer) === correct
    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    onInput({ answer: parseInt(answer), correct: isCorrect, timestamp: Date.now() })

    // Next problem
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    const ops = ['+', '-', '*']
    const op = ops[Math.floor(Math.random() * ops.length)]
    setProblem({ a, b, op })
    setAnswer('')
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Solve as fast as possible!</h3>
      <div className="text-6xl font-bold mb-6">
        {problem.a} {problem.op} {problem.b} = ?
      </div>
      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        className="input-field text-4xl text-center w-48 mb-4"
        placeholder="?"
        autoFocus
      />
      <br />
      <button onClick={checkAnswer} className="btn btn-primary text-xl px-8 py-3">
        Submit
      </button>
      <p className="text-2xl font-bold mt-4">Score: {score}</p>
    </div>
  )
}

function DefaultMinigameUI({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-2xl font-bold mb-4">{minigame.name}</h3>
      <p className="text-gray-600 mb-8">{minigame.description}</p>
      <div className="text-sm text-gray-500">
        Minigame UI coming soon! ({minigame.id})
      </div>
    </div>
  )
}
