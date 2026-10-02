// Plano da conta 2Doctor: gratuito ou Pro (Stripe Checkout hospedado e Portal do cliente).
import { useEffect, useState } from 'react';
import { useI18n } from './I18n';
import { trackCheckout, trackPurchase, takeReturn, hasReturn } from './pixel';

export default function PlanPanel({ api }) {
 const { t, locale } = useI18n();
 const [info, setInfo] = useState(null), [busy, setBusy] = useState(''), [error, setError] = useState('');
 useEffect(() => {
  // Volta do Stripe (#assinatura-ok): o webhook pode atrasar, então confere o plano algumas vezes.
  let live = true, tries = 0;
  const load = () => fetch(`${api}/billing`).then((r) => (r.ok ? r.json() : null)).then((d) => {
   if (!live) return; setInfo(d);
   if (!hasReturn('purchase')) return;
   if (d?.plano === 'pro') { if (takeReturn('purchase')) trackPurchase(d.fim || 'pro'); }
   else if (++tries < 6) setTimeout(load, 2500);
  }).catch(() => { if (live) setInfo(null); });
  load();
  return () => { live = false; };
 }, [api]);
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
 const fim = info.fim ? new Date(info.fim).toLocaleDateString(locale) : '';
 return <section className="plan-panel" aria-labelledby="plan-title">
  <div className="plan-head"><h3 id="plan-title">{t('Seu plano')}</h3><span className={`plan-badge ${pro ? 'pro' : ''}`}>{pro ? 'Pro' : t('Gratuito')}</span></div>
  {pro ? <>
   <p>{info.status === 'past_due' ? t('Pagamento pendente. Atualize o cartão para manter o Pro.') : fim ? `${t('Renova em')} ${fim}.` : t('IA sem limite prático para estudar e trabalhar.')}</p>
   <button className="plan-manage" disabled={!!busy || !info.stripe} onClick={() => go({ action: 'portal' })}>{busy === 'portal' ? t('Abrindo…') : t('Gerenciar assinatura')}</button>
  </> : <>
   <p>{t('No gratuito, o uso diário é limitado. O Pro libera IA para uso intenso, todos os dias.')}</p>
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
