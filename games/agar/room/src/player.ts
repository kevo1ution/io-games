import { getRandomOpenPosition } from './map'
import { Player } from 'agar-shared'

export function createPlayer (id: string, name: string): Player {
  const playerPos = getRandomOpenPosition()
  return {
    id,
    pos: playerPos,
    nickname: name
  }
}
