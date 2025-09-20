import { createNanoEvents } from 'nanoevents'
import { events } from '../events'
import type { Season } from '../events'

export type ResourceKey = 'stone' | 'timber' | 'wool' | 'milk' | 'barley' | 'money'

export type ResourceState = Record<ResourceKey, number>

type EconomyEvents = {
  changed: () => void
}

const emitter = createNanoEvents<EconomyEvents>()

const resources: ResourceState = {
  stone: 10,
  timber: 10,
  wool: 0,
  milk: 0,
  barley: 0,
  money: 100,
}

let currentSeason: Season = 'Spring'

export function onEconomyChanged(cb: () => void) {
  return emitter.on('changed', cb)
}

export function getResources(): ResourceState {
  return resources
}

export function addResource(key: ResourceKey, amount: number) {
  resources[key] = Math.max(0, (resources[key] ?? 0) + amount)
  emitter.emit('changed')
}

export function spendMoney(amount: number) {
  addResource('money', -amount)
}

function seasonMultiplier(season: Season, key: ResourceKey) {
  switch (key) {
    case 'wool':
      return season === 'Spring' ? 1.4 : season === 'Summer' ? 1.1 : 0.8
    case 'milk':
      return season === 'Spring' ? 1.2 : season === 'Summer' ? 1.0 : 0.9
    case 'barley':
      return season === 'Autumn' ? 1.6 : season === 'Summer' ? 1.2 : 0.6
    case 'stone':
    case 'timber':
      return season === 'Winter' ? 0.8 : 1.0
    default:
      return 1.0
  }
}

// Simple daily production tick
function onDayChange() {
  const daily: Partial<ResourceState> = {
    wool: 1 * seasonMultiplier(currentSeason, 'wool'),
    milk: 1 * seasonMultiplier(currentSeason, 'milk'),
    barley: 0.6 * seasonMultiplier(currentSeason, 'barley'),
    stone: 0.5 * seasonMultiplier(currentSeason, 'stone'),
    timber: 0.5 * seasonMultiplier(currentSeason, 'timber'),
  }
  for (const [k, v] of Object.entries(daily)) {
    addResource(k as ResourceKey, Math.round((v as number) * 10) / 10)
  }
}

events.on('seasonChanged', (s) => { currentSeason = s })
events.on('dayChanged', () => onDayChange())



