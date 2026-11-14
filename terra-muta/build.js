// Genera www/index.html (la pagina che Capacitor impacchetta nell'app) a partire da src/game.html.
// La libreria 3D viene copiata dentro l'app, così il gioco funziona anche senza rete.
const fs = require('fs');
const path = require('path');
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
let src = fs.readFileSync(path.join(__dirname, 'src', 'game.html'), 'utf8');
if (!src.includes(CDN)) throw new Error('riferimento alla libreria 3D non trovato');
src = src.replace(CDN, 'three.min.js');
const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0c0e0d">
<style>[hidden]{display:none!important}</style>
</head>
<body>
${src}
</body>
</html>
`;
fs.mkdirSync(path.join(__dirname, 'www'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'www', 'index.html'), html);
fs.copyFileSync(path.join(__dirname, 'node_modules', 'three', 'build', 'three.min.js'), path.join(__dirname, 'www', 'three.min.js'));
console.log('www/index.html generato');
