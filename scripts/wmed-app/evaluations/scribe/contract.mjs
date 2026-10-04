// Offline extraction contract v1. No inference, network, storage or clinical validation.
import {createHash} from 'node:crypto';
export const contractVersion='scribe-extractive-v1';
export const sections=['subjective','objective','assessment','plan'];
export const locales=['pt-BR','en','es'];
export const sourceDigest=text=>createHash('sha256').update(text,'utf8').digest('hex');
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,names)=>object(x)&&Object.keys(x).length===names.length&&names.every(k=>Object.hasOwn(x,k));
// Offsets are UTF-16 code units, [start,end), on the unmodified source.
export function validateExtraction(source,output){
 const issues=[];
 if(!keys(source,['text','locale'])||typeof source.text!=='string'||!source.text.trim()||source.text.length>24000||!locales.includes(source.locale))return {ok:false,issues:[{code:'SOURCE_INVALID'}]};
 if(!keys(output,['version','sourceHash','locale','blocks']))return {ok:false,issues:[{code:'OUTPUT_SHAPE'}]};
 if(output.version!==contractVersion)issues.push({code:'VERSION'});
 if(output.sourceHash!==sourceDigest(source.text))issues.push({code:'SOURCE_MISMATCH'});
 if(output.locale!==source.locale)issues.push({code:'LOCALE_MISMATCH'});
 if(!Array.isArray(output.blocks)||output.blocks.length>128)return {ok:false,issues:[...issues,{code:'BLOCKS_INVALID'}]};
 const ranges=[];
 for(const [index,block] of output.blocks.entries()){
  if(!keys(block,['section','start','end','text'])){issues.push({code:'BLOCK_SHAPE',index});continue;}
  if(!sections.includes(block.section))issues.push({code:'SECTION',index});
  if(!Number.isInteger(block.start)||!Number.isInteger(block.end)||block.start<0||block.end<=block.start||block.end>source.text.length){issues.push({code:'SPAN',index});continue;}
  const text=source.text.slice(block.start,block.end);
  if(typeof block.text!=='string'||block.text!==text||!text.trim())issues.push({code:'NOT_VERBATIM',index});
  // Never split a surrogate pair (e.g. emoji) at either boundary.
  const splitsPair=pos=>pos>0&&pos<source.text.length&&/[\uD800-\uDBFF]/.test(source.text[pos-1])&&/[\uDC00-\uDFFF]/.test(source.text[pos]);
  if(splitsPair(block.start)||splitsPair(block.end))issues.push({code:'UNICODE_BOUNDARY',index});
  if(ranges.some(r=>block.start<r.end&&block.end>r.start))issues.push({code:'OVERLAPPING_SPANS',index});
  ranges.push({start:block.start,end:block.end});
 }
 return {ok:issues.length===0,issues};
}
// Strict development oracle: only an annotated fictional fixture supplies expected coverage.
// A matching quotation alone does NOT prove meaning, completeness or correct SOAP placement.
export function evaluateFixture(fixture,output){
 const structural=validateExtraction({text:fixture.source,locale:fixture.locale},output);
 if(!structural.ok)return {caseId:fixture.id,ok:false,structuralOk:false,issues:structural.issues};
 const expected=fixture.expected;
 const issues=[];
 for(const [index,fact] of expected.entries()){
  const match=output.blocks.find(b=>b.start===fact.start&&b.end===fact.end);
  if(!match)issues.push({code:'REQUIRED_PASSAGE_MISSING',fact:index});
  else if(match.section!==fact.section)issues.push({code:'WRONG_SECTION',fact:index});
 }
 for(const [index,b] of output.blocks.entries())if(!expected.some(f=>f.start===b.start&&f.end===b.end))issues.push({code:'UNEXPECTED_PASSAGE',index});
 // Preserve chronology within each section, even where the same phrase appears twice.
 for(const section of sections){const blocks=output.blocks.filter(b=>b.section===section);if(blocks.some((b,i)=>i&&b.start<blocks[i-1].start))issues.push({code:'SOURCE_ORDER',section});}
 return {caseId:fixture.id,ok:issues.length===0,structuralOk:true,issues};
}
export function referenceOutput(fixture){return {version:contractVersion,sourceHash:sourceDigest(fixture.source),locale:fixture.locale,blocks:fixture.expected.map(f=>({...f,text:fixture.source.slice(f.start,f.end)}))};}
