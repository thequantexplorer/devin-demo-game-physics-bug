import { createPlayer, step, overlaps } from './physics.js';

export function createGame(level) {
  return {
    level,
    player: createPlayer(level.spawn),
    falls: 0,
    won: false,
    jumpStartY: null,
    peakY: null,
    lastJumpHeight: null,
  };
}

export function respawn(game) {
  game.player = createPlayer(game.level.spawn);
  game.jumpStartY = null;
  game.peakY = null;
}

// Called once per rendered frame with the time since the last frame.
export function frame(game, input, frameDt) {
  if (game.won) return game;
  const p = game.player;
  const wasOnGround = p.onGround;
  const prevY = p.y;

  step(p, input, frameDt, game.level.platforms);

  if (wasOnGround && !p.onGround && p.vy < 0) {
    game.jumpStartY = prevY;
    game.peakY = p.y;
  }
  if (game.jumpStartY !== null) {
    game.peakY = Math.min(game.peakY, p.y);
    if (p.onGround) {
      game.lastJumpHeight = Math.round(game.jumpStartY - game.peakY);
      game.jumpStartY = null;
    }
  }

  if (overlaps(p, game.level.flag)) game.won = true;

  if (p.y > game.level.killY) {
    game.falls += 1;
    respawn(game);
  }
  return game;
}
