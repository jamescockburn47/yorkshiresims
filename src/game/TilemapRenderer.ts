import Phaser from 'phaser'
import { TilemapData } from './biome/moors'
import { ensureTileTextures } from './TileTextures'

export class TilemapRenderer {
  constructor(private scene: Phaser.Scene) {}

  draw(tilemap: TilemapData, tileSize: number, palette: Record<string, number>) {
    const keys = ensureTileTextures(this.scene, palette, tileSize)
    const container = this.scene.add.container(0, 0)
    for (let y = 0; y < tilemap.height; y++) {
      for (let x = 0; x < tilemap.width; x++) {
        const t = tilemap.tiles[y * tilemap.width + x]
        const key = keys[t] ?? ''
        const spr = this.scene.add.image((x - tilemap.width / 2) * tileSize + tileSize / 2, (y - tilemap.height / 2) * tileSize + tileSize / 2, key)
        spr.setOrigin(0.5, 0.5)
        container.add(spr)
      }
    }
    return container
  }
}


