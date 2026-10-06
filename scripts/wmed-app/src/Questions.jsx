import React,{useState} from 'react';
import QuestionBank from './questions/QuestionBank';
import {approvedQbank} from '../shared/approved-qbank.mjs';
import {qbankEntry} from './questions/catalog-entry.mjs';
import './questions/wmed.css';
export default function Questions({session}){
 const [original,setOriginal]=useState(false);
 const doctor=import.meta.env.VITE_PRODUCT==='2doctor';
 const entry=qbankEntry({doctor,original,scope:session?.authenticated?session.user?.progressScope:null});
 return <div className="wmed-questions">{doctor&&approvedQbank.length>0&&<label>Question catalog <select aria-label="Question catalog" value={original?'original':'legacy'} onChange={e=>setOriginal(e.target.value==='original')}><option value="legacy">Existing exam catalog</option><option value="original">Original learning catalog</option></select></label>}<QuestionBank key={entry.storageKey} {...entry}/></div>;
}
