export function encodeMessages(messages){
 return messages.filter(m=>m.mode==='chat'&&(m.text||m.error)).map(m=>({papel:m.role,conteudo:m.text+(m.role==='assistant'&&!m.complete?'\n\n[Resposta interrompida ou incompleta.]':'')}));
}
export function decodeMessages(data){
 if(!data||typeof data.id!=='string'||!Array.isArray(data.mensagens))throw Error('Histórico inválido.');
 return data.mensagens.filter(m=>['user','assistant'].includes(m.papel)&&typeof m.conteudo==='string').map((m,i)=>({id:`${data.id}-${i}`,role:m.papel,text:m.conteudo,mode:'chat',sources:[],complete:!m.conteudo.endsWith('[Resposta interrompida ou incompleta.]')}));
}
// Serialize writes to avoid duplicate conversations or an older snapshot overwriting a newer one.
export function createHistoryWriter(save){
 let id=null,latest=null,running=null,error=null;
 async function run(){while(latest){const snapshot=latest;latest=null;try{const result=await save(id,snapshot);if(!result?.id)throw Error('O histórico não confirmou o salvamento.');id=result.id;error=null;}catch(e){if(!latest)latest=snapshot;error=e;break;}}}
 return {
  setId(value){if(running)throw Error('Aguarde o salvamento.');id=value;latest=null;error=null;},
  get id(){return id;},
  enqueue(messages){latest=messages;},
  async flush(){while(running)await running;if(latest){running=run();try{await running;}finally{running=null;}}if(error)throw error;return id;},
 };
}
