// Servidor estático mínimo para ver/renderizar os modelos: raiz = scripts/ (para achar o three do wmed-app).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png', '.wasm': 'application/wasm' };
const port = +(process.argv[2] || 3070);
createServer(async (q, r) => {
  const p = normalize(decodeURIComponent(q.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  try { const b = await readFile(join(ROOT, p)); r.writeHead(200, { 'Content-Type': T[extname(p)] || 'application/octet-stream' }); r.end(b); }
  catch { r.writeHead(404); r.end('404'); }
}).listen(port, '127.0.0.1', () => console.log(`modelos em http://127.0.0.1:${port}/wmed-video-studio/models3d/view.html`));
