import { events, Season } from './events'

// 5 minutes per in-game day
const DAY_LENGTH_MS = 5 * 60 * 1000
const DAYS_PER_SEASON = 7

export class TimeSystem {
  private elapsedMs: number = 0
  private currentDay: number = 1
  private currentSeason: Season = 'Spring'

  start() {
    // no-op for now
  }

  update(deltaMs: number) {
    this.elapsedMs += deltaMs
    const dayProgress = (this.elapsedMs % DAY_LENGTH_MS) / DAY_LENGTH_MS
    events.emit('timeUpdated', dayProgress)

    if (this.elapsedMs >= DAY_LENGTH_MS) {
      this.elapsedMs -= DAY_LENGTH_MS
      this.currentDay += 1
      events.emit('dayChanged', this.currentDay)
      this.updateSeason()
    }
  }

  private updateSeason() {
    const seasonIndex = Math.floor((this.currentDay - 1) / DAYS_PER_SEASON) % 4
    const nextSeason: Season = ['Spring', 'Summer', 'Autumn', 'Winter'][seasonIndex] as Season
    if (nextSeason !== this.currentSeason) {
      this.currentSeason = nextSeason
      events.emit('seasonChanged', this.currentSeason)
    }
  }

  get season() { return this.currentSeason }
}


