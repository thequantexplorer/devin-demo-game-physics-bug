import { createGame, frame } from './game.js';
import { level, WIDTH, HEIGHT } from './level.js';
import { PLAYER_W, PLAYER_H } from './physics.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const fpsSelect = document.getElementById('fps');
const jumpEl = document.getElementById('jump');
const fallsEl = document.getElementById('falls');

// Frame rate simulator: pretend the display runs at a fixed rate so the game
// behaves like it would on a slow laptop or a 144 Hz monitor.
const params = new URLSearchParams(location.search);
if (['30', '60', '144'].includes(params.get('fps'))) fpsSelect.value = params.get('fps');

let game = createGame(level);
const keys = new Set();
let jumpQueued = false;

addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(e.key)) e.preventDefault();
  const k = e.key.toLowerCase();
  if (!e.repeat && (k === ' ' || k === 'arrowup' || k === 'w')) jumpQueued = true;
  if (k === 'r') restart();
  keys.add(k);
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
document.getElementById('restart').addEventListener('click', restart);
fpsSelect.addEventListener('change', () => { fpsSelect.blur(); restart(); });

function restart() {
  game = createGame(level);
}

function readInput() {
  const input = {
    left: keys.has('arrowleft') || keys.has('a'),
    right: keys.has('arrowright') || keys.has('d'),
    jump: jumpQueued,
  };
  jumpQueued = false;
  return input;
}

let last = performance.now();
let pending = 0;

function tick(now) {
  const realDt = (now - last) / 1000;
  last = now;

  if (fpsSelect.value === 'auto') {
    frame(game, readInput(), Math.min(realDt, 0.1));
    render();
  } else {
    const frameDt = 1 / Number(fpsSelect.value);
    pending = Math.min(pending + realDt, 0.25);
    let ran = false;
    while (pending >= frameDt) {
      pending -= frameDt;
      frame(game, readInput(), frameDt);
      ran = true;
    }
    if (ran) render();
  }
  requestAnimationFrame(tick);
}

function render() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#38bdf8');
  sky.addColorStop(1, '#bae6fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (const p of level.platforms) {
    ctx.fillStyle = p.kind === 'cloud' ? '#ffffff' : p.kind === 'tower' ? '#334155' : '#16a34a';
    ctx.fillRect(p.x, p.y, p.w, p.h);
  }

  const f = level.flag;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(f.x, f.y, 3, f.h);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(f.x + 3, f.y, 22, 14);

  const pl = game.player;
  ctx.fillStyle = '#f97316';
  ctx.fillRect(Math.round(pl.x), Math.round(pl.y), PLAYER_W, PLAYER_H);

  if (game.won) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Level complete!', WIDTH / 2, HEIGHT / 2);
  }

  jumpEl.textContent = game.lastJumpHeight ?? '–';
  fallsEl.textContent = game.falls;
}

render();
requestAnimationFrame(tick);
