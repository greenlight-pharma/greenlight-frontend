#!/usr/bin/env node
// Validador de publicidade em saúde.
//
//   node clinicas/validar.mjs clinicas/exemplos/cardio-jardins.json
//
// Um construtor de sites genérico produz, por padrão, tudo que a
// publicidade médica brasileira proíbe: mural de depoimentos do Google,
// antes e depois, "o melhor da cidade", "primeira consulta com 50% off".
// O site fica bonito e coloca o cliente em risco de sindicância no CRM.
//
// Este arquivo é o contrário: as vedações viram teste automatizado.
// ERRO bloqueia a geração do site. AVISO é decisão do cliente, registrada.
//
// Base declarada (confira a redação vigente antes de prometer conformidade
// a um cliente — ver COMPLIANCE.md):
//   • Res. CFM 1.974/2011 e Res. CFM 2.336/2023 — publicidade médica
//   • Código de Ética Odontológica (CFO), Res. CFO 196/2019
//   • Res. CFP 010/2005 e Res. CFP 003/2007 — psicologia
//   • Lei 13.709/2018 (LGPD)
//
// Isto é engenharia, não parecer jurídico. O validador pega o que é
// detectável em texto; ele não substitui a leitura do código de ética do
// conselho do cliente.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/* ------------------------------------------------------------------ *
 * Padrões vedados
 * ------------------------------------------------------------------ */

const PADROES = [
  {
    nivel: "erro",
    nome: "promocao-mercantilizacao",
    regex:
      /\b(promo(ção|cao|ções|coes)|desconto|off\b|imperd[íi]vel|(\d{1,3}\s*%\s*(de\s*)?(off|desconto))|leve\s+\d|gr[áa]tis|brinde|sorteio|black\s*friday)/i,
    explicacao:
      "Oferta, desconto, brinde ou sorteio em serviço de saúde é mercantilização da medicina — vedado. Tire a oferta; o argumento de venda é a conveniência e a competência, não o preço.",
    // Vantagem de estacionamento não é oferta de serviço de saúde: é a
    // conveniência que faz o paciente escolher a clínica, e pode ser dita.
    naoSe: /estacionamento|manobrista|valet|garagem/i,
  },
  {
    nivel: "erro",
    nome: "promessa-de-resultado",
    regex:
      /\b(garant(ia|imos|ido|e-se)\s+(de\s+)?(resultado|cura|sucesso)|100\s*%\s*(de\s*)?(eficácia|eficacia|sucesso|garantido)|cura\s+(garantida|definitiva|total)|resultado\s+garantido|sem\s+risco\s+nenhum|indolor\s+garantido)/i,
    explicacao:
      "Promessa de cura ou garantia de resultado é vedada em qualquer conselho da saúde. Troque por descrição do procedimento e do que se espera dele.",
  },
  {
    nivel: "erro",
    nome: "autopromocao-superlativo",
    regex:
      /\b(o\s+melhor\s+(m[ée]dico|dentista|cl[íi]nica|consult[óo]rio|profissional)|a\s+melhor\s+cl[íi]nica|melhor\s+da\s+(cidade|regi[ãa]o)|[úu]nico\s+(m[ée]dico|na\s+regi[ãa]o|do\s+(estado|pa[íi]s))|refer[êe]ncia\s+(nacional|mundial)|n[ºo°]\s*1\s+em)/i,
    explicacao:
      "Autopromoção, superlativo e alegação de exclusividade ou superioridade são vedados. Diga o que faz e com que formação, não que é o melhor.",
  },
  {
    nivel: "erro",
    nome: "depoimento-de-paciente",
    regex:
      /\b(depoimento|testemunho|"?o\s+que\s+(nossos\s+)?pacientes\s+(dizem|falam)"?|avalia(ção|cao|ções|coes)\s+(de|dos)\s+pacientes|\d[,.]\d\s*(estrelas|no\s+google)|nota\s+\d[,.]\d\s+no\s+google)/i,
    explicacao:
      "Depoimento de paciente e nota/estrelas do Google como propaganda são vedados ao médico (CFM), ao dentista e ao psicólogo. É exatamente o que um gerador genérico coloca por padrão — e é o principal risco que este projeto evita.",
    apenasConselhos: ["CFM", "CFO", "CFP", "CREFITO", "CFMV", "CRN"],
  },
  {
    nivel: "erro",
    nome: "antes-e-depois",
    regex: /\b(antes\s+e\s+depois|antes\/depois|before\s*&?\s*after|resultado\s+real\s+de\s+paciente)/i,
    explicacao:
      "Imagem de antes e depois é vedada pelo CFM. Se o cliente insistir, é ele que responde no conselho — e o site sai deste gerador sem isso.",
    apenasConselhos: ["CFM", "CFP", "CREFITO"],
  },
  {
    nivel: "erro",
    nome: "equipamento-como-vantagem",
    regex:
      /\b(equipamento\s+(exclusivo|[úu]nico)|tecnologia\s+(exclusiva|[úu]nica)\s+(da\s+regi[ãa]o|no\s+brasil)|[úu]nico\s+aparelho)/i,
    explicacao:
      "Anunciar aparelho ou técnica como exclusivo/superior para atrair clientela é vedado. Descreva o recurso sem o adjetivo de disputa.",
    apenasConselhos: ["CFM", "CFO"],
  },
  {
    nivel: "aviso",
    nome: "preco-divulgado",
    regex: /\bR\$\s*\d[\d.,]*|\b(a\s+partir\s+de|por\s+apenas)\s+R?\$?\s*\d[\d.,]*/i,
    explicacao:
      "Valor de consulta no site é terreno disputado: a divulgação de preço em saúde já foi tratada como concorrência desleal pelos conselhos e o entendimento mudou com o tempo. Decisão do cliente, por escrito, e confirme a redação vigente com o CRM do estado dele.",
  },
  {
    nivel: "aviso",
    nome: "urgencia-artificial",
    regex: /\b(últim(as|os)\s+vagas|vagas\s+limitadas|só\s+hoje|corra|agende\s+agora\s+antes)/i,
    explicacao:
      "Gatilho de escassez em saúde soa mal e beira a mercantilização. Um 'Agendar pelo WhatsApp' limpo converte melhor com clínica.",
  },
  {
    nivel: "aviso",
    nome: "foto-de-paciente",
    regex: /\b(foto|imagem|v[íi]deo)\s+(de|do|da)\s+paciente/i,
    explicacao:
      "Imagem de paciente exige autorização específica e por escrito (e mesmo com ela há vedações). Prefira foto da estrutura, da equipe e da recepção.",
  },
];

/* ------------------------------------------------------------------ *
 * Percorre o briefing juntando todo texto, com o caminho de onde veio
 * ------------------------------------------------------------------ */

function textos(valor, caminho = "", saida = []) {
  if (typeof valor === "string") {
    saida.push({ caminho: caminho || "(raiz)", texto: valor });
  } else if (Array.isArray(valor)) {
    valor.forEach((v, i) => textos(v, `${caminho}[${i}]`, saida));
  } else if (valor && typeof valor === "object") {
    for (const [k, v] of Object.entries(valor)) {
      textos(v, caminho ? `${caminho}.${k}` : k, saida);
    }
  }
  return saida;
}

/* ------------------------------------------------------------------ */

export function validar(b) {
  const erros = [];
  const avisos = [];
  const conselho = String(b.conselho || "CFM").toUpperCase();
  const erro = (regra, msg, onde) => erros.push({ regra, msg, onde });
  const aviso = (regra, msg, onde) => avisos.push({ regra, msg, onde });

  // [PREVIEW] Rascunho de prospecção, feito antes de falar com a clínica.
  // Registro e RQE viram AVISO: você não tem esse dado ainda e não deve
  // inventá-lo — o site sai com "a confirmar" visível e com noindex.
  // Todas as outras vedações continuam sendo ERRO: mostrar ao cliente um
  // rascunho com depoimento ou "melhor da cidade" é o mesmo desastre.
  // Sem `preview`, publicar exige o registro real.
  const faltaRegistro = b.preview ? aviso : erro;

  /* --- estrutura mínima --------------------------------------------- */

  if (!b.slug || !/^[a-z0-9-]+$/.test(b.slug))
    erro("slug", "slug obrigatório, só minúsculas, números e hífen (vira a URL do preview).", "slug");
  if (!b.nome) erro("nome", "nome do consultório ou clínica é obrigatório.", "nome");
  if (!b.descricao)
    aviso("descricao", "sem meta description o Google monta uma sozinha, em geral ruim. 140–160 caracteres.", "descricao");

  /* --- identificação profissional obrigatória ----------------------- */
  // [CONFORMIDADE] Publicidade de serviço médico precisa trazer nome e
  // número de registro do responsável. Anunciar especialidade exige RQE.
  // Site sem isso é a irregularidade mais comum e a mais fácil de evitar.

  const REGISTRO = {
    CFM: /^CRM[-/ ]?[A-Z]{2}\s*\d{3,7}$/i,
    CFO: /^CRO[-/ ]?[A-Z]{2}\s*\d{3,7}$/i,
    CFP: /^CRP[-/ ]?\d{2}\/\d{3,7}$/i,
    CREFITO: /^CREFITO[-/ ]?\d{1,2}\s*\/?\s*\d{3,7}/i,
    CFMV: /^CRMV[-/ ]?[A-Z]{2}\s*\d{3,7}$/i,
    CRN: /^CRN[-/ ]?\d{1,2}\s*\d{3,7}$/i,
  };

  if (conselho !== "NENHUM") {
    const r = b.responsavel;
    if (!r?.nome)
      erro("responsavel", "responsável técnico é obrigatório: o site precisa dizer quem responde por ele.", "responsavel.nome");
    if (!r?.registro) {
      faltaRegistro("registro", `número de registro no conselho (${conselho}) é obrigatório na publicidade.${b.preview ? " No rascunho sai como \"a confirmar\" — pergunte na ligação, ou consulte o portal público do conselho. Nunca invente." : ""}`, "responsavel.registro");
    } else if (REGISTRO[conselho] && !REGISTRO[conselho].test(r.registro.trim())) {
      erro("registro-formato", `"${r.registro}" não parece um registro ${conselho} válido. Ex.: ${
        { CFM: "CRM-SP 123456", CFO: "CRO-RJ 45678", CFP: "CRP 06/123456",
          CREFITO: "CREFITO-3 123456-F", CFMV: "CRMV-MG 12345", CRN: "CRN-3 12345" }[conselho]
      }`, "responsavel.registro");
    }
    if (conselho === "CFM" && r?.especialidade && !r?.rqe)
      faltaRegistro("rqe", `para anunciar "${r.especialidade}" o CFM exige o RQE (Registro de Qualificação de Especialista) junto do CRM. Sem RQE, o site descreve a atuação sem chamar de especialidade.`, "responsavel.rqe");

    for (const [i, m] of (b.equipe || []).entries()) {
      if (!m.registro)
        faltaRegistro("registro-equipe", `${m.nome || `membro ${i + 1}`} aparece na equipe sem registro no conselho.`, `equipe[${i}].registro`);
      if (conselho === "CFM" && m.especialidade && !m.rqe)
        faltaRegistro("rqe-equipe", `${m.nome || `membro ${i + 1}`} anuncia especialidade sem RQE.`, `equipe[${i}].rqe`);
    }
  }

  /* --- depoimentos: campo que só existe fora de conselho ------------ */

  if (b.depoimentos?.length && conselho !== "NENHUM")
    erro("depoimentos", `o briefing traz ${b.depoimentos.length} depoimento(s) de paciente. Vedado sob ${conselho}. É o passo que o vídeo viral ensina a fazer (copiar as avaliações do Google) e o que não se faz em site de saúde no Brasil.`, "depoimentos");

  /* --- varredura de texto ------------------------------------------- */

  for (const { caminho, texto } of textos(b)) {
    if (caminho.startsWith("_")) continue; // campos internos de prospecção
    for (const p of PADROES) {
      if (p.apenasConselhos && !p.apenasConselhos.includes(conselho)) continue;
      const achou = texto.match(p.regex);
      if (!achou) continue;
      if (p.naoSe && p.naoSe.test(texto)) continue;
      const msg = `"${achou[0]}" — ${p.explicacao}`;
      (p.nivel === "erro" ? erro : aviso)(p.nome, msg, caminho);
    }
  }

  /* --- o site precisa converter -------------------------------------- */

  if (!b.contato?.whatsapp)
    erro("whatsapp", "sem WhatsApp o site não tem como agendar — e é o botão de agendamento que faz o cliente pagar.", "contato.whatsapp");
  if (!b.endereco?.logradouro || !b.endereco?.cidade)
    aviso("endereco", "endereço completo é o que faz a clínica aparecer na busca local. Sem ele o site perde a maior parte do valor.", "endereco");
  if (!(b.horarios || []).length)
    aviso("horarios", "horário de funcionamento é a informação nº 1 procurada por quem acha a clínica no celular.", "horarios");
  if (!(b.especialidades || []).length)
    aviso("especialidades", "sem lista de serviços não há o que indexar nem o que ler.", "especialidades");
  if (!(b.faq || []).length)
    aviso("faq", "3 a 6 perguntas frequentes reduzem ligação repetida na recepção — é um argumento de venda por si só.", "faq");

  /* --- Imagens -------------------------------------------------------- */
  // [FOTOS] O retrato é o que faz um site de consultório parecer bom, e é
  // também a peça com dono: o fotógrafo tem o direito autoral e a pessoa
  // tem direito de imagem. Baixar do Instagram e publicar não é atalho, é
  // uso indevido de obra e de imagem. Então o gerador exige que esteja
  // escrito de onde veio e quem autorizou — não para enfeitar, mas porque
  // sem isso a foto não deveria estar na página.
  const m = b.midia || {};
  if (m.retrato) {
    if (!m.origem)
      erro("foto-origem", "midia.retrato está preenchido mas midia.origem não diz de onde a foto veio. Registre: \"enviada pela clínica no WhatsApp em 14/09/2026\", \"fotógrafo X, contratado pela clínica\", \"banco de imagens Y, licença Z\".", "midia.origem");
    if (!m.autorizacao)
      erro("foto-autorizacao", "midia.retrato exige midia.autorizacao: quem autorizou o uso da imagem no site e quando. Foto de pessoa tem direito de imagem, e foto feita por terceiro tem direito autoral do fotógrafo — nem o print do Instagram nem o resultado de busca no Google servem.", "midia.autorizacao");
    if (!m.retratoAlt)
      aviso("foto-alt", "midia.retratoAlt descreve a imagem para quem usa leitor de tela e para o Google. Uma linha basta.", "midia.retratoAlt");
  }
  for (const [i, g] of (m.galeria || []).entries()) {
    if (!g.tipo)
      erro("foto-tipo", `galeria[${i}] precisa de tipo: "propria" (foto do próprio consultório) ou "ilustrativa" (banco de imagens). Imagem que não é do lugar aparece rotulada na página — apresentar foto de outro consultório como se fosse o dele é publicidade enganosa.`, `midia.galeria[${i}].tipo`);
    if (g.tipo && !["propria", "ilustrativa"].includes(g.tipo))
      erro("foto-tipo", `galeria[${i}].tipo = "${g.tipo}" não existe. Use "propria" ou "ilustrativa".`, `midia.galeria[${i}].tipo`);
    if (g.tipo === "propria" && !m.origem)
      erro("foto-origem", `galeria[${i}] é foto própria do consultório mas midia.origem não registra de onde ela veio nem quem a enviou.`, "midia.origem");
    if (/paciente/i.test(`${g.alt || ""} ${g.legenda || ""}`))
      erro("foto-paciente", `galeria[${i}] menciona paciente. Imagem de paciente em publicidade exige autorização específica por escrito e ainda assim é vedada em boa parte dos casos. Fotografe a estrutura, a recepção e a equipe.`, `midia.galeria[${i}].alt`);
  }
  if ((m.galeria || []).some((g) => g.tipo === "ilustrativa") && !m.creditos)
    aviso("foto-creditos", "há imagem ilustrativa na galeria: registre o crédito e a licença em midia.creditos. Unsplash e Pexels permitem uso comercial, mas o crédito é boa prática e prova a procedência se alguém perguntar.", "midia.creditos");

  /* --- LGPD ---------------------------------------------------------- */
  // O template não tem formulário de propósito: agendamento é por WhatsApp
  // e telefone. Sem coleta, a superfície de LGPD do site é quase zero.
  // Se alguém acrescentar formulário, aviso obrigatório.

  if (b.formulario)
    aviso("lgpd-formulario", "formulário coleta dado pessoal — e, em saúde, dado sensível (art. 11 da LGPD). Exige base legal, finalidade declarada, política de privacidade e cuidado no armazenamento. O padrão deste gerador é não ter formulário: WhatsApp resolve com muito menos risco.", "formulario");
  if (!b.politicaPrivacidade)
    aviso("lgpd-politica", "mesmo sem formulário, uma página curta de privacidade (o que o site registra, o que não registra) custa nada e é boa apresentação.", "politicaPrivacidade");

  return { erros, avisos, conselho };
}

export function formatarRelatorio({ erros, avisos, conselho }, arquivo = "") {
  const l = [];
  l.push(`Conformidade — ${arquivo || "briefing"} (conselho: ${conselho})`);
  l.push("─".repeat(64));
  if (!erros.length && !avisos.length) l.push("Nada a apontar.");
  for (const e of erros) l.push(`  ERRO   [${e.regra}] ${e.onde}\n         ${e.msg}`);
  for (const a of avisos) l.push(`  aviso  [${a.regra}] ${a.onde}\n         ${a.msg}`);
  l.push("─".repeat(64));
  l.push(`${erros.length} erro(s), ${avisos.length} aviso(s)`);
  return l.join("\n");
}

// Execução direta: node clinicas/validar.mjs <briefing.json>
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  const arquivo = process.argv[2];
  if (arquivo) {
    const b = JSON.parse(readFileSync(resolve(arquivo), "utf8"));
    const rel = validar(b);
    console.log(formatarRelatorio(rel, arquivo));
    process.exit(rel.erros.length ? 1 : 0);
  }
}
