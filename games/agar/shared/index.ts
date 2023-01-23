export interface Player {
  id: string
  pos: { x: number, y: number } | undefined
  nickname: string
}

export interface TickState {
  players: Map<string, Player>
}

export const config = {
  map: {
    // coordinate system:
    // bottom left corner is (0,0) and top right corner is (width, height)
    width: 14000,
    height: 14000,
  },
  character: {
    initialMeterPerSecond: 1,
    initialScore: 10,
    scoreToSize: 0.1
  },
  view: {
    width: 20,
    height: 20,
  },
  server: {
    tickTimeoutMs: 50 // 1000/50 = 20 ticks per second
  }
}
