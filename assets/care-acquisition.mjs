// Somente códigos da campanha aprovada para teste. Não propagar texto livre,
// identificadores de clique, contatos, condições de saúde ou a URL de origem.
export function campaignParameters(search) {
  const params = new URLSearchParams(search);
  if (params.get('utm_source') !== 'meta' || params.get('utm_medium') !== 'paid_social'
    || params.get('utm_campaign') !== 'care_familia_v1'
    || !['familia', 'rotina', 'conferencia'].includes(params.get('utm_content'))) return '';
  const result = new URLSearchParams();
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    result.set(key, params.get(key));
  }
  return result.toString();
}

export function campaignHref(href, pageUrl) {
  const page = new URL(pageUrl);
  const campaign = campaignParameters(page.search);
  if (!campaign) return href;
  const target = new URL(href, page);
  const landing = ['www.vytalsaude.com.br', 'vytalsaude.com.br', page.hostname].includes(target.hostname)
    && /^\/vytal-care2\/?$/.test(target.pathname);
  const signup = target.origin === 'https://care.vytalsaude.com.br' && /^\/familia\/?$/.test(target.pathname);
  if (!landing && !signup) return href;
  for (const [key, value] of new URLSearchParams(campaign)) target.searchParams.set(key, value);
  return target.href;
}

if (typeof document !== 'undefined') {
  const update = () => document.querySelectorAll('a[href]').forEach(link => {
    const original = link.getAttribute('href');
    const next = campaignHref(original, window.location.href);
    if (next !== original) link.setAttribute('href', next);
  });
  update();
  // A demonstração e o seletor de produtos recriam seus próprios links.
  new MutationObserver(update).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['href'] });
}
