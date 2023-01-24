import { getRandomOpenPosition } from './map'
import { config, Player, clamp } from 'agar-shared'

export function createPlayer (id: string, name: string): Player {
  const playerPos = getRandomOpenPosition()
  return {
    id,
    pos: playerPos,
    nickname: name,
    score: config.character.initialScore
  }
}

export function updatePlayerPositionOnTick (player: Player, dTimeMs: number): void {
  const dTimeSecs = (dTimeMs / 1000)
  // TODO: adjust speed based on size of player
  const dDist = dTimeSecs * config.character.initialMeterPerSecond
  const angleRads = player.direction

  // do not change position of player when no direction is set
  if (angleRads == null || player.pos == null) {
    return
  }
  const dx = Math.cos(angleRads) * dDist
  const dy = Math.sin(angleRads) * dDist
  player.pos.x = clamp(player.pos.x + dx, 0, config.map.width)
  player.pos.y = clamp(player.pos.y + dy, 0, config.map.height)
}

export function updatePlayerScoreDecayOnTick (player: Player, dTimeMs: number): void {
  const dTimeSecs = (dTimeMs / 1000)
  const decayAmnt = player.score * dTimeSecs * config.character.baseDecayPerSecond
  player.score = Math.max(player.score + decayAmnt, config.character.initialScore)
}
