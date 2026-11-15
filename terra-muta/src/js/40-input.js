/* ================= INPUT: tocco, tastiera e mouse, controller ================= */
let dev = 'touch'; const joy = { on:false, id:null, ox:0, oy:0, x:0, y:0 }, keys = {}, pad = { prev:[], mx:0, my:0, ax:0, ay:0 }, look = { id:null, x:0, y:0 };
// tasti personalizzabili: salvati a parte, valgono per tutte le partite
const OPT_KEY = 'terra-muta-opts3';
const KB0 = { fwd:'w', back:'s', left:'a', right:'d', jump:' ', hit:'', use:'e', shoot:'f', reload:'r', aim:'', eat:'q', view:'v', inv:'tab', craft:'c', hero:'k', quest:'j', map:'m', prev:'', next:'' };
const PB0 = { jump:0, reload:1, use:2, shoot:3, prev:4, next:5, aim:6, hit:7, map:8, inv:9, view:11, eat:12 };
const ACTN = { fwd:'Avanti', back:'Indietro', left:'A sinistra', right:'A destra', jump:'Salta, nuota', hit:'Rompi, colpisci, spara', use:'Usa, piazza, prendi, guida', shoot:'Cambia arma (mani, arma 1, arma 2)', reload:'Ricarica', aim:'Mira', eat:'Mangia, bevi', view:'Prima o terza persona', inv:'Apri lo zaino', craft:'Apri Crea', hero:'Apri Eroe', quest:'Apri Missioni', map:'Apri la mappa', prev:'Casella precedente', next:'Casella successiva' };
const PADN = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Select', 'Start', 'L3', 'R3', 'Su', 'Giù', 'Sinistra', 'Destra'];
const opt = { kb:Object.assign({}, KB0), pb:Object.assign({}, PB0), sens:1, inv:false };
try { const o = JSON.parse(localStorage.getItem(OPT_KEY) || 'null'); if (o) { Object.assign(opt.kb, o.kb); Object.assign(opt.pb, o.pb); opt.sens = o.sens || 1; opt.inv = !!o.inv; opt.gfx = o.gfx || 'media'; } } catch (e) {}
const saveOpt = () => { try { localStorage.setItem(OPT_KEY, JSON.stringify(opt)); } catch (e) {} };
const keyName = k => !k ? '—' : k === ' ' ? 'Spazio' : k.length === 1 ? k.toUpperCase() : k.startsWith('arrow') ? 'Freccia ' + ({ up:'su', down:'giù', left:'sx', right:'dx' })[k.slice(5)] : k[0].toUpperCase() + k.slice(1);
let capture = null; // { t:'kb'|'pad', a:azione } mentre si aspetta il tasto nuovo
const HA = { atk:'hit', use:'use', gun:'shoot', jump:'jump', menu:'inv', view:'view', rel:'reload' };
function refreshHints() { for (const k of document.querySelectorAll('kbd[data-h]')) { const h = k.dataset.h, a = HA[h]; k.textContent = dev === 'kb' ? (h === 'back' ? 'Esc' : h === 'atk' ? (opt.kb.hit ? keyName(opt.kb.hit) : 'Clic sx') : keyName(opt.kb[a])) : dev === 'pad' ? (h === 'back' ? 'B' : PADN[opt.pb[a]] || '') : ''; } invDirty = true; }
function setDev(d) { if (dev === d) return; dev = d; refreshHints(); }
const locked = () => document.pointerLockElement === cv, turn = (dx, dy, k) => { k *= opt.sens * (1 - .6 * P.ads); P.a += dx * k; P.p = clamp(P.p - dy * k * (opt.inv ? -1 : 1), -1.5, 1.5); };
cv.addEventListener('pointerdown', e => { const r = cv.getBoundingClientRect();
  if (e.pointerType === 'mouse') { setDev('kb'); if (mode !== 'play') return; if (!locked()) { try { const q = cv.requestPointerLock(); if (q && q.catch) q.catch(() => {}); } catch (_) {} } if (e.button === 2) { if (gunNow() && !P.veh && !context()) aim = true; else useAct(); } else if (e.button === 0) { hold.a = true; doHit(); } return; }
  setDev('touch'); if (mode !== 'play') return;
  if (e.clientX - r.left > W * .45 || joy.on) { if (look.id == null) { look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; } } else { joy.on = true; joy.id = e.pointerId; joy.ox = joy.x = e.clientX; joy.oy = joy.y = e.clientY; }
  try { cv.setPointerCapture(e.pointerId); } catch (_) {} });
cv.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { if (mode === 'play' && (locked() || e.buttons)) turn(e.movementX || 0, e.movementY || 0, .0026); return; }
  if (e.pointerId === look.id) { turn(e.clientX - look.x, e.clientY - look.y, .0062); look.x = e.clientX; look.y = e.clientY; } else if (joy.on && e.pointerId === joy.id) { joy.x = e.clientX; joy.y = e.clientY; } });
const pEnd = e => { if (e.pointerType === 'mouse') { if (e.button === 0) hold.a = false; if (e.button === 2) aim = false; return; } if (e.pointerId === joy.id) joy.on = false; if (e.pointerId === look.id) look.id = null; };
cv.addEventListener('pointerup', pEnd); cv.addEventListener('pointercancel', pEnd); cv.addEventListener('contextmenu', e => e.preventDefault());
cv.addEventListener('wheel', e => { if (mode === 'play') selSlot((sv.sel + (e.deltaY > 0 ? 1 : 7)) % 8); }, { passive:true });
window.addEventListener('keydown', e => { const k = e.key.toLowerCase(); if (capture && capture.t === 'kb') { e.preventDefault(); if (k !== 'escape') { for (const a in opt.kb) if (opt.kb[a] === k) opt.kb[a] = opt.kb[capture.a]; opt.kb[capture.a] = k; saveOpt(); } capture = null; refreshHints(); renderTab(); return; }
  if (k === 'tab' || (k === ' ' && mode === 'play')) e.preventDefault(); if (!keys[k]) keyPress(k); keys[k] = true; setDev('kb'); });
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
const ACT = { use:() => useAct(), shoot:() => swapGun(), reload:() => reload(), eat:() => eatSel(), view:() => toggleView(), inv:() => openMenu('zaino'), craft:() => openMenu('crea'), hero:() => openMenu('eroe'), quest:() => openMenu('missioni'), map:() => openMenu('mappa'), hit:() => doHit(), prev:() => selSlot((sv.sel + 7) % 8), next:() => selSlot((sv.sel + 1) % 8) };
function keyPress(k) {
  if (mode === 'dlg') { if (k === ' ' || k === 'enter' || k === opt.kb.use) dlgNext(); return; }
  if (mode === 'menu') { if (k === 'escape' || k === opt.kb.inv) closeTop(); return; }
  if (mode !== 'play') return;
  if (k === 'escape') return openMenu('aiuto'); if (k >= '1' && k <= '8') return selSlot(+k - 1);
  for (const a in ACT) if (opt.kb[a] === k) return ACT[a](); }
function focusables() { const top = !$('dlg').hidden ? $('dlg') : [...document.querySelectorAll('.screen')].find(s => !s.hidden); return top ? [...top.querySelectorAll('button:not([disabled])')].filter(b => b.offsetParent) : []; }
function padPoll() { let gp = null; try { gp = [...navigator.getGamepads()].find(g => g && g.connected); } catch (e) {} if (!gp) { pad.mx = pad.my = pad.ax = pad.ay = 0; pad.jump = pad.hit = false; return; }
  const dz = v => Math.abs(v) < .22 ? 0 : v; pad.mx = dz(gp.axes[0] || 0); pad.my = dz(gp.axes[1] || 0); pad.ax = dz(gp.axes[2] || 0); pad.ay = dz(gp.axes[3] || 0);
  const b = gp.buttons.map(x => x.pressed || x.value > .5), hit = i => b[i] && !pad.prev[i], pb = opt.pb; if (b.some(x => x) || pad.mx || pad.my) setDev('pad');
  if (capture && capture.t === 'pad') { const i = b.findIndex((x, n) => x && !pad.prev[n]); if (i >= 0) { for (const a in pb) if (pb[a] === i) pb[a] = pb[capture.a]; pb[capture.a] = i; saveOpt(); capture = null; refreshHints(); renderTab(); } pad.prev = b; return; }
  pad.jump = b[pb.jump]; pad.hit = b[pb.hit]; if (gunNow() && pb.aim != null) aim = !!b[pb.aim];
  if (mode === 'play') { for (const a of ['use', 'shoot', 'reload', 'eat', 'view', 'inv', 'map', 'prev', 'next', 'hit']) if (hit(pb[a])) ACT[a](); }
  else if (mode === 'dlg' && !$('dCh').childElementCount) { if (hit(0) || hit(2)) dlgNext(); }
  else { const f = focusables(), cur = f.indexOf(document.activeElement), step = hit(13) || hit(15) ? 1 : hit(12) || hit(14) ? -1 : 0; if (step && f.length) f[(cur + step + f.length) % f.length].focus(); if (hit(0)) { if (cur >= 0) document.activeElement.click(); else if (f.length) f[0].focus(); } if (hit(1) || hit(9)) closeTop(); }
  pad.prev = b; }
function rawMove() { let x = pad.mx, y = pad.my; if (joy.on) { x = (joy.x - joy.ox) / 44; y = (joy.y - joy.oy) / 44; } const kb = opt.kb; if (keys[kb.left]) x -= 1; if (keys[kb.right]) x += 1; if (keys[kb.fwd]) y -= 1; if (keys[kb.back]) y += 1; const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; } return [x, y]; }
function moveVec() { const [x, y] = rawMove(), ca = Math.cos(P.a), sa = Math.sin(P.a); return [-y * ca - x * sa, -y * sa + x * ca]; }
function toggleView() { tp = !tp; toast(tp ? 'Vista in terza persona' : 'Vista in prima persona'); }

