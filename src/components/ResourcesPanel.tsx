import { useEffect, useState } from 'react'
import { getResources, onEconomyChanged } from '../game/state/economy'

export default function ResourcesPanel() {
  const [_, setTick] = useState(0)
  const res = getResources()
  useEffect(() => onEconomyChanged(() => setTick(t => t + 1)), [])
  return (
    <div className="rightPanel">
      <div className="panelTitle">Resources</div>
      {Object.entries(res).map(([k, v]) => (
        <div key={k} className="rowSpace">
          <span>{k}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
  )
}


