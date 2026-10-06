// Development-only fixture. Not reachable/imported by production main.
import React,{useState} from 'react';import {createRoot} from 'react-dom/client';
import {I18nProvider} from '../../src/doctor/I18n';import QuestionBank from '../../src/questions/QuestionBank';
import {catalogStorageKey} from '../../src/questions/attempts.mjs';import {qbankDrafts} from './qbank-content.mjs';
import '../../src/styles.css';import '../../src/theme-system.css';import '../../src/doctor/doctor.css';import '../../src/doctor/global-tools.css';
const qaStorage=new URLSearchParams(location.search).get('qa_storage')==='1';
const qaParams=new URLSearchParams(location.search);
const storageFault={mode:qaStorage&&qaParams.get('qa_read')==='denied'?'unavailable':'normal'};
if(qaStorage&&qaParams.get('qa_locks')==='unsupported')Object.defineProperty(navigator,'locks',{value:undefined,configurable:true});
function fillQuota(){let count=0,last='';for(const size of [262144,16384,1024,64,1]){try{for(let i=0;i<128;i++)localStorage.setItem('2doctor:qa-fill:'+count++,'x'.repeat(size));}catch(e){last=e.name;}}document.getElementById('qa-storage-status').textContent=`Real storage fill stopped: ${last}; ${count} blocks`;}
function clearQuota(){for(let i=0;i<1024;i++)localStorage.removeItem('2doctor:qa-fill:'+i);document.getElementById('qa-storage-status').textContent='QA fill removed';}
if(qaStorage){
 const originals=import.meta.hot?.data.storageOriginals||{set:Storage.prototype.setItem,get:Storage.prototype.getItem};
 if(import.meta.hot)import.meta.hot.data.storageOriginals=originals;
 Storage.prototype.setItem=function(key,value){if(this===localStorage&&key.startsWith('2doctor:qbank:')&&storageFault.mode!=='normal')throw new DOMException('Simulated storage failure',storageFault.mode==='quota'?'QuotaExceededError':'SecurityError');return originals.set.call(this,key,value);};
 Storage.prototype.getItem=function(key){if(this===localStorage&&key.startsWith('2doctor:qbank:')&&storageFault.mode==='unavailable')throw new DOMException('Simulated unavailable storage','SecurityError');return originals.get.call(this,key);};
}
if(!import.meta.env.DEV)throw Error('Pending Qbank is development-only');
document.documentElement.dataset.product='2doctor';document.documentElement.dataset.theme='light';
function Preview(){const [scope,setScope]=useState(()=>sessionStorage.getItem('2doctor:qbank:synthetic-scope')||'guest');const key=catalogStorageKey(scope,'demo-hygiene');return <I18nProvider enabled><div style={{padding:16}}><label>Local synthetic scope <select aria-label="Local synthetic scope" value={scope} onChange={e=>{sessionStorage.setItem('2doctor:qbank:synthetic-scope',e.target.value);setScope(e.target.value)}}><option value="guest">Guest</option><option value={'a'.repeat(64)}>Test account A</option><option value={'b'.repeat(64)}>Test account B</option></select></label>{qaStorage&&<div><p>Local QA only: storage fault injection</p><button onClick={fillQuota}>Fill real test storage</button><button onClick={clearQuota}>Remove QA fill</button><span id="qa-storage-status" role="status"></span><button onClick={()=>{storageFault.mode='quota'}}>Simulate quota</button><button onClick={()=>{storageFault.mode='unavailable'}}>Simulate unavailable storage</button><button onClick={()=>{storageFault.mode='normal'}}>Restore normal storage</button></div>}<p>3 original draft questions · no API, payment, analytics or patient data. Not exam-specific.</p></div><QuestionBank key={key} storageKey={key} catalog={qbankDrafts} catalogId="demo-hygiene" editorialPreview/></I18nProvider>}
const root=import.meta.hot?.data.root||createRoot(document.getElementById('root'));
if(import.meta.hot){import.meta.hot.data.root=root;import.meta.hot.accept();}
root.render(<Preview/>);
