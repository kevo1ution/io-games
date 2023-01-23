import { useEffect, useState } from 'react'
import 'phaser'
import { config, Player, TickState } from 'agar-shared'
import { Socket } from 'socket.io-client'

export class MainScene extends Phaser.Scene {
  public serverTickState: TickState = {
    players: new Map<string, Player>()
  }

  // Separate from serverTickState because it is interpolated and used for client side prediction
  // for smoother looking graphics
  private clientTickState: TickState = {
    players: new Map<string, Player>()
  }

  public plrId?: string

  private readonly playerIdToCircle = new Map<string, Phaser.GameObjects.Arc>()

  constructor () {
    super('mainScene')
  }

  // TODO: do client side prediction using circular buffer of positions/directions
  update (t: number, dt: number): void {
    // TODO: calculate interpolated/smoothing of clientTickState
    this.clientTickState = this.serverTickState

    const { players } = this.clientTickState

    // reposition circles of all players
    players.forEach((player, id) => {
      if (!this.playerIdToCircle.has(id)) {
        const circle = this.add.circle(200, 400, 80, 0xff669)
        this.playerIdToCircle.set(id, circle)
      }

      this.playerIdToCircle.get(id)?.setPosition(
        player.pos?.x, player.pos?.y
      )
    })

    if (this.plrId != null && this.playerIdToCircle.has(this.plrId)) {
      const circle = this.playerIdToCircle.get(this.plrId)
      if (circle != null) {
        this.cameras.main.startFollow(circle)
      }
    }
  }

  preload (): void {
  }

  create (): void {
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
    }
  })
}

export enum GameStatus {
  InGame = 'InGame',
  Lobby = 'Lobby'
}

export const useGame = (socket?: Socket): GameStatus => {
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
      const players = new Map<string, Player>(Object.entries(newTickState.players))
      if (game != null) {
        const mainScene = game.scene.getScene('mainScene') as MainScene
        mainScene.serverTickState = { ...newTickState, players }
      }

      if (players.has(socket.id)) {
        setGameStatus(GameStatus.InGame)
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

  return gameStatus
}
