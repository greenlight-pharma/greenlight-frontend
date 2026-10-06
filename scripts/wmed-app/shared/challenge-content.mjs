const dateValid=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
const text=value=>typeof value==='string'&&value.trim().length>0||Array.isArray(value)&&value.length===3&&value.every(v=>typeof v==='string'&&v.trim());
export function validIllustration(image){return image?.kind==='sequence'&&Array.isArray(image.steps)&&image.steps.length>=2&&image.steps.length<=5&&image.steps.every(text)&&Number.isInteger(image.highlight)&&image.highlight>=0&&image.highlight<image.steps.length&&text(image.alt);}
export function validVisualChallenge(q){
 return !!q&&/^[a-z][a-z0-9-]{0,59}$/.test(q.id||'')&&[q.topic,q.question,q.explanation,q.memory].every(text)&&Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=5&&q.options.every(text)&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length&&Array.isArray(q.rationales)&&q.rationales.length===q.options.length&&q.rationales.every(text)&&validIllustration(q.illustration)&&text(q.sourceDetails?.name)&&/^https:\/\//.test(q.sourceDetails?.url||'')&&q.provenance?.rights==='original'&&text(q.provenance?.author)&&dateValid(q.provenance?.verifiedOn);
}
export function editoriallyApproved(q){try{return validVisualChallenge(q)&&q.editorialReview?.status==='approved'&&text(q.editorialReview.reviewer)&&dateValid(q.editorialReview.date)&&q.editorialReview.version===q.version;}catch{return false;}}
export function approvedVisualChallenges(items){return items.filter(editoriallyApproved);}
// Drafts are accepted only by an explicit development preview, never by the production manifest.
export function visualCatalog(base,items,{preview=false}={}){
 const used=new Set(base.map(q=>q.id));const added=[];
 for(const q of items){let valid=false;try{valid=preview?validVisualChallenge(q):editoriallyApproved(q);}catch{}
  if(valid&&!used.has(q.id)){used.add(q.id);added.push(q);}}
 return [...base,...added];
}
