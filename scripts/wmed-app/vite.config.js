import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {readdirSync,statSync,writeFileSync} from 'node:fs';
import {join,relative} from 'node:path';
import {createHash} from 'node:crypto';
// Lista do núcleo offline (precache.json) lida pelo service worker. Modelos 3D (pastas pesadas) ficam de fora: entram sob demanda.
const CORE=['index.html','manifest.webmanifest','assets','dados','fonts','brand'];
function precache(){let base='/',out='dist';return {name:'wmed-precache',apply:'build',configResolved(c){base=c.base;out=c.build.outDir;},closeBundle(){
 const files=[],walk=p=>{const s=statSync(p);if(s.isDirectory())readdirSync(p).forEach(f=>walk(join(p,f)));else if(s.size<3_000_000)files.push(relative(out,p).split('\\').join('/'));};
 CORE.forEach(p=>{try{walk(join(out,p));}catch{}});
 const version=createHash('sha256').update(files.map(f=>f+statSync(join(out,f)).size).join('|')).digest('hex').slice(0,12);
 writeFileSync(join(out,'precache.json'),JSON.stringify({version,index:base+'index.html',files:[base,...files.map(f=>base+f)]}));
}};}
export default defineConfig({base:process.env.VITE_BASE||'/',plugins:[react(),precache()],server:{host:'127.0.0.1',port:5198,strictPort:true,proxy:{'/wmed/acervo':{target:'https://app.vytalsaude.com.br',changeOrigin:true,rewrite:p=>p.replace('/wmed/acervo','/academico-assets')},'/api':'http://127.0.0.1:5199'}},build:{rollupOptions:{output:{manualChunks:{three:['three','three/addons/loaders/GLTFLoader.js','three/addons/controls/OrbitControls.js']}}},chunkSizeWarningLimit:800}});
