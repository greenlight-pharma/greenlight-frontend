import React,{useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,FileText,Search,X} from 'lucide-react';
import {useI18n} from './doctor/I18n';
export async function caseRequest(body) {
 const response=await fetch('/api/wmed/cases',{method:'POST',headers:{'Content-Type':'application/json','X-WMed-Request':'1'},body:JSON.stringify(body)});
 const data=await response.json();
 if(!response.ok)throw Error(data.error||'Não foi possível acessar seus casos.');
 return data;
}
export default function CaseHistory({onClose,onSelect}) {
 const {t,locale}=useI18n();
 const [page,setPage]=useState(1),[search,setSearch]=useState(''),[query,setQuery]=useState(''),[data,setData]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setBusy(true);setError('');caseRequest({action:'list',page,search:query}).then(d=>{if(active)setData(d)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setBusy(false)});return()=>{active=false};},[page,query,retry]);
 async function select(id){setBusy(true);setError('');try{await onSelect(id);}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <div className="modal-shade" onClick={onClose}><section className="modal case-history" role="dialog" aria-modal="true" aria-labelledby="case-history-title" onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Escape')onClose()}}><button autoFocus className="icon-btn close" aria-label={t("Fechar meus casos")} onClick={onClose}><X/></button><span className="eyebrow">{t("SEU ACERVO")}</span><h2 id="case-history-title">{t("Meus casos")}</h2><p>{t("Relatos e feedbacks salvos na sua conta.")}</p><form className="case-search" onSubmit={e=>{e.preventDefault();setPage(1);setQuery(search)}}><input aria-label={t("Buscar casos")} placeholder={t("Buscar pelo caso ou tema")} maxLength={200} value={search} onChange={e=>setSearch(e.target.value)}/><button aria-label={t("Buscar")} disabled={busy}><Search size={18}/></button></form>{error?<p role="alert" className="error">{t(error)}<button onClick={()=>setRetry(r=>r+1)}>{t('Tentar novamente')}</button></p>:busy?<p role="status">{t('Carregando casos…')}</p>:<><div className="history-list">{data?.casos?.map(c=><button key={c.id} onClick={()=>select(c.id)}><FileText size={19}/><span><strong>{c.titulo||t('Caso clínico')}</strong><small>{new Date(c.createdAt).toLocaleDateString(locale)}{c.score!=null?` · ${t('Relato')} ${c.score}/100`:''}</small></span><ArrowRight size={16}/></button>)}</div>{!data?.casos?.length&&<p>{query?t('Nenhum caso encontrado.'):t('Seus próximos feedbacks serão salvos automaticamente e aparecerão aqui.')}</p>}</>}<nav className="case-pagination" aria-label={t("Páginas de casos")}><button disabled={busy||page<=1} onClick={()=>setPage(p=>p-1)}><ArrowLeft size={16}/> {t('Anterior')}</button><small>{page} / {data?.paginacao?.totalPages||1}</small><button disabled={busy||!data||page>=data.paginacao?.totalPages} onClick={()=>setPage(p=>p+1)}>{t('Próxima')} <ArrowRight size={16}/></button></nav></section></div>;
}
