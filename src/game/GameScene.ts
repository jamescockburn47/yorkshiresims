import Phaser from 'phaser'
import { events } from './events'
import { TimeSystem } from './time'
import { generateMoors, getMoorsPalette } from './biome/moors'
import { TilemapRenderer } from './TilemapRenderer'
import { BuildSystem } from './BuildSystem'

export class GameScene extends Phaser.Scene {
  private timeSystem!: TimeSystem

  constructor() {
    super('GameScene')
  }

  preload() {
    // Placeholder: could load tiles/voxels later
  }

  create() {
    this.cameras.main.setBackgroundColor(0x0e1510)

    // Camera controls: WASD pan, mouse wheel zoom
    const cam = this.cameras.main
    cam.setZoom(1)

    this.input.keyboard?.on('keydown-W', () => cam.scrollY -= 50)
    this.input.keyboard?.on('keydown-S', () => cam.scrollY += 50)
    this.input.keyboard?.on('keydown-A', () => cam.scrollX -= 50)
    this.input.keyboard?.on('keydown-D', () => cam.scrollX += 50)

    this.input.on('wheel', (_p: any, _g: any, _dx: number, dy: number) => {
      const factor = dy > 0 ? 0.9 : 1.1
      cam.setZoom(Phaser.Math.Clamp(cam.zoom * factor, 0.3, 3))
    })

    this.timeSystem = new TimeSystem()
    this.timeSystem.start()

    // Generate moors tilemap and render
    const tileSize = 16
    const tilemap = generateMoors({ sizeTiles: 256, tileSizePx: tileSize })
    let renderer = new TilemapRenderer(this)
    let layer = renderer.draw(tilemap, tileSize, getMoorsPalette(this.timeSystem.season))

    // Update palette on season change
    events.on('seasonChanged', (s) => {
      layer.destroy()
      renderer = new TilemapRenderer(this)
      layer = renderer.draw(tilemap, tileSize, getMoorsPalette(s))
    })

    // Build system: disallow placement on water/rock
    const getTileAt = (wx: number, wy: number) => {
      const x = Math.floor(wx / tileSize) + Math.floor(tilemap.width / 2)
      const y = Math.floor(wy / tileSize) + Math.floor(tilemap.height / 2)
      if (x < 0 || y < 0 || x >= tilemap.width || y >= tilemap.height) return null
      return tilemap.tiles[y * tilemap.width + x]
    }
    new BuildSystem(this, tileSize, getTileAt)
  }

  update(_time: number, delta: number) {
    this.timeSystem.update(delta)
    events.emit('tick', delta)
  }
}


