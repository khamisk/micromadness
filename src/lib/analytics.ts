export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

type GTagEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Specific game events
export const trackLobbyCreated = () => {
  event({
    action: 'lobby_created',
    category: 'Game',
  })
}

export const trackLobbyJoined = () => {
  event({
    action: 'lobby_joined',
    category: 'Game',
  })
}

export const trackGameStarted = (playerCount: number) => {
  event({
    action: 'game_started',
    category: 'Game',
    value: playerCount,
  })
}

export const trackGameFinished = (duration: number) => {
  event({
    action: 'game_finished',
    category: 'Game',
    value: duration,
  })
}

export const trackMinigameStarted = (minigameName: string) => {
  event({
    action: 'minigame_started',
    category: 'Minigame',
    label: minigameName,
  })
}

export const trackMinigameFinished = (minigameName: string) => {
  event({
    action: 'minigame_finished',
    category: 'Minigame',
    label: minigameName,
  })
}
