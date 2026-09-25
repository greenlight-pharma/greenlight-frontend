import {challenges} from './challenges.mjs';
export const reviewStorageKey='2doctor-challenge-reviews-v1';
const validAnswer=(q,value)=>Number.isInteger(value)&&value>=0&&value<q.options.length;
export function needsReview(q,progress,reviews={}){
 return validAnswer(q,progress?.[q.id])&&progress[q.id]!==q.answer&&reviews?.[q.id]!==true;
}
export function reviewQueue(progress,reviews={}){return challenges.filter(q=>needsReview(q,progress,reviews));}
export function unansweredQueue(progress){return challenges.filter(q=>!validAnswer(q,progress?.[q.id]));}
export function readChallengeReviews(storage,progress){
 try{const raw=JSON.parse(storage.getItem(reviewStorageKey)||'{}');return Object.fromEntries(challenges.filter(q=>validAnswer(q,progress?.[q.id])&&progress[q.id]!==q.answer&&raw?.[q.id]===true).map(q=>[q.id,true]));}catch{return {};}
}
// Preserve the original answer; a separate flag records a successful retry.
export function recordReview(reviews,progress,id,answer){
 const q=challenges.find(q=>q.id===id);
 if(!q||!validAnswer(q,answer)||!validAnswer(q,progress?.[id])||progress[id]===q.answer)return reviews;
 const next={...reviews};if(answer===q.answer)next[id]=true;else delete next[id];return next;
}
