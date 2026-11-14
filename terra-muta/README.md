# Terra Muta

Survival a blocchi in 3D per Android, iOS e PC. Un mondo dopo il silenzio: i **Muti** non parlano, ma ogni terza notte
arrivano in massa.

## Cosa si può fare

- **Tutto il mondo è fatto di blocchi che si rompono e si rimettono**: si scava fino alla roccia madre, si impila in
  altezza, si costruisce dove si vuole. Mondo di 256×256 blocchi, alto 48, con pianure, laghi, boschi e montagne.
- **Prima o terza persona**, cambiabile in ogni momento.
- **Zaino a caselle**: barra rapida di 8 caselle più 24 nello zaino, pile da 64. Armi e attrezzi non occupano caselle.
- **Fabbricazione a stazioni**: mani nude, Banco da lavoro, Forgia, Focolare (cucina). Ferro e carbone si trovano
  scavando sotto la pietra.
- **Tempo**: un giorno dura 15 minuti, metà luce e metà buio. **Ogni terza notte un'orda** attacca il Focolare, cuore
  della base. I Muti rompono solo ciò che è stato costruito dal giocatore.
- **5 difficoltà**: Semplice, Normale, Difficile, Impossibile e **Hardcore** (una vita sola: alla morte il salvataggio
  viene cancellato).
- **Nemici**: Muti, Corridori, Gonfi, Larve; boss Gigante e Spiga Madre (pianta che sputa larve).
- **Animali**: lepri e cinghiali da cacciare (la carne va cotta), galline e cani da addomesticare.
- **Livelli, attributi, traguardi e monete**; mercante e sopravvissuti da reclutare alla Rocca; basi abbandonate con
  casse da aprire.
- **10 missioni** che guidano i primi passi. La campagna con la storia lunga non è ancora in questa versione.

## Comandi

| Azione | Tocco | Tastiera e mouse | Controller |
| --- | --- | --- | --- |
| Muoversi | Trascina a sinistra | W A S D | Levetta sinistra |
| Guardarsi intorno | Trascina a destra | Mouse | Levetta destra |
| Saltare, nuotare | Salta | Spazio | A |
| Rompere e colpire (tenere premuto) | Rompi | Clic sinistro | RT |
| Piazzare, usare, parlare, mangiare | Tasto bianco | Clic destro, E | LT, X |
| Tirare con l'arma | Tira | F | Y |
| Scegliere la casella | Tocca la barra | 1–8, rotella | LB e RB |
| Prima o terza persona | Vista | V | Premi la levetta destra |
| Menu | Menu | Tab, I, C, K, J, M | Start |

## File

| File | A cosa serve |
| --- | --- |
| `src/game.html` | Tutto il gioco 3D |
| `src/game-2d.html` | La versione 2D precedente, tenuta da parte |
| `build.js` | Crea `www/` con la pagina e la libreria 3D dentro l'app |
| `capacitor.config.json` | Nome e identificativo dell'app (`com.terramuta.game`) |

Nel browser: `npm install`, `npm run build` e apri `www/index.html`. L'APK Android di prova si compila da solo su
GitHub (Actions, "Terra Muta - APK Android di prova").

## Non ancora presenti

Campagna con la storia, acquisti in app, server e alleanze, inglese, grafica e audio definitivi.
