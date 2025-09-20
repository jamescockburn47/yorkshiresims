import { createNoise2D } from 'simplex-noise'

const noise2D = createNoise2D()

export function fbm2(x: number, y: number, octaves = 4, lacunarity = 2, gain = 0.5) {
  let amp = 1
  let freq = 1
  let sum = 0
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise2D(x * freq, y * freq)
    norm += amp
    amp *= gain
    freq *= lacunarity
  }
  return sum / norm
}



