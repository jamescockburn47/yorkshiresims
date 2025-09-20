import Phaser from 'phaser'
import { GameScene } from './GameScene'

export function createGame(parent: HTMLDivElement) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: parent.clientWidth,
    height: parent.clientHeight,
    parent,
    backgroundColor: '#0e1510',
    scene: [GameScene],
    physics: { default: 'arcade' },
  }
  return new Phaser.Game(config)
}



