import { config, Dot } from 'agar-shared'
import { v4 as uuidv4 } from 'uuid'

export const getRandomOpenPosition = (): { x: number, y: number } => {
  return {
    x: Math.random() * config.map.width,
    y: Math.random() * config.map.height
  }
}

const getRandomDot = (): Dot => {
  return {
    id: uuidv4(),
    pos: getRandomOpenPosition(),
    score: config.map.defaultDotScore
  }
}

export const startSpawningDots = (dots: Map<string, Dot>): void => {
  try {
    if (dots.size < config.map.maxDots) {
      for (let i = 0; i < config.map.dotsPerInterval; i++) {
        const dot = getRandomDot()
        dots.set(dot.id, dot)
      }
    }
  } catch (error) {
    console.error('unexpected error in spawn dots loop!', error)
  }
  setTimeout(() => { startSpawningDots(dots) }, config.map.dotIntervalMs)
}
