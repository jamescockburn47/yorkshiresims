import { createNanoEvents } from 'nanoevents'
import { events, Season } from '../events'

export type GameEventType = 'festival' | 'weather' | 'logistics' | 'wildlife' | 'heritage'

export interface GameEvent {
  id: string
  day: number
  season: Season
  type: GameEventType
  title: string
  description?: string
  acknowledged?: boolean
}

type EventsStoreEvents = {
  changed: () => void
}

const emitter = createNanoEvents<EventsStoreEvents>()

const today: GameEvent[] = []
const upcoming: GameEvent[] = []
let currentSeason: Season = 'Spring'
let currentDay: number = 1

export function onEventsChanged(cb: () => void) { return emitter.on('changed', cb) }
export function getTodayEvents() { return today }
export function getUpcomingEvents() { return upcoming }
export function acknowledgeEvent(id: string) {
  const e = today.find(e => e.id === id)
  if (e) { e.acknowledged = true; emitter.emit('changed') }
}

function id(prefix: string) { return `${prefix}-${Math.random().toString(36).slice(2,7)}` }

function scheduleFestivalsFor(season: Season) {
  const baseTitles: Record<Season, { day: number, title: string, type: GameEventType }[]> = {
    Spring: [
      { day: 3, title: 'Spring Fair (Planting)', type: 'festival' },
    ],
    Summer: [
      { day: 5, title: 'Summer Fête (Cricket & Bunting)', type: 'festival' },
    ],
    Autumn: [
      { day: 5, title: 'Harvest Festival (Church)', type: 'festival' },
    ],
    Winter: [
      { day: 6, title: 'Winter Lights (Choir & Mulled Ale)', type: 'festival' },
    ],
  }
  for (const f of baseTitles[season]) {
    upcoming.push({ id: id('fest'), day: f.day, season, type: f.type, title: f.title })
  }
}

function maybeRandomDaily() {
  // 25% chance of a random event each day
  if (Math.random() > 0.25) return
  const pool: Omit<GameEvent, 'id' | 'day' | 'season'>[] = [
    { type: 'weather', title: 'Heavy Rain', description: 'Flood risk in low becks' },
    { type: 'weather', title: 'Fog', description: 'Visibility reduced on the moor lanes' },
    { type: 'weather', title: 'Snow Flurry', description: 'Paths slippery; travel slowed' },
    { type: 'logistics', title: 'Supply Delay', description: 'Shop deliveries running late' },
    { type: 'wildlife', title: 'Lambing Season', description: 'Shepherds could use a hand' },
    { type: 'heritage', title: 'Steam Gala', description: 'Rail volunteers expect crowds' },
    { type: 'wildlife', title: 'Hiker Lost', description: 'Check the footpaths and waymarkers' },
  ]
  const pick = pool[Math.floor(Math.random() * pool.length)]
  today.push({ id: id('rand'), day: currentDay, season: currentSeason, ...pick })
}

function rolloverDay() {
  // Move due upcoming to today
  for (let i = upcoming.length - 1; i >= 0; i--) {
    const e = upcoming[i]
    if (e.season === currentSeason && e.day === (currentDay % 7 || 7)) {
      today.push(e)
      upcoming.splice(i, 1)
    }
  }
  maybeRandomDaily()
  emitter.emit('changed')
}

events.on('seasonChanged', (s) => {
  currentSeason = s
  // clear existing season festivals and reschedule for new season
  for (let i = upcoming.length - 1; i >= 0; i--) {
    if (upcoming[i].type === 'festival') upcoming.splice(i, 1)
  }
  scheduleFestivalsFor(s)
  emitter.emit('changed')
})

events.on('dayChanged', (d) => {
  currentDay = d
  rolloverDay()
})

// initial schedule
scheduleFestivalsFor(currentSeason)


