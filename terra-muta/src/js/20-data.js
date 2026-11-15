/* ================= OGGETTI, PEZZI, ARMI, RICETTE ================= */
// pc: pezzo che si piazza; eat: effetti; ic: [forma, colore]
const IT = {
  legno:{ n:'Legno', ic:['log', '#a5793f'] }, pietra:{ n:'Pietra', ic:['rock', '#8e8e88'] }, ferro:{ n:'Ferro', ic:['rock', '#c98a5a'] }, fibra:{ n:'Fibra', ic:['fiber', '#9ab06a'] }, pelle:{ n:'Pelle', ic:['skin', '#8a5a3a'] }, piume:{ n:'Piume', ic:['fiber', '#e0dccc'] },
  bacche:{ n:'Bacche', d:'Fame +12', ic:['dots', '#b02a4a'], eat:{ hun:12, thi:4 } }, grano:{ n:'Grano', d:'Per il pane e per le galline', ic:['fiber', '#d9b44a'] },
  pane:{ n:'Pane', d:'Fame +35', ic:['loaf', '#c99554'], eat:{ hun:35 } }, carne:{ n:'Carne cruda', d:'Va cucinata al Focolare. Cruda fa male', ic:['meat', '#b5433a'], eat:{ hun:10, hp:-10 } },
  carnecotta:{ n:'Carne cotta', d:'Fame +45', ic:['meat', '#7a4a2a'], eat:{ hun:45 } }, uovo:{ n:'Uovo', d:'Meglio cotto', ic:['egg', '#e8e0cc'], eat:{ hun:8 } }, frittata:{ n:'Frittata', d:'Fame +28', ic:['loaf', '#e3c25a'], eat:{ hun:28 } },
  stufato:{ n:'Stufato', d:'Fame +70, Sete +15, Salute +10', ic:['bowl', '#8a4a2a'], eat:{ hun:70, thi:15, hp:10 } }, scatoletta:{ n:'Scatoletta', d:'Fame +35', ic:['can', '#9aa0a4'], eat:{ hun:35 } },
  acquasporca:{ n:'Acqua di canale', d:'Non berla. Bollila al Focolare', ic:['bottle', '#5a6a3a'], eat:{ thi:15, hp:-25 } }, acqua:{ n:'Acqua pulita', d:'Sete +40', ic:['bottle', '#59a6cf'], eat:{ thi:40 } },
  benda:{ n:'Benda', d:'Salute +30', ic:['band', '#e8e3d2'], eat:{ hp:30 } }, medikit:{ n:'Kit medico', d:'Salute +70', ic:['band', '#f2efe4'], eat:{ hp:70 } }, piastra:{ n:'Piastra balistica', d:'Corazza +50: assorbe il 60% dei colpi', ic:['band', '#8fb7d8'], eat:{ arm:50 } },
  antibiotici:{ n:'Antibiotici', d:'Salute +70. Qualcuno ne ha più bisogno', ic:['can', '#c4352b'], eat:{ hp:70 } }, batterie:{ n:'Batterie', d:'Servono alla radio di Sabbioneta', ic:['can', '#e3c25a'] }, chiave:{ n:'Chiave del Consorzio', d:'Apre il laboratorio di Guastalla', ic:['key', '#e3c25a'] },
  frecce:{ n:'Frecce', d:'Per l\'arco: colpi silenziosi', ic:['arrow', '#c9c2ad'] }, leggere:{ n:'Munizioni leggere', d:'Per pistola e mitraglietta', ic:['can', '#d9b44a'] }, pesanti:{ n:'Munizioni pesanti', d:'Per fucile d\'assalto e di precisione', ic:['can', '#7a8a5a'] }, cartucce:{ n:'Cartucce', d:'Per il fucile a pompa', ic:['can', '#b5433a'] },
  benzina:{ n:'Tanica di benzina', d:'Tienila in mano al volante e premi Usa: +50% di serbatoio', ic:['bottle', '#c4352b'] },
  p_muro:{ n:'Muro di legno', d:'Largo 2 metri. Resistenza 60', pc:1 }, p_pietra:{ n:'Muro di pietra', d:'Resistenza 160', pc:1 }, p_lamiera:{ n:'Muro di lamiera', d:'Resistenza 320', pc:1 }, p_barricata:{ n:'Barricata', d:'Bassa: ci spari sopra. Resistenza 45', pc:1 },
  p_cancello:{ n:'Cancello', d:'Tu e i tuoi passate, i Muti no', pc:1 }, p_focolare:{ n:'Focolare', d:'Il cuore della base. Cucina, fa luce, va difeso', pc:1 }, p_banco:{ n:'Banco da lavoro', d:'Sblocca attrezzi e pezzi', pc:1 }, p_forgia:{ n:'Forgia', d:'Per il ferro', pc:1 },
  p_cassa:{ n:'Cassa', d:'16 caselle di deposito', pc:1 }, p_letto:{ n:'Letto', d:'Salta la notte e fissa il risveglio', pc:1 }, p_punte:{ n:'Trappola a punte', d:'Ferisce i Muti che ci passano', pc:1 }, p_torcia:{ n:'Lampione', d:'Luce di notte', pc:1 }, p_torretta:{ n:'Balestra a scatto', d:'Tira da sola ai Muti vicini', pc:1 }
};
// pezzi da costruzione: larghezza, profondità, altezza, resistenza, colore
const PCS = { p_muro:{ w:2, d:.3, h:2.7, hp:60, c:'#8a6a3c' }, p_pietra:{ w:2, d:.4, h:2.7, hp:160, c:'#8b8b86' }, p_lamiera:{ w:2, d:.2, h:2.7, hp:320, c:'#8a959a' }, p_barricata:{ w:2, d:.5, h:1.1, hp:45, c:'#6b5233' },
  p_cancello:{ w:2, d:.25, h:2.4, hp:70, c:'#7a5a34', gate:1 }, p_focolare:{ w:.9, d:.9, h:.45, hp:200, c:'#6a6a64', core:1, light:1.5 }, p_banco:{ w:1.5, d:.8, h:.95, hp:50, c:'#96683a', st:'b' }, p_forgia:{ w:1.1, d:1.1, h:1.25, hp:80, c:'#4a4a48', st:'f' },
  p_cassa:{ w:.95, d:.65, h:.7, hp:40, c:'#7d5228', chest:1 }, p_letto:{ w:1, d:2, h:.5, hp:30, c:'#a53a34', bed:1 }, p_punte:{ w:2, d:2, h:.22, hp:30, c:'#b9b3a0', trap:1 }, p_torcia:{ w:.16, d:.16, h:2, hp:10, c:'#3a3a3a', light:1, thin:1 }, p_torretta:{ w:.8, d:.8, h:1.2, hp:60, c:'#5a4228', tur:1 } };
const TOOLS = { ascia:['Ascia', 'Abbatte gli alberi tre volte più in fretta'], piccone:['Piccone', 'Spacca i massi: pietra e ferro'], bastone:['Bastone chiodato', 'Danno 3'], lancia:['Lancia', 'Danno 4, arriva più lontano'], spada:['Machete', 'Danno 7'], falce:['Falce del Mietitore', 'Danno 10, colpo ampio'],
  giubbotto:['Giubbotto di pelle', 'Subisci il 25% di danni in meno'], zaino:['Zaino di pelle', '+8 caselle'] };
const RAR = [['Comune', '#c8c8c0', 1], ['Raro', '#5fa8ee', 1.2], ['Epico', '#c07af0', 1.45], ['Leggendario', '#f0be48', 1.75]];
const GUNS = { arco:{ n:'Arco', dmg:5, rate:.7, mag:1, rel:.5, spr:.012, am:'frecce', loud:5, rng:30, kick:.01 }, pistola:{ n:'Pistola', dmg:4, rate:.26, mag:12, rel:1.2, spr:.02, am:'leggere', loud:28, rng:40, kick:.02 },
  smg:{ n:'Mitraglietta', dmg:3, rate:.085, mag:30, rel:1.7, spr:.045, am:'leggere', loud:32, rng:34, kick:.012, auto:1 }, ar:{ n:'Fucile d\'assalto', dmg:5, rate:.115, mag:30, rel:2, spr:.024, am:'pesanti', loud:42, rng:55, kick:.016, auto:1 },
  pompa:{ n:'Fucile a pompa', dmg:3.2, rate:.8, mag:6, rel:2.3, spr:.085, am:'cartucce', loud:48, rng:20, kick:.06, pel:7 }, cecchino:{ n:'Fucile di precisione', dmg:24, rate:1.2, mag:5, rel:2.5, spr:.001, am:'pesanti', loud:55, rng:90, kick:.07, zoom:1 } };
const REC = [ // st: m mani, b banco, f forgia, c focolare
  { o:'p_focolare', n:1, c:{ legno:8 }, st:'m' }, { o:'p_banco', n:1, c:{ legno:6 }, st:'m' }, { tool:'bastone', c:{ legno:3 }, st:'m' }, { o:'benda', n:1, c:{ fibra:3 }, st:'m' }, { o:'p_barricata', n:2, c:{ legno:4 }, st:'m' },
  { o:'p_muro', n:2, c:{ legno:6 }, st:'b' }, { o:'p_cancello', n:1, c:{ legno:6 }, st:'b' }, { tool:'ascia', c:{ legno:4, pietra:2 }, st:'b' }, { tool:'piccone', c:{ legno:4, pietra:3 }, st:'b' }, { o:'p_cassa', n:1, c:{ legno:6 }, st:'b' }, { o:'p_letto', n:1, c:{ legno:4, fibra:4 }, st:'b' },
  { o:'p_torcia', n:2, c:{ legno:2, fibra:2 }, st:'b' }, { o:'p_pietra', n:2, c:{ pietra:8 }, st:'b' }, { o:'p_punte', n:1, c:{ legno:3, ferro:1 }, st:'b' }, { tool:'lancia', c:{ legno:3, pietra:2 }, st:'b' }, { o:'p_forgia', n:1, c:{ pietra:10, ferro:3 }, st:'b' },
  { tool:'arco', c:{ legno:4, fibra:4 }, st:'b' }, { o:'frecce', n:6, c:{ legno:1, pietra:1 }, st:'b' }, { o:'frecce', n:10, c:{ legno:1, piume:2 }, st:'b' }, { tool:'giubbotto', c:{ pelle:5, fibra:4 }, st:'b' }, { tool:'zaino', c:{ pelle:4, fibra:6 }, st:'b' },
  { o:'p_torretta', n:1, c:{ legno:6, ferro:4, fibra:2 }, st:'b', lock:'torretta' }, { tool:'spada', c:{ legno:2, ferro:4 }, st:'f' }, { o:'p_lamiera', n:2, c:{ ferro:4 }, st:'f' }, { o:'cartucce', n:4, c:{ ferro:1, pietra:1 }, st:'f' }, { o:'leggere', n:12, c:{ ferro:1 }, st:'f' }, { o:'pesanti', n:8, c:{ ferro:1, pietra:1 }, st:'f' },
  { tool:'falce', c:{ legno:4, ferro:8 }, st:'f', lock:'falce' }, { o:'carnecotta', n:1, c:{ carne:1 }, st:'c' }, { o:'acqua', n:1, c:{ acquasporca:1 }, st:'c' }, { o:'pane', n:1, c:{ grano:2 }, st:'c' }, { o:'frittata', n:1, c:{ uovo:1 }, st:'c' }, { o:'stufato', n:1, c:{ carnecotta:1, bacche:2, acqua:1 }, st:'c' } ];
const STN = { m:'Ovunque, a mani nude', b:'Banco da lavoro', f:'Forgia', c:'Focolare' };
const ATTR = [['for', 'Forza', '+15% danno in mischia'], ['vig', 'Vigore', '+15 salute massima'], ['pas', 'Passo', '+5% velocità'], ['mir', 'Mira', '+15% danno con le armi da fuoco'], ['man', 'Mano', '+20% velocità di raccolta'], ['sto', 'Stomaco', '−10% fame e sete']];
const ADV = [['wood', 10, '10 alberi abbattuti'], ['placed', 10, '10 pezzi costruiti'], ['placed', 60, '60 pezzi costruiti'], ['kills', 1, 'Primo Muto abbattuto'], ['kills', 50, '50 Muti abbattuti'], ['kills', 200, '200 Muti abbattuti'], ['head', 20, '20 colpi alla testa'],
  ['nights', 1, 'Prima notte superata'], ['nights', 5, '5 notti superate'], ['craft', 10, '10 oggetti fabbricati'], ['hunt', 5, '5 animali cacciati'], ['tame', 1, 'Primo animale addomesticato'], ['raids', 1, 'Prima orda respinta'], ['raids', 3, '3 orde respinte'],
  ['boss', 1, 'Primo boss abbattuto'], ['loot', 10, '10 casse aperte'], ['drive', 1, 'Primo giro in auto'], ['boat', 1, 'Prima traversata in barca'], ['cook', 5, '5 pasti cucinati']];

/* ================= LA STORIA: Antonio e Lisa =================
   Si sceglie chi si è; l'altro è il compagno che segue per quasi tutta la campagna. {H} è il protagonista, {P} il compagno. */
const TU = 'Tullio', AD = 'Ada', BR = 'Bruno', NI = 'Nina', IR = 'Irene', MA = 'Marta';
let HN = 'Antonio', PN = 'Lisa';
const tx = s => s.replace(/\{H\}/g, HN).replace(/\{P\}/g, PN).replace(/\{o\}/g, HN === 'Lisa' ? 'a' : 'o'), L = (who, s) => [who === 'H' ? HN : who === 'P' ? PN : who, tx(s)];
const PROLOGUE = ['Pomponesco, ottobre.\n\nÈ cominciato col raccolto. Prima il grano si è fatto nero. Poi la gente ha smesso di parlare.', 'Li chiamiamo i Muti.\n\nNon gridano. Non gemono.\nAscoltano.',
  '{H} e {P}: stesso turno, stessa ambulanza, da sei anni. Tra Viadana e Guastalla conoscono ogni fosso.\n\nL\'ultima chiamata è arrivata da Marta, la sorella di {H}, dal Consorzio Agrario oltre il Po. Poi il buio.', 'Mi sveglio nella piazza del mio paese. L\'ambulanza non c\'è. {P} nemmeno.\n\nDalla chiesa, piano, gracchia una radio.'];
const NOTES = [
  ['Quaderno del benzinaio di Viadana', 'Lunedì. Il Gino della cooperativa è venuto a fare gasolio e non ha detto una parola. Mi guardava la bocca mentre parlavo, come un cane guarda il pane.\n\nGiovedì. Ne sono passati sei, in fila sulla provinciale. Ho fatto cadere la chiave inglese. Si sono girati tutti insieme.\n\nNon faccio più rumore. Scrivo e basta.'],
  ['Disegno di un bambino', 'Un foglio a quadretti, sul selciato della piazza. Una casa, un sole, quattro figure con la bocca cancellata a penna.\n\nSotto, in stampatello: «LA MAMMA NON CANTA PIÙ. IL PAPÀ DICE DI STARE ZITTI ANCHE NOI COSÌ NON CI SENTE.»'],
  ['Ultima predica di Don Aldo', 'Fratelli di Dosolo, mi chiedete se è un castigo. Io so solo che il Signore ha fatto il mondo con la Parola, e che a questa terra la parola l\'hanno tolta.\n\nLa dottoressa Ferri mi ha dato una chiave e mi ha fatto giurare.\n\nHo bevuto alla fontana del sagrato, come sempre. Stanotte ho la gola che'],
  ['Circolare dell\'azienda sanitaria', 'OGGETTO: sindrome afasica acuta, aggiornamento n. 4\n\nI soggetti perdono la voce entro 12 ore. Reagiscono in modo violento a QUALSIASI suono.\n\nSegnalati casi anomali: soggetti di corporatura enorme, e nei campi una crescita vegetale che «partorisce» piccoli infetti.\n\nI ponti sul Po sono stati fatti saltare per ordine della Prefettura.'],
  ['Appunti di Marta, giorno 6', 'Cresce nell\'acqua ferma dei canali; il grano lo prende DOPO, dall\'irrigazione. Bollita, l\'acqua torna buona.\n\nDistrugge le corde vocali e qualcosa nell\'udito: sentono tutto, troppo. Il rumore per loro è dolore. Per questo ci vengono addosso: vogliono farlo smettere.\n\nNon sono morti. Questo non lo devo dire a nessuno, o nessuno avrà più il coraggio di difendersi.']];
const S = { // dialoghi: righe [chi, testo]
  find:() => [L('P', '{H}! Abbassa la voce. Sono qui da ieri sera: ne avevo quattro alla porta.'), L('H', 'L\'ambulanza?'), L('P', 'Nel canale, a due chilometri. Ti ho tirato fuori io, poi ho perso i sensi anch\'io.'), L('P', 'Marta ha chiamato dal Consorzio prima che cadesse la linea. Ci andiamo. Ma non a mani nude, e non senza un posto dove tornare.')],
  base:() => [L('P', 'Un fuoco, quattro muri. Non è casa, ma di notte ci terrà in vita.'), L('P', 'Al tramonto arrivano più numerosi. E ogni terza notte arrivano tutti insieme: l\'ho visto da quel campanile.')],
  night:() => [L('P', 'Siamo ancora qui. Non ci avrei scommesso.'), L('P', 'A Viadana c\'era l\'armeria di via Roma, e l\'elettronica in piazza. Se la radio di Sabbioneta funziona ancora, le serviranno batterie.')],
  viad:() => [L('P', 'Batterie e qualcosa che spara. Adesso a Sabbioneta: dietro quelle mura c\'è ancora gente, ho visto il fumo.')],
  t0:() => [L(TU, 'Fermi. Parlate. Dite qualcosa.'), L('H', 'Siamo {H} e {P}, della Croce Verde di Viadana.'), L(TU, 'Parlate. Allora entrate. Sabbioneta ha ancora le sue mura: per questo siamo vivi.'), L(TU, 'Ada baratta. Bruno e Nina cercano un posto migliore: se avete una base e dei letti, verranno con voi.')],
  radio:() => [L(TU, 'Le batterie. Bene. Sentite qua, ogni notte sul canale sette.'), L(MA, '…{H}, se sei viv{o} ascolta. Non è il grano. È l\'acqua dei canali.'), L(MA, 'Sono chiusa nel laboratorio del Consorzio, a Guastalla. È di cemento: non si entra. La chiave ce l\'ha Don Aldo, a Dosolo. Gliel\'ho data io.'), L(MA, 'Non bevete dai canali se non la bollite. Per nessun motivo.'),
    L('P', 'È viva. {H}, è viva.'), L(IR, 'Scusate. Siete dell\'ambulanza? Ho un bambino con la febbre da quattro giorni. All\'ambulatorio di Boretto, oltre il Po, c\'erano antibiotici.'), L('P', 'I ponti sono saltati. Ma sulla riva di Viadana ho visto delle barche.')],
  tWait:() => [L(TU, 'Due batterie. Cercate nelle case di Viadana, dentro le casse.')], tIdle:() => [L(TU, 'Costruite alto e spesso. Ogni terza notte arrivano in massa.')],
  bor:() => [L('P', 'Antibiotici veri, non scaduti. Pico ce la farà. Torniamo a Sabbioneta.')],
  irene:() => [L(IR, '…Grazie. Non so come dirlo meglio.'), L(IR, 'Quando avrete un letto libero alla base, chiamatemi: io i debiti li pago, e so ricucire.'), L(IR, 'Don Aldo l\'ho visto domenica dal campanile di Dosolo: cammina nella navata, avanti e indietro. Non credo dica più messa.')],
  iWait:() => [L(IR, 'Boretto, sull\'altra riva, a sud di Viadana. Fate piano.')], iIdle:() => [L(IR, 'Pico sta meglio. Dimmi tu quando partire.')],
  key:() => [L('H', 'Perdonami, don. La chiave ce l\'avevi ancora al collo.'), L('P', 'Lo conoscevo. Mi ha battezzato lui.'), L('P', 'Guastalla è oltre il fiume, a sud-est. Barca, o si nuota.')],
  gateNo:() => [L('H', 'Cemento armato e un cancello blindato. Senza la chiave di Don Aldo non si entra.')], gate:() => [L('P', 'Aperto. Dentro c\'è ancora la luce accesa.')],
  boss:() => [L('P', 'Ferm{o}. C\'è qualcosa di grosso tra i silos.'), L('H', 'Guidava la mietitrebbia, a giudicare dalla tuta.'), L('P', 'Adesso trascina la lama. Mira alla testa.')],
  termNo:() => [L('P', 'Con quella cosa nel cortile non ci avviciniamo nemmeno.')],
  term:() => [L('Registrazione', 'Giorno nove. Se stai ascoltando, {H}, sei arrivat{o} tardi. Va bene così. Sei arrivat{o}.'), L(MA, 'Chi beve smette di parlare in una notte. Ma ho trovato tre persone che hanno bevuto e parlano ancora. Una sono io.'), L(MA, 'Vado a Mantova, all\'ospedale: lì forse qualcuno sa perché. Vi lascio i disegni della lama di quella cosa.'),
    L(MA, 'E una cosa che non vi piacerà. Quando l\'ambulanza è finita nel canale, il canale era pieno.'), L(MA, 'Avete bevuto anche voi due. E parlate ancora. Non può essere un caso.'), L('P', '…{H}. Tu lo sapevi?'), L('H', 'No.'), L('P', 'Allora andiamo a Mantova a scoprirlo.')],
  pal:() => [L('P', 'Dimmi.')]
};
const BARK = { kill:['Uno in meno.', 'Bel colpo.', 'Giù.'], hurt:['Mi stanno addosso!', 'Perdo sangue!'], night:['Fa buio. Torniamo alla base?', 'Di notte corrono, {H}.'], raid:['Arrivano. Tutti insieme.', 'Tieni il Focolare!'], loot:['Guarda nelle case, non per strada.', 'Qui qualcuno aveva un\'arma.'], car:['Guida tu. Io guardo indietro.'], low:['Sono quasi a secco, {H}.'] };
const nearT = (n, pad) => { const t = TW(n); return Math.hypot(P.x - t.x, P.z - t.z) < t.r + (pad || 0); };
const MAIN = [
  { t:'Segui la radio: trova {P} nella chiesa di Pomponesco', tg:() => { const c = TW('Pomponesco').church; return [c[0], c[2]]; } },
  { t:'Colpisci gli alberi: raccogli 8 Legno', ok:() => st('g_legno') >= 8 },
  { t:'Menu, scheda Crea: fabbrica il Focolare e piazzalo. Sarà la vostra base', ok:() => core() != null, say:'base' },
  { t:'Fabbrica un Banco da lavoro e alza 4 muri o barricate attorno al Focolare', ok:() => st('pc_p_banco') >= 1 && st('walls') >= 4 },
  { t:'Superate la prima notte', ok:() => st('nights') >= 1, say:'night' },
  { t:'Viadana: cercate nelle case un\'arma da fuoco e 2 Batterie', tg:() => [TW('Viadana').x, TW('Viadana').z], ok:() => have('batterie') >= 2 && sv.guns.length > 0, say:'viad' },
  { t:'Portate le batterie a Tullio, dentro le mura di Sabbioneta', tg:() => [ROCCA.x, ROCCA.z - 3] },
  { t:'Boretto, oltre il Po: prendete una barca e cercate gli antibiotici nelle casse', tg:() => [TW('Boretto').x, TW('Boretto').z], ok:() => have('antibiotici') > 0, say:'bor' },
  { t:'Riportate gli antibiotici a Irene, a Sabbioneta', tg:() => [ROCCA.x - 4, ROCCA.z + 3] },
  { t:'Dosolo: la chiave del Consorzio è al collo di Don Aldo, in chiesa', tg:() => { const c = TW('Dosolo').church || [TW('Dosolo').x, 0, TW('Dosolo').z]; return [c[0], c[2]]; }, ok:() => have('chiave') > 0 },
  { t:'Guastalla, oltre il Po: aprite il laboratorio del Consorzio con la chiave', tg:() => [CONS.gx, CONS.gz], ok:() => !!sv.fl.gate },
  { t:'Abbattete il Mietitore e ascoltate la registrazione di Marta', tg:() => [CONS.gx + 7, CONS.gz], ok:() => !!sv.fl.end },
  { t:'Capitolo concluso. Marta è andata a Mantova. La bassa è vostra' } ];
const tgOf = () => { const g = MAIN[sv.q].tg; return g ? g() : null; };
const RW = { 0:{ c:10, x:20 }, 1:{ c:10, x:15 }, 2:{ c:15, x:20 }, 3:{ c:20, x:25 }, 4:{ c:30, x:40 }, 5:{ c:40, x:50 }, 6:{ c:40, x:50 }, 7:{ c:50, x:60 }, 8:{ c:50, x:60 }, 9:{ c:60, x:70 }, 10:{ c:60, x:60 }, 11:{ c:200, x:200, un:['falce'], m:'Arma segreta: Falce del Mietitore' } };
const SIDE = { orda:['La prima orda', 'Respingete un\'orda con il Focolare ancora in piedi', 'Ricetta: Balestra a scatto', () => st('raidsCore') >= 1, () => sv.un.push('torretta')], gigante:['Caccia grossa', 'Abbattete un Gigante: girano in campagna, lontano dai paesi', '150 monete e 2 punti attributo', () => !!sv.fl.k_gigante, () => { sv.coins += 150; sv.pts += 2; }],
  carte:['Carte sparse', 'Trovate i 5 documenti nei paesi', '+8 caselle nello zaino', () => sv.notes.length >= 5, () => { sv.slots += 8; invDirty = true; }], paesi:['Giro della bassa', 'Visitate 8 paesi', '100 monete', () => sv.area.length >= 8, () => sv.coins += 100],
  mani:['Mani in più', 'Portate 2 sopravvissuti alla base', '80 monete', () => Object.keys(sv.rec).length >= 2, () => sv.coins += 80], arsenale:['Arsenale', 'Trovate un\'arma Epica o Leggendaria', '60 monete', () => sv.guns.some(g => g.r >= 2), () => sv.coins += 60],
  ruote:['Su ruote', 'Guidate un\'auto fino a un altro paese', '40 monete', () => st('driveTown') >= 1, () => sv.coins += 40], forgia:['Ferro', 'Spaccate i massi col piccone e costruite una Forgia', '40 monete', () => st('pc_p_forgia') >= 1, () => sv.coins += 40] };

/* ================= SALVATAGGIO E DIFFICOLTÀ ================= */
const KEY = 'terra-muta-r1';
const DIFF = {
  facile:{ n:'Semplice', d:'Muti più deboli e più radi, fame lenta, orde piccole', hp:.7, dmg:.6, cap:.7, need:.7, raid:.7 }, normale:{ n:'Normale', d:'L\'equilibrio di base', hp:1, dmg:1, cap:1, need:1, raid:1 },
  difficile:{ n:'Difficile', d:'Muti più duri e numerosi, orde più grandi', hp:1.3, dmg:1.4, cap:1.3, need:1.2, raid:1.4 }, impossibile:{ n:'Impossibile', d:'Ogni errore si paga. Orde doppie', hp:1.8, dmg:2, cap:1.8, need:1.5, raid:2 },
  hardcore:{ n:'Hardcore', d:'Bonus: come Difficile, ma con una vita sola. Se muori il salvataggio viene cancellato e riparti da zero', hp:1.3, dmg:1.5, cap:1.3, need:1.3, raid:1.4, perma:1 } };
let sv = null;
const DF = () => DIFF[sv.diff] || DIFF.normale;
const fresh = () => ({ x:0, y:0, z:0, hp:80, hun:70, thi:65, arm:0, inv:[], slots:32, sel:0, tools:{}, guns:[], eq:0, t:0, q:0, fl:{}, looted:[], cut:[], built:[], chests:{}, spawn:null, coins:0, xp:0, lvl:1, pts:0, at:{}, st:{}, adv:[], un:[], seen:'', rec:{}, pets:[], cleared:[],
  raidN:0, raidDay:0, warned:0, nina:1, diff:'normale', fresh:1, notes:[], area:[], sd:[], drops:[], lootDay:{}, veh:null, hero:'antonio', pal:null });
function load() { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.inv) return Object.assign(fresh(), s); } catch (e) {} return null; }
function persist() { if (!sv || sv.gone) return; sv.x = P.x; sv.y = P.y; sv.z = P.z; sv.seen = Array.from(seen).join(''); sv.pets = an.filter(a => a.tame).map(a => ({ type:a.type, x:a.x, z:a.z, egg:a.egg, hp:a.hp })); sv.built = pieces.map(p => ({ k:p.k, x:p.x, z:p.z, r:p.r, id:p.id }));
  if (pal) sv.pal = { x:pal.x, z:pal.z, hp:pal.hp, wait:pal.wait }; try { localStorage.setItem(KEY, JSON.stringify(sv)); } catch (e) {} }

/* ================= STATO ================= */
const cv = $('cv'), ctx = cv.getContext('2d');
let W = 1, H = 1, DPR = 1;
function resize() { const r = $('app').getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height); DPR = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); }
window.addEventListener('resize', resize); resize();
let mode = 'title';
const P = { x:0, y:0, z:0, vy:0, r:.34, h:1.8, a:0, p:-.05, cd:0, gcd:0, hurt:0, walk:0, swing:0, ground:true, fallY:0, rel:0, flash:0, mark:0, ads:0, veh:null, trig:false, kickV:0 };
let zs = [], an = [], npcs = [], fx = [], pieces = [], drops = [], veh = [], pal = null, aim = false, tp = false, spawnT = 0, aniT = 0, saveT = 0, chkT = 0, raid = null, spotsOn = {}, turCd = {}, invDirty = true, ray = null, ctxAct = null, work = { o:null, p:0 }, pid = 1, barkT = 0;
const seen = new Uint8Array(SG * SG), hold = { a:false };
const st = k => sv.st[k] || 0;
const hours = () => sv.t / DAY * 24 + 7, hod = () => hours() % 24, dayN = () => Math.floor(hours() / 24) + 1, isNight = () => hod() >= 19 || hod() < 7;
const dark = () => { const h = hod(); return h >= 20 || h < 6 ? 1 : h >= 18.5 ? (h - 18.5) / 1.5 : h < 7.5 ? 1 - (h - 6) / 1.5 : 0; };
const maxHp = () => 100 + 15 * (sv.at.vig || 0);
const have = k => sv.inv.reduce((s, c) => s + (c && c.k === k ? c.n : 0), 0);
function add(k, n) { let left = n; for (const c of sv.inv) if (c && c.k === k && c.n < STACK) { const m = Math.min(left, STACK - c.n); c.n += m; left -= m; if (!left) break; }
  for (let i = 0; i < sv.slots && left > 0; i++) if (!sv.inv[i]) { const m = Math.min(left, STACK); sv.inv[i] = { k, n:m }; left -= m; } invDirty = true; return n - left; }
function take(k, n) { for (let i = sv.inv.length - 1; i >= 0 && n > 0; i--) { const c = sv.inv[i]; if (c && c.k === k) { const m = Math.min(n, c.n); c.n -= m; n -= m; if (!c.n) sv.inv[i] = null; } } invDirty = true; }
function gain(got, quiet) { const parts = []; let full = false; for (const k in got) { if (!got[k]) continue; if (k === 'monete') { sv.coins += got[k]; parts.push('+' + got[k] + ' monete'); continue; } const a = add(k, got[k]); if (a) { parts.push('+' + a + ' ' + IT[k].n); sv.st['g_' + k] = st('g_' + k) + a; } if (a < got[k]) full = true; } if (full) toast('Zaino pieno!'); else if (parts.length && !quiet) toast(parts.join(', ')); }
const canPay = c => Object.keys(c).every(k => have(k) >= c[k]), pay = c => { for (const k in c) take(k, c[k]); };
const costTxt = c => Object.keys(c).map(k => c[k] + ' ' + IT[k].n).join(', ');
const needXp = () => 30 + sv.lvl * 20;
function xp(n) { sv.xp += n; while (sv.xp >= needXp()) { sv.xp -= needXp(); sv.lvl++; sv.pts++; const c = 20 + sv.lvl * 5; sv.coins += c; toast('Livello ' + sv.lvl + '! +1 punto attributo, +' + c + ' monete'); sfx.story(); } }
function adv(k, n) { sv.st[k] = st(k) + (n || 1); for (let i = 0; i < ADV.length; i++) if (ADV[i][0] === k && sv.st[k] >= ADV[i][1] && !sv.adv.includes(i)) { sv.adv.push(i); sv.pts++; sv.coins += 20; toast('Traguardo: ' + ADV[i][2] + ' · +1 punto, +20 monete'); sfx.story(); } }
const core = () => pieces.find(p => PCS[p.k].core) || null;
function bark(k) { if (!pal || pal.down || barkT > 0) return; const a = BARK[k]; barkT = 9; toast(PN + ': ' + tx(a[Math.floor(Math.random() * a.length)])); }
