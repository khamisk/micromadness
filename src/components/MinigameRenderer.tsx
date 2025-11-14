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
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (clicked) return
    const interval = setInterval(() => {
      setElapsed((Date.now() - startTime) / 1000)
    }, 50)
    return () => clearInterval(interval)
  }, [clicked, startTime])

  const handleClick = () => {
    if (clicked) return
    setClicked(true)
    const clickTime = Date.now() - startTime
    onInput({ clickTime })
  }

  const progress = Math.min((elapsed / targetSeconds) * 100, 100)

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-12 text-center">
      <h3 className="text-2xl font-bold mb-8 text-gray-800">
        Click at exactly {targetSeconds}.00 seconds!
      </h3>
      
      {/* Visual timer ring */}
      <div className="relative inline-block mb-8">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle cx="140" cy="140" r="120" fill="none" stroke="#e5e7eb" strokeWidth="16" />
          <circle 
            cx="140" 
            cy="140" 
            r="120" 
            fill="none" 
            stroke={clicked ? '#10b981' : '#6366f1'}
            strokeWidth="16"
            strokeDasharray={`${2 * Math.PI * 120}`}
            strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
            className="transition-all duration-50"
          />
        </svg>
        <button
          onClick={handleClick}
          disabled={clicked}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-8 px-16 rounded-full text-3xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
        >
          {clicked ? '✓' : 'CLICK'}
        </button>
      </div>
      
      <p className="text-gray-600 text-sm">
        🤫 No timer shown - trust your instinct!
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
  const [flash, setFlash] = useState(false)

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
          setFlash(true)
          setTimeout(() => setFlash(false), 100)
          onInput({ key: e.key, timestamp: Date.now(), segmentIndex: currentSegment })
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSegment, keySequence, onInput])

  const currentKey = keySequence[currentSegment] || '?'

  return (
    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Mash the keys as fast as you can!</h3>
      <div className="mb-8 relative">
        <div className={`inline-block px-20 py-16 rounded-3xl shadow-2xl transition-all duration-100 ${
          flash ? 'bg-gradient-to-br from-green-400 to-green-600 scale-110' : 'bg-gradient-to-br from-orange-500 to-red-600'
        }`}>
          <div className="text-9xl font-black text-white drop-shadow-lg animate-pulse">
            {currentKey}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="text-3xl font-bold text-gray-700 bg-white px-8 py-3 rounded-full shadow-lg">
          ⚡ Score: <span className="text-orange-600">{score}</span>
        </div>
        <div className="text-sm text-gray-600">
          Segment {currentSegment + 1}/{keySequence.length}
        </div>
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
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setPresses(prev => prev + 1)
        setPulse(true)
        setTimeout(() => setPulse(false), 100)
        onInput({ action: 'press', timestamp: Date.now() })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onInput])

  const ropePosition = Math.min(Math.max(presses % 100, 0), 100)

  return (
    <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-12 text-center">
      <h3 className="text-2xl font-bold mb-8 text-gray-800">⚔️ TUG OF WAR! ⚔️</h3>
      
      {/* Rope visualization */}
      <div className="relative h-32 bg-gradient-to-r from-red-300 via-gray-300 to-blue-300 rounded-lg mb-8 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-between px-4 text-4xl">
          <span>🔴</span>
          <span>🔵</span>
        </div>
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-600 flex items-center justify-center text-2xl transition-all duration-100 ${pulse ? 'scale-125' : ''}`}
          style={{ left: `calc(${ropePosition}% - 32px)` }}
        >
          🏴
        </div>
      </div>
      
      <div className="bg-white rounded-full px-8 py-6 inline-block shadow-lg mb-4">
        <div className="text-7xl font-black text-blue-600">{presses}</div>
      </div>
      <p className="text-gray-700 font-bold text-xl">⌨️ Press SPACEBAR!</p>
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
  const [survived, setSurvived] = useState(true)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPlayerX(prev => Math.max(60, prev - 40))
        onInput({ action: 'move', direction: 'left', x: Math.max(60, playerX - 40), timestamp: Date.now() })
      } else if (e.key === 'ArrowRight') {
        setPlayerX(prev => Math.min(440, prev + 40))
        onInput({ action: 'move', direction: 'right', x: Math.min(440, playerX + 40), timestamp: Date.now() })
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onInput, playerX])

  return (
    <div className="bg-gradient-to-br from-sky-200 to-sky-400 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4 text-gray-800">⚡ Dodge Falling Objects! ⚡</h3>
      <p className="text-sm text-gray-700 mb-4">Use ← → Arrow Keys</p>
      
      <div className="relative w-full h-96 bg-gradient-to-b from-sky-300 to-green-300 rounded-lg overflow-hidden border-4 border-gray-700">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-green-700 to-green-900" />
        
        {/* Player stickman */}
        <div 
          className="absolute bottom-20 transition-all duration-100"
          style={{ left: `${playerX}px`, transform: 'translateX(-50%)' }}
        >
          <div className="text-5xl">{survived ? '🏃' : '💥'}</div>
        </div>
        
        {/* Visual indicators */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
          {survived ? '✅ Alive' : '❌ Hit!'}
        </div>
      </div>
    </div>
  )
}

// Stickman Parkour - Jump platforms
function StickmanParkourGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [jumps, setJumps] = useState(0)
  const [isJumping, setIsJumping] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isJumping) {
        setIsJumping(true)
        setJumps(prev => prev + 1)
        onInput({ action: 'jump', timestamp: Date.now() })
        setTimeout(() => setIsJumping(false), 400)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onInput, isJumping])

  return (
    <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4 text-gray-800">🎯 Parkour Challenge!</h3>
      <p className="text-sm text-gray-700 mb-4">Press SPACEBAR to jump over obstacles</p>
      
      <div className="relative h-64 bg-gradient-to-b from-blue-200 to-blue-400 rounded-lg overflow-hidden border-4 border-gray-800 mb-6">
        {/* Platforms */}
        <div className="absolute bottom-0 left-0 w-1/3 h-16 bg-gradient-to-b from-gray-600 to-gray-800" />
        <div className="absolute bottom-0 right-0 w-1/3 h-16 bg-gradient-to-b from-gray-600 to-gray-800" />
        
        {/* Jumping stickman */}
        <div 
          className="absolute left-1/4 transition-all duration-400"
          style={{ 
            bottom: isJumping ? '120px' : '64px',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-5xl">🤸</div>
        </div>
        
        {/* Obstacles */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-red-600 rounded" />
      </div>
      
      <div className="bg-white rounded-full px-8 py-4 inline-block shadow-lg">
        <div className="text-5xl font-bold text-purple-600">🏆 {jumps}</div>
        <p className="text-sm text-gray-600 mt-1">Jumps</p>
      </div>
    </div>
  )
}

// Stay In Circle - Keep cursor in shrinking circle
function StayInCircleGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [inCircle, setInCircle] = useState(true)
  const [radius, setRadius] = useState(200)
  const [timeInside, setTimeInside] = useState(0)

  useEffect(() => {
    const shrink = setInterval(() => {
      setRadius(prev => Math.max(30, prev - 1))
      if (inCircle) {
        setTimeInside(prev => prev + 100)
      }
    }, 100)

    return () => clearInterval(shrink)
  }, [inCircle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Dark background
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, radius - 20, centerX, centerY, radius + 30)
      gradient.addColorStop(0, inCircle ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Circle
      ctx.fillStyle = inCircle ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.strokeStyle = inCircle ? '#22c55e' : '#ef4444'
      ctx.lineWidth = 4
      ctx.stroke()
      
      // Center text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(Math.round(radius).toString(), centerX, centerY)
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
          onInput({ action: 'left_circle', timeInside, timestamp: Date.now() })
        }
      }
    }

    const interval = setInterval(draw, 16)
    canvas.addEventListener('mousemove', handleMove)

    return () => {
      clearInterval(interval)
      canvas.removeEventListener('mousemove', handleMove)
    }
  }, [radius, inCircle, onInput, timeInside])

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 text-center">
      <h3 className="text-xl font-bold mb-4 text-white">🎯 Stay Inside the Shrinking Circle!</h3>
      <canvas ref={canvasRef} width={500} height={500} className="border-4 border-gray-600 mx-auto rounded-lg cursor-none" />
      <div className="mt-4 flex items-center justify-center gap-6">
        <p className={`font-bold text-2xl ${inCircle ? 'text-green-400' : 'text-red-400'}`}>
          {inCircle ? '✅ Inside' : '❌ Outside'}
        </p>
        <p className="text-gray-300">
          Time: {(timeInside / 1000).toFixed(1)}s
        </p>
      </div>
    </div>
  )
}

// Memory Grid - Remember pattern
function MemoryGridGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const pattern = minigame.config?.pattern || [0, 4, 8, 12]
  const [showPattern, setShowPattern] = useState(true)
  const [selected, setSelected] = useState<number[]>([])
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShowPattern(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = (index: number) => {
    if (showPattern) return
    
    const newSelected = [...selected, index]
    setSelected(newSelected)
    
    onInput({ selected: newSelected, timestamp: Date.now() })
  }

  const isCorrect = (index: number) => {
    const position = selected.indexOf(index)
    return position >= 0 && pattern[position] === index
  }

  return (
    <div className="bg-gradient-to-br from-indigo-200 to-purple-200 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        {showPattern ? `🧠 Memorize! (${countdown}s)` : '👆 Click the Pattern!'}
      </h3>
      <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto mb-4">
        {Array.from({ length: 25 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-20 h-20 rounded-lg transition-all duration-200 text-2xl font-bold shadow-lg ${
              showPattern && pattern.includes(i)
                ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 animate-pulse scale-110'
                : selected.includes(i)
                ? isCorrect(i) 
                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                  : 'bg-gradient-to-br from-red-400 to-red-600 text-white'
                : 'bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 hover:scale-105'
            }`}
            disabled={showPattern}
          >
            {selected.includes(i) && (isCorrect(i) ? '✓' : '✗')}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-700">
        Selected: {selected.length}/{pattern.length}
      </p>
    </div>
  )
}

// Territory Grab - Click tiles to claim
function TerritoryGrabGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [claimed, setClaimed] = useState<Set<number>>(new Set())
  const [lastClaimed, setLastClaimed] = useState<number | null>(null)

  const handleClick = (index: number) => {
    const newClaimed = new Set(claimed)
    newClaimed.add(index)
    setClaimed(newClaimed)
    setLastClaimed(index)
    
    onInput({ claimed: index, total: newClaimed.size, timestamp: Date.now() })
  }

  const colors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-purple-400 to-purple-600',
  ]

  return (
    <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4 text-gray-800">📍 Claim Territory!</h3>
      <p className="text-sm text-gray-600 mb-4">Last click wins the tile!</p>
      <div className="grid grid-cols-10 gap-1 max-w-2xl mx-auto mb-4 bg-gray-800 p-2 rounded-lg">
        {Array.from({ length: 100 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-12 h-12 rounded transition-all duration-200 ${
              claimed.has(i) 
                ? `bg-gradient-to-br ${colors[i % colors.length]} shadow-lg ${lastClaimed === i ? 'scale-110 ring-4 ring-white' : ''}`
                : 'bg-gray-600 hover:bg-gray-500 hover:scale-105'
            }`}
          />
        ))}
      </div>
      <div className="bg-white rounded-full px-8 py-3 inline-block shadow-lg">
        <span className="text-3xl font-bold text-teal-600">{claimed.size}</span>
        <span className="text-gray-600 ml-2">/ 100 tiles</span>
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
    const numValue = parseFloat(value)
    if (numValue < 0 || numValue > 100) return
    setSubmitted(true)
    onInput({ value: numValue, timestamp: Date.now() })
  }

  return (
    <div className="bg-gradient-to-br from-cyan-100 to-blue-200 rounded-lg p-12 text-center">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">🧠 Average Bait</h3>
      <div className="bg-white rounded-lg p-6 mb-6 shadow-lg max-w-md mx-auto">
        <p className="text-gray-700 mb-2">Choose a number between <span className="font-bold">0-100</span></p>
        <p className="text-sm text-gray-600">The player furthest from the average loses!</p>
      </div>
      
      <div className="mb-6">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={submitted}
          className="text-6xl font-bold text-center w-64 px-6 py-4 border-4 border-blue-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-200 text-gray-900 placeholder-gray-400"
          placeholder="?"
          min="0"
          max="100"
          autoFocus
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={submitted || !value}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-2xl px-16 py-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-xl"
      >
        {submitted ? '✓ Submitted!' : '🚀 Submit'}
      </button>
    </div>
  )
}

// Vote To Kill - Vote for a player
function VoteToKillGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const players = minigame.config?.players || []
  const [voted, setVoted] = useState<string | null>(null)
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null)

  const handleVote = (playerId: string) => {
    if (voted) return
    setVoted(playerId)
    onInput({ vote: playerId, timestamp: Date.now() })
  }

  return (
    <div className="bg-gradient-to-br from-red-200 to-pink-200 rounded-lg p-12 text-center">
      <h3 className="text-2xl font-bold mb-2 text-gray-800">☠️ Vote to Eliminate! ☠️</h3>
      <p className="text-sm text-gray-600 mb-6">Choose wisely... someone must go</p>
      
      {players.length === 0 ? (
        <p className="text-gray-600">Waiting for players...</p>
      ) : (
        <div className="grid gap-4 max-w-lg mx-auto">
          {players.map((player: any) => {
            const playerId = typeof player === 'string' ? player : player.playerId
            const playerName = typeof player === 'string' ? player : player.username
            
            return (
              <button
                key={playerId}
                onClick={() => handleVote(playerId)}
                onMouseEnter={() => setHoveredPlayer(playerId)}
                onMouseLeave={() => setHoveredPlayer(null)}
                disabled={!!voted}
                className={`relative px-8 py-6 rounded-xl font-bold text-xl transition-all duration-200 ${
                  voted === playerId
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white scale-105 shadow-2xl'
                    : voted
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : hoveredPlayer === playerId
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white scale-105 shadow-xl'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:shadow-lg'
                }`}
              >
                <span className="text-3xl mr-3">{voted === playerId ? '☠️' : '👤'}</span>
                {playerName}
                {voted === playerId && <span className="ml-3">✓</span>}
              </button>
            )
          })}
        </div>
      )}
      
      {voted && (
        <p className="text-red-700 font-bold mt-6 text-lg animate-pulse">
          ✓ Vote cast!
        </p>
      )}
    </div>
  )
}

// Bullet Hell - Avoid projectiles
function BulletHellGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [survived, setSurvived] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 250, y: 250 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePos({ x, y })
      onInput({ position: { x, y }, timestamp: Date.now() })
    }

    const draw = () => {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = '#222'
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw player
      ctx.fillStyle = survived ? '#3b82f6' : '#ef4444'
      ctx.shadowBlur = 20
      ctx.shadowColor = survived ? '#3b82f6' : '#ef4444'
      ctx.beginPath()
      ctx.arc(mousePos.x, mousePos.y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    canvas.addEventListener('mousemove', handleMove)
    const interval = setInterval(draw, 16)

    return () => {
      canvas.removeEventListener('mousemove', handleMove)
      clearInterval(interval)
    }
  }, [mousePos, survived, onInput])

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4 text-white">🔫 Bullet Hell! 🔫</h3>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500} 
        className="border-4 border-red-600 mx-auto rounded cursor-none"
      />
      <p className={`mt-4 font-bold text-2xl ${survived ? 'text-green-400' : 'text-red-400'}`}>
        {survived ? '✅ Surviving!' : '❌ Hit!'}
      </p>
    </div>
  )
}

// Reverse APM - Click buttons in descending order
function ReverseAPMGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [currentNumber, setCurrentNumber] = useState(20)
  const [completed, setCompleted] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleClick = (num: number) => {
    if (completed || failed) return
    
    if (num === currentNumber) {
      onInput({ clickedNumber: num, correct: true, timestamp: Date.now() })
      if (num === 0) {
        setCompleted(true)
      } else {
        setCurrentNumber(prev => prev - 1)
      }
    } else {
      setFailed(true)
      onInput({ clickedNumber: num, correct: false, timestamp: Date.now() })
    }
  }

  return (
    <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4 text-gray-800">🔢 Click in Order: 20 → 0</h3>
      <p className="text-sm text-gray-600 mb-4">Click the buttons in descending order!</p>
      
      <div className="mb-6">
        <div className="text-6xl font-bold text-orange-600 mb-2">
          {completed ? '✓' : failed ? '✗' : currentNumber}
        </div>
        <p className="text-sm text-gray-600">
          {completed ? 'Complete!' : failed ? 'Wrong order!' : 'Next number to click'}
        </p>
      </div>
      
      <div className="grid grid-cols-7 gap-2 max-w-2xl mx-auto">
        {Array.from({ length: 21 }, (_, i) => 20 - i).map((num) => (
          <button
            key={num}
            onClick={() => handleClick(num)}
            disabled={num > currentNumber || completed || failed}
            className={`w-16 h-16 rounded-lg font-bold text-lg transition-all ${
              num > currentNumber
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : num === currentNumber
                ? 'bg-gradient-to-br from-green-400 to-green-600 text-white animate-pulse scale-110 shadow-lg'
                : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
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

// Stickman Cannon Jump - Jump over cannonballs
function StickmanCannonJumpGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [jumps, setJumps] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [cannonFired, setCannonFired] = useState(false)

  useEffect(() => {
    const fireInterval = setInterval(() => {
      setCannonFired(true)
      setTimeout(() => setCannonFired(false), 800)
    }, 2000)

    return () => clearInterval(fireInterval)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isJumping) {
        setIsJumping(true)
        setJumps(prev => prev + 1)
        onInput({ action: 'jump', timestamp: Date.now() })
        setTimeout(() => setIsJumping(false), 600)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onInput, isJumping])

  return (
    <div className="bg-gradient-to-br from-orange-200 to-red-200 rounded-lg p-12 text-center">
      <h3 className="text-xl font-bold mb-4 text-gray-800">💣 Jump Over Cannonballs! 💣</h3>
      <p className="text-sm text-gray-700 mb-4">Press SPACEBAR to jump!</p>
      
      <div className="relative h-72 bg-gradient-to-b from-blue-300 to-green-400 rounded-lg overflow-hidden border-4 border-gray-800 mb-6">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-green-600 to-green-800" />
        
        {/* Cannon */}
        <div className="absolute bottom-16 left-8">
          <div className={`w-16 h-8 bg-gray-700 rounded-r-full transition-transform ${cannonFired ? 'scale-110' : ''}`} />
          <div className="w-8 h-12 bg-gray-800 ml-2" />
        </div>
        
        {/* Cannonball */}
        {cannonFired && (
          <div 
            className="absolute bottom-24 left-24 w-8 h-8 bg-gray-900 rounded-full animate-ping"
            style={{ animation: 'ping 0.8s cubic-bezier(0, 0, 0.2, 1)' }}
          />
        )}
        
        {/* Player */}
        <div 
          className="absolute right-1/4 transition-all duration-600"
          style={{ 
            bottom: isJumping ? '140px' : '64px',
            transform: 'translateX(50%)'
          }}
        >
          <div className="text-5xl">{isJumping ? '🤸' : '🧑'}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-full px-8 py-4 inline-block shadow-lg">
        <div className="text-5xl font-bold text-orange-600">⚡ {jumps}</div>
        <p className="text-sm text-gray-600 mt-1">Successful Jumps</p>
      </div>
    </div>
  )
}

// Math Flash Rush - Solve math quickly
function MathFlashRushGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const [problem, setProblem] = useState({ a: 5, b: 3, op: '+' })
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)

  useEffect(() => {
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    const ops = ['+', '-', '×']
    const op = ops[Math.floor(Math.random() * ops.length)]
    setProblem({ a, b, op })
  }, [])

  const checkAnswer = () => {
    if (!answer) return
    
    let correct = 0
    switch (problem.op) {
      case '+': correct = problem.a + problem.b; break
      case '-': correct = problem.a - problem.b; break
      case '×': correct = problem.a * problem.b; break
    }

    const isCorrect = parseInt(answer) === correct
    
    setFlash(isCorrect ? 'correct' : 'wrong')
    setTimeout(() => setFlash(null), 200)
    
    if (isCorrect) {
      setScore(prev => prev + 1)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    onInput({ answer: parseInt(answer), correct: isCorrect, timestamp: Date.now() })

    // Next problem
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    const ops = ['+', '-', '×']
    const op = ops[Math.floor(Math.random() * ops.length)]
    setProblem({ a, b, op })
    setAnswer('')
  }

  return (
    <div className={`rounded-lg p-12 text-center transition-colors duration-200 ${
      flash === 'correct' 
        ? 'bg-gradient-to-br from-green-300 to-green-400' 
        : flash === 'wrong'
        ? 'bg-gradient-to-br from-red-300 to-red-400'
        : 'bg-gradient-to-br from-indigo-200 to-purple-200'
    }`}>
      <h3 className="text-xl font-bold mb-2 text-gray-800">⚡ Math Flash Rush! ⚡</h3>
      <p className="text-sm text-gray-600 mb-4">Solve equations as fast as you can!</p>
      
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-2xl">
        <div className="text-8xl font-black text-gray-800 mb-4 font-mono">
          {problem.a} {problem.op} {problem.b} = ?
        </div>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          className="text-6xl font-bold text-center w-64 px-6 py-4 border-4 border-purple-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 text-gray-900 placeholder-gray-400"
          placeholder="?"
          autoFocus
        />
      </div>
      
      <button 
        onClick={checkAnswer} 
        disabled={!answer}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-2xl px-16 py-6 rounded-full disabled:opacity-50 transition-all hover:scale-105 shadow-xl mb-6"
      >
        🚀 Submit
      </button>
      
      <div className="flex justify-center gap-8">
        <div className="bg-white rounded-full px-8 py-4 shadow-lg">
          <div className="text-4xl font-bold text-green-600">🎯 {score}</div>
          <p className="text-sm text-gray-600">Correct</p>
        </div>
        <div className="bg-white rounded-full px-8 py-4 shadow-lg">
          <div className="text-4xl font-bold text-orange-600">🔥 {streak}</div>
          <p className="text-sm text-gray-600">Streak</p>
        </div>
      </div>
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
