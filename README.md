# Sky Hop

A small platformer drawn on an HTML canvas. No dependencies: plain JavaScript modules and Node 18 or newer.

```sh
npm start      # http://localhost:3400 (binds 0.0.0.0)
npm test       # unit tests (node --test)
npm run sim    # plays the level headlessly at 30, 60 and 144 fps
```

Controls: ← → or A D to move, Space, ↑ or W to jump, R to restart. The **Frame rate** menu under the game (or `?fps=30`, `?fps=60`, `?fps=144` in the URL) makes the game run as it would on a slow laptop or a 144 Hz monitor. **Auto** uses your display's real frame rate.

The level: drop from the tall tower onto the thin cloud, then jump up to the flag on the green ledge.

| File | What it does |
| --- | --- |
| `src/physics.js` | `step()`: moves the player and resolves collisions |
| `src/game.js` | `frame()`: called once per rendered frame; tracks jumps, falls and the win |
| `src/level.js` | the level layout |
| `src/main.js` | canvas drawing, keyboard input and the frame loop |
| `scripts/sim.js` | headless check behind `npm run sim` |

## Known bugs

Players report two problems:

- When they drop from the tower they often fall straight through the cloud. On slow machines it happens every time.
- Jump height depends on the frame rate. On slow laptops the jump is huge; on 144 Hz screens it is too low to reach the flag.

`npm run sim` shows both:

```
fps   jump height (px)  tower drop onto cloud  reaches flag
30    236               fell through           no
60    118               fell through           no
144   49                landed                 no

FAIL
- jump height changes with frame rate (spread 187 px)
- 30 fps: player fell through the cloud
- 60 fps: player fell through the cloud
- 30 fps: the flag cannot be reached
- 60 fps: the flag cannot be reached
- 144 fps: the flag cannot be reached
```

---

This repo is a starter for a Devin demo. See [DEVIN_DEMO.md](DEVIN_DEMO.md) for setup and the prompt.
