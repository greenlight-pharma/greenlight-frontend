import React,{useEffect,useRef,useState} from 'react';
import {FlaskConical,Info,Layers3,RotateCcw,ScanLine,Target,ChevronRight,Play,Pause} from 'lucide-react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {useWorkspaceHeight} from './academic/useWorkspaceHeight';
import {scenePoint,projectionFov,matchingStructures} from './xray/geometry.mjs';
import './xray/lab.css';
import RegistrationPractice from './xray/RegistrationPractice';
import {tone,isBoundary,detectorPoint} from './xray/imaging.mjs';
import {createStage,lumenEnabled,lumenize,lumenTheme} from './lumen/lumen';
const ROOT=`${import.meta.env.BASE_URL}xray/`;
const REGIONS=[['torax','Tórax'],['abdome','Abdome'],['lombar','Coluna lombar'],['pelvis','Pelve']];
function RegionPicker({region,onRegion}){return <label className="xr-region-picker">REGIÃO<select aria-label="Região do exame" value={region} onChange={e=>onRegion(e.target.value)}>{REGIONS.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></label>}
function Anatomy({data,view,selected,onSelect,reset,geometry,probe}){
 const BASE=data.baseUrl;
 const host=useRef(null),api=useRef(null),latest=useRef({onSelect,geometry});latest.current={onSelect,geometry};
 const [status,setStatus]=useState('Preparando anatomia…');
 useEffect(()=>{
  const el=host.current;let disposed=false,frame=0;let renderer;const lumen=lumenEnabled();let stage=null,version=0;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:!lumen})}catch{setStatus('Seu navegador não disponibilizou o 3D. As projeções continuam disponíveis.');return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;el.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label','Anatomia da mesma tomografia. Toque em uma estrutura para destacar.');
  const scene=new THREE.Scene(),root=new THREE.Group(),rig=new THREE.Group();scene.add(root,rig);
  if(!lumen){scene.add(new THREE.HemisphereLight(0xf0f5ff,0x35435a,2));
  for(const [x,y,z,p]of[[300,400,-500,2],[-300,50,400,1.5]]){const light=new THREE.DirectionalLight(0xffffff,p);light.position.set(x,y,z);scene.add(light)}}
  const camera=new THREE.PerspectiveCamera(projectionFov(data),1,1,4000);camera.zoom=data.displayZoom??1.35;camera.updateProjectionMatrix();camera.position.set(...scenePoint(view.sourceRAS));camera.lookAt(0,0,0);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableRotate=false;controls.enablePan=false;controls.enableDamping=true;controls.minDistance=360;controls.maxDistance=1000;
  if(lumen)stage=createStage(renderer,scene,camera,{controls});
  const themeWatch=new MutationObserver(()=>stage?.setTheme(lumenTheme()));themeWatch.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  const materialList=[];const raycaster=new THREE.Raycaster();let pointerDown=null;
  const down=e=>{pointerDown=[e.clientX,e.clientY]},pick=e=>{if(!pointerDown||Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1])>5)return;const r=el.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=raycaster.intersectObjects(root.children,true).find(h=>h.object.isMesh);if(hit){let n=hit.object;while(n&&!data.parts.some(p=>p.id===n.name))n=n.parent;if(n)latest.current.onSelect(n.name)}};
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',pick);
  const fit=()=>{if(!el.clientWidth||!el.clientHeight)return;renderer.setSize(el.clientWidth,el.clientHeight);stage?.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.fov=latest.current.geometry?43:projectionFov(data,Math.min(1,camera.aspect));camera.updateProjectionMatrix()};
  const observer=new ResizeObserver(fit);observer.observe(el);fit();
  function release(object){object.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of(Array.isArray(o.material)?o.material:[o.material]))m.dispose()})}
  new GLTFLoader().load(BASE+(data.model||'pelvis.glb'),g=>{if(disposed){release(g.scene);return}g.scene.traverse(o=>{if(!o.isMesh)return;if(!o.geometry.attributes.normal)o.geometry.computeVertexNormals();let n=o;while(n&&!data.parts.some(p=>p.id===n.name))n=n.parent;o.userData.part=n?.name;for(const m of(Array.isArray(o.material)?o.material:[o.material]))m.dispose();o.material=new THREE.MeshStandardMaterial({color:data.parts.find(p=>p.id===n?.name)?.color||'#ded5c0',roughness:.66,transparent:(data.parts.find(p=>p.id===n?.name)?.opacity??1)<1,opacity:data.parts.find(p=>p.id===n?.name)?.opacity??1,depthWrite:(data.parts.find(p=>p.id===n?.name)?.opacity??1)===1});materialList.push(o)});if(lumen){lumenize(g.scene,{membranes:false});g.scene.traverse(o=>{if(o.isMesh)o.material.rimBoost=.6})}root.add(g.scene);stage?.setSubject(root);setStatus('')},undefined,()=>{if(!disposed)setStatus('Não foi possível carregar a anatomia. Recarregue a página para tentar novamente.')});
  api.current={camera,controls,materialList,rig,changed(){version++;stage?.refreshShadow()}};
  const tick=()=>{frame=requestAnimationFrame(tick);controls.update();if(stage)stage.render(String(version));else renderer.render(scene,camera)};tick();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();themeWatch.disconnect();stage?.dispose();controls.dispose();release(root);rig.traverse(o=>{o.geometry?.dispose();o.material?.map?.dispose();o.material?.dispose()});renderer.dispose();renderer.domElement.remove();api.current=null};
 },[data]);
 useEffect(()=>{const a=api.current;if(!a)return;a.controls.enableRotate=!!geometry;a.controls.minDistance=geometry?500:360;a.controls.maxDistance=geometry?4000:1000;
  a.camera.zoom=geometry?1:(data.displayZoom??1.35);a.camera.fov=geometry?43:projectionFov(data,Math.min(1,a.camera.aspect));a.camera.updateProjectionMatrix();
  a.camera.position.set(...(geometry?[1170,660,935]:scenePoint(view.sourceRAS)));a.controls.target.set(0,0,0);a.camera.lookAt(0,0,0);a.controls.update();
 },[view,reset,geometry,data]);
 useEffect(()=>{const a=api.current;if(!a)return;const g=a.rig;let cancelled=false;
  const clear=()=>{g.traverse(o=>{o.geometry?.dispose();o.material?.map?.dispose();o.material?.dispose()});g.clear()};clear();a.changed?.();if(!geometry)return;
  const src=new THREE.Vector3(...scenePoint(view.sourceRAS)),corners=view.detectorCornersRAS.map(p=>new THREE.Vector3(...scenePoint(p)));
  const label=(text,position)=>{const c=document.createElement('canvas');c.width=256;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#101a27';ctx.fillRect(0,0,256,64);ctx.fillStyle='#edf2f7';ctx.font='28px sans-serif';ctx.textAlign='center';ctx.fillText(text,128,43);const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map,depthTest:false}));sprite.position.copy(position);sprite.scale.set(230,58,1);g.add(sprite)};
  label('Fonte de raios X',src.clone().add(new THREE.Vector3(0,65,0)));label('Detector',corners[0].clone().add(corners[1]).multiplyScalar(.5).add(new THREE.Vector3(0,65,0)));label('Anatomia da TC',new THREE.Vector3(0,-200,0));
  const source=new THREE.Mesh(new THREE.SphereGeometry(18,18,12),new THREE.MeshBasicMaterial({color:'#efb75f'}));source.position.copy(src);g.add(source);
  const vertices=new Float32Array(corners.flatMap(c=>c.toArray())),geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,1,1,1,0,0,1,0],2));geo.setIndex([0,2,1,1,2,3]);geo.computeVertexNormals();
  const mat=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,transparent:true,opacity:.85});g.add(new THREE.Mesh(geo,mat));
  const img=new Image();img.onload=()=>{if(cancelled)return;const c=document.createElement('canvas');c.width=c.height=data.size;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const pixels=ctx.getImageData(0,0,c.width,c.height);for(let i=0;i<pixels.data.length;i+=4)pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=tone(pixels.data[i]);ctx.putImageData(pixels,0,0);mat.map=new THREE.CanvasTexture(c);mat.map.colorSpace=THREE.SRGBColorSpace;mat.needsUpdate=true;a.changed?.()};img.src=BASE+view.image;
  const segments=[];for(const c of corners)segments.push(...src.toArray(),...c.toArray());for(const [i,j]of[[0,1],[1,3],[3,2],[2,0]])segments.push(...corners[i].toArray(),...corners[j].toArray());
  const lineGeo=new THREE.BufferGeometry();lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(segments,3));g.add(new THREE.LineSegments(lineGeo,new THREE.LineBasicMaterial({color:'#6f9eb6',transparent:true,opacity:.4})));
  if(probe){const point=new THREE.Vector3(...scenePoint(detectorPoint(view,probe[0],probe[1]))),line=new THREE.BufferGeometry().setFromPoints([src,point]);g.add(new THREE.Line(line,new THREE.LineBasicMaterial({color:'#edb458',depthTest:false})));const dot=new THREE.Mesh(new THREE.SphereGeometry(9,12,8),new THREE.MeshBasicMaterial({color:'#edb458',depthTest:false}));dot.position.copy(point);g.add(dot)}
  a.changed?.();
  return()=>{cancelled=true;clear()};
 },[data,view,geometry,probe]);
 useEffect(()=>{for(const mesh of api.current?.materialList||[]){const active=mesh.userData.part===selected;mesh.material.color.set(active?'#62dfd4':data.parts.find(p=>p.id===mesh.userData.part)?.color||'#ded5c0');mesh.material.emissive.set(active?'#104f49':'#000000');mesh.material.emissiveIntensity=.5;const opacity=selected?(active?1:.14):(data.parts.find(p=>p.id===mesh.userData.part)?.opacity??1);if(mesh.material.transparent!==(opacity<1)){mesh.material.transparent=opacity<1;mesh.material.needsUpdate=true;}mesh.material.opacity=opacity;mesh.material.depthWrite=opacity===1}api.current?.changed?.()},[selected,data,status]);
 return <div className="xr-model"><div className="xr-webgl" ref={host}/>{status&&<p role="status" className="xr-loading">{status}</p>}</div>
}
function Radiograph({data,view,selected,onSelect,overlay,contrast,onProbe,probe}){
 const BASE=data.baseUrl;
 const canvas=useRef(null),bits=useRef(null),[status,setStatus]=useState('Carregando projeção…');
 useEffect(()=>{
  let stopped=false;setStatus('Carregando projeção…');bits.current=null;
  const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});
  Promise.all([load(BASE+view.image),load(BASE+view.mask)]).then(([rx,mask])=>{
   if(stopped)return;const c=canvas.current;c.width=data.size;c.height=data.size;const ctx=c.getContext('2d');ctx.drawImage(mask,0,0);const bitpixels=ctx.getImageData(0,0,c.width,c.height).data;bits.current=bitpixels;ctx.drawImage(rx,0,0);const image=ctx.getImageData(0,0,c.width,c.height),part=data.parts.find(p=>p.id===selected);
   for(let i=0;i<image.data.length;i+=4){const value=tone(image.data[i],contrast);image.data[i]=image.data[i+1]=image.data[i+2]=value;}
   if(overlay!=='off'&&part)for(let i=0;i<bitpixels.length;i+=4){const x=(i/4)%data.size,y=Math.floor(i/4/data.size),matches=part?[part]:data.parts;
    if(matches.some(p=>overlay==='contours'?isBoundary(bitpixels,x,y,data.size,data.size,p.bit):(bitpixels[i]&p.bit)!==0)){
      const alpha=overlay==='contours'?.95:.35;image.data[i]=image.data[i]*(1-alpha)+50*alpha;image.data[i+1]=image.data[i+1]*(1-alpha)+215*alpha;image.data[i+2]=image.data[i+2]*(1-alpha)+190*alpha;
    }
   }
   ctx.putImageData(image,0,0);if(probe){const x=probe[0]*(data.size-1),y=probe[1]*(data.size-1);ctx.strokeStyle='#edb458';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.moveTo(x-11,y);ctx.lineTo(x+11,y);ctx.moveTo(x,y-11);ctx.lineTo(x,y+11);ctx.stroke()}setStatus('');
  }).catch(()=>{if(!stopped)setStatus('Não foi possível carregar esta projeção. Escolha outra incidência ou recarregue.')});
  return()=>{stopped=true};
 },[data,view,selected,overlay,contrast,probe]);
 const pick=e=>{if(!bits.current)return;const box=canvas.current.getBoundingClientRect(),side=Math.min(box.width,box.height),r={left:box.left+(box.width-side)/2,top:box.top+(box.height-side)/2,width:side,height:side};if(e.clientX<r.left||e.clientX>r.left+side||e.clientY<r.top||e.clientY>r.top+side)return;const x=Math.min(data.size-1,Math.max(0,Math.floor((e.clientX-r.left)/r.width*data.size))),y=Math.min(data.size-1,Math.max(0,Math.floor((e.clientY-r.top)/r.height*data.size)));onProbe?.([x/(data.size-1),y/(data.size-1)]);const matches=matchingStructures(bits.current[(y*data.size+x)*4],data.parts);if(matches.length){const next=(matches.findIndex(p=>p.id===selected)+1)%matches.length;onSelect(matches[next].id)}};
 return <div className="xr-radiograph"><canvas ref={canvas} style={{transform:`scale(${data.displayZoom??1.35})`}} onClick={pick} aria-label="Radiografia simulada. Toque em uma estrutura ou use a lista de estruturas."/>{status&&<p className="xr-loading" role="status">{status}</p>}<span className="xr-stamp">RX SIMULADO · TC REAL</span>{view.angle===0&&<><span className="xr-marker left">D</span><span className="xr-marker right">E</span></>}</div>
}
export default function XrayLab(){const [region,setRegion]=useState('torax');return <XrayRegion key={region} region={region} onRegion={setRegion}/>;}
function XrayRegion({region,onRegion}){
 const BASE=ROOT+region+'/';
 const [data,setData]=useState(null),[failed,setFailed]=useState(false),[index,setIndex]=useState(0),[selected,setSelected]=useState(''),[overlay,setOverlay]=useState('contours'),[info,setInfo]=useState(false),[playing,setPlaying]=useState(false),[reset,setReset]=useState(0),[quiz,setQuiz]=useState(false);
 const [contrast,setContrast]=useState(3),[mode,setMode]=useState('explore'),[probe,setProbe]=useState(null);
 const ref=useWorkspaceHeight();
 useEffect(()=>setProbe(null),[index]);
 useEffect(()=>{const c=new AbortController();fetch(BASE+'catalog.json',{signal:c.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>setData({...d,baseUrl:BASE})).catch(e=>{if(e.name!=='AbortError')setFailed(true)});return()=>c.abort()},[]);
 useEffect(()=>{if(!playing||!data)return;const t=setInterval(()=>setIndex(i=>(i+1)%data.views.length),1400);return()=>clearInterval(t)},[playing,data]);
 if(!data)return <div className="module-page" role="status"><RegionPicker region={region} onRegion={onRegion}/>{failed?<>Não foi possível abrir o laboratório. <button onClick={()=>location.reload()}>Tentar novamente</button></>:'Preparando o laboratório de radiografia…'}</div>;
 const view=data.views[index],part=data.parts.find(p=>p.id===selected),incidence=view.angle===0?'Frontal · AP':view.angle===90?'Perfil':'Oblíqua';
 const challenge=data.parts.find(p=>p.id===(data.challenge||'sacrum'));
 function choose(id){setSelected(id);setPlaying(false)}
 return <section ref={ref} className="xr-lab" aria-label="Laboratório de radiografia em 3D">
  <header className="xr-header"><div><span className="xr-eyebrow"><FlaskConical size={12}/> LABORATÓRIO DE IDEIAS <b>PROTÓTIPO</b></span><h1>Radiografia em 3D</h1><p>{data.regionTitle||'Pelve'} · Projeções simuladas da TC, com anatomia correspondente.</p></div><div className="xr-header-actions"><RegionPicker region={region} onRegion={onRegion}/><button aria-label="Sobre o exame" onClick={()=>setInfo(!info)} aria-expanded={info}><Info size={17}/><span>Sobre o exame</span></button></div></header>
  {info&&<aside className="xr-info"><button aria-label="Fechar informações" onClick={()=>setInfo(false)}>×</button><strong>Simulação educacional, sem diagnóstico</strong><p>{data.limitations}</p><p>Projeções geradas pelo DiffDRR. As malhas e os destaques vêm das segmentações da mesma TC. Este protótipo não executa alinhamento automático XVR nem aceita exames enviados.</p><p>{data.source} · <a href={data.sourceUrl} target="_blank" rel="noreferrer">Fonte e artigo</a> · <a href={data.licenseUrl} target="_blank" rel="noreferrer">CC BY 4.0</a></p></aside>}
  <nav className="xr-modes" aria-label="Modo do laboratório">{[['explore','Explorar anatomia'],['geometry','Como se forma o RX'],['registration','Alinhar projeções']].map(([id,label])=><button key={id} aria-pressed={mode===id} onClick={()=>{setMode(id);setPlaying(false)}}>{label}</button>)}</nav>
  {mode==='registration'?<RegistrationPractice data={data}/>:<>
  <div className="xr-toolbar"><div className="xr-presets">{[[0,'Frontal'],[45,'Oblíqua'],[90,'Perfil']].map(([angle,label])=><button key={angle} aria-pressed={view.angle===angle} onClick={()=>{setIndex(data.views.findIndex(v=>v.angle===angle));setPlaying(false)}}>{label}</button>)}</div><label className="xr-slider"><span>Incidência <b>{view.angle}°</b></span><input type="range" min="0" max={data.views.length-1} value={index} onChange={e=>{setIndex(+e.target.value);setPlaying(false)}} aria-label="Ângulo da incidência" aria-valuetext={`${view.angle} graus`}/></label><button className="xr-play" aria-label={playing?'Pausar incidências':'Reproduzir incidências'} aria-pressed={playing} onClick={()=>setPlaying(!playing)}>{playing?<Pause size={16}/>:<Play size={16}/>}</button></div>
  <div className="xr-panes"><article className="xr-pane xr-anatomy"><div className="xr-pane-title"><span>{mode==='geometry'?'01 / FONTE → CORPO → DETECTOR':'01 / ANATOMIA DA TC'}</span><button aria-label="Restaurar aproximação" onClick={()=>setReset(r=>r+1)}><RotateCcw size={15}/></button></div><Anatomy data={data} view={view} selected={selected} onSelect={choose} reset={reset} geometry={mode==='geometry'} probe={probe}/><div className="xr-view-caption"><span className="xr-dot"/> {mode==='geometry'?'Arraste para girar a cena':incidence} <small>{mode==='geometry'?'Ponto dourado: fonte · painel: detector':'Giro vinculado à incidência · zoom livre'}</small></div></article>
   <article className="xr-pane xr-image"><div className="xr-pane-title"><span>02 / PROJEÇÃO SIMULADA</span><select aria-label="Sobreposição na radiografia" value={overlay} onChange={e=>setOverlay(e.target.value)}><option value="off">RX original</option><option value="contours">Contornos</option><option value="fill">Preenchimento</option></select></div><Radiograph contrast={contrast} data={data} view={view} selected={selected} onSelect={choose} overlay={overlay} probe={mode==='geometry'?probe:null} onProbe={mode==='geometry'?setProbe:undefined}/><div className="xr-view-caption"><label className="xr-contrast">Contraste <input aria-label="Contraste da radiografia" type="range" min="1" max="5" step=".1" value={contrast} onChange={e=>setContrast(+e.target.value)}/></label><button onClick={()=>setContrast(3)}>Restaurar</button></div></article></div>
  <div className="xr-bottom"><label>ESTRUTURA<select aria-label="Estrutura anatômica" value={selected} onChange={e=>choose(e.target.value)}><option value="">Escolha uma estrutura</option>{data.parts.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label><div className="xr-learning" aria-live="polite">{quiz?<><strong>Encontre: {challenge.name}.</strong><p>{selected?(selected===challenge.id?'Correto! Compare agora nas outras incidências.':'Essa é outra estrutura. Tente novamente na imagem ou na lista.'):'Toque na região correspondente para responder.'}</p></>:<><strong>{part?.name||(mode==='geometry'?'Toque no RX para mostrar o caminho do raio.':'Uma imagem, várias estruturas sobrepostas.')}</strong><p>{mode==='geometry'?'O raio liga a fonte ao ponto do detector e atravessa estruturas sobrepostas. Distância fonte–detector: 110 cm.':part?.hint||'Escolha uma estrutura e mude a incidência para entender sua projeção.'}</p></>}</div><button className="xr-challenge" aria-pressed={quiz} onClick={()=>{setQuiz(!quiz);setSelected('');setPlaying(false)}}><Target size={16}/>{quiz?'Sair do desafio':'Testar meu olhar'}<ChevronRight size={14}/></button></div>
 </>}
 </section>
}
