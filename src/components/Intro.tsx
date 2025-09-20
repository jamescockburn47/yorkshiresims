import { useEffect, useMemo, useState } from 'react'

interface IntroProps {
  onStart: () => void
}

const IMAGE_URLS = [
  // Publicly viewable images; replace with local assets later
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Heather_on_Dartmoor.jpg/640px-Heather_on_Dartmoor.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Yorkshire_Dales_-_Dry_Stone_Walls.jpg/640px-Yorkshire_Dales_-_Dry_Stone_Walls.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Goathland_Railway_Station.jpg/640px-Goathland_Railway_Station.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Whitby_Abbey_2008.jpg/640px-Whitby_Abbey_2008.jpg',
]

import { seedVillagers } from '../game/state/villagers'
import { AudioManager } from '../audio/AudioManager'

export default function Intro({ onStart }: IntroProps) {
  const [idx, setIdx] = useState(0)
  const images = useMemo(() => IMAGE_URLS, [])

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % images.length)
    }, 3000)
    return () => clearInterval(t)
  }, [images.length])

  const startGame = async () => { await AudioManager.start(); seedVillagers(6); onStart() }
  return (
    <div className="appRoot">
      <div className="introContainer">
        <div className="introOverlay">
          <h1 className="introTitle">Yorkshire Sims: Moors</h1>
          <p className="introSubtitle">Cozy co-op village-builder on the Moors</p>
          <button className="primaryButton" onClick={startGame}>Start</button>
        </div>
        <div className="carousel">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              className={`carouselImage ${i === idx ? 'active' : ''}`}
              alt="Yorkshire"
            />
          ))}
        </div>
      </div>
    </div>
  )
}


