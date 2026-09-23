import React,{useEffect,useRef,useState} from 'react';
import {FlaskConical,Info,Layers3,RotateCcw,ScanLine,Target,ChevronRight,Play,Pause} from 'lucide-react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {useWorkspaceHeight} from './academic/useWorkspaceHeight';
import {scenePoint,projectionFov,matchingStructures} from './xray/geometry.mjs';
import './xray/lab.css';
const BASE=`${import.meta.env.BASE_URL}xray/pelvis/`;
function Anatomy({data,view,selected,onSelect,reset}){
 const host=useRef(null),api=useRef(null),latest=useRef({onSelect});latest.current={onSelect};
 const [status,setStatus]=useState('Preparando anatomia…');
 useEffect(()=>{
  const el=host.current;let disposed=false,frame=0;let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch{setStatus('Seu navegador não disponibilizou o 3D. As projeções continuam disponíveis.');return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;el.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label','Anatomia da mesma tomografia. Toque em um osso para destacar.');
  const scene=new THREE.Scene(),root=new THREE.Group();scene.add(root);
  scene.add(new THREE.HemisphereLight(0xf0f5ff,0x35435a,2));
  for(const [x,y,z,p]of[[300,400,-500,2],[-300,50,400,1.5]]){const light=new THREE.DirectionalLight(0xffffff,p);light.position.set(x,y,z);scene.add(light)}
  const camera=new THREE.PerspectiveCamera(projectionFov(data),1,1,4000);camera.zoom=1.35;camera.updateProjectionMatrix();camera.position.set(...scenePoint(view.sourceRAS));camera.lookAt(0,0,0);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableRotate=false;controls.enablePan=false;controls.enableDamping=true;controls.minDistance=360;controls.maxDistance=1000;
  const materialList=[];const raycaster=new THREE.Raycaster();let pointerDown=null;
  const down=e=>{pointerDown=[e.clientX,e.clientY]},pick=e=>{if(!pointerDown||Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1])>5)return;const r=el.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=raycaster.intersectObjects(root.children,true).find(h=>h.object.isMesh);if(hit){let n=hit.object;while(n&&!data.parts.some(p=>p.id===n.name))n=n.parent;if(n)latest.current.onSelect(n.name)}};
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',pick);
  const fit=()=>{if(!el.clientWidth||!el.clientHeight)return;renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.fov=projectionFov(data,Math.min(1,camera.aspect));camera.updateProjectionMatrix()};
  const observer=new ResizeObserver(fit);observer.observe(el);fit();
  function release(object){object.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of(Array.isArray(o.material)?o.material:[o.material]))m.dispose()})}
  new GLTFLoader().load(BASE+'pelvis.glb',g=>{if(disposed){release(g.scene);return}g.scene.traverse(o=>{if(!o.isMesh)return;if(!o.geometry.attributes.normal)o.geometry.computeVertexNormals();let n=o;while(n&&!data.parts.some(p=>p.id===n.name))n=n.parent;o.userData.part=n?.name;for(const m of(Array.isArray(o.material)?o.material:[o.material]))m.dispose();o.material=new THREE.MeshStandardMaterial({color:data.parts.find(p=>p.id===n?.name)?.color||'#ded5c0',roughness:.66});materialList.push(o)});root.add(g.scene);setStatus('')},undefined,()=>{if(!disposed)setStatus('Não foi possível carregar a anatomia. Recarregue a página para tentar novamente.')});
  api.current={camera,controls,materialList};
  const tick=()=>{frame=requestAnimationFrame(tick);controls.update();renderer.render(scene,camera)};tick();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();release(root);renderer.dispose();renderer.domElement.remove();api.current=null};
 },[data]);
 useEffect(()=>{const a=api.current;if(!a)return;a.camera.position.set(...scenePoint(view.sourceRAS));a.controls.target.set(0,0,0);a.camera.lookAt(0,0,0);a.controls.update()},[view,reset]);
 useEffect(()=>{for(const mesh of api.current?.materialList||[]){const active=mesh.userData.part===selected;mesh.material.color.set(active?'#62dfd4':data.parts.find(p=>p.id===mesh.userData.part)?.color||'#ded5c0');mesh.material.emissive.set(active?'#104f49':'#000000');mesh.material.emissiveIntensity=.5}},[selected,data,status]);
 return <div className="xr-model"><div className="xr-webgl" ref={host}/>{status&&<p role="status" className="xr-loading">{status}</p>}</div>
}
function Radiograph({data,view,selected,onSelect,overlay,contrast}){
 const canvas=useRef(null),bits=useRef(null),[status,setStatus]=useState('Carregando projeção…');
 useEffect(()=>{
  let stopped=false;setStatus('Carregando projeção…');bits.current=null;
  const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});
  Promise.all([load(BASE+view.image),load(BASE+view.mask)]).then(([rx,mask])=>{
   if(stopped)return;const c=canvas.current;c.width=data.size;c.height=data.size;const ctx=c.getContext('2d');ctx.drawImage(mask,0,0);const bitpixels=ctx.getImageData(0,0,c.width,c.height).data;bits.current=bitpixels;ctx.drawImage(rx,0,0);const image=ctx.getImageData(0,0,c.width,c.height),part=data.parts.find(p=>p.id===selected);
   for(let i=0;i<image.data.length;i+=4){const tone=Math.round(255*Math.pow(image.data[i]/255,contrast));image.data[i]=image.data[i+1]=image.data[i+2]=tone;}
   if(overlay&&part)for(let i=0;i<bitpixels.length;i+=4){if(bitpixels[i]&part.bit){image.data[i]=image.data[i]*.50+30;image.data[i+1]=image.data[i+1]*.5+118;image.data[i+2]=image.data[i+2]*.5+107}}
   ctx.putImageData(image,0,0);setStatus('');
  }).catch(()=>{if(!stopped)setStatus('Não foi possível carregar esta projeção. Escolha outra incidência ou recarregue.')});
  return()=>{stopped=true};
 },[data,view,selected,overlay,contrast]);
 const pick=e=>{if(!bits.current)return;const box=canvas.current.getBoundingClientRect(),side=Math.min(box.width,box.height),r={left:box.left+(box.width-side)/2,top:box.top+(box.height-side)/2,width:side,height:side};if(e.clientX<r.left||e.clientX>r.left+side||e.clientY<r.top||e.clientY>r.top+side)return;const x=Math.min(data.size-1,Math.max(0,Math.floor((e.clientX-r.left)/r.width*data.size))),y=Math.min(data.size-1,Math.max(0,Math.floor((e.clientY-r.top)/r.height*data.size)));const matches=matchingStructures(bits.current[(y*data.size+x)*4],data.parts);if(matches.length){const next=(matches.findIndex(p=>p.id===selected)+1)%matches.length;onSelect(matches[next].id)}};
 return <div className="xr-radiograph"><canvas ref={canvas} onClick={pick} aria-label="Radiografia simulada. Toque em um osso ou use a lista de estruturas."/>{status&&<p className="xr-loading" role="status">{status}</p>}<span className="xr-stamp">RX SIMULADO · TC REAL</span>{view.angle===0&&<><span className="xr-marker left">D</span><span className="xr-marker right">E</span></>}</div>
}
export default function XrayLab(){
 const [data,setData]=useState(null),[failed,setFailed]=useState(false),[index,setIndex]=useState(0),[selected,setSelected]=useState(''),[overlay,setOverlay]=useState(true),[info,setInfo]=useState(false),[playing,setPlaying]=useState(false),[reset,setReset]=useState(0),[quiz,setQuiz]=useState(false);
 const [contrast,setContrast]=useState(3);
 const ref=useWorkspaceHeight();
 useEffect(()=>{const c=new AbortController();fetch(BASE+'catalog.json',{signal:c.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(setData).catch(e=>{if(e.name!=='AbortError')setFailed(true)});return()=>c.abort()},[]);
 useEffect(()=>{if(!playing||!data)return;const t=setInterval(()=>setIndex(i=>(i+1)%data.views.length),1400);return()=>clearInterval(t)},[playing,data]);
 if(!data)return <div className="module-page" role="status">{failed?<>Não foi possível abrir o laboratório. <button onClick={()=>location.reload()}>Tentar novamente</button></>:'Preparando o laboratório de radiografia…'}</div>;
 const view=data.views[index],part=data.parts.find(p=>p.id===selected),incidence=view.angle===0?'Frontal · AP':view.angle===90?'Perfil':'Oblíqua';
 function choose(id){setSelected(id);setPlaying(false)}
 return <section ref={ref} className="xr-lab" aria-label="Laboratório de radiografia em 3D">
  <header className="xr-header"><div><span className="xr-eyebrow"><FlaskConical size={12}/> LABORATÓRIO DE IDEIAS <b>PROTÓTIPO</b></span><h1>Radiografia em 3D</h1><p>Pelve · Veja a mesma anatomia no 3D e na projeção.</p></div><button onClick={()=>setInfo(!info)} aria-expanded={info}><Info size={17}/><span>Sobre o exame</span></button></header>
  {info&&<aside className="xr-info"><button aria-label="Fechar informações" onClick={()=>setInfo(false)}>×</button><strong>Simulação educacional, sem diagnóstico</strong><p>{data.limitations}</p><p>Projeções geradas pelo DiffDRR. As malhas e os destaques vêm das segmentações da mesma TC. Este protótipo não executa alinhamento automático XVR nem aceita exames enviados.</p><p>{data.source} · <a href={data.sourceUrl} target="_blank" rel="noreferrer">Fonte e artigo</a> · <a href={data.licenseUrl} target="_blank" rel="noreferrer">CC BY 4.0</a></p></aside>}
  <div className="xr-toolbar"><div className="xr-presets">{[[0,'Frontal'],[45,'Oblíqua'],[90,'Perfil']].map(([angle,label])=><button key={angle} aria-pressed={view.angle===angle} onClick={()=>{setIndex(data.views.findIndex(v=>v.angle===angle));setPlaying(false)}}>{label}</button>)}</div><label className="xr-slider"><span>Incidência <b>{view.angle}°</b></span><input type="range" min="0" max={data.views.length-1} value={index} onChange={e=>{setIndex(+e.target.value);setPlaying(false)}} aria-label="Ângulo da incidência" aria-valuetext={`${view.angle} graus`}/></label><button className="xr-play" aria-label={playing?'Pausar incidências':'Reproduzir incidências'} aria-pressed={playing} onClick={()=>setPlaying(!playing)}>{playing?<Pause size={16}/>:<Play size={16}/>}</button></div>
  <div className="xr-panes"><article className="xr-pane xr-anatomy"><div className="xr-pane-title"><span>01 / ANATOMIA DA TC</span><button aria-label="Restaurar aproximação" onClick={()=>setReset(r=>r+1)}><RotateCcw size={15}/></button></div><Anatomy data={data} view={view} selected={selected} onSelect={choose} reset={reset}/><div className="xr-view-caption"><span className="xr-dot"/> {incidence} <small>Giro vinculado à incidência · zoom livre</small></div></article>
   <article className="xr-pane xr-image"><div className="xr-pane-title"><span>02 / PROJEÇÃO SIMULADA</span><button aria-pressed={overlay} onClick={()=>setOverlay(!overlay)}><Layers3 size={15}/><span>Destaque</span></button></div><Radiograph contrast={contrast} data={data} view={view} selected={selected} onSelect={choose} overlay={overlay}/><div className="xr-view-caption"><label className="xr-contrast">Contraste ósseo <input aria-label="Contraste da radiografia" type="range" min="1" max="5" step=".1" value={contrast} onChange={e=>setContrast(+e.target.value)}/></label><button onClick={()=>setContrast(3)}>Restaurar</button></div></article></div>
  <div className="xr-bottom"><label>ESTRUTURA<select aria-label="Estrutura anatômica" value={selected} onChange={e=>choose(e.target.value)}><option value="">Escolha uma estrutura</option>{data.parts.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label><div className="xr-learning" aria-live="polite">{quiz?<><strong>Encontre o sacro no RX.</strong><p>{selected?(selected==='sacrum'?'Correto! Compare sua projeção frontal e oblíqua.':'Essa é outra estrutura. Tente novamente na imagem ou na lista.'):'Toque na região correspondente para responder.'}</p></>:<><strong>{part?.name||'Uma imagem, várias estruturas sobrepostas.'}</strong><p>{part?.hint||'Escolha um osso e mude a incidência para entender sua projeção.'}</p></>}</div><button className="xr-challenge" aria-pressed={quiz} onClick={()=>{setQuiz(!quiz);setSelected('');setPlaying(false)}}><Target size={16}/>{quiz?'Sair do desafio':'Testar meu olhar'}<ChevronRight size={14}/></button></div>
 </section>
}
