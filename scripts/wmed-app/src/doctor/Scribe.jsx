// 2Doctor Scribe: a consulta é transcrita ao vivo e vira uma nota; o apoio ao raciocínio fica separado.
// Início (acesso, nova consulta, anteriores, preferências) → consulta ao vivo → revisão.
import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { Mic, Pause, Play, Square, Copy, Check, Trash2, Plus, ArrowLeft, Settings2, TriangleAlert, PlayCircle, ShieldCheck } from 'lucide-react';
import { useI18n } from './I18n';
import { VoiceSession } from './scribe-voice';
import { trackScribeCheckout, trackScribePurchase } from './pixel';
import {
 UPDATE_INTERVAL, MAX_RECONNECTS, reconnectDelay, createConversation, lastSession, roleOf, swapRole, receive, buildTranscript,
 flushPartial, dialogueForFinish, rolesRequest, applyClinician, snapshot, liveKey, clock, noteText, hasSupport,
 TEMPLATE_NAMES, ROLE_LABEL, LIKELIHOOD, SPECIALTIES, PROBLEMS, PHASE, MIC_PROBLEMS,
} from '../../shared/scribe-client.mjs';
import { EXAMPLE_LABEL, exampleTurns, exampleProgress, exampleChunks } from '../../shared/scribe-example.mjs';
import './scribe.css';

const API = '/api/wmed';
const RETURN_KEY = '2doctor-scribe-return';
const NOTE_LANGUAGES = [['en', 'English'], ['es', 'Español'], ['pt-BR', 'Português (Brasil)']];
const DEFAULT_PREFERENCES = { specialty: '', detail: 'balanced', structure: 'prose', vocabulary: 'technical', quotes: false, abbreviations: true, reasoning: true, instructions: '' };

async function call(locale, action, body = {}) {
 let response, data = null;
 try {
  response = await fetch(`${API}/scribe`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WMed-Request': '1', 'X-2Doctor-Idioma': locale.slice(0, 2) }, body: JSON.stringify({ action, ...body }) });
 } catch { throw Object.assign(Error(''), { code: 'NETWORK' }); }
 try { data = await response.json(); } catch { /* resposta sem JSON */ }
 if (!response.ok || !data) throw Object.assign(Error(data?.error || ''), { code: data?.code || (response.status === 401 ? 'AUTH_REQUIRED' : 'UNAVAILABLE'), status: response.status });
 return data;
}
const problem = (t, e) => (PROBLEMS[e?.code] ? t(PROBLEMS[e.code]) : e?.message || t('Não foi possível concluir. Tente de novo.'));
const storage = { get(key) { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; } }, set(key, value) { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* sem armazenamento */ } }, drop(key) { try { sessionStorage.removeItem(key); } catch { /* segue */ } } };
const recordInHash = () => new URLSearchParams(location.hash.split('?')[1] || '').get('c') || '';
const templateName = (t, id, fallback) => (TEMPLATE_NAMES[id] ? t(TEMPLATE_NAMES[id]) : fallback || '');
const noteLanguage = (locale) => (NOTE_LANGUAGES.some(([id]) => id === locale) ? locale : 'en');

export default function Scribe({ session, onLogin }) {
 const { t, locale } = useI18n();
 const authed = !!session?.authenticated;
 const api = (action, body) => call(locale, action, body);
 const [status, setStatus] = useState(null), [statusError, setStatusError] = useState('');
 const [view, setView] = useState({ name: 'home' });
 // Volta do pagamento (#scribe-ok): mostra a confirmação e confere o plano algumas vezes (o webhook pode atrasar).
 const [paid, setPaid] = useState(() => location.hash === '#scribe-ok');
 const known = useRef(null), opening = useRef('');

 useEffect(() => { if (location.hash === '#scribe-ok') history.replaceState(null, '', `${location.pathname}${location.search}#scribe`); }, []);
 useEffect(() => { if (authed) storage.drop(RETURN_KEY); }, [authed]);

 async function loadStatus() {
  try { const d = await api('status'); setStatus(d); setStatusError(''); return d; }
  catch (e) { setStatus(null); setStatusError(problem(t, e)); return null; }
 }
 useEffect(() => {
  if (!authed) { setStatus(null); setStatusError(''); return; }
  let live = true, tries = 0, timer;
  const load = async () => {
   const d = await loadStatus();
   if (!live || !paid) return;
   if (d?.access?.plan === 'scribe') trackScribePurchase(d.access.renews || 'scribe');
   else if (++tries < 6) timer = setTimeout(load, 2500);
  };
  load();
  return () => { live = false; clearTimeout(timer); };
 }, [authed, paid]);

 // A consulta aberta fica no endereço (#scribe?c=<id>): recarregar a aba volta para ela.
 useEffect(() => {
  if (!authed) return;
  const sync = async () => {
   const id = recordInHash();
   if (!id) { opening.current = ''; setView((v) => (v.name === 'session' && !v.example ? { name: 'home' } : v)); return; }
   if (known.current?.id === id) { opening.current = id; setView({ name: 'session', record: known.current, demo: known.current.demo }); return; }
   opening.current = id; setView({ name: 'opening' });
   try { const d = await api('open', { id }); if (opening.current === id) { known.current = d.record; setView({ name: 'session', record: d.record }); } }
   catch (e) { if (opening.current === id) setView({ name: 'home', error: problem(t, e) }); }
  };
  sync(); addEventListener('hashchange', sync);
  return () => removeEventListener('hashchange', sync);
 }, [authed]);

 function show(record, demo) { known.current = demo ? { ...record, demo } : record; if (recordInHash() === record.id) setView({ name: 'session', record, demo }); else location.hash = `scribe?c=${record.id}`; }
 function home() { known.current = null; if (recordInHash()) location.hash = 'scribe'; setView({ name: 'home' }); if (authed) loadStatus(); }
 function login() { storage.set(RETURN_KEY, 1); onLogin?.(); }
 // Exemplo: com assinatura e IA no ar, passa pelo mesmo caminho da consulta real; nos outros casos é roteirizado
 // e não toca no servidor (não gasta consulta gratuita).
 async function example() {
  if (authed && status?.ready?.ai && status.access?.plan === 'scribe') {
   try { const d = await api('start', { template: 'first-visit', label: t(EXAMPLE_LABEL), language: noteLanguage(locale), consent: true }); show(d.record, 'online'); return; }
   catch { /* cai no exemplo roteirizado */ }
  }
  setView({ name: 'session', example: true, demo: 'offline', record: { id: 'example', label: t(EXAMPLE_LABEL), template: 'first-visit', status: 'live', note: exampleProgress(0, t).note, support: {}, dialogue: [] } });
 }

 const reasoning = status?.preferences?.reasoning !== false;
 if (view.name === 'opening') return <section className="module-page scb"><p className="scb-quiet" role="status">{t('Abrindo a consulta…')}</p></section>;
 if (view.name === 'session') {
  const { record, demo } = view;
  return record.status === 'finished'
   ? <Review key={record.id} record={record} api={api} onHome={home} onChange={(r) => { known.current = r; }} />
   : <Live key={record.id} record={record} demo={demo} reasoning={reasoning} voiceReady={!!status?.ready?.voice} api={api} onExit={home}
      onFinished={(r) => { known.current = r.example ? null : r; setView({ name: 'session', record: r, example: r.example }); if (authed && !r.example) loadStatus(); }} />;
 }
 return <Home authed={authed} status={status} statusError={statusError || view.error} paid={paid} api={api} onLogin={login} onExample={example} onRetry={loadStatus}
  onStarted={(record) => show(record)} onOpen={(id) => { location.hash = `scribe?c=${id}`; }} onStatus={setStatus} onPaidSeen={() => setPaid(false)} />;
}

// ---------------------------------------------------------------------------
// Início
// ---------------------------------------------------------------------------
function Home({ authed, status, statusError, paid, api, onLogin, onExample, onRetry, onStarted, onOpen, onStatus, onPaidSeen }) {
 const { t, locale } = useI18n();
 const access = status?.access, plan = access?.plan, price = `US$ ${status?.price?.monthly ?? 29}`;
 const [records, setRecords] = useState(null), [confirming, setConfirming] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState('');
 const templates = status?.templates || [];
 const [form, setForm] = useState({ template: 'first-visit', label: '', context: '', language: noteLanguage(locale), consent: false });
 const ready = !!status;
 useEffect(() => { if (!ready) { setRecords(null); return; } api('list').then((d) => setRecords(d.records || [])).catch(() => setRecords([])); }, [ready]);
 useEffect(() => { if (templates.length && !templates.some((m) => m.id === form.template)) setForm((f) => ({ ...f, template: templates[0].id })); }, [templates.length]);

 async function billing(action) {
  setBusy(action); setError('');
  if (action === 'checkout') trackScribeCheckout();
  try {
   const r = await fetch(`${API}/billing`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WMed-Request': '1', 'X-2Doctor-Idioma': locale.slice(0, 2) }, body: JSON.stringify(action === 'checkout' ? { action, produto: 'scribe' } : { action }) });
   const d = await r.json();
   if (!r.ok || !d.url) throw Error(d.error || t('Não foi possível abrir o pagamento.'));
   location.assign(d.url);
  } catch (e) { setError(e.message || t('Não foi possível abrir o pagamento.')); setBusy(''); }
 }
 async function start(e) {
  e.preventDefault();
  if (!form.consent || busy) return;
  setBusy('start'); setError('');
  try {
   const d = await api('start', { template: form.template, language: form.language, consent: true, ...(form.label.trim() ? { label: form.label.trim() } : {}), ...(form.context.trim() ? { context: form.context.trim() } : {}) });
   onStarted(d.record);
  } catch (e2) {
   if (e2.code === 'SCRIBE_TRIAL_ENDED' && status) onStatus({ ...status, access: { ...status.access, plan: 'none', trialLeft: 0 } });
   setError(problem(t, e2)); setBusy('');
  }
 }
 async function remove(id) {
  setConfirming(''); setError('');
  try { await api('delete', { id }); storage.drop(liveKey(id)); setRecords((list) => (list || []).filter((r) => r.id !== id)); }
  catch (e) { setError(problem(t, e)); }
 }
 const date = (value) => { try { return new Date(value).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' }); } catch { return ''; } };
 const day = (value) => { try { return new Date(value).toLocaleDateString(locale); } catch { return ''; } };
 const paywall = <section className="scb-card scb-paywall" aria-labelledby="scb-pay-title">
  <h2 id="scb-pay-title">2Doctor Scribe · {price}/{t('mês')} · {t('cancele quando quiser')}</h2>
  <p>{plan === 'none' ? t('Você usou as 3 consultas gratuitas. Assine para continuar.') : t('Continue usando o Scribe depois das consultas gratuitas.')}</p>
  <button className="scb-btn primary" disabled={!!busy} onClick={() => billing('checkout')}>{busy === 'checkout' ? t('Abrindo…') : `${t('Assinar o Scribe')} · ${price}/${t('mês')}`}</button>
  <small>{t('Pagamento seguro pelo Stripe. Cancele quando quiser.')}</small>
 </section>;

 return <section className="module-page scb scb-home">
  <header className="scb-head">
   <div><h1>Scribe</h1><p>{t('O Scribe ouve a consulta, separa quem falou e monta a nota. Você revisa no final.')}</p></div>
   {authed && <button className="scb-btn" onClick={onExample}><PlayCircle size={17} aria-hidden="true" />{t('Ver um exemplo')}</button>}
  </header>
  {paid && authed && <p className="scb-notice good" role="status"><Check size={17} aria-hidden="true" /><span>{plan === 'scribe' ? t('Assinatura ativa. Obrigado por assinar o Scribe.') : t('Pagamento recebido. Ativando sua assinatura…')}</span>{plan === 'scribe' && <button className="scb-link" onClick={onPaidSeen}>{t('Fechar')}</button>}</p>}
  {error && <p className="scb-notice bad" role="alert"><TriangleAlert size={17} aria-hidden="true" /><span>{error}</span></p>}
  {!error && statusError && <div className="scb-notice bad scb-resume" role="alert"><TriangleAlert size={17} aria-hidden="true" /><span><strong>{statusError}</strong> {!status && authed && t('Tente de novo em alguns minutos. O exemplo continua disponível.')}</span>{!status && authed && <button className="scb-btn" onClick={onRetry}>{t('Tentar de novo')}</button>}</div>}

  {!authed && <section className="scb-card scb-pitch">
   <h2>{t('Menos digitação, mais atenção ao paciente.')}</h2>
   <ul>
    <li>{t('Transcrição ao vivo, com as falas do profissional e do paciente separadas.')}</li>
    <li>{t('Nota organizada por seções enquanto a consulta acontece. Você edita e copia no final.')}</li>
    <li>{t('Apoio ao raciocínio à parte: hipóteses, perguntas que faltam e sinais de alerta, sempre como sugestões para a sua revisão.')}</li>
   </ul>
   <p className="scb-quiet">{t('3 consultas gratuitas. Depois, US$ 29 por mês. Cancele quando quiser.')}</p>
   <div className="scb-row"><button className="scb-btn primary" onClick={onLogin}>{t('Criar conta ou entrar')}</button><button className="scb-btn" onClick={onExample}>{t('Ver um exemplo')}</button></div>
  </section>}
  {authed && !status && !statusError && <p className="scb-quiet" role="status">{t('Carregando…')}</p>}

  {ready && <>
   {plan === 'trial' && <div className="scb-access"><span><strong>{access.trialLeft} {t('de')} {access.trialTotal ?? 3}</strong> {t('consultas gratuitas restantes')}</span><button className="scb-link" disabled={!!busy} onClick={() => billing('checkout')}>{t('Assinar o Scribe')} · {price}/{t('mês')}</button></div>}
   {plan === 'scribe' && <div className="scb-access"><span><strong>{t('Assinatura ativa')}</strong>{access.renews ? ` · ${t(access.cancels ? 'Termina em' : 'Renova em')} ${day(access.renews)}` : ''}</span><button className="scb-link" disabled={!!busy} onClick={() => billing('portal')}>{busy === 'portal' ? t('Abrindo…') : t('Gerenciar assinatura')}</button></div>}
   {plan === 'none' && paywall}
   {!status.ready?.voice && <p className="scb-notice" role="note"><TriangleAlert size={17} aria-hidden="true" /><span>{t('A transcrição ao vivo não está disponível neste momento. Você ainda pode ver o exemplo.')}</span></p>}
   {status.ready?.voice && !status.ready?.ai && <p className="scb-notice" role="note"><TriangleAlert size={17} aria-hidden="true" /><span>{t('A IA não está disponível neste momento: a conversa é transcrita, mas a nota não será montada.')}</span></p>}

   {plan !== 'none' && <form className="scb-card scb-new" onSubmit={start} aria-labelledby="scb-new-title">
    <h2 id="scb-new-title">{t('Nova consulta')}</h2>
    <fieldset className="scb-templates"><legend>{t('Tipo de consulta')}</legend>
     {templates.map((m) => <label key={m.id} className={form.template === m.id ? 'on' : ''}>
      <input type="radio" name="scb-template" value={m.id} checked={form.template === m.id} onChange={() => setForm({ ...form, template: m.id })} />
      <strong>{templateName(t, m.id, m.name)}</strong><small>{(m.sections || []).map((s) => s.title).join(' · ')}</small>
     </label>)}
    </fieldset>
    <div className="scb-fields">
     <label className="scb-field"><span>{t('Identificação (opcional)')}</span>
      <input value={form.label} maxLength={80} onChange={(e) => setForm({ ...form, label: e.target.value })} aria-describedby="scb-label-help" autoComplete="off" />
      <small id="scb-label-help">{t('Use iniciais ou o número do leito, não o nome completo do paciente.')}</small>
     </label>
     <label className="scb-field"><span>{t('Idioma da nota')}</span>
      <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>{NOTE_LANGUAGES.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
     </label>
    </div>
    <label className="scb-field"><span>{t('Contexto (opcional)')}</span>
     <textarea rows={2} value={form.context} maxLength={1000} onChange={(e) => setForm({ ...form, context: e.target.value })} placeholder={t('Ex.: 72 anos, infarto em 2024, veio com a filha.')} />
    </label>
    <label className="scb-check"><input type="checkbox" required checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} /><span>{t('O paciente concordou com a transcrição desta consulta.')}</span></label>
    <div className="scb-row end">
     <small className="scb-quiet"><ShieldCheck size={15} aria-hidden="true" />{t('O áudio é enviado para transcrição e não é guardado pelo 2Doctor. Você pode apagar qualquer registro.')}</small>
     <button className="scb-btn primary" disabled={!form.consent || !!busy || !status.ready?.voice}>{busy === 'start' ? t('Abrindo…') : t('Abrir consulta')}</button>
    </div>
   </form>}

   <section className="scb-records" aria-labelledby="scb-list-title">
    <h2 id="scb-list-title">{t('Consultas anteriores')}</h2>
    {records === null ? <p className="scb-quiet">{t('Carregando…')}</p> : !records.length ? <p className="scb-quiet">{t('Suas consultas aparecem aqui.')}</p> : <ul>
     {records.map((r) => <li key={r.id}>
      <button className="scb-record" onClick={() => onOpen(r.id)}>
       <strong>{r.label || t('Sem identificação')}</strong><span>{templateName(t, r.template, r.templateName)}</span>
       {r.status === 'live' && <span className="scb-chip">{t('Em andamento')}</span>}
       <time dateTime={r.startedAt}>{date(r.startedAt)}</time>
      </button>
      {confirming === r.id
       ? <span className="scb-confirm" role="group" aria-label={t('Apagar esta consulta?')}><span>{t('Apagar esta consulta?')}</span><button className="scb-btn danger" onClick={() => remove(r.id)}>{t('Apagar')}</button><button className="scb-btn" onClick={() => setConfirming('')}>{t('Cancelar')}</button></span>
       : <button className="scb-icon" aria-label={`${t('Apagar')}: ${r.label || t('Sem identificação')}`} title={t('Apagar')} onClick={() => setConfirming(r.id)}><Trash2 size={17} /></button>}
     </li>)}
    </ul>}
   </section>

   <Preferences initial={status.preferences} api={api} onSaved={(preferences) => onStatus({ ...status, preferences })} />
   {plan === 'trial' && paywall}
  </>}
 </section>;
}

function Preferences({ initial, api, onSaved }) {
 const { t } = useI18n();
 const [p, setP] = useState({ ...DEFAULT_PREFERENCES, ...(initial || {}) }), [state, setState] = useState(null);
 const set = (key, value) => { setP({ ...p, [key]: value }); setState(null); };
 async function save(e) {
  e.preventDefault(); setState({ busy: true });
  try { const d = await api('preferences-save', { preferences: p }); setP({ ...DEFAULT_PREFERENCES, ...d.preferences }); onSaved(d.preferences); setState({ good: true, text: t('Preferências salvas. Valem a partir da próxima atualização da nota.') }); }
  catch (e2) { setState({ text: problem(t, e2) }); }
 }
 const select = (key, label, options) => <label className="scb-field"><span>{label}</span><select value={p[key]} onChange={(e) => set(key, e.target.value)}>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
 const toggle = (key, title, text) => <label className="scb-check"><input type="checkbox" checked={!!p[key]} onChange={(e) => set(key, e.target.checked)} /><span><strong>{title}</strong><small>{text}</small></span></label>;
 return <details className="scb-card scb-settings">
  <summary><Settings2 size={18} aria-hidden="true" />{t('Preferências do Scribe')}</summary>
  <form onSubmit={save}>
   <label className="scb-field"><span>{t('Especialidade')}</span>
    <input list="scb-specialties" value={p.specialty} maxLength={80} onChange={(e) => set('specialty', e.target.value)} placeholder={t('Escolha ou escreva a sua')} />
    <datalist id="scb-specialties">{SPECIALTIES.map((s) => <option key={s} value={t(s)} />)}</datalist>
   </label>
   <div className="scb-fields three">
    {select('detail', t('Nível de detalhe'), [['concise', t('Conciso')], ['balanced', t('Equilibrado')], ['detailed', t('Detalhado')]])}
    {select('structure', t('Estrutura do texto'), [['prose', t('Texto corrido')], ['bullets', t('Tópicos')]])}
    {select('vocabulary', t('Vocabulário'), [['technical', t('Técnico')], ['plain', t('Simples')]])}
   </div>
   {toggle('quotes', t('Incluir falas do paciente entre aspas'), t('Registra o sintoma com as palavras de quem sente.'))}
   {toggle('abbreviations', t('Usar abreviações médicas'), t('As de uso corrente na sua especialidade.'))}
   {toggle('reasoning', t('Mostrar apoio ao raciocínio: hipóteses, perguntas e sinais de alerta'), t('Sugestões ao lado da nota, para a sua revisão. Nunca entram na nota.'))}
   <label className="scb-field"><span>{t('Suas instruções para o Scribe (opcional)')}</span>
    <textarea rows={2} value={p.instructions} maxLength={1000} onChange={(e) => set('instructions', e.target.value)} placeholder={t('Ex.: sempre registrar a classe funcional; escrever o plano em itens numerados.')} />
   </label>
   <div className="scb-row end">{state?.text && <span className={state.good ? 'scb-saved' : 'scb-bad'} role="status">{state.text}</span>}<button className="scb-btn primary" disabled={state?.busy}>{t('Salvar preferências')}</button></div>
  </form>
 </details>;
}

// ---------------------------------------------------------------------------
// Peças comuns da consulta
// ---------------------------------------------------------------------------
// A consulta ocupa a altura que sobra abaixo do cabeçalho do app (as colunas rolam por dentro).
function useFill() {
 const ref = useRef(null);
 useLayoutEffect(() => {
  const fit = () => { const el = ref.current; if (el) el.style.setProperty('--scb-top', `${Math.round(el.getBoundingClientRect().top + window.scrollY)}px`); };
  fit(); addEventListener('resize', fit);
  return () => removeEventListener('resize', fit);
 }, []);
 return ref;
}

function Conversation({ dialogue, partial = [], roleFor, onSwap }) {
 const { t } = useI18n();
 const box = useRef(null), stick = useRef(true);
 useEffect(() => { const el = box.current; if (el && stick.current) el.scrollTop = el.scrollHeight; });
 return <div className="scb-scroll" ref={box} onScroll={(e) => { const el = e.currentTarget; stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60; }}>
  {!dialogue.length && !partial.length && <p className="scb-empty">{t('A conversa aparece aqui, separada por quem falou.')}</p>}
  {dialogue.map((turn, i) => <div key={i} className={`scb-turn ${turn.who}`}>
   {onSwap && turn.voice
    ? <button className="scb-who" title={t('Trocar quem falou')} aria-label={`${t(ROLE_LABEL[turn.who] || ROLE_LABEL.unknown)}. ${t('Trocar quem falou')}`} onClick={() => onSwap(turn)}>{t(ROLE_LABEL[turn.who] || ROLE_LABEL.unknown)}</button>
    : <span className="scb-who">{t(ROLE_LABEL[turn.who] || ROLE_LABEL.unknown)}</span>}
   <p>{turn.text}</p>
  </div>)}
  {partial.map((turn, i) => { const who = roleFor ? roleFor(turn.voice) : 'unknown'; return <div key={`p${i}`} className={`scb-turn ${who} pending`}><span className="scb-who">{t(ROLE_LABEL[who])}</span><p>{turn.text}</p></div>; })}
 </div>;
}

function Reasoning({ support, id }) {
 const { t } = useI18n();
 const hypotheses = support?.hypotheses || [], questions = support?.questions || [], alerts = support?.alerts || [];
 return <section className="scb-col scb-reasoning" id={id} aria-labelledby={`${id}-title`}>
  <header><h2 id={`${id}-title`}>{t('Raciocínio')}</h2><span className="scb-tag">{t('Sugestões da IA')}</span></header>
  <p className="scb-caption">{t('Sugestões para apoiar seu raciocínio. Você decide.')}</p>
  <div className="scb-scroll">
   {alerts.length > 0 && <div className="scb-alerts" role="status"><h3><TriangleAlert size={16} aria-hidden="true" />{t('Sinais de alerta')}</h3><ul>{alerts.map((text, i) => <li key={i}>{text}</li>)}</ul></div>}
   <h3>{t('Diagnóstico diferencial')}</h3>
   {!hypotheses.length && <p className="scb-empty">{t('Aparecem quando houver informação suficiente.')}</p>}
   {hypotheses.map((h, i) => <article key={h.name || i} className="scb-hypothesis">
    <div><strong>{h.name}</strong><span className={`scb-chip ${h.likelihood || ''}`}>{LIKELIHOOD[h.likelihood] ? t(LIKELIHOOD[h.likelihood]) : h.likelihood}</span></div>
    {h.supporting && <p><b>{t('A favor')}: </b>{h.supporting}</p>}
    {h.against && <p><b>{t('Contra ou falta')}: </b>{h.against}</p>}
   </article>)}
   <h3>{t('Perguntas a fazer')}</h3>
   {!questions.length ? <p className="scb-empty">{t('Nenhuma sugestão no momento.')}</p> : <ul className="scb-questions">{questions.map((text, i) => <li key={i}>{text}</li>)}</ul>}
  </div>
 </section>;
}

function Tabs({ tab, setTab, reasoning }) {
 const { t } = useI18n();
 const items = [['talk', 'Conversa'], ['note', 'Nota'], ...(reasoning ? [['why', 'Raciocínio']] : [])];
 return <div className="scb-tabs" role="tablist" aria-label={t('Partes da consulta')}>
  {items.map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} aria-controls={`scb-${id}`} onClick={() => setTab(id)}>{t(label)}</button>)}
 </div>;
}

// ---------------------------------------------------------------------------
// Consulta ao vivo
// ---------------------------------------------------------------------------
const ACTIVE = ['connecting', 'listening', 'paused', 'reconnecting'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function Live({ record, demo, reasoning, voiceReady, api, onFinished, onExit }) {
 const { t } = useI18n();
 const [, redraw] = useReducer((n) => n + 1, 0);
 const [tab, setTab] = useState('talk');
 const fill = useFill();
 const offline = demo === 'offline';
 const store = useRef(null);
 if (!store.current) {
  const saved = demo ? null : storage.get(liveKey(record.id));
  const noted = (record.note || []).some((x) => x.text?.trim());
  // O que muda várias vezes por segundo fica fora do estado do React; a tela é redesenhada a pedido.
  store.current = {
   c: createConversation(saved), phase: 'ready', seconds: Number(saved?.seconds) || record.durationSeconds || 0, note: record.note || [], support: record.support || {},
   notice: null, noteError: '', sent: 0, saved: 0, busy: false, lastSend: 0, asking: false, attempts: 0, voiceFailed: false, gone: false,
   interrupted: !demo && (!!saved?.dialogue?.length || noted), demoIndex: 0, demoStep: 0, demoWait: 0, demoDone: false,
  };
 }
 const s = store.current;
 const voice = useRef(null), demoTimer = useRef(), retryTimer = useRef(), fn = useRef({});

 const pieces = (list) => { receive(s.c, list); redraw(); };
 const persist = () => { if (demo || s.c.version === s.saved) return; s.saved = s.c.version; storage.set(liveKey(record.id), snapshot(s.c, { seconds: s.seconds })); };

 async function update() {
  if (s.busy || s.phase === 'ending' || s.c.version === s.sent) return;
  if (offline) { const p = exampleProgress(s.demoIndex, t); s.note = p.note; s.support = p.support; s.sent = s.c.version; redraw(); return; }
  if (Date.now() - s.lastSend < UPDATE_INTERVAL) return;
  const transcript = buildTranscript(s.c);
  if (!transcript.trim()) return;
  s.busy = true; s.lastSend = Date.now(); const version = s.c.version; redraw();
  try { const d = await api('update', { id: record.id, transcript }); if (Array.isArray(d.note)) s.note = d.note; s.support = d.support || {}; s.sent = version; s.noteError = ''; }
  catch (e) { if (e.code !== 'ALREADY_FINISHED') { s.noteError = e.code === 'AI_UNAVAILABLE' ? t('A nota não pôde ser atualizada agora. A transcrição continua.') : problem(t, e); s.lastSend = Date.now() + 5000; } }
  s.busy = false; if (!s.gone) redraw();
 }
 async function discoverRoles() {
  if (demo || s.asking || !voice.current) return;
  const request = rolesRequest(s.c, voice.current.session);
  if (!request) return;
  s.asking = true; s.c.asked[request.session] = (s.c.asked[request.session] || 0) + 1;
  try { const d = await api('roles', { id: record.id, turns: request.turns }); if (applyClinician(s.c, request, d.clinician) && !s.gone) redraw(); } catch { /* fica na ordem em que falaram */ }
  s.asking = false;
 }
 function retry() {
  s.attempts++;
  if (s.attempts > MAX_RECONNECTS) { s.attempts = 0; s.phase = 'paused'; s.notice = { text: t('A conexão caiu e não voltou.'), help: t('O que já foi transcrito está guardado. Toque em Retomar para tentar de novo.') }; redraw(); return; }
  s.phase = 'reconnecting'; s.notice = null; redraw();
  clearTimeout(retryTimer.current);
  retryTimer.current = setTimeout(() => fn.current.listen(), reconnectDelay(s.attempts));
 }
 async function listen() {
  s.notice = null; s.voiceFailed = false; s.phase = s.attempts ? 'reconnecting' : 'connecting'; redraw();
  if (!voice.current) voice.current = new VoiceSession({
   firstSession: lastSession(s.c),
   getKey: () => api('voice-key', { id: record.id }),
   onPieces: (list) => { if (!s.gone) fn.current.pieces(list); },
   onError: () => { s.voiceFailed = true; },
   // Queda da conexão: guarda o que já foi dito e tenta de novo com uma chave nova (as vozes ganham outro prefixo).
   onDrop: () => {
    if (s.gone || (s.phase !== 'listening' && s.phase !== 'reconnecting')) return;
    flushPartial(s.c);
    if (s.voiceFailed) { s.phase = 'paused'; s.notice = { text: t('O serviço de transcrição devolveu um erro.'), help: t('Toque em Retomar para tentar de novo.') }; redraw(); } else fn.current.retry();
   },
  });
  const v = voice.current, fail = await v.start();
  if (s.gone || voice.current !== v) { v.close(false); return; }
  if (s.phase !== 'connecting' && s.phase !== 'reconnecting') { if (!fail) v.pause(); return; } // pausou ou encerrou enquanto conectava
  if (!fail) { s.phase = 'listening'; s.attempts = 0; s.interrupted = false; redraw(); return; }
  const lost = fail === 'connect' || fail.code === 'NETWORK';
  if (s.attempts && lost) { retry(); return; }
  s.attempts = 0;
  s.notice = typeof fail === 'string' ? { text: t(MIC_PROBLEMS[fail][0]), help: t(MIC_PROBLEMS[fail][1]) } : { text: problem(t, fail) };
  s.phase = s.c.dialogue.length && !s.interrupted ? 'paused' : 'ready'; redraw();
 }
 // Exemplo: as falas entram palavra a palavra, como na transcrição real, sem microfone.
 function play() {
  s.phase = 'listening'; redraw();
  clearInterval(demoTimer.current);
  demoTimer.current = setInterval(() => {
   if (s.demoWait > 0) { s.demoWait--; return; }
   const turns = exampleTurns(fn.current.t);
   if (s.demoIndex >= turns.length) { clearInterval(demoTimer.current); s.demoDone = true; s.phase = 'paused'; redraw(); return; }
   const turn = turns[s.demoIndex], chunks = exampleChunks(turn.text);
   if (s.demoStep < chunks.length - 1) fn.current.pieces([{ voice: turn.voice, text: ` ${chunks[s.demoStep++]}`, final: false }]);
   else { s.demoIndex++; s.demoStep = 0; s.demoWait = 4; fn.current.pieces([{ voice: turn.voice, text: ` ${turn.text}`, final: true }]); }
  }, 140);
 }
 function pause() {
  clearTimeout(retryTimer.current); s.attempts = 0;
  if (demo) clearInterval(demoTimer.current); else voice.current?.pause();
  s.phase = 'paused'; redraw();
 }
 async function resume() {
  if (demo) return play();
  if (voice.current?.resume()) { s.phase = 'listening'; s.notice = null; redraw(); } else await listen();
 }
 async function end() {
  if (s.phase === 'ending') return;
  s.phase = 'ending'; s.notice = null; redraw();
  clearInterval(demoTimer.current); clearTimeout(retryTimer.current);
  const v = voice.current; voice.current = null;
  await v?.close(true);
  if (offline) {
   s.c.partial = [];
   if (!s.demoIndex) { onExit(); return; }
   const p = exampleProgress(s.demoIndex, t);
   onFinished({ ...record, example: true, status: 'finished', note: p.note, support: p.support, dialogue: dialogueForFinish(s.c), durationSeconds: s.seconds, reviewed: true });
   return;
  }
  flushPartial(s.c);
  for (let i = 0; i < 80 && s.busy; i++) await sleep(250);
  if (!s.c.dialogue.length && !s.note.some((x) => x.text?.trim())) { storage.drop(liveKey(record.id)); onExit(); return; }
  try {
   const d = await api('finish', { id: record.id, transcript: buildTranscript(s.c), dialogue: dialogueForFinish(s.c) });
   storage.drop(liveKey(record.id)); onFinished(d.record);
  } catch (e) {
   if (e.code === 'ALREADY_FINISHED') { try { const d = await api('open', { id: record.id }); storage.drop(liveKey(record.id)); onFinished(d.record); return; } catch { /* mostra o aviso abaixo */ } }
   s.notice = { text: problem(t, e), help: t('Tente encerrar de novo.') }; s.phase = 'paused'; persist(); redraw();
  }
 }
 fn.current = { pieces, update, discoverRoles, persist, listen, retry, t };

 // Relógio da consulta: conta o tempo, descobre quem é quem, pede a nota e guarda o andamento.
 useEffect(() => {
  s.gone = false;
  if (demo && (s.phase === 'ready' || s.phase === 'listening') && !s.demoDone) play();
  const timer = setInterval(() => {
   if (s.phase === 'listening') { s.seconds++; redraw(); }
   if (s.phase === 'listening' || s.phase === 'paused' || s.phase === 'reconnecting') { fn.current.discoverRoles(); fn.current.update(); fn.current.persist(); }
  }, 1000);
  return () => { s.gone = true; clearInterval(timer); clearInterval(demoTimer.current); clearTimeout(retryTimer.current); fn.current.persist(); voice.current?.close(false); voice.current = null; };
 }, []);

 // Tela acesa enquanto ouve (quando o navegador permite).
 const awake = s.phase === 'listening' || s.phase === 'reconnecting';
 useEffect(() => {
  if (!awake || !navigator.wakeLock) return;
  let lock = null, live = true;
  const hold = () => { if (document.visibilityState === 'visible') navigator.wakeLock.request('screen').then((l) => { if (live) lock = l; else l.release().catch(() => {}); }).catch(() => {}); };
  hold(); document.addEventListener('visibilitychange', hold);
  return () => { live = false; document.removeEventListener('visibilitychange', hold); lock?.release().catch(() => {}); };
 }, [awake]);

 // Fechar ou recarregar a aba no meio da consulta pede confirmação.
 const guard = !demo && (ACTIVE.includes(s.phase) || s.phase === 'ending');
 useEffect(() => {
  if (!guard) return;
  const warn = (e) => { fn.current.persist(); e.preventDefault(); e.returnValue = ''; };
  addEventListener('beforeunload', warn);
  return () => removeEventListener('beforeunload', warn);
 }, [guard]);

 const [phaseLabel, phaseKind] = PHASE[s.phase];
 const filled = s.note.filter((x) => x.text?.trim()), missing = s.note.filter((x) => !x.text?.trim());
 const waiting = s.phase === 'ready' && !demo;
 return <section ref={fill} className="module-page scb scb-session" data-tab={tab} data-cols={reasoning ? 3 : 2}>
  <div className="scb-bar">
   <button className="scb-icon" aria-label={t('Voltar ao início do Scribe')} title={t('Voltar')} onClick={onExit} disabled={s.phase === 'ending'}><ArrowLeft size={19} /></button>
   <h1>{record.label || t('Sem identificação')}</h1>
   <span className="scb-chip quiet">{templateName(t, record.template, record.templateName)}</span>
   <span className={`scb-state ${phaseKind}`} role="status"><i aria-hidden="true" />{t(phaseLabel)}<time aria-label={t('Tempo de consulta')}>{clock(s.seconds)}</time></span>
   <span className="scb-space" />
   {waiting && !s.interrupted && <button className="scb-btn primary" onClick={listen} disabled={!voiceReady}><Mic size={17} aria-hidden="true" />{t('Iniciar')}</button>}
   {s.phase === 'connecting' && <button className="scb-btn primary" disabled><Mic size={17} aria-hidden="true" />{t('Conectando…')}</button>}
   {(s.phase === 'listening' || s.phase === 'reconnecting') && <button className="scb-btn" onClick={pause}><Pause size={17} aria-hidden="true" />{t('Pausar')}</button>}
   {s.phase === 'paused' && !s.demoDone && <button className="scb-btn" onClick={resume}><Play size={17} aria-hidden="true" />{t('Retomar')}</button>}
   {(ACTIVE.includes(s.phase) || s.phase === 'ending') && <button className="scb-btn primary" onClick={end} disabled={s.phase === 'ending' || s.phase === 'connecting'}><Square size={15} aria-hidden="true" />{s.phase === 'ending' ? t('Encerrando…') : t('Encerrar')}</button>}
  </div>
  {demo && <p className="scb-notice" role="note"><PlayCircle size={17} aria-hidden="true" /><span>{t('Consulta de exemplo, fictícia. O microfone está desligado.')}</span></p>}
  {waiting && s.interrupted && <div className="scb-notice scb-resume" role="group" aria-label={t('Esta consulta foi interrompida.')}>
   <span><strong>{t('Esta consulta foi interrompida.')}</strong> {s.c.dialogue.length ? t('A conversa transcrita até aqui foi recuperada.') : t('A nota foi guardada, mas a conversa transcrita antes não está neste aparelho.')}</span>
   <span className="scb-row"><button className="scb-btn primary" onClick={listen} disabled={!voiceReady}><Mic size={17} aria-hidden="true" />{t('Retomar a escuta')}</button><button className="scb-btn" onClick={end}>{t('Encerrar e revisar')}</button></span>
  </div>}
  {waiting && !s.interrupted && !s.notice && <p className="scb-notice" role="note"><Mic size={17} aria-hidden="true" /><span>{voiceReady ? t('O microfone só é ligado quando você tocar em Iniciar. Deixe o aparelho entre você e o paciente.') : t('A transcrição ao vivo não está disponível neste momento. Você ainda pode ver o exemplo.')}</span></p>}
  {s.phase === 'reconnecting' && <p className="scb-notice" role="status"><TriangleAlert size={17} aria-hidden="true" /><span>{t('A conexão caiu. Reconectando…')} ({s.attempts}/{MAX_RECONNECTS})</span></p>}
  {s.notice && <p className="scb-notice bad" role="alert"><TriangleAlert size={17} aria-hidden="true" /><span><strong>{s.notice.text}</strong>{s.notice.help ? ` ${s.notice.help}` : ''}</span></p>}
  <Tabs tab={tab} setTab={setTab} reasoning={reasoning} />
  <div className="scb-cols">
   <section className="scb-col scb-talk" id="scb-talk" aria-labelledby="scb-talk-title">
    <header><h2 id="scb-talk-title">{t('Conversa')}</h2><small>{t('Toque no nome para corrigir quem falou')}</small></header>
    <Conversation dialogue={s.c.dialogue} partial={s.c.partial} roleFor={(v) => roleOf(s.c, v)} onSwap={(turn) => { if (swapRole(s.c, turn.voice)) redraw(); }} />
   </section>
   <section className="scb-col scb-note" id="scb-note" aria-labelledby="scb-note-title">
    <header><h2 id="scb-note-title">{t('Nota')}</h2><small role="status">{s.busy ? t('Atualizando…') : s.noteError}</small></header>
    <div className="scb-scroll">
     {!filled.length && <p className="scb-empty">{t('A nota vai sendo preenchida conforme a conversa avança.')}</p>}
     {filled.map((x) => <div key={x.title} className="scb-section"><h3>{x.title}</h3><p>{x.text}</p></div>)}
     {missing.length > 0 && <div className="scb-missing"><h3>{t('Ainda não mencionado')}</h3><p>{missing.map((x) => <span key={x.title}>{x.title}</span>)}</p></div>}
    </div>
   </section>
   {reasoning && <Reasoning support={s.support} id="scb-why" />}
  </div>
  <p className="scb-foot">{t('Apoio ao profissional. Revise a nota antes de usar no prontuário.')} {!demo && t('O áudio é enviado para transcrição e não é guardado pelo 2Doctor.')}</p>
 </section>;
}

// ---------------------------------------------------------------------------
// Consulta encerrada: revisar, corrigir e copiar
// ---------------------------------------------------------------------------
function AutoText({ value, ...props }) {
 const ref = useRef(null);
 useLayoutEffect(() => { const el = ref.current; if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight + 2}px`; } }, [value]);
 return <textarea ref={ref} rows={2} value={value} {...props} />;
}

function Review({ record, api, onHome, onChange }) {
 const { t } = useI18n();
 const local = !!record.example;
 const [note, setNote] = useState(record.note || []), [label, setLabel] = useState(record.label || '');
 const [state, setState] = useState(''), [error, setError] = useState(''), [copied, setCopied] = useState(''), [confirming, setConfirming] = useState(false);
 const [tab, setTab] = useState('note');
 const fill = useFill();
 const saved = useRef({ note: record.note || [], label: record.label || '' });
 const support = record.support || {}, reasoning = hasSupport(support);

 async function save(change) {
  if (local) { setState(t('Alteração feita só nesta tela')); return; }
  setState(t('Salvando…')); setError('');
  try { const d = await api('edit', { id: record.id, ...change }); Object.assign(saved.current, change); onChange?.(d.record); setState(t('Alteração salva')); }
  catch (e) { setState(''); setError(problem(t, e)); }
 }
 const blurNote = () => { if (note.some((x, i) => x.text !== saved.current.note[i]?.text)) save({ note }); };
 const blurLabel = () => { if (label.trim() !== saved.current.label) save({ label: label.trim() }); };
 async function copy(headings) {
  setError('');
  try { await navigator.clipboard.writeText(noteText(note, headings)); setCopied(headings ? 'headings' : 'plain'); setTimeout(() => setCopied(''), 2500); }
  catch { setError(t('Não foi possível copiar. Selecione o texto e copie.')); }
 }
 async function remove() {
  if (local) { onHome(); return; }
  try { await api('delete', { id: record.id }); storage.drop(liveKey(record.id)); onHome(); } catch (e) { setConfirming(false); setError(problem(t, e)); }
 }
 return <section ref={fill} className="module-page scb scb-session scb-review" data-tab={tab} data-cols={reasoning ? 3 : 2}>
  <div className="scb-bar">
   <button className="scb-icon" aria-label={t('Voltar ao início do Scribe')} title={t('Voltar')} onClick={onHome}><ArrowLeft size={19} /></button>
   <input className="scb-title" value={label} maxLength={80} readOnly={local} aria-label={t('Identificação (opcional)')} placeholder={t('Sem identificação')} onChange={(e) => setLabel(e.target.value)} onBlur={blurLabel} />
   <span className="scb-chip quiet">{templateName(t, record.template, record.templateName)}</span>
   <span className="scb-state done" role="status"><i aria-hidden="true" />{state || t('Encerrada')}{record.durationSeconds ? <time>{clock(record.durationSeconds)}</time> : null}</span>
   <span className="scb-space" />
   <button className="scb-btn primary" onClick={() => copy(false)}>{copied === 'plain' ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copied === 'plain' ? t('Nota copiada') : t('Copiar nota')}</button>
   <button className="scb-btn" onClick={() => copy(true)}>{copied === 'headings' ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copied === 'headings' ? t('Nota copiada') : t('Copiar com títulos')}</button>
   <button className="scb-btn" onClick={onHome}><Plus size={17} aria-hidden="true" />{t('Nova consulta')}</button>
   {!local && (confirming
    ? <span className="scb-confirm" role="group" aria-label={t('Apagar esta consulta?')}><span>{t('Apagar esta consulta?')}</span><button className="scb-btn danger" onClick={remove}>{t('Apagar')}</button><button className="scb-btn" onClick={() => setConfirming(false)}>{t('Cancelar')}</button></span>
    : <button className="scb-icon" aria-label={t('Apagar esta consulta')} title={t('Apagar')} onClick={() => setConfirming(true)}><Trash2 size={18} /></button>)}
  </div>
  {error && <p className="scb-notice bad" role="alert"><TriangleAlert size={17} aria-hidden="true" /><span>{error}</span></p>}
  {local && <p className="scb-notice" role="note"><PlayCircle size={17} aria-hidden="true" /><span>{t('Esta é a consulta de exemplo, fictícia. Nada foi gravado nem salvo.')}</span></p>}
  {!local && record.interrupted && <p className="scb-notice" role="note"><TriangleAlert size={17} aria-hidden="true" /><span>{t('Esta consulta foi interrompida. A nota abaixo é a última versão ao vivo; confira com atenção.')}</span></p>}
  {!local && !record.interrupted && record.reviewed === false && <p className="scb-notice" role="note"><TriangleAlert size={17} aria-hidden="true" /><span>{t('Revisão final indisponível; esta é a última versão ao vivo.')}</span></p>}
  <Tabs tab={tab} setTab={setTab} reasoning={reasoning} />
  <div className="scb-cols">
   <section className="scb-col scb-talk" id="scb-talk" aria-labelledby="scb-talk-title">
    <header><h2 id="scb-talk-title">{t('Conversa')}</h2></header>
    <Conversation dialogue={record.dialogue || []} />
   </section>
   <section className="scb-col scb-note" id="scb-note" aria-labelledby="scb-note-title">
    <header><h2 id="scb-note-title">{t('Nota')}</h2><small>{t('Edite qualquer seção; salva ao sair do campo')}</small></header>
    <div className="scb-scroll">
     {note.map((x, i) => <label key={x.title} className="scb-section edit"><h3>{x.title}</h3>
      <AutoText value={x.text} placeholder={t('Não mencionado')} onChange={(e) => setNote(note.map((y, j) => (j === i ? { ...y, text: e.target.value } : y)))} onBlur={blurNote} />
     </label>)}
    </div>
   </section>
   {reasoning && <Reasoning support={support} id="scb-why" />}
  </div>
  <p className="scb-foot">{t('Só a nota é copiada. As sugestões do raciocínio não fazem parte do registro.')}</p>
 </section>;
}
