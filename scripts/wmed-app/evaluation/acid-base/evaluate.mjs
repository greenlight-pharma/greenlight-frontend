import {isDeepStrictEqual} from 'node:util';
import {pathToFileURL} from 'node:url';
import {fixtures,corpusVersion} from './fixtures.mjs';
import {runReference} from './reference.mjs';
// Exact output contract also rejects extra diagnosis, treatment, normality or urgency fields.
export function evaluate(candidate=runReference){
 const cases=fixtures.map(f=>{
  try{return {id:f.id,topic:f.topic,pass:isDeepStrictEqual(candidate(structuredClone(f.input)),f.expected)};}
  catch{return {id:f.id,topic:f.topic,pass:false};}
 });
 return {corpusVersion,synthetic:true,clinicalValidation:false,review:'pending',total:cases.length,passed:cases.filter(c=>c.pass).length,cases};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const report=evaluate();console.log(JSON.stringify(report,null,2));process.exitCode=report.passed===report.total?0:1;
}
