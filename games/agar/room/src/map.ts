import { config } from 'agar-shared'

export const getRandomOpenPosition = (): { x: number, y: number } => {
  return {
    x: 0, // Math.random() * config.map.width,
    y: 0 // Math.random() * config.map.height
  }
}
