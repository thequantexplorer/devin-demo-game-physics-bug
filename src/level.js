import { PLAYER_H } from './physics.js';

export const WIDTH = 960;
export const HEIGHT = 540;

// All platforms are one-way: you can jump up through them and land on top.
export const level = {
  spawn: { x: 100, y: 38 - PLAYER_H },
  platforms: [
    { x: 40, y: 38, w: 160, h: 502, kind: 'tower' },
    { x: 280, y: 490, w: 420, h: 4, kind: 'cloud' },
    { x: 760, y: 390, w: 160, h: 24, kind: 'ledge' },
  ],
  flag: { x: 880, y: 342, w: 8, h: 48 },
  killY: HEIGHT + 40,
};
