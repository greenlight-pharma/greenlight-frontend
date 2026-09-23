import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:process.env.VITE_BASE||'/',plugins:[react()],server:{host:'127.0.0.1',port:5198,strictPort:true,proxy:{'/wmed/acervo':{target:'https://app.vytalsaude.com.br',changeOrigin:true,rewrite:p=>p.replace('/wmed/acervo','/academico-assets')},'/api':'http://127.0.0.1:5199'}},build:{rollupOptions:{output:{manualChunks:{three:['three','three/addons/loaders/GLTFLoader.js','three/addons/controls/OrbitControls.js']}}},chunkSizeWarningLimit:800}});
