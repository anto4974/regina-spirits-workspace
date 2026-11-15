// Monta il gioco: guscio HTML + i pezzi di codice in ordine -> src/game.html (pagina unica) e www/ (per l'app).
const fs = require('fs'), path = require('path');
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const dir = path.join(__dirname, 'src', 'js');
const js = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
const shell = fs.readFileSync(path.join(__dirname, 'src', 'shell.html'), 'utf8');
const X = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/';
const page = shell + '<script src="' + CDN + '"></script>\n<script src="' + X + 'loaders/GLTFLoader.js"></script>\n<script src="' + X + 'utils/SkeletonUtils.js"></script>\n<script>\n(() => {\n\'use strict\';\n' + js + '\n})();\n</script>\n';
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
${page.replace(CDN, 'three.min.js').replace(X + 'loaders/GLTFLoader.js', 'GLTFLoader.js').replace(X + 'utils/SkeletonUtils.js', 'SkeletonUtils.js')}
</body>
</html>
`;
fs.mkdirSync(path.join(__dirname, 'www'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'www', 'index.html'), html);
fs.copyFileSync(path.join(__dirname, 'node_modules', 'three', 'build', 'three.min.js'), path.join(__dirname, 'www', 'three.min.js'));
for (const [f, d] of [['loaders/GLTFLoader.js', 'GLTFLoader.js'], ['utils/SkeletonUtils.js', 'SkeletonUtils.js']]) fs.copyFileSync(path.join(__dirname, 'node_modules', 'three', 'examples', 'js', f), path.join(__dirname, 'www', d));
fs.mkdirSync(path.join(__dirname, 'www', 'assets'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'assets'))) if (f.endsWith('.gltf')) fs.copyFileSync(path.join(__dirname, 'assets', f), path.join(__dirname, 'www', 'assets', f.replace('.gltf', '.json'))); // il glTF è JSON: servito con questa estensione
console.log('montato: src/game.html (' + Math.round(page.length / 1024) + ' KB) e www/');
