import { useEffect, useState } from 'react'
import 'phaser'
import { config, Player, TickState, Dot } from 'agar-shared'
import { Socket } from 'socket.io-client'

export class MainScene extends Phaser.Scene {
  public serverTickState?: TickState

  // Separate from serverTickState because it is interpolated and used for client side prediction
  // for smoother looking graphics
  private clientTickState?: TickState

  public plrId?: string
  public setDirection?: (dirRadians?: number) => void
  public lastDirection?: number

  private readonly playerIdToCircle = new Map<string, Phaser.GameObjects.Arc>()
  private readonly dotIdToCircle = new Map<string, Phaser.GameObjects.Arc>()

  constructor () {
    super('mainScene')
  }

  // TODO: do client side prediction using circular buffer of positions/directions
  update (t: number, dt: number): void {
    // can't do any updates or change rendering if serverTickState doesn't exist
    if (this.serverTickState == null) {
      return
    }

    // TODO: calculate interpolated/smoothing of clientTickState
    this.clientTickState = this.serverTickState
    const { players, dots } = this.clientTickState

    // update each of players' character based on interpolated/smoothed clientTickState
    players.forEach((player, id) => {
      if (!this.playerIdToCircle.has(id)) {
        const circle = this.add.circle(undefined, undefined, 80, 0xff669)
        this.playerIdToCircle.set(id, circle)
      }

      this.playerIdToCircle.get(id)?.setPosition(
        player.pos?.x, player.pos?.y
      )
    })

    this.playerIdToCircle.forEach((circle, id) => {
      if (!players.has(id)) {
        circle.destroy()
      }
    })

    dots.forEach((dot, id) => {
      if (!this.dotIdToCircle.has(id)) {
        const color = new Phaser.Display.Color().random(100)
        const circle = this.add.circle(undefined, undefined, 5, color.color)
        this.dotIdToCircle.set(id, circle)
      }

      this.dotIdToCircle.get(id)?.setPosition(
        dot.pos.x, dot.pos.y
      )
    })

    this.dotIdToCircle.forEach((circle, id) => {
      if (!dots.has(id)) {
        circle.destroy()
      }
    })

    // update player character
    if (this.plrId != null && this.playerIdToCircle.has(this.plrId)) {
      const circle = this.playerIdToCircle.get(this.plrId)
      if (circle != null) {
        this.cameras.main.startFollow(circle)

        // TODO: make this work on mobile view
        // update mouse direction depending on pointer position compared to player character
        if (this.setDirection != null) {
          // use camera to get worldPoint because the pointer.worldX and pointer.worldY does not get updated
          // https://github.com/photonstorm/phaser/issues/4658
          const pointerWorld = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y)
          const distanceBetweenCircleAndPointer = Phaser.Math.Distance.Between(
            circle.x,
            circle.y,
            pointerWorld.x,
            pointerWorld.y
          )

          // default angle is undefined and only set it if pointer is outside of the buffer
          const angle = distanceBetweenCircleAndPointer > config.character.hoverBufferRadius
            ? Phaser.Math.Angle.Between(
              circle.x,
              circle.y,
              pointerWorld.x,
              pointerWorld.y
            )
            : undefined

          if (this.lastDirection !== angle) {
            this.lastDirection = angle
            this.setDirection(angle)
          }
        }
      }
    }
  }

  preload (): void {
  }

  create (): void {
    this.physics.world.setBounds(0, 0, config.map.width, config.map.height)

    const grid = this.add.grid(
      config.map.height / 2,
      config.map.width / 2,
      config.map.height,
      config.map.width,
      // TODO: should resize this grid depending on how far camera is zoomed in
      100,
      100)
    grid.setFillStyle(0xFFFFFF)
    grid.setOutlineStyle(0x111111)
  }
}

export const createGame = (parentId: string): Phaser.Game => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    scene: MainScene,
    parent: parentId,
    scale: {
      mode: Phaser.Scale.RESIZE
    },
    physics: {
      default: 'arcade'
    }
  })
}

export enum GameStatus {
  InGame = 'InGame',
  Lobby = 'Lobby'
}

export const useGame = (socket?: Socket, setDirection?: (dirRadians?: number) => void): GameStatus => {
  const [gameStatus, setGameStatus] = useState(GameStatus.Lobby)
  const [game, setGame] = useState<Phaser.Game | undefined>()
  useEffect(() => {
    const newGame = createGame('mainSceneParent')
    setGame(newGame)
    return () => {
      newGame.destroy(true)
    }
  }, [])

  useEffect(() => {
    if (socket == null || game == null) {
      return
    }

    const onNewTickState = (newTickState: TickState): void => {
      // TODO: only stream differences
      const players = new Map<string, Player>(Object.entries(newTickState.players))
      const dots = new Map<string, Dot>(Object.entries(newTickState.dots))
      if (game != null) {
        const mainScene = game.scene.getScene('mainScene') as MainScene
        mainScene.serverTickState = { ...newTickState, players, dots }
      }

      if (players.has(socket.id)) {
        setGameStatus(GameStatus.InGame)
      } else {
        setGameStatus(GameStatus.Lobby)
      }
    }
    socket.on('newTickState', onNewTickState)
    return () => {
      socket.off('newTickState', onNewTickState)
    }
  }, [socket, game])

  useEffect(() => {
    if (socket == null || game == null) {
      return
    }

    const onConnect = (): void => {
      if (game != null) {
        const mainScene = game.scene.getScene('mainScene') as MainScene
        mainScene.plrId = socket.id
      }
    }

    socket.on('connect', onConnect)

    return () => {
      socket.off('connect', onConnect)
    }
  }, [socket, game])

  useEffect(() => {
    if (game != null && setDirection != null && gameStatus === GameStatus.InGame) {
      const mainScene = game.scene.getScene('mainScene') as MainScene
      mainScene.setDirection = setDirection

      return () => {
        mainScene.setDirection = undefined
      }
    }
  }, [game, gameStatus, setDirection])

  return gameStatus
}
