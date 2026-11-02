import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayer, step, RUN_SPEED, PLAYER_H } from '../src/physics.js';
import { createGame, frame } from '../src/game.js';
import { level } from '../src/level.js';

const idle = { left: false, right: false, jump: false };
const ground = [{ x: 0, y: 100, w: 400, h: 40 }];

test('runs right at RUN_SPEED', () => {
  const p = createPlayer({ x: 50, y: 100 - PLAYER_H });
  step(p, { ...idle, right: true }, 0.5, ground);
  assert.equal(p.x, 50 + RUN_SPEED * 0.5);
});

test('stands still on solid ground', () => {
  const p = createPlayer({ x: 50, y: 100 - PLAYER_H });
  for (let i = 0; i < 120; i++) step(p, idle, 1 / 60, ground);
  assert.equal(p.y, 100 - PLAYER_H);
  assert.equal(p.onGround, true);
});

test('jumps only from the ground', () => {
  const p = createPlayer({ x: 50, y: 0 });
  step(p, { ...idle, jump: true }, 1 / 60, ground);
  assert.ok(p.vy > 0, 'no jump in mid-air');
});

test('falling out of the level respawns the player', () => {
  const game = createGame(level);
  game.player.x = 230;
  game.player.y = level.killY + 1;
  frame(game, idle, 0.1);
  assert.equal(game.falls, 1);
  assert.deepEqual([game.player.x, game.player.y], [level.spawn.x, level.spawn.y]);
});

test('touching the flag wins the level', () => {
  const game = createGame(level);
  game.player.x = level.flag.x;
  game.player.y = level.flag.y + 10;
  frame(game, idle, 0.1);
  assert.equal(game.won, true);
});
