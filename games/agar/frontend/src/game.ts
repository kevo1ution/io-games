import 'phaser'

class MainScene extends Phaser.Scene {
  constructor () {
    super('demo')
  }

  preload (): void {
  }

  create (): void {

  }
}

export default (parentId: string): Phaser.Game => {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    scene: MainScene,
    parent: parentId
  })
  return game
}
