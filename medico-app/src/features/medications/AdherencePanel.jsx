import { RESPOSTA } from "../../lib/adherence.js";

// [ADESAO] Seção do card de Medicações. Responde às quatro perguntas que o
// médico leva para a consulta seguinte:
//   quantas doses foram confirmadas · quantas falharam ·
//   em que dias/horários furou · está melhorando ou piorando
//
// Os TRÊS estados aparecem sempre separados. Confundir "não tomou" com
// "não respondeu" é o erro que faria o médico ler o paciente errado.
export default function AdherencePanel({ resumo = [], respostas = [], falhas, evolucao = [] }) {
  const comDenominador = resumo.filter((r) => r.esperadas > 0);

  // [EFEITO-COLATERAL] Este bloco é o único aviso que existe.
  //
  // O relato deixou de ser empurrado para o WhatsApp do médico (ver
  // [EFEITO-NAO-VAI-POR-WHATSAPP] no backend): o lugar de acompanhar adesão
  // é aqui, junto do histórico. Mas antes disso o efeito colateral aparecia
  // só como letra miúda numa linha de detalhe — o que bastava quando havia
  // um alerta em paralelo, e não basta mais.
  //
  // Ordenado do mais recente para o mais antigo: em efeito colateral o que
  // importa primeiro é o que acabou de acontecer.
  const efeitos = respostas
    .filter((r) => r.resposta === "efeito_colateral")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!comDenominador.length && !respostas.length) {
    return (
      <div className="adesao-secao">
        <strong>📊 Adesão ao tratamento</strong>
        <div className="state-msg">
          Nenhuma dose esperada no período. A adesão aparece quando houver
          prescrição ativa com horários e data de início.
        </div>
      </div>
    );
  }

  const total = comDenominador.reduce(
    (a, r) => ({
      esperadas: a.esperadas + r.esperadas,
      tomou: a.tomou + r.tomou,
      nao_tomou: a.nao_tomou + r.nao_tomou,
      semResposta: a.semResposta + r.semResposta,
    }),
    { esperadas: 0, tomou: 0, nao_tomou: 0, semResposta: 0 }
  );

  const pct = (n) => (total.esperadas ? Math.round((n / total.esperadas) * 100) : 0);

  return (
    <div className="adesao-secao">
      <strong>📊 Adesão ao tratamento (30 dias)</strong>

      {efeitos.length > 0 && (
        <div className="efeito-aviso">
          <div className="efeito-aviso-titulo">
            🚨 {efeitos.length}{" "}
            {efeitos.length === 1
              ? "relato de efeito colateral"
              : "relatos de efeito colateral"}
          </div>
          <ul>
            {efeitos.slice(0, 5).map((r) => (
              <li key={r.id}>
                <strong>{r.medicationName}</strong>
                {r.scheduleTime ? ` (${r.scheduleTime})` : ""} —{" "}
                {formatarDataHora(r.createdAt)}
              </li>
            ))}
          </ul>
          {efeitos.length > 5 && (
            <div className="small">
              e mais {efeitos.length - 5}. Veja todas as respostas abaixo.
            </div>
          )}
          {/* O paciente já recebeu a orientação de procurar atendimento se
              o efeito for grave. Aqui a mensagem é para o médico: o relato
              não dispara aviso em lugar nenhum, então quem olha é quem vê. */}
          <div className="small">
            O paciente foi orientado a procurar atendimento se o efeito for grave.
            Este registro não gera aviso automático — é visto aqui.
          </div>
        </div>
      )}

      {total.esperadas > 0 && (
        <>
          <div
            className="adesao-barra"
            role="img"
            aria-label={`${pct(total.tomou)}% confirmadas, ${pct(total.nao_tomou)}% não tomadas, ${pct(total.semResposta)}% sem resposta`}
          >
            <span className="faixa-ok" style={{ width: `${pct(total.tomou)}%` }} />
            <span className="faixa-nao" style={{ width: `${pct(total.nao_tomou)}%` }} />
            <span className="faixa-silencio" style={{ width: `${pct(total.semResposta)}%` }} />
          </div>

          <div className="adesao-legenda">
            <span>
              <i className="ponto ok" /> {total.tomou} confirmadas ({pct(total.tomou)}%)
            </span>
            <span>
              <i className="ponto nao" /> {total.nao_tomou} não tomadas ({pct(total.nao_tomou)}%)
            </span>
            <span>
              <i className="ponto silencio" /> {total.semResposta} sem resposta ({pct(total.semResposta)}%)
            </span>
            <span className="texto-suave">de {total.esperadas} doses esperadas</span>
          </div>
        </>
      )}

      <div className="adesao-grid">
        {comDenominador.map((r) => (
          <div key={r.medicationId} className="adesao-card">
            <div className="adesao-med">
              {r.medicationName} {r.dose && <span className="texto-suave">{r.dose}</span>}
            </div>
            <div className={`adesao-taxa ${r.taxaConfirmada < 60 ? "baixa" : "boa"}`}>
              {r.taxaConfirmada}%
            </div>
            <div className="adesao-detalhe">
              {r.tomou} de {r.esperadas} doses confirmadas
            </div>
            <div className="adesao-detalhe">
              {r.nao_tomou} não tomadas · {r.semResposta} sem resposta
              {r.efeito_colateral > 0 && (
                <>
                  {" · "}
                  <strong className="texto-erro">{r.efeito_colateral} efeito colateral</strong>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Este aviso não é rodapé: sem ele o médico lê o percentual como
          "tomou X% das doses" quando parte do denominador é silêncio. */}
      <div className="adesao-nota">
        ℹ️ O percentual é sobre as <strong>doses esperadas</strong> da prescrição
        (horários × dias). “Sem resposta” não significa que o paciente deixou de
        tomar — significa que não sabemos. É um sinal diferente de “não tomou”, e
        costuma pedir busca ativa.
      </div>

      {evolucao.length > 0 && evolucao.some((s) => s.esperadas > 0) && (
        <div className="adesao-bloco">
          <strong>Evolução</strong>
          <div className="evolucao">
            {evolucao.map((s) => (
              <div className="evolucao-col" key={s.inicio}>
                <div className="evolucao-trilha">
                  <div
                    className={`evolucao-barra ${s.taxa != null && s.taxa < 60 ? "baixa" : "boa"}`}
                    style={{ height: `${s.taxa ?? 0}%` }}
                  />
                </div>
                <div className="evolucao-valor">{s.taxa != null ? `${s.taxa}%` : "—"}</div>
                <div className="evolucao-rotulo">{s.rotulo}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {falhas?.porHorario?.length > 0 && (
        <div className="adesao-bloco">
          <strong>Onde o tratamento falha</strong>
          <div className="grid-2">
            <div>
              <div className="small">Por horário</div>
              {falhas.porHorario.map((h) => (
                <LinhaHorario key={h.horario} h={h} />
              ))}
            </div>
            <div>
              <div className="small">Por dia da semana</div>
              {falhas.porDiaSemana.map((d) => (
                <LinhaFalha key={d.dia} rotulo={d.dia} falhas={d.falhas} total={d.total} />
              ))}
            </div>
          </div>
          <div className="small">
            Por horário, a barra mostra <strong>recusa</strong> e{" "}
            <strong>silêncio</strong> sobre as doses esperadas — um horário em que o
            paciente parou de responder é tão relevante quanto um em que ele
            disse que não tomou. Por dia da semana, só as doses respondidas.
          </div>
        </div>
      )}

      {respostas.length > 0 && (
        <details className="adesao-historico">
          <summary>Ver todas as respostas ({respostas.length})</summary>
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Medicação</th>
                  <th>Horário</th>
                  <th>Resposta</th>
                </tr>
              </thead>
              <tbody>
                {respostas.map((r) => {
                  const info = RESPOSTA[r.resposta] || {};
                  return (
                    <tr key={r.id}>
                      <td>{formatarDataHora(r.createdAt)}</td>
                      <td>{r.medicationName}</td>
                      <td>{r.scheduleTime || "—"}</td>
                      <td className={`resposta-${info.tipo || ""}`}>
                        {info.icone} {info.label || r.resposta}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

function LinhaHorario({ h }) {
  const base = h.esperadas || h.respondidas || 1;
  const pctRecusa = Math.round((h.falhas / base) * 100);
  const pctSilencio = Math.round((h.semResposta / base) * 100);
  return (
    <div className="falha-linha">
      <span className="falha-rotulo">{h.horario}</span>
      <span className="falha-trilha" title={`${h.falhas} recusadas, ${h.semResposta} sem resposta, de ${h.esperadas} esperadas`}>
        <span className="falha-barra" style={{ width: `${pctRecusa}%` }} />
        <span className="falha-barra silencio" style={{ width: `${pctSilencio}%` }} />
      </span>
      <span className="falha-valor">
        {h.falhas + h.semResposta}/{h.esperadas || h.respondidas}
      </span>
    </div>
  );
}

function LinhaFalha({ rotulo, falhas, total }) {
  const pct = total ? Math.round((falhas / total) * 100) : 0;
  return (
    <div className="falha-linha">
      <span className="falha-rotulo">{rotulo}</span>
      <span className="falha-trilha">
        <span className="falha-barra" style={{ width: `${pct}%` }} />
      </span>
      <span className="falha-valor">
        {falhas}/{total}
      </span>
    </div>
  );
}

function formatarDataHora(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
