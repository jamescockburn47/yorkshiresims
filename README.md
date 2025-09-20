# Yorkshire Sims: Moors (Prototype)

A cozy top-down village builder set on the Yorkshire Moors. Voxel-inspired muted realism, seasons, WASD + zoom camera, and early build mode for stone cottages and dry-stone walls.

## Features (prototype)
- Intro screen with Yorkshire image carousel and Start
- Procedural Moors biome tilemap (heather/grass/rock/water/path)
- Seasons with 5-minute in-game days; terrain palette updates by season
- WASD pan, mouse wheel zoom
- Build mode: place Stone Cottage and Dry-stone Wall on valid tiles
- Right-side status panel: Season, Day, day progress bar

## Tech
- React + TypeScript + Vite
- Phaser 3 renderer

## Getting Started

```bash
# From repo root
cd yorkshire-sims
npm install
npm run dev
# Open the printed Local URL, typically http://localhost:5173/
```

## Build
```bash
npm run build
npm run preview
```

## Controls
- WASD: pan camera
- Mouse Wheel: zoom
- Build panel: select a structure, click to place (not on water/rock)

## Roadmap (short-term)
- NPC naming and villagers panel
- Resources/economy and seasonal price modifiers
- Events/festivals scaffolding
- Ambient folk music and moor SFX

## License
TBD
