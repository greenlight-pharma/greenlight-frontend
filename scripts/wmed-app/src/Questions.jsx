import React from 'react';
import QuestionBank from './questions/QuestionBank';
import {questionStorageKey} from './questions/storage.mjs';
import './questions/wmed.css';
export default function Questions({session}){
 const key=questionStorageKey(session?.authenticated?session.user?.progressScope:null);
 return <div className="wmed-questions"><QuestionBank key={key} storageKey={key}/></div>;
}
