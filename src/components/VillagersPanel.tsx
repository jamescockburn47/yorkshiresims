import { useEffect, useState } from 'react'
import { listVillagers, onVillagersChanged, renameVillager } from '../game/state/villagers'

export default function VillagersPanel() {
  const [_, setTick] = useState(0)
  const vs = listVillagers()

  useEffect(() => {
    return onVillagersChanged(() => setTick((t) => t + 1))
  }, [])

  return (
    <div className="rightPanel">
      <div className="panelTitle">Villagers</div>
      {vs.map(v => (
        <div key={v.id} className="villagerRow">
          <label className="srOnly" htmlFor={`name-${v.id}`}>Villager name</label>
          <input
            id={`name-${v.id}`}
            className="nameInput"
            value={v.name}
            onChange={e => renameVillager(v.id, e.target.value)}
            placeholder="Name"
          />
          <span className="roleText">{v.role}</span>
        </div>
      ))}
    </div>
  )
}


