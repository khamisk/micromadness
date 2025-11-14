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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const path = minigame.config?.path || [[50, 100], [250, 100], [250, 300], [450, 300]]
    const pathWidth = minigame.config?.pathWidth || 60

    const drawMaze = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#333'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = pathWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(path[0][0], path[0][1])
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0], path[i][1])
      }
      ctx.stroke()

      // Start circle
      ctx.fillStyle = '#00ff00'
      ctx.beginPath()
      ctx.arc(path[0][0], path[0][1], 15, 0, Math.PI * 2)
      ctx.fill()

      // End circle
      ctx.fillStyle = '#ff0000'
      ctx.beginPath()
      ctx.arc(path[path.length - 1][0], path[path.length - 1][1], 15, 0, Math.PI * 2)
      ctx.fill()
    }

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const pixel = ctx.getImageData(x, y, 1, 1).data
      if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0) {
        if (!touched) {
          setTouched(true)
          onInput({ action: 'touched_wall', timestamp: Date.now() })
        }
      }

      if (pixel[0] === 255 && pixel[1] === 0 && pixel[2] === 0) {
        if (!completed && !touched) {
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
  }, [minigame.config, onInput, completed, touched])

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-8 text-center">
      <h3 className="text-xl font-bold mb-4">Navigate to the red circle without touching walls!</h3>
      <canvas ref={canvasRef} width={500} height={400} className="border-4 border-gray-800 mx-auto" />
      {touched && <p className="text-red-600 font-bold mt-4">Touched wall!</p>}
      {completed && <p className="text-green-600 font-bold mt-4">Completed!</p>}
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

// Deadly Corners - Stay away from corners
function DeadlyCornersGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [mousePos, setMousePos] = useState({ x: 250, y: 250 })
  const [safe, setSafe] = useState(true)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      
      const dangerZone = 100
      const inDanger = 
        e.clientX < dangerZone || 
        e.clientX > window.innerWidth - dangerZone ||
        e.clientY < dangerZone || 
        e.clientY > window.innerHeight - dangerZone
      
      if (inDanger !== !safe) {
        setSafe(!inDanger)
        if (inDanger) {
          onInput({ action: 'entered_danger', timestamp: Date.now() })
        }
      }
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [safe, onInput])

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Stay away from screen edges!</h3>
      <div className={`text-6xl font-bold ${safe ? 'text-green-600' : 'text-red-600'}`}>
        {safe ? '✓ SAFE' : '✗ DANGER'}
      </div>
    </div>
  )
}

// Group Coinflip - Choose heads or tails
function GroupCoinflipGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [choice, setChoice] = useState<string | null>(null)

  const handleChoice = (side: string) => {
    if (choice) return
    setChoice(side)
    onInput({ choice: side, timestamp: Date.now() })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4">Choose Heads or Tails!</h3>
      <p className="text-gray-600 mb-6">Join the majority to survive</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleChoice('heads')}
          disabled={choice !== null}
          className={`btn text-2xl px-12 py-8 ${choice === 'heads' ? 'btn-primary' : 'bg-gray-300'}`}
        >
          Heads
        </button>
        <button
          onClick={() => handleChoice('tails')}
          disabled={choice !== null}
          className={`btn text-2xl px-12 py-8 ${choice === 'tails' ? 'btn-primary' : 'bg-gray-300'}`}
        >
          Tails
        </button>
      </div>
      {choice && <p className="text-green-600 font-bold mt-4">Choice locked in!</p>}
    </div>
  )
}

// Cursor Chain Reaction - Click spreading circles
function CursorChainReactionGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [clicks, setClicks] = useState(0)

  const handleClick = (e: React.MouseEvent) => {
    setClicks(prev => prev + 1)
    onInput({ x: e.clientX, y: e.clientY, clicks: clicks + 1, timestamp: Date.now() })
  }

  return (
    <div 
      className="bg-white bg-opacity-90 rounded-lg p-12 text-center cursor-crosshair"
      onClick={handleClick}
    >
      <h3 className="text-xl font-bold mb-4">Click to create chain reactions!</h3>
      <div className="text-6xl font-bold text-primary mb-4">{clicks}</div>
      <p className="text-gray-600">Clicks</p>
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
