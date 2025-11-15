'use client'

import { MinigameConfig } from '@/types'
import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

// MARIO PARTY QUALITY TUG OF WAR
// Full animated teams pulling rope with real-time sync
export function TeamTugOfWarMP({ minigame, onInput }: { minigame: MinigameConfig; onInput: (data: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [presses, setPresses] = useState(0)
  const [ropePosition, setRopePosition] = useState(0) // -50 to 50
  const [leftScore, setLeftScore] = useState(0)
  const [rightScore, setRightScore] = useState(0)
  const [playerStats, setPlayerStats] = useState<Record<string, number>>({})
  const [myTeam, setMyTeam] = useState<'left' | 'right'>('left')
  const [teamMembers, setTeamMembers] = useState<{ left: any[], right: any[] }>({ left: [], right: [] })
  const socketRef = useRef<Socket | null>(null)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>>([])

  useEffect(() => {
    const teams = minigame.config?.teams || {}
    const teamMembersData = minigame.config?.teamMembers || { left: [], right: [] }
    setTeamMembers(teamMembersData)
    
    // Find my team (simplified - would use actual playerId)
    setMyTeam('left')

    // Socket.IO connection for real-time updates
    if (typeof window !== 'undefined') {
      const socket = io({
        path: '/api/socket',
      })
      socketRef.current = socket
      
      socket.on('tugOfWarUpdate', (data: any) => {
        setRopePosition(data.ropePosition)
        setLeftScore(data.leftScore)
        setRightScore(data.rightScore)
        setPlayerStats(data.playerStats)
        
        // Add celebration particles when team scores
        if (Math.abs(data.ropePosition) > 30) {
          const team = data.ropePosition > 0 ? 'left' : 'right'
          addCelebrationParticles(team)
        }
      })
      
      return () => {
        socket.off('tugOfWarUpdate')
        socket.disconnect()
      }
    }
  }, [minigame])

  const addCelebrationParticles = (team: 'left' | 'right') => {
    const x = team === 'left' ? 150 : 550
    const newParticles = Array.from({ length: 10 }, () => ({
      x,
      y: 200,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 60,
      color: team === 'left' ? '#3b82f6' : '#ef4444'
    }))
    setParticles(prev => [...prev, ...newParticles])
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setPresses(prev => prev + 1)
        onInput({ action: 'press', timestamp: Date.now() })
        
        // Add visual feedback
        addPressParticle()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onInput])

  const addPressParticle = () => {
    const x = myTeam === 'left' ? 200 : 500
    setParticles(prev => [...prev, {
      x,
      y: 350,
      vx: (Math.random() - 0.5) * 5,
      vy: -8,
      life: 30,
      color: myTeam === 'left' ? '#3b82f6' : '#ef4444'
    }])
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      // Sky background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#87CEEB')
      gradient.addColorStop(1, '#e0f7fa')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Sun
      ctx.fillStyle = '#FFD700'
      ctx.shadowBlur = 30
      ctx.shadowColor = '#FFD700'
      ctx.beginPath()
      ctx.arc(650, 80, 40, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Grass ground
      ctx.fillStyle = '#2d5016'
      ctx.fillRect(0, canvas.height - 120, canvas.width, 120)
      
      // Grass texture
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#3a6418' : '#2d5016'
        const x = Math.random() * canvas.width
        const y = canvas.height - 120 + Math.random() * 30
        ctx.fillRect(x, y, 5, 10)
      }
      
      // Center line
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 5
      ctx.setLineDash([15, 15])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw rope with 3D effect
      const ropeY = canvas.height / 2
      const ropeOffset = (ropePosition / 50) * 250
      const centerX = canvas.width / 2 + ropeOffset

      // Rope shadow
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'
      ctx.lineWidth = 16
      ctx.beginPath()
      ctx.moveTo(100, ropeY + 10)
      ctx.lineTo(canvas.width - 100, ropeY + 10)
      ctx.stroke()

      // Rope main
      ctx.strokeStyle = '#8B4513'
      ctx.lineWidth = 14
      ctx.beginPath()
      ctx.moveTo(100, ropeY)
      ctx.lineTo(canvas.width - 100, ropeY)
      ctx.stroke()

      // Rope highlights
      ctx.strokeStyle = '#A0522D'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(100, ropeY - 3)
      ctx.lineTo(canvas.width - 100, ropeY - 3)
      ctx.stroke()

      // Flag at center
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
      
      // Flag pole
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(centerX, ropeY - 50)
      ctx.lineTo(centerX, ropeY)
      ctx.stroke()

      // Draw animated team members
      const drawPlayer = (x: number, y: number, color: string, pulling: boolean, username: string, presses: number) => {
        const pullOffset = pulling ? 5 : 0
        const baseY = y + Math.sin(Date.now() / 200 + x) * 3 // Breathing animation
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.beginPath()
        ctx.ellipse(x, canvas.height - 110, 20, 5, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Body (pulling animation)
        const angle = pulling ? -0.3 : -0.1
        ctx.save()
        ctx.translate(x, baseY)
        ctx.rotate(angle)
        
        // Legs
        ctx.strokeStyle = color
        ctx.lineWidth = 8
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(0, 30)
        ctx.lineTo(-12, 60 + pullOffset)
        ctx.moveTo(0, 30)
        ctx.lineTo(12, 60 + pullOffset)
        ctx.stroke()
        
        // Body
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, 30)
        ctx.stroke()
        
        // Arms (pulling pose)
        ctx.beginPath()
        ctx.moveTo(0, 10)
        ctx.lineTo(-25 - pullOffset, 15)
        ctx.moveTo(0, 10)
        ctx.lineTo(-25 - pullOffset, 5)
        ctx.stroke()
        
        ctx.restore()
        
        // Head
        ctx.fillStyle = color
        ctx.shadowBlur = 10
        ctx.shadowColor = color
        ctx.beginPath()
        ctx.arc(x, baseY - 15, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        
        // Eyes
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(x - 6, baseY - 17, 4, 0, Math.PI * 2)
        ctx.arc(x + 6, baseY - 17, 4, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(x - 6, baseY - 16, 2, 0, Math.PI * 2)
        ctx.arc(x + 6, baseY - 16, 2, 0, Math.PI * 2)
        ctx.fill()
        
        // Mouth (determined/shouting)
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, baseY - 10, 5, 0, Math.PI)
        ctx.stroke()
        
        // Username above head
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 3
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        ctx.strokeText(username, x, baseY - 50)
        ctx.fillText(username, x, baseY - 50)
        
        // Press counter
        ctx.fillStyle = color
        ctx.font = 'bold 16px Arial'
        ctx.strokeText(presses.toString(), x, baseY - 65)
        ctx.fillText(presses.toString(), x, baseY - 65)
      }

      // Draw left team
      const leftY = canvas.height - 180
      teamMembers.left.forEach((player, i) => {
        const x = 180 + i * 80
        const isPulling = ropePosition < 0
        drawPlayer(x, leftY, '#3b82f6', isPulling, player.username || `P${i+1}`, playerStats[player.playerId] || 0)
      })

      // Draw right team
      const rightY = canvas.height - 180
      teamMembers.right.forEach((player, i) => {
        const x = canvas.width - 180 - i * 80
        const isPulling = ropePosition > 0
        drawPlayer(x, rightY, '#ef4444', isPulling, player.username || `P${i+1}`, playerStats[player.playerId] || 0)
      })

      // Draw and update particles
      const updatedParticles = particles.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.5, // Gravity
        life: p.life - 1
      })).filter(p => p.life > 0)
      
      updatedParticles.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 60
        ctx.beginPath()
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      
      setParticles(updatedParticles)

      // Score displays with podiums
      ctx.fillStyle = '#3b82f6'
      ctx.shadowBlur = 20
      ctx.shadowColor = '#3b82f6'
      ctx.font = 'bold 60px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(leftScore.toString(), 100, 100)
      ctx.shadowBlur = 0
      
      ctx.fillStyle = '#ef4444'
      ctx.shadowBlur = 20
      ctx.shadowColor = '#ef4444'
      ctx.textAlign = 'center'
      ctx.fillText(rightScore.toString(), canvas.width - 100, 100)
      ctx.shadowBlur = 0
    }

    const animationId = setInterval(draw, 1000 / 60)
    return () => clearInterval(animationId)
  }, [ropePosition, leftScore, rightScore, teamMembers, playerStats, particles])

  return (
    <div className="bg-gradient-to-br from-sky-300 via-blue-200 to-green-200 rounded-xl p-6 text-center shadow-2xl">
      <h3 className="text-4xl font-black mb-3 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] animate-bounce">
        ⚔️ TUG OF WAR! ⚔️
      </h3>
      <p className="text-xl font-bold mb-4 text-gray-800 drop-shadow-lg">
        You're on <span className={myTeam === 'left' ? 'text-blue-600' : 'text-red-600'}>
          {myTeam === 'left' ? '🔵 BLUE' : '🔴 RED'}
        </span> Team!
      </p>
      
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={500}
        className="border-8 border-amber-900 mx-auto rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] bg-sky-100"
      />
      
      <div className="mt-6 flex items-center justify-center gap-8">
        <div className="bg-blue-600 text-white px-10 py-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-all">
          <div className="text-6xl font-black drop-shadow-lg">{leftScore}</div>
          <div className="text-sm font-bold mt-1">Blue Team</div>
        </div>
        <div className="bg-white px-10 py-6 rounded-2xl shadow-2xl border-4 border-amber-400">
          <div className="text-5xl font-black text-gray-800">{presses}</div>
          <div className="text-sm text-gray-600 font-bold">Your Presses</div>
          <div className="text-xs text-gray-500 mt-1">Keep Mashing!</div>
        </div>
        <div className="bg-red-600 text-white px-10 py-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-all">
          <div className="text-6xl font-black drop-shadow-lg">{rightScore}</div>
          <div className="text-sm font-bold mt-1">Red Team</div>
        </div>
      </div>
      
      <div className="mt-8 text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse">
        ⌨️ MASH SPACEBAR! ⌨️
      </div>
      
      {Math.abs(ropePosition) > 40 && (
        <div className="mt-4 text-2xl font-bold text-yellow-400 drop-shadow-lg animate-bounce">
          🔥 {ropePosition > 0 ? 'RED' : 'BLUE'} TEAM IS DOMINATING! 🔥
        </div>
      )}
    </div>
  )
}
