// Genera www/index.html (la pagina che Capacitor impacchetta nell'app) a partire da src/game.html.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'src', 'game.html'), 'utf8');
const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#070b14">
<style>[hidden]{display:none!important}</style>
</head>
<body>
${src}
</body>
</html>
`;
fs.mkdirSync(path.join(__dirname, 'www'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'www', 'index.html'), html);
console.log('www/index.html generato');
