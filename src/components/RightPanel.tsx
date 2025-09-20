import { useEffect, useState } from 'react'
import { events } from '../game/events'
import type { Season } from '../game/events'

export default function RightPanel() {
  const [time01, setTime01] = useState(0)
  const [day, setDay] = useState(1)
  const [season, setSeason] = useState<Season>('Spring')
  const progressPct = Math.round(time01 * 100)

  useEffect(() => {
    const un1 = events.on('timeUpdated', (v) => setTime01(v))
    const un2 = events.on('dayChanged', (d) => setDay(d))
    const un3 = events.on('seasonChanged', (s) => setSeason(s))
    return () => { un1(); un2(); un3() }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--day-progress', `${progressPct}%`)
  }, [progressPct])

  return (
    <div className="rightPanel">
      <div className="panelTitle">Village Status</div>
      <div>Season: {season}</div>
      <div>Day: {day}</div>
      <div className="panelTitle">Day Progress: {progressPct}%</div>
      <div className="progressTrack">
        <div className="progressBarFill" />
      </div>
    </div>
  )
}


