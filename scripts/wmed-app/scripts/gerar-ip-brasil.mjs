// Gera server/data/ip-brasil.json a partir das estatísticas oficiais do LACNIC (registro regional de IPs).
// Uso: node scripts/gerar-ip-brasil.mjs <delegated-lacnic-extended-latest>
//   baixar em https://ftp.lacnic.net/pub/stats/lacnic/delegated-lacnic-extended-latest (atualizar de tempos em tempos)
import { readFileSync, writeFileSync } from 'node:fs';
const linhas = readFileSync(process.argv[2], 'utf8').split('\n');
const v4 = [], v6 = [];
const ip4 = (s) => s.split('.').reduce((a, b) => a * 256 + Number(b), 0);
function ip6hi(s) { // 64 bits de cima, em hex de 16 dígitos
 const [a, b = ''] = s.split('::'); const A = a ? a.split(':') : [], B = b ? b.split(':') : [];
 const g = [...A, ...Array(8 - A.length - B.length).fill('0'), ...B].map((x) => x.padStart(4, '0'));
 return g.slice(0, 4).join('');
}
for (const l of linhas) {
 const p = l.split('|');
 if (p[1] !== 'BR' || !['allocated', 'assigned'].includes(p[6])) continue;
 if (p[2] === 'ipv4') { const s = ip4(p[3]); v4.push([s, s + Number(p[4]) - 1]); }
 if (p[2] === 'ipv6' && Number(p[4]) <= 64) v6.push([ip6hi(p[3]), Number(p[4])]);
}
v4.sort((a, b) => a[0] - b[0]);
const junto = [];
for (const r of v4) { const u = junto.at(-1); if (u && r[0] <= u[1] + 1) u[1] = Math.max(u[1], r[1]); else junto.push([...r]); }
writeFileSync(new URL('../server/data/ip-brasil.json', import.meta.url), JSON.stringify({ fonte: 'LACNIC delegated-extended', gerado: new Date().toISOString().slice(0, 10), v4: junto, v6 }));
console.log('ipv4', junto.length, 'ipv6', v6.length);
