# Terra Muta

Survival a blocchi in 3D per Android, iOS e PC. Un mondo dopo il silenzio: i **Muti** non parlano, ma ogni terza notte
arrivano in massa.

## La mappa

Il mondo è la **bassa reale intorno a Pomponesco**: circa 30 km di lato (da 10,38°E a 10,77°E e da 44,855°N a
45,13°N), 512×512 blocchi, con il corso del Po, gli argini, i pioppeti della golena e 17 paesi nelle loro posizioni:
Pomponesco, Viadana, Dosolo, Guastalla, Boretto, Brescello, Gualtieri, Luzzara, Sabbioneta (con le mura),
Casalmaggiore, Suzzara, Commessaggio, Gazzuolo, Bozzolo, Rivarolo Mantovano, Marcaria, Mezzani. Posizioni e fiume sono
approssimati a mano; case e strade interne sono generate, non rilevate. Le altre zone (Mantova per prima) si
aggiungono come mappe successive.

## La storia (capitolo 1)

Elia si sveglia nella piazza di Pomponesco. I sopravvissuti sono dentro le mura di Sabbioneta; le batterie per la
radio sono a Viadana; la chiave del Consorzio è nella chiesa di Dosolo; il Consorzio Agrario è a Guastalla, oltre il
Po, con i ponti saltati. Cinque documenti sparsi nei paesi e otto missioni secondarie.

## Cosa si può fare

- **Tutto il mondo è fatto di blocchi che si rompono e si rimettono**: si scava fino alla roccia madre, si impila in
  altezza, si costruisce dove si vuole. Anche le case dei paesi si smontano mattone per mattone.
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
- **Tasti personalizzabili** per tastiera e controller, sensibilità dello sguardo e inversione dell'asse.
- **Zaino** con trascinamento, doppio tocco per spostare, riordino e l'elenco di ciò che si può fabbricare subito.

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

Altre mappe oltre la bassa, capitolo 2, acquisti in app, server e alleanze, inglese, grafica e audio definitivi.
