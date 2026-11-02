// Player physics for Sky Hop. Units are pixels and seconds.

export const PLAYER_W = 16;
export const PLAYER_H = 16;

export const RUN_SPEED = 220;  // px/s
export const JUMP_SPEED = 700; // px/s, upward
export const GRAVITY = 33;     // added to vy on every update
export const MAX_FALL = 1800;  // px/s

export function createPlayer(spawn) {
  return {
    x: spawn.x,
    y: spawn.y,
    vx: 0,
    vy: 0,
    onGround: false,
  };
}

// Advance the player by dt seconds.
// input: { left, right, jump } where jump is true on the frame the key goes down.
export function step(player, input, dt, platforms) {
  player.vx = (input.right ? RUN_SPEED : 0) - (input.left ? RUN_SPEED : 0);

  if (input.jump && player.onGround) {
    player.vy = -JUMP_SPEED;
    player.onGround = false;
  }

  player.vy = Math.min(player.vy + GRAVITY, MAX_FALL);

  player.x += player.vx * dt;
  player.y += player.vy * dt;

  player.onGround = false;
  for (const p of platforms) {
    if (player.vy >= 0 && overlaps(player, p)) {
      player.y = p.y - PLAYER_H;
      player.vy = 0;
      player.onGround = true;
    }
  }

  return player;
}

export function overlaps(player, rect) {
  return (
    player.x < rect.x + rect.w &&
    player.x + PLAYER_W > rect.x &&
    player.y < rect.y + rect.h &&
    player.y + PLAYER_H > rect.y
  );
}
