import React,{useEffect,useRef,useState} from 'react';
import {Atom,BookOpen,Search,X,Play,Pause,RotateCcw,Info,ChevronLeft,ChevronRight} from 'lucide-react';
import {catalog,groups,filterCatalog} from './molecular/catalog.mjs';
import {useWorkspaceHeight} from './academic/useWorkspaceHeight';
import './molecular/molecular.css';
import {createOwnedViewer} from './molecular/viewer-lifecycle.mjs';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createStage,lumenEnabled,lumenTheme} from './lumen/lumen';
import Present from './lumen/Present';
import {parseSDF,parsePDB,buildMolecule,buildCartoon,ELEMENT_COLORS} from './lumen/molecule';
const LUMEN=lumenEnabled();
// Lumen: esferas e ligações com material físico, sombra de contato e oclusão ambiente. Fitas seguem no 3Dmol.
function LumenMolecule({entry,style,hydrogens,spin,onAtom,onReady,retry,handle}){
 const el=useRef(null),api=useRef(null),[text,setText]=useState(null),[theme,setTheme]=useState(lumenTheme());
 useEffect(()=>{const w=new MutationObserver(()=>setTheme(lumenTheme()));w.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});return()=>w.disconnect()},[]);
 useEffect(()=>{const abort=new AbortController();setText(null);onAtom(null);onReady('loading');
  fetch(`${import.meta.env.BASE_URL}molecular/${entry.file}`,{signal:abort.signal}).then(r=>{if(!r.ok)throw Error();return r.text()}).then(t=>{if(!abort.signal.aborted)setText(t)}).catch(e=>{if(e.name!=='AbortError')onReady('Não foi possível carregar esta estrutura.')});
  return()=>abort.abort()},[entry.id,retry]);
 useEffect(()=>{if(!text)return;const node=el.current;let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true});}catch{onReady('Seu navegador não disponibilizou o 3D.');return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));node.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,1,.1,2000),controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.autoRotateSpeed=.8;
  let mol;try{mol=entry.format==='sdf'?parseSDF(text):parsePDB(text)}catch{onReady('Não foi possível ler esta estrutura.');renderer.dispose();node.replaceChildren();return}
  const built=style==='cartoon'&&entry.format==='pdb'?buildCartoon(mol,{theme,hydrogens}):buildMolecule(mol,{style:style==='sphere'?'sphere':'stick',hydrogens,theme});scene.add(built.group);
  const stage=createStage(renderer,scene,camera,{controls,theme});stage.setSubject(built.group);
  const box=new THREE.Box3().setFromObject(built.group),dims=box.getSize(new THREE.Vector3()),sphere=box.getBoundingSphere(new THREE.Sphere());
  let initial=new THREE.Vector3();
  const fitDistance=()=>{const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));return (Math.max(dims.y/2/tan,dims.x/2/(tan*camera.aspect))+dims.z/2)*1.35};
  const frame=()=>{const d=fitDistance();initial.set(d*.12,d*.16,d);camera.near=d/100;camera.far=d*20;camera.updateProjectionMatrix();controls.minDistance=sphere.radius*.4;controls.maxDistance=d*3;stage.flyTo(initial,new THREE.Vector3())};
  const size=()=>{const w=node.clientWidth,h=node.clientHeight;if(!w||!h)return;renderer.setSize(w,h);stage.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(framed)frame()};let framed=false;
  const obs=new ResizeObserver(size);obs.observe(node);size();{const d=fitDistance();camera.position.set(d*.12,d*.16,d);controls.update()}frame();framed=true;
  const ray=new THREE.Raycaster(),p=new THREE.Vector2();let down=[0,0],picked='';
  const pd=e=>{down=[e.clientX,e.clientY]};
  const pu=e=>{if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const b=node.getBoundingClientRect();p.set((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2);ray.setFromCamera(p,camera);const a=built.pick(ray);picked=a?`${a.x}${a.y}`:'';onAtom(a&&{element:a.elem,name:a.name,residue:a.resn,number:a.resi,chain:a.chain})};
  renderer.domElement.addEventListener('pointerdown',pd);renderer.domElement.addEventListener('pointerup',pu);
  let raf=0;const loop=()=>{raf=requestAnimationFrame(loop);if(document.hidden)return;controls.autoRotate=api.current.spin&&!matchMedia('(prefers-reduced-motion: reduce)').matches;controls.update();stage.render(picked)};
  api.current={spin:api.current?.spin||false};loop();
  handle.current={wmedFrame:frame,removeAllLabels(){built.clear();picked=''},render(){},spin(){}};
  onReady('ready');
  return()=>{cancelAnimationFrame(raf);obs.disconnect();controls.dispose();stage.dispose();built.dispose();renderer.domElement.removeEventListener('pointerdown',pd);renderer.domElement.removeEventListener('pointerup',pu);renderer.dispose();node.replaceChildren();handle.current=null};
 },[text,style,hydrogens,theme]);
 useEffect(()=>{api.current={...(api.current||{}),spin}},[spin]);
 return <div ref={el} className="mol-canvas lumen-canvas" aria-label={`Estrutura 3D de ${entry.name}; arraste para girar e use dois dedos ou a roda para aproximar`} role="img"/>;
}
const elements={C:['Carbono','#909090'],N:['Nitrogênio','#3050f8'],O:['Oxigênio','#ff0d0d'],S:['Enxofre','#ffff30'],P:['Fósforo','#ff8000'],H:['Hidrogênio','#ddd'],Fe:['Ferro','#e06633'],Zn:['Zinco','#7d80b0']};
function MolecularScene({entry,style,hydrogens,spin,onAtom,onReady,retry,handle}){
 const entryRef=useRef(entry);entryRef.current=entry;
 const el=useRef(null),viewer=useRef(null),model=useRef(null),[ready,setReady]=useState(0);
 useEffect(()=>{let alive=true,v,owned,resize,theme; const node=el.current;
 import('3dmol/build/3Dmol.js').then(lib=>{if(!alive)return;const api=lib.createViewer?lib:lib.default;owned=createOwnedViewer(api,node);v=owned.viewer;viewer.current=v;handle.current=v;v.wmedFrame=()=>{v.zoomTo();v.zoom((entryRef.current.format==='sdf'?1.9:1.1)*Math.min(1,node.clientWidth/node.clientHeight*.8));v.render()};resize=new ResizeObserver(()=>{v.resize();if(model.current)v.wmedFrame();else v.render()});resize.observe(node);theme=new MutationObserver(()=>v.render());theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});setReady(n=>n+1)}).catch(()=>onReady('Não foi possível iniciar o visualizador 3D.'));
 return()=>{alive=false;resize?.disconnect();theme?.disconnect();owned?.dispose();handle.current=null;node.replaceChildren()};
 },[]);
 useEffect(()=>{if(!ready)return;const v=viewer.current,abort=new AbortController();model.current=null;v.clear();onAtom(null);onReady('loading');
 fetch(`${import.meta.env.BASE_URL}molecular/${entry.file}`,{signal:abort.signal}).then(r=>{if(!r.ok)throw Error();return r.text()}).then(text=>{if(abort.signal.aborted)return;model.current=v.addModel(text,entry.format,{keepH:true});v.setStyle({},{stick:{radius:.15,colorscheme:'Jmol'},sphere:{scale:.24,colorscheme:'Jmol'}});v.setStyle({resn:'HOH'},{hidden:true});v.wmedFrame();onReady('ready');setReady(n=>n+1)}).catch(e=>{if(e.name!=='AbortError')onReady('Não foi possível carregar esta estrutura.')});
 return()=>abort.abort();
 },[entry.id,retry,!!ready]);
 useEffect(()=>{const v=viewer.current;if(!model.current||!v)return;v.removeAllLabels();onAtom(null);
 const mol=entry.format==='sdf';v.setStyle({},style==='sphere'?{sphere:{colorscheme:'Jmol',scale:.85}}:style==='cartoon'&&!mol?{cartoon:{color:'spectrum'}}:{stick:{radius:.15,colorscheme:'Jmol'},sphere:{scale:.25,colorscheme:'Jmol'}});
 if(style==='cartoon'&&!mol)v.setStyle({hetflag:true},{stick:{radius:.18,colorscheme:'Jmol'},sphere:{scale:.28,colorscheme:'Jmol'}});
 v.setStyle({resn:'HOH'},{hidden:true});if(!hydrogens)v.setStyle({elem:'H'},{hidden:true});
 v.setClickable({},true,(atom)=>{if(atom.resn==='HOH'||(!hydrogens&&atom.elem==='H'))return;v.removeAllLabels();onAtom({element:atom.elem.slice(0,1).toUpperCase()+atom.elem.slice(1).toLowerCase(),name:atom.atom||atom.elem,residue:atom.resn,number:atom.resi,chain:atom.chain});v.addLabel(`${atom.elem}${atom.resn?' · '+atom.resn+' '+atom.resi:''}`,{position:atom,backgroundColor:'#202329',fontColor:'#ffffff',fontSize:13,backgroundOpacity:.9,borderRadius:6});v.render()});v.render();
 },[ready,style,hydrogens,entry.id]);
 useEffect(()=>{viewer.current?.spin(spin?'y':false,.45)},[spin,ready]);
 useEffect(()=>{const pause=()=>viewer.current?.spin(!document.hidden&&spin?'y':false,.45);document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause)},[spin]);
 return <div ref={el} className="mol-canvas" aria-label={`Estrutura 3D de ${entry.name}; arraste para girar e use dois dedos ou a roda para aproximar`} role="img"/>;
}
export default function Molecular(){
 const [id,setId]=useState('ATP'),[group,setGroup]=useState('todos'),[search,setSearch]=useState(''),[panel,setPanel]=useState(null),[style,setStyle]=useState('stick'),[hydrogens,setHydrogens]=useState(false),[spin,setSpin]=useState(false),[atom,setAtom]=useState(null),[state,setState]=useState('loading'),[retry,setRetry]=useState(0);const handle=useRef(null),stageEl=useRef(null),host=useWorkspaceHeight();const entry=catalog.find(c=>c.id===id),list=filterCatalog(search,group),index=catalog.indexOf(entry);
 const choose=e=>{setId(e.id);setStyle(e.format==='pdb'?'cartoon':'stick');setPanel(null);setSpin(false);setAtom(null)};
 return <section className="mol-workspace" ref={host} aria-label="Biblioteca molecular">
 <header className="mol-header"><div><span className="mol-eyebrow">ESTRUTURA · FUNÇÃO · MEDICINA</span><h1>Biblioteca molecular</h1></div><button aria-expanded={panel==='catalog'} onClick={()=>setPanel(panel==='catalog'?null:'catalog')}><BookOpen size={17}/> Acervo <span>{catalog.length}</span></button></header>
 <div className="mol-tools"><div className="mol-modes" aria-label="Representação molecular">{(entry.format==='pdb'?['cartoon','stick','sphere']:['stick','sphere']).map(s=><button key={s} aria-pressed={style===s} onClick={()=>setStyle(s)}>{({cartoon:'Fitas',stick:'Átomos e ligações',sphere:'Esferas'})[s]}</button>)}</div><label><input type="checkbox" checked={hydrogens} onChange={e=>setHydrogens(e.target.checked)}/> Hidrogênios disponíveis</label></div>
 <div className="mol-stage" ref={stageEl}>{LUMEN?<LumenMolecule entry={entry} style={style} hydrogens={hydrogens} spin={spin} onAtom={setAtom} onReady={setState} retry={retry} handle={handle}/>:<MolecularScene entry={entry} style={style} hydrogens={hydrogens} spin={spin} onAtom={setAtom} onReady={setState} retry={retry} handle={handle}/>}
 <div className="mol-title"><span>{groups[entry.group]} · {entry.id}</span><h2>{entry.name}</h2><p>{entry.subtitle}</p></div>
 <div className="mol-actions"><Present stageRef={stageEl} name={`wmed-${entry.id}`}/><button aria-label={spin?'Pausar giro':'Girar estrutura'} aria-pressed={spin} onClick={()=>setSpin(!spin)}>{spin?<Pause size={17}/>:<Play size={17}/>}</button><button aria-label="Restaurar enquadramento" onClick={()=>{handle.current?.wmedFrame()}}><RotateCcw size={17}/></button><button aria-expanded={panel==='info'} onClick={()=>setPanel(panel==='info'?null:'info')}><Info size={17}/> Entender</button></div>
 {state!=='ready'&&<div className="mol-status" role="status">{state==='loading'?<><Atom className="mol-loader"/> Preparando estrutura…</>:<>{state}<button onClick={()=>handle.current?setRetry(retry+1):location.reload()}>Tentar novamente</button></>}</div>}
 <div className="mol-legend" aria-label={style==='cartoon'?'Elementos dos ligantes; fitas coloridas pela sequência':'Legenda dos elementos'}>{style==='cartoon'&&<span>{LUMEN&&<i className="lumen-spectrum" aria-hidden="true"/>}Fitas: início → fim da cadeia · ligantes:</span>}{Object.entries(elements).filter(([s])=>s!=='H'||hydrogens).map(([symbol,[name,color]])=><span key={symbol} title={name}><i style={{background:LUMEN?ELEMENT_COLORS[lumenTheme()][symbol]:color}}/>{symbol}</span>)}</div>
 {atom&&<div className="mol-selected" role="status"><strong>{elements[atom.element]?.[0]||atom.element}</strong><span>{atom.residue?`${atom.residue} ${atom.number} · cadeia ${atom.chain||'—'}`:atom.name}</span><button aria-label="Limpar seleção" onClick={()=>{setAtom(null);handle.current?.removeAllLabels();handle.current?.render()}}><X size={15}/></button></div>}
 {panel&&<aside className="mol-panel" aria-label={panel==='catalog'?'Acervo molecular':'Função e fontes'}><header><h2>{panel==='catalog'?'Explorar acervo':entry.name}</h2><button aria-label="Fechar painel molecular" onClick={()=>setPanel(null)}><X size={19}/></button></header>{panel==='catalog'?<><label className="mol-search"><Search size={17}/><input aria-label="Buscar molécula ou proteína" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nome ou código PDB"/></label><div className="mol-groups">{Object.entries(groups).map(([key,label])=><button key={key} aria-pressed={group===key} onClick={()=>setGroup(key)}>{label}</button>)}</div><p className="mol-note">Enzimas são proteínas; aqui estão agrupadas pela função catalítica.</p><div className="mol-list">{list.map(e=><button key={e.id} aria-current={id===e.id?'true':undefined} onClick={()=>choose(e)}><span><strong>{e.name}</strong><small>{e.subtitle}</small></span><ChevronRight size={16}/></button>)}{!list.length&&<p>Nenhuma estrutura encontrada.</p>}</div></>:<><span className="mol-eyebrow">O QUE FAZ</span><p>{entry.summary}</p><span className="mol-eyebrow">OBSERVE NO 3D</span><p>{entry.focus}</p><span className="mol-eyebrow">CONEXÃO COM A MEDICINA</span><p>{entry.clinical}</p><div className="mol-source"><strong>Sobre esta representação</strong><p>{entry.kind}. Cores ilustrativas. Giro não representa movimento molecular. Estruturas experimentais podem ter regiões ou hidrogênios ausentes; águas foram ocultadas.</p>{entry.format==='pdb'&&<p>Unidade depositada no PDB; pode conter mais de uma cadeia ou cópia cristalográfica.</p>}<a href={entry.source} target="_blank" rel="noreferrer">Ver estrutura e publicação · RCSB PDB ↗</a><a href={`${import.meta.env.BASE_URL}molecular/ATTRIBUTION.txt`} target="_blank" rel="noreferrer">Fontes e licenças ↗</a></div></>}</aside>}
 </div><footer className="mol-footer"><button aria-label="Estrutura anterior" onClick={()=>choose(catalog[(index+catalog.length-1)%catalog.length])}><ChevronLeft size={18}/></button><p><span>OBSERVE</span>{entry.focus}</p><button aria-label="Próxima estrutura" onClick={()=>choose(catalog[(index+1)%catalog.length])}><ChevronRight size={18}/></button></footer>
 </section>
}
