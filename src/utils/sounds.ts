// Simple sound effect utility using Web Audio API

class SoundManager {
  private audioContext: AudioContext | null = null

  private initAudio() {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  // Play a simple beep sound
  private playTone(frequency: number, duration: number, volume: number = 0.05) {
    this.initAudio()
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // Play multi-tone sequence
  private playSequence(notes: Array<{ freq: number; duration: number; delay: number }>, volume: number = 0.05) {
    notes.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, volume)
      }, note.delay)
    })
  }

  // Lobby join sound - cheerful ascending notes
  playLobbyJoin() {
    this.playSequence([
      { freq: 523.25, duration: 0.1, delay: 0 },     // C5
      { freq: 659.25, duration: 0.1, delay: 100 },   // E5
      { freq: 783.99, duration: 0.15, delay: 200 },  // G5
    ], 0.03)
  }

  // Lobby leave sound - descending notes
  playLobbyLeave() {
    this.playSequence([
      { freq: 783.99, duration: 0.1, delay: 0 },     // G5
      { freq: 659.25, duration: 0.15, delay: 100 },  // E5
    ], 0.03)
  }

  // Ready up sound - quick blip
  playReady() {
    this.playTone(880, 0.08, 0.025) // A5
  }

  // Game start countdown
  playCountdown() {
    this.playSequence([
      { freq: 440, duration: 0.15, delay: 0 },    // A4
      { freq: 440, duration: 0.15, delay: 300 },  // A4
      { freq: 440, duration: 0.15, delay: 600 },  // A4
      { freq: 880, duration: 0.3, delay: 900 },   // A5 - GO!
    ], 0.04)
  }

  // Minigame start
  playMinigameStart() {
    this.playSequence([
      { freq: 523.25, duration: 0.1, delay: 0 },    // C5
      { freq: 659.25, duration: 0.1, delay: 80 },   // E5
      { freq: 783.99, duration: 0.2, delay: 160 },  // G5
    ], 0.04)
  }

  // Win sound
  playWin() {
    this.playSequence([
      { freq: 523.25, duration: 0.1, delay: 0 },    // C5
      { freq: 659.25, duration: 0.1, delay: 100 },  // E5
      { freq: 783.99, duration: 0.1, delay: 200 },  // G5
      { freq: 1046.5, duration: 0.3, delay: 300 },  // C6
    ], 0.04)
  }

  // Lose sound
  playLose() {
    this.playSequence([
      { freq: 392, duration: 0.2, delay: 0 },       // G4
      { freq: 329.63, duration: 0.3, delay: 200 },  // E4
    ], 0.03)
  }

  // Error/buzzer sound
  playError() {
    this.playTone(150, 0.3, 0.025)
  }

  // Success/click sound
  playClick() {
    this.playTone(800, 0.05, 0.02)
  }
}

export const soundManager = new SoundManager()
