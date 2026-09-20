import {useContext,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppContext} from '../App';
import {Button,Icon,Surface} from '../ui';
import NovaPessoa from './NovaPessoa';
export default function PrimeiroCuidado(){
 const app=useContext(AppContext)!,navigate=useNavigate();
 const [choice,setChoice]=useState<boolean|null>(null);
 return <div className="page narrow care-onboarding"><span className="eyebrow">VAMOS COMEÇAR</span><h1>Quem vai receber o cuidado?</h1><p>Os lembretes chegam pelo WhatsApp.</p><div className="grid2"><Surface><Icon name="user" size={32}/><h2>Para mim</h2><Button className="big" onClick={()=>setChoice(true)}>Cuidar de mim</Button></Surface><Surface><Icon name="heart" size={32}/><h2>Para um familiar</h2><Button className="big" onClick={()=>setChoice(false)}>Cuidar de um familiar</Button></Surface></div><p className="muted small">Depois, escolha os programas de cuidado.</p>{choice!==null&&<NovaPessoa paraMim={choice} onboarding onClose={()=>setChoice(null)} onSaved={async phone=>{await app.reload();navigate(`/programas/${phone}`);}}/>}</div>;
}
