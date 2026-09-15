#!/usr/bin/env node
// CSV de prospecção + modelo de nicho → briefings de rascunho → sites.
//
//   node clinicas/briefar.mjs --csv clinicas/prospectos/angra.csv \
//        --modelo fisio-angra --top 3
//
// É o elo que faltava entre "achei 40 clínicas sem site" e "tenho 3
// previews para ligar hoje". Pega as N melhores linhas qualificadas do
// CSV, veste cada uma com o modelo do nicho e gera o site.
//
// [SEGURANÇA] O que NUNCA é herdado do modelo:
//   • responsavel.registro e rqe  — número de conselho não se inventa
//   • responsavel.nome            — quem responde pela clínica é real
// Os modelos têm registro de demonstração para você ver o campo pronto.
// Levar isso para a página de uma clínica real seria atribuir um número
// de conselho a um profissional que não o tem. O rascunho sai com
// "a confirmar" visível, e é isso que você pergunta na ligação.
//
// Os arquivos saem em clinicas/prospectos/ — fora do git, porque levam
// nome, telefone e endereço de terceiros.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));

function argumentos() {
  const a = process.argv.slice(2);
  const pegar = (n, p) => { const i = a.indexOf(`--${n}`); return i >= 0 && a[i + 1] ? a[i + 1] : p; };
  return {
    csv: pegar("csv"),
    modelo: pegar("modelo"),
    top: Number(pegar("top", "3")),
    destino: pegar("destino", join(AQUI, "prospectos")),
  };
}

// Parser de CSV suficiente para o que prospectar.mjs escreve (campos com
// vírgula vêm entre aspas, aspas internas duplicadas).
function lerCsv(texto) {
  const linhas = [];
  let campo = "";
  let linha = [];
  let dentroDeAspas = false;
  const t = texto.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (dentroDeAspas) {
      if (c === '"' && t[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') dentroDeAspas = false;
      else campo += c;
    } else if (c === '"') dentroDeAspas = true;
    else if (c === ",") { linha.push(campo); campo = ""; }
    else if (c === "\n") { linha.push(campo); linhas.push(linha); linha = []; campo = ""; }
    else campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  const [cab, ...resto] = linhas.filter((l) => l.some((c) => c !== ""));
  return resto.map((l) => Object.fromEntries(cab.map((c, i) => [c.trim(), (l[i] ?? "").trim()])));
}

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const slugificar = (s) =>
  semAcento(String(s).toLowerCase())
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

// "R. Japoranga, 320 - Japuiba, Angra dos Reis - RJ, 23934-055, Brazil"
function partirEndereco(formatado) {
  const limpo = String(formatado || "").replace(/,\s*(Brazil|Brasil)\s*$/i, "").trim();
  const cep = (limpo.match(/\b\d{5}-?\d{3}\b/) || [])[0] || "";
  const uf = (limpo.match(/[-,]\s*([A-Z]{2})(?=[,\s]|$)/) || [])[1] || "";
  const partes = limpo.split(" - ").map((p) => p.trim());
  const logradouro = partes[0] || "";
  let bairro = "";
  let cidade = "";
  if (partes[1]) {
    const meio = partes[1].split(",").map((p) => p.trim());
    if (meio.length >= 2) { bairro = meio[0]; cidade = meio[1]; }
    else cidade = meio[0];
  }
  if (!cidade && partes[2]) cidade = partes[2].split(",")[0].trim();
  return {
    logradouro,
    bairro,
    cidade: cidade.replace(/,.*$/, ""),
    uf,
    cep,
    _formatadoOriginal: formatado,
  };
}

// (24) 98842-7901 → 5524988427901.  Fixo não recebe WhatsApp: marca para confirmar.
function telefones(bruto) {
  const d = String(bruto || "").replace(/\D/g, "");
  const nacional = d.replace(/^55/, "");
  const ddd = nacional.slice(0, 2);
  const numero = nacional.slice(2);
  const celular = numero.length === 9 && numero.startsWith("9");
  return {
    telefone: bruto || "",
    whatsapp: nacional.length >= 10 ? `55${nacional}` : "",
    ehCelular: celular,
  };
}

function principal() {
  const o = argumentos();
  if (!o.csv || !o.modelo) {
    console.error('uso: node clinicas/briefar.mjs --csv <arquivo.csv> --modelo <nome> [--top 3]');
    console.error("modelos disponíveis: veja clinicas/modelos/");
    process.exit(2);
  }

  const modelo = JSON.parse(readFileSync(join(AQUI, "modelos", `${o.modelo}.json`), "utf8"));
  const linhas = lerCsv(readFileSync(resolve(o.csv), "utf8"));
  const alvos = linhas.filter((l) => l.qualificado === "sim").slice(0, o.top);

  if (!alvos.length) {
    console.error(`Nenhuma linha qualificada em ${o.csv}. Afrouxe --min-avaliacoes na prospecção.`);
    process.exit(1);
  }

  const dirBriefings = join(o.destino, "briefings");
  const dirSites = join(o.destino, "sites");
  mkdirSync(dirBriefings, { recursive: true });

  for (const alvo of alvos) {
    const slug = slugificar(alvo.nome);
    const tel = telefones(alvo.telefone);
    const end = partirEndereco(alvo.endereco);

    const briefing = JSON.parse(JSON.stringify(modelo));
    delete briefing._aviso;

    briefing.slug = slug;
    briefing.nome = alvo.nome;
    briefing.preview = true;          // rascunho: noindex e tarja de prévia
    briefing.descricao = briefing.descricao
      .replace(/^[^.]*\./, `${alvo.nome}, em ${end.cidade || "sua cidade"}.`);

    // Identidade profissional NUNCA vem do modelo.
    briefing.responsavel = { nome: "Responsável técnico a confirmar" };
    delete briefing.equipe;

    // O modelo traz referência, estacionamento e acessibilidade da clínica
    // fictícia. Sobre o endereço real do prospecto eu não sei nada disso —
    // e "vagas na rua em frente" é afirmação de fato na página de alguém.
    // Sai vazio (o template omite a linha) e entra na lista de confirmação.
    const { referencia, estacionamento, acessibilidade, ...baseEndereco } = briefing.endereco;
    briefing.endereco = { ...baseEndereco, ...end };
    briefing.contato = {
      ...briefing.contato,
      telefone: tel.telefone,
      whatsapp: tel.whatsapp,
      mensagemWhatsapp: `Olá! Vi o site e gostaria de marcar um horário na ${alvo.nome}.`,
    };

    // Munição para a ligação, nunca para a página (prefixo _).
    briefing._prospeccao = {
      origem: `CSV ${o.csv}, nicho "${alvo.nicho}"`,
      notaGoogle: alvo.nota,
      avaliacoesGoogle: alvo.avaliacoes,
      maps: alvo.maps,
      placeId: alvo.placeId,
      tinhaSite: false,
      _confirmarNaLigacao: [
        "Registro do responsável no conselho (e RQE, se anuncia especialidade)",
        tel.ehCelular
          ? "O WhatsApp é este número?"
          : `ATENÇÃO: ${tel.telefone} parece ser fixo e não recebe WhatsApp — peça o celular da recepção`,
        "Endereço completo, sala e horário de funcionamento",
        "Ponto de referência, estacionamento e acessibilidade (saíram vazios de propósito: o modelo não sabe)",
        "Convênios realmente atendidos (o modelo trouxe os comuns da região)",
        "Os serviços listados são os que a clínica faz?",
      ],
    };

    const caminho = join(dirBriefings, `${slug}.json`);
    writeFileSync(caminho, JSON.stringify(briefing, null, 2) + "\n", "utf8");

    console.log(`\n── ${alvo.nome}  (${alvo.nota || "s/nota"} · ${alvo.avaliacoes} avaliações)`);
    if (!tel.ehCelular && tel.telefone) console.log(`   ⚠ ${tel.telefone} parece fixo: peça o celular da recepção`);
    execFileSync("node", [join(AQUI, "gerar.mjs"), caminho, "--saida", dirSites],
                 { stdio: "inherit" });
  }

  console.log(`\n${alvos.length} rascunho(s) gerado(s).`);
  console.log(`briefings: ${dirBriefings}`);
  console.log(`sites:     ${dirSites}`);
  console.log(`\nAntes de ligar: abra cada página no celular e confira a lista`);
  console.log(`_confirmarNaLigacao do briefing. O registro do conselho sai como`);
  console.log(`"a confirmar" de propósito — é a primeira coisa que você pergunta.`);
}

// Só executa quando chamado direto, para poder ser importado sem rodar.
if (process.argv[1] && process.argv[1].endsWith("briefar.mjs")) principal();

export { partirEndereco, telefones, lerCsv, slugificar };
