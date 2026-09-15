#!/usr/bin/env node
// Gerador de sites para clínicas e consultórios.
//
//   node clinicas/gerar.mjs clinicas/exemplos/cardio-jardins.json
//
// Lê um briefing em JSON, aplica no template e escreve
// clinicas/sites/<slug>/index.html. Sem dependências: o repo é estático
// puro e continua assim.
//
// [CONFORMIDADE] Antes de escrever o arquivo, o briefing passa pelo
// validador (validar.mjs). Se houver erro de publicidade médica — nome sem
// registro no conselho, depoimento de paciente, promessa de resultado — o
// site NÃO é gerado. Essa é a diferença entre isto e um construtor de sites
// genérico: aqui a regra do CFM está no código, não na boa memória de quem
// preenche o briefing.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validar, formatarRelatorio } from "./validar.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ *
 * Motor de template
 *
 * Deliberadamente minúsculo. Suporta o que os sites precisam e nada mais:
 *
 *   {{ chave.aninhada }}        valor, com escape de HTML
 *   {{{ chave }}}               valor sem escape (só para HTML que nós geramos)
 *   {{#se chave}} ... {{/se}}   trecho só se a chave tiver conteúdo
 *   {{#cada lista}} ... {{/cada}}  repete o trecho; dentro dele {{ .campo }}
 *                                  é o item atual e {{ @indice }} a posição
 * ------------------------------------------------------------------ */

const escaparHtml = (v) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function buscar(contexto, caminho) {
  if (caminho === ".") return contexto.item;
  if (caminho === "@indice") return contexto.indice;
  const partes = caminho.replace(/^\./, "item.").split(".");
  let atual = caminho.startsWith(".") ? contexto : contexto.dados;
  if (caminho.startsWith(".")) {
    // {{ .campo }} → campo do item atual do laço
    atual = contexto.item;
    partes.shift();
  }
  for (const parte of partes) {
    if (atual == null) return undefined;
    atual = atual[parte];
  }
  return atual;
}

const vazio = (v) =>
  v == null || v === false || v === "" || (Array.isArray(v) && v.length === 0);

// Encontra o fim do bloco aberto em `abertura`, contando profundidade.
// Um regex não-guloso fecharia no primeiro {{/se}} que encontrasse, o que
// quebra {{#se estrutura}} ... {{#se convenios}} ... {{/se}} ... {{/se}}.
const ABRE_OU_FECHA = /\{\{(#(?:se|cada)\s+[\w.@]+\s*|\/(?:se|cada))\}\}/g;

function acharFechamento(modelo, inicioCorpo, tipo) {
  ABRE_OU_FECHA.lastIndex = inicioCorpo;
  let profundidade = 1;
  let m;
  while ((m = ABRE_OU_FECHA.exec(modelo))) {
    if (m[1].startsWith("#")) {
      profundidade++;
    } else if (--profundidade === 0) {
      const fechado = m[1].slice(1);
      if (fechado !== tipo) {
        throw new Error(
          `template mal formado: {{#${tipo}}} fechado por {{/${fechado}}} na posição ${m.index}`
        );
      }
      return { corpo: modelo.slice(inicioCorpo, m.index), depois: m.index + m[0].length };
    }
  }
  throw new Error(`template mal formado: {{#${tipo}}} sem fechamento`);
}

const ABERTURA = /\{\{#(se|cada)\s+([\w.@]+)\s*\}\}/;

function renderizar(modelo, contexto) {
  let saida = "";
  let resto = modelo;

  // Blocos, do primeiro ao último, respeitando aninhamento.
  let m;
  while ((m = ABERTURA.exec(resto))) {
    saida += valores(resto.slice(0, m.index), contexto);
    const [tipo, caminho] = [m[1], m[2]];
    const { corpo, depois } = acharFechamento(resto, m.index + m[0].length, tipo);
    const valor = buscar(contexto, caminho);

    if (tipo === "cada") {
      if (Array.isArray(valor)) {
        saida += valor
          .map((item, i) => renderizar(corpo, { ...contexto, item, indice: i + 1 }))
          .join("");
      }
    } else if (!vazio(valor)) {
      saida += renderizar(corpo, contexto);
    }
    resto = resto.slice(depois);
  }

  return saida + valores(resto, contexto);
}

// Substituição de valores num trecho já sem blocos.
function valores(trecho, contexto) {
  return trecho
    .replace(/\{\{\{\s*([\w.@]+)\s*\}\}\}/g, (_, caminho) => {
      const v = buscar(contexto, caminho);
      return vazio(v) && v !== 0 ? "" : String(v);
    })
    .replace(/\{\{\s*([\w.@]+)\s*\}\}/g, (_, caminho) => {
      const v = buscar(contexto, caminho);
      return vazio(v) && v !== 0 ? "" : escaparHtml(v);
    });
}

/* ------------------------------------------------------------------ *
 * Campos derivados
 *
 * O briefing guarda só o que a pessoa sabe responder. Tudo que dá para
 * calcular — link do WhatsApp, endereço em uma linha, JSON-LD, horários
 * no formato do Google — é montado aqui, para não pedir duas vezes a
 * mesma informação e não deixar o cliente errar a sintaxe.
 * ------------------------------------------------------------------ */

const soDigitos = (s) => String(s || "").replace(/\D/g, "");

function linkWhatsapp(b) {
  const numero = soDigitos(b.contato?.whatsapp);
  if (!numero) return "";
  const texto =
    b.contato?.mensagemWhatsapp ||
    `Olá! Gostaria de agendar uma consulta na ${b.nome}.`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

function enderecoLinha(e = {}) {
  const linha1 = [e.logradouro, e.complemento].filter(Boolean).join(", ");
  const linha2 = [e.bairro, [e.cidade, e.uf].filter(Boolean).join(" - ")]
    .filter(Boolean)
    .join(", ");
  return [linha1, linha2, e.cep].filter(Boolean).join(" — ");
}

// "Segunda a sexta" + "08h às 18h" → "Mo-Fr 08:00-18:00" (schema.org)
const DIAS = {
  segunda: "Mo", terça: "Tu", terca: "Tu", quarta: "We", quinta: "Th",
  sexta: "Fr", sábado: "Sa", sabado: "Sa", domingo: "Su",
};

function horarioSchema(h) {
  const dias = String(h.dias || "").toLowerCase();
  const achados = Object.keys(DIAS).filter((d) => dias.includes(d));
  const faixa =
    achados.length > 1 && /a |até|-/.test(dias)
      ? `${DIAS[achados[0]]}-${DIAS[achados[achados.length - 1]]}`
      : achados.map((d) => DIAS[d]).join(",");
  const horas = String(h.horario || "").match(/(\d{1,2})\s*h?\s*(\d{2})?/g) || [];
  const para24 = (t) => {
    const m = String(t).match(/(\d{1,2})\s*h?\s*(\d{2})?/);
    return m ? `${m[1].padStart(2, "0")}:${m[2] || "00"}` : null;
  };
  const inicio = para24(horas[0]);
  const fim = para24(horas[1]);
  if (!faixa || !inicio || !fim) return null;
  return `${faixa} ${inicio}-${fim}`;
}

function jsonLd(b) {
  const e = b.endereco || {};
  const tipo =
    { odontologia: "Dentist", veterinaria: "VeterinaryCare" }[b.tipo] ||
    "MedicalClinic";
  const dados = {
    "@context": "https://schema.org",
    "@type": tipo,
    name: b.nome,
    description: b.descricao,
    url: b.site?.url || undefined,
    telephone: b.contato?.telefone || undefined,
    email: b.contato?.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: [e.logradouro, e.complemento].filter(Boolean).join(", "),
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    geo:
      e.latitude && e.longitude
        ? { "@type": "GeoCoordinates", latitude: e.latitude, longitude: e.longitude }
        : undefined,
    openingHoursSpecification: undefined,
    openingHours: (b.horarios || []).map(horarioSchema).filter(Boolean),
    medicalSpecialty: (b.especialidades || []).map((s) => s.nome),
    availableService: (b.especialidades || []).map((s) => ({
      "@type": "MedicalProcedure",
      name: s.nome,
    })),
    paymentAccepted: [
      b.pagamento?.particular ? "Particular" : null,
      ...(b.convenios || []),
    ].filter(Boolean).join(", ") || undefined,
  };
  // [CONFORMIDADE] aggregateRating é omitido de propósito. Ver COMPLIANCE.md:
  // nota e número de avaliações do Google, num site de médico, entram na
  // vedação do CFM a depoimento/testemunho de paciente como propaganda.
  // O JSON-LD entra no HTML sem escape (é {{{ }}} no template), então
  // < > & saem como escape unicode: um nome de clínica com "</script>"
  // fecharia o bloco antes da hora e derrubaria o resto da página.
  return JSON.stringify(dados, (_, v) => (v === undefined ? undefined : v), 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const ICONES = {
  coracao: '<path d="M12 21s-7.5-4.6-9.3-9A5.3 5.3 0 0 1 12 6.6a5.3 5.3 0 0 1 9.3 5.4C19.5 16.4 12 21 12 21Z"/>',
  estetoscopio: '<path d="M6 3v6a6 6 0 0 0 12 0V3"/><circle cx="18" cy="16" r="3"/>',
  dente: '<path d="M12 3c3.5 0 6 2 6 5 0 4-1.5 13-3 13s-1.5-5-3-5-1.5 5-3 5-3-9-3-13c0-3 2.5-5 6-5Z"/>',
  crianca: '<circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
  olho: '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
  osso: '<path d="M7 7 17 17"/><circle cx="5.5" cy="5.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  cerebro: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V17a3 3 0 0 0 4 2.8V4Z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V17a3 3 0 0 1-4 2.8V4Z"/>',
  pele: '<path d="M12 3c4 0 7 3 7 7 0 5-3 11-7 11s-7-6-7-11c0-4 3-7 7-7Z"/><circle cx="10" cy="10" r="1"/><circle cx="14" cy="14" r="1"/>',
  exame: '<path d="M8 3h8v4l-2 2v8a2 2 0 0 1-4 0V9L8 7Z"/>',
  padrao: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
};

/* ------------------------------------------------------------------ *
 * Marca e textos padrão
 *
 * O briefing informa uma cor; as variantes (escura, fundo suave) são
 * calculadas. Os títulos de seção têm texto padrão em português que
 * serve para qualquer clínica — o briefing só sobrescreve o que quiser.
 * Assim um briefing mínimo já gera um site inteiro e coerente.
 * ------------------------------------------------------------------ */

function hexParaRgb(hex) {
  const h = String(hex || "").replace("#", "");
  const c = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) || 0);
}
const rgbParaHex = (r, g, b) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v)))
    .toString(16).padStart(2, "0")).join("");

const escurecer = (hex, f = 0.32) => {
  const [r, g, b] = hexParaRgb(hex);
  return rgbParaHex(r * (1 - f), g * (1 - f), b * (1 - f));
};
// fundo suave: a cor da marca lavada em branco, para as seções alternadas
const lavar = (hex, f = 0.955) => {
  const [r, g, b] = hexParaRgb(hex);
  return rgbParaHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f);
};

function sigla(nome = "") {
  const ignorar = new Set(["de", "da", "do", "das", "dos", "e", "em", "clinica", "clínica", "consultorio", "consultório", "centro", "instituto"]);
  const palavras = nome.split(/\s+/).filter((p) => p && !ignorar.has(p.toLowerCase()));
  const base = palavras.length ? palavras : nome.split(/\s+/).filter(Boolean);
  return base.slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "C";
}

function marcaCompleta(m = {}) {
  const principal = m.corPrincipal || "#12626e";
  return {
    corPrincipal: principal,
    corPrincipalEscuro: m.corPrincipalEscuro || escurecer(principal),
    corDestaque: m.corDestaque || "#d99b3f",
    corFundoSuave: m.corFundoSuave || lavar(principal),
    fonteTitulo: m.fonteTitulo || "Newsreader",
    fonteTexto: m.fonteTexto || "Inter",
    sigla: m.sigla || "",
  };
}

const TEXTOS_PADRAO = {
  tituloServicos: "O que atendemos",
  leadServicos: "",
  tituloEquipe: "Quem vai te atender",
  leadEquipe: "",
  tituloEstrutura: "A estrutura",
  leadEstrutura: "",
  tituloLocal: "Como chegar",
  tituloFaq: "Perguntas que mais chegam na recepção",
  tituloCta: "Vamos marcar sua consulta?",
  leadCta: "Mande uma mensagem no WhatsApp e a recepção responde com os horários disponíveis.",
};

function preparar(b) {
  const conselho = (b.conselho || "CFM").toUpperCase();
  const marca = marcaCompleta(b.marca);
  marca.sigla = marca.sigla || sigla(b.nome || "");

  // O responsável técnico abre a seção de equipe: é ele que responde pelo
  // site, então é o primeiro nome que o paciente lê.
  const equipe = [b.responsavel, ...(b.equipe || [])]
    .filter(Boolean)
    .map((p) => ({ ...p, inicial: p.foto ? "" : (p.nome || "").replace(/^dr[ao]?[ªº.]*\s*/i, "").charAt(0).toUpperCase() }));

  return {
    ...b,
    conselho,
    marca,
    equipe,
    textos: { ...TEXTOS_PADRAO, ...(b.textos || {}) },
    pagamento: { particular: true, ...(b.pagamento || {}) },
    whatsappLink: linkWhatsapp(b),
    enderecoLinha: enderecoLinha(b.endereco),
    enderecoMapsBusca:
      b.endereco?.mapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${b.nome} ${enderecoLinha(b.endereco)}`
      )}`,
    telefoneLink: soDigitos(b.contato?.telefone)
      ? `tel:+55${soDigitos(b.contato.telefone)}`
      : "",
    jsonLd: jsonLd(b),
    ano: new Date().getFullYear(),
    especialidades: (b.especialidades || []).map((s) => ({
      ...s,
      svg: ICONES[s.icone] || ICONES.padrao,
    })),
    // [CONFORMIDADE] a linha de rodapé com registro do responsável técnico
    // é obrigatória em publicidade de serviço de saúde. Montada aqui para
    // que nenhum site saia sem ela.
    linhaResponsavel: b.responsavel
      ? [
          b.responsavel.nome,
          b.responsavel.registro,
          b.responsavel.rqe,
        ].filter(Boolean).join(" — ")
      : "",
  };
}

/* ------------------------------------------------------------------ */

function principal() {
  const arquivo = process.argv[2];
  if (!arquivo) {
    console.error("uso: node clinicas/gerar.mjs <briefing.json> [--forcar]");
    process.exit(2);
  }
  const forcar = process.argv.includes("--forcar");
  const briefing = JSON.parse(readFileSync(resolve(arquivo), "utf8"));

  const relatorio = validar(briefing);
  console.log(formatarRelatorio(relatorio, arquivo));
  if (relatorio.erros.length && !forcar) {
    console.error(
      "\nSite não gerado: corrija os erros acima. (--forcar ignora, use só para rascunho interno.)"
    );
    process.exit(1);
  }

  const modelo = readFileSync(join(AQUI, "template", "index.html"), "utf8");
  const html = renderizar(modelo, { dados: preparar(briefing) });

  const destino = join(AQUI, "sites", briefing.slug);
  mkdirSync(destino, { recursive: true });
  const caminho = join(destino, "index.html");
  writeFileSync(caminho, html, "utf8");

  const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
  console.log(`\n→ ${caminho} (${kb} KB, arquivo único, zero dependências)`);
  console.log(`→ preview depois do deploy: /preview/${briefing.slug}/`);
}

principal();
