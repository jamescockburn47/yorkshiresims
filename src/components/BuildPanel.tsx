import { events } from '../game/events'
import type { BuildType } from '../game/events'

export default function BuildPanel() {
  const select = (t: BuildType | null) => events.emit('buildSelect', t)
  return (
    <div className="rightPanel">
      <div className="panelTitle">Build</div>
      <div className="buildRow">
        <button className="primaryButton" onClick={() => select('cottage')}>Stone Cottage</button>
        <button className="primaryButton" onClick={() => select('wall')}>Dry-stone Wall</button>
        <button className="primaryButton" onClick={() => select(null)}>Cancel</button>
      </div>
    </div>
  )
}


