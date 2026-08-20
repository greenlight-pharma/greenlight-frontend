// [BR-PHONE] Normalização de telefone. Portada do medico.html preservando a
// regra original (que estava correta e é fruto de uso real), mais um ponto
// novo: variantes de identidade — ver [BR-PHONE-9DIG] no fim do arquivo.
//
// Formato canônico do sistema: 55 + DDD + número (ex: 5511999998888),
// o mesmo que o WhatsApp entrega. O médico digita só DDD + número; aqui
// garantimos o 55 sem duplicar se ele colar com 55 por hábito.
//
// A MESMA função é usada no lookup e no submit. Se fossem duas, daria pra
// verificar um número e cadastrar outro — bug de identidade de paciente.

/**
 * @param {string} raw entrada crua do médico
 * @returns {{ok: true, phone: string} | {ok: false, reason: string}}
 */
export function normalizeBRPhone(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (!d) return { ok: false, reason: "Telefone é obrigatório." };

  // Se veio colado com 55 na frente, só removemos esse 55 quando o que sobra
  // tem tamanho de número BR (10 ou 11 dígitos: DDD 2 + 8 ou 9). Assim não
  // confundimos um DDD que por acaso comece com 55 nem duplicamos o prefixo.
  if (d.length >= 12 && d.startsWith("55")) {
    const semDDI = d.slice(2);
    if (semDDI.length === 10 || semDDI.length === 11) {
      d = semDDI;
    }
  }

  if (d.length < 10 || d.length > 11) {
    return {
      ok: false,
      reason: "Informe DDD + número (ex: 11999998888). Apenas números do Brasil.",
    };
  }

  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) {
    return { ok: false, reason: "DDD inválido. Use um DDD brasileiro (11 a 99)." };
  }

  return { ok: true, phone: "55" + d };
}

/** Formata pra leitura humana: 5511999998888 -> (11) 99999-8888 */
export function formatBRPhone(stored) {
  const d = String(stored || "").replace(/\D/g, "");
  const local = d.startsWith("55") ? d.slice(2) : d;
  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  if (local.length === 10) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return stored || "";
}

// [BR-PHONE-9DIG] MITIGAÇÃO — a correção de verdade é no backend.
//
// O problema: este painel sempre grava 55+DDD+número. O backend, ao receber
// mensagem do paciente, faz apenas String(phone).replace(/\D/g,"") e guarda
// o que o provedor de WhatsApp entregou, sem normalizar o nono dígito. Se o
// provedor entregar o celular SEM o 9 (formato legado, ainda comum) e o
// médico cadastrar COM o 9, o mesmo paciente vira dois registros:
// o lembrete sai para um, a resposta "1 - já tomei" cai no outro, e a adesão
// nunca fecha. O médico não tem como perceber pelo painel.
//
// Enquanto o backend não normaliza, o painel pelo menos CONSULTA as duas
// formas antes de cadastrar e avisa o médico se já existir cadastro na outra.
// Isso não conserta a entrega da mensagem — só evita criar o duplicado.
export function phoneVariants(canonical) {
  const d = String(canonical || "").replace(/\D/g, "");
  if (!d.startsWith("55")) return [d].filter(Boolean);

  const local = d.slice(2);
  const ddd = local.slice(0, 2);
  const sub = local.slice(2);

  const out = new Set([d]);

  // 9 dígitos começando com 9 -> variante legada de 8 dígitos (sem o 9).
  if (sub.length === 9 && sub.startsWith("9")) {
    out.add("55" + ddd + sub.slice(1));
  }
  // 8 dígitos de celular (começa com 6/7/8/9) -> variante atual com o 9.
  if (sub.length === 8 && /^[6-9]/.test(sub)) {
    out.add("55" + ddd + "9" + sub);
  }

  return [...out];
}
