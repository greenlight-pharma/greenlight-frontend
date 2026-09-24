// Utilitários HTTP das funções WMed (Vercel e servidor local).
export function noStore(res){res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');}
export function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));}
// Mensagem no idioma pedido pelo navegador (as respostas do servidor não passam pelo dicionário do app).
export const L=(lang,pt,en)=>lang==='en'?en:pt;
export const langOf=req=>/^en\b/i.test(String(req.headers['x-wmed-lang']||''))?'en':'pt';
// Escritas exigem o cabeçalho do app e origem HTTPS do próprio site (wmed.ai, vytalsaude.com.br ou o host da requisição).
export function allowWrite(req,res){
 const origin=req.headers.origin;
 if(req.headers['x-wmed-request']!=='1'||!origin){json(res,403,{error:L(langOf(req),'Atualize a página antes de continuar.','Refresh the page before continuing.')});return false;}
 try{const u=new URL(origin);const local=u.hostname==='localhost'||u.hostname==='127.0.0.1';if(!(u.protocol==='https:'||local)||!['wmed.ai','www.vytalsaude.com.br','vytalsaude.com.br',req.headers.host].includes(u.host))throw Error();}
 catch{json(res,403,{error:L(langOf(req),'Origem não permitida.','Origin not allowed.')});return false;}
 return true;
}
export async function readJson(req,max=48000){
 let data=req.body;
 if(data==null){data='';for await(const c of req){data+=c;if(Buffer.byteLength(data)>max)throw Error('BODY');}}
 if(typeof data==='string'||Buffer.isBuffer(data)){if(Buffer.byteLength(data)>max)throw Error('BODY');data=JSON.parse(String(data||'{}'));}
 else if(Buffer.byteLength(JSON.stringify(data))>max)throw Error('BODY');
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('JSON');
 return data;
}
export const clientIp=req=>String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,80);
