export interface Position {
  x: number, 
  y: number
}

export interface Player {
  id: string
  pos: Position
  nickname: string
  direction?: number // when undefined, it means that player is not moving
  score: number // score of blob - synonymous with the size of the blob
}

export interface Dot {
  id: string
  pos: Position
  score: number
}

export interface TickState {
  serverTimeISO: string,
  players: Map<string, Player>
  dots: Map<string, Dot>
}

export const config = {
  // TODO: set scale factor for camera view, 
  // so camera cannot see more players than allowed

  // TODO: spawn random dots
  map: {
    // coordinate system:
    // top left corner is (0,0) and bottom right corner is (0, height)
    // WARNING: note that going downwards is moving in the positive Y direction.
    // - we do this to be consistent with phaser coordinate space.
    width: 14000,
    height: 14000,
    // allow players to view void space outside of the grid
    outOfBoundsPadding: 1000,
    // spawn 10 dots per second randomly
    dotsPerInterval: 10,
    dotIntervalMs: 1000,
    maxDots: 1000,
    defaultDotScore: 1,
  },
  character: {
    initialMeterPerSecond: 100,
    initialScore: 10,
    // equation for calculating decay based on time passed
    // newScore = initialScore + initialScore * baseDecayPerSecond * t
    baseDecayPerSecond: 0.1,
    scoreToSize: 0.1,
    // Radius of circle where if pointer is hovering, will set the direction
    // to undefined (player no longer moving). Unit is in world space.
    hoverBufferRadius: 30,
  },
  server: {
    // ~ 20 ticks per second
    tickTimeoutMs: 50
  }
}

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
