import {readFileSync,statSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {fixtures} from './fixtures.mjs';
import {evaluateFixture,referenceOutput,sourceDigest} from './contract.mjs';
export function evaluateBatch(responses){
 if(!Array.isArray(responses)||responses.length!==fixtures.length)throw Error('BATCH_INCOMPLETE');
 const ids=new Set();
 for(const r of responses){if(!r||typeof r!=='object'||Array.isArray(r)||Object.keys(r).sort().join(',')!=='caseId,output'||!fixtures.some(f=>f.id===r.caseId)||ids.has(r.caseId))throw Error('BATCH_INVALID');ids.add(r.caseId);}
 const cases=fixtures.map(f=>evaluateFixture(f,responses.find(r=>r.caseId===f.id).output));
 return {schema:'scribe-evaluation-v1',kind:'synthetic-extractive-evaluation',corpusHash:sourceDigest(JSON.stringify(fixtures)),clinicalValidation:false,caseCount:cases.length,passed:cases.filter(c=>c.ok).length,failed:cases.filter(c=>!c.ok).length,cases};
}
export function runSelfCheck(){
 const positive=evaluateBatch(fixtures.map(f=>({caseId:f.id,output:referenceOutput(f)})));
 const negative=[];
 for(const f of fixtures){
  const omit=referenceOutput(f);omit.blocks.pop();negative.push({mutation:'omission',...evaluateFixture(f,omit)});
  const altered=referenceOutput(f);altered.blocks[0].text+=' invented';negative.push({mutation:'altered-text',...evaluateFixture(f,altered)});
  const placement=referenceOutput(f);placement.blocks[0].section=placement.blocks[0].section==='plan'?'objective':'plan';negative.push({mutation:'wrong-section',...evaluateFixture(f,placement)});
  const stale=referenceOutput(f);stale.sourceHash='0'.repeat(64);negative.push({mutation:'stale-source',...evaluateFixture(f,stale)});
 }
 return {mode:'harness-self-check',corpusHash:sourceDigest(JSON.stringify(fixtures)),clinicalValidation:false,modelEvaluated:false,positiveAccepted:positive.passed,positiveTotal:positive.caseCount,negativeRejected:negative.filter(n=>!n.ok).length,negativeTotal:negative.length,ok:positive.failed===0&&negative.every(n=>!n.ok)};
}
export function main(args){
 try{
  let report;
  if(args.length===1&&args[0]==='--self-check')report=runSelfCheck();
  else if(args.length===2&&args[0]==='--responses'){
   if(statSync(args[1]).size>2_000_000)throw Error('INPUT_TOO_LARGE');
   const raw=readFileSync(args[1]);if(raw.length>2_000_000)throw Error('INPUT_TOO_LARGE');
   report=evaluateBatch(JSON.parse(raw.toString('utf8')));
  }else throw Error('USAGE: --self-check OR --responses file.json (fictional corpus only)');
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
  return report.ok===false||report.failed>0?1:0;
 }catch(e){
  // Never echo submitted text, file paths or JSON parse excerpts.
  const safe=new Set(['BATCH_INCOMPLETE','BATCH_INVALID','INPUT_TOO_LARGE']);
  process.stderr.write((safe.has(e.message)?e.message:'INVALID_INPUT_OR_ARGUMENTS')+'\n');return 2;
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)process.exitCode=main(process.argv.slice(2));
