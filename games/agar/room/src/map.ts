import { config } from 'agar-shared'

export const getRandomOpenPosition = (): { x: number, y: number } => {
  return {
    x: config.map.width, //  0, // Math.random() * config.map.width,
    y: config.map.height // 0 // Math.random() * config.map.height
  }
}
