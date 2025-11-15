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
// Perfect Stopwatch - MARIO PARTY QUALITY with spectacular timing visuals
function PerfectStopwatchGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const targetSeconds = minigame.config?.targetSeconds || 7
  const [startTime] = useState(Date.now())
  const [clicked, setClicked] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>>([])

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
    
    const isPerfect = Math.abs(elapsed - targetSeconds) < 0.05
    for (let i = 0; i < (isPerfect ? 50 : 20); i++) {
      setParticles(prev => [...prev, {
        x: 300, y: 300,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        life: 80,
        color: isPerfect ? '#fbbf24' : '#3b82f6'
      }])
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, '#4c1d95')
      grd.addColorStop(1, '#5b21b6')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 180
      const progress = Math.min(elapsed / targetSeconds, 1)

      ctx.shadowBlur = 30
      ctx.shadowColor = '#8b5cf6'
      ctx.strokeStyle = '#1e1b4b'
      ctx.lineWidth = 25
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.shadowBlur = 0

      const startAngle = -Math.PI / 2
      const endAngle = startAngle + (Math.PI * 2 * progress)
      
      const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
      gradient.addColorStop(0, '#3b82f6')
      gradient.addColorStop(0.5, '#8b5cf6')
      gradient.addColorStop(1, '#ec4899')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 20
      ctx.lineCap = 'round'
      ctx.shadowBlur = 20 + Math.sin(Date.now() / 200) * 10
      ctx.shadowColor = '#8b5cf6'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.stroke()
      ctx.shadowBlur = 0

      if (!clicked) {
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 70px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 4
        ctx.strokeText(elapsed.toFixed(2), centerX, centerY)
        ctx.fillText(elapsed.toFixed(2), centerX, centerY)
      }

      const updated = particles.map(p => ({
        ...p, x: p.x + p.vx, y: p.y + p.vy, vx: p.vx * 0.98, vy: p.vy * 0.98, life: p.life - 1
      })).filter(p => p.life > 0)
      updated.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 80
        ctx.beginPath()
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setParticles(updated)
    }

    const animationId = setInterval(draw, 1000 / 60)
    return () => clearInterval(animationId)
  }, [elapsed, clicked, targetSeconds, particles])

  const precision = clicked ? Math.abs(elapsed - targetSeconds).toFixed(3) : ''
  const isPerfect = clicked && Math.abs(elapsed - targetSeconds) < 0.05

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 rounded-xl p-12 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        ⏱️ PERFECT STOPWATCH! ⏱️
      </h3>
      <p className="text-2xl font-bold mb-6 text-purple-300 drop-shadow-lg">
        Click at EXACTLY {targetSeconds}.00 seconds!
      </p>
      
      {clicked && (
        <div className={`text-6xl font-black mb-6 drop-shadow-2xl ${isPerfect ? 'text-yellow-400 animate-bounce' : 'text-orange-400'}`}>
          {isPerfect ? '🎯 PERFECT!!!' : `±${precision}s`}
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        width={600}
        height={600}
        onClick={handleClick}
        className="border-8 border-purple-900 mx-auto rounded-2xl shadow-2xl cursor-pointer mb-6"
      />
      
      {!clicked && (
        <div className="text-3xl font-black text-purple-300 drop-shadow-lg animate-pulse">
          🎯 CLICK WHEN READY! 🎯
        </div>
      )}
      
      {isPerfect && clicked && (
        <div className="mt-6 text-3xl font-bold text-yellow-300 drop-shadow-lg animate-bounce">
          ⭐ LEGENDARY TIMING! ⭐
        </div>
      )}
    </div>
  )
}

// Adaptive Mash - MARIO PARTY QUALITY with explosive visual feedback!
function AdaptiveMashGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const keySequence = minigame.config?.keySequence || []
  const segmentDuration = minigame.config?.segmentDuration || 2000
  const [currentSegment, setCurrentSegment] = useState(0)
  const [score, setScore] = useState(0)
  const [flash, setFlash] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>>([])

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
          
          for (let i = 0; i < 20; i++) {
            setParticles(prev => [...prev, {
              x: 350, y: 300,
              vx: (Math.random() - 0.5) * 20,
              vy: (Math.random() - 0.5) * 20,
              life: 60,
              color: ['#fbbf24', '#f97316', '#ef4444'][Math.floor(Math.random() * 3)]
            }])
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSegment, keySequence, onInput])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, '#fbbf24')
      grd.addColorStop(0.5, '#f97316')
      grd.addColorStop(1, '#dc2626')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const keyText = currentKey
      const scale = flash ? 1.15 : 1 + Math.sin(Date.now() / 200) * 0.05
      ctx.save()
      ctx.translate(350, 300)
      ctx.scale(scale, scale)
      
      ctx.shadowBlur = 30
      ctx.shadowColor = flash ? '#22c55e' : '#000'
      ctx.fillStyle = flash ? '#22c55e' : '#fff'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 12
      ctx.font = 'bold 200px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.strokeText(keyText, 0, 0)
      ctx.fillText(keyText, 0, 0)
      ctx.restore()
      ctx.shadowBlur = 0

      const updated = particles.map(p => ({
        ...p, x: p.x + p.vx, y: p.y + p.vy, vx: p.vx * 0.96, vy: p.vy * 0.96, life: p.life - 1
      })).filter(p => p.life > 0)
      updated.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 60
        ctx.beginPath()
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setParticles(updated)
    }

    const animationId = setInterval(draw, 1000 / 60)
    return () => clearInterval(animationId)
  }, [flash, currentSegment, keySequence, particles])

  const currentKey = keySequence[currentSegment] || '?'
  const combo = Math.floor(score / 3)
  const progress = ((currentSegment + 1) / keySequence.length) * 100

  return (
    <div className="bg-gradient-to-br from-orange-900 via-red-700 to-yellow-600 rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        ⚡ KEY MASH FRENZY! ⚡
      </h3>
      
      <div className="w-full max-w-3xl mx-auto mb-6 bg-black/40 rounded-full h-6 overflow-hidden border-4 border-white shadow-2xl">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 h-full transition-all duration-300 shadow-lg" style={{ width: `${progress}%` }} />
      </div>
      
      <canvas 
        ref={canvasRef}
        width={700}
        height={600}
        className="border-8 border-orange-600 mx-auto rounded-2xl shadow-2xl mb-6"
      />
      
      <div className="flex items-center justify-center gap-8">
        <div className="bg-white px-12 py-6 rounded-2xl shadow-2xl">
          <div className="text-7xl font-black text-orange-600">{score}</div>
          <div className="text-sm font-bold text-gray-700">Presses</div>
        </div>
        {combo > 0 && (
          <div className="bg-gradient-to-br from-red-500 to-orange-600 px-12 py-6 rounded-2xl shadow-2xl border-4 border-yellow-400 animate-bounce">
            <div className="text-6xl font-black text-white">🔥 x{combo}</div>
            <div className="text-sm font-bold text-yellow-200">COMBO!</div>
          </div>
        )}
        <div className="bg-gray-800 px-8 py-6 rounded-2xl shadow-2xl text-white">
          <div className="text-3xl font-bold">{currentSegment + 1}/{keySequence.length}</div>
          <div className="text-sm">Segments</div>
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
  const [startTime] = useState(Date.now())
  const [errors, setErrors] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Count errors
    if (value.length > input.length && value[value.length - 1] !== sentence[value.length - 1]) {
      setErrors(prev => prev + 1)
    }
    
    setInput(value)
    
    if (value === sentence && !completed) {
      setCompleted(true)
      const elapsed = (Date.now() - startTime) / 1000
      const wpm = Math.round((sentence.split(' ').length / elapsed) * 60)
      onInput({ text: value, timestamp: Date.now(), wpm, errors })
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
  }

  const accuracy = input.length > 0 ? Math.round((1 - errors / input.length) * 100) : 100
  const elapsed = (Date.now() - startTime) / 1000
  const currentWpm = input.length > 0 ? Math.round((sentence.split(' ').length / elapsed) * 60) : 0

  return (
    <div className="bg-gradient-to-br from-cyan-900 via-blue-700 to-indigo-900 rounded-xl p-12 shadow-2xl">
      <div className="text-center mb-8">
        <h3 className="text-5xl font-black mb-6 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
          ⌨️ SPEED TYPING MASTER! ⌨️
        </h3>
        
        <div className="text-4xl font-mono font-black bg-black/60 p-8 rounded-2xl mb-6 text-left max-w-4xl mx-auto border-8 border-cyan-500 shadow-2xl">
          {sentence.split('').map((char: string, i: number) => (
            <span key={i} className={
              i < input.length 
                ? input[i] === char ? 'text-green-400' : 'text-red-500 underline decoration-4'
                : i === input.length ? 'text-white bg-cyan-500 px-1 animate-pulse' : 'text-gray-400'
            }>
              {char}
            </span>
          ))}
        </div>
        
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onPaste={handlePaste}
          disabled={completed}
          className="text-3xl text-center w-full max-w-4xl font-mono bg-white/90 border-8 border-cyan-400 rounded-2xl px-8 py-6 focus:outline-none focus:border-cyan-600 shadow-2xl font-bold"
          placeholder="Start typing..."
          autoFocus
        />
        
        <div className="flex justify-center gap-8 mt-8">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 px-10 py-6 rounded-2xl shadow-2xl border-4 border-white">
            <div className="text-7xl font-black text-white">{currentWpm}</div>
            <div className="text-sm font-bold text-cyan-100">Words Per Minute</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-10 py-6 rounded-2xl shadow-2xl border-4 border-white">
            <div className="text-7xl font-black text-white">{accuracy}%</div>
            <div className="text-sm font-bold text-green-100">Accuracy</div>
          </div>
          <div className="bg-white px-10 py-6 rounded-2xl shadow-2xl">
            <div className="text-6xl font-black text-blue-600">{input.length}/{sentence.length}</div>
            <div className="text-sm font-bold text-gray-700">Progress</div>
          </div>
        </div>
        
        {completed && (
          <div className="mt-8 text-6xl font-black text-yellow-400 drop-shadow-2xl animate-bounce">
            ✓ COMPLETE! {currentWpm} WPM! 🎯
          </div>
        )}
      </div>
    </div>
  )
}

// Team Tug of War - MARIO PARTY QUALITY with animated teams
function TeamTugOfWarGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [presses, setPresses] = useState(0)
  const [ropePosition, setRopePosition] = useState(0)
  const [leftScore, setLeftScore] = useState(0)
  const [rightScore, setRightScore] = useState(0)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>>([])
  const [myTeam] = useState<'left' | 'right'>('left')
  const teamMembers = minigame.config?.teamMembers || { left: [{username: 'You'}, {username: 'P2'}], right: [{username: 'P3'}, {username: 'P4'}] }

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).io) {
      const socket = (window as any).io
      socket.on('tugOfWarUpdate', (data: any) => {
        setRopePosition(data.ropePosition)
        setLeftScore(data.leftScore)
        setRightScore(data.rightScore)
        if (Math.abs(data.ropePosition) > 30) {
          addParticles(data.ropePosition > 0 ? 'left' : 'right')
        }
      })
      return () => socket.off('tugOfWarUpdate')
    }
  }, [])

  const addParticles = (team: 'left' | 'right') => {
    const x = team === 'left' ? 150 : 550
    setParticles(prev => [...prev, ...Array.from({ length: 8 }, () => ({
      x, y: 200, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 1) * 8,
      life: 50, color: team === 'left' ? '#3b82f6' : '#ef4444'
    }))])
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setPresses(prev => prev + 1)
        onInput({ action: 'press', timestamp: Date.now() })
        setParticles(prev => [...prev, {
          x: myTeam === 'left' ? 200 : 500, y: 350,
          vx: (Math.random() - 0.5) * 4, vy: -6, life: 30,
          color: myTeam === 'left' ? '#3b82f6' : '#ef4444'
        }])
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onInput, myTeam])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, '#87CEEB')
      grd.addColorStop(1, '#e0f7fa')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#2d5016'
      ctx.fillRect(0, canvas.height - 120, canvas.width, 120)
      
      const ropeY = canvas.height / 2
      const ropeOffset = (ropePosition / 50) * 250
      const centerX = canvas.width / 2 + ropeOffset

      ctx.strokeStyle = '#8B4513'
      ctx.lineWidth = 14
      ctx.beginPath()
      ctx.moveTo(100, ropeY)
      ctx.lineTo(canvas.width - 100, ropeY)
      ctx.stroke()

      const flagColor = ropePosition > 10 ? '#ef4444' : ropePosition < -10 ? '#3b82f6' : '#fbbf24'
      ctx.fillStyle = flagColor
      ctx.shadowBlur = 15
      ctx.shadowColor = flagColor
      ctx.beginPath()
      ctx.moveTo(centerX, ropeY - 50)
      ctx.lineTo(centerX + 40, ropeY - 35)
      ctx.lineTo(centerX, ropeY - 20)
      ctx.closePath()
      ctx.fill()
      ctx.shadowBlur = 0

      const drawPlayer = (x: number, y: number, color: string, pulling: boolean, name: string) => {
        const baseY = y + Math.sin(Date.now() / 200 + x) * 3
        ctx.fillStyle = color
        ctx.shadowBlur = 10
        ctx.shadowColor = color
        ctx.beginPath()
        ctx.arc(x, baseY - 15, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        
        ctx.strokeStyle = color
        ctx.lineWidth = 8
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x, baseY)
        ctx.lineTo(x, baseY + 30)
        ctx.moveTo(x, baseY + 10)
        ctx.lineTo(x - 20, baseY + (pulling ? 20 : 15))
        ctx.moveTo(x, baseY + 30)
        ctx.lineTo(x - 12, baseY + 50)
        ctx.moveTo(x, baseY + 30)
        ctx.lineTo(x + 12, baseY + 50)
        ctx.stroke()
        
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.strokeText(name, x, baseY - 35)
        ctx.fillText(name, x, baseY - 35)
      }

      teamMembers.left.forEach((p: any, i: number) => {
        drawPlayer(180 + i * 80, canvas.height - 180, '#3b82f6', ropePosition < 0, p.username || `P${i+1}`)
      })
      teamMembers.right.forEach((p: any, i: number) => {
        drawPlayer(canvas.width - 180 - i * 80, canvas.height - 180, '#ef4444', ropePosition > 0, p.username || `P${i+1}`)
      })

      const updated = particles.map(p => ({
        ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.4, life: p.life - 1
      })).filter(p => p.life > 0)
      updated.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 50
        ctx.beginPath()
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setParticles(updated)

      ctx.fillStyle = '#3b82f6'
      ctx.font = 'bold 50px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(leftScore.toString(), 100, 80)
      ctx.fillStyle = '#ef4444'
      ctx.fillText(rightScore.toString(), canvas.width - 100, 80)
    }

    const animationId = setInterval(draw, 1000 / 60)
    return () => clearInterval(animationId)
  }, [ropePosition, leftScore, rightScore, teamMembers, particles])

  return (
    <div className="bg-gradient-to-br from-sky-300 via-blue-200 to-green-200 rounded-xl p-6 text-center shadow-2xl">
      <h3 className="text-4xl font-black mb-3 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
        ⚔️ TUG OF WAR! ⚔️
      </h3>
      <p className="text-xl font-bold mb-4 text-gray-800">
        Team <span className={myTeam === 'left' ? 'text-blue-600' : 'text-red-600'}>
          {myTeam === 'left' ? '🔵 BLUE' : '🔴 RED'}
        </span>!
      </p>
      
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={500}
        className="border-8 border-amber-900 mx-auto rounded-2xl shadow-2xl"
      />
      
      <div className="mt-6 flex items-center justify-center gap-8">
        <div className="bg-blue-600 text-white px-10 py-6 rounded-2xl shadow-2xl">
          <div className="text-6xl font-black">{leftScore}</div>
          <div className="text-sm font-bold">Blue Team</div>
        </div>
        <div className="bg-white px-10 py-6 rounded-2xl shadow-2xl border-4 border-amber-400">
          <div className="text-5xl font-black text-gray-800">{presses}</div>
          <div className="text-sm">Your Presses</div>
        </div>
        <div className="bg-red-600 text-white px-10 py-6 rounded-2xl shadow-2xl">
          <div className="text-6xl font-black">{rightScore}</div>
          <div className="text-sm font-bold">Red Team</div>
        </div>
      </div>
      
      <div className="mt-8 text-3xl font-black text-white drop-shadow-lg animate-pulse">
        ⌨️ MASH SPACEBAR! ⌨️
      </div>
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
      
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, '#0f172a')
      grd.addColorStop(1, '#1e1b4b')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = pathWidth + 22
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(path[0][0], path[0][1])
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0], path[i][1])
      }
      ctx.stroke()
      
      const pathGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      pathGrad.addColorStop(0, '#475569')
      pathGrad.addColorStop(1, '#64748b')
      ctx.strokeStyle = pathGrad
      ctx.lineWidth = pathWidth
      ctx.shadowBlur = 15
      ctx.shadowColor = '#3b82f6'
      ctx.beginPath()
      ctx.moveTo(path[0][0], path[0][1])
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0], path[i][1])
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      const pulse = Math.sin(Date.now() / 300) * 5
      const startGrad = ctx.createRadialGradient(path[0][0], path[0][1], 0, path[0][0], path[0][1], 25 + pulse)
      startGrad.addColorStop(0, started ? '#10b981' : '#22c55e')
      startGrad.addColorStop(1, started ? '#065f46' : '#15803d')
      ctx.fillStyle = startGrad
      ctx.shadowBlur = 25
      ctx.shadowColor = '#22c55e'
      ctx.beginPath()
      ctx.arc(path[0][0], path[0][1], 22 + pulse, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.shadowBlur = 0

      const endGrad = ctx.createRadialGradient(path[path.length - 1][0], path[path.length - 1][1], 0, path[path.length - 1][0], path[path.length - 1][1], 25)
      endGrad.addColorStop(0, '#ef4444')
      endGrad.addColorStop(1, '#991b1b')
      ctx.fillStyle = endGrad
      ctx.shadowBlur = 25
      ctx.shadowColor = '#ef4444'
      ctx.beginPath()
      ctx.arc(path[path.length - 1][0], path[path.length - 1][1], 22, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.shadowBlur = 0
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
    <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900 rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        🧩 PRECISION MAZE! 🧩
      </h3>
      <p className="text-2xl font-bold mb-6 text-yellow-300 drop-shadow-lg">
        {!started ? 'Hover on GREEN to start!' : 'Navigate to RED without touching walls!'}
      </p>
      
      <div className="flex justify-center gap-8 mb-6">
        <div className={`px-10 py-5 rounded-2xl shadow-2xl ${!started ? 'bg-gray-600' : touched ? 'bg-red-600' : completed ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
          <div className="text-5xl font-black">
            {!started ? '⏳ READY' : touched ? '💀 FAIL!' : completed ? '🎯 WIN!' : '🏃 GOING'}
          </div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={450} 
        height={400} 
        className="border-8 border-slate-700 mx-auto rounded-2xl shadow-2xl cursor-crosshair" 
      />
      
      {touched && (
        <div className="mt-6 text-4xl font-black text-red-500 drop-shadow-lg animate-bounce">
          ❌ TOUCHED WALL - FAILED! ❌
        </div>
      )}
      {completed && !touched && (
        <div className="mt-6 text-4xl font-black text-green-400 drop-shadow-lg animate-bounce">
          ✅ PERFECT! MAZE COMPLETE! ✅
        </div>
      )}
      {!started && (
        <div className="mt-6 text-2xl font-black text-white drop-shadow-lg animate-pulse">
          🖱️ HOVER ON GREEN CIRCLE TO BEGIN! 🖱️
        </div>
      )}
    </div>
  )
}

// Stickman Dodgefall - Dodge falling objects
// Stickman Dodgefall - MARIO PARTY QUALITY with spectacular visuals
function StickmanDodgefallGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerX, setPlayerX] = useState(300)
  const [fallingObjects, setFallingObjects] = useState<Array<{x: number, y: number, speed: number, type: 'rock' | 'bomb' | 'anvil', rotation: number}>>([])  
  const [survived, setSurvived] = useState(true)
  const [dodgeCount, setDodgeCount] = useState(0)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>>([])
  const [comboCount, setComboCount] = useState(0)
  const [otherPlayers, setOtherPlayers] = useState<Array<{username: string, x: number, survived: boolean}>>([])

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).io) {
      const socket = (window as any).io
      socket.on('dodgefallPositions', (data: Array<{username: string, x: number, survived: boolean}>) => {
        setOtherPlayers(data)
      })
      return () => socket.off('dodgefallPositions')
    }
  }, [])

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (!survived) return
      const types: Array<'rock' | 'bomb' | 'anvil'> = ['rock', 'bomb', 'anvil']
      setFallingObjects(prev => [...prev, {
        x: Math.random() * 520 + 40,
        y: -20,
        speed: Math.random() * 4 + 3,
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * Math.PI * 2
      }])
    }, 900)

    return () => clearInterval(spawnInterval)
  }, [survived])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!survived) return
      if (e.key === 'ArrowLeft') {
        const newX = Math.max(40, playerX - 45)
        setPlayerX(newX)
        onInput({ action: 'move', direction: 'left', x: newX, survived, timestamp: Date.now() })
      } else if (e.key === 'ArrowRight') {
        const newX = Math.min(560, playerX + 45)
        setPlayerX(newX)
        onInput({ action: 'move', direction: 'right', x: newX, survived, timestamp: Date.now() })
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onInput, playerX, survived])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, survived ? '#0ea5e9' : '#991b1b')
      grd.addColorStop(1, survived ? '#38bdf8' : '#dc2626')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#15803d'
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80)
      
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = '#16a34a'
        const x = i * 70 + Math.sin(Date.now() / 200 + i) * 5
        ctx.fillRect(x, canvas.height - 85, 5, 10)
      }

      const newObjects = fallingObjects.map(obj => {
        const newY = obj.y + obj.speed
        const newRotation = obj.rotation + 0.1
        
        ctx.save()
        ctx.translate(obj.x, obj.y)
        ctx.rotate(newRotation)
        
        if (obj.type === 'rock') {
          ctx.fillStyle = '#78716c'
          ctx.shadowBlur = 10
          ctx.shadowColor = '#000'
          ctx.beginPath()
          ctx.arc(0, 0, 20, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#57534e'
          ctx.beginPath()
          ctx.arc(-5, -5, 8, 0, Math.PI * 2)
          ctx.fill()
        } else if (obj.type === 'bomb') {
          ctx.fillStyle = '#1f2937'
          ctx.shadowBlur = 15
          ctx.shadowColor = '#ef4444'
          ctx.beginPath()
          ctx.arc(0, 0, 22, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#ef4444'
          ctx.font = 'bold 30px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('💣', 0, 0)
        } else {
          ctx.fillStyle = '#52525b'
          ctx.shadowBlur = 12
          ctx.shadowColor = '#000'
          ctx.fillRect(-18, -25, 36, 50)
          ctx.fillStyle = '#71717a'
          ctx.fillRect(-18, -28, 36, 8)
        }
        
        ctx.restore()
        ctx.shadowBlur = 0
        
        const dist = Math.sqrt((obj.x - playerX) ** 2 + (obj.y - (canvas.height - 120)) ** 2)
        if (dist < 40 && survived) {
          setSurvived(false)
          setComboCount(0)
          onInput({ action: 'hit', timestamp: Date.now() })
          for (let i = 0; i < 30; i++) {
            setParticles(prev => [...prev, {
              x: playerX, y: canvas.height - 120,
              vx: (Math.random() - 0.5) * 12,
              vy: (Math.random() - 0.5) * 12,
              life: 60,
              color: '#ef4444'
            }])
          }
        }
        
        if (newY > canvas.height - 60 && survived && !obj.y || newY < 0) {
          setDodgeCount(prev => prev + 1)
          setComboCount(prev => prev + 1)
          for (let i = 0; i < 5; i++) {
            setParticles(prev => [...prev, {
              x: obj.x, y: canvas.height - 80,
              vx: (Math.random() - 0.5) * 6,
              vy: -Math.random() * 8,
              life: 40,
              color: '#22c55e'
            }])
          }
        }

        return { ...obj, y: newY, rotation: newRotation }
      }).filter(obj => obj.y < canvas.height + 50)

      setFallingObjects(newObjects)

      const playerY = canvas.height - 120

      // Draw other players (semi-transparent stickmen)
      otherPlayers.forEach(op => {
        if (Math.abs(op.x - playerX) > 20) {
          const opHeadY = playerY - Math.abs(Math.sin(Date.now() / 300 + op.x)) * 3
          ctx.globalAlpha = 0.5
          ctx.fillStyle = op.survived ? '#94a3b8' : '#64748b'
          ctx.beginPath()
          ctx.arc(op.x, opHeadY, 18, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.strokeStyle = op.survived ? '#94a3b8' : '#64748b'
          ctx.lineWidth = 8
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(op.x, opHeadY + 18)
          ctx.lineTo(op.x, playerY + 40)
          ctx.moveTo(op.x, playerY + 15)
          ctx.lineTo(op.x - 20, playerY + 25)
          ctx.moveTo(op.x, playerY + 15)
          ctx.lineTo(op.x + 20, playerY + 25)
          ctx.moveTo(op.x, playerY + 40)
          ctx.lineTo(op.x - 12, playerY + 60)
          ctx.moveTo(op.x, playerY + 40)
          ctx.lineTo(op.x + 12, playerY + 60)
          ctx.stroke()
          
          ctx.globalAlpha = 1
          ctx.fillStyle = '#fff'
          ctx.strokeStyle = '#000'
          ctx.lineWidth = 2
          ctx.font = 'bold 11px Arial'
          ctx.textAlign = 'center'
          ctx.strokeText(op.username.substring(0, 8), op.x, playerY - 50)
          ctx.fillText(op.username.substring(0, 8), op.x, playerY - 50)
        }
      })
      ctx.globalAlpha = 1

      // Draw main player (prominent)
      const headY = playerY - Math.abs(Math.sin(Date.now() / 300)) * 3
      
      ctx.fillStyle = survived ? '#3b82f6' : '#7f1d1d'
      ctx.shadowBlur = 15
      ctx.shadowColor = survived ? '#3b82f6' : '#dc2626'
      ctx.beginPath()
      ctx.arc(playerX, headY, 20, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(playerX - 6, headY - 3, 5, 0, Math.PI * 2)
      ctx.arc(playerX + 6, headY - 3, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(playerX - 6, headY - 2, 3, 0, Math.PI * 2)
      ctx.arc(playerX + 6, headY - 2, 3, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.shadowBlur = 0
      ctx.strokeStyle = survived ? '#3b82f6' : '#7f1d1d'
      ctx.lineWidth = 10
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(playerX, headY + 20)
      ctx.lineTo(playerX, playerY + 45)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(playerX, playerY + 15)
      ctx.lineTo(playerX - 25, playerY + 30)
      ctx.moveTo(playerX, playerY + 15)
      ctx.lineTo(playerX + 25, playerY + 30)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(playerX, playerY + 45)
      ctx.lineTo(playerX - 15, playerY + 70)
      ctx.moveTo(playerX, playerY + 45)
      ctx.lineTo(playerX + 15, playerY + 70)
      ctx.stroke()

      const updated = particles.map(p => ({
        ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.5, life: p.life - 1
      })).filter(p => p.life > 0)
      updated.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 60
        ctx.beginPath()
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setParticles(updated)

      if (comboCount > 3) {
        ctx.fillStyle = '#fbbf24'
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 3
        ctx.font = 'bold 40px Arial'
        ctx.textAlign = 'center'
        ctx.strokeText(`${comboCount}X COMBO!`, canvas.width / 2, 60)
        ctx.fillText(`${comboCount}X COMBO!`, canvas.width / 2, 60)
      }
    }

    const animationId = setInterval(animate, 1000 / 60)
    return () => clearInterval(animationId)
  }, [fallingObjects, playerX, survived, particles, comboCount, onInput])

  return (
    <div className="bg-gradient-to-br from-sky-600 via-blue-500 to-indigo-600 rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-3 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
        ⚡ DODGEFALL MAYHEM! ⚡
      </h3>
      <p className="text-2xl font-bold mb-4 text-yellow-300 drop-shadow-lg">
        Dodge the falling hazards! Use ← → Arrow Keys!
      </p>
      
      <div className="mb-6 flex items-center justify-center gap-8">
        <div className={`px-10 py-5 rounded-2xl shadow-2xl ${survived ? 'bg-green-500' : 'bg-red-600'} text-white`}>
          <div className="text-5xl font-black">{survived ? '✅ ALIVE' : '💀 HIT!'}</div>
        </div>
        <div className="bg-white px-10 py-5 rounded-2xl shadow-2xl">
          <div className="text-6xl font-black text-emerald-600">{dodgeCount}</div>
          <div className="text-sm font-bold text-gray-700">Dodged</div>
        </div>
        {comboCount > 1 && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-10 py-5 rounded-2xl shadow-2xl text-white animate-bounce">
            <div className="text-5xl font-black">{comboCount}X</div>
            <div className="text-sm font-bold">COMBO!</div>
          </div>
        )}
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={500}
        className="border-8 border-amber-800 mx-auto rounded-2xl shadow-2xl"
      />
      
      <div className="mt-6 text-3xl font-black text-white drop-shadow-lg animate-pulse">
        ⬅️ ➡️ MOVE TO SURVIVE! ⬅️ ➡️
      </div>
    </div>
  )
}

// Stickman Parkour - MARIO PARTY QUALITY with multiplayer visibility
function StickmanParkourGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerY, setPlayerY] = useState(330)
  const [velocity, setVelocity] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [obstacles, setObstacles] = useState<Array<{x: number, width: number, type: 'spike' | 'gap'}>>([])  
  const [scrollOffset, setScrollOffset] = useState(0)
  const [jumps, setJumps] = useState(0)
  const [failed, setFailed] = useState(false)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>>([])  
  const [otherPlayers, setOtherPlayers] = useState<Array<{username: string, y: number, x: number, color: string}>>([])  

  useEffect(() => {
    // Generate obstacles
    const obs = []
    for (let i = 1; i < 15; i++) {
      obs.push({
        x: i * 150 + Math.random() * 50,
        width: 50 + Math.random() * 40,
        type: Math.random() > 0.6 ? 'spike' : 'gap' as 'spike' | 'gap'
      })
    }
    setObstacles(obs)
    
    // Mock other players
    setOtherPlayers([
      { username: 'Player2', y: 330, x: 50, color: '#ef4444' },
      { username: 'Player3', y: 280, x: 80, color: '#22c55e' },
    ])
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isJumping && !failed) {
        setIsJumping(true)
        setVelocity(-15)
        setJumps(prev => prev + 1)
        onInput({ action: 'jump', timestamp: Date.now() })
        
        // Jump particles
        for (let i = 0; i < 8; i++) {
          setParticles(prev => [...prev, {
            x: 100, y: playerY + 15,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 3,
            life: 30,
            color: '#3b82f6'
          }])
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onInput, isJumping, failed, playerY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      if (!failed) {
        // Physics
        const gravity = 0.8
        let newVelocity = velocity + gravity
        let newY = playerY + newVelocity
        
        const groundY = 330
        if (newY >= groundY) {
          newY = groundY
          newVelocity = 0
          setIsJumping(false)
        }
        
        setPlayerY(newY)
        setVelocity(newVelocity)
        setScrollOffset(prev => prev + 3)
      }

      // Sky gradient
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, failed ? '#7f1d1d' : '#60a5fa')
      grd.addColorStop(1, failed ? '#991b1b' : '#93c5fd')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      for (let i = 0; i < 5; i++) {
        const x = ((i * 200 - scrollOffset / 2) % canvas.width + canvas.width) % canvas.width
        ctx.beginPath()
        ctx.arc(x, 60 + i * 20, 30, 0, Math.PI * 2)
        ctx.arc(x + 25, 60 + i * 20, 35, 0, Math.PI * 2)
        ctx.arc(x + 50, 60 + i * 20, 30, 0, Math.PI * 2)
        ctx.fill()
      }

      // Ground with texture
      ctx.fillStyle = '#15803d'
      ctx.fillRect(0, 360, canvas.width, 40)
      
      ctx.fillStyle = '#16a34a'
      for (let i = 0; i < 30; i++) {
        const x = (i * 30 - scrollOffset) % canvas.width
        ctx.fillRect(x, 360, 3, 8)
        ctx.fillRect(x + 10, 365, 3, 6)
      }

      // Draw obstacles
      obstacles.forEach(obs => {
        const obsX = obs.x - scrollOffset
        if (obsX > -100 && obsX < canvas.width + 100) {
          if (obs.type === 'spike') {
            // Deadly spikes with glow
            ctx.shadowBlur = 20
            ctx.shadowColor = '#dc2626'
            ctx.fillStyle = '#dc2626'
            for (let i = 0; i < obs.width; i += 25) {
              ctx.beginPath()
              ctx.moveTo(obsX + i, 360)
              ctx.lineTo(obsX + i + 12, 330)
              ctx.lineTo(obsX + i + 25, 360)
              ctx.closePath()
              ctx.fill()
            }
            ctx.shadowBlur = 0
            
            ctx.fillStyle = '#991b1b'
            for (let i = 0; i < obs.width; i += 25) {
              ctx.beginPath()
              ctx.moveTo(obsX + i + 4, 360)
              ctx.lineTo(obsX + i + 12, 340)
              ctx.lineTo(obsX + i + 20, 360)
              ctx.closePath()
              ctx.fill()
            }
            
            if (Math.abs(100 - obsX - obs.width/2) < 35 && playerY > 315 && !failed) {
              setFailed(true)
              onInput({ action: 'died', cause: 'spike', timestamp: Date.now() })
              for (let i = 0; i < 30; i++) {
                setParticles(prev => [...prev, {
                  x: 100, y: playerY,
                  vx: (Math.random() - 0.5) * 12,
                  vy: (Math.random() - 1) * 10,
                  life: 60,
                  color: '#dc2626'
                }])
              }
            }
          } else {
            // Gap with warning stripes
            ctx.fillStyle = '#000'
            ctx.fillRect(obsX, 360, obs.width, 40)
            
            ctx.fillStyle = '#fbbf24'
            ctx.strokeStyle = '#000'
            ctx.lineWidth = 3
            for (let i = 0; i < 3; i++) {
              ctx.fillRect(obsX - 15, 350 - i * 15, 10, 10)
              ctx.strokeRect(obsX - 15, 350 - i * 15, 10, 10)
            }
            
            if (Math.abs(100 - obsX - obs.width / 2) < 25 && playerY >= 330 && !failed) {
              setFailed(true)
              onInput({ action: 'died', cause: 'fell', timestamp: Date.now() })
            }
          }
        }
      })

      // Draw other players (multiplayer visibility)
      otherPlayers.forEach(p => {
        const drawStickman = (x: number, y: number, color: string, username: string) => {
          const animY = y + Math.sin(Date.now() / 150) * 2
          
          ctx.fillStyle = color
          ctx.shadowBlur = 15
          ctx.shadowColor = color
          ctx.beginPath()
          ctx.arc(x, animY - 30, 16, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
          
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          ctx.arc(x - 5, animY - 32, 4, 0, Math.PI * 2)
          ctx.arc(x + 5, animY - 32, 4, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.strokeStyle = color
          ctx.lineWidth = 6
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(x, animY - 14)
          ctx.lineTo(x, animY + 10)
          ctx.moveTo(x, animY - 5)
          ctx.lineTo(x - 15, animY + 5)
          ctx.moveTo(x, animY - 5)
          ctx.lineTo(x + 15, animY + 5)
          ctx.moveTo(x, animY + 10)
          ctx.lineTo(x - 10, animY + 25)
          ctx.moveTo(x, animY + 10)
          ctx.lineTo(x + 10, animY + 25)
          ctx.stroke()
          
          ctx.fillStyle = '#fff'
          ctx.strokeStyle = '#000'
          ctx.lineWidth = 2
          ctx.font = 'bold 12px Arial'
          ctx.textAlign = 'center'
          ctx.strokeText(username, x, animY - 50)
          ctx.fillText(username, x, animY - 50)
        }
        
        drawStickman(p.x - scrollOffset + 150, p.y, p.color, p.username)
      })

      // Draw main player with detailed animation
      const playerX = 100
      const animY = playerY + (isJumping ? 0 : Math.sin(Date.now() / 200) * 2)
      const legAngle = isJumping ? Math.PI / 4 : Math.sin(Date.now() / 100) * 0.3
      
      ctx.fillStyle = failed ? '#7f1d1d' : '#3b82f6'
      ctx.shadowBlur = 20
      ctx.shadowColor = failed ? '#dc2626' : '#3b82f6'
      ctx.beginPath()
      ctx.arc(playerX, animY - 30, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(playerX - 6, animY - 32, 5, 0, Math.PI * 2)
      ctx.arc(playerX + 6, animY - 32, 5, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(playerX - 6, animY - 31, 3, 0, Math.PI * 2)
      ctx.arc(playerX + 6, animY - 31, 3, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.strokeStyle = failed ? '#7f1d1d' : '#3b82f6'
      ctx.lineWidth = 8
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(playerX, animY - 12)
      ctx.lineTo(playerX, animY + 15)
      ctx.stroke()
      
      ctx.save()
      ctx.translate(playerX, animY - 5)
      ctx.rotate(isJumping ? -Math.PI / 3 : Math.sin(Date.now() / 150) * 0.2)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-18, 8)
      ctx.stroke()
      ctx.restore()
      
      ctx.save()
      ctx.translate(playerX, animY - 5)
      ctx.rotate(isJumping ? Math.PI / 6 : -Math.sin(Date.now() / 150) * 0.2)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(18, 8)
      ctx.stroke()
      ctx.restore()
      
      ctx.save()
      ctx.translate(playerX, animY + 15)
      ctx.rotate(legAngle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-5, 20)
      ctx.stroke()
      ctx.restore()
      
      ctx.save()
      ctx.translate(playerX, animY + 15)
      ctx.rotate(-legAngle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(5, 20)
      ctx.stroke()
      ctx.restore()
      
      // Particles
      const updated = particles.map(p => ({
        ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.4, life: p.life - 1
      })).filter(p => p.life > 0)
      updated.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 60
        ctx.beginPath()
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setParticles(updated)
    }

    const animationId = setInterval(animate, 1000 / 60)
    return () => clearInterval(animationId)
  }, [playerY, velocity, scrollOffset, obstacles, failed, onInput, isJumping, particles, otherPlayers])

  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-rose-600 rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-3 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">🎯 PARKOUR RUSH! 🎯</h3>
      <p className="text-2xl font-bold mb-4 text-yellow-300 drop-shadow-lg">Jump over obstacles! Don't stop running!</p>
      
      <div className="mb-6 flex items-center justify-center gap-8">
        <div className={`px-10 py-5 rounded-2xl shadow-2xl ${failed ? 'bg-red-600' : 'bg-emerald-500'} text-white`}>
          <div className="text-5xl font-black">{failed ? '💀 FAILED' : '🏃 RUNNING'}</div>
        </div>
        <div className="bg-white px-10 py-5 rounded-2xl shadow-2xl">
          <div className="text-6xl font-black text-purple-600">{jumps}</div>
          <div className="text-sm font-bold text-gray-700">Jumps</div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={650} 
        height={400}
        className="border-8 border-purple-800 mx-auto rounded-2xl shadow-2xl"
      />
      
      <div className="mt-6 text-3xl font-black text-white drop-shadow-lg animate-pulse">
        ⭐ SPACEBAR TO JUMP! ⭐
      </div>
    </div>
  )
}

// Stay In Circle - MARIO PARTY QUALITY with cursor trails and multiplayer!
function StayInCircleGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [inCircle, setInCircle] = useState(true)
  const [radius, setRadius] = useState(200)
  const [timeInside, setTimeInside] = useState(0)
  const [cursorX, setCursorX] = useState(250)
  const [cursorY, setCursorY] = useState(250)
  const [trail, setTrail] = useState<Array<{x: number, y: number, life: number}>>([])
  const [otherPlayers] = useState([
    { x: 200, y: 200, color: '#ef4444', name: 'CPU1' },
    { x: 300, y: 300, color: '#3b82f6', name: 'CPU2' }
  ])

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
      const grd = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300)
      grd.addColorStop(0, '#1e1b4b')
      grd.addColorStop(1, '#0f172a')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const pulsate = Math.sin(Date.now() / 200) * 5
      const glowRadius = radius < 50 ? 40 : 25
      const gradient = ctx.createRadialGradient(centerX, centerY, radius + pulsate - glowRadius, centerX, centerY, radius + pulsate + glowRadius)
      gradient.addColorStop(0, inCircle ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = inCircle ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + pulsate, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.shadowBlur = 20
      ctx.shadowColor = inCircle ? '#22c55e' : '#ef4444'
      ctx.strokeStyle = inCircle ? '#22c55e' : '#ef4444'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + pulsate, 0, Math.PI * 2)
      ctx.stroke()
      ctx.shadowBlur = 0

      const updated = trail.map(t => ({ ...t, life: t.life - 1 })).filter(t => t.life > 0)
      updated.forEach(t => {
        ctx.fillStyle = inCircle ? '#22c55e' : '#ef4444'
        ctx.globalAlpha = t.life / 15
        ctx.beginPath()
        ctx.arc(t.x, t.y, 6, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setTrail(updated)

      otherPlayers.forEach(player => {
        ctx.fillStyle = player.color
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.arc(player.x + Math.sin(Date.now() / 500) * 20, player.y + Math.cos(Date.now() / 600) * 20, 12, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(player.name, player.x, player.y - 20)
      })

      ctx.fillStyle = '#fbbf24'
      ctx.shadowBlur = 15
      ctx.shadowColor = '#fbbf24'
      ctx.beginPath()
      ctx.arc(cursorX, cursorY, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 4
      ctx.font = 'bold 50px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.strokeText(Math.round(radius).toString(), centerX, centerY)
      ctx.fillText(Math.round(radius).toString(), centerX, centerY)
      
      if (radius < 50) {
        ctx.fillStyle = '#fbbf24'
        ctx.font = 'bold 20px Arial'
        ctx.fillText('⚠️ DANGER! ⚠️', centerX, centerY - 80)
      }
    }

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setCursorX(x)
      setCursorY(y)
      setTrail(prev => [...prev.slice(-12), { x, y, life: 15 }])
      
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      const inside = distance <= radius
      
      if (inside !== inCircle) {
        setInCircle(inside)
        if (!inside) {
          onInput({ action: 'left_circle', timeInside, timestamp: Date.now() })
        }
      }
    }

    const interval = setInterval(draw, 1000 / 60)
    canvas.addEventListener('mousemove', handleMove)

    return () => {
      clearInterval(interval)
      canvas.removeEventListener('mousemove', handleMove)
    }
  }, [radius, inCircle, onInput, timeInside, cursorX, cursorY, trail, otherPlayers])

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-3 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        🎯 CIRCLE SURVIVOR! 🎯
      </h3>
      <p className="text-2xl font-bold mb-4 text-yellow-300 drop-shadow-lg">
        Stay inside! Circle shrinks fast!
      </p>
      
      <div className="flex justify-center gap-8 mb-6">
        <div className={`px-8 py-4 rounded-2xl shadow-2xl ${inCircle ? 'bg-emerald-500' : 'bg-red-600'} text-white ${radius < 50 ? 'animate-pulse' : ''}`}>
          <div className="text-5xl font-black">{inCircle ? (radius < 50 ? '⚠️ DANGER' : '✅ SAFE') : '❌ OUT!'}</div>
        </div>
        <div className="bg-white px-8 py-4 rounded-2xl shadow-2xl">
          <div className="text-6xl font-black text-purple-600">{(timeInside / 1000).toFixed(1)}</div>
          <div className="text-sm font-bold text-gray-700">Survival Time</div>
        </div>
      </div>
      
      <canvas ref={canvasRef} width={500} height={500} className="border-8 border-purple-800 mx-auto rounded-2xl shadow-2xl cursor-none" />
      
      <div className="mt-6 text-2xl font-black text-white drop-shadow-lg animate-pulse">
        🖱️ KEEP CURSOR INSIDE! 🖱️
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
    <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 rounded-xl p-12 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        {showPattern ? `🧠 MEMORIZE! (${countdown}s)` : '👆 RECALL THE PATTERN!'}
      </h3>
      <p className="text-2xl font-bold mb-6 text-yellow-300 drop-shadow-lg">
        {showPattern ? 'Watch the flashing tiles!' : 'Click them in order!'}
      </p>
      
      <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto mb-8">
        {Array.from({ length: 25 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-24 h-24 rounded-2xl transition-all duration-200 text-4xl font-black shadow-2xl border-4 ${
              showPattern && pattern.includes(i)
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 animate-pulse scale-125'
                : selected.includes(i)
                ? isCorrect(i) 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-300 text-white'
                  : 'bg-gradient-to-br from-red-500 to-rose-600 border-red-300 text-white'
                : 'bg-gradient-to-br from-gray-700 to-gray-900 border-gray-600 hover:from-gray-600 hover:to-gray-800 hover:scale-110'
            }`}
            disabled={showPattern}
          >
            {selected.includes(i) && (isCorrect(i) ? '✓' : '✗')}
          </button>
        ))}
      </div>
      
      <div className={`px-12 py-6 rounded-2xl shadow-2xl inline-block ${selected.length === pattern.length ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-white'}`}>
        <div className={`text-6xl font-black ${selected.length === pattern.length ? 'text-white animate-bounce' : 'text-purple-600'}`}>
          {selected.length === pattern.length ? '✓' : `${selected.length}/${pattern.length}`}
        </div>
        <div className={`text-sm font-bold ${selected.length === pattern.length ? 'text-green-100' : 'text-gray-700'}`}>
          {selected.length === pattern.length ? 'COMPLETE!' : 'Tiles Selected'}
        </div>
      </div>
    </div>
  )
}

// Territory Grab - Click tiles to claim
// Territory Grab - MARIO PARTY QUALITY with animated claims
function TerritoryGrabGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tileOwners, setTileOwners] = useState<Map<number, string>>(new Map())
  const [myColor] = useState(() => `hsl(${Math.random() * 360}, 70%, 50%)`)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>>([])
  const [territoryCounts, setTerritoryCounts] = useState<Record<string, number>>({})
  const [lastClaimedTile, setLastClaimedTile] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).io) {
      const socket = (window as any).io
      socket.on('territoryClaimed', (data: { tile: number, playerColor: string, username: string }) => {
        setTileOwners(prev => new Map(prev).set(data.tile, data.playerColor))
        const tileX = (data.tile % 20) * 30 + 15
        const tileY = Math.floor(data.tile / 20) * 30 + 15
        setParticles(prev => [...prev, ...Array.from({length: 12}, () => ({
          x: tileX, y: tileY,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 40,
          color: data.playerColor
        }))])
      })
      socket.on('territoryStandings', (data: Record<string, number>) => {
        setTerritoryCounts(data)
      })
      return () => {
        socket.off('territoryClaimed')
        socket.off('territoryStandings')
      }
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const tileX = Math.floor(x / 30)
    const tileY = Math.floor(y / 30)
    const tileIndex = tileY * 20 + tileX
    
    if (tileIndex >= 0 && tileIndex < 400) {
      setLastClaimedTile(tileIndex)
      setTimeout(() => setLastClaimedTile(null), 500)
      onInput({ tile: tileIndex, color: myColor, timestamp: Date.now() })
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, '#1e293b')
      grd.addColorStop(1, '#334155')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
          const tileIndex = y * 20 + x
          const owner = tileOwners.get(tileIndex)
          
          if (owner) {
            ctx.fillStyle = owner
            ctx.shadowBlur = tileIndex === lastClaimedTile ? 20 : 0
            ctx.shadowColor = owner
          } else {
            ctx.fillStyle = '#475569'
            ctx.shadowBlur = 0
          }
          
          const scale = tileIndex === lastClaimedTile ? 1.2 : 1
          const offset = (1 - scale) * 15
          
          ctx.fillRect(x * 30 + 1 + offset, y * 30 + 1 + offset, 28 * scale, 28 * scale)
        }
      }
      ctx.shadowBlur = 0

      const updated = particles.map(p => ({
        ...p, x: p.x + p.vx, y: p.y + p.vy, vx: p.vx * 0.98, vy: p.vy * 0.98, life: p.life - 1
      })).filter(p => p.life > 0)
      updated.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 40
        ctx.beginPath()
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setParticles(updated)
    }

    const animationId = setInterval(draw, 1000 / 60)
    return () => clearInterval(animationId)
  }, [tileOwners, particles, lastClaimedTile])

  const myTerritoryCount = Object.entries(territoryCounts).find(([color]) => color === myColor)?.[1] || 0

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-3 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
        🗺️ TERRITORY GRAB! 🗺️
      </h3>
      <p className="text-2xl font-bold mb-4 text-amber-400 drop-shadow-lg">
        Click tiles to claim them! Last click wins!
      </p>
      
      <div className="flex justify-center gap-8 mb-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-amber-300">
          <div className="text-5xl font-black">{myTerritoryCount}</div>
          <div className="text-sm font-bold">Your Territory</div>
          <div className="w-8 h-8 rounded-full mx-auto mt-2 border-2 border-white shadow-lg" style={{ backgroundColor: myColor }} />
        </div>
        <div className="bg-white px-8 py-4 rounded-2xl shadow-2xl">
          <div className="text-4xl font-black text-slate-800">{Object.values(territoryCounts).reduce((a, b) => a + b, 0)}</div>
          <div className="text-sm text-gray-600">Total Claimed</div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={600}
        onClick={handleClick}
        className="border-8 border-amber-600 mx-auto rounded-2xl shadow-2xl cursor-crosshair hover:shadow-amber-500/50 transition-shadow"
      />
      
      <div className="mt-6 text-2xl font-black text-white drop-shadow-lg animate-pulse">
        🖱️ CLICK TO CONQUER! 🖱️
      </div>
      
      <div className="mt-6 flex justify-center flex-wrap gap-3">
        {Object.entries(territoryCounts).map(([color, count]) => (
          <div key={color} className="bg-slate-700 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
            <div className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
            <span className="text-white font-bold text-xl">{count}</span>
          </div>
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
    const numValue = parseFloat(value)
    if (numValue < 0 || numValue > 100) return
    setSubmitted(true)
    onInput({ value: numValue, timestamp: Date.now() })
  }

  return (
    <div className="bg-gradient-to-br from-cyan-900 via-teal-800 to-blue-900 rounded-xl p-12 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        🧠 AVERAGE BAIT! 🧠
      </h3>
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-8 mb-8 shadow-2xl max-w-2xl mx-auto border-8 border-cyan-400">
        <p className="text-3xl font-black text-gray-800 mb-3">Pick a number: <span className="text-cyan-600">0-100</span></p>
        <p className="text-xl font-bold text-gray-700">Furthest from the average = ELIMINATION!</p>
      </div>
      
      <div className="mb-8">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={submitted}
          className="text-9xl font-black text-center w-96 px-12 py-8 border-8 border-cyan-400 rounded-3xl focus:outline-none focus:ring-8 focus:ring-cyan-300 disabled:bg-gray-300 text-cyan-600 placeholder-gray-400 shadow-2xl"
          placeholder="?"
          min="0"
          max="100"
          autoFocus
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={submitted || !value}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-4xl px-24 py-10 rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 shadow-2xl border-8 border-white"
      >
        {submitted ? '✓ LOCKED IN!' : '🚀 SUBMIT!'}
      </button>
      
      {submitted && (
        <div className="mt-8 text-5xl font-black text-yellow-400 drop-shadow-2xl animate-bounce">
          ⭐ CHOICE LOCKED! ⭐
        </div>
      )}
    </div>
  )
}

// Vote To Kill - Vote for a player
// Vote to Kill - MARIO PARTY QUALITY with dramatic reveals
function VoteToKillGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const players = minigame.config?.players || []
  const [voted, setVoted] = useState<string | null>(null)
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number}>>([])

  const handleVote = (playerId: string) => {
    if (voted) return
    setVoted(playerId)
    onInput({ vote: playerId, timestamp: Date.now() })
    
    const playerIndex = players.findIndex((p: any) => (typeof p === 'string' ? p : p.playerId) === playerId)
    const y = 200 + playerIndex * 110
    for (let i = 0; i < 40; i++) {
      setParticles(prev => [...prev, {
        x: 400, y,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        life: 60
      }])
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, '#450a0a')
      grd.addColorStop(1, '#7f1d1d')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(139, 0, 0, 0.3)'
      for (let i = 0; i < 5; i++) {
        const offset = (Date.now() / 1000 + i * 2) % 10
        ctx.beginPath()
        ctx.arc(100 + i * 150, offset * 60, 80, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 4
      ctx.font = 'bold 50px Arial'
      ctx.textAlign = 'center'
      ctx.strokeText('☠️ VOTE TO ELIMINATE ☠️', canvas.width / 2, 80)
      ctx.fillText('☠️ VOTE TO ELIMINATE ☠️', canvas.width / 2, 80)

      players.forEach((player: any, index: number) => {
        const playerId = typeof player === 'string' ? player : player.playerId
        const playerName = typeof player === 'string' ? player : player.username
        const y = 200 + index * 110
        const isVoted = voted === playerId
        const isHovered = hoveredPlayer === playerId
        const scale = isVoted ? 1.15 : isHovered ? 1.08 : 1
        
        if (isVoted) {
          ctx.fillStyle = '#dc2626'
          ctx.shadowBlur = 30
          ctx.shadowColor = '#ef4444'
        } else if (isHovered) {
          ctx.fillStyle = '#ea580c'
          ctx.shadowBlur = 20
          ctx.shadowColor = '#fb923c'
        } else if (voted) {
          ctx.fillStyle = '#52525b'
          ctx.shadowBlur = 0
        } else {
          ctx.fillStyle = '#1e293b'
          ctx.shadowBlur = 10
          ctx.shadowColor = '#000'
        }
        
        const rectWidth = 500 * scale
        const rectX = (canvas.width - rectWidth) / 2
        ctx.fillRect(rectX, y - 40 * scale, rectWidth, 80 * scale)
        ctx.shadowBlur = 0

        if (isVoted) {
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 6
          ctx.strokeRect(rectX, y - 40 * scale, rectWidth, 80 * scale)
        }

        const emoji = isVoted ? '💀' : voted ? '😢' : isHovered ? '😰' : '😊'
        ctx.font = 'bold 50px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(emoji, rectX + 50, y + 15)

        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 3
        ctx.font = `bold ${30 * scale}px Arial`
        ctx.strokeText(playerName, canvas.width / 2, y + 10)
        ctx.fillText(playerName, canvas.width / 2, y + 10)

        if (isVoted) {
          ctx.fillStyle = '#fbbf24'
          ctx.font = 'bold 40px Arial'
          ctx.fillText('✓', rectX + rectWidth - 50, y + 15)
        }
      })

      const updated = particles.map(p => ({
        ...p, x: p.x + p.vx, y: p.y + p.vy, vx: p.vx * 0.95, vy: p.vy + 0.5, life: p.life - 1
      })).filter(p => p.life > 0)
      updated.forEach(p => {
        ctx.fillStyle = '#ef4444'
        ctx.globalAlpha = p.life / 60
        ctx.beginPath()
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setParticles(updated)
    }

    const animationId = setInterval(draw, 1000 / 60)
    return () => clearInterval(animationId)
  }, [players, voted, hoveredPlayer, particles])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (voted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const y = e.clientY - rect.top
    
    players.forEach((player: any, index: number) => {
      const playerY = 200 + index * 110
      if (y >= playerY - 40 && y <= playerY + 40) {
        const playerId = typeof player === 'string' ? player : player.playerId
        handleVote(playerId)
      }
    })
  }

  const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const y = e.clientY - rect.top
    
    let newHovered: string | null = null
    players.forEach((player: any, index: number) => {
      const playerY = 200 + index * 110
      if (y >= playerY - 40 && y <= playerY + 40) {
        newHovered = typeof player === 'string' ? player : player.playerId
      }
    })
    setHoveredPlayer(newHovered)
  }

  return (
    <div className="bg-gradient-to-br from-red-900 via-red-800 to-black rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-3 text-red-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        ☠️ VOTE TO ELIMINATE! ☠️
      </h3>
      <p className="text-2xl font-bold mb-6 text-amber-300 drop-shadow-lg">
        Choose wisely... someone must go...
      </p>
      
      {players.length === 0 ? (
        <div className="text-white text-3xl font-bold py-20">
          ⏳ Waiting for players...
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={Math.max(500, players.length * 110 + 150)}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasHover}
          onMouseLeave={() => setHoveredPlayer(null)}
          className="border-8 border-red-900 mx-auto rounded-2xl shadow-2xl cursor-pointer"
        />
      )}
      
      {voted && (
        <div className="mt-8 text-4xl font-black text-amber-400 drop-shadow-lg animate-bounce">
          ✓ YOUR VOTE HAS BEEN CAST! ✓
        </div>
      )}
    </div>
  )
}

// Bullet Hell - MARIO PARTY QUALITY with flying projectiles!
function BulletHellGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [survived, setSurvived] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 300, y: 400 })
  const [dodged, setDodged] = useState(0)
  const [bullets, setBullets] = useState<Array<{x: number, y: number, vx: number, vy: number, size: number}>>(
    Array.from({ length: 8 }, () => ({
      x: Math.random() * 600, y: -20,
      vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3 + 2,
      size: Math.random() * 8 + 6
    }))
  )
  const [trail, setTrail] = useState<Array<{x: number, y: number, life: number}>>([])

  useEffect(() => {
    if (survived) {
      const spawnInterval = setInterval(() => {
        setBullets(prev => [...prev, {
          x: Math.random() * 600, y: -20,
          vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3 + 2,
          size: Math.random() * 8 + 6
        }])
      }, 2000)
      return () => clearInterval(spawnInterval)
    }
  }, [survived])

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
      setTrail(prev => [...prev.slice(-15), { x, y, life: 10 }])
      onInput({ position: { x, y }, timestamp: Date.now() })
    }

    const draw = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, '#1a1a2e')
      grd.addColorStop(1, '#16213e')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
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

      bullets.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        if (b.y > canvas.height) {
          b.y = -20
          b.x = Math.random() * canvas.width
          b.vx = (Math.random() - 0.5) * 4
          b.vy = Math.random() * 3 + 2
          if (survived) setDodged(prev => prev + 1)
        }
        
        const dist = Math.sqrt((b.x - mousePos.x) ** 2 + (b.y - mousePos.y) ** 2)
        if (dist < b.size + 12 && survived) {
          setSurvived(false)
        }

        ctx.fillStyle = '#ef4444'
        ctx.shadowBlur = 20
        ctx.shadowColor = '#ef4444'
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      const updated = trail.map(t => ({ ...t, life: t.life - 1 })).filter(t => t.life > 0)
      updated.forEach(t => {
        ctx.fillStyle = survived ? '#3b82f6' : '#ef4444'
        ctx.globalAlpha = t.life / 10
        ctx.beginPath()
        ctx.arc(t.x, t.y, 5, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setTrail(updated)

      ctx.fillStyle = survived ? '#3b82f6' : '#ef4444'
      ctx.shadowBlur = 25
      ctx.shadowColor = survived ? '#3b82f6' : '#ef4444'
      ctx.beginPath()
      ctx.arc(mousePos.x, mousePos.y, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    canvas.addEventListener('mousemove', handleMove)
    const interval = setInterval(draw, 1000 / 60)

    return () => {
      canvas.removeEventListener('mousemove', handleMove)
      clearInterval(interval)
    }
  }, [mousePos, survived, onInput, bullets, trail])

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-black rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-red-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        🔫 BULLET HELL! 🔫
      </h3>
      <p className="text-2xl font-bold mb-4 text-yellow-300 drop-shadow-lg">
        Dodge the projectiles!
      </p>
      
      <div className="flex justify-center gap-8 mb-6">
        <div className={`px-10 py-5 rounded-2xl shadow-2xl ${survived ? 'bg-emerald-500' : 'bg-red-600'} text-white`}>
          <div className="text-5xl font-black">{survived ? '✅ ALIVE' : '💀 HIT!'}</div>
        </div>
        <div className="bg-white px-10 py-5 rounded-2xl shadow-2xl">
          <div className="text-6xl font-black text-blue-600">{dodged}</div>
          <div className="text-sm font-bold text-gray-700">Dodged</div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={500} 
        className="border-8 border-red-600 mx-auto rounded-2xl shadow-2xl cursor-none"
      />
      
      <div className="mt-6 text-2xl font-black text-white drop-shadow-lg animate-pulse">
        🖱️ MOVE TO DODGE! 🖱️
      </div>
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
    <div className="bg-gradient-to-br from-orange-900 via-red-700 to-rose-900 rounded-xl p-12 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        🔢 REVERSE SEQUENCE! 🔢
      </h3>
      <p className="text-2xl font-bold mb-6 text-yellow-300 drop-shadow-lg">
        Click buttons: 20 → 0 in order!
      </p>
      
      <div className="mb-8">
        <div className="text-8xl font-black mb-3 drop-shadow-2xl">
          <span className={completed ? 'text-green-400 animate-bounce' : failed ? 'text-red-500' : 'text-yellow-400 animate-pulse'}>
            {completed ? '✓' : failed ? '✗' : currentNumber}
          </span>
        </div>
        <p className="text-2xl font-bold drop-shadow-lg">
          <span className={completed ? 'text-green-300' : failed ? 'text-red-300' : 'text-white'}>
            {completed ? '🎯 PERFECT!' : failed ? '💀 WRONG ORDER!' : 'Next Number'}
          </span>
        </p>
      </div>
      
      <div className="grid grid-cols-7 gap-3 max-w-3xl mx-auto">
        {Array.from({ length: 21 }, (_, i) => 20 - i).map((num) => (
          <button
            key={num}
            onClick={() => handleClick(num)}
            disabled={num > currentNumber || completed || failed}
            className={`w-20 h-20 rounded-2xl font-black text-2xl transition-all shadow-2xl ${
              num > currentNumber
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                : num === currentNumber
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white animate-pulse scale-125 border-4 border-white shadow-yellow-500/50'
                : 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white hover:scale-110'
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
    { id: 'A', label: 'A', color: 'bg-gradient-to-br from-red-500 to-red-700', position: 'top-0 left-0' },
    { id: 'B', label: 'B', color: 'bg-gradient-to-br from-blue-500 to-blue-700', position: 'top-0 right-0' },
    { id: 'C', label: 'C', color: 'bg-gradient-to-br from-green-500 to-green-700', position: 'bottom-0 left-0' },
    { id: 'D', label: 'D', color: 'bg-gradient-to-br from-yellow-500 to-yellow-700', position: 'bottom-0 right-0' },
  ]

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-12 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        ☠️ DEADLY CORNERS! ☠️
      </h3>
      <p className="text-2xl font-bold mb-2 text-yellow-300 drop-shadow-lg">
        Round {round} - {timeLeft}s left!
      </p>
      <p className="text-xl text-gray-300 mb-6">Pick a safe corner or DIE!</p>
      {eliminated && <p className="text-red-500 font-black text-5xl mb-6 animate-bounce">💀 ELIMINATED! 💀</p>}
      
      <div className="relative w-[600px] h-[600px] mx-auto bg-black/60 rounded-3xl border-8 border-gray-700 shadow-2xl">
        {corners.map((corner) => (
          <button
            key={corner.id}
            onClick={() => handleSelectCorner(corner.id)}
            disabled={!!lethalCorner || eliminated}
            className={`absolute w-72 h-72 ${corner.position} ${corner.color} 
              ${selectedCorner === corner.id ? 'ring-8 ring-white scale-105' : ''}
              ${lethalCorner === corner.id ? 'opacity-30' : ''}
              hover:opacity-90 transition-all flex items-center justify-center text-white text-8xl font-black shadow-2xl border-4 border-white/20`}
          >
            {lethalCorner === corner.id && '💀'}
            {lethalCorner && lethalCorner !== corner.id && '✅'}
            {!lethalCorner && corner.label}
          </button>
        ))}
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`bg-gradient-to-br from-red-600 to-orange-600 rounded-full w-48 h-48 flex items-center justify-center text-white text-7xl font-black shadow-2xl border-8 border-yellow-400 ${timeLeft <= 2 ? 'animate-ping' : 'animate-pulse'}`}>
            {timeLeft}
          </div>
        </div>
      </div>
      
      {selectedCorner && !lethalCorner && (
        <p className="text-yellow-400 font-black text-3xl mt-6 drop-shadow-lg animate-pulse">
          ⭐ Selected: {selectedCorner} ⭐
        </p>
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
    <div className="bg-gradient-to-br from-yellow-900 via-amber-800 to-orange-900 rounded-xl p-12 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        🪙 COIN FLIP FATE! 🪙
      </h3>
      <p className="text-2xl font-bold mb-8 text-yellow-300 drop-shadow-lg">
        Choose wisely... your survival depends on it!
      </p>
      
      <div className="mb-10">
        <div 
          className="w-64 h-64 mx-auto rounded-full shadow-2xl flex items-center justify-center text-8xl font-black transition-transform duration-100 border-8"
          style={{ 
            transform: `rotateY(${rotation}deg)`,
            background: rotation % 360 < 180 ? 'linear-gradient(145deg, #FFD700, #FFA500)' : 'linear-gradient(145deg, #C0C0C0, #808080)',
            borderColor: '#DAA520'
          }}
        >
          {!flipping && !result && '?'}
          {flipping && '💫'}
          {result && (result === 'heads' ? '👑' : '🦅')}
        </div>
        {result && (
          <div className="mt-8">
            <p className={`text-6xl font-black mb-4 drop-shadow-2xl animate-bounce ${result === choice ? 'text-green-400' : 'text-red-500'}`}>
              {result === 'heads' ? '👑 HEADS!' : '🦅 TAILS!'}
            </p>
            <p className={`text-5xl font-black drop-shadow-lg ${result === choice ? 'text-green-300' : 'text-red-400'}`}>
              {result === choice ? '✅ YOU WIN!' : '❌ YOU LOSE!'}
            </p>
          </div>
        )}
      </div>
      
      {!choice && (
        <div className="flex gap-8 justify-center">
          <button
            onClick={() => handleChoice('heads')}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-4xl font-black px-20 py-10 rounded-3xl shadow-2xl border-8 border-white transition-all hover:scale-110"
          >
            👑 HEADS
          </button>
          <button
            onClick={() => handleChoice('tails')}
            className="bg-gradient-to-br from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white text-4xl font-black px-20 py-10 rounded-3xl shadow-2xl border-8 border-white transition-all hover:scale-110"
          >
            🦅 TAILS
          </button>
        </div>
      )}
      
      {choice && !result && (
        <p className="text-yellow-400 font-black text-3xl drop-shadow-lg animate-pulse">
          {flipping ? '🎲 FLIPPING...' : `⭐ Selected: ${choice === 'heads' ? '👑 HEADS' : '🦅 TAILS'} ⭐`}
        </p>
      )}
    </div>
  )
}

// Cursor Chain Reaction - Avoid bouncing balls
function CursorChainReactionGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [startTime] = useState(Date.now())
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
      const grd = ctx.createRadialGradient(250, 250, 0, 250, 250, 300)
      grd.addColorStop(0, '#1e1b4b')
      grd.addColorStop(1, '#0f172a')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const newBalls = balls.map(ball => {
        let newX = ball.x + ball.vx
        let newY = ball.y + ball.vy
        let newVx = ball.vx
        let newVy = ball.vy

        if (newX - ball.radius < 0 || newX + ball.radius > canvas.width) {
          newVx = -newVx
          newX = ball.x + newVx
        }
        if (newY - ball.radius < 0 || newY + ball.radius > canvas.height) {
          newVy = -newVy
          newY = ball.y + newVy
        }

        const gradient = ctx.createRadialGradient(newX - 5, newY - 5, 0, newX, newY, ball.radius)
        gradient.addColorStop(0, '#ff6b6b')
        gradient.addColorStop(1, '#c92a2a')
        ctx.fillStyle = gradient
        ctx.shadowBlur = 25
        ctx.shadowColor = '#ef4444'
        ctx.beginPath()
        ctx.arc(newX, newY, ball.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(newX, newY, ball.radius + 3, 0, Math.PI * 2)
        ctx.stroke()

        const dist = Math.sqrt((newX - mousePos.x) ** 2 + (newY - mousePos.y) ** 2)
        if (dist < ball.radius + 12 && !hit) {
          setHit(true)
          onInput({ action: 'hit', timestamp: Date.now() })
        }

        return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy }
      })

      setBalls(newBalls)

      const cursorGrad = ctx.createRadialGradient(mousePos.x, mousePos.y, 0, mousePos.x, mousePos.y, 12)
      cursorGrad.addColorStop(0, hit ? '#ff0000' : '#4ade80')
      cursorGrad.addColorStop(1, hit ? '#991b1b' : '#15803d')
      ctx.fillStyle = cursorGrad
      ctx.shadowBlur = 20
      ctx.shadowColor = hit ? '#ef4444' : '#22c55e'
      ctx.beginPath()
      ctx.arc(mousePos.x, mousePos.y, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const animationId = setInterval(animate, 1000 / 30)
    return () => clearInterval(animationId)
  }, [balls, mousePos, hit, onInput])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const surviveTime = Math.floor((Date.now() - startTime) / 1000)

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-800 to-violet-900 rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        🔴 CHAIN REACTION! 🔴
      </h3>
      <p className="text-2xl font-bold mb-6 text-yellow-300 drop-shadow-lg">
        Dodge bouncing balls! More spawn over time!
      </p>
      
      <div className="flex justify-center gap-8 mb-6">
        <div className={`px-10 py-5 rounded-2xl shadow-2xl ${hit ? 'bg-red-600' : 'bg-emerald-500'} text-white`}>
          <div className="text-5xl font-black">{hit ? '💀 HIT!' : '✅ SAFE'}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 px-10 py-5 rounded-2xl shadow-2xl border-4 border-white text-white">
          <div className="text-6xl font-black">{balls.length}</div>
          <div className="text-sm font-bold">Balls Active</div>
        </div>
        <div className="bg-white px-10 py-5 rounded-2xl shadow-2xl">
          <div className="text-6xl font-black text-indigo-600">{surviveTime}</div>
          <div className="text-sm font-bold text-gray-700">Seconds Survived</div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500}
        onMouseMove={handleMouseMove}
        className="border-8 border-purple-700 mx-auto rounded-2xl cursor-none shadow-2xl bg-gradient-to-br from-gray-900 to-black"
      />
      
      <div className="mt-6 text-2xl font-black text-yellow-400 drop-shadow-lg animate-pulse">
        🖱️ MOVE TO SURVIVE! 🖱️
      </div>
    </div>
  )
}

// Stickman Cannon Jump - MARIO PARTY QUALITY with visible animated stickman
function StickmanCannonJumpGame({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerY, setPlayerY] = useState(340)
  const [velocity, setVelocity] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [cannonballs, setCannonballs] = useState<Array<{x: number, y: number, vx: number, vy: number, rotation: number}>>([])  
  const [fireRate, setFireRate] = useState(2000)
  const [jumps, setJumps] = useState(0)
  const [hit, setHit] = useState(false)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>>([])
  const [otherPlayers, setOtherPlayers] = useState<Array<{username: string, y: number, color: string}>>([])

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).io) {
      const socket = (window as any).io
      socket.on('cannonJumpPositions', (data: Array<{username: string, y: number}>) => {
        const colors = ['#ef4444', '#22c55e', '#3b82f6', '#fbbf24', '#a855f7']
        setOtherPlayers(data.map((p, i) => ({ ...p, color: colors[i % colors.length] })))
      })
      return () => socket.off('cannonJumpPositions')
    }
  }, [])

  useEffect(() => {
    const fireInterval = setInterval(() => {
      if (!hit) {
        setCannonballs(prev => [...prev, {
          x: 50,
          y: 320,
          vx: 8 + Math.random() * 3,
          vy: -4 - Math.random() * 3,
          rotation: 0
        }])
        setFireRate(prev => Math.max(600, prev - 80))
      }
    }, fireRate)

    return () => clearInterval(fireInterval)
  }, [fireRate, hit])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isJumping && !hit) {
        setIsJumping(true)
        setVelocity(-16)
        setJumps(prev => prev + 1)
        onInput({ action: 'jump', y: playerY, timestamp: Date.now() })
        
        for (let i = 0; i < 10; i++) {
          setParticles(prev => [...prev, {
            x: 380, y: playerY + 15,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 4,
            life: 30,
            color: '#3b82f6'
          }])
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onInput, isJumping, hit, playerY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      if (!hit) {
        // Physics
        const gravity = 0.9
        let newVelocity = velocity + gravity
        let newY = playerY + newVelocity
        
        const groundY = 340
        if (newY >= groundY) {
          newY = groundY
          newVelocity = 0
          setIsJumping(false)
        }
        
        setPlayerY(newY)
        setVelocity(newVelocity)
      }

      // Sky gradient
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grd.addColorStop(0, hit ? '#991b1b' : '#f97316')
      grd.addColorStop(1, hit ? '#7f1d1d' : '#fb923c')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ground with texture
      ctx.fillStyle = '#92400e'
      ctx.fillRect(0, 370, canvas.width, 30)
      ctx.fillStyle = '#b45309'
      for (let i = 0; i < 20; i++) {
        ctx.fillRect(i * 40 + 5, 370, 3, 8)
        ctx.fillRect(i * 40 + 20, 375, 3, 6)
      }

      // Draw cannon with detail
      ctx.shadowBlur = 15
      ctx.shadowColor = '#000'
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(15, 335, 50, 35)
      ctx.fillStyle = '#374151'
      ctx.fillRect(20, 340, 40, 25)
      
      ctx.fillStyle = '#6b7280'
      ctx.beginPath()
      ctx.arc(40, 352, 12, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#111827'
      ctx.beginPath()
      ctx.arc(40, 352, 6, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(52, 345, 35, 14)
      
      ctx.shadowBlur = 0

      // Update and draw cannonballs with rotation and effects
      const newBalls = cannonballs.map(ball => {
        const newX = ball.x + ball.vx
        const newY = ball.y + ball.vy
        const newVy = ball.vy + 0.4
        const newRotation = ball.rotation + 0.15
        
        ctx.save()
        ctx.translate(ball.x, ball.y)
        ctx.rotate(newRotation)
        
        ctx.shadowBlur = 15
        ctx.shadowColor = '#dc2626'
        ctx.fillStyle = '#0f172a'
        ctx.beginPath()
        ctx.arc(0, 0, 15, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = '#374151'
        ctx.beginPath()
        ctx.arc(-4, -4, 6, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
        ctx.shadowBlur = 0
        
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.beginPath()
        ctx.ellipse(ball.x, 370, 12, 4, 0, 0, Math.PI * 2)
        ctx.fill()
        
        const playerX = 420
        const dist = Math.sqrt((ball.x - playerX) ** 2 + (ball.y - playerY) ** 2)
        if (dist < 30 && !hit) {
          setHit(true)
          onInput({ action: 'hit', timestamp: Date.now() })
          for (let i = 0; i < 40; i++) {
            setParticles(prev => [...prev, {
              x: playerX, y: playerY,
              vx: (Math.random() - 0.5) * 15,
              vy: (Math.random() - 0.5) * 15,
              life: 60,
              color: '#dc2626'
            }])
          }
        }

        return { ...ball, x: newX, y: newY, vy: newVy, rotation: newRotation }
      }).filter(ball => ball.x < canvas.width + 50 && ball.y < 400)

      setCannonballs(newBalls)

      // Draw other players (multiplayer visibility)
      otherPlayers.forEach((p, i) => {
        const opX = 180 + i * 60
        const opY = p.y
        const animOpY = opY + Math.sin(Date.now() / 200 + opX) * 3
        
        ctx.globalAlpha = 0.6
        ctx.fillStyle = p.color
        ctx.shadowBlur = 12
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(opX, animOpY - 25, 14, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(opX - 5, animOpY - 27, 3, 0, Math.PI * 2)
        ctx.arc(opX + 5, animOpY - 27, 3, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.strokeStyle = p.color
        ctx.lineWidth = 5
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(opX, animOpY - 11)
        ctx.lineTo(opX, animOpY + 8)
        ctx.moveTo(opX, animOpY - 3)
        ctx.lineTo(opX - 12, animOpY + 3)
        ctx.moveTo(opX, animOpY - 3)
        ctx.lineTo(opX + 12, animOpY + 3)
        ctx.moveTo(opX, animOpY + 8)
        ctx.lineTo(opX - 8, animOpY + 20)
        ctx.moveTo(opX, animOpY + 8)
        ctx.lineTo(opX + 8, animOpY + 20)
        ctx.stroke()
        
        ctx.globalAlpha = 1
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.font = 'bold 11px Arial'
        ctx.textAlign = 'center'
        ctx.strokeText(p.username.substring(0, 8), opX, animOpY - 40)
        ctx.fillText(p.username.substring(0, 8), opX, animOpY - 40)
      })

      // Draw main player with detailed animation
      const playerX = 420
      const animY = playerY + (isJumping ? 0 : Math.sin(Date.now() / 200) * 2)
      const legAngle = isJumping ? Math.PI / 4 : Math.sin(Date.now() / 150) * 0.3
      const armAngle = isJumping ? -Math.PI / 3 : Math.sin(Date.now() / 180) * 0.2
      
      ctx.fillStyle = hit ? '#7f1d1d' : '#3b82f6'
      ctx.shadowBlur = 20
      ctx.shadowColor = hit ? '#dc2626' : '#3b82f6'
      ctx.beginPath()
      ctx.arc(playerX, animY - 25, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(playerX - 6, animY - 27, 5, 0, Math.PI * 2)
      ctx.arc(playerX + 6, animY - 27, 5, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(playerX - 6, animY - 26, 3, 0, Math.PI * 2)
      ctx.arc(playerX + 6, animY - 26, 3, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.strokeStyle = hit ? '#7f1d1d' : '#3b82f6'
      ctx.lineWidth = 8
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(playerX, animY - 7)
      ctx.lineTo(playerX, animY + 12)
      ctx.stroke()
      
      ctx.save()
      ctx.translate(playerX, animY - 3)
      ctx.rotate(armAngle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-18, 8)
      ctx.stroke()
      ctx.restore()
      
      ctx.save()
      ctx.translate(playerX, animY - 3)
      ctx.rotate(-armAngle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(18, 8)
      ctx.stroke()
      ctx.restore()
      
      ctx.save()
      ctx.translate(playerX, animY + 12)
      ctx.rotate(legAngle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-5, 22)
      ctx.stroke()
      ctx.restore()
      
      ctx.save()
      ctx.translate(playerX, animY + 12)
      ctx.rotate(-legAngle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(5, 22)
      ctx.stroke()
      ctx.restore()
      
      // Particles
      const updated = particles.map(p => ({
        ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.5, life: p.life - 1
      })).filter(p => p.life > 0)
      updated.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 60
        ctx.beginPath()
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      setParticles(updated)
    }

    const animationId = setInterval(animate, 1000 / 60)
    return () => clearInterval(animationId)
  }, [playerY, velocity, cannonballs, hit, onInput, isJumping, particles, otherPlayers])

  return (
    <div className="bg-gradient-to-br from-orange-600 via-red-500 to-rose-600 rounded-xl p-8 text-center shadow-2xl">
      <h3 className="text-5xl font-black mb-3 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">💣 CANNON JUMP! 💣</h3>
      <p className="text-2xl font-bold mb-4 text-yellow-300 drop-shadow-lg">Jump over the deadly cannonballs!</p>
      
      <div className="mb-6 flex items-center justify-center gap-8">
        <div className={`px-10 py-5 rounded-2xl shadow-2xl ${hit ? 'bg-red-700' : 'bg-emerald-500'} text-white`}>
          <div className="text-5xl font-black">{hit ? '💀 HIT!' : '⚡ DODGING'}</div>
        </div>
        <div className="bg-white px-10 py-5 rounded-2xl shadow-2xl">
          <div className="text-6xl font-black text-orange-600">{jumps}</div>
          <div className="text-sm font-bold text-gray-700">Successful Jumps</div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400}
        className="border-8 border-orange-900 mx-auto rounded-2xl shadow-2xl"
      />
      
      <div className="mt-6 text-3xl font-black text-white drop-shadow-lg animate-pulse">
        🎯 SPACEBAR TO JUMP! 🎯
      </div>
      
      {jumps > 10 && (
        <div className="mt-4 text-2xl font-bold text-yellow-400 drop-shadow-lg animate-bounce">
          🔥 {jumps} JUMPS! YOU'RE ON FIRE! 🔥
        </div>
      )}
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
    <div className={`rounded-xl p-12 text-center transition-colors duration-200 shadow-2xl ${
      flash === 'correct' 
        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
        : flash === 'wrong'
        ? 'bg-gradient-to-br from-red-500 to-rose-600'
        : 'bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900'
    }`}>
      <h3 className="text-5xl font-black mb-4 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
        ⚡ MATH FLASH RUSH! ⚡
      </h3>
      <p className="text-2xl font-bold mb-6 text-yellow-300 drop-shadow-lg">
        Solve FAST! Every second counts!
      </p>
      
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-12 mb-8 shadow-2xl border-8 border-purple-400">
        <div className="text-9xl font-black text-gray-800 mb-6 font-mono drop-shadow-lg">
          {problem.a} {problem.op} {problem.b} = ?
        </div>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          className="text-8xl font-black text-center w-80 px-12 py-6 border-8 border-purple-500 rounded-3xl focus:outline-none focus:ring-8 focus:ring-purple-300 text-purple-600 placeholder-gray-400 shadow-2xl"
          placeholder="?"
          autoFocus
        />
      </div>
      
      <button 
        onClick={checkAnswer} 
        disabled={!answer}
        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-black text-4xl px-24 py-10 rounded-3xl disabled:opacity-50 transition-all hover:scale-110 shadow-2xl mb-8 border-8 border-white"
      >
        🚀 SUBMIT!
      </button>
      
      <div className="flex justify-center gap-10">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl px-12 py-8 shadow-2xl border-4 border-white">
          <div className="text-7xl font-black text-white">🎯 {score}</div>
          <p className="text-xl font-bold text-green-100">Correct!</p>
        </div>
        {streak > 0 && (
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl px-12 py-8 shadow-2xl border-4 border-yellow-400 animate-pulse">
            <div className="text-7xl font-black text-white">🔥 {streak}</div>
            <p className="text-xl font-bold text-orange-100">STREAK!</p>
          </div>
        )}
      </div>
      
      {streak >= 3 && (
        <div className="mt-8 text-4xl font-black text-yellow-400 drop-shadow-2xl animate-bounce">
          {streak >= 10 ? '🔥 UNSTOPPABLE! 🔥' : streak >= 7 ? '⚡ ON FIRE! ⚡' : '⭐ HOT STREAK! ⭐'}
        </div>
      )}
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
