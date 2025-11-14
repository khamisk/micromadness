'use client'

import { MinigameConfig } from '@/types'

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
    
    default:
      return <DefaultMinigameUI minigame={minigame} onInput={onInput} />
  }
}

// Example minigame implementations
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

import { useState, useEffect } from 'react'

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

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-12">
      <div className="text-center mb-8">
        <div className="text-xl font-mono bg-gray-100 p-4 rounded mb-4">
          {sentence}
        </div>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          disabled={completed}
          className="input-field text-lg text-center w-full max-w-2xl"
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
