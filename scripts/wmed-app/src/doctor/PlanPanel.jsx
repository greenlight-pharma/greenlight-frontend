// Plano da conta 2Doctor: gratuito ou Pro (Stripe Checkout hospedado e Portal do cliente).
import { useEffect, useRef, useState } from 'react';
import { useI18n } from './I18n';
import { trackCheckout, trackPurchase, takeReturn, hasReturn } from './pixel';

// upsell: oferta mostrada no chat quando o limite gratuito do dia acaba (some para quem já é Pro).
// visitor: preços para quem ainda não tem conta (link /pricing); o botão leva ao cadastro.
// focus: chegou pelo link /pricing; rola até os planos.
export default function PlanPanel({ api, upsell = false, visitor = false, focus = false, onSignup }) {
 const { t, locale } = useI18n();
 const [info, setInfo] = useState(null), [busy, setBusy] = useState(''), [error, setError] = useState('');
 useEffect(() => {
  // Volta do Stripe (#assinatura-ok): o webhook pode atrasar, então confere o plano algumas vezes.
  if (visitor) return;
  let live = true, tries = 0;
  const load = () => fetch(`${api}/billing`).then((r) => (r.ok ? r.json() : null)).then((d) => {
   if (!live) return; setInfo(d);
   if (!hasReturn('purchase')) return;
   if (d?.plano === 'pro') { if (takeReturn('purchase')) trackPurchase(d.fim || 'pro'); }
   else if (++tries < 6) setTimeout(load, 2500);
  }).catch(() => { if (live) setInfo(null); });
  load();
  return () => { live = false; };
 }, [api, visitor]);
 const box = useRef(null), shown = visitor || !!info;
 useEffect(() => { if (focus && shown) box.current?.scrollIntoView({ block: 'start' }); }, [focus, shown]);
 if (visitor) return <section ref={box} className="plan-panel" aria-labelledby="plan-title">
  <div className="plan-head"><h3 id="plan-title">{t('Planos')}</h3></div>
  <p>{t('Comece grátis, com limite diário. O Pro libera IA para uso intenso, todos os dias.')}</p>
  <div className="plan-options">
   <div><strong>US$ 9.99</strong><span>{t('por mês')}</span></div>
   <div className="best"><strong>US$ 79</strong><span>{t('por ano · economize 34%')}</span></div>
  </div>
  <button className="plan-manage" onClick={onSignup}>{t('Criar conta gratuita')}</button>
  <small>{t('Pagamento seguro pelo Stripe. Cancele quando quiser.')}</small>
 </section>;
 if (!info) return null;
 async function go(body) {
  setBusy(body.intervalo || body.action); setError('');
  if (body.action === 'checkout') trackCheckout(body.intervalo);
  try {
   const r = await fetch(`${api}/billing`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WMed-Request': '1', 'X-2Doctor-Idioma': locale.slice(0, 2) }, body: JSON.stringify(body) });
   const d = await r.json();
   if (!r.ok || !d.url) throw Error(d.error || t('Não foi possível abrir o pagamento.'));
   location.assign(d.url);
  } catch (e) { setError(e.message); setBusy(''); }
 }
 const pro = info.plano === 'pro';
 if (upsell && pro) return null;
 const fim = info.fim ? new Date(info.fim).toLocaleDateString(locale) : '';
 return <section ref={box} className={`plan-panel${upsell ? ' plan-upsell' : ''}`} aria-labelledby="plan-title">
  <div className="plan-head"><h3 id="plan-title">{upsell ? t('Continue agora com o Pro') : t('Seu plano')}</h3><span className={`plan-badge ${pro ? 'pro' : ''}`}>{pro ? 'Pro' : t('Gratuito')}</span></div>
  {pro ? <>
   <p>{info.status === 'past_due' ? t('Pagamento pendente. Atualize o cartão para manter o Pro.') : fim ? `${t('Renova em')} ${fim}.` : t('IA sem limite prático para estudar e trabalhar.')}</p>
   <button className="plan-manage" disabled={!!busy || !info.stripe} onClick={() => go({ action: 'portal' })}>{busy === 'portal' ? t('Abrindo…') : t('Gerenciar assinatura')}</button>
  </> : <>
   <p>{upsell ? t('Você usou o limite gratuito de hoje. O Pro libera IA para uso intenso, todos os dias: US$ 9.99 por mês ou US$ 79 por ano.') : t('No gratuito, o uso diário é limitado. O Pro libera IA para uso intenso, todos os dias.')}</p>
   <div className="plan-options">
    <button disabled={!!busy || !info.stripe} onClick={() => go({ action: 'checkout', intervalo: 'mensal' })}><strong>US$ 9.99</strong><span>{t('por mês')}</span></button>
    <button className="best" disabled={!!busy || !info.stripe} onClick={() => go({ action: 'checkout', intervalo: 'anual' })}><strong>US$ 79</strong><span>{t('por ano · economize 34%')}</span></button>
   </div>
   <small>{t('Pagamento seguro pelo Stripe. Cancele quando quiser.')}</small>
  </>}
  {!info.stripe && <small>{t('Assinaturas em breve.')}</small>}
  {error && <p role="alert" className="error">{error}</p>}
 </section>;
}
