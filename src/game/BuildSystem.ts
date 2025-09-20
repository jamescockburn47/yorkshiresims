import Phaser from 'phaser'
import { BuildType, events } from './events'
import { TileType } from './biome/moors'
import { ensureBuildSprites } from './BuildSprites'

export class BuildSystem {
  private current: BuildType | null = null
  private preview?: Phaser.GameObjects.Image
  private tileSize: number
  private getTileAt: (wx: number, wy: number) => TileType | null

  constructor(private scene: Phaser.Scene, tileSize: number, getTileAt: (wx: number, wy: number) => TileType | null) {
    this.tileSize = tileSize
    this.getTileAt = getTileAt
    events.on('buildSelect', (t) => this.setMode(t))
    this.scene.input.on('pointermove', (p: Phaser.Input.Pointer) => this.onPointerMove(p))
    this.scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onPointerDown(p))
  }

  setMode(type: BuildType | null) {
    this.current = type
    if (!type) {
      this.preview?.destroy(); this.preview = undefined
    }
  }

  private worldToGrid(x: number, y: number) {
    const gx = Math.floor(x / this.tileSize)
    const gy = Math.floor(y / this.tileSize)
    return { gx, gy }
  }

  private onPointerMove(p: Phaser.Input.Pointer) {
    if (!this.current) return
    const wx = (p.worldX)
    const wy = (p.worldY)
    const { gx, gy } = this.worldToGrid(wx, wy)
    const rx = gx * this.tileSize
    const ry = gy * this.tileSize
    if (!this.preview) {
      const keys = ensureBuildSprites(this.scene, this.tileSize)
      const key = this.current === 'cottage' ? keys.cottageKey : keys.wallKey
      this.preview = this.scene.add.image(0, 0, key).setAlpha(0.6)
    }
    this.preview.setPosition(rx + this.tileSize / 2, ry + this.tileSize / 2)
  }

  private isAllowed(tile: TileType | null) {
    if (!tile) return false
    return tile !== 'water' && tile !== 'rock'
  }

  private onPointerDown(p: Phaser.Input.Pointer) {
    if (!this.current) return
    const { gx, gy } = this.worldToGrid(p.worldX, p.worldY)
    const tile = this.getTileAt(gx * this.tileSize, gy * this.tileSize)
    if (!this.isAllowed(tile)) return
    const keys = ensureBuildSprites(this.scene, this.tileSize)
    const key = this.current === 'cottage' ? keys.cottageKey : keys.wallKey
    this.scene.add.image(gx * this.tileSize + this.tileSize / 2, gy * this.tileSize + this.tileSize / 2, key)
  }
}


