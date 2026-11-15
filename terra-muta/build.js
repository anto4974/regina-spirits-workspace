// Monta il gioco: guscio HTML + i pezzi di codice in ordine -> src/game.html (pagina unica) e www/ (per l'app).
const fs = require('fs'), path = require('path');
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const dir = path.join(__dirname, 'src', 'js');
const js = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
const shell = fs.readFileSync(path.join(__dirname, 'src', 'shell.html'), 'utf8');
const page = shell + '<script src="' + CDN + '"></script>\n<script>\n(() => {\n\'use strict\';\n' + js + '\n})();\n</script>\n';
fs.writeFileSync(path.join(__dirname, 'src', 'game.html'), page);
const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0c0e0d">
<style>[hidden]{display:none!important}</style>
</head>
<body>
${page.replace(CDN, 'three.min.js')}
</body>
</html>
`;
fs.mkdirSync(path.join(__dirname, 'www'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'www', 'index.html'), html);
fs.copyFileSync(path.join(__dirname, 'node_modules', 'three', 'build', 'three.min.js'), path.join(__dirname, 'www', 'three.min.js'));
console.log('montato: src/game.html (' + Math.round(page.length / 1024) + ' KB) e www/');
