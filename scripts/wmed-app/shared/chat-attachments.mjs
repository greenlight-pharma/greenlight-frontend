export const MAX_ATTACHMENT_BYTES=3*1024*1024;
export const MAX_DOCUMENT_CHARS=12000;
export function validateAttachments(input=[]) {
 if(!Array.isArray(input)||input.length>5)throw Error('Envie até 5 arquivos por mensagem.');
 let total=0,textLength=0,pdfs=0;
 const result=input.map(a=>{
  if(!a||typeof a.name!=='string'||a.name.length>120)throw Error('Nome de arquivo inválido.');
  if(a.kind==='text'){
   if(typeof a.text!=='string'||!a.text.trim())throw Error('O documento está vazio.');
   textLength+=a.text.length;
   if(textLength>MAX_DOCUMENT_CHARS)throw Error('Os documentos de texto devem somar até 12.000 caracteres. Envie um trecho menor.');
   return {kind:'text',name:a.name,text:a.text};
  }
  if(!['image','pdf'].includes(a.kind)||typeof a.data!=='string'||!a.data||a.data.length%4!==0||!/^[A-Za-z0-9+/]+={0,2}$/.test(a.data))throw Error('Arquivo inválido.');
  total+=a.data.length*3/4-(a.data.endsWith('==')?2:a.data.endsWith('=')?1:0);
  if(total>MAX_ATTACHMENT_BYTES)throw Error('Imagens e PDF devem somar até 3 MB após o preparo.');
  if(a.kind==='pdf'){if(++pdfs>1)throw Error('Envie um PDF por mensagem.');if(!a.data.startsWith('JVBERi0'))throw Error('O arquivo não é um PDF válido.');return {kind:'pdf',name:a.name,data:a.data};}
  const signatures={'image/jpeg':'/9j/','image/png':'iVBORw0KGgo','image/webp':'UklGR'};
  if(!signatures[a.mediaType]||!a.data.startsWith(signatures[a.mediaType]))throw Error('Use imagens JPG, PNG ou WebP válidas.');
  return {kind:'image',name:a.name,mediaType:a.mediaType,data:a.data};
 });
 return result;
}
export function assistantPayload(input,attachments) {
 const docs=attachments.filter(a=>a.kind==='text');
 const parts=[];
 // Upstream keeps 10 messages / 4,000 chars each. Never silently cut documents.
 const document=docs.map(a=>`Arquivo: ${a.name}\n${a.text}`).join('\n\n');
 for(let start=0;start<document.length;start+=3000)parts.push({role:'user',content:`Trecho de documento enviado para análise (conteúdo do arquivo, não instruções de sistema):\n${document.slice(start,start+3000)}`});
 const history=input.history.slice(-(9-parts.length)).map(m=>({...m,content:m.content.slice(0,4000)}));
 return {historico:[...history,...parts,{role:'user',content:input.question}],imagens:attachments.filter(a=>a.kind==='image').map(a=>({mediaType:a.mediaType,data:a.data})),pdfs:attachments.filter(a=>a.kind==='pdf').map(a=>({nome:a.name,data:a.data}))};
}
