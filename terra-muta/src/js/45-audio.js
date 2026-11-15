/* ================= AUDIO ================= */
let actx = null;
function tone(f, d, type, v, when, slide) { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime + (when || 0);
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + d); g.gain.setValueAtTime(v || .05, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d); o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + d); } catch (e) {} }
const sfx = { hit:() => tone(150, .12, 'square', .06, 0, 60), dig:() => tone(190, .06, 'square', .04, 0, 120), pop:() => tone(320, .09, 'triangle', .06, 0, 520), shot:() => { tone(900, .25, 'sawtooth', .12, 0, 40); tone(90, .4, 'square', .1); }, bow:() => tone(620, .12, 'triangle', .04, 0, 240),
  hurt:() => tone(95, .25, 'sawtooth', .09), pick:() => tone(760, .08, 'sine', .04), place:() => tone(180, .1, 'square', .05), page:() => tone(300, .15, 'triangle', .03, 0, 500), story:() => [196, 233, 294].forEach((f, i) => tone(f, .9, 'sine', .04, i * .25)), horn:() => [98, 92, 98].forEach((f, i) => tone(f, 1.1, 'sawtooth', .07, i * .9)) };
const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

