// Visitante no Brasil? Consulta local das faixas de IP do Brasil (LACNIC), sem enviar o IP a terceiros.
// Usado para liberar o que só vale no Brasil (Resumos ENAMED).
import { readFileSync } from 'node:fs';
const D = JSON.parse(readFileSync(new URL('./data/ip-brasil.json', import.meta.url), 'utf8'));
const V6 = D.v6.map(([hi, len]) => [BigInt('0x' + hi), BigInt(64 - len)]);
function no4(ip) {
 const n = ip.split('.').reduce((a, b) => a * 256 + Number(b), 0);
 let lo = 0, hi = D.v4.length - 1;
 while (lo <= hi) { const m = (lo + hi) >> 1, [s, e] = D.v4[m]; if (n < s) hi = m - 1; else if (n > e) lo = m + 1; else return true; }
 return false;
}
function no6(ip) {
 const [a, b = ''] = ip.split('::'); const A = a ? a.split(':') : [], B = b ? b.split(':') : [];
 if (A.length + B.length > 8) return false;
 const g = [...A, ...Array(8 - A.length - B.length).fill('0'), ...B];
 const top = BigInt('0x' + g.slice(0, 4).map((x) => x.padStart(4, '0')).join(''));
 return V6.some(([p, shift]) => (top >> shift) === (p >> shift));
}
export function ipBrasil(ip) {
 ip = String(ip || '').trim().replace(/^::ffff:/i, '');
 if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return no4(ip);
 if (/^[0-9a-f:]+$/i.test(ip) && ip.includes(':')) return no6(ip.toLowerCase());
 return false;
}
// IP do visitante: o primeiro do X-Forwarded-For (a borda do Railway o preenche).
export const ipDe = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
export const noBrasil = (req) => process.env.LIBERAR_BRASIL === '1' || ipBrasil(ipDe(req));
