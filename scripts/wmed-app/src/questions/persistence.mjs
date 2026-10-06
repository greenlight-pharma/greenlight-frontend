// One atomic localStorage record per catalog/account. Web Locks guard its writer.
const pendingSnapshots=new Map();
export const hasPendingSnapshots=()=>pendingSnapshots.size>0;
export function browserStorage(){try{return localStorage;}catch{return null;}}
export function createLocalPersistence(storage,key){
 let state={},readFailed=false,dirty=false;
 const pending=pendingSnapshots.get(key);
 try{
  const raw=storage.getItem(key+':snapshot');
  if(raw){const parsed=JSON.parse(raw);if(parsed.schema!==1||parsed.storageKey!==key||!parsed.state||typeof parsed.state!=='object')throw Error('Invalid snapshot');state=parsed.state;}
  else for(const [part,suffix] of Object.entries({ledger:':attempts',progress:'',bookmarks:':bookmarks',session:':session',view:':view',attemptId:':attemptId'})){const value=storage.getItem(key+suffix);if(value)state[part]=JSON.parse(value);}
 }catch{readFailed=true;dirty=true;}
 if(pending){state=pending.state;readFailed=pending.readFailed;dirty=true;}
 const serialize=()=>JSON.stringify({schema:1,storageKey:key,state});
 function flush(){if(readFailed){dirty=true;pendingSnapshots.set(key,{state,readFailed});return false;}try{storage.setItem(key+':snapshot',serialize());dirty=false;pendingSnapshots.delete(key);return true;}catch{dirty=true;pendingSnapshots.set(key,{state,readFailed});return false;}}
 return {read:part=>state[part]??null,save(patch){state={...state,...patch};return flush();},retry:flush,readUnavailable:()=>readFailed,replace(patch){state=patch;readFailed=false;return flush();},isDirty:()=>dirty,recovery:serialize};
}
export function parseRecovery(text,key){
 if(text.length>2_000_000)throw Error('Recovery file is too large');
 const data=JSON.parse(text);
 if(data.schema!==1||data.storageKey!==key||!data.state||typeof data.state!=='object'||Array.isArray(data.state))throw Error('Recovery belongs to another account or catalog');
 return data.state;
}
// Hold the lock for the mounted workspace, not merely for one write.
export function holdWriter(locks,key,onStatus){
 let active=true,release;
 if(!locks?.request){onStatus('unsupported');return()=>{};}
 locks.request('2doctor:qbank-writer:'+key,{mode:'exclusive',ifAvailable:true},async lock=>{
  if(!active)return;
  if(!lock){onStatus('busy');return;}
  onStatus('ready');await new Promise(resolve=>{release=resolve;if(!active)resolve();});
 }).catch(()=>{if(active)onStatus('unsupported');});
 return()=>{active=false;release?.();};
}
