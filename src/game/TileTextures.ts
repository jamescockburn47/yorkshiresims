import Phaser from 'phaser'

export function createTileTexture(scene: Phaser.Scene, key: string, size: number, baseColor: number) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false })
  // Base
  g.fillStyle(baseColor, 1)
  g.fillRect(0, 0, size, size)
  // Subtle top-left light and bottom-right shadow
  const light = Phaser.Display.Color.IntegerToColor(baseColor).clone().brighten(10).color
  const dark = Phaser.Display.Color.IntegerToColor(baseColor).clone().darken(15).color
  g.fillStyle(light, 0.25)
  g.fillRect(0, 0, size, 3)
  g.fillRect(0, 0, 3, size)
  g.fillStyle(dark, 0.25)
  g.fillRect(0, size - 3, size, 3)
  g.fillRect(size - 3, 0, 3, size)
  // Speckle noise
  g.fillStyle(dark, 0.07)
  for (let i = 0; i < size; i += 2) {
    const x = (i * 13) % size
    const y = (i * 29) % size
    g.fillRect(x, y, 1, 1)
  }
  g.generateTexture(key, size, size)
  g.destroy()
}

export function ensureTileTextures(scene: Phaser.Scene, palette: Record<string, number>, size: number) {
  const mgr = scene.textures
  const keys: Record<string, string> = {}
  for (const [name, color] of Object.entries(palette)) {
    const key = `tile-${name}`
    if (mgr.exists(key)) mgr.remove(key)
    createTileTexture(scene, key, size, color)
    keys[name] = key
  }
  return keys
}


