// Página de destino dos anúncios do 2Doctor (/start e /lp): HTML e CSS estáticos gerados no
// servidor, em inglês, sem o bundle do app. O script embutido só cuida de: manter UTM/fbclid nos
// links, levar a primeira pergunta ao app e carregar o Meta Pixel se já houver consentimento.
import { cleanPixelId, CONSENT_KEY } from '../shared/meta-pixel.mjs';
import { SITE } from '../shared/seo.mjs';

export const LANDING_ROUTES = ['/start', '/lp'];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const TITLE = '2Doctor · Clinical answers with the guideline and the source';
const DESCRIPTION = 'Hard case at 3 a.m.? Ask 2Doctor and get the answer with the guideline and the source. Clinical cases with feedback, 3D anatomy, histology and radiology. Free to start.';
const LOGO = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#005D5B"/><path fill="#fff" fill-rule="evenodd" transform="translate(11 17) scale(0.24)" d="M5 34C13 12 32 0 58 0H112C151 0 175 25 175 61C175 99 150 124 112 124H0V113C0 92 11 78 32 64L51 52C63 44 66 37 63 32C59 23 42 25 36 34Z M84 26C94 52 82 67 56 82L34 99H109C134 99 147 84 147 62C147 40 134 26 112 26Z"/></svg>';

const CSS = `
@font-face{font-family:Manrope;src:url(/brand/2doctor/Manrope.ttf) format("truetype");font-weight:200 800;font-display:swap}
:root{--bg:#fff;--soft:#f2f7f5;--ink:#142d40;--muted:#586b73;--accent:#005d5b;--accent-ink:#fff;--line:#dfe9e6;--chip:#e9f3ef;--card:#fff}
@media (prefers-color-scheme:dark){:root{--bg:#15211d;--soft:#1d2926;--ink:#e6f2ee;--muted:#a7bcb5;--accent:#92d5c5;--accent-ink:#112720;--line:#36473f;--chip:#2b3e35;--card:#1d2926}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 Manrope,system-ui,-apple-system,"Segoe UI",sans-serif;overflow-x:hidden}
a{color:var(--accent)}img,svg{max-width:100%}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;max-width:1080px;margin:0 auto}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:19px;color:var(--ink);text-decoration:none}
.top nav{display:flex;align-items:center;gap:14px;font-size:15px;font-weight:600}
.top nav a{text-decoration:none}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;border-radius:12px;border:0;background:var(--accent);color:var(--accent-ink);font:inherit;font-weight:800;text-decoration:none;cursor:pointer}
.btn.small{min-height:40px;padding:0 16px;border-radius:10px}
.btn.ghost{background:transparent;color:var(--accent);box-shadow:inset 0 0 0 1.5px var(--accent)}
.btn:focus-visible,a:focus-visible,textarea:focus-visible,button:focus-visible{outline:3px solid #16827a;outline-offset:2px}
.hero{background:linear-gradient(180deg,var(--soft),var(--bg));padding:28px 0 36px}
.hero .wrap{display:grid;gap:28px;align-items:center}
.eyebrow{font-size:12.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--accent);margin:0 0 10px}
h1{font-size:clamp(30px,7.4vw,52px);line-height:1.08;letter-spacing:-.02em;margin:0 0 14px;font-weight:800}
h1 span{color:var(--accent)}
.lead{font-size:17.5px;color:var(--muted);margin:0 0 20px;max-width:34em}
.ask{background:var(--card);border:1.5px solid var(--line);border-radius:16px;padding:12px;box-shadow:0 10px 30px rgba(0,60,58,.08)}
.ask label{display:block;font-weight:800;font-size:14px;margin:2px 4px 8px}
.ask textarea{display:block;width:100%;min-height:76px;resize:vertical;border:0;background:transparent;color:var(--ink);font:inherit;font-size:16px;padding:4px;outline-offset:4px}
.ask-row{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:8px}
.ask-row small{color:var(--muted);font-size:13.5px;flex:1 1 150px}
.examples{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 0;padding:0;list-style:none}
.examples button{border:0;background:var(--chip);color:var(--ink);font:inherit;font-size:13.5px;font-weight:600;padding:8px 12px;border-radius:999px;cursor:pointer;text-align:left}
.cta-row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:18px}
.cta-row small{color:var(--muted);font-size:14px}
.demo{background:var(--card);border:1.5px solid var(--line);border-radius:18px;padding:16px;box-shadow:0 18px 44px rgba(0,60,58,.10);font-size:14.5px}
.demo .q{background:var(--chip);border-radius:14px 14px 4px 14px;padding:10px 14px;margin:0 0 12px auto;max-width:88%;width:fit-content;font-weight:600}
.demo .who{display:flex;align-items:center;gap:8px;font-weight:800;font-size:13px;margin-bottom:6px}
.demo .who svg{width:20px;height:20px}
.demo p{margin:0 0 8px}.demo ul{margin:0 0 10px;padding-left:18px}.demo li{margin:2px 0}
.demo sup{color:var(--accent);font-weight:800}
.src{display:flex;gap:6px;flex-wrap:wrap}
.src span{font-size:12px;font-weight:700;border:1px solid var(--line);border-radius:8px;padding:4px 8px;color:var(--muted)}
section{padding:40px 0}
h2{font-size:clamp(24px,5vw,34px);line-height:1.15;letter-spacing:-.015em;margin:0 0 8px;font-weight:800}
.sub{color:var(--muted);margin:0 0 22px;max-width:40em}
.grid{display:grid;gap:14px}
.card{background:var(--card);border:1.5px solid var(--line);border-radius:16px;padding:20px}
.card h3{font-size:18.5px;margin:10px 0 6px;font-weight:800}
.card p{margin:0;color:var(--muted)}
.ico{width:44px;height:44px;border-radius:12px;background:var(--chip);display:grid;place-items:center;color:var(--accent)}
.ico svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.soft{background:var(--soft)}
.who-list{display:grid;gap:10px;padding:0;margin:0;list-style:none}
.who-list li{background:var(--card);border:1.5px solid var(--line);border-radius:14px;padding:14px 16px}
.who-list b{display:block}
.who-list span{color:var(--muted);font-size:15px}
.plan{display:flex;flex-direction:column;gap:6px}
.plan .price{font-size:30px;font-weight:800;letter-spacing:-.02em;margin:4px 0 0}
.plan .price small{font-size:15px;font-weight:600;color:var(--muted)}
.plan ul{margin:8px 0 14px;padding-left:18px;color:var(--muted)}
.plan .btn{margin-top:auto}
.plan.pro{border-color:var(--accent)}
.tag{align-self:flex-start;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:var(--chip);color:var(--accent);padding:4px 10px;border-radius:999px}
.final{text-align:center}
.final .btn{min-width:220px}
footer{border-top:1px solid var(--line);padding:22px 0 calc(28px + env(safe-area-inset-bottom));color:var(--muted);font-size:14px}
footer p{margin:0 0 8px}
.cookie{position:fixed;left:12px;right:12px;bottom:12px;z-index:5;max-width:560px;margin:0 auto;background:var(--card);border:1.5px solid var(--line);border-radius:14px;padding:12px 14px;box-shadow:0 12px 32px rgba(0,0,0,.18);font-size:13.5px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.cookie p{margin:0;flex:1 1 220px}
.cookie div{display:flex;gap:8px}
.cookie button{min-height:38px;padding:0 14px;border-radius:9px;font:inherit;font-weight:800;cursor:pointer;border:1.5px solid var(--accent);background:var(--accent);color:var(--accent-ink)}
.cookie button.no{background:transparent;color:var(--accent)}
[hidden]{display:none!important}
@media (min-width:860px){.hero{padding:48px 0 60px}.hero .wrap{grid-template-columns:1.08fr .92fr;gap:44px}.grid.three{grid-template-columns:repeat(3,1fr)}.grid.two{grid-template-columns:repeat(2,1fr);max-width:760px}.who-list{grid-template-columns:repeat(3,1fr)}section{padding:60px 0}}
@media (prefers-reduced-motion:no-preference){.btn{transition:transform .12s}.btn:active{transform:scale(.98)}}
`;

// Script embutido (sem dependências). PIXEL e ANON vêm do servidor; nada pessoal sai daqui.
const script = (pixelId, anonFree) => `(function(){
var PIXEL=${JSON.stringify(pixelId)},CONSENT=${JSON.stringify(CONSENT_KEY)},qs=location.search||'';
function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
// Origem do cadastro (primeiro toque), igual ao app: utm_source/medium/campaign ou ?ref=, senão o site de origem.
try{if(!ls('2d_origem')){var p=new URLSearchParams(qs),u=p.get('utm_source')||p.get('ref'),v=u?[u,p.get('utm_medium'),p.get('utm_campaign')].filter(Boolean).join('/'):'';
if(!v&&document.referrer){var h=new URL(document.referrer).hostname.replace(/^www\\./,'');if(h&&h!==location.hostname.replace(/^www\\./,''))v='ref:'+h}
if(v)localStorage.setItem('2d_origem',v.slice(0,80))}}catch(e){}
// Links para o app levam junto a query (UTM, fbclid) e abrem o estado pelo #hash.
function app(hash){return '/'+qs+(hash?'#'+hash:'')}
[].forEach.call(document.querySelectorAll('a[data-app]'),function(a){a.href=app(a.getAttribute('data-app'))});
// Primeira pergunta: guardada só nesta aba e enviada pelo app (#ask).
var form=document.getElementById('ask'),box=document.getElementById('first-question');
form.addEventListener('submit',function(e){e.preventDefault();var q=box.value.trim();if(q.length<3){box.focus();return}
try{sessionStorage.setItem('2doctor-pending-question',JSON.stringify({q:q.slice(0,6000),at:Date.now()}));location.href=app('ask')}catch(err){location.href=app('criar-conta')}});
box.addEventListener('keydown',function(e){if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();form.requestSubmit?form.requestSubmit():form.submit()}});
[].forEach.call(document.querySelectorAll('[data-example]'),function(b){b.addEventListener('click',function(){box.value=b.textContent;box.focus()})});
// Meta Pixel: só com ID configurado e consentimento (mesma chave e mesmas regras do app).
function pixel(){if(window.fbq)return;
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('set','autoConfig',false,PIXEL);fbq('init',PIXEL);fbq('track','PageView');fbq('track','ViewContent',{content_name:'landing'})}
if(PIXEL){var c=ls(CONSENT);if(c==='accepted')pixel();else if(c!=='declined'){var bar=document.getElementById('cookie');bar.hidden=false;
bar.addEventListener('click',function(e){var v=e.target&&e.target.getAttribute('data-consent');if(!v)return;try{localStorage.setItem(CONSENT,v)}catch(err){}bar.hidden=true;if(v==='accepted')pixel()})}}
})();`;

const icon = (d) => `<div class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg></div>`;

// freeChat/freeCases: limites diários reais do plano gratuito (accounts.FREE_LIMITS);
// anonFree: perguntas grátis sem conta (0 = desligado).
export function landingHtml({ pixelId = '', freeChat = 0, freeCases = 0, anonFree = 0, path = '/start' } = {}) {
 const id = cleanPixelId(pixelId);
 const free = freeChat ? `${freeChat} AI answers a day` : 'AI answers with a daily limit';
 const cases = freeCases ? `${freeCases} clinical cases with feedback a day` : 'Clinical cases with feedback';
 const askNote = anonFree > 0 ? `Try ${anonFree} question${anonFree === 1 ? '' : 's'} free. No account needed.` : 'Free account, takes seconds. Your question is sent right after.';
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#005d5b">
<title>${esc(TITLE)}</title><meta name="description" content="${esc(DESCRIPTION)}"><link rel="canonical" href="${SITE}/start">
<link rel="icon" href="/brand/2doctor/favicon.svg"><link rel="apple-touch-icon" href="/brand/2doctor/logo-1024.png">
<meta property="og:type" content="website"><meta property="og:site_name" content="2Doctor"><meta property="og:url" content="${SITE}/start"><meta property="og:title" content="${esc(TITLE)}"><meta property="og:description" content="${esc(DESCRIPTION)}"><meta property="og:image" content="${SITE}/brand/2doctor/og-2doctor.png"><meta name="twitter:card" content="summary_large_image">
<style>${CSS}</style></head><body data-path="${esc(path)}">
<header class="top"><a class="brand" href="/" data-app="">${LOGO}<span>2Doctor</span></a><nav><a href="/" data-app="">Sign in</a><a class="btn small" href="/#criar-conta" data-app="criar-conta">Start free</a></nav></header>
<main>
<div class="hero"><div class="wrap">
 <div>
  <p class="eyebrow">AI clinical assistant for doctors and med students</p>
  <h1>Hard case at 3&nbsp;a.m.? Get the answer, <span>with the guideline and the source.</span></h1>
  <p class="lead">Ask a clinical question in plain language. 2Doctor answers in seconds and shows where the answer comes from, so you can check it.</p>
  <form class="ask" id="ask" action="/" method="get">
   <label for="first-question">Ask your first question</label>
   <textarea id="first-question" name="q" maxlength="2000" enterkeyhint="send" placeholder="e.g. Initial management of DKA in an adult with K+ 3.1"></textarea>
   <div class="ask-row"><small>${esc(askNote)}</small><button class="btn" type="submit">Get the answer</button></div>
  </form>
  <ul class="examples" aria-label="Example questions">
   <li><button type="button" data-example>Empiric antibiotics for septic shock, unknown source</button></li>
   <li><button type="button" data-example>When to anticoagulate new-onset AF?</button></li>
   <li><button type="button" data-example>Hyponatremia workup, step by step</button></li>
  </ul>
  <div class="cta-row"><a class="btn ghost" href="/#criar-conta" data-app="criar-conta">Start free</a><small>No credit card. Cancel anytime.</small></div>
 </div>
 <!-- VÍDEO (slot): quando houver um arquivo curto e leve (< 3 MB, mudo), trocar o bloco .demo por:
 <video class="demo" style="padding:0" src="/videos/landing.mp4" poster="/videos/landing.jpg" autoplay muted loop playsinline preload="metadata" width="720" height="900"></video> -->
 <div class="demo" aria-label="Example of a 2Doctor answer">
  <p class="q">Septic shock, MAP 58 after 30 mL/kg. Next step?</p>
  <div class="who">${LOGO}<span>2Doctor</span></div>
  <p><b>Start norepinephrine now</b>, targeting MAP ≥ 65 mmHg. Do not wait for more fluid or a central line.<sup>1</sup></p>
  <ul><li>Peripheral access is acceptable to start.<sup>1</sup></li><li>Add vasopressin if the dose keeps rising.<sup>1</sup></li><li>Recheck lactate and perfusion in 2 to 4 hours.<sup>2</sup></li></ul>
  <div class="src"><span>1 · Surviving Sepsis Campaign 2021</span><span>2 · Guideline text and link</span></div>
 </div>
</div></div>

<section><div class="wrap">
 <h2>Everything for the shift and for the exam</h2>
 <p class="sub">One place to ask, practice and see.</p>
 <div class="grid three">
  <div class="card">${icon('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>')}<h3>Answers with sources</h3><p>Clinical answers in seconds, with the guideline and references you can open and check.</p></div>
  <div class="card">${icon('<path d="M9 3h6v4H9z"/><path d="M7 5H5v16h14V5h-2"/><path d="m9 14 2 2 4-4"/>')}<h3>Clinical cases with feedback</h3><p>Write or dictate a case and get structured feedback on your reasoning, differentials and plan.</p></div>
  <div class="card">${icon('<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>')}<h3>3D anatomy, histology and radiology</h3><p>Rotate 3D models, explore slides and read real imaging, side by side with your question.</p></div>
 </div>
</div></section>

<section class="soft"><div class="wrap">
 <h2>Who it's for</h2>
 <p class="sub">Built for people who study and practice medicine.</p>
 <ul class="who-list">
  <li><b>Doctors and residents</b><span>A fast second look on call, with the source one tap away.</span></li>
  <li><b>Medical students</b><span>Cases, scores, 3D anatomy and questions to study with.</span></li>
  <li><b>Other health professionals</b><span>Clear, referenced answers for everyday clinical doubts.</span></li>
 </ul>
</div></section>

<section id="pricing"><div class="wrap">
 <h2>Simple pricing</h2>
 <p class="sub">Start free. Upgrade only if you use it a lot.</p>
 <div class="grid two">
  <div class="card plan"><span class="tag">Free</span><p class="price">US$ 0</p><ul><li>${esc(free)}</li><li>${esc(cases)}</li><li>3D anatomy, histology, radiology and scores</li></ul><a class="btn ghost" href="/#criar-conta" data-app="criar-conta">Start free</a></div>
  <div class="card plan pro"><span class="tag">Pro</span><p class="price">US$ 9.99 <small>/ month</small></p><p style="margin:0;color:var(--muted)">or US$ 79 / year. Cancel anytime.</p><ul><li>AI for heavy use, every day</li><li>Everything in Free</li></ul><a class="btn" href="/#planos" data-app="planos">See Pro</a></div>
 </div>
</div></section>

<section class="final soft"><div class="wrap">
 <h2>Your next hard case is coming.</h2>
 <p class="sub" style="margin-left:auto;margin-right:auto">Have the answer, the guideline and the source ready.</p>
 <a class="btn" href="/#criar-conta" data-app="criar-conta">Start free</a>
</div></section>
</main>
<footer><div class="wrap"><p><b>Educational tool. Does not replace clinical judgment.</b> Do not enter information that identifies patients.</p><p><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · © 2Doctor</p></div></footer>
<aside class="cookie" id="cookie" role="region" aria-label="Cookies" hidden><p>We use marketing cookies (Meta) to measure our ads. They load only if you accept. <a href="/privacy">Privacy policy</a></p><div><button type="button" class="no" data-consent="declined">Decline</button><button type="button" data-consent="accepted">Accept</button></div></aside>
<script>${script(id, anonFree)}</script>
</body></html>`;
}
