import Phaser from 'phaser'

function createVoxelSprite(scene: Phaser.Scene, key: string, w: number, h: number, color: number) {
  const g = scene.add.graphics()
  g.setVisible(false)
  g.fillStyle(color, 1)
  g.fillRect(0, 0, w, h)
  // Fake iso/voxel shading
  const light = Phaser.Display.Color.IntegerToColor(color).clone().brighten(15).color
  const dark = Phaser.Display.Color.IntegerToColor(color).clone().darken(20).color
  g.fillStyle(light, 0.25)
  g.fillRect(0, 0, w, Math.max(2, Math.floor(h * 0.1)))
  g.fillRect(0, 0, Math.max(2, Math.floor(w * 0.1)), h)
  g.fillStyle(dark, 0.25)
  g.fillRect(0, h - Math.max(2, Math.floor(h * 0.1)), w, Math.max(2, Math.floor(h * 0.1)))
  g.fillRect(w - Math.max(2, Math.floor(w * 0.1)), 0, Math.max(2, Math.floor(w * 0.1)), h)
  g.generateTexture(key, w, h)
  g.destroy()
}

export function ensureBuildSprites(scene: Phaser.Scene, tileSize: number) {
  const mgr = scene.textures
  const cottageKey = 'spr-cottage'
  const wallKey = 'spr-wall'
  if (!mgr.exists(cottageKey)) createVoxelSprite(scene, cottageKey, tileSize, tileSize, 0xb9a27d)
  if (!mgr.exists(wallKey)) createVoxelSprite(scene, wallKey, tileSize, tileSize, 0x8a8a8a)
  return { cottageKey, wallKey }
}



