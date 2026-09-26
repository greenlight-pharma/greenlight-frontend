import React,{useEffect,useRef,useState,useId} from 'react';
import {FileText,LoaderCircle} from 'lucide-react';
import './case-feedback-loading.css';

export default function CaseFeedbackLoading(){
 const titleId=useId();
 const [elapsed,setElapsed]=useState(0),heading=useRef(null);
 useEffect(()=>{
  const started=Date.now();
  heading.current?.focus({preventScroll:true});
  const timer=setInterval(()=>setElapsed(Math.floor((Date.now()-started)/1000)),1000);
  return()=>clearInterval(timer);
 },[]);
 return <section className="case-feedback-loading" aria-busy="true" aria-labelledby={titleId}>
  <div className="case-loading-symbol" aria-hidden="true"><FileText size={28}/><LoaderCircle size={54}/></div>
  <h2 id={titleId} ref={heading} tabIndex={-1}>Preparando seu feedback</h2>
  <p role="status">{elapsed<30?'A IA está analisando o relato que você conferiu.':'Ainda estamos aguardando a resposta da IA. Isso pode levar alguns minutos.'}</p>
  <span className="case-loading-time" role="timer" aria-live="off" aria-label="Tempo de espera">{Math.floor(elapsed/60)}:{String(elapsed%60).padStart(2,'0')}</span>
  <p className="case-loading-hint">O feedback aparecerá aqui assim que estiver pronto. Não é preciso enviar novamente.</p>
 </section>;
}
