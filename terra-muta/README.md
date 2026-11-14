# Terra Muta

Survival narrativo in 2D visto dall'alto, per Android e iOS. Pianura Padana, ottobre: un fungo nell'acqua dei canali
ha tolto la voce alla gente. I **Muti** non vedono quasi nulla ma sentono tutto.

## Capitolo 1, «Il silenzio»

Elia Ferri, autista d'ambulanza, si risveglia nella cascina del vecchio Tullio e cerca la sorella Marta, ricercatrice
al Consorzio Agrario. La storia passa dal distributore, dalla radio sul canale 7, dalla chiesa di Don Aldo e dal
cortile del Consorzio, e si chiude con una rivelazione che apre il capitolo 2 («La chiusa»).

## Cosa c'è nel gioco

- **Mappa esplorabile** (cascina, provinciale, distributore, borgo, chiesa, farmacia, Consorzio, argine del Po) che si
  svela sul diario man mano che si cammina.
- **Rumore e vista**: il piede di porco è silenzioso, la doppietta richiama i Muti da lontano, il grano alto nasconde.
- **Sopravvivenza**: salute, fame, sete, giorno e notte (di notte i Muti corrono e ne arrivano altri).
- **Cascina**: letto per dormire e salvare, banco da lavoro con due migliorie.
- **Scelte**: gli antibiotici si possono dare a Irene per il bambino o tenere.
- **Documenti** sparsi che raccontano cosa è successo.

## File

| File | A cosa serve |
| --- | --- |
| `src/game.html` | Tutto il gioco: mappa, storia, dialoghi, logica |
| `build.js` | Crea `www/index.html`, la pagina impacchettata nell'app |
| `capacitor.config.json` | Nome e identificativo dell'app (`com.terramuta.game`) |

Per provarlo nel browser: `npm run build` e apri `www/index.html`. L'APK Android di prova si compila da solo su GitHub
(scheda Actions, "Terra Muta - APK Android di prova").

## Prossimi passi

1. Capitolo 2 e nuove zone oltre il Po.
2. Acquisti in app (non ancora presenti in questo gioco).
3. Server e alleanze: richiedono un backend con account, da progettare a parte.
4. Grafica e audio definitivi, traduzione inglese.
