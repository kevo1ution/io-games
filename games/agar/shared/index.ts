export interface Player {
  id: string
  pos: { x: number, y: number } | undefined
  nickname: string
  direction?: number // when undefined, it means that player is not moving
}

export interface TickState {
  players: Map<string, Player>
}

export const config = {
  map: {
    // coordinate system:
    // top left corner is (0,0) and bottom right corner is (0, height)
    // WARNING: note that going downwards is moving in the positive Y direction.
    // - we do this to be consistent with phaser coordinate space.
    width: 14000,
    height: 14000,
    // allow players to view void space outside of the grid
    outOfBoundsPadding: 1000,
  },
  character: {
    initialMeterPerSecond: 100,
    initialScore: 10,
    scoreToSize: 0.1,
    // Radius of circle where if pointer is hovering, will set the direction
    // to undefined (player no longer moving). Unit is in world space.
    hoverBufferRadius: 30,
  },
  view: {
    width: 20,
    height: 20,
  },
  server: {
    tickTimeoutMs: 50 // 1000/50 = 20 ticks per second
  }
}

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
