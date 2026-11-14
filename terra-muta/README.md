# Terra Muta

Survival open world in 2D visto dall'alto, per Android, iOS e PC. Pianura Padana, ottobre: un fungo nell'acqua dei
canali ha tolto la voce alla gente. I **Muti** vedono poco ma sentono tutto.

## Cosa c'è nel gioco

- **Mondo aperto** di 256×256 caselle: pianura, boschi, campi di grano, colline di roccia, il Po. Minimappa in basso a
  sinistra e mappa grande nel menu, che si svelano esplorando.
- **Raccolta e costruzione libera**: si abbattono alberi e rocce, si fabbricano pezzi (muri, porte, pavimenti, casse,
  letti, trappole, torce, balestre a scatto) e si piazzano dove si vuole.
- **Zaino a caselle**: barra rapida di 8 caselle sempre visibile più 24 nello zaino, pile da 64. Armi e attrezzi non
  occupano caselle. Altre caselle con lo Zaino di pelle, la mercante e le missioni.
- **Fabbricazione a stazioni**: a mani nude, Banco da lavoro, Forgia, Focolare (cucina). Alcune ricette si sbloccano
  solo con le missioni.
- **Tempo**: un giorno dura 15 minuti, metà luce e metà buio. **Ogni terza notte un'orda** attacca il Focolare, cuore
  della base; se cade si perde il 30% delle monete e va ricostruito.
- **Nemici**: Muti, Corridori, Gonfi, Larve. Boss: Gigante, Sirena, Spighe Madri (piante che sputano larve), Mietitore.
- **Animali**: lepri e cinghiali da cacciare (la carne va cotta), galline da addomesticare col grano (uova), cani da
  addomesticare con carne cotta (seguono e combattono).
- **Livelli e traguardi**: ogni livello e ogni traguardo danno un punto attributo e monete.
- **Rocca di San Lazzaro**: mercante, pozzo, tre sopravvissuti reclutabili (guardia, raccoglitrice, infermiera).
- **Basi abbandonate** da ripulire e saccheggiare.
- **Campagna** in 10 missioni principali e 6 secondarie, con documenti da trovare.

## Comandi

| Azione | Tocco | Tastiera e mouse | Controller |
| --- | --- | --- | --- |
| Muoversi | Trascina il dito | W A S D | Levetta sinistra |
| Mirare | Direzione di marcia | Mouse | Levetta destra |
| Colpire, raccogliere, piazzare | Tasto rosso | Clic sinistro, Spazio | A |
| Tirare con l'arma | Tasto arma | F | RT |
| Usare, parlare, aprire | Tasto bianco | E | X |
| Mangiare o bere | Tocca due volte la casella | Q | Y |
| Smontare un pezzo | Smonta | Clic destro, R | LT |
| Scegliere la casella | Tocca la barra | 1–8, rotella | LB e RB |
| Menu | Menu | Tab, I, C, K, J, M | Start, B |

## File

| File | A cosa serve |
| --- | --- |
| `src/game.html` | Tutto il gioco |
| `build.js` | Crea `www/index.html`, la pagina impacchettata nell'app |
| `capacitor.config.json` | Nome e identificativo dell'app (`com.terramuta.game`) |

Nel browser: `npm run build` e apri `www/index.html`. L'APK Android di prova si compila da solo su GitHub (Actions,
"Terra Muta - APK Android di prova").

## Non ancora presenti

Acquisti in app, server e alleanze, capitolo 2, traduzione inglese, grafica e audio definitivi.
