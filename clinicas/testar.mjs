#!/usr/bin/env node
// Testes do gerador.  node clinicas/testar.mjs
//
// Cobre o que quebraria em silêncio e sairia no site de um cliente:
// conformidade, campos derivados e renderização de blocos aninhados.

import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { validar } from "./validar.mjs";
import { PALETAS, LAYOUTS, resolverEstilo } from "./estilos.mjs";
import { contraste } from "./gerar.mjs";
import { semear, gerarPaleta, direcaoDeArte, gerarCss, EIXOS } from "./arte.mjs";

let falhas = 0;
const ok = (nome, cond, detalhe = "") => {
  console.log(`${cond ? "  ok  " : "FALHA "} ${nome}${cond ? "" : ` — ${detalhe}`}`);
  if (!cond) falhas++;
};
const ler = (p) => JSON.parse(readFileSync(p, "utf8"));

console.log("\nConformidade");
const bom = ler("clinicas/exemplos/cardio-jardins.json");
const rBom = validar(bom);
ok("exemplo completo passa sem erro nem aviso",
   rBom.erros.length === 0 && rBom.avisos.length === 0,
   JSON.stringify([...rBom.erros, ...rBom.avisos].map((x) => x.regra)));

const ruim = ler("clinicas/exemplos/reprovado-o-que-nao-fazer.json");
const rRuim = validar(ruim);
const regras = new Set(rRuim.erros.map((e) => e.regra));
for (const esperada of [
  "registro", "rqe", "registro-equipe", "rqe-equipe", "depoimentos",
  "depoimento-de-paciente", "antes-e-depois", "promessa-de-resultado",
  "autopromocao-superlativo", "promocao-mercantilizacao",
]) ok(`exemplo irregular é barrado por [${esperada}]`, regras.has(esperada));

// A nota do Google é o caso mais perigoso: passa desapercebida e é
// exatamente o que o roteiro viral manda copiar.
ok("nota do Google em texto livre é erro",
   validar({ ...bom, chamada: "Nota 4,9 no Google" }).erros
     .some((e) => e.regra === "depoimento-de-paciente"));
ok("depoimento é liberado quando não há conselho",
   validar({ ...bom, conselho: "NENHUM", depoimentos: [{ nome: "A", texto: "b" }] })
     .erros.length === 0);
ok("registro em formato errado é erro",
   validar({ ...bom, responsavel: { ...bom.responsavel, registro: "12345" } })
     .erros.some((e) => e.regra === "registro-formato"));
ok("especialidade médica sem RQE é erro",
   validar({ ...bom, responsavel: { ...bom.responsavel, rqe: undefined } })
     .erros.some((e) => e.regra === "rqe"));
ok("desconto de estacionamento não é mercantilização",
   !validar(bom).erros.some((e) => e.regra === "promocao-mercantilizacao"));
ok("campos _internos são ignorados",
   validar({ ...bom, _nota: "melhor clínica da cidade, promoção 50% off" }).erros.length === 0);

console.log("\nGeração");
execFileSync("node", ["clinicas/gerar.mjs", "clinicas/exemplos/cardio-jardins.json"],
             { stdio: "pipe" });
const html = readFileSync("clinicas/sites/cardio-jardins/index.html", "utf8");

ok("nenhum token de template sobra", !/\{\{/.test(html),
   (html.match(/\{\{[^}]*\}\}/g) || []).slice(0, 3).join(" "));
ok("blocos aninhados renderizam (convênios dentro de estrutura)",
   (html.match(/class="convenio"/g) || []).length === bom.convenios.length);
ok("link do WhatsApp com mensagem pré-escrita",
   html.includes(`wa.me/${bom.contato.whatsapp}?text=`));
ok("registro do responsável visível", html.includes(bom.responsavel.registro));
ok("registro aparece no cartão da equipe, não só no rodapé",
   new RegExp(`class="registro">\\s*${bom.responsavel.registro}`).test(html));
ok("RQE visível", html.includes(bom.responsavel.rqe));
ok("aviso de que não substitui consulta", html.includes("não substituem a consulta"));
ok("sem aggregateRating no JSON-LD", !html.includes("aggregateRating"));
ok("nota do Google não vazou do briefing para a página",
   !html.includes(String(bom._prospeccao.notaGoogle)) ||
   !html.includes(String(bom._prospeccao.avaliacoesGoogle)));
ok("horário convertido para schema.org", html.includes('"Mo-Fr 08:00-19:00"'));
// A chamada usa {{{ }}} para o <em> do destaque passar; todo o resto usa
// {{ }} e precisa escapar, senão um "&" no nome da clínica quebra o HTML.
const h1 = html.split("<h1>")[1].split("</h1>")[0];
ok("chamada renderiza <em> sem escapar (destaque do hero)", h1.includes("<em>"));
{
  const comAmpersand = JSON.parse(JSON.stringify(bom));
  comAmpersand.nome = 'Clínica A & B <script>';
  comAmpersand.slug = "teste-escape";
  writeFileSync("/tmp/briefing-escape.json", JSON.stringify(comAmpersand));
  execFileSync("node", ["clinicas/gerar.mjs", "/tmp/briefing-escape.json"], { stdio: "pipe" });
  const h = readFileSync("clinicas/sites/teste-escape/index.html", "utf8");
  ok("valores comuns são escapados", h.includes("A &amp; B &lt;script&gt;") && !h.includes("B <script>"));
  rmSync("clinicas/sites/teste-escape", { recursive: true, force: true });
}
ok("inicial do avatar ignora o título (Dra. Helena → H)",
   /class="foto">H/.test(html));
ok("cor escura derivada da cor principal", /--principal-escuro:#0e3d49/.test(html));

console.log("\nEstilos: paletas e layouts");
for (const [nome, p] of Object.entries(PALETAS)) {
  const faltando = ["principal","principalEscuro","destaque","fundo","fundoSuave","tinta",
                    "tintaSuave","borda","fonteTitulo","fonteTexto"].filter((k) => !p[k]);
  ok(`paleta ${nome} está completa`, faltando.length === 0, faltando.join(","));
}
// Contraste: o celular no sol é o dispositivo real, não o monitor.
for (const [nome, p] of Object.entries(PALETAS)) {
  ok(`paleta ${nome}: texto sobre fundo passa de 4.5:1`,
     contraste(p.tinta, p.fundo) >= 4.5, contraste(p.tinta, p.fundo).toFixed(2));
  ok(`paleta ${nome}: branco sobre principal passa de 4.5:1`,
     contraste("#ffffff", p.principal) >= 4.5, contraste("#ffffff", p.principal).toFixed(2));
  ok(`paleta ${nome}: texto suave sobre fundo passa de 4.5:1`,
     contraste(p.tintaSuave, p.fundo) >= 4.5, contraste(p.tintaSuave, p.fundo).toFixed(2));
}
{
  // O destaque do hero é calculado, não escolhido: confere no HTML gerado.
  const h = readFileSync("clinicas/sites/odonto-angra-modelo/index.html", "utf8");
  const heroTom = (h.match(/--destaque-hero:(#[0-9a-f]{6})/i) || [])[1];
  const principal = (h.match(/--principal:(#[0-9a-f]{6})/i) || [])[1];
  ok("destaque do hero é clareado até 3.5:1 sobre o principal",
     heroTom && principal && contraste(heroTom, principal) >= 3.5,
     `${heroTom} sobre ${principal} = ${heroTom && principal ? contraste(heroTom, principal).toFixed(2) : "?"}`);
  ok("paleta rose precisava do ajuste (o tom cru reprovava)",
     contraste(PALETAS.rose.destaque, PALETAS.rose.principal) < 3);
}

ok("paleta inexistente falha claramente",
   (() => { try { resolverEstilo({ paleta: "roxo-neon" }); return false; }
            catch (e) { return /não existe/.test(e.message); } })());
ok("layout inexistente falha claramente",
   (() => { try { resolverEstilo({ layout: "revista" }); return false; }
            catch (e) { return /não existe/.test(e.message); } })());
ok("marca do briefing sobrescreve a paleta ponto a ponto",
   resolverEstilo({ paleta: "nude", marca: { principal: "#123456" } }).cores.principal === "#123456");
ok("chave antiga marca.corPrincipal ainda é respeitada (não some em silêncio)",
   resolverEstilo({ paleta: "nude", marca: { corPrincipal: "#123456", corDestaque: "#abcdef" } })
     .cores.principal === "#123456" &&
   resolverEstilo({ paleta: "nude", marca: { corDestaque: "#abcdef" } }).cores.destaque === "#abcdef");
ok("marca.sigla não vaza para dentro das cores",
   !("sigla" in resolverEstilo({ marca: { sigla: "AB" } }).cores));

// A URL do Google Fonts é o ponto onde um espaço não escapado derruba a
// tipografia inteira do site sem erro nenhum.
{
  const b = { ...bom, slug: "teste-fontes", layout: "editorial", paleta: "nude" };
  delete b.marca;   // sem sobrescrita: quem manda é a paleta
  writeFileSync("/tmp/b-fontes.json", JSON.stringify(b));
  execFileSync("node", ["clinicas/gerar.mjs", "/tmp/b-fontes.json"], { stdio: "pipe" });
  const h = readFileSync("clinicas/sites/teste-fontes/index.html", "utf8");
  ok("nome de fonte com espaço vira + na URL",
     h.includes("family=Cormorant+Garamond") && !/family=Cormorant Garamond/.test(h));
  ok("layout editorial usa o arquivo editorial", h.includes("hero-grid"));
  ok("paleta nude aplicada", h.includes("--principal:#5c2033"));
  ok("os dois layouts geram HTML diferente",
     !h.includes('class="servicos-grid"'));
  rmSync("clinicas/sites/teste-fontes", { recursive: true, force: true });
}

console.log("\nDireção de arte sob medida");
{
  // Determinismo: o cliente não pode abrir amanhã um desenho diferente do
  // que aprovou hoje.
  const a = direcaoDeArte({ slug: "clinica-x", _prospeccao: { placeId: "ChIJ-X-1" } });
  const b = direcaoDeArte({ slug: "clinica-x", _prospeccao: { placeId: "ChIJ-X-1" } });
  ok("mesma semente gera a mesma direção de arte", a.assinatura === b.assinatura);
  ok("mesma semente gera o mesmo CSS", gerarCss(a) === gerarCss(b));
  ok("place_id manda mais que o slug",
     direcaoDeArte({ slug: "igual", _prospeccao: { placeId: "A" } }).assinatura !==
     direcaoDeArte({ slug: "igual", _prospeccao: { placeId: "B" } }).assinatura);

  // A foto que chega depois não pode mudar o desenho aprovado.
  ok("retrato não altera os eixos sorteados",
     gerarCss(a, { temRetrato: true }).includes(`composição: ${a.composicao}`) &&
     gerarCss(a, { temRetrato: false }).includes(`composição: ${a.composicao}`));

  // Variedade: 400 clientes, quantos desenhos repetidos?
  const assinaturas = [];
  for (let i = 0; i < 400; i++) assinaturas.push(direcaoDeArte({ slug: `cliente-${i}` }).assinatura);
  const unicas = new Set(assinaturas).size;
  ok(`400 clientes geram pelo menos 380 desenhos distintos (deu ${unicas})`, unicas >= 380);

  // Cobertura: nenhum eixo pode estar morto (sorteio que nunca escolhe uma
  // opção é um bug silencioso — a opção existe no código e nunca aparece).
  const vistos = { comp: new Set(), orn: new Set(), lista: new Set(), img: new Set(), tipo: new Set() };
  for (let i = 0; i < 600; i++) {
    const d = direcaoDeArte({ slug: `cob-${i}` });
    vistos.comp.add(d.composicao); vistos.orn.add(d.ornamento);
    vistos.lista.add(d.lista); vistos.img.add(d.imagem); vistos.tipo.add(d.tipo.nome);
  }
  ok("todas as composições aparecem", vistos.comp.size === EIXOS.composicoes.length,
     [...vistos.comp].join(","));
  ok("todos os ornamentos aparecem", vistos.orn.size === EIXOS.ornamentos.length, [...vistos.orn].join(","));
  ok("todos os estilos de lista aparecem", vistos.lista.size === EIXOS.listas.length);
  ok("todos os tratamentos de imagem aparecem", vistos.img.size === EIXOS.imagens.length);
  ok("todas as tipografias aparecem", vistos.tipo.size === EIXOS.tipografias.length);

  // Restrições: combinações que não funcionam não podem sair.
  let moldurados = 0, faixaOrnada = 0;
  for (let i = 0; i < 800; i++) {
    const d = direcaoDeArte({ slug: `restr-${i}` });
    if (d.composicao === "moldura" && d.ornamento === "moldura") moldurados++;
    if (d.composicao === "faixa" && d.ornamento !== "nenhum") faixaOrnada++;
  }
  ok("composição moldura nunca sai com ornamento moldura", moldurados === 0);
  ok("composição faixa nunca sai com ornamento de fundo", faixaOrnada === 0);

  // Contraste de TODA paleta gerada, no pior fundo (o suave das seções .alt).
  let piorTinta = 99, piorSuave = 99, piorBranco = 99, piorDest = 99;
  for (let i = 0; i < 500; i++) {
    const p = gerarPaleta(semear(`pal-${i}`));
    piorTinta = Math.min(piorTinta, contraste(p.tinta, p.fundoSuave));
    piorSuave = Math.min(piorSuave, contraste(p.tintaSuave, p.fundoSuave));
    piorBranco = Math.min(piorBranco, contraste("#ffffff", p.principal));
    piorDest = Math.min(piorDest, contraste(p.destaqueHero, p.principalEscuro));
  }
  ok(`500 paletas: tinta sobre fundo suave nunca abaixo de 8 (pior ${piorTinta.toFixed(2)})`, piorTinta >= 8);
  ok(`500 paletas: tinta suave nunca abaixo de 4.8 (pior ${piorSuave.toFixed(2)})`, piorSuave >= 4.8);
  ok(`500 paletas: branco sobre principal nunca abaixo de 5 (pior ${piorBranco.toFixed(2)})`, piorBranco >= 5);
  ok(`500 paletas: destaque do hero nunca abaixo de 4.5 (pior ${piorDest.toFixed(2)})`, piorDest >= 4.5);

  // O bloco de hero escuro precisa vir DEPOIS das regras gerais: com a
  // mesma especificidade, quem vem antes perde — e o negrito da promessa
  // saía em tinta escura sobre fundo escuro, invisível.
  let escurosConferidos = 0;
  for (let i = 0; i < 200 && escurosConferidos < 12; i++) {
    const d = direcaoDeArte({ slug: `ordem-${i}` });
    if (!d.heroEscuro) continue;
    escurosConferidos++;
    const css = gerarCss(d);
    const geral = css.indexOf(".hero .promessa b{font-weight:600");
    const escuro = css.indexOf(".hero .promessa b{color:#fff}");
    ok(`hero escuro: override da promessa vem depois da regra geral (${d.assinatura.split("/")[0]})`,
       geral !== -1 && escuro !== -1 && escuro > geral);
  }

  // Sob medida não deve herdar nada do catálogo de paletas.
  const sm = { ...bom, slug: "teste-sm", layout: "sob-medida", paleta: "nude" };
  delete sm.marca;
  writeFileSync("/tmp/b-sm.json", JSON.stringify(sm));
  execFileSync("node", ["clinicas/gerar.mjs", "/tmp/b-sm.json"], { stdio: "pipe" });
  const h = readFileSync("clinicas/sites/teste-sm/index.html", "utf8");
  ok("sob medida ignora a paleta de catálogo", !h.includes("#5c2033"));
  ok("sob medida grava a assinatura no CSS", /assinatura: [a-z]+\/[a-z]+/i.test(h));
  ok("sob medida embute o CSS gerado, sem folha externa",
     h.includes("<style>/* Direção de arte gerada") && !/<link[^>]*\.css/.test(h));
  ok("sob medida mantém o registro do responsável", h.includes(bom.responsavel.registro));
  ok("sob medida mantém o aviso de consulta", h.includes("não substituem a consulta"));
  ok("marca do briefing ainda sobrescreve a cor gerada", (() => {
    const m = { ...sm, slug: "teste-sm2", marca: { principal: "#123456" } };
    writeFileSync("/tmp/b-sm2.json", JSON.stringify(m));
    execFileSync("node", ["clinicas/gerar.mjs", "/tmp/b-sm2.json"], { stdio: "pipe" });
    const h2 = readFileSync("clinicas/sites/teste-sm2/index.html", "utf8");
    rmSync("clinicas/sites/teste-sm2", { recursive: true, force: true });
    return h2.includes("--princ:#123456");
  })());
  rmSync("clinicas/sites/teste-sm", { recursive: true, force: true });
}

console.log("\nFotos: origem e autorização");
{
  const comFoto = { ...bom, midia: { retrato: "foto.jpg" } };
  const r = validar(comFoto);
  ok("retrato sem origem é erro", r.erros.some((e) => e.regra === "foto-origem"));
  ok("retrato sem autorização é erro", r.erros.some((e) => e.regra === "foto-autorizacao"));
  ok("retrato com origem e autorização passa",
     validar({ ...bom, midia: { retrato: "f.jpg", retratoAlt: "Dra. X no consultório",
       origem: "enviada pela clínica no WhatsApp em 14/09/2026",
       autorizacao: "Dra. X autorizou o uso no site em 14/09/2026" } }).erros.length === 0);
  ok("imagem de galeria sem tipo é erro",
     validar({ ...bom, midia: { galeria: [{ src: "a.jpg", alt: "recepção" }] } })
       .erros.some((e) => e.regra === "foto-tipo"));
  ok("tipo de galeria inválido é erro",
     validar({ ...bom, midia: { galeria: [{ src: "a.jpg", tipo: "banco" }] } })
       .erros.some((e) => e.regra === "foto-tipo"));
  ok("foto de paciente na galeria é erro",
     validar({ ...bom, midia: { galeria: [{ src: "a.jpg", tipo: "propria", alt: "paciente antes do tratamento" }] } })
       .erros.some((e) => e.regra === "foto-paciente"));

  // Imagem de banco não pode ser apresentada como o consultório do cliente.
  const ilustra = { ...bom, slug: "teste-ilustrativa", layout: "editorial",
    midia: { galeria: [{ src: "a.jpg", tipo: "ilustrativa", alt: "ambiente" }],
             creditos: "Unsplash, licença de uso comercial" } };
  writeFileSync("/tmp/b-ilustra.json", JSON.stringify(ilustra));
  execFileSync("node", ["clinicas/gerar.mjs", "/tmp/b-ilustra.json"], { stdio: "pipe" });
  const h = readFileSync("clinicas/sites/teste-ilustrativa/index.html", "utf8");
  ok("imagem ilustrativa sai rotulada na página", h.includes("Imagem ilustrativa"));
  ok("crédito da imagem aparece no rodapé", h.includes("Unsplash"));
  rmSync("clinicas/sites/teste-ilustrativa", { recursive: true, force: true });

  // Sem retrato, nenhum layout finge ter foto: entra o painel tipográfico.
  // Vale para os dois layouts que têm quadro de imagem.
  for (const [layout, classePainel, classeFoto] of [
    ["editorial", "hero-painel", 'class="hero-figura"'],
    ["sob-medida", 'class="painel"', "<figure>"],
  ]) {
    const b = { ...bom, slug: `teste-sem-foto-${layout}`, layout };
    delete b.marca;
    delete b.midia;
    writeFileSync("/tmp/b-sf.json", JSON.stringify(b));
    execFileSync("node", ["clinicas/gerar.mjs", "/tmp/b-sf.json"], { stdio: "pipe" });
    const h = readFileSync(`clinicas/sites/teste-sem-foto-${layout}/index.html`, "utf8");
    ok(`${layout} sem retrato usa painel tipográfico, não <img> vazia`,
       h.includes(classePainel) && !h.includes(classeFoto));
    ok(`${layout} sem retrato não traz <img> de hero`, !/<img[^>]*fetchpriority/.test(h));
    rmSync(`clinicas/sites/teste-sem-foto-${layout}`, { recursive: true, force: true });
  }
}

console.log("\nModo rascunho (preview de prospecção)");
{
  const rascunho = JSON.parse(JSON.stringify(bom));
  rascunho.slug = "teste-preview";
  rascunho.preview = true;
  delete rascunho.responsavel.registro;
  delete rascunho.responsavel.rqe;
  delete rascunho.equipe[0].registro;
  delete rascunho.equipe[0].rqe;

  const r = validar(rascunho);
  ok("rascunho sem registro não é erro, é aviso",
     r.erros.length === 0 && r.avisos.some((a) => a.regra === "registro"),
     JSON.stringify(r.erros.map((e) => e.regra)));
  ok("rascunho ainda barra vedação de conteúdo",
     validar({ ...rascunho, chamada: "A melhor clínica da cidade" }).erros
       .some((e) => e.regra === "autopromocao-superlativo"));

  writeFileSync("/tmp/briefing-preview.json", JSON.stringify(rascunho));
  execFileSync("node", ["clinicas/gerar.mjs", "/tmp/briefing-preview.json"], { stdio: "pipe" });
  const h = readFileSync("clinicas/sites/teste-preview/index.html", "utf8");
  ok("rascunho leva noindex", /noindex, nofollow/.test(h));
  ok("rascunho mostra tarja de prévia", /class="tarja"/.test(h));
  ok("rascunho marca o registro como a confirmar, sem inventar número",
     /class="pendente">registro a confirmar/.test(h) && !/CRM-\w\w \d/.test(h));
  rmSync("clinicas/sites/teste-preview", { recursive: true, force: true });
}

// Publicar exige o registro real: sem `preview`, falta de registro bloqueia.
ok("site publicável não sai sem registro real",
   validar({ ...bom, responsavel: { ...bom.responsavel, registro: undefined } })
     .erros.some((e) => e.regra === "registro"));
ok("site publicável não leva noindex", !/noindex/.test(html));

console.log("\nBriefar (CSV → rascunho)");
{
  const csv = [
    "qualificado,nicho,nome,categoria,telefone,nota,avaliacoes,endereco,maps,placeId,site",
    'sim,fisioterapeuta,Fisio Teste,Fisioterapeuta,(24) 98800-0001,4.9,96,"R. Japoranga, 320 - Japuiba, Angra dos Reis - RJ, 23934-055, Brazil",,px1,',
    'sim,fisioterapeuta,Fixo Teste,Fisioterapeuta,(24) 3365-0002,4.8,54,"Rua do Comercio, 220 - Centro, Angra dos Reis - RJ, 23900-565, Brazil",,px2,',
    'nao,fisioterapeuta,Nao Qualificado,Fisioterapeuta,,3.1,4,"Rua X, 1 - Centro, Angra dos Reis - RJ, Brazil",,px3,',
  ].join("\n");
  writeFileSync("/tmp/csv-teste.csv", "\uFEFF" + csv);
  const saida = execFileSync("node", ["clinicas/briefar.mjs", "--csv", "/tmp/csv-teste.csv",
    "--modelo", "fisio-angra", "--top", "3", "--destino", "/tmp/prospectos-teste"],
    { encoding: "utf8" });

  ok("só linhas qualificadas entram", /2 rascunho\(s\)/.test(saida));
  ok("avisa quando o telefone é fixo (não recebe WhatsApp)",
     /parece fixo/.test(saida));

  const b = JSON.parse(readFileSync("/tmp/prospectos-teste/briefings/fisio-teste.json", "utf8"));
  ok("endereço do Places é decomposto, UF incluída",
     b.endereco.logradouro === "R. Japoranga, 320" && b.endereco.bairro === "Japuiba" &&
     b.endereco.cidade === "Angra dos Reis" && b.endereco.uf === "RJ" &&
     b.endereco.cep === "23934-055",
     JSON.stringify(b.endereco));
  ok("celular vira link de WhatsApp com 55 e DDD", b.contato.whatsapp === "5524988000001");
  ok("registro de demonstração do modelo NÃO é herdado",
     !b.responsavel.registro && !b.responsavel.rqe && !JSON.stringify(b).includes("CREFITO-"));
  ok("nome do responsável fictício NÃO é herdado",
     !JSON.stringify(b).includes("Modelo Sobrenome"));
  ok("afirmação física sobre o endereço não é inventada",
     !b.endereco.referencia && !b.endereco.estacionamento && !b.endereco.acessibilidade);
  ok("rascunho marcado como preview", b.preview === true);
  ok("nota do Google guardada em _prospeccao, fora da página",
     b._prospeccao.notaGoogle === "4.9" &&
     !readFileSync("/tmp/prospectos-teste/sites/fisio-teste/index.html", "utf8")
        .includes("96 avalia"));
  rmSync("/tmp/prospectos-teste", { recursive: true, force: true });
}

console.log("\nProspecção");
const saida = execFileSync("node",
  ["clinicas/prospectar.mjs", "--simular", "--cidade", "X", "--nichos", "y",
   "--saida", "/tmp/prospect-teste.csv"], { encoding: "utf8" });
ok("filtra quem já tem site", /1 já têm site/.test(saida));
ok("qualifica só quem tem reputação e telefone", /1 QUALIFICADOS/.test(saida));
ok("ignora duplicata e negócio fechado", /5 negócios vistos/.test(saida));

console.log(`\n${falhas ? `${falhas} FALHA(S)` : "tudo ok"}\n`);
process.exit(falhas ? 1 : 0);
