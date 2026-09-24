import React,{useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {MonitorPlay,Camera,Video,X} from 'lucide-react';
import {lumenEnabled,stageFor} from './lumen';
// Modo apresentação: palco em tela cheia sem interface, órbita cinematográfica, imagem 4K e gravação do giro.
// stageRef aponta para o elemento do palco (o que contém o canvas); a barra entra nele por portal.
export default function Present({stageRef,name='wmed-3d'}){
 const [on,setOn]=useState(false),[busy,setBusy]=useState(''),[error,setError]=useState('');
 const stage=()=>stageFor(stageRef.current?.querySelector('canvas'));
 useEffect(()=>{
  if(!on)return;const el=stageRef.current;if(!el){setOn(false);return}
  el.classList.add('lumen-present');
  if(el.requestFullscreen)el.requestFullscreen().catch(()=>el.classList.add('lumen-present-fixed'));else el.classList.add('lumen-present-fixed');
  stage()?.setCinematic(true);
  const fs=()=>{if(!document.fullscreenElement&&!el.classList.contains('lumen-present-fixed'))setOn(false)};
  const key=e=>{if(e.key==='Escape')setOn(false)};
  document.addEventListener('fullscreenchange',fs);addEventListener('keydown',key);
  return()=>{document.removeEventListener('fullscreenchange',fs);removeEventListener('keydown',key);el.classList.remove('lumen-present','lumen-present-fixed');stage()?.setCinematic(false);if(document.fullscreenElement===el)document.exitFullscreen?.().catch(()=>{})};
 },[on]);
 if(!lumenEnabled())return null;
 async function record(){const s=stage();if(!s||busy)return;setError('');try{await s.record(14,name,f=>setBusy(`Gravando ${Math.round(f*100)}%`))}catch(e){setError(e.message)}setBusy('')}
 return <>
  <button type="button" className="lumen-present-button" aria-label="Modo apresentação" title="Modo apresentação (tela cheia, giro, imagem 4K e vídeo)" onClick={()=>setOn(true)}><MonitorPlay size={17}/></button>
  {on&&stageRef.current&&createPortal(<div className="lumen-present-bar" role="toolbar" aria-label="Modo apresentação">
   <button type="button" onClick={()=>stage()?.capture(3840,name)} disabled={!!busy}><Camera size={16}/>Imagem 4K</button>
   <button type="button" onClick={record} disabled={!!busy} aria-live="polite"><Video size={16}/>{busy||'Gravar giro'}</button>
   <button type="button" onClick={()=>setOn(false)} disabled={!!busy} aria-label="Sair do modo apresentação"><X size={16}/>Sair</button>
   {error&&<span role="alert">{error}</span>}
  </div>,stageRef.current)}
 </>;
}
