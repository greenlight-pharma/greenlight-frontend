import React,{useRef,useState} from 'react';
import {Paperclip,FileText,Image as ImageIcon,X} from 'lucide-react';
import {validateAttachments,MAX_ATTACHMENT_BYTES,MAX_DOCUMENT_CHARS} from '../shared/chat-attachments.mjs';
import {t,locale} from './i18n';
const base64=blob=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=()=>reject(Error(t('Não foi possível ler o arquivo.')));r.readAsDataURL(blob);});
async function prepare(file) {
 const name=file.name.slice(0,120),extension=file.name.split('.').pop().toLowerCase();
 if(['jpg','jpeg','png','webp'].includes(extension)){
  if(file.size>12*1024*1024)throw Error(t('A imagem deve ter até 12 MB antes do preparo.'));
  const bitmap=await createImageBitmap(file).catch(()=>{throw Error(t('Não foi possível abrir a imagem. Envie outra versão em JPG, PNG ou WebP.'));});
  try{if(bitmap.width*bitmap.height>40000000)throw Error(t('Imagem muito grande. Envie uma versão menor.'));const scale=Math.min(1,1800/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.88));if(!blob)throw Error(t('Não foi possível preparar a imagem.'));return {kind:'image',name,mediaType:'image/jpeg',data:await base64(blob)};}finally{bitmap.close();}
 }
 if(file.size>MAX_ATTACHMENT_BYTES)throw Error(t('PDFs e documentos devem ter até 3 MB.'));
 if(extension==='pdf')return {kind:'pdf',name,data:await base64(file)};
 let text;
 if(extension==='docx'){const module=await import('mammoth/mammoth.browser.js');text=(await (module.default||module).extractRawText({arrayBuffer:await file.arrayBuffer()})).value;}
 else if(['txt','md'].includes(extension))text=await file.text();
 else throw Error(t('Use JPG, PNG, WebP, PDF, DOCX, TXT ou MD.'));
 if(text.includes('\0')||!text.trim())throw Error(t('Não encontramos texto legível nesse documento.'));
 if(text.length>MAX_DOCUMENT_CHARS)throw Error(t('Envie um documento com até 12.000 caracteres ou selecione um trecho menor.'));
 return {kind:'text',name,text};
}
export default function ChatAttachments({items,onChange,disabled,onLoading}) {
 const fileInput=useRef(null),[error,setError]=useState(''),[loading,setLoading]=useState(false),generation=useRef(0);
 React.useEffect(()=>()=>{generation.current++},[]);
 async function add(files){if(!files.length)return;setError('');setLoading(true);onLoading(true);const version=generation.current;try{if(items.length+files.length>5)throw Error(t('Envie até 5 arquivos por mensagem.'));const next=[...items];for(const file of files)next.push(await prepare(file));validateAttachments(next);if(version===generation.current)onChange(next);}catch(e){if(version===generation.current)setError(t(e.message||'Não foi possível abrir esse arquivo.'));}finally{if(version===generation.current){setLoading(false);onLoading(false);}}}
 return <div className="chat-attachments"><input ref={fileInput} type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.txt,.md" aria-label={t("Selecionar arquivos para o chat")} hidden onChange={e=>{const files=Array.from(e.target.files||[]);e.target.value='';add(files)}}/><div className="attachment-toolbar"><button type="button" disabled={disabled||loading} onClick={()=>fileInput.current.click()}><Paperclip size={17}/>{loading?t('Preparando…'):t('Anexar arquivos')}</button><small>{t('Imagens · PDF · Word · texto')}</small></div>{items.length>0&&<><ul className="attachment-list">{items.map((a,i)=><li key={i}>{a.kind==='image'?<ImageIcon size={16}/>:<FileText size={16}/>}<span>{a.name}<small>{a.kind==='text'?t('{n} caracteres',{n:a.text.length.toLocaleString(locale)}):t('Pronto para enviar')}</small></span><button type="button" aria-label={t('Remover {nome}',{nome:a.name})} disabled={disabled||loading} onClick={()=>onChange(items.filter((_,n)=>n!==i))}><X size={15}/></button></li>)}</ul><p className="attachment-note">{t("Até 5 arquivos, 1 PDF e 3 MB após o preparo. Textos: até 12.000 caracteres. DOCX: somente texto. Os arquivos são analisados nesta mensagem; o histórico guarda a conversa, sem os anexos.")}</p></>}{error&&<p className="error" role="alert">{error}</p>}</div>;
}
