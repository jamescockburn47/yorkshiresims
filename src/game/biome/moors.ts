import { fbm2 } from './noise'
import type { Season } from '../events'

export type TileType = 'heather' | 'grass' | 'rock' | 'water' | 'path'

export interface BiomeConfig {
  seedX?: number
  seedY?: number
  sizeTiles: number
  tileSizePx: number
}

export interface TilemapData {
  width: number
  height: number
  tiles: TileType[]
}

export function generateMoors(config: BiomeConfig): TilemapData {
  const { sizeTiles } = config
  const tiles: TileType[] = new Array(sizeTiles * sizeTiles)
  const scale = 0.005
  for (let y = 0; y < sizeTiles; y++) {
    for (let x = 0; x < sizeTiles; x++) {
      const nx = x * scale
      const ny = y * scale
      const height = fbm2(nx, ny, 5, 2.0, 0.5) // -1..1
      const moisture = fbm2(nx + 100, ny - 50, 3, 2.0, 0.6)
      const v = (height + 1) * 0.5 // 0..1
      const m = (moisture + 1) * 0.5

      let t: TileType
      if (v < 0.35 && m > 0.55) t = 'water'
      else if (v > 0.75) t = 'rock'
      else if (m > 0.6) t = 'heather'
      else t = 'grass'

      // occasional paths
      const pathNoise = fbm2(nx * 3 + 200, ny * 3 + 200, 2, 2, 0.5)
      if (Math.abs(pathNoise) < 0.02 && t !== 'water' && t !== 'rock') t = 'path'

      tiles[y * sizeTiles + x] = t
    }
  }
  return { width: sizeTiles, height: sizeTiles, tiles }
}

export function getMoorsPalette(season: Season) {
  switch (season) {
    case 'Spring':
      return { heather: 0x8b6a8f, grass: 0x4c6b3f, rock: 0x6d6d6d, water: 0x2a4b6f, path: 0x8a7a5a }
    case 'Summer':
      return { heather: 0x9a759f, grass: 0x5b7f4b, rock: 0x757575, water: 0x2f5b80, path: 0x9b8a66 }
    case 'Autumn':
      return { heather: 0x7e5d83, grass: 0x6b7142, rock: 0x6c6c6c, water: 0x2a4b6f, path: 0x8e7a5a }
    case 'Winter':
      return { heather: 0x6d5c72, grass: 0x3b4d36, rock: 0x8a8a8a, water: 0x335d7f, path: 0x7d6c55 }
  }
}



