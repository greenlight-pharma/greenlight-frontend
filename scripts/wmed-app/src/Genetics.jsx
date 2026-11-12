import React,{useEffect,useRef,useState} from 'react';
import {Dna,ArrowRight,ChevronLeft,ChevronRight,Play,Pause,Plus,Minus,RotateCcw,BookOpen,X,Check,MoveUpRight} from 'lucide-react';
import {stages} from './genetics/catalog.mjs';
import {createGeneticScene} from './genetics/scene';
import {useWorkspaceHeight} from './academic/useWorkspaceHeight';
import './genetics/genetics.css';
import {useI18n} from './doctor/I18n';
function Scene({id,selected,onSelect,spin,handle,retry,onError}){
 const {t}=useI18n();
 const node=useRef(null),selectRef=useRef(onSelect);selectRef.current=onSelect;
 useEffect(()=>{const api=createGeneticScene(node.current,id,p=>selectRef.current(p),onError);handle.current=api;return()=>{api.dispose();handle.current=null}},[id,retry]);
 useEffect(()=>handle.current?.select?.(selected),[id,selected,retry]);
 useEffect(()=>handle.current?.spin?.(spin),[id,spin,retry]);
 return <div className="gene-canvas" ref={node} role="img" aria-label={`${t('Modelo 3D didático:')} ${t(stages.find(s=>s.id===id).name)}. ${t('Arraste para girar; selecione estruturas pelos botões abaixo.')}`}/>;
}
export default function Genetics(){
 const {t}=useI18n();
 const [index,setIndex]=useState(0),[selected,setSelected]=useState(null),[spin,setSpin]=useState(false),[tab,setTab]=useState('explore'),[answer,setAnswer]=useState(null),[sources,setSources]=useState(false),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 const host=useWorkspaceHeight(),handle=useRef(null),stage=stages[index],part=stage.parts.find(p=>p[0]===selected);
 const choose=i=>{setIndex(i);setSelected(null);setAnswer(null);setError(false);setSources(false);setTab('explore')};
 return <section className="gene-workspace" ref={host} aria-label={t('Biblioteca de Genética')}>
 <header className="gene-header"><div><span className="gene-eyebrow">{t('BIBLIOTECA INTERATIVA')}</span><h1>{t('Genética')} <span>3D</span></h1></div><button className="gene-source-button" onClick={()=>setSources(!sources)} aria-expanded={sources}><BookOpen size={16}/> {t('Sobre o modelo')}</button></header>
 <nav className="gene-path" aria-label={t('Níveis de organização do DNA')}>{stages.map((s,i)=><button key={s.id} aria-current={i===index?'step':undefined} onClick={()=>choose(i)}><span>0{i+1}</span>{t(s.name)}{i<4&&<ChevronRight size={14}/>}</button>)}</nav>
 <div className="gene-body">
 <div className="gene-viewport">
 <div className="gene-scene-top"><span><i/> {t(stage.tag)}</span><span>0{index+1} / 05</span></div>
 <Scene key={stage.id} id={stage.id} selected={selected} onSelect={setSelected} spin={spin} handle={handle} retry={retry} onError={()=>setError(true)}/>
 <div className="gene-scene-label" aria-hidden="true"><span>{t(stage.name)}</span><small>{t(stage.id==='chromosome'?'Duas cromátides-irmãs':stage.id==='dna'?'Modelo esquemático de dupla hélice':'Modelo em corte e/ou simplificado')}</small></div>
 {stage.id==='dna'&&<div className="gene-dna-key"><span><i/> A · T</span><span><i/> G · C</span><span>{t('Fitas antiparalelas')}</span></div>}
 <div className="gene-controls"><span>{t('Arraste para girar')}</span><div><button onClick={()=>setSpin(!spin)} aria-label={spin?t('Pausar giro'):t('Girar modelo')} aria-pressed={spin}>{spin?<Pause size={17}/>:<Play size={17}/>}</button><button aria-label={t('Aproximar modelo')} onClick={()=>handle.current?.zoom?.(.85)}><Plus size={18}/></button><button aria-label={t('Afastar modelo')} onClick={()=>handle.current?.zoom?.(1.18)}><Minus size={18}/></button><button aria-label={t('Restaurar enquadramento')} onClick={()=>handle.current?.fit?.()}><RotateCcw size={17}/></button></div></div>
 {error&&<div className="gene-error" role="alert"><Dna size={30}/><strong>{t('O visualizador 3D foi interrompido.')}</strong><p>{t('As explicações continuam disponíveis.')}</p><button onClick={()=>{setError(false);setRetry(retry+1)}}>{t('Tentar novamente')}</button></div>}
 {sources&&<aside className="gene-sources"><header><strong>{t('Sobre esta representação')}</strong><button aria-label={t('Fechar fontes')} onClick={()=>setSources(false)}><X size={18}/></button></header><p>{t('Modelos didáticos autorais. Formas, cores, quantidades e distâncias foram simplificadas. Não representam geometria atômica. A mudança de nível não é um zoom em escala real.')}</p><p>{t('O giro serve à exploração e não representa movimento biológico. Esta primeira coleção aborda a organização do DNA; não é um curso completo de genética.')}</p><a href={stage.source} target="_blank" rel="noreferrer">{t('Referência')} · NHGRI <MoveUpRight size={13}/></a><a href="https://www.ncbi.nlm.nih.gov/research/histonedb/help/" target="_blank" rel="noreferrer">{t('Histonas e nucleossomos')} · NCBI <MoveUpRight size={13}/></a></aside>}
 </div>
 <aside className="gene-info" aria-label={t('Explorar e compreender')}>
 <div className="gene-info-tabs"><button aria-pressed={tab==='explore'} onClick={()=>setTab('explore')}>{t('Explorar')}</button><button aria-pressed={tab==='practice'} onClick={()=>setTab('practice')}>{t('Praticar')}</button></div>
 <div className="gene-info-content">
 <span className="gene-eyebrow">{t(tab==='explore'?'ESTRUTURA E FUNÇÃO':'TESTE SUA COMPREENSÃO')}</span><h2>{t(stage.name)}</h2><p className="gene-subtitle">{t(stage.subtitle)}</p>
 {tab==='explore'?<><p className="gene-description">{t(stage.description)}</p><div className="gene-parts" aria-label={t('Selecionar estrutura')}>{stage.parts.map(([id,name],i)=><button key={id} aria-pressed={selected===id} onClick={()=>setSelected(selected===id?null:id)}><span>0{i+1}</span><strong>{t(name)}</strong>{selected===id?<Check size={15}/>:<Plus size={15}/>}</button>)}</div><div className="gene-detail" aria-live="polite"><span>{t(part?'ESTRUTURA SELECIONADA':'PARA LEMBRAR')}</span><h3>{t(part?part[1]:stage.takeaway)}</h3>{part&&<p>{t(part[2])}</p>}</div></>:<div className="gene-practice"><h3>{t(stage.question)}</h3>{stage.options.map((option,i)=><button key={option} onClick={()=>setAnswer(i)} disabled={answer!==null} data-result={answer!==null?(i===stage.answer?'correct':answer===i?'wrong':undefined):undefined}><span>{String.fromCharCode(65+i)}</span>{t(option)}</button>)}{answer!==null&&<div className="gene-answer" role="status"><strong>{answer===stage.answer?t('Isso mesmo.'):t('Vamos revisar.')}</strong><p>{t(stage.why)}</p><button onClick={()=>{setAnswer(null);setTab('explore')}}>{t('Voltar à estrutura')} <ArrowRight size={14}/></button></div>}</div>}
 </div>
 <div className="gene-next"><button aria-label={t('Nível anterior')} disabled={index===0} onClick={()=>choose(index-1)}><ChevronLeft size={17}/></button><button onClick={()=>choose(index===4?0:index+1)}>{index===4?t('Recomeçar pela célula'):`${t('Explorar')} ${stages[index+1].id==='dna'?t('DNA'):t(stages[index+1].name).toLowerCase()}`}<ArrowRight size={16}/></button></div>
 </aside></div>
 <footer className="gene-footer"><span><Dna size={14}/> {t('Organização do DNA')}</span><span>{t('5 modelos · estruturas selecionáveis · revisão ativa')}</span></footer>
 </section>
}
