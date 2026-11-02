// Plays Sky Hop headlessly at fixed display frame rates and checks the results.
// Usage: npm run sim
import { createGame, frame } from '../src/game.js';
import { level } from '../src/level.js';
import { PLAYER_H } from '../src/physics.js';

const RATES = [30, 60, 144];
const idle = { left: false, right: false, jump: false };

function settle(game, fps) {
  for (let i = 0; i < fps; i++) frame(game, idle, 1 / fps);
}

function jumpHeight(fps) {
  const game = createGame(level);
  settle(game, fps);
  frame(game, { ...idle, jump: true }, 1 / fps);
  for (let i = 0; i < fps * 3 && game.lastJumpHeight === null; i++) frame(game, idle, 1 / fps);
  return game.lastJumpHeight;
}

function towerDrop(fps) {
  const game = createGame(level);
  settle(game, fps);
  const cloud = level.platforms.find((p) => p.kind === 'cloud');
  for (let i = 0; i < fps * 4; i++) {
    frame(game, { ...idle, right: game.player.x < 300 }, 1 / fps);
    if (game.falls > 0) return 'fell through';
    const p = game.player;
    if (p.onGround && p.y + PLAYER_H === cloud.y) return 'landed';
  }
  return 'did not land';
}

function reachFlag(fps) {
  const game = createGame(level);
  settle(game, fps);
  let jumped = false;
  for (let i = 0; i < fps * 8; i++) {
    const p = game.player;
    const jump = !jumped && p.onGround && p.x >= 680 && p.x < 700;
    if (jump) jumped = true;
    frame(game, { left: false, right: true, jump }, 1 / fps);
    if (game.won) return 'yes';
    if (game.falls > 0) return 'no';
  }
  return 'no';
}

const rows = RATES.map((fps) => ({ fps, jump: jumpHeight(fps), drop: towerDrop(fps), flag: reachFlag(fps) }));

const pad = (v, n) => String(v).padEnd(n);
console.log(`${pad('fps', 6)}${pad('jump height (px)', 18)}${pad('tower drop onto cloud', 23)}reaches flag`);
for (const r of rows) console.log(`${pad(r.fps, 6)}${pad(r.jump, 18)}${pad(r.drop, 23)}${r.flag}`);

const heights = rows.map((r) => r.jump);
const spread = Math.max(...heights) - Math.min(...heights);
const problems = [];
if (spread > 3) problems.push(`jump height changes with frame rate (spread ${spread} px)`);
for (const r of rows) if (r.drop !== 'landed') problems.push(`${r.fps} fps: player ${r.drop} the cloud`);
for (const r of rows) if (r.flag !== 'yes') problems.push(`${r.fps} fps: the flag cannot be reached`);

if (problems.length) {
  console.log('\nFAIL');
  for (const p of problems) console.log(`- ${p}`);
  process.exit(1);
}
console.log('\nOK: same jump at every frame rate, and the level can be finished.');
