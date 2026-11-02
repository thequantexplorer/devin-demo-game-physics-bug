# Devin demo: Fix a physics bug in a browser game

**What it shows:** Devin plays a canvas platformer in its own browser, records the player falling through a thin platform and jumping to different heights at different frame rates, fixes both with a fixed timestep and swept collision, adds tests for the physics step, and records the fix.

**Needs:** GitHub only

More demos: [devin-advanced-demos](https://github.com/thequantexplorer/devin-advanced-demos)

## Set it up

1. Click **Use this template → Create a new repository**, choose your GitHub account or org as the owner, and keep the name `devin-demo-game-physics-bug`. The links and prompt below assume that name. Use the template rather than a fork: pull requests on a fork go to the original repo by default.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.

You don't need to run anything yourself. Devin starts the game on its own machine.

## Prompt

Start a new Devin session at [app.devin.ai](https://app.devin.ai) and paste this. Replace `<you>` with your GitHub user or org.

```text
Players of the Sky Hop platformer in https://github.com/<you>/devin-demo-game-physics-bug report two bugs: when they drop from the tall tower they fall straight through the thin cloud platform, and their jump height changes with frame rate (huge on slow laptops, too low to reach the flag on 144 Hz screens).

1. Reproduce both before changing any code. Run `npm run sim` and keep its output. Start the game with `npm start`, open it in your browser, and record yourself playing at `?fps=30` and `?fps=144`: walk off the tower onto the cloud, then try to jump up to the flag. Note the "Last jump" and "Falls" numbers under the game.
2. Find the root causes in `src/physics.js` and `src/game.js` and explain them.
3. Fix them properly: run the physics on a fixed timestep that does not depend on the display frame rate (keep the Frame rate menu working), and use swept collision so a fast fall cannot skip a thin platform. Don't make the cloud thicker or slow the fall to hide the bug.
4. Add unit tests for the physics step: a fall at max speed onto a thin platform lands on it, jump height is the same at 30, 60 and 144 fps, and a normal jump still lands. Keep the existing tests passing. `npm test` and `npm run sim` must both pass.
5. Record the game again at `?fps=30` and `?fps=144` showing the drop landing on the cloud and the player reaching the flag.

Open a PR with the root cause, the before and after `npm run sim` output, and what the recordings show. Send me both recordings.
```

## What to expect

- Devin shows the failing `npm run sim` table and a recording of the bug before it changes code.
- The PR adds a fixed-timestep update and a swept (previous-to-current position) landing check, plus new tests for the physics step.
- After the fix, `npm run sim` prints `OK` and Devin's recording shows "Level complete!" at 30 and 144 fps.
