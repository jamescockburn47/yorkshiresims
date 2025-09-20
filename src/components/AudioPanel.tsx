import { useEffect, useState } from 'react'
import { AudioManager } from '../audio/AudioManager'

export default function AudioPanel() {
  const [pub, setPub] = useState(false)
  useEffect(() => { AudioManager.enablePubAmbience(pub) }, [pub])
  return (
    <div className="rightPanel">
      <div className="panelTitle">Audio</div>
      <div className="rowSpace">
        <label htmlFor="pubAmb">Pub ambience</label>
        <input id="pubAmb" type="checkbox" checked={pub} onChange={e => setPub(e.target.checked)} />
      </div>
    </div>
  )
}


