const $ = id => document.getElementById(id);
const rnd = (a, b) => a + Math.random() * (b - a), ri = (a, b) => Math.floor(rnd(a, b + 1));
const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t, TAU = Math.PI * 2;
const hash = (x, y) => { let n = Math.imul(x, 374761393) + Math.imul(y, 668265263); n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967295; };
function vn(x, y, s, k) { const xi = Math.floor(x / s), yi = Math.floor(y / s), fx = x / s - xi, fy = y / s - yi, a = hash(xi + k, yi), b = hash(xi + 1 + k, yi), c = hash(xi + k, yi + 1), d = hash(xi + 1 + k, yi + 1), ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy); return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy; }

/* ================= IL MONDO: la bassa vera intorno a Pomponesco =================
   Terreno liscio (una quota per ogni metro), fiume, argini, strade e paesi con case in cui si entra.
   1 unità = circa 60 m reali in pianta; le case sono a misura d'uomo. */
const WX = 512, WZ = 512, WL = 0, TG = 1.6, DAY = 900, STACK = 64, SG = 64, TILE = 64;
const LON0 = 10.38, LON1 = 10.77, LAT1 = 45.13, LAT0 = 44.855;
const TOWNS = [['Pomponesco', 44.928, 10.596, 17], ['Viadana', 44.928, 10.521, 22], ['Dosolo', 44.953, 10.633, 14], ['Guastalla', 44.921, 10.654, 22], ['Boretto', 44.905, 10.553, 14], ['Brescello', 44.899, 10.515, 14],
  ['Gualtieri', 44.901, 10.630, 14], ['Luzzara', 44.960, 10.688, 15], ['Sabbioneta', 44.999, 10.489, 19], ['Casalmaggiore', 44.986, 10.416, 20], ['Suzzara', 44.992, 10.745, 20], ['Commessaggio', 45.037, 10.545, 11],
  ['Gazzuolo', 45.068, 10.582, 12], ['Bozzolo', 45.103, 10.480, 13], ['Rivarolo Mantovano', 45.070, 10.430, 11], ['Marcaria', 45.120, 10.530, 11], ['Mezzani', 44.920, 10.440, 10]]
  .map(([n, lat, lon, r], i) => ({ n, i, r, x:Math.round((lon - LON0) / (LON1 - LON0) * WX) + (n === 'Guastalla' ? 8 : 0), z:Math.round((LAT1 - lat) / (LAT1 - LAT0) * WZ) + (n === 'Pomponesco' ? -8 : n === 'Boretto' ? 9 : 0) }));
const TW = n => TOWNS.find(t => t.n === n);
const PO = [[0, 260], [52, 294], [118, 354], [157, 406], [203, 412], [249, 406], [289, 395], [328, 395], [348, 372], [368, 335], [407, 289], [446, 236], [512, 164]];
const LINKS = [[0, 1], [0, 2], [2, 3, 5], [1, 4, 4], [4, 5], [4, 6], [6, 3], [3, 7], [7, 10], [1, 8], [8, 9], [8, 11], [11, 12], [9, 14], [14, 13], [12, 15], [5, 16]]; // strade; il terzo numero è un ponte crollato
const HT = new Float32Array((WX + 1) * (WZ + 1)), GT = new Uint8Array(WX * WZ), RD = new Float32Array(WX * WZ);
const G_GRASS = 0, G_FIELD = 1, G_SAND = 2, G_ROAD = 3, G_COB = 4, G_WOOD = 5;
const ci = v => clamp(Math.floor(v), 0, WX - 1), gt = (x, z) => GT[ci(z) * WX + ci(x)], rdAt = (x, z) => RD[ci(z) * WX + ci(x)];
function hAt(x, z) { x = clamp(x, 0, WX - .001); z = clamp(z, 0, WZ - .001); const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi, i = zi * (WX + 1) + xi; return (HT[i] * (1 - fx) + HT[i + 1] * fx) * (1 - fz) + (HT[i + WX + 1] * (1 - fx) + HT[i + WX + 2] * fx) * fz; }
function riverD(x, z) { let m = 1e9; for (let i = 0; i < PO.length - 1; i++) { const ax = PO[i][0], az = PO[i][1], vx = PO[i + 1][0] - ax, vz = PO[i + 1][1] - az, t = clamp(((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz), 0, 1), d = Math.hypot(x - ax - vx * t, z - az - vz * t); if (d < m) m = d; } return m; }

// ---- ostacoli: scatole allineate agli assi, in una griglia per trovarle in fretta
const CELL = 8, cgrid = new Map(); let qid = 0;
function colCells(b, fn) { for (let cz = Math.floor(b.z0 / CELL); cz <= Math.floor(b.z1 / CELL); cz++) for (let cx = Math.floor(b.x0 / CELL); cx <= Math.floor(b.x1 / CELL); cx++) fn(cx * 4096 + cz); }
function addCol(b) { colCells(b, k => { let a = cgrid.get(k); if (!a) cgrid.set(k, a = []); a.push(b); }); return b; }
function delCol(b) { colCells(b, k => { const a = cgrid.get(k); if (a) { const i = a.indexOf(b); if (i >= 0) a.splice(i, 1); } }); }
function nearCols(x, z, r, fn) { qid++; for (let cz = Math.floor((z - r) / CELL); cz <= Math.floor((z + r) / CELL); cz++) for (let cx = Math.floor((x - r) / CELL); cx <= Math.floor((x + r) / CELL); cx++) { const a = cgrid.get(cx * 4096 + cz); if (a) for (const b of a) if (b.q !== qid) { b.q = qid; fn(b); } } }
const box = (x0, y0, z0, x1, y1, z1, o) => addCol(Object.assign({ x0, y0, z0, x1, y1, z1 }, o));

// ---- paesi: ogni casa ha quattro muri con una porta, un tetto a falde e dentro ci si cammina
const ROCCA = { x:0, z:0 }, START = [0, 0], CONS = { x:0, z:0 }, WALLC = ['#d9c08a', '#e2cfa6', '#c98f6a', '#d8a9a0', '#cfc7b4', '#b9a27c', '#e6dcc2'];
let props = [], bridges = [], startY = TG;
function house(t, x0, z0, w, d, H, side, ci2, kind) { const y0 = TG, T = .3, dw = 1.5, mx = x0 + w / 2, mz = z0 + d / 2, o = { town:t.i }, wall = (ax0, az0, ax1, az1, a0, a1) => { t.walls.push([ax0, a0, az0, ax1, a1, az1, ci2]); box(ax0, a0, az0, ax1, a1, az1, o); };
  const full = (s) => { if (s === 0) wall(x0, z0 + d - T, x0 + w, z0 + d, y0, y0 + H); else if (s === 1) wall(x0, z0, x0 + w, z0 + T, y0, y0 + H); else if (s === 2) wall(x0, z0, x0 + T, z0 + d, y0, y0 + H); else wall(x0 + w - T, z0, x0 + w, z0 + d, y0, y0 + H); };
  for (let s = 0; s < 4; s++) { if (s !== side) { full(s); continue; } // il lato con la porta: due pezzi e l'architrave
    if (s < 2) { const z = s === 0 ? z0 + d - T : z0; wall(x0, z, mx - dw / 2, z + T, y0, y0 + H); wall(mx + dw / 2, z, x0 + w, z + T, y0, y0 + H); wall(mx - dw / 2, z, mx + dw / 2, z + T, y0 + 2.3, y0 + H); t.doors.push([mx, y0, z + T / 2, 0]); }
    else { const x = s === 2 ? x0 : x0 + w - T; wall(x, z0, x + T, mz - dw / 2, y0, y0 + H); wall(x, mz + dw / 2, x + T, z0 + d, y0, y0 + H); wall(x, mz - dw / 2, x + T, mz + dw / 2, y0 + 2.3, y0 + H); t.doors.push([x + T / 2, y0, mz, 1]); } }
  t.roofs.push([x0 - .35, z0 - .35, w + .7, d + .7, y0 + H, kind === 'church' ? 2.6 : 1.5, w > d ? 0 : 1, kind]); t.houses.push({ x0, z0, w, d, H, side, kind });
  for (let i = 0; i < (kind === 'church' ? 3 : 1); i++) t.spots.push([x0 + 1 + hash(x0 + i, z0) * (w - 2), z0 + 1 + hash(x0, z0 + i + 3) * (d - 2)]); }
function genTown(t) { const cx = t.x, cz = t.z, r = t.r, walled = t.n === 'Sabbioneta', ok = (x, z) => x > 4 && z > 4 && x < WX - 5 && z < WZ - 5 && RD[z * WX + x] > 13, paint = (x, z, g) => { if (ok(x, z)) GT[z * WX + x] = g; };
  t.walls = []; t.roofs = []; t.doors = []; t.houses = []; t.spots = []; t.extra = [];
  for (let dz = -r - 8; dz <= r + 8; dz++) for (let dx = -r - 8; dx <= r + 8; dx++) { const x = cx + dx, z = cz + dz; if (x < 1 || z < 1 || x >= WX || z >= WZ) continue; const d = walled ? Math.max(Math.abs(dx), Math.abs(dz)) : Math.hypot(dx, dz), k = clamp((r + 8 - d) / 5, 0, 1) * clamp((RD[Math.min(z, WZ - 1) * WX + Math.min(x, WX - 1)] - 11) / 4, 0, 1), i = z * (WX + 1) + x; HT[i] = lerp(HT[i], TG, k * k * (3 - 2 * k)); if (d <= r + 3 && ok(x, z)) GT[z * WX + x] = G_GRASS; }
  for (let g = -r; g <= r; g += 10) for (let d = -r; d <= r; d++) if (g * g + d * d <= r * r) { paint(cx + g, cz + d, G_COB); paint(cx + d, cz + g, G_COB); }
  for (let d = -r - 3; d <= r + 3; d++) for (let w = -1; w <= 1; w++) { paint(cx + d, cz + w, G_ROAD); paint(cx + w, cz + d, G_ROAD); }
  const p = Math.max(4, Math.round(r / 3.2)), p2 = t.n === 'Pomponesco' ? p + 9 : p; for (let dz = -p; dz <= p2; dz++) for (let dx = -p; dx <= p; dx++) paint(cx + dx, cz + dz, G_COB);
  const chx = cx - 4, chz = cz - p - 15, hasCh = ok(chx - 1, chz - 1) && ok(chx + 12, chz + 14);
  if (hasCh) { house(t, chx, chz, 8, 13, 7, 0, 1, 'church'); const tx = chx + 8.3, tz = chz; t.walls.push([tx, TG, tz, tx + 3, TG + 15, tz + 3, 2]); box(tx, TG, tz, tx + 3, TG + 15, tz + 3, { town:t.i }); t.roofs.push([tx - .2, tz - .2, 3.4, 3.4, TG + 15, 3, 2, 'spire']); t.church = [cx, TG, chz + 6.5]; }
  let nc = 0; for (let lz = -r; lz < r; lz += 10) for (let lx = -r; lx < r; lx += 10) { const x0 = cx + lx + 2, z0 = cz + lz + 2, h = hash(x0, z0), w = 6 + (h * 17 % 1 < .4 ? 1 : 0), d = 6 + (h * 29 % 1 < .4 ? 1 : 0), mx = lx + 5.5, mz = lz + 5.5; if (mx * mx + mz * mz > (r - 2) * (r - 2)) continue;
      if ((x0 <= cx + 2 && x0 + w >= cx - 2) || (z0 <= cz + 2 && z0 + d >= cz - 2)) continue; if (x0 <= cx + p + 1 && x0 + w >= cx - p - 1 && z0 <= cz + p2 + 1 && z0 + d >= cz - p - 1) continue; if (hasCh && x0 <= chx + 13 && x0 + w >= chx - 1 && z0 <= chz + 14 && z0 + d >= chz - 1) continue;
      if (!ok(x0 - 1, z0 - 1) || !ok(x0 + w + 1, z0 + d + 1) || !ok(x0 - 1, z0 + d + 1) || !ok(x0 + w + 1, z0 - 1) || h < .14) continue;
      const side = Math.abs(mx) > Math.abs(mz) ? (mx > 0 ? 2 : 3) : (mz > 0 ? 1 : 0); house(t, x0, z0, w, d, h > .7 ? 5.6 : 3.1, side, Math.floor(h * 97) % WALLC.length, 'house');
      if (hash(x0 + 1, z0) < .5) { nc++; props.push({ k:'crate', id:'c' + t.i + '_' + nc, x:x0 + 1.1, z:z0 + 1.1, fix:t.n === 'Viadana' && nc <= 4 ? { batterie:1 } : t.n === 'Boretto' && nc === 1 ? { antibiotici:1, benda:2 } : null }); } }
  if (t.n === 'Pomponesco') { START[0] = cx + .5; START[1] = cz + 5.5; props.push({ k:'note', id:'n1', n:1, x:cx + 2.5, z:cz + 2.5 }); } if (t.n === 'Viadana') props.push({ k:'note', id:'n0', n:0, x:cx - 2.5, z:cz - 2.5 }); if (t.n === 'Boretto') props.push({ k:'note', id:'n3', n:3, x:cx + 2.5, z:cz - 2.5 });
  if (t.n === 'Dosolo' && t.church) { props.push({ k:'note', id:'n2', n:2, x:cx + .5, z:t.church[2] - 3 }); props.push({ k:'crate', id:'sac', x:cx - 2.6, z:t.church[2] - 5, fix:{ cartucce:8, benda:1 }, gun:['pompa', 1] }); }
  if (walled) { const q = r + 5, H = 5.5, w = (x0, z0, x1, z1) => { t.walls.push([x0, TG, z0, x1, TG + H, z1, 5]); box(x0, TG, z0, x1, TG + H, z1, { town:t.i }); }; // le mura, con quattro porte
    for (const s of [-1, 1]) { w(cx - q, cz + s * q - .6, cx - 2, cz + s * q + .6); w(cx + 2, cz + s * q - .6, cx + q, cz + s * q + .6); w(cx + s * q - .6, cz - q, cx + s * q + .6, cz - 2); w(cx + s * q - .6, cz + 2, cx + s * q + .6, cz + q); } ROCCA.x = cx; ROCCA.z = cz; ROCCA.q = q; }
  if (t.n === 'Guastalla') { const x0 = cx + r + 8, z0 = cz - 10, H = 4, w = (a, b, c, d2, ci2, hh) => { t.walls.push([a, TG, b, c, TG + (hh || H), d2, ci2]); box(a, TG, b, c, TG + (hh || H), d2, { town:t.i }); }; // il Consorzio: cortile e laboratorio di cemento
    for (let i = -3; i <= 23; i++) for (let j = -3; j <= 23; j++) { const k = (z0 + j) * (WX + 1) + x0 + i; HT[k] = TG; if (i >= 0 && j >= 0 && i < 20 && j < 20) GT[(z0 + j) * WX + x0 + i] = G_COB; }
    w(x0, z0, x0 + 20, z0 + .5, 4, 3); w(x0, z0 + 19.5, x0 + 20, z0 + 20, 4, 3); w(x0 + 19.5, z0, x0 + 20, z0 + 20, 4, 3); w(x0, z0, x0 + .5, z0 + 8.5, 4, 3); w(x0, z0 + 11.5, x0 + .5, z0 + 20, 4, 3);
    const lx = x0 + 9, lz = z0 + 6; w(lx, lz, lx + 9, lz + .4, 6); w(lx, lz + 7.6, lx + 9, lz + 8, 6); w(lx + 8.6, lz, lx + 9, lz + 8, 6); w(lx, lz, lx + .4, lz + 3.2, 6); w(lx, lz + 4.8, lx + .4, lz + 8, 6); t.walls.push([lx, TG + 2.4, lz + 3.2, lx + .4, TG + H, lz + 4.8, 6]); t.roofs.push([lx - .2, lz - .2, 9.4, 8.4, TG + H, .3, 0, 'flat']);
    props.push({ k:'gate', id:'gate', x:lx + .2, z:lz + 4 }); props.push({ k:'term', id:'term', x:lx + 7.6, z:lz + 4 }); props.push({ k:'note', id:'n4', n:4, x:lx + 7, z:lz + 1.6 }); props.push({ k:'crate', id:'lab', x:lx + 7, z:lz + 6.6, fix:{ ferro:10, medikit:2 } });
    CONS.x = x0 + 4.5; CONS.z = z0 + 10; CONS.gx = lx; CONS.gz = lz + 4; CONS.lab = [lx, lz]; } }
function roadLine(a, b, gap) { const n = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z)); for (let i = 0; i <= n; i++) { const x = Math.round(a.x + (b.x - a.x) * i / n), z = Math.round(a.z + (b.z - a.z) * i / n); if (x < 3 || z < 3 || x >= WX - 3 || z >= WZ - 3) continue; const rd = RD[z * WX + x];
    if (rd < 11) { if (!(gap && rd < gap) && !bridges.some(q => q.x0 === x - 2 && q.z0 === z - 2)) bridges.push(box(x - 2, .7, z - 2, x + 2, 1.15, z + 2, { deck:1 })); } for (let w = -1; w <= 1; w++) for (let v = -1; v <= 1; v++) if (RD[(z + v) * WX + x + w] >= 9) GT[(z + v) * WX + x + w] = G_ROAD; } }
function genWorld() { cgrid.clear(); props = []; bridges = [];
  for (let z = 0; z < WZ; z++) for (let x = 0; x < WX; x++) { const rd = riverD(x, z) + (vn(x, z, 17, 222) - .5) * 3, m = vn(x, z, 34, 500) * .7 + vn(x, z, 11, 777) * .3; RD[z * WX + x] = rd; GT[z * WX + x] = rd < 11.5 ? G_SAND : rd < 64 && m > .5 ? G_WOOD : m < .46 && vn(x, z, 9, 31) > .35 ? G_FIELD : G_GRASS; }
  for (let z = 0; z <= WZ; z++) for (let x = 0; x <= WX; x++) { const rd = RD[Math.min(z, WZ - 1) * WX + Math.min(x, WX - 1)], base = 1.3 + (vn(x, z, 40, 0) - .5) * 1.1 + (vn(x, z, 9, 60) - .5) * .25, k = clamp((rd - 6) / 6, 0, 1); HT[z * (WX + 1) + x] = lerp(-2.6, base, k * k * (3 - 2 * k)) + 2.3 * Math.exp(-(((rd - 17.5) / 2.6) ** 2)); }
  for (const [a, b, gap] of LINKS) roadLine(TOWNS[a], TOWNS[b], gap);
  for (const t of TOWNS) genTown(t);
  for (const pr of props) pr.y = hAt(pr.x, pr.z); startY = hAt(START[0], START[1]); }
// alberi, massi e cespugli di una zona di 64×64: sempre gli stessi, calcolati al momento
function natureOf(tx, tz) { const out = []; const near = (x, z) => TOWNS.some(t => Math.hypot(x - t.x, z - t.z) < t.r + 5) || Math.hypot(x - CONS.x - 6, z - CONS.z) < 18;
  for (let z = tz * TILE; z < tz * TILE + TILE; z++) for (let x = tx * TILE; x < tx * TILE + TILE; x++) { if (x < 3 || z < 3 || x > WX - 4 || z > WZ - 4) continue; const g = GT[z * WX + x], rd = RD[z * WX + x], h = hash(x + 999, z + 77); if (rd < 13 || g === G_ROAD || g === G_COB) continue;
    let k = null; if (g === G_WOOD && x % 4 === 0 && z % 4 === 0 && h < .8) k = 'pioppo'; else if (h < .0035) k = 'quercia'; else if (h > .9965) k = 'masso'; else if (h > .5 && h < .507) k = 'cespuglio'; if (!k || near(x, z)) continue;
    out.push({ k, id:z * WX + x, x:x + .5 + (hash(x, z + 3) - .5) * .6, z:z + .5 + (hash(x + 3, z) - .5) * .6, s:.8 + hash(x + 7, z + 7) * .5 }); } return out; }
