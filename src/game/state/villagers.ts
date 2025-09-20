import { createNanoEvents } from 'nanoevents'

export interface Villager {
  id: string
  name: string
  role?: string
}

type VillagerEvents = {
  changed: () => void
}

const emitter = createNanoEvents<VillagerEvents>()

const villagers: Villager[] = []

export function onVillagersChanged(cb: () => void) {
  return emitter.on('changed', cb)
}

export function listVillagers(): Villager[] {
  return villagers
}

export function renameVillager(id: string, name: string) {
  const v = villagers.find(v => v.id === id)
  if (!v) return
  v.name = name
  emitter.emit('changed')
}

const DEFAULT_NAMES = ['Arthur', 'Elsie', 'Jack', 'Moira', 'Graham', 'Layla', 'Iris']
const DEFAULT_ROLES = ['Farmer', 'Shepherd', 'Publican', 'Shopkeeper', 'Rail Volunteer']

export function seedVillagers(count = 5) {
  if (villagers.length > 0) return
  for (let i = 0; i < count; i++) {
    const id = `v-${i}-${Math.random().toString(36).slice(2, 7)}`
    const name = DEFAULT_NAMES[i % DEFAULT_NAMES.length]
    const role = DEFAULT_ROLES[i % DEFAULT_ROLES.length]
    villagers.push({ id, name, role })
  }
  emitter.emit('changed')
}



