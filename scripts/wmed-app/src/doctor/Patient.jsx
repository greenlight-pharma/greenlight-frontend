// Modo paciente: escolha de perfil (cadastro e Conta), termos, boas-vindas e aviso do chat.
import { useState } from 'react';
import { FileText, HelpCircle, Stethoscope, ArrowUpRight } from 'lucide-react';
import { useI18n } from './I18n';
import { patientTerms, TERMOS_PACIENTE_VERSAO } from '../../shared/patient-mode.mjs';
import './patient.css';

export function PatientTermsText() {
 const { locale } = useI18n();
 const terms = patientTerms(locale);
 return <ul className="patient-terms-list">{terms.items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function TermsAccept({ checked, onChange, disabled, id }) {
 const { t, locale } = useI18n();
 return <div className="patient-terms">
  <details><summary>{t('Ler os termos para pacientes')}</summary><PatientTermsText /><a href={`/terms/patients?lang=${locale.slice(0, 2)}`} target="_blank" rel="noopener noreferrer">{t('Termos para pacientes')} ↗</a></details>
  <label className="patient-terms-check" htmlFor={id}><input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} /><span>{patientTerms(locale).accept}</span></label>
 </div>;
}

// Cadastro: duas opções (o estudante entra como "Médico ou estudante"; pode ajustar em Conta).
export function ProfileChoice({ perfil, setPerfil, terms, setTerms, disabled }) {
 const { t } = useI18n();
 const options = [['profissional', t('Médico ou estudante'), t('Para estudar e apoiar a prática clínica.'), Stethoscope], ['paciente', t('Paciente ou cuidador'), t('Para entender diagnósticos e exames e se preparar para a consulta.'), HelpCircle]];
 return <fieldset className="profile-choice" disabled={disabled}>
  <legend>{t('Quem é você?')}</legend>
  <div className="profile-options">{options.map(([id, label, hint, Icon]) => <label key={id} className={perfil === id ? 'selected' : ''}><input type="radio" name="perfil" value={id} checked={perfil === id} onChange={() => setPerfil(id)} required /><Icon size={18} aria-hidden="true" /><span>{label}<small>{hint}</small></span></label>)}</div>
  {perfil === 'paciente' && <TermsAccept id="signup-patient-terms" checked={terms} onChange={setTerms} disabled={disabled} />}
 </fieldset>;
}

// Conta: três perfis. Com conta 2Doctor, salva no servidor; sem banco, guarda neste aparelho.
export function ProfilePanel({ api, accounts, user, localPerfil, onSaved }) {
 const { t, locale } = useI18n();
 const current = accounts ? user?.perfil || 'profissional' : localPerfil || 'profissional';
 const accepted = accounts ? !!user?.termosPaciente : !!localPerfil && localPerfil === 'paciente';
 const [perfil, setPerfil] = useState(current), [terms, setTerms] = useState(false);
 const [busy, setBusy] = useState(false), [error, setError] = useState(''), [done, setDone] = useState('');
 const needTerms = perfil === 'paciente' && !accepted;
 async function save(e) {
  e.preventDefault(); setError(''); setDone('');
  if (needTerms && !terms) return setError(t('Aceite os termos para pacientes para continuar.'));
  if (!accounts) { onSaved({ perfil }); setDone(t('Perfil atualizado.')); return; }
  setBusy(true);
  try {
   const r = await fetch(`${api}/auth`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WMed-Request': '1' }, body: JSON.stringify({ action: 'perfil', perfil, ...(needTerms ? { termosPaciente: TERMOS_PACIENTE_VERSAO } : {}), locale: locale.slice(0, 2) }) });
   const d = await r.json().catch(() => ({}));
   if (!r.ok) throw Error(d.error || t('Não foi possível salvar o perfil.'));
   setDone(d.message || t('Perfil atualizado.')); setTerms(false); onSaved(d.user);
  } catch (err) { setError(err.message); } finally { setBusy(false); }
 }
 const options = [['profissional', t('Profissional de saúde')], ['estudante', t('Estudante da saúde')], ['paciente', t('Paciente ou cuidador')]];
 return <section className="plan-panel profile-panel" aria-labelledby="profile-title">
  <div className="plan-head"><h3 id="profile-title">{t('Perfil da conta')}</h3>{!accounts && <small>{t('Neste aparelho')}</small>}</div>
  <p>{t('O perfil muda o jeito como o assistente responde e as ferramentas que aparecem.')}</p>
  <form onSubmit={save}>
   <div className="profile-options compact" role="radiogroup" aria-labelledby="profile-title">{options.map(([id, label]) => <label key={id} className={perfil === id ? 'selected' : ''}><input type="radio" name="perfil-conta" value={id} checked={perfil === id} onChange={() => { setPerfil(id); setDone(''); }} /><span>{label}</span></label>)}</div>
   {needTerms && <TermsAccept id="account-patient-terms" checked={terms} onChange={setTerms} disabled={busy} />}
   {error && <p role="alert" className="error">{error}</p>}
   {done && <p role="status" className="notice">{done}</p>}
   <div className="password-actions"><button type="submit" className="plan-manage" disabled={busy || perfil === current}>{busy ? t('Salvando…') : t('Salvar perfil')}</button></div>
  </form>
  <p className="profile-links"><a href={`/terms/patients?lang=${locale.slice(0, 2)}`} target="_blank" rel="noopener noreferrer">{t('Termos para pacientes')}</a> · <a href={`/privacy?lang=${locale.slice(0, 2)}`} target="_blank" rel="noopener noreferrer">{t('Política de privacidade')}</a></p>
 </section>;
}

export function PatientWelcome({ onPrompt }) {
 const { t } = useI18n();
 const prompts = [[t('Explique meus exames de sangue em palavras simples'), t('Cole os resultados ou descreva o exame.'), FileText], [t('O que devo perguntar ao meu médico sobre…'), t('Complete com o seu tema.'), HelpCircle], [t('O que significa este diagnóstico?'), t('Escreva o nome do diagnóstico.'), Stethoscope]];
 return <div className="doctor-quick-area patient-quick-area"><div className="doctor-quick-actions">{prompts.map(([text, hint, Icon]) => <button key={text} onClick={() => onPrompt(text.endsWith('…') ? text.slice(0, -1) + ' ' : text + ': ')}><Icon size={20} /><span>{text}<small>{hint}</small></span><ArrowUpRight size={17} /></button>)}</div></div>;
}

export function PatientNotice() {
 const { t } = useI18n();
 return <p className="patient-notice" role="note">{t('O 2Doctor explica informações de saúde. Não substitui o seu médico. Em uma emergência, ligue para o número de emergência local.')}</p>;
}
