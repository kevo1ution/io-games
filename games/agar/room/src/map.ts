import { config } from 'agar-shared'

export const getRandomOpenPosition = (): { x: number, y: number } => {
  return {
    x: Math.random() * config.map.width,
    y: Math.random() * config.map.height
  }
}
