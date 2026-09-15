#!/usr/bin/env node
// Encontra clínicas e consultórios SEM SITE, pela API oficial do Google Places.
//
//   export GOOGLE_PLACES_API_KEY=...
//   node clinicas/prospectar.mjs --cidade "São Paulo" --uf SP \
//        --nichos cardiologista,dermatologista,ortopedista \
//        --saida clinicas/prospectos/sp-2026-09.csv
//
// Por que a API e não raspagem: a API oficial devolve o campo websiteUri,
// que é justamente o filtro do negócio (quem não tem site). Raspar o Maps
// viola os termos de uso do Google, entope o funil de bloqueio e um dia
// derruba tudo que você construiu em cima. A API custa centavos por busca
// e é estável.
//
// Termos de uso, em resumo prático: os dados vêm para você trabalhar a
// prospecção, não para montar um diretório paralelo. Não guarde o conteúdo
// do Places além do necessário (a regra do Google é de 30 dias para a
// maioria dos campos; o place ID pode ser guardado). Guarde o que é seu:
// nome do negócio, telefone público, o que você falou e quando.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const CHAVE = process.env.GOOGLE_PLACES_API_KEY;
const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

// Só o que a prospecção usa. Field mask menor = conta menor.
const CAMPOS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.primaryTypeDisplayName",
  "places.businessStatus",
  "nextPageToken",
].join(",");

function argumentos() {
  const a = process.argv.slice(2);
  const pegar = (nome, padrao) => {
    const i = a.indexOf(`--${nome}`);
    return i >= 0 && a[i + 1] ? a[i + 1] : padrao;
  };
  return {
    cidade: pegar("cidade"),
    uf: pegar("uf", ""),
    nichos: pegar("nichos", "clínica médica,consultório médico,dermatologista,cardiologista,ortopedista,pediatra,ginecologista,dentista,fisioterapeuta,psicólogo")
      .split(",").map((s) => s.trim()).filter(Boolean),
    saida: pegar("saida", "clinicas/prospectos/prospectos.csv"),
    porNicho: Number(pegar("limite", "60")),
    minAvaliacoes: Number(pegar("min-avaliacoes", "8")),
    minNota: Number(pegar("min-nota", "4.3")),
  };
}

// --simular exercita filtro, deduplicação e CSV sem chave e sem gastar
// chamada de API. Serve para conferir o pipeline antes de rodar de verdade.
const SIMULACAO = {
  places: [
    { id: "p1", displayName: { text: "Consultório Dr. Exemplo Cardiologia" }, formattedAddress: "Rua A, 10 - São Paulo", nationalPhoneNumber: "(11) 3333-1111", rating: 4.9, userRatingCount: 143, googleMapsUri: "https://maps.google.com/?cid=1", primaryTypeDisplayName: { text: "Cardiologista" }, businessStatus: "OPERATIONAL" },
    { id: "p2", displayName: { text: "Clínica Já Tem Site" }, formattedAddress: "Rua B, 20 - São Paulo", nationalPhoneNumber: "(11) 3333-2222", websiteUri: "https://exemplo.com.br", rating: 4.7, userRatingCount: 88, businessStatus: "OPERATIONAL" },
    { id: "p3", displayName: { text: "Consultório Sem Telefone" }, formattedAddress: "Rua C, 30 - São Paulo", rating: 4.8, userRatingCount: 60, businessStatus: "OPERATIONAL" },
    { id: "p4", displayName: { text: "Clínica Nota Baixa" }, formattedAddress: "Rua D, 40 - São Paulo", nationalPhoneNumber: "(11) 3333-4444", rating: 3.4, userRatingCount: 51, businessStatus: "OPERATIONAL" },
    { id: "p5", displayName: { text: "Clínica Poucas Avaliações" }, formattedAddress: "Rua E, 50 - São Paulo", nationalPhoneNumber: "(11) 3333-5555", rating: 5, userRatingCount: 3, businessStatus: "OPERATIONAL" },
    { id: "p6", displayName: { text: "Clínica Fechada" }, formattedAddress: "Rua F, 60 - São Paulo", nationalPhoneNumber: "(11) 3333-6666", rating: 4.9, userRatingCount: 200, businessStatus: "CLOSED_PERMANENTLY" },
    { id: "p1", displayName: { text: "Consultório Dr. Exemplo Cardiologia (duplicado)" }, formattedAddress: "Rua A, 10 - São Paulo", nationalPhoneNumber: "(11) 3333-1111", rating: 4.9, userRatingCount: 143, businessStatus: "OPERATIONAL" },
  ],
};

async function buscar(consulta, pageToken) {
  if (process.argv.includes("--simular")) return SIMULACAO;
  const resposta = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": CHAVE,
      "X-Goog-FieldMask": CAMPOS,
    },
    body: JSON.stringify({
      textQuery: consulta,
      languageCode: "pt-BR",
      regionCode: "BR",
      pageSize: 20,
      ...(pageToken ? { pageToken } : {}),
    }),
  });
  if (!resposta.ok) {
    const corpo = await resposta.text();
    throw new Error(`Places API ${resposta.status}: ${corpo.slice(0, 400)}`);
  }
  return resposta.json();
}

const csvCampo = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

async function principal() {
  const opcoes = argumentos();
  const simulando = process.argv.includes("--simular");
  if (!CHAVE && !simulando) {
    console.error("Falta GOOGLE_PLACES_API_KEY no ambiente.");
    console.error("Crie a chave no Google Cloud, habilite a Places API (New) e restrinja por IP.");
    process.exit(2);
  }
  if (!opcoes.cidade) {
    console.error('uso: node clinicas/prospectar.mjs --cidade "São Paulo" --uf SP [--nichos a,b] [--limite 60]');
    process.exit(2);
  }

  const vistos = new Set();
  const semSite = [];
  const comSite = [];

  for (const nicho of opcoes.nichos) {
    const consulta = `${nicho} em ${opcoes.cidade}${opcoes.uf ? ` - ${opcoes.uf}` : ""}`;
    let token = undefined;
    let colhidos = 0;
    process.stdout.write(`\n${consulta}\n  `);

    while (colhidos < opcoes.porNicho) {
      let dados;
      try {
        dados = await buscar(consulta, token);
      } catch (e) {
        console.log(`\n  erro: ${e.message}`);
        break;
      }
      const lugares = dados.places || [];
      if (!lugares.length) break;

      for (const p of lugares) {
        colhidos++;
        if (vistos.has(p.id)) continue;
        vistos.add(p.id);
        if (p.businessStatus && p.businessStatus !== "OPERATIONAL") continue;

        const linha = {
          nicho,
          nome: p.displayName?.text || "",
          categoria: p.primaryTypeDisplayName?.text || "",
          telefone: p.nationalPhoneNumber || p.internationalPhoneNumber || "",
          endereco: p.formattedAddress || "",
          nota: p.rating ?? "",
          avaliacoes: p.userRatingCount ?? 0,
          site: p.websiteUri || "",
          maps: p.googleMapsUri || "",
          placeId: p.id,
        };

        if (linha.site) { comSite.push(linha); process.stdout.write("."); continue; }

        // O alvo: sem site, reputação já construída, telefone público para
        // ligar. Nota alta importa porque quem tem 4,8 com 150 avaliações
        // já provou que o serviço é bom — o site é a única peça que falta.
        const qualifica =
          linha.avaliacoes >= opcoes.minAvaliacoes &&
          (linha.nota === "" || Number(linha.nota) >= opcoes.minNota) &&
          !!linha.telefone;

        linha.qualificado = qualifica ? "sim" : "nao";
        semSite.push(linha);
        process.stdout.write(qualifica ? "★" : "o");
      }

      token = dados.nextPageToken;
      if (!token) break;
    }
  }

  const colunas = ["qualificado","nicho","nome","categoria","telefone","nota","avaliacoes","endereco","maps","placeId","site"];
  semSite.sort((a, b) => (b.avaliacoes || 0) - (a.avaliacoes || 0));
  const csv = [
    colunas.join(","),
    ...semSite.map((l) => colunas.map((c) => csvCampo(l[c])).join(",")),
  ].join("\n");

  mkdirSync(dirname(opcoes.saida), { recursive: true });
  writeFileSync(opcoes.saida, "﻿" + csv, "utf8"); // BOM: Excel abre com acento certo

  const qualificados = semSite.filter((l) => l.qualificado === "sim").length;
  const total = semSite.length + comSite.length;
  console.log(`\n\n─────────────────────────────────────────────`);
  console.log(`  ${total} negócios vistos`);
  console.log(`  ${comSite.length} já têm site  (${((comSite.length / total) * 100 || 0).toFixed(0)}%)`);
  console.log(`  ${semSite.length} sem site`);
  console.log(`  ${qualificados} QUALIFICADOS  ← sua lista de ligação`);
  console.log(`─────────────────────────────────────────────`);
  console.log(`→ ${opcoes.saida}`);
  console.log(`\nLigue de cima para baixo: o CSV vem ordenado por número de`);
  console.log(`avaliações. Quem tem mais avaliação e nenhum site é quem mais`);
  console.log(`perde cliente por não ter — e quem entende isso na primeira frase.`);
}

principal();
