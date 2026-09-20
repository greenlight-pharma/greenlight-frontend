import {useContext} from 'react';
import {Link,useNavigate,useParams} from 'react-router-dom';
import {AppContext} from '../App';
import {Icon,Notice,Surface} from '../ui';
import Checkin from './Checkin';
export default function Programas(){
 const app=useContext(AppContext)!,{phone}=useParams(),navigate=useNavigate();
 return <div className="page narrow"><Surface><label className="field"><span>Quem vamos cuidar?</span><select value={phone??''} onChange={e=>navigate(e.target.value?`/programas/${e.target.value}`:'/programas')}><option value="">Escolha uma pessoa</option>{app.patients.map(p=><option key={p.phone} value={p.phone}>{p.name}</option>)}</select></label><Notice>{app.error}</Notice><button className="link" onClick={app.openNewPatient}>+ Cadastrar pessoa</button></Surface>{phone?<Checkin key={phone} phone={phone}/>:<><h1>Saúde e acompanhamento</h1><p>Escolha a pessoa para configurar seu check-in diário.</p></>}</div>;
}
export function ProgramasEntry({phone}:{phone:string}){return <Link className="surface gestacao-entry" to={`/programas/${phone}`}><Icon name="heart" size={28}/><div className="grow"><b>Saúde e acompanhamento</b><p className="muted small">Condições de saúde e check-in diário no WhatsApp.</p></div><Icon name="chev"/></Link>;}
