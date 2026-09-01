import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import { ROTULO, STATUS, ordenarFila, PRAZO_OFERTA_MINUTOS } from "./status.js";
import { UNIDADE, DATA_EXIBIDA, CONSULTAS, FILA, HISTORICO, RESUMO } from "./dados.js";

// [AGENDA-UBS] MAQUETE — módulo de redução de faltas e reaproveitamento de vagas.
//
// Esta tela usa dados fixos e não conversa com o backend. Está no painel de
// propósito: mostra a visão do produto dentro do produto real, em vez de um
// slide. O aviso no topo é parte do design, não enfeite — apresentar maquete
// como se fosse sistema pronto é o tipo de coisa que destrói confiança numa
// reunião com Secretaria de Saúde.
//
// A regra de negócio (status.js) é código real e testado, e sobrevive para a
// implementação. O que é maquete aqui é a tela e os dados.
export default function AgendaUbsPage() {
  const [aba, setAba] = useState("agenda");
  const fila = useMemo(() => ordenarFila(FILA), []);

  return (
    <>
      <PageHeader
        title="Agenda da unidade"
        subtitle={`${UNIDADE.nome} · ${UNIDADE.municipio} · ${DATA_EXIBIDA}`}
      />

      <div className="maquete-aviso">
        <strong>Prévia — em desenvolvimento.</strong> Esta tela ilustra o módulo
        de agenda com dados fictícios e não está conectada ao sistema. Os
        pacientes, horários e ações abaixo são exemplos.
      </div>

      <div className="stats">
        <Indicador valor={RESUMO.agendadas} rotulo="Consultas hoje" />
        <Indicador valor={RESUMO.confirmadas} rotulo="Confirmadas" />
        <Indicador valor={RESUMO.presentes} rotulo="Presentes na UBS" />
        <Indicador valor={RESUMO.vagasLiberadas} rotulo="Vagas liberadas" destaque />
      </div>

      <div className="card">
        <div className="consultas-tabs">
          {[
            ["agenda", `Agenda do dia (${CONSULTAS.length})`],
            ["fila", `Fila de espera (${fila.length})`],
            ["historico", "Histórico de ações"],
          ].map(([id, texto]) => (
            <button
              key={id}
              className={aba === id ? "consultas-tab active" : "consultas-tab"}
              onClick={() => setAba(id)}
            >
              {texto}
            </button>
          ))}
        </div>

        {aba === "agenda" && <Agenda />}
        {aba === "fila" && <Fila fila={fila} />}
        {aba === "historico" && <Historico />}
      </div>

      <div className="card">
        <h3>Como o reaproveitamento funciona</h3>
        <div className="card-subtitle">
          A decisão de desenho que não estava na especificação, e que a
          coordenação vai perguntar.
        </div>
        <div className="fluxo-oferta">
          <Passo n="1" titulo="Paciente cancela">
            A confirmação de 48h recebe “não poderei comparecer”. A vaga é
            liberada automaticamente.
          </Passo>
          <Passo n="2" titulo="Uma oferta por vez">
            A IA convida <strong>uma</strong> pessoa da fila, com prazo de{" "}
            {PRAZO_OFERTA_MINUTOS} minutos — nunca várias ao mesmo tempo.
          </Passo>
          <Passo n="3" titulo="Sem resposta, passa adiante">
            Expirado o prazo, a vaga volta à fila e vai para a próxima pessoa.
            Quem já recusou não é convidado de novo.
          </Passo>
          <Passo n="4" titulo="Só então preenche">
            A vaga é ocupada apenas após o aceite. Nunca há duas pessoas
            marcadas no mesmo horário.
          </Passo>
        </div>
        <div className="calc-aviso">
          Ofertar para várias pessoas de uma vez preencheria a vaga mais rápido,
          mas daria calote em quem já tivesse se organizado para ir. Numa UBS,
          isso custa mais do que a vaga vale.
        </div>
      </div>

      <div className="card">
        <h3>O que a coordenação controla</h3>
        <ul className="lista-controles">
          <li>Cancelar, remarcar e fazer encaixe manual</li>
          <li>Escolher manualmente quem recebe a vaga, ignorando a ordem da fila</li>
          <li>Ver quem recebeu oferta, quem aceitou e quem recusou</li>
          <li>Desfazer qualquer ação automática da IA</li>
          <li>Disponibilizar ou bloquear horários</li>
        </ul>
        <div className="calc-aviso">
          A IA executa; a decisão final é sempre da equipe da unidade. Toda ação
          automática fica registrada no histórico, identificada como tal.
        </div>
      </div>
    </>
  );
}

function Agenda() {
  return (
    <div className="tabela-wrap">
      <table className="tabela">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Paciente</th>
            <th>Especialidade</th>
            <th>Situação</th>
            <th>Origem</th>
          </tr>
        </thead>
        <tbody>
          {CONSULTAS.map((c) => (
            <tr key={c.id}>
              <td className="col-hora">{c.hora}</td>
              <td>
                <div>{c.paciente}</div>
                {c.idade && <div className="texto-fraco">{c.idade} anos</div>}
                {c.canceladaPor && <div className="texto-fraco">{c.canceladaPor}</div>}
                {c.ofertadaPara && (
                  <div className="oferta-inline">
                    Oferecida a <strong>{c.ofertadaPara}</strong> · expira {c.ofertaExpiraEm}
                  </div>
                )}
                {c.observacao && <div className="texto-fraco">{c.observacao}</div>}
              </td>
              <td>{c.especialidade}</td>
              <td>
                <Situacao status={c.status} />
                {c.confirmadaEm && <div className="texto-fraco">{c.confirmadaEm}</div>}
              </td>
              <td>
                <Origem origem={c.origem} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Fila({ fila }) {
  return (
    <>
      <div className="card-subtitle">
        Ordenada por prioridade clínica e, dentro dela, por tempo de espera.
      </div>
      <div className="tabela-wrap">
        <table className="tabela">
          <thead>
            <tr>
              <th>#</th>
              <th>Paciente</th>
              <th>Especialidade</th>
              <th>Prioridade</th>
              <th>Esperando desde</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {fila.map((p, i) => (
              <tr key={p.id}>
                <td className="col-hora">{i + 1}</td>
                <td>
                  <div>{p.nome}</div>
                  <div className="texto-fraco">{p.idade} anos</div>
                </td>
                <td>{p.especialidade}</td>
                <td>
                  <span className={`prioridade prioridade-${p.prioridade}`}>
                    {p.prioridade}
                  </span>
                </td>
                <td>{new Date(p.esperandoDesde).toLocaleDateString("pt-BR")}</td>
                <td>
                  {p.situacao === "convidada" ? (
                    <span className="situacao situacao-espera">Convite enviado</span>
                  ) : (
                    <span className="texto-fraco">Aguardando</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Historico() {
  return (
    <>
      <div className="card-subtitle">
        Toda ação automática fica identificada. A coordenação pode desfazer
        qualquer uma.
      </div>
      <ul className="timeline">
        {HISTORICO.map((h, i) => (
          <li key={i}>
            <span className="tl-icone">{h.autor === "ia" ? "🤖" : "👤"}</span>
            <div>
              <div className="tl-titulo">{h.acao}</div>
              <div className="tl-detalhe">{h.detalhe}</div>
              <div className="tl-quando">
                {h.hora} · {h.autor === "ia" ? "automático" : "equipe da unidade"}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function Situacao({ status }) {
  const r = ROTULO[status] || { texto: status, tom: "neutro" };
  return <span className={`situacao situacao-${r.tom}`}>{r.texto}</span>;
}

function Origem({ origem }) {
  return origem === "ia" ? (
    <span className="origem origem-ia">🤖 IA</span>
  ) : (
    <span className="origem origem-equipe">👤 Equipe</span>
  );
}

function Indicador({ valor, rotulo, destaque }) {
  return (
    <div className={destaque ? "stat-card stat-destaque" : "stat-card"}>
      <div className="stat-valor">{valor}</div>
      <div className="stat-rotulo">{rotulo}</div>
    </div>
  );
}

function Passo({ n, titulo, children }) {
  return (
    <div className="passo-oferta">
      <div className="passo-oferta-num">{n}</div>
      <div>
        <div className="passo-oferta-titulo">{titulo}</div>
        <div className="passo-oferta-texto">{children}</div>
      </div>
    </div>
  );
}

// Estado não usado na maquete, mas exportado para a implementação futura.
export { STATUS };
