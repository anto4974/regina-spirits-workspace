# Terra Muta

Survival sparatutto in 3D per Android, iOS e PC, ambientato nella bassa reale intorno a Pomponesco. Un fungo
nell'acqua dei canali ha tolto la voce alla gente: i **Muti** sentono tutto, e ogni terza notte arrivano in massa.

## Cosa c'è

- **Mondo realistico, non a blocchi**: terreno liscio con il Po e gli argini, 17 paesi veri della zona con case in
  cui si entra, tetti a falde, piazze e chiese; alberi, massi, ombre del sole, torcia di notte.
- **Modelli 3D già fatti e animati** per persone, Muti e cane (Zombie Apocalypse Kit di Quaternius, licenza CC0).
  Lo stile è da cartone animato, non fotorealistico. Auto, barche, case e armi sono ancora forme costruite a codice.
- **Antonio o Lisa**: si sceglie il protagonista; l'altro è il compagno che segue, spara e vive la storia.
- **Campagna** in 12 missioni tra Pomponesco, Viadana, Sabbioneta, Boretto, Dosolo e Guastalla, più 8 secondarie e
  5 documenti da trovare. Sopravvissuti da reclutare.
- **Sparatutto**: sei armi con quattro rarità, caricatore, ricarica, mira, colpi alla testa. Bottino a terra nelle
  case, che torna ogni due giorni. Piastre di corazza, kit medici.
- **Base**: muri, barricate, cancelli, letti, casse, trappole, lampioni, balestre a scatto, piazzati dove si vuole.
  Legno dagli alberi, pietra e ferro dai massi.
- **Mezzi**: auto con benzina e barche sul Po.
- **Sopravvivenza**: fame, sete, giorno di 15 minuti, orda ogni terza notte contro il Focolare.
- **5 difficoltà** (con Hardcore a vita singola), livelli, attributi, traguardi, mercante.
- **Comandi** per tocco, tastiera e mouse, controller, tutti personalizzabili. Qualità grafica regolabile.

## Com'è organizzato il codice

| Percorso | A cosa serve |
| --- | --- |
| `src/shell.html` | Stile e struttura della pagina |
| `src/js/10-world.js` | Terreno, fiume, strade, paesi, ostacoli |
| `src/js/20-data.js` | Oggetti, armi, ricette, storia, salvataggio |
| `src/js/40-input.js`, `45-audio.js` | Comandi e suoni |
| `src/js/50-game.js` | Fisica, combattimento, compagno, mezzi, orde |
| `src/js/60-render.js` | Grafica 3D e modelli |
| `src/js/80-ui.js`, `90-main.js` | Menu, zaino, avvio |
| `assets/` | Modelli 3D (vedi `assets/LICENZA.md`) |
| `build.js` | Monta tutto in `src/game.html` e in `www/` per l'app |
| `src/game-voxel.html`, `src/game-2d.html` | Le versioni precedenti, tenute da parte |

Per provarlo: `npm install`, `npm run build`, poi servire la cartella `www` con un server locale
(i modelli non si caricano aprendo il file direttamente).

## Non ancora presenti

Modelli veri per auto, case e armi; suoni registrati; capitolo 2 (Mantova); acquisti in app; server e alleanze.
