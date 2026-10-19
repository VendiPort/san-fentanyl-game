'use strict';
(() => {
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 960, H = 540, HOR = 270, RC = 480, CW = W / RC, FOV = 0.8, K = W / (2 * FOV);
const TOUCH = /[?&]touch=1/.test(location.search) || (('ontouchstart' in window || navigator.maxTouchPoints > 0) && !/[?&]touch=0/.test(location.search));
// ---------- helpers ----------
const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function seeded(s) { return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function C(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const ci = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
const rc = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
const pg = (g, c, ...p) => { g.fillStyle = c; g.beginPath(); g.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.closePath(); g.fill(); };
const el = (g, x, y, rx, ry, c, rot) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, 7); g.fill(); };
function glow(g, x, y, r, c0, c1) { const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, c0); q.addColorStop(1, c1 || 'rgba(0,0,0,0)'); g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2); }
// ---------- sprites ----------
function mk(w, h, fn, nofog) {
  const c = C(w, h); fn(c.getContext('2d'), w, h); const v = [c];
  for (const a of [.28, .5, .7]) { const d = C(w, h), q = d.getContext('2d'); q.drawImage(c, 0, 0); if (!nofog) { q.globalCompositeOperation = 'source-atop'; q.fillStyle = 'rgba(24,6,44,' + a + ')'; q.fillRect(0, 0, w, h); } v.push(d); }
  const r = C(w, h), q = r.getContext('2d'); q.drawImage(c, 0, 0); q.globalCompositeOperation = 'source-atop'; q.fillStyle = 'rgba(255,40,70,.55)'; q.fillRect(0, 0, w, h); v.push(r);
  return { v, w, h };
}
function person(g, o) {
  const sk = o.skin || '#d9a07a', sh = o.shirt || '#555', pa = o.pants || '#333';
  rc(g, 22, 60, 9, 30, pa); rc(g, 33, 60, 9, 30, pa); rc(g, 20, 88, 12, 7, o.shoe || '#111'); rc(g, 32, 88, 12, 7, o.shoe || '#111');
  rc(g, 19, 30, 26, 32, sh);
  if (o.out) { rc(g, 2, 33, 18, 8, sk); rc(g, 44, 33, 18, 8, sk); rc(g, 2, 43, 18, 8, sk); rc(g, 44, 43, 18, 8, sk); ci(g, 3, 37, 4, sk); ci(g, 61, 47, 4, sk); }
  else if (o.up) { rc(g, 10, 14, 9, 28, sh); rc(g, 45, 14, 9, 28, sh); ci(g, 14, 12, 5, sk); ci(g, 50, 12, 5, sk); }
  else { rc(g, 11, 31, 8, 30, sh); rc(g, 45, 31, 8, 30, sh); ci(g, 15, 62, 4, sk); ci(g, 49, 62, 4, sk); }
  if (o.hair && o.big) { ci(g, 32, 16, 15, o.hair); }
  ci(g, 32, 21, 10, sk);
  if (o.hair) { if (o.big) { ci(g, 32, 12, 13, o.hair); ci(g, 20, 20, 6, o.hair); ci(g, 44, 20, 6, o.hair2 || o.hair); } else { pg(g, o.hair, 21, 20, 22, 9, 42, 9, 43, 20, 40, 14, 24, 14); rc(g, 21, 10, 22, 5, o.hair); } }
  if (o.cap) { rc(g, 21, 8, 22, 7, o.cap); rc(g, 21, 13, 30, 3, o.cap); }
  ci(g, 28, 21, o.eye ? 2.4 : 1.6, o.eye || '#111'); ci(g, 36, 21, o.eye ? 2.4 : 1.6, o.eye || '#111');
  if (o.mouth) rc(g, 28, 27, 8, 2, o.mouth);
  if (o.glasses) { g.strokeStyle = '#0ff'; g.lineWidth = 1.5; g.strokeRect(24, 18, 7, 6); g.strokeRect(33, 18, 7, 6); }
}
const SP = {};
function buildSprites() {
  SP.zom = mk(64, 96, g => { person(g, { skin: '#7fb36a', shirt: '#6a4a3a', pants: '#3a3f4a', out: 1, eye: '#f22', mouth: '#400' }); rc(g, 22, 36, 8, 5, '#9a5'); rc(g, 33, 48, 10, 4, '#2a1a1a'); });
  SP.dog = mk(96, 64, g => { el(g, 46, 36, 28, 13, '#7a5232'); ci(g, 78, 28, 11, '#8a6040'); pg(g, '#5a3a22', 74, 20, 80, 8, 86, 20); pg(g, '#fff', 84, 34, 90, 32, 88, 39); rc(g, 26, 44, 5, 16, '#6a4528'); rc(g, 38, 46, 5, 14, '#6a4528'); rc(g, 58, 44, 5, 16, '#6a4528'); rc(g, 66, 44, 5, 14, '#6a4528'); ci(g, 81, 26, 2, '#f22'); pg(g, '#6a4528', 20, 32, 8, 22, 22, 28); });
  SP.scz = mk(96, 96, g => { rc(g, 20, 80, 62, 5, '#0ff'); ci(g, 24, 86, 8, '#111'); ci(g, 78, 86, 8, '#111'); ci(g, 24, 86, 3, '#f0f'); ci(g, 78, 86, 3, '#f0f'); rc(g, 70, 30, 4, 52, '#999'); rc(g, 62, 30, 20, 4, '#999'); g.save(); g.translate(8, 0); g.scale(.8, .8); g.translate(10, 14); person(g, { skin: '#7fb36a', shirt: '#a23', pants: '#223', out: 0, eye: '#f22', mouth: '#400' }); g.restore(); });
  SP.tech = mk(64, 96, g => person(g, { skin: '#f0cfae', shirt: '#7d8aa0', pants: '#2b3445', up: 1, hair: '#5a3b20', glasses: 1, shoe: '#eee', mouth: '#a33' }));
  SP.vend = mk(64, 96, g => { person(g, { skin: '#c68a5e', shirt: '#e8742a', pants: '#2a2a40', cap: '#f2c', mouth: '#222' }); rc(g, 26, 32, 12, 30, '#fff3'); rc(g, 27, 25, 10, 2, '#321'); });
  SP.store = mk(64, 96, g => { person(g, { skin: '#d0996d', shirt: '#2a9d6a', pants: '#333', cap: '#fc0', mouth: '#222' }); rc(g, 48, 40, 14, 5, '#3c3'); rc(g, 58, 40, 5, 22, '#3c3'); rc(g, 60, 58, 3, 4, '#aaa'); });
  const ngo = (hc, hc2) => mk(64, 96, g => { person(g, { skin: '#f1d4c0', shirt: '#e8e8f4', pants: '#4a3c70', hair: hc, hair2: hc2, big: 1, mouth: '#a44' }); rc(g, 29, 31, 6, 18, '#ff3d9a'); rc(g, 8, 50, 14, 16, '#6af'); });
  SP.ngo0 = ngo('#1aa7ff'); SP.ngo1 = ngo('#6a9ec0', '#4aa0e0'); SP.ngo2 = ngo('#bdbdc8');
  SP.under = mk(96, 128, g => { g.save(); g.scale(1.5, 1.33); person(g, { skin: '#f1d4c0', shirt: '#6a2fbf', pants: '#2c1a55', hair: '#1aa7ff', big: 1, eye: '#f0f', mouth: '#a44' }); g.restore(); rc(g, 44, 42, 8, 30, '#ff3d9a'); });
  SP.boss = mk(128, 160, g => { g.save(); g.scale(2, 1.66); person(g, { skin: '#e8c8e8', shirt: '#3a1a7a', pants: '#1a1040', hair: '#1aa7ff', hair2: '#b020ff', big: 1, eye: '#f0f', mouth: '#f0f' }); g.restore(); ci(g, 64, 12, 22, '#b020ff'); ci(g, 46, 22, 14, '#1aa7ff'); ci(g, 84, 22, 14, '#b020ff'); ci(g, 64, 40, 18, '#f5dff5'); ci(g, 57, 40, 4, '#f0f'); ci(g, 71, 40, 4, '#f0f'); glow(g, 64, 80, 60, 'rgba(176,32,255,.35)'); });
  SP.mayor = mk(64, 96, g => { person(g, { skin: '#f0c8a8', shirt: '#2d3f7a', pants: '#242a44', up: 1, hair: '#bbb', mouth: '#a33' }); rc(g, 19, 36, 26, 4, '#c22'); ci(g, 20, 14, 2, '#6cf'); ci(g, 46, 10, 2, '#6cf'); rc(g, 30, 33, 4, 14, '#fff'); });
  SP.junkie = mk(64, 96, g => { g.save(); g.translate(0, 8); person(g, { skin: '#b5b09a', shirt: '#3a3a52', pants: '#252535', hair: '#222', eye: '#f55', mouth: '#222' }); g.restore(); rc(g, 20, 34, 24, 8, '#4a4a66'); });
  SP.car = mk(128, 80, g => { rc(g, 6, 36, 116, 28, '#c01c78'); pg(g, '#c01c78', 28, 36, 44, 12, 88, 12, 106, 36); pg(g, '#27d', 40, 34, 50, 17, 66, 17, 66, 34); pg(g, '#27d', 70, 34, 70, 17, 86, 17, 98, 34); ci(g, 30, 66, 11, '#111'); ci(g, 98, 66, 11, '#111'); ci(g, 30, 66, 4, '#0ff'); ci(g, 98, 66, 4, '#0ff'); rc(g, 8, 70, 112, 3, '#0ffa'); rc(g, 112, 42, 8, 5, '#ff0'); });
  SP.car2 = mk(128, 80, g => { rc(g, 6, 40, 116, 24, '#701048'); pg(g, '#701048', 28, 40, 44, 18, 88, 18, 106, 40); ci(g, 30, 66, 11, '#111'); ci(g, 98, 66, 11, '#111'); g.strokeStyle = '#8ef'; g.lineWidth = 2; g.beginPath(); g.moveTo(44, 22); g.lineTo(52, 36); g.moveTo(80, 20); g.lineTo(70, 38); g.stroke(); ci(g, 64, 12, 5, '#f22'); });
  SP.stall = mk(96, 80, g => { rc(g, 8, 36, 80, 40, '#4a2c1c'); for (let i = 0; i < 8; i++) rc(g, 8 + i * 10, 8, 10, 26, i % 2 ? '#ff2bd6' : '#18e0ff'); rc(g, 12, 26, 72, 10, '#2a1a30'); ci(g, 24, 44, 6, '#fc0'); ci(g, 44, 44, 6, '#6f6'); rc(g, 58, 38, 18, 10, '#ccc'); rc(g, 8, 72, 80, 3, '#0ffa'); });
  SP.tent = mk(96, 80, g => { pg(g, '#2f4a6a', 6, 76, 48, 6, 90, 76); pg(g, '#18232f', 38, 76, 48, 36, 58, 76); rc(g, 30, 74, 36, 3, '#f0f8'); glow(g, 48, 60, 30, 'rgba(255,0,200,.3)'); ci(g, 46, 66, 2, '#f22'); ci(g, 50, 66, 2, '#f22'); });
  SP.poop = mk(48, 40, g => { el(g, 24, 33, 18, 6, '#4a2a12'); el(g, 24, 25, 13, 6, '#5a3416'); el(g, 24, 18, 8, 5, '#6a4020'); ci(g, 24, 11, 4, '#6a4020'); ci(g, 20, 24, 2, '#fff'); ci(g, 28, 24, 2, '#fff'); ci(g, 20, 24, 1, '#000'); ci(g, 28, 24, 1, '#000'); ci(g, 38, 6, 1.5, '#222'); ci(g, 12, 8, 1.5, '#222'); });
  SP.poopf = mk(48, 56, g => { glow(g, 24, 28, 24, 'rgba(255,160,0,.7)'); pg(g, '#ff7a00', 12, 38, 24, 2, 36, 38); pg(g, '#ffe000', 18, 38, 24, 14, 30, 38); el(g, 24, 46, 17, 6, '#4a2a12'); el(g, 24, 41, 11, 5, '#5a3416'); }, 1);
  SP.cable = mk(192, 112, g => { rc(g, 8, 30, 176, 62, '#e6b800'); rc(g, 8, 30, 176, 10, '#c01c78'); for (let i = 0; i < 5; i++) { rc(g, 18 + i * 34, 44, 24, 24, '#27d'); rc(g, 18 + i * 34, 44, 24, 3, '#fff6'); } rc(g, 8, 78, 176, 14, '#8a1030'); ci(g, 40, 96, 11, '#111'); ci(g, 152, 96, 11, '#111'); rc(g, 94, 4, 4, 28, '#555'); rc(g, 60, 2, 72, 3, '#888'); rc(g, 8, 94, 176, 3, '#0ffa'); });
  SP.needle = mk(24, 24, g => { g.strokeStyle = '#0ff'; g.lineWidth = 2; g.beginPath(); g.moveTo(3, 21); g.lineTo(15, 9); g.stroke(); rc(g, 14, 4, 8, 6, '#f2f'); ci(g, 4, 20, 2, '#fff'); }, 1);
  SP.ballot = mk(32, 32, g => { rc(g, 4, 3, 24, 26, '#f4f4ff'); rc(g, 8, 8, 6, 6, '#1a7fff'); rc(g, 8, 18, 6, 6, '#1a7fff'); rc(g, 17, 10, 8, 2, '#889'); rc(g, 17, 20, 8, 2, '#889'); g.strokeStyle = '#d22'; g.beginPath(); g.moveTo(8, 8); g.lineTo(14, 14); g.moveTo(14, 8); g.lineTo(8, 14); g.stroke(); }, 1);
  SP.cig = mk(32, 16, g => { rc(g, 2, 6, 22, 5, '#f4f4f4'); rc(g, 20, 6, 4, 5, '#d83'); rc(g, 24, 6, 6, 5, '#f60'); glow(g, 28, 8, 8, 'rgba(255,100,0,.8)'); }, 1);
  SP.bag = mk(32, 40, g => { glow(g, 16, 18, 18, 'rgba(255,120,0,.7)'); ci(g, 16, 28, 11, '#111'); pg(g, '#111', 10, 20, 16, 8, 22, 20); pg(g, '#ff7a00', 8, 22, 16, 2, 24, 22); pg(g, '#ffe000', 12, 22, 16, 10, 20, 22); }, 1);
  SP.orb = mk(48, 48, g => { glow(g, 24, 24, 24, 'rgba(255,255,255,1)', 'rgba(176,32,255,0)'); glow(g, 24, 24, 16, 'rgba(240,120,255,1)', 'rgba(176,32,255,0)'); }, 1);
  SP.ngren = mk(32, 32, g => { ci(g, 16, 18, 9, '#18c8c8'); rc(g, 13, 6, 6, 5, '#888'); ci(g, 16, 18, 4, '#fff'); }, 1);
  SP.fgren = mk(32, 32, g => { glow(g, 16, 18, 16, 'rgba(255,0,200,.5)'); ci(g, 16, 18, 9, '#b020ff'); rc(g, 13, 6, 6, 5, '#888'); rc(g, 12, 16, 8, 3, '#f0f'); }, 1);
  const pk = (c, t) => mk(40, 40, g => { rc(g, 6, 12, 28, 24, c); rc(g, 6, 12, 28, 4, '#fff6'); g.fillStyle = '#fff'; g.font = 'bold 18px monospace'; g.textAlign = 'center'; g.fillText(t, 20, 32); glow(g, 20, 24, 20, 'rgba(255,255,255,.25)'); }, 1);
  SP.pkn = pk('#17a8a8', 'N'); SP.pkf = pk('#9a20d0', 'F'); SP.pkm = pk('#c22', '+');
  SP.fire = mk(64, 80, g => { glow(g, 32, 50, 32, 'rgba(255,120,0,.6)'); pg(g, '#ff5a00', 10, 78, 20, 20, 30, 50, 34, 4, 44, 44, 54, 78); pg(g, '#ffb000', 20, 78, 30, 36, 38, 20, 46, 78); pg(g, '#ffee80', 28, 78, 34, 54, 40, 78); }, 1);
  SP.expl = mk(96, 96, g => { glow(g, 48, 48, 48, 'rgba(255,255,255,1)', 'rgba(255,100,0,0)'); glow(g, 48, 48, 36, 'rgba(255,230,120,.9)', 'rgba(255,60,0,0)'); }, 1);
  SP.expl2 = mk(96, 96, g => { glow(g, 48, 48, 48, 'rgba(255,255,255,1)', 'rgba(200,0,255,0)'); glow(g, 48, 48, 36, 'rgba(255,100,240,.9)', 'rgba(150,0,255,0)'); }, 1);
  SP.expl3 = mk(96, 96, g => { glow(g, 48, 48, 48, 'rgba(255,255,255,1)', 'rgba(0,200,255,0)'); glow(g, 48, 48, 36, 'rgba(100,255,240,.9)', 'rgba(0,150,255,0)'); }, 1);
  SP.dye = mk(48, 16, g => { el(g, 24, 8, 22, 6, 'rgba(30,150,255,.85)'); el(g, 18, 7, 8, 3, 'rgba(120,210,255,.8)'); }, 1);
  SP.exit = mk(64, 128, g => { rc(g, 4, 4, 56, 124, '#0f8'); rc(g, 10, 10, 44, 118, '#021'); glow(g, 32, 70, 32, 'rgba(0,255,150,.6)'); g.fillStyle = '#0f8'; g.font = 'bold 14px monospace'; g.textAlign = 'center'; g.fillText('EXIT', 32, 60); pg(g, '#0f8', 20, 80, 44, 80, 32, 100); }, 1);
  SP.gate = mk(64, 128, g => { rc(g, 4, 4, 56, 124, '#f0f'); rc(g, 10, 10, 44, 118, '#102'); glow(g, 32, 70, 32, 'rgba(255,0,255,.5)'); g.fillStyle = '#ff0'; g.font = 'bold 12px monospace'; g.textAlign = 'center'; g.fillText('RIDE', 32, 60); pg(g, '#ff0', 20, 80, 44, 80, 32, 100); }, 1);
}
// ---------- wall textures ----------
const TEX = [];
function buildTextures() {
  const R = seeded(7);
  const mkT = fn => { const c = C(128, 128); fn(c.getContext('2d')); return c; };
  const wins = (g, base, cols, y0) => { for (let y = y0; y < 120; y += 24)for (let x = 8; x < 120; x += 24) { g.fillStyle = R() < .6 ? cols[(R() * cols.length) | 0] : '#0a0818'; g.fillRect(x, y, 14, 14); } };
  TEX[1] = mkT(g => { rc(g, 0, 0, 128, 128, '#1e1736'); g.strokeStyle = '#2c2250'; for (let y = 0; y < 128; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke(); } wins(g, 0, ['#18e0ff', '#ff2bd6', '#ffd24a'], 8); rc(g, 0, 124, 128, 4, '#ff2bd6'); });
  TEX[2] = mkT(g => { rc(g, 0, 0, 128, 128, '#2b2a40'); for (let i = 0; i < 40; i++) rc(g, R() * 128, R() * 128, 2, 2, '#3a3a58'); g.lineWidth = 4; g.lineCap = 'round'; g.strokeStyle = '#ff2bd6'; g.beginPath(); g.moveTo(14, 90); g.bezierCurveTo(30, 30, 60, 120, 76, 50); g.stroke(); g.strokeStyle = '#18e0ff'; g.beginPath(); g.moveTo(60, 100); g.bezierCurveTo(80, 60, 100, 110, 118, 40); g.stroke(); rc(g, 0, 0, 128, 4, '#18e0ff'); });
  TEX[3] = mkT(g => { rc(g, 0, 0, 128, 128, '#140d26'); rc(g, 8, 24, 112, 44, '#200a3a'); g.strokeStyle = '#ff2bd6'; g.lineWidth = 3; g.strokeRect(8, 24, 112, 44); g.fillStyle = '#ff2bd6'; g.font = 'bold 26px monospace'; g.textAlign = 'center'; g.shadowColor = '#ff2bd6'; g.shadowBlur = 10; g.fillText('24H BAR', 64, 55); g.shadowBlur = 0; wins(g, 0, ['#18e0ff', '#ffd24a'], 80); });
  TEX[4] = mkT(g => { rc(g, 0, 0, 128, 128, '#d8eef0'); rc(g, 0, 0, 128, 10, '#18c8a0'); rc(g, 0, 118, 128, 10, '#18c8a0'); rc(g, 52, 24, 24, 56, '#18a070'); rc(g, 36, 40, 56, 24, '#18a070'); g.fillStyle = '#0a5a45'; g.font = 'bold 14px monospace'; g.textAlign = 'center'; g.fillText('HARM REDUCTION', 64, 104); });
  TEX[5] = mkT(g => { const q = g.createLinearGradient(0, 0, 0, 128); q.addColorStop(0, '#5a1fa8'); q.addColorStop(1, '#1a5fd0'); g.fillStyle = q; g.fillRect(0, 0, 128, 128); g.strokeStyle = '#d8b0ff'; g.lineWidth = 2; for (let x = 0; x <= 128; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 128); g.stroke(); } for (let y = 0; y <= 128; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke(); } pg(g, '#ffffffcc', 64, 38, 90, 84, 38, 84); pg(g, '#3a1a80', 64, 52, 78, 78, 50, 78); });
  TEX[6] = mkT(g => { rc(g, 0, 0, 128, 128, '#a85a1c'); for (let x = 0; x < 128; x += 8) rc(g, x, 0, 4, 128, '#8a4614'); rc(g, 0, 60, 128, 6, '#18e0ff'); g.fillStyle = '#18e0ff'; g.font = 'bold 14px monospace'; g.textAlign = 'center'; g.fillText('NO RECEIPTS', 64, 100); });
  TEX[7] = mkT(g => { rc(g, 0, 0, 128, 128, '#220612'); for (let x = 12; x < 128; x += 24) rc(g, x, 0, 8, 128, '#ff2050'); g.fillStyle = '#fff'; g.font = 'bold 20px monospace'; g.textAlign = 'center'; g.fillText('LOCKED', 64, 68); });
  TEX[0] = TEX[1];
}
const FOGC = '24,6,44', FOGS = []; for (let i = 0; i < 32; i++)FOGS.push('rgba(' + FOGC + ',' + (i / 31).toFixed(2) + ')');
// ---------- map ----------
let M = null;
function newMap(w, h) { M = { w, h, s: new Uint8Array(w * h).fill(1), wt: new Uint8Array(w * h), fl: new Uint8Array(w * h) }; }
function carve(x, y, w, h, fl, wt) {
  for (let j = y; j < y + h; j++)for (let i = x; i < x + w; i++) { M.s[j * M.w + i] = 0; M.fl[j * M.w + i] = fl; }
  for (let j = y - 1; j <= y + h; j++)for (let i = x - 1; i <= x + w; i++) { if (i < 0 || j < 0 || i >= M.w || j >= M.h) continue; const k = j * M.w + i; if (M.s[k] && !M.wt[k]) M.wt[k] = wt[(i + j) % wt.length]; }
}
function setWall(x, y, t) { const k = y * M.w + x; M.s[k] = t ? 1 : 0; if (t) M.wt[k] = t; }
function sol(x, y) { if (x < 0 || y < 0) return 1; const i = x | 0, j = y | 0; if (i >= M.w || j >= M.h) return 1; return M.s[j * M.w + i]; }
function los(x1, y1, x2, y2) { const d = Math.hypot(x2 - x1, y2 - y1), n = Math.ceil(d / .3); for (let i = 1; i < n; i++) { const t = i / n; if (sol(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)) return false; } return true; }
// ---------- state ----------
const P = { x: 2, y: 2, a: 0, hp: 100, jz: 0, jv: 0, bob: 0, cdP: 0, cdK: 0, cdU: 0, cdW: 0, inv: 0, hurt: 0, slow: 0, hand: 0, anim: null, carry: null, sa: 0, spr: '', sprT: 0, vx: 0, vy: 0 };
let G = { mode: 'title', lvl: 0, pts: 0, unl: [1, 1, 0, 0, 0, 0, 0], ng: 0, fg: 0, poo: 0, water: 100, heat: 0, shake: 0, t: 0, ride: false, rideV: 4, flash: 0, over: 0, cardT: 0 };
let E = [], PR = [], PK = [], PO = [], FI = [], EX = [], TX = [], OB = [], TM = [], SHW = [], PART = [], S = {}, mayor = null, MSG = { s: '', t: 0 }, punchLog = [];
const WN = ['FISTS', 'NARCAN', 'HOSE', 'N-GREN', 'TORCH', 'F-GREN', 'POOP'];
const UNLOCK = [0, 0, 200, 500, 900, 1400, 0];
const TY = {
  zom: { hp: 3, spd: 1.4, r: .3, h: .8, spr: 'zom', pts: 50 }, dog: { hp: 2, spd: 3.3, r: .28, h: .4, spr: 'dog', pts: 40 },
  scz: { hp: 2, spd: 3.6, r: .35, h: .8, spr: 'scz', pts: 80 }, tech: { hp: 1, spd: 2.4, r: .3, h: .8, spr: 'tech', pts: 0 },
  vend: { hp: 4, spd: 1.7, r: .32, h: .8, spr: 'vend', pts: 80 }, store: { hp: 5, spd: 1.2, r: .32, h: .8, spr: 'store', pts: 120 },
  ngo: { hp: 3, spd: 1.9, r: .3, h: .8, spr: 'ngo0', pts: 100 }, under: { hp: 60, spd: 1.4, r: .5, h: 1.2, spr: 'under', pts: 1000 },
  boss: { hp: 100, spd: 1.1, r: .7, h: 1.6, spr: 'boss', pts: 3000 }, lunge: { hp: 1, spd: 3, r: .3, h: .8, spr: 'scz', pts: 60 }
};
const isBoss = e => e.t === 'under' || e.t === 'boss';
function msg(s, d) { MSG.s = s; MSG.t = d || 3; }
function txt(s, x, col, y, z) { TX.push({ s, x, y: y || 0, z: z || .8, col: col || '#ff0', life: 1.2 }); }
function later(t, fn) { TM.push({ t, fn }); }
function addPts(n) { G.pts = Math.max(0, G.pts + n); checkUnlock(); }
function checkUnlock() {
  for (let i = 2; i <= 5; i++) if (!G.unl[i] && G.pts >= UNLOCK[i]) {
    G.unl[i] = 1; if (i === 3) G.ng += 5; if (i === 5) G.fg += 4; msg('UNLOCKED: ' + WN[i] + ' (press ' + (i + 1) + ')', 3.5); G.wflash = 1;
  }
}
function hurtP(d, heat) {
  if (P.inv > 0 || G.mode !== 'play') return; P.hp -= d; P.hurt = .3; G.shake = Math.max(G.shake, .25); if (heat) G.heat = Math.min(110, G.heat + heat);
  if (P.hp <= 0) { P.hp = 0; G.mode = 'dead'; G.over = 0; if (document.exitPointerLock) document.exitPointerLock(); }
}
function spawnE(t, x, y, o) { const T = TY[t]; const e = Object.assign({ t, x, y, r: T.r, hp: T.hp, maxhp: T.hp, kx: 0, ky: 0, cd: rnd(.5, 2), mc: 0, flash: 0, dying: 0, dead: 0, awake: 0, act: 9, dye: 100, kick: 0, stun: 0, burn: 0, tm: Math.random() * 6, n: 0, sayT: 0 }, o || {}); E.push(e); return e; }
function prj(kind, x, y, z, vx, vy, vz, o) { const p = Object.assign({ kind, x, y, z, vx, vy, vz, life: 4, own: 'e', lob: 0, dead: 0 }, o || {}); PR.push(p); return p; }
function dropAt(x, y) { if (Math.random() < .25) { const r = Math.random(); PK.push({ x, y, k: r < .4 ? 'n' : r < .7 ? 'f' : 'm' }); } }
function killE(e, tag) {
  if (e.dying > 0 || e.dead) return; e.dying = .4; e.hp = 0; const T = TY[e.t]; if (G.ride) G.rideV = Math.min(6, G.rideV + .7);
  if (e.t === 'tech') { addPts(-100); txt('-100 DON\'T HIT TECH', e.x, '#f55'); G.heat = Math.min(110, G.heat + 12); }
  else { addPts(T.pts); txt('+' + T.pts + (tag ? ' ' + tag : ''), e.x, '#ff0'); }
  TX[TX.length - 1].x = e.x; TX[TX.length - 1].y = e.y; dropAt(e.x, e.y);
}
function hurtE(e, d, kx, ky, o) {
  if (e.dying > 0 || e.dead) return; o = o || {}; e.hp -= d; e.flash = .12; e.awake = 1; if (isBoss(e)) { kx *= .08; ky *= .08; }
  e.kx += kx || 0; e.ky += ky || 0; if (e.hp <= 0) killE(e, o.tag);
}
function dyeDecal(x, y) { if (OB.filter(o => o.k === 'dye').length < 40) OB.push({ k: 'dye', x: x + rnd(-.3, .3), y: y + rnd(-.3, .3), life: 8 }); }
function ex(x, y, r, dmg, kind, kb) {
  EX.push({ x, y, life: .45, max: .45, kind, r }); G.shake = Math.max(G.shake, kind === 'f' ? .6 : .3);
  for (const e of E) { if (e.dying > 0 || e.dead) continue; const d = Math.hypot(e.x - x, e.y - y); if (d < r + e.r) { const f = 1 - d / (r + e.r) * .5, ux = (e.x - x) / (d || 1), uy = (e.y - y) / (d || 1); hurtE(e, dmg * f, ux * kb, uy * kb); if (kind === 'fire') e.burn = 2; } }
}
function fire(x, y, life) { FI.push({ x, y, life: life || 4, r: 1 }); }
function moveC(e, dx, dy, r, isP) {
  const blk = (x, y) => {
    if (sol(x - r, y - r) || sol(x + r, y - r) || sol(x - r, y + r) || sol(x + r, y + r)) return true;
    for (const o of OB) if (o.blk && !(isP && P.jz > .4 && o.hop) && Math.hypot(o.x - x, o.y - y) < o.blk + r) return true; return false;
  };
  if (!blk(e.x + dx, e.y)) e.x += dx; if (!blk(e.x, e.y + dy)) e.y += dy;
}
function tgts(range, half, flt) {
  const out = [];
  for (const e of E) {
    if (e.dying > 0 || e.dead) continue; if (flt && !flt(e)) continue; const dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy), r = TY[e.t].r; if (d > range + r) continue;
    let da = Math.atan2(dy, dx) - P.a; da = Math.atan2(Math.sin(da), Math.cos(da)); if (Math.abs(da) < half + Math.atan2(r, Math.max(d, .2))) { e.pd = d; out.push(e); }
  }
  return out.sort((a, b) => a.pd - b.pd);
}
function hitObjs(range, half, dmg) {
  for (const o of OB) if (o.k === 'car' && !o.broken) { const dx = o.x - P.x, dy = o.y - P.y, d = Math.hypot(dx, dy); let da = Math.atan2(dy, dx) - P.a; da = Math.atan2(Math.sin(da), Math.cos(da)); if (d < range + .7 && Math.abs(da) < half + .5) { o.hp -= dmg; o.flash = .15; G.shake = .2; txt('CRACK', o.x, '#fff'); TX[TX.length - 1].y = o.y; if (o.hp <= 0) { o.broken = true; addPts(200); txt('+200 LOOT', o.x, '#ff0'); TX[TX.length - 1].y = o.y; } } }
}
// ---------- player actions ----------
const cs = () => [Math.cos(P.a), Math.sin(P.a)];
function aimV(sp, vz, z0) {
  let cx = Math.cos(P.a), sy = Math.sin(P.a); const e = tgts(10, .45, q => q.t !== 'tech')[0];
  if (e) { const d = Math.hypot(e.x - P.x, e.y - P.y), T = (vz + Math.sqrt(vz * vz + 18 * z0)) / 9; const a = Math.atan2(e.y - P.y, e.x - P.x); cx = Math.cos(a); sy = Math.sin(a); sp = clamp(d / T, 3, 12); }
  return [cx * sp, sy * sp];
}
function throwCarry() {
  const c = P.carry; if (!c) return; P.carry = null; const [cx, sy] = cs(); P.anim = { t: 'throw', t0: 0, d: .35 };
  const [vx, vy] = aimV(9, 1.8, .6); prj(c.kind, P.x + cx * .4, P.y + sy * .4, .6, vx, vy, 1.8, { own: 'p', lob: 1, spr: c.spr, ent: c.e });
  if (c.kind === 'mayor') { mayor.st = 'thrown'; txt('AAAAH!!', P.x + cx, '#6cf'); TX[TX.length - 1].y = P.y + sy; }
}
function doPunch() {
  if (P.carry) return throwCarry(); if (P.cdP > 0 || P.pow) return; P.cdP = .33; P.hand ^= 1; P.anim = { t: 'punch', t0: 0, d: .28, h: P.hand };
  punchLog.push(G.t); punchLog = punchLog.filter(t => G.t - t < 1.6); if (punchLog.length >= 4 && P.cdW <= 0) { punchLog = []; return doPower(); }
  later(.1, () => { const [cx, sy] = cs(), e = tgts(G.ride ? 2.2 : 1.5, G.ride ? 1.3 : .5)[0]; if (e) { hurtE(e, 1, cx * 2.5, sy * 2.5); G.shake = .15; } hitObjs(1.5, .5, 1); });
}
function doKick() {
  if (P.carry) return throwCarry(); if (P.cdK > 0 || P.pow) return; P.cdK = .6; P.anim = { t: 'kick', t0: 0, d: .4 };
  later(.15, () => { const [cx, sy] = cs(), e = tgts(G.ride ? 2.2 : 1.7, G.ride ? 1.3 : .5)[0]; if (e) { hurtE(e, 1, cx * 7, sy * 7); e.kick = .7; G.shake = .25; txt('KICK', e.x, '#0ff'); TX[TX.length - 1].y = e.y; } hitObjs(1.6, .5, 1.5); });
}
function doPower() {
  if (P.cdW > 0 || P.pow) return; P.cdW = 6; P.pow = 1; P.inv = 1.1; P.anim = { t: 'power', t0: 0, d: 1 }; msg('POWER COMBO!', 1.2);
  [.15, .4, .65].forEach(t => later(t, () => { const [cx, sy] = cs(); for (const e of tgts(2.4, .8)) hurtE(e, 2, cx * 3, sy * 3); hitObjs(2, .8, 2); G.shake = .3; }));
  later(.95, () => { ex(P.x, P.y, 6, 6, 'p', 9); SHW.push({ t: 0 }); G.shake = 1; G.flash = .5; for (const o of OB) if (o.k === 'car' && !o.broken && Math.hypot(o.x - P.x, o.y - P.y) < 3) { o.hp = 0; o.broken = true; addPts(200); } P.pow = 0; });
}
function sprayTick(kind) {
  const [cx, sy] = cs();
  if (kind === 'narc') for (const e of tgts(3.2, .35)) { hurtE(e, .3, cx * .9, sy * .9, { tag: 'REVIVED' }); e.stun = .25; }
  if (kind === 'hose') {
    G.water -= 1.3; for (const e of tgts(5.5, .3)) { hurtE(e, .25, cx * 3.2, sy * 3.2); if (e.t === 'ngo') { e.dye -= 14; dyeDecal(e.x, e.y); if (e.dye <= 0) killE(e, 'WASHED OUT'); } }
    for (let i = FI.length - 1; i >= 0; i--) { const f = FI[i]; if (Math.hypot(f.x - P.x, f.y - P.y) < 5) FI.splice(i, 1); }
  }
  if (kind === 'torch') {
    G.heat = Math.min(110, G.heat + 1.6); for (const e of tgts(2.3, .55)) { hurtE(e, .5, 0, 0); e.burn = 2; }
    for (let i = PO.length - 1; i >= 0; i--) { const p = PO[i]; let da = Math.atan2(p.y - P.y, p.x - P.x) - P.a; da = Math.atan2(Math.sin(da), Math.cos(da)); if (Math.hypot(p.x - P.x, p.y - P.y) < 2.4 && Math.abs(da) < .7) { PO.splice(i, 1); G.poo++; G.unl[6] = 1; txt('BURNING POOP +1', p.x, '#fa0'); TX[TX.length - 1].y = p.y; msg('Burning poop ready! Press 7 and throw it', 3); } }
  }
}
function doSpray(kind, dt) {
  if (P.carry) return; if (kind === 'hose' && G.water <= 0) return; P.spr = kind; P.sprT = .15; P.sa += dt; if (P.sa < .1) return; P.sa -= .1; sprayTick(kind);
}
function throwG(kind) {
  if (P.carry) return throwCarry(); if (P.cdU > 0) return;
  if (kind === 'ngren' && G.ng <= 0) return msg('Out of Narcan grenades', 1.5); if (kind === 'fgren' && G.fg <= 0) return msg('Out of fentanyl grenades', 1.5); if (kind === 'poop' && G.poo <= 0) return msg('No burning poop. Ignite poop piles with the torch', 2);
  P.cdU = .7; P.anim = { t: 'throw', t0: 0, d: .35 }; if (kind === 'ngren') G.ng--; if (kind === 'fgren') G.fg--; if (kind === 'poop') G.poo--;
  later(.15, () => { const [cx, sy] = cs(), [vx, vy] = aimV(8, 2.6, .5); prj(kind, P.x + cx * .3, P.y + sy * .3, .5, vx, vy, 2.6, { own: 'p', lob: 1, life: 3 }); });
}
function useWeapon(dt, edge) {
  const w = P.w;
  if (w === 0) { if (edge) doPunch(); } else if (w === 1) doSpray('narc', dt); else if (w === 2) doSpray('hose', dt); else if (w === 3) { if (edge) throwG('ngren'); }
  else if (w === 4) doSpray('torch', dt); else if (w === 5) { if (edge) throwG('fgren'); } else if (w === 6) { if (edge) throwG('poop'); }
}
function doGrab() {
  if (P.carry) return throwCarry(); if (P.cdU > 0) return;
  if (mayor && mayor.st === 'follow' && Math.hypot(mayor.x - P.x, mayor.y - P.y) < 2.2) { mayor.st = 'carried'; P.carry = { kind: 'mayor', spr: 'mayor' }; msg('Got the mayor! Press G / J to throw him', 3); mayor.say = 'Put me DOWN!'; mayor.sayT = 2; return; }
  const e = tgts(1.8, .7, e => !isBoss(e) && e.t !== 'lunge')[0]; if (e) { E.splice(E.indexOf(e), 1); P.carry = { kind: 'body', spr: TY[e.t].spr, e }; return; }
  msg('Nothing to grab', 1);
}
function jump() { if (P.jz <= 0.001 && !G.ride) P.jv = 4.4; }
// ---------- enemy AI ----------
const SAY = ['I should move back home', 'This city is cooked', 'Back to Ohio I go'];
const MAYSAY = ['Please don\'t hurt me!', 'I\'m a LEADER!', 'Can we form a task force?', 'Is it safe?', 'I want my mommy', 'Vibe check!'];
function updE(e, dt) {
  if (e.dying > 0) { e.dying -= dt; if (e.dying <= 0) e.dead = 1; return; }
  const T = TY[e.t]; e.cd -= dt; e.mc -= dt; e.flash -= dt; e.sayT -= dt; e.tm += dt;
  let dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || .001;
  if (!e.awake) { if (d < e.act) e.awake = 1; else return; }
  if (e.burn > 0) { e.burn -= dt; hurtE(e, 1.5 * dt, 0, 0); if (e.dying > 0) return; }
  if (e.kx || e.ky) { moveC(e, e.kx * dt, e.ky * dt, T.r); const f = Math.pow(.03, dt); e.kx *= f; e.ky *= f; if (Math.abs(e.kx) + Math.abs(e.ky) < .3) e.kx = e.ky = 0; }
  if (e.kick > 0) { e.kick -= dt; for (let i = 0; i < PO.length; i++) if (Math.hypot(PO[i].x - e.x, PO[i].y - e.y) < .65) { const q = PO[i]; PO.splice(i, 1); txt('SLIPPED! +150', q.x, '#0f8'); TX[TX.length - 1].y = q.y; addPts(150); e.hp = 0; e.dying = .4; return; } return; }
  if (e.stun > 0) { e.stun -= dt; return; }
  const ux = dx / d, uy = dy / d, sp = T.spd * (e.slow > 0 ? .5 : 1), mv = (a, b) => moveC(e, a * dt, b * dt, T.r), sees = d < 11 && los(e.x, e.y, P.x, P.y);
  switch (e.t) {
    case 'zom': case 'ngo': case 'vend':
      if (d > .75) mv(ux * sp, uy * sp);
      if (e.t === 'zom' && e.cd <= 0 && d > 2.5 && d < 8 && sees) { e.cd = rnd(2.4, 4); prj('needle', e.x, e.y, .4, ux * 6, uy * 6, 0, { dmg: 4 }); }
      if (d < .85 && e.mc <= 0) { e.mc = 1.1; hurtP(e.t === 'vend' ? 8 : 6); }
      break;
    case 'dog': if (d > .6) mv(ux * sp, uy * sp); if (d < .75 && e.mc <= 0) { e.mc = .8; hurtP(5); } break;
    case 'scz': if (d > .6) mv(ux * sp, uy * sp); if (d < .8 && e.mc <= 0) { e.mc = 1.2; hurtP(8); } break;
    case 'tech': if (d < 6) { mv(-ux * sp, -uy * sp); if (e.sayT <= 0 && d < 5) { e.say = SAY[(Math.random() * 3) | 0]; e.sayT = 3.5; } } break;
    case 'store':
      if (e.spray > 0) { e.spray -= dt; e.wt = (e.wt || 0) - dt; if (e.wt <= 0) { e.wt = .06; prj('water', e.x, e.y, .4, ux * 9, uy * 9, 0, { fx: 1, life: .5 }); }
        if (d < 6.5 && sees) { hurtP(5 * dt); P.x += ux * 2.2 * dt; P.y += uy * 2.2 * dt; if (sol(P.x, P.y)) { P.x -= ux * 2.2 * dt; P.y -= uy * 2.2 * dt; } } }
      else { if (d > 5) mv(ux * sp, uy * sp); else if (d < 2.5) mv(-ux * sp, -uy * sp); if (e.cd <= 0 && d < 6.5 && sees) { e.spray = 1.3; e.cd = 3.5; e.say = 'GET OFF MY BLOCK!'; e.sayT = 1.5; } }
      break;
    case 'lunge': {
      if (e.x < P.x - 2.5) { e.dead = 1; break; } if (Math.abs(e.x - P.x) < .8 && Math.abs(e.y - P.y) < .9) { hurtP(8); P.slow = 1; G.rideV = 2.5; e.dead = 1; txt('WIPEOUT!', P.x, '#f55', P.y); break; }
      const dxx = e.x - P.x; if (dxx > 6) break; const ly = P.y - e.y; moveC(e, 0, Math.sign(ly) * Math.min(Math.abs(ly), 3.3 * dt), T.r); break; }
    case 'under': case 'boss': bossAI(e, dt, ux, uy, d, sees); break;
  }
  if (e.t === 'ngo') e.spr = e.dye > 66 ? 'ngo0' : e.dye > 33 ? 'ngo1' : 'ngo2';
}
function bossAI(e, dt, ux, uy, d, sees) {
  const T = TY[e.t], fin = e.t === 'boss', ph2 = e.hp < e.maxhp / 2, sp = T.spd * (ph2 ? 1.3 : 1);
  if (d > 7) moveC(e, ux * sp * dt, uy * sp * dt, T.r); else if (d < 4) moveC(e, -ux * sp * dt, -uy * sp * dt, T.r);
  moveC(e, -uy * Math.sin(e.tm * .8) * sp * dt, ux * Math.sin(e.tm * .8) * sp * dt, T.r);
  if (ph2 && !e.helped && !fin) { e.helped = 1; msg('The underboss calls her interns!', 2.5); for (let i = 0; i < 2; i++) spawnE('ngo', e.x + rnd(-1, 1), e.y + rnd(-1, 1), { awake: 1 }); }
  if (e.cd > 0 || !sees) return; e.cd = ph2 ? 1.4 : 2.2; const n = e.n++ % 3;
  if (!fin) {
    if (n === 0) { prj('ballot', e.x, e.y, .45, ux * 7, uy * 7, 0, { dmg: 8 }); e.say = 'VOTE YES ON PROP B!'; e.sayT = 1.5; }
    else if (n === 1) { for (let i = -1; i <= 1; i++) { const a = Math.atan2(uy, ux) + i * .18; prj('cig', e.x, e.y, .45, Math.cos(a) * 6.5, Math.sin(a) * 6.5, 0, { dmg: 4, heat: 12 }); } e.say = 'Smoke break!'; e.sayT = 1.2; }
    else { prj('bag', e.x, e.y, .9, (P.x - e.x), (P.y - e.y), 3.6, { lob: 1, heat: 20, life: 2 }); e.say = 'BURNING BAG!'; e.sayT = 1.2; }
  } else {
    const a0 = Math.atan2(uy, ux);
    if (n === 0) { for (let i = -1; i <= 1; i++) { const a = a0 + i * .28; prj('orb', e.x, e.y, .5, Math.cos(a) * 5, Math.sin(a) * 5, 0, { dmg: 10 }); } if (ph2) for (const i of [-2, 2]) { const a = a0 + i * .28; prj('orb', e.x, e.y, .5, Math.cos(a) * 5, Math.sin(a) * 5, 0, { dmg: 10 }); } e.say = 'NONPROFIT NOVA!'; e.sayT = 1.5; }
    else if (n === 1) { for (let i = -2; i <= 2; i++) { const a = a0 + i * .15; prj('needle', e.x, e.y, .4, Math.cos(a) * 6.5, Math.sin(a) * 6.5, 0, { dmg: 4 }); } e.say = 'GRANT FUNDED!'; e.sayT = 1.3; }
    else { if (E.filter(q => q.t === 'ngo' && !q.dead && q.dying <= 0).length < 4) { for (let i = 0; i < 2; i++) spawnE('ngo', e.x + (i ? 1.2 : -1.2), e.y + .6, { awake: 1 }); e.say = 'Interns, ASSEMBLE!'; e.sayT = 1.5; } else prj('bag', e.x, e.y, .9, (P.x - e.x), (P.y - e.y), 3.6, { lob: 1, heat: 20, life: 2 }); }
  }
}
function land(p) {
  p.dead = 1; const k = p.kind;
  if (k === 'ngren') ex(p.x, p.y, 2.2, 4, 'n', 6); else if (k === 'fgren') ex(p.x, p.y, 3.2, 9, 'f', 9);
  else if (k === 'poop') { ex(p.x, p.y, 1.5, 2.5, 'fire', 3); fire(p.x, p.y, 5); }
  else if (k === 'bag') { fire(p.x, p.y, 4); if (Math.hypot(P.x - p.x, P.y - p.y) < 1.1) { hurtP(8, 20); } }
  else if (k === 'mayor' || k === 'body') {
    let hit = false; for (const e of E) if (!e.dead && e.dying <= 0 && Math.hypot(e.x - p.x, e.y - p.y) < e.r + 1.6) { hit = true; hurtE(e, isBoss(e) && k === 'mayor' ? 30 : k === 'mayor' ? 10 : 5, (e.x - p.x) * 3, (e.y - p.y) * 3, { tag: 'MAYOR SLAM' }); }
    EX.push({ x: p.x, y: p.y, life: .4, max: .4, kind: 'n', r: 1.5 }); G.shake = .6; if (k === 'mayor') { mayor.x = p.x; mayor.y = p.y; mayor.st = 'down'; mayor.t = 3; mayor.say = hit ? 'Worth it!' : 'Ow...'; mayor.sayT = 2; if (hit) addPts(300); }
    if (k === 'body' && p.ent) { addPts(TY[p.ent.t].pts); }
  }
}
function updPR(p, dt) {
  p.life -= dt; if (p.life <= 0) { if (p.lob || p.kind === 'mayor') land(p); p.dead = 1; return; }
  const ox = p.x, oy = p.y; p.x += p.vx * dt; p.y += p.vy * dt; if (p.lob) { p.vz -= 9 * dt; p.z += p.vz * dt; }
  if (sol(p.x, p.y)) { p.x = ox; p.y = oy; if (p.lob || p.kind === 'mayor') land(p); else p.dead = 1; return; }
  if (p.fx) return;
  if (p.lob && p.z <= 0) { p.z = 0; land(p); return; }
  if (p.own === 'e') {
    if (Math.hypot(P.x - p.x, P.y - p.y) < .45 && p.z > P.jz - .05 && p.z < P.jz + .9) { if (!p.lob) { hurtP(p.dmg || 4, p.heat); p.dead = 1; } }
  } else { for (const e of E) if (!e.dead && e.dying <= 0 && Math.hypot(e.x - p.x, e.y - p.y) < e.r + (p.kind === 'mayor' || p.kind === 'body' ? .8 : .45) && p.z < 1.3) { land(p); return; } }
}
// ---------- per-frame update ----------
function updateGame(dt) {
  G.t += dt; G.shake = Math.max(0, G.shake - dt * 2); G.flash = Math.max(0, G.flash - dt * 2); G.wflash = Math.max(0, (G.wflash || 0) - dt);
  MSG.t -= dt; P.cdP -= dt; P.cdK -= dt; P.cdU -= dt; P.cdW -= dt; P.inv -= dt; P.hurt -= dt; P.sprT -= dt; P.slow -= dt;
  if (P.anim) { P.anim.t0 += dt; if (P.anim.t0 >= P.anim.d) P.anim = null; }
  for (let i = TM.length - 1; i >= 0; i--) { TM[i].t -= dt; if (TM[i].t <= 0) { const f = TM[i].fn; TM.splice(i, 1); f(); } }
  // input
  const f = (keys.w || keys.ArrowUp ? 1 : 0) - (keys.s || keys.ArrowDown ? 1 : 0) + (-mv.y), sd = (keys.d ? 1 : 0) - (keys.a ? 1 : 0) + mv.x;
  const tr = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0); P.a += tr * 2.4 * dt + look; look = 0;
  const [cx, sy] = cs();
  if (G.ride) {
    if (P.a > .6) P.a = .6; if (P.a < -.6) P.a = -.6;
    G.rideV += (4 - G.rideV) * dt * .5; const v = P.slow > 0 ? 1.8 : G.rideV; P.x += v * dt; const ny = clamp(P.y + clamp(sd, -1, 1) * 3 * dt, 8.45, 10.55); P.y = ny;
  } else {
    let vx = (cx * f - sy * sd), vy = (sy * f + cx * sd); const m = Math.hypot(vx, vy); if (m > 1) { vx /= m; vy /= m; }
    const spd = 3.4 * (P.slow > 0 ? .55 : 1); moveC(P, vx * spd * dt, vy * spd * dt, .25, true); P.bob += m * dt * 9;
  }
  P.jv -= 12 * dt; P.jz += P.jv * dt; if (P.jz < 0) { P.jz = 0; P.jv = 0; }
  // actions
  for (const a of pressQ) { if (a === 'J') doPunch(); else if (a === 'K') doKick(); else if (a === 'L') { if (!P.carry) doSpray('narc', .1); } else if (a === 'E') useWeapon(.1, true); else if (a === 'G') doGrab(); else if (a === 'JUMP') jump(); else if (a === 'U') doPower(); else if (a[0] === 'W') P.w = +a[1]; else if (a === 'Q') cycle(1); } pressQ.length = 0;
  if (held.L && !P.carry) doSpray('narc', dt); if (held.E) useWeapon(dt, false);
  if (P.w > 0 && !G.unl[P.w]) P.w = 0;
  if (!(held.E && P.w === 2) && !(held.L)) G.water = Math.min(100, G.water + 6 * dt);
  // heat
  G.heat = Math.max(0, G.heat - 4 * dt); if (G.heat >= 100) { G.overheat = 1; } if (G.overheat) { hurtP(8 * dt); if (G.heat < 60) G.overheat = 0; }
  // world
  for (const e of E) updE(e, dt); E = E.filter(e => !e.dead);
  for (const p of PR) updPR(p, dt); PR = PR.filter(p => !p.dead);
  for (const f of FI) { f.life -= dt; if (Math.hypot(f.x - P.x, f.y - P.y) < f.r && P.jz < .4) { hurtP(10 * dt); G.heat = Math.min(110, G.heat + 25 * dt); } for (const e of E) if (!e.dead && e.dying <= 0 && Math.hypot(f.x - e.x, f.y - e.y) < f.r) { e.burn = 1.5; } } FI = FI.filter(f => f.life > 0);
  for (const x of EX) x.life -= dt; EX = EX.filter(x => x.life > 0);
  for (const t of TX) { t.life -= dt; t.z += dt * .4; } TX = TX.filter(t => t.life > 0);
  for (const o of OB) { if (o.life !== undefined) o.life -= dt; if (o.flash) o.flash -= dt; } OB = OB.filter(o => o.life === undefined || o.life > 0);
  for (const s of SHW) s.t += dt; SHW = SHW.filter(s => s.t < .7);
  for (let i = PO.length - 1; i >= 0; i--) { const q = PO[i]; q.cool = (q.cool || 0) - dt; if (q.cool <= 0 && P.jz < .25 && Math.hypot(q.x - P.x, q.y - P.y) < .45) { q.cool = 1.5; addPts(-75); txt('-75 STEPPED IN POOP', q.x, '#c84'); TX[TX.length - 1].y = q.y; P.slow = 1.2; } }
  for (let i = PK.length - 1; i >= 0; i--) { const k = PK[i]; if (Math.hypot(k.x - P.x, k.y - P.y) < .7) { PK.splice(i, 1); if (k.k === 'n') { G.ng += 2; txt('+2 N-GREN', k.x, '#0ff'); } else if (k.k === 'f') { G.fg += 2; txt('+2 F-GREN', k.x, '#f0f'); } else { P.hp = Math.min(100, P.hp + 25); txt('+25 HP', k.x, '#f66'); } TX[TX.length - 1].y = k.y; } }
  if (mayor) updMayor(dt);
  for (const o of OB) if (o.k === 'tent' && !o.open && Math.hypot(o.x - P.x, o.y - P.y) < 4.5 && o.dog) { o.open = 1; for (let i = 0; i < o.dog; i++) spawnE('dog', o.x + rnd(-.5, .5), o.y + .6, { awake: 1 }); txt('DOGS!', o.x, '#f55'); TX[TX.length - 1].y = o.y; }
  for (const o of OB) if (o.k === 'cable') {
    o.x += o.v * dt; if (o.x > o.max) { o.v = -Math.abs(o.v); } if (o.x < o.min) { o.v = Math.abs(o.v); } o.bell -= dt; if (o.bell <= 0) { o.bell = 3; if (Math.hypot(o.x - P.x, o.y - P.y) < 9) txt('DING DING!', o.x, '#ff0', o.y, 1.4); }
    if (Math.abs(o.x - P.x) < 1.5 && Math.abs(o.y - P.y) < 1.0 && P.jz < .3 && o.hc <= 0) { o.hc = 1.2; hurtP(18); P.y += Math.sign(P.y - o.y || 1) * 1.2; if (sol(P.x, P.y)) P.y = o.y; txt('CABLE CAR!', P.x, '#f55'); TX[TX.length - 1].y = P.y; } o.hc -= dt;
    for (const e of E) if (!e.dead && e.dying <= 0 && !isBoss(e) && Math.abs(o.x - e.x) < 1.4 && Math.abs(o.y - e.y) < .9) { hurtE(e, 99, 0, 0, { tag: 'TRAMMED' }); }
  }
  if (LV[G.lvl].upd) LV[G.lvl].upd(dt);
}
function updMayor(dt) {
  const m = mayor; m.sayT -= dt; const dx = P.x - m.x, dy = P.y - m.y, d = Math.hypot(dx, dy) || 1;
  if (m.st === 'follow') { if (d > 2.8) moveC(m, dx / d * 2.4 * dt, dy / d * 2.4 * dt, .25); else if (d < 1.4) moveC(m, -dx / d * 1.5 * dt, -dy / d * 1.5 * dt, .25); if (m.sayT <= -3) { m.say = MAYSAY[(Math.random() * MAYSAY.length) | 0]; m.sayT = 2.5; } }
  else if (m.st === 'down') { m.t -= dt; if (m.t <= 0) { m.st = 'follow'; const [cx, sy] = cs(); m.x = P.x - cx * 2; m.y = P.y - sy * 2; if (sol(m.x, m.y)) { m.x = P.x; m.y = P.y; } m.say = 'I\'m back... please don\'t...'; m.sayT = 2.5; } }
}
function cycle(dir) { let w = P.w; for (let i = 0; i < 8; i++) { w = (w + dir + 7) % 7; if (G.unl[w]) break; } P.w = w; }
// ---------- input state ----------
const keys = {}, held = {}, pressQ = []; let look = 0; const mv = { x: 0, y: 0 };
// ---------- levels ----------
function complete() {
  if (G.lvl >= 2) { G.mode = 'win'; G.over = 0; if (document.exitPointerLock) document.exitPointerLock(); return; }
  addPts(300); loadLevel(G.lvl + 1);
}
const LV = [
  { name: 'SOMA', sub: 'Break into the car. Chase the junkie into the harm reduction clinic. Beat the blue-haired NGO underboss.',
    obj: () => ['Punch the car to break in (J)', 'Chase the junkie into the clinic!', 'Beat the NGO underboss! Watch your HEAT', 'Reach the EXIT'][S.stage],
    build() {
      newMap(44, 30); carve(2, 11, 14, 8, 0, [1, 2, 3]); carve(16, 14, 14, 2, 0, [1, 2]); carve(30, 8, 13, 14, 1, [4]);
      [[34, 11], [34, 18], [38, 11], [38, 18]].forEach(([x, y]) => setWall(x, y, 4)); Object.assign(P, { x: 3.5, y: 14.5, a: 0 });
      S.car = { k: 'car', x: 9.5, y: 14.5, hp: 6, blk: .8 }; OB.push(S.car);
      [[6, 12.5], [12, 17], [13.5, 12.5], [20, 14.5], [25, 15.5]].forEach(([x, y]) => spawnE('zom', x, y, { act: -1 }));
      [[5, 17.5], [11, 12]].forEach(([x, y]) => spawnE('tech', x, y, { act: 6 }));
      [[19, 14.7], [23, 15.3], [8, 12], [12, 16.6]].forEach(([x, y]) => PO.push({ x, y }));
      msg('Punch the car (J or left click) to break in', 5);
    },
    upd(dt) {
      if (S.stage === 0 && S.car.broken) { S.stage = 1; E.forEach(e => { if (e.act < 0) e.act = 9; }); msg('JUNKIE SPOTTED! Chase him to the clinic', 4); S.jk = { k: 'junkie', x: 11, y: 12.5, wp: 0 }; OB.push(S.jk); }
      if (S.stage === 1) {
        const jk = S.jk, wps = [[16, 14.5], [29, 14.8], [34, 15]]; if (jk.wp < 3) { const w = wps[jk.wp], d = Math.hypot(w[0] - jk.x, w[1] - jk.y); if (d < .3) jk.wp++; else { jk.x += (w[0] - jk.x) / d * 2.8 * dt; jk.y += (w[1] - jk.y) / d * 2.8 * dt; } }
        if (P.x >= 31.5) { S.stage = 2; setWall(29, 14, 7); setWall(29, 15, 7); OB = OB.filter(o => o !== jk); S.boss = spawnE('under', 38, 15, { awake: 1 }); msg('The junkie slipped into the clinic... the UNDERBOSS blocks the way!', 4); G.shake = .6; }
      }
      if (S.stage === 2 && S.boss.dying > 0) { S.stage = 3; E.forEach(e => { if (!e.dead && e.dying <= 0) killE(e); }); S.exit = { k: 'exit', x: 41.5, y: 9.5 }; OB.push(S.exit); msg('Underboss down! Head for the EXIT', 4); }
      if (S.stage === 3 && dist(P, S.exit) < 1.1) complete();
    } },
  { name: 'THE MISSION', sub: 'Fight through the black market. Then ride the scooter after the junkie and knock off attackers lunging from the sides.',
    obj: () => ['Fight through the black market. Reach the RIDE gate', 'SCOOTER CHASE! Hit lunging attackers (J/K), steer A/D'][S.stage],
    build() {
      newMap(70, 20); carve(2, 4, 26, 12, 2, [6, 1, 3]); carve(28, 8, 40, 3, 0, [2, 3, 1]); Object.assign(P, { x: 3.5, y: 9.5, a: 0 });
      [[6, 6], [6, 12], [11, 8], [11, 13], [16, 6], [16, 11], [21, 8], [21, 13]].forEach(([x, y]) => { OB.push({ k: 'stall', x, y, blk: .55, hop: 1 }); spawnE('vend', x + .8, y + .9, { act: 7 }); });
      OB.push({ k: 'tent', x: 4, y: 14.6, dog: 1, blk: .5 }, { k: 'tent', x: 25, y: 5.4, dog: 2, blk: .5 }, { k: 'tent', x: 14, y: 14.7, dog: 2, blk: .5 });
      [[9, 10], [14, 9], [18, 14], [20, 5], [23, 10]].forEach(([x, y]) => spawnE('zom', x, y));
      [[24, 12], [19, 5]].forEach(([x, y]) => spawnE('scz', x, y)); [[8, 14], [22, 6]].forEach(([x, y]) => spawnE('tech', x, y, { act: 6 }));
      [[8, 8], [13, 10], [18, 9], [23, 12], [10, 5]].forEach(([x, y]) => PO.push({ x, y }));
      S.gate = { k: 'gate', x: 26.8, y: 9.5 }; OB.push(S.gate); S.jk = { k: 'junkie', x: 12, y: 9.5 }; OB.push(S.jk);
      msg('Black market! Hop stalls with SPACE, punch vendors', 5);
    },
    upd(dt) {
      if (S.stage === 0) {
        if (S.jk) { S.jk.x = Math.min(26.5, S.jk.x + 2.2 * dt); if (S.jk.x >= 26.5) { OB = OB.filter(o => o !== S.jk); S.jk = null; } }
        if (P.x > 26.3 && P.y > 7.9 && P.y < 11) {
          S.stage = 1; G.ride = true; G.rideV = 4; E = []; PR = []; PK = []; PO = []; FI = []; OB = []; setWall(27, 8, 7); setWall(27, 9, 7); setWall(27, 10, 7);
          Object.assign(P, { x: 28.5, y: 9.5, a: 0, jz: 0, jv: 0 }); S.sp = 1; S.jks = { k: 'jks', x: 38, y: 9.5 }; OB.push(S.jks); msg('SCOOTER CHASE! Hit attackers with J or K as they lunge in', 4);
        }
      } else if (G.ride) {
        S.sp -= dt; if (S.sp <= 0) { S.sp = rnd(.8, 1.4); spawnE('lunge', P.x + 10, Math.random() < .5 ? 8.3 : 10.7, { awake: 1 }); }
        S.jks.x = P.x + 8 + Math.sin(G.t * 1.3); S.jks.y = 9.5 + Math.sin(G.t * 2) * .8; addPts(0);
        if (P.x >= 66.5) { G.ride = false; complete(); }
      }
    } },
  { name: 'TENDERLOIN', sub: 'Zombies, store owners with hoses, blue-haired NGO workers and a cable car. The tower boss waits. Bring the mayor.',
    obj: () => ['Push through the Tenderloin to the NGO TOWER', 'Defeat the TOWER BOSS. Throw the mayor at her! (G)'][S.stage],
    build() {
      newMap(50, 26); carve(2, 16, 46, 4, 0, [1, 3, 2]); [8, 16, 24, 32].forEach(x => carve(x, 13, 2, 3, 0, [3, 1])); [12, 20, 28].forEach(x => carve(x, 20, 2, 3, 0, [2])); carve(38, 4, 10, 12, 3, [5]);
      Object.assign(P, { x: 3.5, y: 17.5, a: 0 }); mayor = { x: 3.5, y: 18.6, st: 'follow', sayT: 0 };
      spawnE('store', 9, 14.2); spawnE('store', 24.4, 14.2); spawnE('store', 25.6, 14.4);
      S.doors = [{ x: 17, y: 14.5, d: 0 }, { x: 33, y: 14.5, d: 0 }];
      [[7, 18], [11, 17], [15, 18.5], [20, 17], [23, 18.5], [28, 17.5], [35, 18], [31, 16.5]].forEach(([x, y]) => spawnE('zom', x, y)); [[18, 19], [27, 16.4]].forEach(([x, y]) => spawnE('scz', x, y));
      [[12, 18], [30, 17]].forEach(([x, y]) => spawnE('tech', x, y, { act: 6 }));
      OB.push({ k: 'tent', x: 13, y: 21.4, dog: 2, blk: .5 }, { k: 'tent', x: 21, y: 21.4, dog: 2, blk: .5 }, { k: 'tent', x: 29, y: 21.4, dog: 3, blk: .5 });
      OB.push({ k: 'cable', x: 10, y: 17.7, v: 3.5, min: 3, max: 35, bell: 2, hc: 0 });
      for (let i = 0; i < 10; i++) PO.push({ x: 6 + i * 3.4 + rnd(-.5, .5), y: 16.6 + Math.random() * 2.6 });
      PK.push({ x: 12, y: 16.5, k: 'n' }, { x: 26, y: 19, k: 'f' }, { x: 34, y: 16.4, k: 'm' });
      msg('Tenderloin! Store owners hose you. Grab the mayor with G', 5);
    },
    upd(dt) {
      if (S.stage === 0) {
        for (const d of S.doors) if (!d.d && Math.abs(P.x - d.x) < 5 && Math.abs(P.y - d.y) < 6) { d.d = 1; for (let i = 0; i < 3; i++) spawnE('ngo', d.x + (i - 1) * .5, d.y - .2 + i * .1, { awake: 1 }); txt('NGO WORKERS POUR OUT!', d.x, '#4af', d.y, 1.1); msg('Hose them! The blue dye washes out (3 = hose)', 3); }
        if (P.x >= 37.8 && P.y < 15 && P.y > 4) {
          S.stage = 1; for (let x = 38; x < 48; x++) setWall(x, 15, 7); S.boss = spawnE('boss', 43, 7, { awake: 1 });
          [[40, 9], [44, 9], [42, 11], [46, 11], [40, 12.5], [45, 13]].forEach(([x, y]) => PO.push({ x, y })); PK.push({ x: 39, y: 13.5, k: 'f' }, { x: 46, y: 13.5, k: 'n' }, { x: 42, y: 13, k: 'm' }, { x: 43, y: 11, k: 'f' });
          if (mayor && mayor.st !== 'carried') { mayor.st = 'follow'; mayor.x = P.x; mayor.y = P.y + 1; } G.ng += 2; G.fg += 2; msg('FINAL BOSS! Throw the wimpy mayor at her (G)!', 5); G.shake = .8;
        }
      }
      if (S.stage === 1 && S.boss.dying > 0 && !S.won) { S.won = 1; E.forEach(e => { if (!e.dead && e.dying <= 0) killE(e); }); later(2.2, complete); msg('THE TOWER FALLS!', 3); }
    } }
];
function reset() {
  Object.assign(P, { hp: 100, jz: 0, jv: 0, w: 0, carry: null, anim: null, pow: 0, slow: 0, cdP: 0, cdK: 0, cdU: 0, cdW: 0, inv: 0, hurt: 0, sprT: 0 });
  Object.assign(G, { pts: 0, unl: [1, 1, 0, 0, 0, 0, 0], ng: 0, fg: 0, poo: 0, water: 100, heat: 0, overheat: 0, ride: false });
}
function loadLevel(i) {
  G.lvl = i; E = []; PR = []; PK = []; PO = []; FI = []; EX = []; TX = []; OB = []; TM = []; SHW = []; PART = []; punchLog = []; mayor = null; S = { stage: 0 }; G.ride = false; P.carry = null; P.pow = 0; G.heat = 0; G.overheat = 0;
  P.hp = Math.min(100, P.hp + 40); const mins = [0, 250, 1400]; if (G.pts < mins[i]) addPts(mins[i] - G.pts);
  LV[i].build(); G.mode = 'card'; G.cardT = 4; for (const k in held) held[k] = false;
}
function startGame() { reset(); loadLevel(0); }
// ---------- rendering ----------
let zc = .5, dirX = 1, dirY = 0, plX = 0, plY = FOV; const zbuf = new Float32Array(RC);
const FW = 320, FH = 135, fcv = C(FW, FH), fctx = fcv.getContext('2d'), fimg = fctx.createImageData(FW, FH);
const FLC = [[[36, 36, 58], [44, 42, 68], [30, 150, 190]], [[196, 218, 224], [208, 228, 232], [24, 170, 150]], [[84, 56, 36], [96, 66, 42], [255, 160, 60]], [[62, 30, 104], [74, 38, 120], [210, 120, 255]]];
let skyG = null; const SK = []; { const r = seeded(11); let h = 40; for (let i = 0; i < 512; i++) { if (i % 6 === 0) h = 25 + r() * 110; SK.push(h); } }
function drawSky() {
  if (!skyG) { skyG = ctx.createLinearGradient(0, 0, 0, HOR); skyG.addColorStop(0, '#0a0420'); skyG.addColorStop(.6, '#3a0f5a'); skyG.addColorStop(1, '#d0307a'); }
  ctx.fillStyle = skyG; ctx.fillRect(0, 0, W, HOR);
  let da = (0 - P.a) % (Math.PI * 2); if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2;
  if (Math.abs(da) < 1.2) { const sx = W / 2 * (1 + Math.tan(da) / FOV); const sg = ctx.createRadialGradient(sx, HOR - 40, 5, sx, HOR - 40, 90); sg.addColorStop(0, '#ffd0f0'); sg.addColorStop(.5, '#ff4ab0'); sg.addColorStop(1, 'rgba(255,40,160,0)'); ctx.fillStyle = sg; ctx.fillRect(sx - 90, HOR - 130, 180, 130); }
  for (let x = 0; x < W; x += 4) { const ang = P.a + Math.atan(((x + 2) / W * 2 - 1) * FOV); let idx = Math.floor(ang / (Math.PI * 2) * 512) % 512; if (idx < 0) idx += 512; const h = SK[idx]; ctx.fillStyle = '#150828'; ctx.fillRect(x, HOR - h, 4, h); if (idx % 6 === 0) { ctx.fillStyle = '#18e0ff'; ctx.fillRect(x, HOR - h, 4, 1); } if (idx % 5 === 1) { ctx.fillStyle = '#ff2bd6'; ctx.fillRect(x + 1, HOR - h * .5, 2, 2); } }
}
function drawFloor() {
  const d = fimg.data, zcc = Math.max(.25, zc);
  for (let r = 0; r < FH; r++) {
    const y = r * 2 + 1, t = zcc * K / y, fa = Math.min(.95, Math.pow(t / 17, 1.3));
    for (let c = 0; c < FW; c++) {
      const cx = (c + .5) / FW * 2 - 1, wx = P.x + (dirX + plX * cx) * t, wy = P.y + (dirY + plY * cx) * t, i = Math.floor(wx), j = Math.floor(wy); let R = 12, Gc = 4, B = 30;
      if (i >= 0 && j >= 0 && i < M.w && j < M.h) { const ft = FLC[M.fl[j * M.w + i]], u = wx - i, v = wy - j; const col = (u < .05 || v < .05) ? ft[2] : ((i + j) & 1 ? ft[1] : ft[0]); R = col[0]; Gc = col[1]; B = col[2]; }
      const o = (r * FW + c) * 4; d[o] = R + (24 - R) * fa; d[o + 1] = Gc + (6 - Gc) * fa; d[o + 2] = B + (44 - B) * fa; d[o + 3] = 255;
    }
  }
  fctx.putImageData(fimg, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(fcv, 0, HOR, W, H - HOR); ctx.imageSmoothingEnabled = true;
}
function drawWalls() {
  for (let col = 0; col < RC; col++) {
    const cx = 2 * col / RC - 1, rdx = dirX + plX * cx, rdy = dirY + plY * cx; let mx = P.x | 0, my = P.y | 0;
    const ddx = Math.abs(1 / (rdx || 1e-9)), ddy = Math.abs(1 / (rdy || 1e-9)); let sx, sy, sdx, sdy;
    if (rdx < 0) { sx = -1; sdx = (P.x - mx) * ddx; } else { sx = 1; sdx = (mx + 1 - P.x) * ddx; } if (rdy < 0) { sy = -1; sdy = (P.y - my) * ddy; } else { sy = 1; sdy = (my + 1 - P.y) * ddy; }
    let side = 0, hit = 0, n = 0;
    while (!hit && n++ < 80) { if (sdx < sdy) { sdx += ddx; mx += sx; side = 0; } else { sdy += ddy; my += sy; side = 1; } if (mx < 0 || my < 0 || mx >= M.w || my >= M.h) { hit = 1; break; } if (M.s[my * M.w + mx]) hit = 1; }
    let perp = side === 0 ? sdx - ddx : sdy - ddy; if (perp < .05) perp = .05; zbuf[col] = perp;
    let wx = side === 0 ? P.y + perp * rdy : P.x + perp * rdx; wx -= Math.floor(wx); const inb = mx >= 0 && my >= 0 && mx < M.w && my < M.h; const t = inb ? M.wt[my * M.w + mx] : 1;
    const lh = K / perp, top = HOR - (1 - zc) * lh; let tx = (wx * 128) | 0; if ((side === 0 && rdx < 0) || (side === 1 && rdy > 0)) tx = 127 - tx;
    ctx.drawImage(TEX[t] || TEX[1], tx, 0, 1, 128, col * CW, top, CW, lh);
    const a = Math.min(.93, Math.pow(perp / 16, 1.2)) + (side ? .16 : 0); ctx.fillStyle = FOGS[Math.min(31, (a * 31) | 0)]; ctx.fillRect(col * CW, top, CW, lh);
  }
}
function proj(x, y) { const dx = x - P.x, dy = y - P.y, id = 1 / (plX * dirY - dirX * plY); return { tx: id * (dirY * dx - dirX * dy), ty: id * (-plY * dx + plX * dy) }; }
const bubbles = [];
function drawItem(it) {
  const { tx, ty } = proj(it.x, it.y); if (ty < .2) return; const sp = it.s, hh = it.h * (it.hs || 1) * K / ty, ww = it.h * sp.w / sp.h * (it.ws || 1) * K / ty, scx = W / 2 * (1 + tx / ty);
  const bot = HOR + (zc - it.z) * K / ty, top = bot - hh, left = scx - ww / 2; if (left > W || left + ww < 0 || hh < 1) return;
  const vi = it.fl ? 4 : Math.min(3, (ty / 4.5) | 0), img = sp.v[vi]; const c0 = Math.max(0, Math.floor(left / CW)), c1 = Math.min(RC - 1, Math.floor((left + ww) / CW)); let rs = -1;
  const flush = (cEnd) => { if (rs < 0) return; const x0 = rs * CW, x1 = (cEnd + 1) * CW; let s0 = (x0 - left) / ww * sp.w, s1 = (x1 - left) / ww * sp.w; if (s0 < 0) s0 = 0; if (s1 > sp.w) s1 = sp.w; if (s1 > s0) ctx.drawImage(img, s0, 0, s1 - s0, sp.h, x0, top, x1 - x0, hh); rs = -1; };
  for (let c = c0; c <= c1; c++) { if (ty < zbuf[c]) { if (rs < 0) rs = c; } else flush(c - 1); } flush(c1);
  if (it.say && ty < 9 && it.sayT > 0) bubbles.push({ s: it.say, x: scx, y: top - 8, c0: Math.min(RC - 1, Math.max(0, (scx / CW) | 0)), ty });
}
function drawSprites() {
  const L = [], add = (o, x, y, z, h, s, extra) => { L.push(Object.assign({ x, y, z, h, s }, extra)); };
  for (const o of OB) {
    if (o.k === 'dye') add(0, o.x, o.y, 0, .12, SP.dye, { ws: 1.3 }); else if (o.k === 'car') add(0, o.x, o.y, 0, .7, o.broken ? SP.car2 : SP.car, { fl: o.flash > 0 });
    else if (o.k === 'stall') add(0, o.x, o.y, 0, .65, SP.stall); else if (o.k === 'tent') add(0, o.x, o.y, 0, .75, SP.tent); else if (o.k === 'cable') add(0, o.x, o.y, 0, 1.2, SP.cable);
    else if (o.k === 'junkie') add(0, o.x, o.y, 0, .75, SP.junkie); else if (o.k === 'jks') add(0, o.x, o.y, 0, .8, SP.scz); else if (o.k === 'gate') add(0, o.x, o.y, 0, 1, SP.gate); else if (o.k === 'exit') add(0, o.x, o.y, 0, 1, SP.exit);
  }
  for (const q of PO) add(0, q.x, q.y, 0, .3, SP.poop); for (const k of PK) add(0, k.x, k.y, .05 + Math.sin(G.t * 4) * .03, .3, SP['pk' + k.k]);
  for (const f of FI) add(0, f.x, f.y, 0, .8 + Math.sin(G.t * 20 + f.x) * .08, SP.fire);
  for (const e of E) { const T = TY[e.t]; add(0, e.x, e.y, e.t === 'dog' ? 0 : 0, T.h, SP[e.spr || T.spr], { hs: e.dying > 0 ? Math.max(.08, e.dying / .4) : 1, fl: e.flash > 0 || e.burn > 0 && ((G.t * 8) | 0) % 2, say: e.say, sayT: e.sayT }); }
  if (mayor && mayor.st !== 'carried' && mayor.st !== 'thrown') add(0, mayor.x, mayor.y, 0, .8, SP.mayor, { say: mayor.say, sayT: mayor.sayT, hs: mayor.st === 'down' ? .5 : 1 });
  for (const p of PR) {
    const k = p.kind; if (k === 'needle') add(0, p.x, p.y, p.z, .2, SP.needle); else if (k === 'ballot') add(0, p.x, p.y, p.z, .28, SP.ballot); else if (k === 'cig') add(0, p.x, p.y, p.z, .12, SP.cig); else if (k === 'bag') add(0, p.x, p.y, p.z, .4, SP.bag);
    else if (k === 'orb') add(0, p.x, p.y, p.z, .5, SP.orb); else if (k === 'ngren') add(0, p.x, p.y, p.z, .22, SP.ngren); else if (k === 'fgren') add(0, p.x, p.y, p.z, .24, SP.fgren); else if (k === 'poop') add(0, p.x, p.y, p.z, .4, SP.poopf);
    else if (k === 'water') add(0, p.x, p.y, p.z, .22, SP.expl3); else if (k === 'mayor' || k === 'body') add(0, p.x, p.y, p.z, .7, SP[p.spr]);
  }
  for (const x of EX) { const pr = 1 - x.life / x.max; add(0, x.x, x.y, .3, x.r * 1.1 * (.3 + pr * .7), x.kind === 'f' ? SP.expl2 : x.kind === 'n' ? SP.expl3 : SP.expl, { ws: 1 }); }
  for (const it of L) it.d = proj(it.x, it.y).ty; L.sort((a, b) => b.d - a.d); bubbles.length = 0; for (const it of L) drawItem(it);
  ctx.font = 'bold 15px monospace'; ctx.textAlign = 'center'; ctx.lineWidth = 4;
  for (const b of bubbles) { if (b.ty > zbuf[b.c0] + .5) continue; ctx.strokeStyle = '#000'; ctx.fillStyle = '#fff'; ctx.strokeText(b.s, b.x, b.y); ctx.fillText(b.s, b.x, b.y); }
  ctx.font = 'bold 18px monospace'; for (const t of TX) { const { tx, ty } = proj(t.x, t.y); if (ty < .3) continue; const sx = W / 2 * (1 + tx / ty), sy = HOR + (zc - t.z) * K / ty; ctx.globalAlpha = Math.min(1, t.life * 2); ctx.strokeStyle = '#000'; ctx.fillStyle = t.col; ctx.strokeText(t.s, sx, sy); ctx.fillText(t.s, sx, sy); } ctx.globalAlpha = 1;
}
// ---- viewmodel ----
function fist(x, y, s, flip) {
  const g = ctx; g.save(); g.translate(x, y); g.scale(s * (flip ? -1 : 1), s);
  pg(g, '#2a6ad8', -46, 260, -34, 40, 34, 40, 46, 260); pg(g, '#1d4fa8', 14, 260, 22, 60, 34, 40, 46, 260);
  rc(g, -36, 20, 72, 22, '#fff'); for (let i = -3; i <= 3; i++) ci(g, i * 11, 42, 7, '#fff'); g.strokeStyle = '#9ac'; g.lineWidth = 2; g.strokeRect(-36, 20, 72, 22);
  el(g, 0, -4, 36, 32, '#fafafe'); g.strokeStyle = '#b8c4d8'; g.lineWidth = 2; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 12 + 2, -28); g.lineTo(i * 12 + 2, -12); g.stroke(); } el(g, -28, 8, 12, 18, '#f0f0f8', .5); el(g, 0, 8, 30, 10, '#e4e8f4');
  g.restore();
}
function drawViewmodel() {
  const g = ctx, w = P.w, bx = Math.sin(P.bob * .5) * 10, by = Math.abs(Math.cos(P.bob * .5)) * 8 + P.jz * 30, an = P.anim, pr = an ? an.t0 / an.d : 0;
  g.save(); if (P.hurt > 0) g.translate(rnd(-4, 4), rnd(-4, 4));
  // apron / dress strip
  pg(g, '#2a6ad8', 0, H, 0, H - 40, W, H - 40, W, H); pg(g, '#fff', W * .38, H, W * .4, H - 46, W * .6, H - 46, W * .62, H); for (let i = 0; i < 8; i++)ci(g, W * .4 + i * (W * .2 / 7), H - 44, 6, '#fff');
  if (P.carry) { const sp = SP[P.carry.spr].v[0]; g.drawImage(sp, W / 2 - 110, H - 400 + Math.sin(G.t * 12) * 6, 220, 330); }
  if (G.ride) {
    rc(g, W * .2, H - 90 - by * .3, W * .6, 10, '#222'); rc(g, W * .2, H - 84 - by * .3, W * .6, 3, '#0ff'); rc(g, W * .48, H - 90, 18, 90, '#333'); fist(W * .22, H - 130, .8, 0); fist(W * .78, H - 130, .8, 1);
    if (an && an.t === 'punch') { const e = Math.sin(pr * Math.PI); fist(an.h ? W * .78 - e * 200 : W * .22 + e * 200, H - 130 - e * 120, .8 + e * .6, an.h); }
    if (an && an.t === 'kick') { const e = Math.sin(pr * Math.PI); legDraw(e); }
    g.restore(); return;
  }
  let lx = W * .3 + bx * .6, ly = H * .72 + by, rx = W * .7 - bx * .6, ry = H * .72 + by, ls = 1.5, rs = 1.5;
  if (an && an.t === 'punch') { const e = Math.sin(pr * Math.PI); if (an.h) { rx += (W / 2 - rx) * e * .7; ry -= 150 * e; rs += e * .9; } else { lx += (W / 2 - lx) * e * .7; ly -= 150 * e; ls += e * .9; } }
  if (an && an.t === 'power') {
    if (pr < .88) { const e = Math.abs(Math.sin(pr * Math.PI * 4)), h = Math.floor(pr * 4) % 2; if (h) { rx += (W / 2 - rx) * e * .7; ry -= 150 * e; rs += e * .9; } else { lx += (W / 2 - lx) * e * .7; ly -= 150 * e; ls += e * .9; } }
    else { const e = Math.sin((pr - .88) / .12 * Math.PI); lx = W * .42; rx = W * .58; ly = ry = H * .72 - e * 200; ls = rs = 1.6 + e * 1.4; glow(g, W / 2, H / 2, 300, 'rgba(255,60,220,' + (.6 * e).toFixed(2) + ')'); }
  }
  if (an && an.t === 'kick') { legDraw(Math.sin(pr * Math.PI)); }
  const right = () => fist(rx, ry, rs, 1);
  fist(lx, ly, ls, 0);
  const t = G.t;
  if (w === 0 || P.carry) right();
  else if (w === 1) { g.save(); g.translate(rx, ry); rc(g, -20, -110, 44, 130, '#18c8c8'); rc(g, -20, -110, 44, 20, '#0a8a8a'); rc(g, -8, -140, 16, 32, '#ddd'); rc(g, -18, -60, 40, 36, '#fff'); g.fillStyle = '#0a8a8a'; g.font = 'bold 9px monospace'; g.textAlign = 'center'; g.fillText('NARCAN', 2, -38); g.restore(); right(); }
  else if (w === 2) { g.save(); g.translate(rx, ry); rc(g, -16, -120, 36, 110, '#2a9d4a'); rc(g, -10, -170, 24, 56, '#bbb'); rc(g, -6, -176, 16, 10, '#666'); g.strokeStyle = '#2a9d4a'; g.lineWidth = 14; g.beginPath(); g.moveTo(10, 40); g.bezierCurveTo(120, 60, 160, 160, 260, 200); g.stroke(); g.restore(); right(); }
  else if (w === 3 || w === 5) { const gy = an && an.t === 'throw' ? -Math.sin(pr * Math.PI) * 160 : 0; g.save(); g.translate(rx - 10, ry - 90 + gy); ci(g, 0, 0, 34, w === 3 ? '#18c8c8' : '#b020ff'); rc(g, -10, -48, 20, 18, '#888'); ci(g, 0, 0, 14, '#fff'); if (w === 5) glow(g, 0, 0, 60, 'rgba(255,0,220,.4)'); g.restore(); right(); }
  else if (w === 4) { g.save(); g.translate(rx, ry); rc(g, -10, -170, 20, 190, '#6a4a2a'); const f = 1 + Math.sin(t * 25) * .12; glow(g, 0, -220, 120 * f, 'rgba(255,160,0,.6)'); pg(g, '#ff5a00', -26, -170, -10, -240 * f, 0, -290 * f, 14, -230 * f, 26, -170); pg(g, '#ffd000', -14, -172, 0, -250 * f, 14, -172); g.restore(); right(); }
  else if (w === 6) { const gy = an && an.t === 'throw' ? -Math.sin(pr * Math.PI) * 160 : 0; g.save(); g.translate(rx - 10, ry - 90 + gy); glow(g, 0, -30, 90, 'rgba(255,150,0,.5)'); el(g, 0, 12, 44, 14, '#4a2a12'); el(g, 0, -4, 32, 13, '#5a3416'); el(g, 0, -18, 20, 11, '#6a4020'); pg(g, '#ff7a00', -22, -20, 0, -90 - Math.sin(t * 20) * 10, 22, -20); pg(g, '#ffe000', -10, -20, 0, -60, 10, -20); g.restore(); right(); }
  g.restore();
}
function legDraw(e) {
  const g = ctx; g.save(); g.translate(W * .64, H + 40); g.rotate(-.5 - e * .15); g.translate(0, -e * 520);
  for (let i = 0; i < 10; i++) rc(g, -34, -i * 26, 68, 26, i % 2 ? '#fff' : '#111'); rc(g, -38, -280, 76, 40, '#fff'); el(g, 0, -300, 50, 34, '#1a1a2a'); rc(g, -30, -320, 60, 10, '#ff2bd6'); g.restore();
}
function drawParts(dt) {
  if (P.sprT > 0 && !G.ride || (P.sprT > 0)) for (let i = 0; i < 4; i++) { const k = P.spr; PART.push({ x: W * .7 + rnd(-10, 10), y: H * .55, vx: rnd(-260, 80) * (k === 'torch' ? .3 : 1) - (W * .7 - W / 2) * .6 * (k === 'torch' ? 0 : 1), vy: rnd(-420, -250) * (k === 'torch' ? .5 : 1), life: rnd(.35, .6), c: k === 'narc' ? '#d8ffff' : k === 'hose' ? '#4aaaff' : '#ffa000', r: k === 'hose' ? rnd(3, 7) : rnd(2, 5) }); }
  for (const p of PART) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 200 * dt; ctx.globalAlpha = Math.max(0, p.life * 2); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; PART = PART.filter(p => p.life > 0); if (PART.length > 300) PART.splice(0, 100);
}
// ---- hud ----
const mm = C(150, 100), mmc = mm.getContext('2d');
function drawMinimap() {
  const g = mmc, sc = 5, cx = P.x, cy = P.y; g.clearRect(0, 0, 150, 100); g.fillStyle = 'rgba(8,0,24,.7)'; g.fillRect(0, 0, 150, 100);
  for (let j = -10; j <= 10; j++)for (let i = -15; i <= 15; i++) { const mx = Math.floor(cx) + i, my = Math.floor(cy) + j; if (mx < 0 || my < 0 || mx >= M.w || my >= M.h) continue; const px = 75 + (mx - cx) * sc, py = 50 + (my - cy) * sc; g.fillStyle = M.s[my * M.w + mx] ? '#3a2a6a' : '#16103a'; g.fillRect(px, py, sc, sc); }
  const dot = (x, y, c, r) => { const px = 75 + (x - cx) * sc, py = 50 + (y - cy) * sc; if (px < 0 || py < 0 || px > 150 || py > 100) return; g.fillStyle = c; g.fillRect(px - r, py - r, r * 2, r * 2); };
  for (const o of OB) if (o.k === 'gate' || o.k === 'exit') dot(o.x, o.y, '#ff0', 3); else if (o.k === 'junkie') dot(o.x, o.y, '#0f8', 2);
  for (const e of E) if (!e.dead) dot(e.x, e.y, isBoss(e) ? '#f0f' : '#f33', isBoss(e) ? 3 : 1.5); if (mayor) dot(mayor.x, mayor.y, '#6cf', 2); for (const q of PO) dot(q.x, q.y, '#a63', 1);
  g.save(); g.translate(75, 50); g.rotate(P.a); g.fillStyle = '#0ff'; g.beginPath(); g.moveTo(6, 0); g.lineTo(-4, -4); g.lineTo(-4, 4); g.fill(); g.restore(); g.strokeStyle = '#0ff'; g.strokeRect(.5, .5, 149, 99);
}
function bar(x, y, w, h, f, c, bg) { ctx.fillStyle = bg || 'rgba(0,0,0,.6)'; ctx.fillRect(x, y, w, h); ctx.fillStyle = c; ctx.fillRect(x, y, w * clamp(f, 0, 1), h); ctx.strokeStyle = '#fff6'; ctx.strokeRect(x + .5, y + .5, w, h); }
function drawHUD() {
  const g = ctx; // portrait
  g.fillStyle = 'rgba(8,0,24,.7)'; g.fillRect(10, 10, 68, 68); g.strokeStyle = '#18e0ff'; g.lineWidth = 2; g.strokeRect(10, 10, 68, 68);
  ci(g, 44, 46, 26, '#1a1020'); el(g, 44, 50, 17, 20, '#f3d2b8'); el(g, 44, 34, 20, 12, '#120a18'); rc(g, 24, 34, 8, 30, '#120a18'); rc(g, 56, 34, 8, 30, '#120a18'); ci(g, 38, 50, 2, '#111'); ci(g, 50, 50, 2, '#111'); rc(g, 40, 60, 8, 2, '#c44');
  pg(g, '#3a8aff', 44, 24, 32, 16, 32, 28); pg(g, '#3a8aff', 44, 24, 56, 16, 56, 28); ci(g, 44, 24, 4, '#6ab0ff');
  g.font = 'bold 11px monospace'; g.textAlign = 'left'; g.fillStyle = '#fff'; g.fillText('HP', 88, 21); bar(106, 12, 170, 12, P.hp / 100, P.hp > 35 ? '#27e07a' : '#f33');
  g.fillStyle = '#fff'; g.fillText('HEAT', 88, 39); bar(124, 30, 152, 10, G.heat / 100, G.heat > 70 ? '#f33' : '#fa0'); if (G.overheat) { g.fillStyle = '#f33'; g.fillText('OVERHEAT!', 282, 39); }
  if (G.unl[2]) { g.fillStyle = '#4af'; g.fillText('H2O', 88, 53); bar(124, 46, 152, 6, G.water / 100, '#4af'); }
  g.font = 'bold 20px monospace'; g.fillStyle = '#ff0'; g.fillText('PTS ' + G.pts, 88, 76);
  g.font = 'bold 12px monospace'; g.fillStyle = P.cdW <= 0 ? '#ff2bd6' : '#888'; g.fillText(P.cdW <= 0 ? 'POWER READY (U)' : 'POWER ' + Math.ceil(P.cdW) + 's', 88, 93);
  drawMinimap(); g.drawImage(mm, W - 160, 10);
  g.textAlign = 'center'; g.font = 'bold 14px monospace'; g.fillStyle = '#18e0ff'; g.strokeStyle = '#000'; g.lineWidth = 3; const ob = LV[G.lvl].obj(); g.strokeText(ob, W / 2, 24); g.fillText(ob, W / 2, 24);
  const bs = E.find(e => isBoss(e) && !e.dead); if (bs) { const bw = 340; bar(W / 2 - bw / 2, 34, bw, 12, bs.hp / bs.maxhp, '#b020ff'); g.font = 'bold 11px monospace'; g.fillStyle = '#fff'; g.fillText(bs.t === 'boss' ? 'NGO TOWER BOSS' : 'NGO UNDERBOSS', W / 2, 58); }
  if (G.ride) { g.fillStyle = '#ff0'; g.fillText('SPEED ' + (G.rideV * 10 | 0), W / 2, 76); }
  if (MSG.t > 0) { g.font = 'bold 18px monospace'; g.strokeStyle = '#000'; g.lineWidth = 4; g.fillStyle = '#fff'; g.strokeText(MSG.s, W / 2, 106); g.fillText(MSG.s, W / 2, 106); }
  g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.moveTo(W / 2 - 8, HOR); g.lineTo(W / 2 + 8, HOR); g.moveTo(W / 2, HOR - 8); g.lineTo(W / 2, HOR + 8); g.stroke();
}
function overlay() {
  if (P.hurt > 0) { const q = ctx.createRadialGradient(W / 2, H / 2, 150, W / 2, H / 2, 600); q.addColorStop(0, 'rgba(255,0,0,0)'); q.addColorStop(1, 'rgba(255,0,0,' + Math.min(.7, P.hurt * 2) + ')'); ctx.fillStyle = q; ctx.fillRect(0, 0, W, H); }
  if (G.heat > 60) { const q = ctx.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 600); q.addColorStop(0, 'rgba(255,120,0,0)'); q.addColorStop(1, 'rgba(255,120,0,' + ((G.heat - 60) / 100) + ')'); ctx.fillStyle = q; ctx.fillRect(0, 0, W, H); }
  for (const s of SHW) { const p = s.t / .7; ctx.strokeStyle = 'rgba(255,80,230,' + (1 - p) + ')'; ctx.lineWidth = 30 * (1 - p) + 4; ctx.beginPath(); ctx.ellipse(W / 2, HOR + 60, 80 + p * 700, 30 + p * 260, 0, 0, 7); ctx.stroke(); }
  if (G.flash > 0) { ctx.fillStyle = 'rgba(255,200,255,' + G.flash * .6 + ')'; ctx.fillRect(0, 0, W, H); }
}
function banner(t, sub, col) { ctx.fillStyle = 'rgba(5,0,15,.72)'; ctx.fillRect(0, 0, W, H); ctx.textAlign = 'center'; ctx.shadowColor = col; ctx.shadowBlur = 24; ctx.fillStyle = col; ctx.font = 'bold 64px monospace'; ctx.fillText(t, W / 2, 230); ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.font = '20px monospace'; sub.split('\n').forEach((l, i) => ctx.fillText(l, W / 2, 285 + i * 28)); }
function drawTitle() {
  const g = ctx; drawSkyOnly(); g.fillStyle = 'rgba(5,0,15,.55)'; g.fillRect(0, 0, W, H); g.textAlign = 'center'; g.shadowColor = '#ff2bd6'; g.shadowBlur = 30; g.fillStyle = '#ff2bd6'; g.font = 'bold 84px monospace'; g.fillText('SAN FENTANYL', W / 2, 150); g.shadowColor = '#18e0ff'; g.fillStyle = '#18e0ff'; g.font = 'bold 30px monospace'; g.fillText('FIRST-PERSON EDITION', W / 2, 195); g.shadowBlur = 0;
  g.fillStyle = '#fff'; g.font = '14px monospace'; ['Alice (with black hair) vs. the streets of SoMa, the Mission and the Tenderloin.', TOUCH ? 'Left thumb: move   Drag right side: look   Buttons: J punch  K kick  L Narcan  E weapon  G grab  U POWER' : 'WASD move   Mouse look (click to lock)   Space jump   J/click punch   K kick   L Narcan', TOUCH ? '' : 'E/right-click use weapon   G grab / throw (grab the mayor!)   U POWER combo   1-7 weapons   Q cycle', 'Points unlock the HOSE, Narcan grenades, fentanyl TORCH and fentanyl grenades. Don\'t hit tech bros.'].forEach((l, i) => g.fillText(l, W / 2, 262 + i * 26));
  g.fillStyle = ((G.t * 2) | 0) % 2 ? '#ff0' : '#fa0'; g.font = 'bold 26px monospace'; g.fillText(TOUCH ? 'TAP TO START' : 'CLICK OR PRESS ENTER TO START', W / 2, 440);
}
function drawSkyOnly() { const q = ctx.createLinearGradient(0, 0, 0, H); q.addColorStop(0, '#0a0420'); q.addColorStop(.55, '#5a1470'); q.addColorStop(.62, '#d0307a'); q.addColorStop(.63, '#120622'); q.addColorStop(1, '#05020c'); ctx.fillStyle = q; ctx.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 24) { const h = 30 + ((x * 37) % 97) * 1.6; ctx.fillStyle = '#150828'; ctx.fillRect(x, H * .62 - h, 22, h); ctx.fillStyle = (x / 24) % 2 ? '#18e0ff' : '#ff2bd6'; ctx.fillRect(x + 4, H * .62 - h + 6, 4, 3); } ctx.strokeStyle = '#ff2bd655'; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + (i - 6) * 20, H * .63); ctx.lineTo(W / 2 + (i - 6) * 160, H); ctx.stroke(); } }
function render() {
  if (G.mode === 'title') return drawTitle();
  const sh = G.shake * 5; ctx.save(); if (sh > .1) ctx.translate(rnd(-sh, sh), rnd(-sh, sh));
  zc = .5 + P.jz + Math.sin(P.bob) * .012; dirX = Math.cos(P.a); dirY = Math.sin(P.a); plX = -dirY * FOV; plY = dirX * FOV;
  drawSky(); drawFloor(); drawWalls(); drawSprites(); ctx.restore(); drawViewmodel(); drawParts(.016); overlay(); drawHUD();
  if (G.mode === 'card') { ctx.fillStyle = 'rgba(5,0,15,.82)'; ctx.fillRect(0, 0, W, H); ctx.textAlign = 'center'; ctx.shadowColor = '#18e0ff'; ctx.shadowBlur = 20; ctx.fillStyle = '#18e0ff'; ctx.font = 'bold 28px monospace'; ctx.fillText('DISTRICT ' + (G.lvl + 1) + ' / 3', W / 2, 190); ctx.fillStyle = '#ff2bd6'; ctx.shadowColor = '#ff2bd6'; ctx.font = 'bold 66px monospace'; ctx.fillText(LV[G.lvl].name, W / 2, 262); ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.font = '17px monospace'; wrap(LV[G.lvl].sub, 70).forEach((l, i) => ctx.fillText(l, W / 2, 310 + i * 24)); ctx.fillStyle = '#ff0'; ctx.fillText(TOUCH ? 'tap to begin' : 'press Enter or click to begin', W / 2, 420); }
  if (G.mode === 'dead') banner('YOU GOT FENTED OUT', 'Points: ' + G.pts + '\n' + (TOUCH ? 'Tap' : 'Press Enter or click') + ' to retry from the title', '#f33');
  if (G.mode === 'win') banner('SAN FENTANYL SAVED', 'The NGO tower falls and the mayor survives (barely).\nFinal points: ' + G.pts + '\n' + (TOUCH ? 'Tap' : 'Press Enter or click') + ' to play again', '#0f8');
}
function wrap(s, n) { const out = []; let l = ''; for (const w of s.split(' ')) { if ((l + ' ' + w).length > n) { out.push(l); l = w; } else l = l ? l + ' ' + w : w; } out.push(l); return out; }
// ---------- DOM controls ----------
const tc = document.getElementById('tc'), ws = document.getElementById('ws'); let wsKey = '';
const ACT = [['J', 'J'], ['K', 'K'], ['L', 'L'], ['E', 'E'], ['G', 'G'], ['JUMP', '\u2191'], ['U', 'POWER']];
function press(a, down) {
  if (down) { if (G.mode === 'play') pressQ.push(a); if (a === 'E' || a === 'L') held[a] = true; } else if (a === 'E' || a === 'L') held[a] = false;
}
if (TOUCH) {
  tc.style.display = 'flex'; document.body.classList.add('touch');
  const stick = document.createElement('div'); stick.id = 'stick'; const knob = document.createElement('i'); stick.appendChild(knob); tc.appendChild(stick);
  const act = document.createElement('div'); act.id = 'act'; tc.appendChild(act);
  for (const [a, label] of ACT) { const b = document.createElement('button'); b.textContent = label; b.dataset.a = a; if (a === 'U') b.className = 'pw'; act.appendChild(b);
    b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); b.classList.add('on'); press(a, true); }); const up = e => { b.classList.remove('on'); press(a, false); }; b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); }
  let sid = null; const sr = () => stick.getBoundingClientRect();
  const sm = e => { const r = sr(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; let dx = (e.clientX - cx) / (r.width / 2), dy = (e.clientY - cy) / (r.height / 2); const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; } mv.x = Math.abs(dx) < .15 ? 0 : dx; mv.y = Math.abs(dy) < .15 ? 0 : dy; knob.style.transform = 'translate(' + dx * r.width * .3 + 'px,' + dy * r.height * .3 + 'px)'; };
  stick.addEventListener('pointerdown', e => { e.preventDefault(); sid = e.pointerId; stick.setPointerCapture(sid); sm(e); });
  stick.addEventListener('pointermove', e => { if (e.pointerId === sid) sm(e); });
  const su = e => { if (e.pointerId === sid) { sid = null; mv.x = mv.y = 0; knob.style.transform = ''; } }; stick.addEventListener('pointerup', su); stick.addEventListener('pointercancel', su);
}
function buildWS() { for (let i = 0; i < 7; i++) { const b = document.createElement('button'); b.dataset.w = i; b.addEventListener('pointerdown', e => { e.preventDefault(); if (G.mode === 'play' && G.unl[i]) P.w = i; }); ws.appendChild(b); } }
function updWS() {
  const k = P.w + '|' + G.unl.join('') + '|' + G.ng + '|' + G.fg + '|' + G.poo + '|' + G.mode; if (k === wsKey) return; wsKey = k; const bs = ws.children;
  const lab = ['FIST', 'NARC', 'HOSE', 'N-GR', 'TORCH', 'F-GR', 'POOP'], am = [null, null, null, G.ng, null, G.fg, G.poo];
  for (let i = 0; i < 7; i++) { bs[i].innerHTML = (i + 1) + '<small>' + (G.unl[i] ? lab[i] + (am[i] !== null ? ' ' + am[i] : '') : 'LOCK') + '</small>'; bs[i].className = (P.w === i ? 'sel ' : '') + (G.unl[i] ? '' : 'lock'); }
  ws.style.display = G.mode === 'title' ? 'none' : 'flex';
}
// ---------- events ----------
function begin() { if (G.mode === 'title') startGame(); else if (G.mode === 'card') G.mode = 'play'; else if (G.mode === 'dead' && G.over > .6) { G.mode = 'title'; } else if (G.mode === 'win' && G.over > .8) G.mode = 'title'; }
addEventListener('keydown', e => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (e.repeat) { if (k === ' ' || k.startsWith('Arrow')) e.preventDefault(); return; }
  keys[k] = true; if (k === ' ' || k.startsWith('Arrow') || k === 'Tab') e.preventDefault();
  if (k === 'Enter' || (k === ' ' && G.mode !== 'play')) { begin(); return; }
  const m = { j: 'J', k: 'K', l: 'L', e: 'E', g: 'G', ' ': 'JUMP', u: 'U', q: 'Q' }[k]; if (m) press(m, true); if (k >= '1' && k <= '7' && G.mode === 'play') pressQ.push('W' + (k - 1));
});
addEventListener('keyup', e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; keys[k] = false; if (k === 'l') press('L', false); if (k === 'e') press('E', false); });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; held.E = held.L = false; });
const locked = () => document.pointerLockElement === cv;
cv.addEventListener('pointerdown', e => {
  if (G.mode !== 'play') { begin(); return; }
  if (e.pointerType === 'touch') { if (e.clientX > innerWidth * .3) { cv._look = e.pointerId; cv._lx = e.clientX; cv.setPointerCapture(e.pointerId); } return; }
  if (!locked() && cv.requestPointerLock) { cv.requestPointerLock(); return; }
  if (e.button === 2) press('E', true); else press('J', true);
});
cv.addEventListener('pointermove', e => { if (e.pointerType === 'touch') { if (cv._look === e.pointerId) { look += (e.clientX - cv._lx) * .008; cv._lx = e.clientX; } } else if (locked()) look += (e.movementX || 0) * .0025; });
const cu = e => { if (e.pointerType === 'touch') { if (cv._look === e.pointerId) cv._look = null; } else if (e.button === 2) press('E', false); };
cv.addEventListener('pointerup', cu); cv.addEventListener('pointercancel', cu); cv.addEventListener('contextmenu', e => e.preventDefault());
addEventListener('wheel', e => { if (G.mode === 'play') pressQ.push('Q'); }, { passive: true });
// ---------- loop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000 || .016); last = now; G.t0 = (G.t0 || 0) + dt;
  try {
    if (G.mode === 'play') updateGame(dt); else if (G.mode === 'card') { G.cardT -= dt; if (G.cardT <= 0) G.mode = 'play'; G.t += dt; } else { G.over += dt; G.t += dt; }
    if (G.mode === 'title') G.t += 0;
    if (M || G.mode === 'title') render(); updWS();
  } catch (err) { console.error(err); window.__err = (window.__err || '') + err.stack + '\n'; }
  requestAnimationFrame(frame);
}
buildSprites(); buildTextures(); buildWS(); P.w = 0;
window.__sf = { G, P, get E() { return E; }, get S() { return S; }, get PR() { return PR; }, loadLevel, startGame, LV, press, keys, held, pressQ, spawnE, get M() { return M; }, get mayor() { return mayor; }, addPts, hurtE, killE };
requestAnimationFrame(frame);
})();
