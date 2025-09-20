import { useEffect, useRef } from 'react'
import { createGame } from '../game/phaser'

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const game = createGame(containerRef.current)
    const resize = () => {
      const c = containerRef.current!
      game.scale.resize(c.clientWidth, c.clientHeight)
    }
    window.addEventListener('resize', resize)
    resize()
    return () => {
      window.removeEventListener('resize', resize)
      game.destroy(true)
    }
  }, [])

  return (
    <div className="gameShell">
      <div ref={containerRef} className="flex1" />
    </div>
  )
}

export default GameCanvas


