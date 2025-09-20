import { createNanoEvents } from 'nanoevents'

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'

export type BuildType = 'cottage' | 'wall'

export type GameEvents = {
  tick: (deltaMs: number) => void
  timeUpdated: (timeOfDay01: number) => void
  dayChanged: (dayNumber: number) => void
  seasonChanged: (season: Season) => void
  buildSelect: (type: BuildType | null) => void
}

export const events = createNanoEvents<GameEvents>()


