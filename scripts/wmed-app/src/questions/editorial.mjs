import {validIllustration} from '../../shared/challenge-content.mjs';
export function validQuestion(q){
 return typeof q.n==='string'&&/^[a-z0-9-]+:[a-z0-9-]+$/.test(q.n)&&typeof q.version==='string'&&!!q.version&&!!q.enunciado&&!!q.explicacao&&Object.hasOwn(q.alternativas||{},q.gabarito)&&Object.keys(q.alternativas).length>=2&&Object.keys(q.alternativas).every(k=>typeof q.rationales?.[k]==='string'&&q.rationales[k].trim())&&(q.provenance?.rights==='original'||(q.provenance?.rights==='licensed'&&!!q.provenance.license&&!!q.provenance.licenseUrl))&&!!q.provenance?.author&&/^\d{4}-\d{2}-\d{2}$/.test(q.source?.verified||'')&&/^https:\/\//.test(q.source?.url||'')&&(!q.illustration||validIllustration(q.illustration));
}
export function approvedQuestion(q){return validQuestion(q)&&q.review?.status==='approved'&&!!q.review.reviewer&&/^\d{4}-\d{2}-\d{2}$/.test(q.review.date||'')&&q.review.version===q.version;}
export function assertCatalog(items,{preview=false}={}){if(new Set(items.map(q=>q.n)).size!==items.length||items.some(q=>!(preview?validQuestion(q):approvedQuestion(q))))throw Error('Qbank contains invalid or unreviewed questions');return items;}
