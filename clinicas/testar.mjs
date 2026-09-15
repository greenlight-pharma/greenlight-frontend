#!/usr/bin/env node
// Testes do gerador.  node clinicas/testar.mjs
//
// Cobre o que quebraria em silêncio e sairia no site de um cliente:
// conformidade, campos derivados e renderização de blocos aninhados.

import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { validar } from "./validar.mjs";

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
