import './App.css'
import GameCanvas from './components/GameCanvas'
import RightPanel from './components/RightPanel'
import BuildPanel from './components/BuildPanel'
import VillagersPanel from './components/VillagersPanel'
import ResourcesPanel from './components/ResourcesPanel'
import EventsPanel from './components/EventsPanel'
import Intro from './components/Intro'
import { useState } from 'react'

function App() {
  const [started, setStarted] = useState(false)
  if (!started) return <Intro onStart={() => setStarted(true)} />
  return (
    <div className="appRoot">
      <div className="gameShell">
        <GameCanvas />
      </div>
      <div className="rightColumn">
        <RightPanel />
        <BuildPanel />
        <ResourcesPanel />
        <EventsPanel />
        <VillagersPanel />
      </div>
    </div>
  )
}

export default App
