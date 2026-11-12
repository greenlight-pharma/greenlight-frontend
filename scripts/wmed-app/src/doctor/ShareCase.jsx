// Compartilhar um caso salvo: prévia do que fica público, autor com nome ou anônimo, link para o X.
// Vai a público só a cópia dos campos revisados e o feedback, nunca o relato original nem o áudio.
import { useState } from 'react';
import { X as Close, Link2, Share2, Check } from 'lucide-react';
import { fields } from '../../shared/case-contract.mjs';
import { useI18n } from './I18n';
import './share-case.css';

const API = '/api/wmed/compartilhados';
export async function sharedRequest(body) {
 const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WMed-Request': '1' }, body: JSON.stringify(body) });
 const d = await r.json().catch(() => ({}));
 if (!r.ok) throw Error(d.error || 'Não foi possível concluir. Tente novamente.');
 return d;
}
// Texto e endereço da postagem no X (abre a tela de postar; nada é publicado sem o médico confirmar lá).
export function xIntent(t, titulo, url) {
 const texto = `${t('Desafio clínico')}: ${titulo}. ${t('Qual é o seu diagnóstico?')} #MedTwitter #2Doctor`;
 return `https://x.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`;
}
export function ShareLinks({ caso, onRemoved }) {
 const { t } = useI18n();
 const [copied, setCopied] = useState(false), [error, setError] = useState('');
 async function copy() { try { await navigator.clipboard.writeText(caso.url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setError(t('Copie o link manualmente.')); } }
 async function native() { try { await navigator.share({ title: caso.titulo, text: t('Qual é o seu diagnóstico?'), url: caso.url }); } catch {} }
 async function remove() { try { await sharedRequest({ action: 'remover', id: caso.id }); onRemoved?.(); } catch (e) { setError(e.message); } }
 return <div className="share-links">
  <input readOnly value={caso.url} aria-label={t('Link do caso')} onFocus={e => e.target.select()} />
  <div className="share-buttons">
   <a className="share-x" href={xIntent(t, caso.titulo, caso.url)} target="_blank" rel="noreferrer"><span aria-hidden="true">𝕏</span> {t('Postar no X')}</a>
   <button type="button" onClick={copy}>{copied ? <Check size={16} /> : <Link2 size={16} />} {copied ? t('Copiado') : t('Copiar link')}</button>
   {typeof navigator !== 'undefined' && navigator.share && <button type="button" onClick={native}><Share2 size={16} /> {t('Mais opções')}</button>}
  </div>
  {caso.dono && onRemoved && <button type="button" className="share-remove" onClick={remove}>{t('Parar de compartilhar')}</button>}
  {error && <p role="alert" className="error">{error}</p>}
 </div>;
}
export default function ShareCase({ casoId, form, onClose }) {
 const { t, locale } = useI18n();
 const [anon, setAnon] = useState(true), [ok, setOk] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''), [caso, setCaso] = useState(null);
 async function create() {
  setBusy(true); setError('');
  try { setCaso((await sharedRequest({ action: 'criar', casoId, anonimo: anon, confirmo: true, idioma: locale.slice(0, 2) })).caso); }
  catch (e) { setError(t(e.message)); } finally { setBusy(false); }
 }
 const visiveis = fields.filter(([k]) => form?.[k]);
 return <div className="modal-shade" onClick={onClose}>
  <section className="modal share-case" role="dialog" aria-modal="true" aria-labelledby="share-title" onClick={e => e.stopPropagation()}>
   <button className="icon-btn close" aria-label={t('Fechar')} onClick={onClose}><Close /></button>
   <span className="eyebrow blue">{t('CASOS DA COMUNIDADE')}</span>
   <h2 id="share-title">{caso ? t('Caso compartilhado') : t('Compartilhar como desafio')}</h2>
   {caso ? <>
    <p>{t('Quem abrir o link tenta o diagnóstico antes de ver o feedback. O caso também aparece em Casos da comunidade.')}</p>
    <ShareLinks caso={caso} onRemoved={onClose} />
   </> : <>
    <p>{t('Outros médicos verão estes campos e o feedback da IA. O relato original e o áudio não são publicados.')}</p>
    <dl className="share-preview">{visiveis.map(([k, l]) => <div key={k}><dt>{t(l)}</dt><dd>{form[k].length > 180 ? form[k].slice(0, 180) + '…' : form[k]}</dd></div>)}</dl>
    <fieldset className="share-author"><legend>{t('Autor')}</legend>
     <label><input type="radio" checked={anon} onChange={() => setAnon(true)} /> {t('Médico anônimo')}</label>
     <label><input type="radio" checked={!anon} onChange={() => setAnon(false)} /> {t('Mostrar meu nome')}</label>
    </fieldset>
    <label className="confirm-row"><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} /> {t('Conferi: o caso não tem nome, iniciais, datas, local ou outro dado que identifique o paciente.')}</label>
    {error && <p role="alert" className="error">{error}</p>}
    <button className="auth-submit" disabled={!ok || busy} onClick={create}>{busy ? t('Criando link…') : t('Criar link público')}</button>
   </>}
  </section>
 </div>;
}
