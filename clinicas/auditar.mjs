#!/usr/bin/env node
// Auditor de design generativo.
//
//   npm i -D playwright            (uma vez; não é dependência do site)
//   node clinicas/auditar.mjs --sementes 24
//
// Um sistema que produz milhares de desenhos não pode ser conferido a
// olho: você aprova seis, e o sétimo cliente recebe o que ninguém viu.
// Este script sorteia N sementes, gera o site de cada uma, abre no
// navegador e MEDE o que saiu:
//
//   • contraste real (cor computada do texto contra o fundo computado do
//     ancestral que efetivamente pinta) — foi assim que apareceu o
//     negrito da promessa saindo em tinta escura sobre hero escuro
//   • transbordo horizontal em três larguras de tela
//   • sobreposição indevida: nenhum texto do primeiro quadro pode subir
//     por cima do cabeçalho
//   • presença dos elementos de conformidade em todas as combinações
//
// Falha com a assinatura da direção de arte, que é o que permite
// reproduzir: a semente gera sempre o mesmo desenho.

import { writeFileSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { direcaoDeArte } from "./arte.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const TMP = "/tmp/auditoria-clinicas";

const arg = (n, p) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : p; };

// Alvos a medir. `grande` segue a WCAG: >=24px, ou >=18.66px em negrito,
// passa com 3:1; o resto precisa de 4.5:1.
const ALVOS = [
  { sel: ".hero h1", grande: true },
  { sel: ".hero .papel", grande: true },
  { sel: ".hero .promessa" },
  { sel: ".hero .promessa b" },
  { sel: ".hero .olho" },
  { sel: ".hero .reg" },
  { sel: ".hero .btn-1" },
  { sel: ".hero .btn-2" },
  { sel: ".tit", grande: true },
  { sel: ".lead" },
  { sel: ".serif-lead", grande: true },
  { sel: ".olho" },
  { sel: ".cred li" },
  { sel: ".caixa-reg" },
  { sel: ".atu h3", grande: true },
  { sel: ".atu p" },
  { sel: ".proc li" },
  { sel: ".estr li" },
  { sel: ".dados li" },
  { sel: ".dados .rot" },
  { sel: ".conv span" },
  { sel: ".fina" },
  { sel: "summary", grande: true },
  { sel: "details p" },
  { sel: ".cta h2", grande: true },
  { sel: ".cta .lead" },
  { sel: ".selo .num", grande: true },
  { sel: ".selo .txt" },
  { sel: ".rod p" },
  { sel: ".resp" },
  { sel: ".aviso" },
];

// Roda dentro do navegador: não pode fechar sobre nada do Node.
function sonda(alvos) {
  const rgb = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const sobre = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const ct = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

  // Fundo efetivo: sobe pelos ancestrais até achar quem realmente pinta.
  // Se encontrar gradiente ou imagem no caminho, devolve null — medir por
  // cima de gradiente daria um número inventado.
  const fundoDe = (el) => {
    let n = el, pilha = [];
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { indefinido: true };
      const c = rgb(cs.backgroundColor);
      if (c && c.a > 0) { pilha.push(c); if (c.a === 1) break; }
      n = n.parentElement;
    }
    if (!pilha.length) return { cor: { r: 255, g: 255, b: 255, a: 1 } };
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = pilha.length - 1; i >= 0; i--) base = sobre(pilha[i], base);
    return { cor: base };
  };

  const achados = [];
  for (const alvo of alvos) {
    const el = document.querySelector(alvo.sel);
    if (!el) continue;
    const cs = getComputedStyle(el);
    if (!el.getClientRects().length) continue;
    const frente = rgb(cs.color);
    const f = fundoDe(el);
    if (!frente || f.indefinido) { achados.push({ sel: alvo.sel, pulado: 'fundo com gradiente ou imagem' }); continue; }
    const px = parseFloat(cs.fontSize);
    const peso = parseInt(cs.fontWeight, 10) || 400;
    const grande = alvo.grande || px >= 24 || (px >= 18.66 && peso >= 600);
    const minimo = grande ? 3 : 4.5;
    const valor = ct(sobre(frente, f.cor), f.cor);
    achados.push({ sel: alvo.sel, valor: +valor.toFixed(2), minimo, px: +px.toFixed(1), passou: valor >= minimo });
  }

  // Texto do primeiro quadro não pode subir por cima do cabeçalho.
  const topo = document.querySelector('.topo');
  const heroTxt = document.querySelector('.hero-txt');
  let sobreposicao = null;
  if (topo && heroTxt) {
    const a = topo.getBoundingClientRect(), b = heroTxt.getBoundingClientRect();
    sobreposicao = +(a.bottom - b.top).toFixed(1);
  }

  return {
    achados,
    sobreposicao,
    larguraRolagem: document.documentElement.scrollWidth,
    temRegistro: !!document.querySelector('.caixa-reg'),
    temAviso: /não substituem a consulta/.test(document.body.textContent),
    temZap: document.querySelectorAll('a[href*="wa.me"]').length,
  };
}

async function principal() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("playwright não instalado. Rode:  npm i -D playwright");
    console.error("(é ferramenta de auditoria; o site gerado não depende dela)");
    process.exit(2);
  }

  const quantas = Number(arg("sementes", "24"));
  const modeloBase = JSON.parse(
    execFileSync("cat", [join(AQUI, "modelos", "derma-angra.json")], { encoding: "utf8" })
  );

  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });

  // Sementes espalhadas de propósito, para varrer os eixos.
  const sementes = Array.from({ length: quantas }, (_, i) => `auditoria-${i * 7919 + 13}`);
  const briefings = [];
  for (const s of sementes) {
    const b = JSON.parse(JSON.stringify(modeloBase));
    delete b._aviso; delete b.paleta; delete b.marca;
    b.layout = "sob-medida";
    b.slug = s;
    b._prospeccao = { placeId: s };
    const caminho = join(TMP, `${s}.json`);
    writeFileSync(caminho, JSON.stringify(b));
    execFileSync("node", [join(AQUI, "gerar.mjs"), caminho, "--saida", join(TMP, "sites")],
                 { stdio: "pipe" });
    briefings.push({ semente: s, arte: direcaoDeArte(b) });
  }

  const navegador = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM || "/opt/pw-browsers/chromium",
  });

  const falhas = [];
  const larguras = [1280, 820, 390];
  let medidas = 0;

  for (const { semente, arte } of briefings) {
    for (const largura of larguras) {
      const pagina = await navegador.newPage({ viewport: { width: largura, height: 900 } });
      const errosJs = [];
      pagina.on("pageerror", (e) => errosJs.push(String(e)));
      await pagina.goto(`file://${join(TMP, "sites", semente, "index.html")}`);
      await pagina.waitForTimeout(260);
      const r = await pagina.evaluate(sonda, ALVOS);
      await pagina.close();

      for (const a of r.achados) {
        if (a.pulado) continue;
        medidas++;
        if (!a.passou)
          falhas.push(`contraste ${a.valor}:1 (mínimo ${a.minimo}) em ${a.sel} @${largura}px — ${arte.assinatura}`);
      }
      if (r.larguraRolagem > largura + 1)
        falhas.push(`transbordo horizontal ${r.larguraRolagem}px em tela de ${largura}px — ${arte.assinatura}`);
      if (r.sobreposicao !== null && r.sobreposicao > 4)
        falhas.push(`texto do hero sobe ${r.sobreposicao}px por cima do cabeçalho @${largura}px — ${arte.assinatura}`);
      if (!r.temRegistro)
        falhas.push(`sem caixa de registro do responsável @${largura}px — ${arte.assinatura}`);
      if (!r.temAviso)
        falhas.push(`sem aviso de que não substitui consulta @${largura}px — ${arte.assinatura}`);
      if (!r.temZap)
        falhas.push(`sem link de WhatsApp @${largura}px — ${arte.assinatura}`);
      if (errosJs.length)
        falhas.push(`erro de JS (${errosJs[0].slice(0, 90)}) @${largura}px — ${arte.assinatura}`);
    }
  }

  await navegador.close();

  const eixos = {};
  for (const { arte } of briefings) {
    for (const [i, v] of arte.assinatura.split("/").entries()) {
      (eixos[i] ||= new Set()).add(v);
    }
  }
  const nomesEixos = ["família","esquema","tipografia","composição","ornamento","ritmo","forma","lista","imagem","hero"];

  console.log(`\n${briefings.length} desenhos · ${larguras.length} larguras · ${medidas} medidas de contraste`);
  console.log("cobertura de eixos:");
  for (const [i, nome] of nomesEixos.entries())
    console.log(`  ${nome.padEnd(12)} ${[...(eixos[i] || [])].sort().join(", ")}`);
  console.log(`assinaturas distintas: ${new Set(briefings.map((b) => b.arte.assinatura)).size} de ${briefings.length}`);

  if (falhas.length) {
    console.log(`\n${falhas.length} FALHA(S):`);
    for (const f of [...new Set(falhas)].slice(0, 40)) console.log(`  ${f}`);
    process.exit(1);
  }
  console.log("\nnenhuma falha.");
}

principal();
