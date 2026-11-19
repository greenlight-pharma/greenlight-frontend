// Casos da comunidade: feed de casos compartilhados e o desafio (o médico dá o diagnóstico antes do feedback).
// Abre direto pelo link público: /c/<id> → #comunidade?caso=<id>.
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Flag, Users, Share2 } from 'lucide-react';
import { fields } from '../../shared/case-contract.mjs';
import CaseFeedback from '../CaseFeedback';
import { ShareLinks, sharedRequest } from './ShareCase';
import { useI18n } from './I18n';
import '../case-feedback.css';
import './share-case.css';
import './community.css';

const casoDoHash = () => new URLSearchParams(location.hash.split('?')[1] || '').get('caso') || '';
export default function CommunityCases({ session, onLogin }) {
 const { t, locale } = useI18n();
 const [id, setId] = useState(casoDoHash), [pagina, setPagina] = useState(1), [lista, setLista] = useState(null), [caso, setCaso] = useState(null);
 const [resposta, setResposta] = useState(''), [revelado, setRevelado] = useState(false), [share, setShare] = useState(false), [erro, setErro] = useState(''), [aviso, setAviso] = useState('');
 useEffect(() => { const f = () => setId(casoDoHash()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
 useEffect(() => {
  if (id) return;
  setErro(''); fetch(`/api/wmed/compartilhados?pagina=${pagina}`).then(r => r.json().then(d => r.ok ? d : Promise.reject(Error(d.error)))).then(setLista).catch(e => setErro(e.message || t('Não foi possível carregar.')));
 }, [id, pagina]);
 useEffect(() => {
  if (!id) { setCaso(null); return; }
  setCaso(null); setResposta(''); setRevelado(false); setShare(false); setErro(''); setAviso('');
  fetch(`/api/wmed/compartilhados?id=${encodeURIComponent(id)}`).then(r => r.json().then(d => r.ok ? d : Promise.reject(Error(d.error)))).then(d => setCaso(d.caso)).catch(e => setErro(e.message));
 }, [id]);
 const abrir = (x) => { location.hash = x ? `comunidade?caso=${x}` : 'comunidade'; };
 const data = (d) => new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
 async function revelar(e) {
  e.preventDefault(); setRevelado(true);
  sharedRequest({ action: 'responder', id: caso.id }).catch(() => {});
 }
 async function denunciar() {
  if (!session?.authenticated) return onLogin?.();
  try { await sharedRequest({ action: 'denunciar', id: caso.id }); setAviso(t('Obrigado. Vamos revisar este caso.')); } catch (e) { setErro(e.message); }
 }
 if (id) return <section className="module-page community-page">
  <button className="back-button" onClick={() => abrir('')}><ArrowLeft size={17} /> {t('Casos da comunidade')}</button>
  {erro && <p role="alert" className="error">{erro}</p>}
  {!caso && !erro && <p className="module-note">{t('Abrindo caso…')}</p>}
  {caso && <>
   <header className="community-case-head"><span className="eyebrow blue">{t('DESAFIO CLÍNICO')}</span><h1>{caso.titulo}</h1>
    <p>{caso.autor || t('Médico anônimo')} · {data(caso.criadoEm)} · {caso.respostas} {t(caso.respostas === 1 ? 'tentativa' : 'tentativas')}</p></header>
   <dl className="community-fields">{fields.filter(([k]) => caso.campos[k]).map(([k, l]) => <div key={k}><dt>{t(l)}</dt><dd>{caso.campos[k]}</dd></div>)}</dl>
   {!revelado ? <form className="community-answer" onSubmit={revelar}>
    <label htmlFor="community-guess"><strong>{t('Qual é a sua principal hipótese?')}</strong><span>{t('Responda antes de ver as hipóteses e o feedback da IA.')}</span></label>
    <textarea id="community-guess" rows={3} maxLength={300} value={resposta} onChange={e => setResposta(e.target.value)} placeholder={t('Ex.: síndrome coronariana aguda')} />
    <button className="module-primary" disabled={resposta.trim().length < 3}>{t('Ver o feedback')} <ArrowRight size={17} /></button>
    <button type="button" className="community-skip" onClick={() => setRevelado(true)}>{t('Pular e ver a resposta')}</button>
   </form> : <>
    {resposta.trim() && <p className="community-mine"><b>{t('Sua hipótese')}:</b> {resposta}</p>}
    <CaseFeedback feedback={caso.feedback} quality={Number.isInteger(caso.score) ? { score: caso.score, criteria: [] } : null} qualityError="" grading={false} restPending={false} restError=""
     relato={fields.filter(([k]) => caso.campos[k]).map(([k, l]) => `${t(l)}: ${caso.campos[k]}`).join('\n')} form={caso.campos} busy={false} />
   </>}
   <div className="community-actions">
    <button type="button" onClick={() => setShare(!share)}><Share2 size={16} /> {t('Compartilhar')}</button>
    {!caso.dono && <button type="button" onClick={denunciar}><Flag size={16} /> {t('Denunciar')}</button>}
   </div>
   {share && <ShareLinks caso={caso} onRemoved={caso.dono ? () => abrir('') : undefined} />}
   {aviso && <p className="module-note" role="status">{aviso}</p>}
  </>}
 </section>;
 return <section className="module-page community-page">
  <header className="module-heading"><span className="eyebrow blue">{t('PRÁTICA CLÍNICA')}</span><h1>{t('Casos da comunidade')}</h1>
   <p>{t('Casos compartilhados por médicos, sem dados do paciente. Tente o diagnóstico antes de ver o feedback.')}</p></header>
  {erro && <p role="alert" className="error">{erro}</p>}
  {lista && !lista.casos.length && <div className="community-empty"><Users size={28} /><p>{t('Ainda não há casos compartilhados. Termine um caso clínico e toque em Compartilhar.')}</p><a href="#caso">{t('Abrir caso clínico')}</a></div>}
  <div className="community-list">{lista?.casos.map(c => <button key={c.id} onClick={() => abrir(c.id)}>
   <div><strong>{c.titulo}</strong><small>{c.autor || t('Médico anônimo')} · {data(c.criadoEm)} · {c.respostas} {t(c.respostas === 1 ? 'tentativa' : 'tentativas')}</small></div>
   <span className="community-lang">{c.idioma.toUpperCase()}</span><ArrowRight size={17} /></button>)}</div>
  {lista?.paginas > 1 && <div className="case-pagination"><button disabled={pagina <= 1} onClick={() => setPagina(p => p - 1)}>{t('Anterior')}</button><span>{pagina}/{lista.paginas}</span><button disabled={pagina >= lista.paginas} onClick={() => setPagina(p => p + 1)}>{t('Próxima')}</button></div>}
 </section>;
}
