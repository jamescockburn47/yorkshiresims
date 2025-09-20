import { useEffect, useState } from 'react'
import { acknowledgeEvent, getTodayEvents, getUpcomingEvents, onEventsChanged } from '../game/state/events'

export default function EventsPanel() {
  const [_, setTick] = useState(0)
  const today = getTodayEvents()
  const upcoming = getUpcomingEvents()
  useEffect(() => onEventsChanged(() => setTick(t => t + 1)), [])
  return (
    <div className="rightPanel">
      <div className="panelTitle">Events</div>
      <div className="mb8">Today</div>
      {today.length === 0 && <div className="muted mb8">No events today</div>}
      {today.map(e => (
        <div key={e.id} className="mb6">
          <div className="bold">{e.title}</div>
          {e.description && <div className="muted">{e.description}</div>}
          {!e.acknowledged && (
            <button className="primaryButton" onClick={() => acknowledgeEvent(e.id)}>Acknowledge</button>
          )}
        </div>
      ))}
      <div className="panelTitle mb8">Upcoming</div>
      {upcoming.map(e => (
        <div key={e.id} className="rowSpace">
          <span>{e.title}</span>
          <span className="muted">{e.season} · Day {e.day}</span>
        </div>
      ))}
    </div>
  )
}


