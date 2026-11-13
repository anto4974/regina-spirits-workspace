# Lumi Survival

Gioco survival a un dito per Android e iOS. Lumi è una fiammella in una foresta buia: si muove trascinando il dito,
attacca da sola, e la sua **luce è la sua vita**. La luce cala col tempo e a ogni colpo; le schegge lasciate dalle ombre
la ricaricano. Più la luce è bassa, meno si vede.

## Com'è fatto

| File | A cosa serve |
| --- | --- |
| `src/game.html` | Tutto il gioco (grafica, logica, negozio, testi IT/EN) |
| `build.js` | Crea `www/index.html`, la pagina che finisce dentro l'app |
| `capacitor.config.json` | Nome e identificativo dell'app (`com.lumisurvival.game`) |
| `../.github/workflows/lumi-android.yml` | Compila in automatico un APK di prova a ogni modifica |

## Provarlo

- **Nel browser:** `npm run build` e apri `www/index.html`.
- **Su un telefono Android:** su GitHub, scheda *Actions* → ultimo run "Lumi - APK Android di prova" → scarica
  `lumi-survival-debug-apk` e installa l'APK.

## Economia del gioco

- **Monete**: si guadagnano giocando, comprano i potenziamenti permanenti.
- **Gemme**: premio giornaliero (+5), 1 per ogni Guardiano sconfitto, oppure acquistate. Servono per riaccendere la luce
  una volta a partita (20), per gli aspetti di Lumi e per i pacchetti di monete.
- **Acquisti in app** (id da creare identici negli store): `lumi_gems_80`, `lumi_gems_500`, `lumi_gems_1200`,
  `lumi_starter` (una sola volta).

## Cosa manca per pubblicare

1. **Account sviluppatore**: Google Play Console (25 $ una tantum) e Apple Developer Program (99 $/anno).
2. **Pagamenti veri**: oggi gli acquisti sono in *modalità prova* (nessun addebito). Nel codice c'è un solo punto di
   aggancio, `Store` in `src/game.html`: va collegato un plugin di fatturazione (es. RevenueCat o
   `cordova-plugin-purchase`) che espone `window.LumiBilling.purchase(id)`. Serve avere prima i prodotti creati negli store.
3. **iOS**: la compilazione richiede un Mac con Xcode (o un servizio cloud tipo Codemagic / Ionic Appflow).
4. **Materiale per gli store**: icona 1024×1024, schermate, descrizione, informativa privacy, classificazione per età.
5. **Firma di rilascio Android**: keystore e file `.aab` al posto dell'APK di debug.
6. **Nome**: verificare che "Lumi Survival" sia libero su entrambi gli store prima di affezionarsi.
