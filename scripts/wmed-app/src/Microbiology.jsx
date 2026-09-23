import React, {useEffect,useState} from 'react';
import {BookOpen,ChevronLeft,ChevronRight,Layers3,Pause,Play,Search,X} from 'lucide-react';
import Scene from './academic/Scene';
import {useWorkspaceHeight} from './academic/useWorkspaceHeight';
import './academic/experience.css';
import './microbiology.css';
const groups={bacterias:'Bactérias',virus:'Vírus',fungos:'Fungos',protozoarios:'Protozoários'};
export default function Microbiology(){
 const [catalog,setCatalog]=useState([]),[error,setError]=useState(false),[id,setId]=useState('e-coli'),[group,setGroup]=useState('bacterias'),[search,setSearch]=useState('');
 const [panel,setPanel]=useState(null),[cut,setCut]=useState(true),[selected,setSelected]=useState(''),[isolate,setIsolate]=useState(false),[rotate,setRotate]=useState(false);
 const host=useWorkspaceHeight();
 useEffect(()=>{const controller=new AbortController();fetch(`${import.meta.env.BASE_URL}microbiology/catalog.json`,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(setCatalog).catch(e=>{if(e.name!=='AbortError')setError(true)});return()=>controller.abort()},[]);
 const cell=catalog.find(c=>c.id===id),part=cell?.parts.find(p=>p.id===selected);
 const choose=(next)=>{setId(next.id);setGroup(next.group);setSelected('');setIsolate(false);setPanel(null)};
 const list=catalog.filter(c=>c.group===group&&c.title.toLowerCase().includes(search.toLowerCase()));
 if(!cell)return <div className="module-page" role="status">{error?<>Não foi possível abrir o acervo. <button onClick={()=>location.reload()}>Tentar novamente</button></>:'Preparando Microbiologia…'}</div>;
 const position=catalog.findIndex(c=>c.id===id);
 return <section ref={host} className="micro-workspace" aria-label="Microbiologia 3D">
  <header className="micro-header"><div><span className="micro-eyebrow">MATÉRIAS / ACERVO 3D</span><h1>Microbiologia</h1></div><button aria-expanded={panel==='library'} onClick={()=>setPanel(panel==='library'?null:'library')}><BookOpen size={17}/> Acervo <span className="micro-count">16</span></button></header>
  <div className="micro-stage">
   <Scene anatomyMaterials={false} urls={[`${cell.baseUrl}/${cut&&cell.cutaway?'cutaway':'complete'}.glb`]} selected={selected?`${selected.replaceAll('-','_')}_mesh`:''} isolate={isolate} rotate={rotate} onSelect={name=>{const p=cell.parts.find(p=>`${p.id.replaceAll('-','_')}_mesh`===name);if(p){setSelected(p.id);setPanel('details')}}}/>
   <div className="micro-caption"><span>{groups[cell.group]} · {position+1} / {catalog.length}</span><h2>{cell.title}</h2></div>
   <div className="micro-controls"><div className="micro-segment" aria-label="Visualização"><button aria-pressed={!cut||!cell.cutaway} onClick={()=>{setCut(false);setIsolate(false)}}>Inteiro</button><button disabled={!cell.cutaway} title={!cell.cutaway?'Este modelo mostra a arquitetura externa do fungo':undefined} aria-pressed={cut&&cell.cutaway} onClick={()=>{setCut(true);setIsolate(false)}}>Corte interno</button></div><button aria-label={rotate?'Pausar giro':'Girar modelo'} aria-pressed={rotate} onClick={()=>setRotate(!rotate)}>{rotate?<Pause size={17}/>:<Play size={17}/>}</button><button aria-expanded={panel==='details'} onClick={()=>setPanel(panel==='details'?null:'details')}><Layers3 size={17}/> Estruturas</button></div>
   {panel&&<aside className="micro-panel" aria-label={panel==='library'?'Acervo de microbiologia':'Estruturas e funções'}><div className="micro-panel-heading"><h3>{panel==='library'?'Acervo de microbiologia':'Estruturas e funções'}</h3><button aria-label="Fechar painel" onClick={()=>setPanel(null)}><X size={20}/></button></div>
    {panel==='library'?<><div className="micro-groups">{Object.entries(groups).map(([key,label])=><button key={key} aria-pressed={group===key} onClick={()=>setGroup(key)}>{label}</button>)}</div><label className="micro-search"><Search size={17}/><input aria-label="Buscar microrganismo" placeholder="Buscar no grupo" value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="micro-list">{list.map(c=><button key={c.id} aria-current={c.id===id?'true':undefined} onClick={()=>choose(c)}><span>{c.title}</span><ChevronRight size={16}/></button>)}{!list.length&&<p>Nenhum modelo encontrado neste grupo.</p>}</div><p className="micro-note">Acervo inicial com 16 modelos representativos. Novas espécies podem ser acrescentadas.</p></>:<><p className="micro-summary">{cell.summary}</p><div className="micro-part-list">{cell.parts.map(p=><button key={p.id} aria-pressed={p.id===selected} onClick={()=>{setSelected(p.id);setIsolate(false)}}><i style={{background:p.colorHex}}/>{p.title}</button>)}</div>{part?<article className="micro-function"><span>ESTRUTURA SELECIONADA</span><h3>{part.title}</h3><p>{part.function}</p><label><input type="checkbox" checked={isolate} onChange={e=>setIsolate(e.target.checked)}/> Ver só esta estrutura</label><button onClick={()=>{setSelected('');setIsolate(false)}}>Limpar seleção</button></article>:<p className="micro-note">Toque em uma estrutura no modelo ou escolha na lista.</p>}<details><summary>Sobre o modelo e fontes</summary><p>{cell.status}</p><p>Sem escala comum entre os organismos. O corte expõe estruturas que não aparecem na vista externa.</p>{cell.sources.map((url,i)=><a key={url} href={url} target="_blank" rel="noreferrer">Referência {i+1} · {new URL(url).hostname} ↗</a>)}</details></>}
   </aside>}
  </div>
  <footer className="micro-footer"><button aria-label="Modelo anterior" onClick={()=>choose(catalog[(position+catalog.length-1)%catalog.length])}><ChevronLeft size={18}/></button><p><span>OBSERVE NO MODELO</span>{cell.focus}</p><button aria-label="Próximo modelo" onClick={()=>choose(catalog[(position+1)%catalog.length])}><ChevronRight size={18}/></button></footer>
 </section>
}
