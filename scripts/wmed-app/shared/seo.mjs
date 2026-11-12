// Identidade e SEO do build do 2Doctor (www.2doctor.ai). O WMed (site Vytal, em português)
// usa o index.html como está: nada daqui se aplica a ele.
export const SITE = 'https://www.2doctor.ai';
export const SEO = {
 title: '2Doctor · The AI clinical assistant for doctors and med students',
 description: 'Ask clinical questions, discuss cases and study with scores, references and 3D tools. 2Doctor is an educational AI assistant for doctors and medical students. Free to start.',
 image: SITE + '/brand/2doctor/og-2doctor.png',
 imageAlt: '2Doctor — The AI clinical assistant for doctors and med students',
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Transforma o index.html comum no do 2Doctor: inglês, indexável, com prévia de link.
export function doctorIndexHtml(html) {
 const head = [
  `<meta name="description" content="${esc(SEO.description)}"/>`,
  `<link rel="canonical" href="${SITE}/"/>`,
  `<link rel="apple-touch-icon" href="/brand/2doctor/logo-1024.png"/>`,
  `<meta property="og:type" content="website"/><meta property="og:site_name" content="2Doctor"/><meta property="og:url" content="${SITE}/"/>`,
  `<meta property="og:title" content="${esc(SEO.title)}"/><meta property="og:description" content="${esc(SEO.description)}"/>`,
  `<meta property="og:image" content="${SEO.image}"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="${esc(SEO.imageAlt)}"/>`,
  `<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(SEO.title)}"/><meta name="twitter:description" content="${esc(SEO.description)}"/><meta name="twitter:image" content="${SEO.image}"/>`,
 ].join('');
 return html
  .replace('<html lang="pt-BR">', '<html lang="en">')
  .replace('<meta name="robots" content="noindex,nofollow"/>', '<meta name="robots" content="index,follow"/>')
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(SEO.title)}</title>${head}`)
  .replace('brand/favicon.svg', 'brand/2doctor/favicon.svg')
  .replace('#081c35', '#005d5b');
}

// robots.txt e sitemap.xml só valem no domínio oficial; em qualquer outro host, nada é indexado.
export function robotsTxt(indexable) {
 return indexable
  ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /painel\n\nSitemap: ${SITE}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n';
}
export const SITEMAP_PATHS = ['/', '/privacy', '/terms', '/terms/patients'];
export function sitemapXml() {
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${SITEMAP_PATHS.map((p) => ` <url><loc>${SITE}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
}
