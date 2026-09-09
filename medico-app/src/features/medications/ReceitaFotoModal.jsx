import { useState, useRef } from "react";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import TimesEditor from "../../components/TimesEditor.jsx";
import { Loading } from "../../components/Loading.jsx";
import { api } from "../../lib/api.js";
import {
  expandPosologia,
  serializeScheduleTimes,
  endDateFromDuration,
} from "../../lib/schedule.js";
import { useCreateMedication } from "./api.js";
import CameraReceita from "./CameraReceita.jsx";

// [RECEITA-FOTO] Fotografa a receita, confere, salva.
//
// [SO-IMPRESSA] Só receita IMPRESSA. Manuscrita é recusada pelo servidor, e
// a tela avisa disso ANTES da foto — descobrir a regra depois de fotografar
// é gastar o tempo de quem está com o paciente na frente.
//
// A tela é deliberadamente de CONFERÊNCIA, não de importação. Nada é salvo
// pela leitura: cada medicação vira um formulário preenchido que a pessoa
// revisa e confirma uma a uma.
//
// Parece mais trabalho que "importar tudo", e é — de propósito. Um botão
// "importar todas" faz a pessoa clicar sem ler, e o erro que passa vira
// lembrete diário instruindo alguém a tomar a dose errada. O ganho da foto
// é não digitar; conferir continua sendo humano.
function formatarDataBR(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

export default function ReceitaFotoModal({ open, onClose, phone, patientName }) {
  const [etapa, setEtapa] = useState("foto"); // foto | camera | lendo | conferir
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState("");
  // Recusa por manuscrita não é erro de uso — é o sistema funcionando. Ela
  // aparece diferente de "a foto ficou ruim", porque a ação é outra: numa
  // vale tentar de novo, na outra vale digitar.
  const [recusadaManuscrita, setRecusadaManuscrita] = useState(false);
  const galeriaRef = useRef(null);
  const pdfRef = useRef(null);
  const criar = useCreateMedication(phone);

  function aoEscolherArquivo(e) {
    const file = e.target.files?.[0];
    // Limpa o valor: escolher o MESMO arquivo duas vezes seguidas não
    // dispara change de novo, e a tela ficaria parada sem explicação.
    e.target.value = "";
    if (file) lerArquivo(file);
  }

  async function lerArquivo(file) {
    setErro("");

    // PDF entra porque receita eletrônica chega assim, por e-mail, e nunca é
    // impressa. Fotografar a tela do computador é o que se fazia antes — e é
    // a pior foto possível: reflexo, moiré, foco no vidro.
    const ACEITOS = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!ACEITOS.includes(file.type)) {
      setErro("Envie uma foto (JPG, PNG, WEBP) ou um PDF da receita.");
      return;
    }

    setEtapa("lendo");
    setRecusadaManuscrita(false);
    try {
      const base64 = await paraBase64(file);
      const r = await api.post("/prescricoes/ler", {
        imagemBase64: base64,
        mediaType: file.type,
      });
      setItens(
        r.itens.map((i) => ({
          ...i,
          incluir: !i.usoCondicional, // condicional entra desmarcado
          times: i.presetSugerido ? expandPosologia("08:00", i.presetSugerido) : [""],
          // [DURACAO] Vem preenchida quando a receita diz; fica em branco
          // quando não diz, e aí é obrigatório escolher. Nenhum default é
          // seguro: assumir contínuo faz o antibiótico lembrar para sempre;
          // assumir um prazo cala em silêncio o remédio de pressão.
          duracaoModo: i.usoContinuo ? "continuo" : i.duracaoDias ? "dias" : "",
          duracaoDias: i.duracaoDias ? String(i.duracaoDias) : "",
          salvo: false,
          erroSalvar: "",
        }))
      );
      setEtapa("conferir");
    } catch (err) {
      // O servidor marca a recusa por manuscrita; qualquer outra falha é
      // problema de leitura e pede outra foto.
      // ApiError expõe o corpo em `body` (ver lib/api.js), não em `data`.
      if (err?.body?.manuscrita) {
        setRecusadaManuscrita(true);
      }
      setErro(err.message);
      setEtapa("foto");
    }
  }

  function atualiza(idx, campo, valor) {
    setItens((lista) =>
      lista.map((it, i) => (i === idx ? { ...it, [campo]: valor } : it))
    );
  }

  async function salvarTudo() {
    setErro("");
    const paraSalvar = itens
      .map((it, idx) => ({ it, idx }))
      .filter(({ it }) => it.incluir && !it.salvo);

    if (!paraSalvar.length) {
      setErro("Marque ao menos uma medicação para adicionar.");
      return;
    }

    for (const { it, idx } of paraSalvar) {
      if (!it.medicationName.trim() || !it.dose.trim() || !serializeScheduleTimes(it.times)) {
        atualiza(idx, "erroSalvar", "Preencha nome, dose e ao menos um horário.");
        continue;
      }
      // Sem duração o lembrete não sabe parar. Bloquear aqui é o que evita
      // um antibiótico de 7 dias tocando pelo resto do ano.
      const dias = Number(it.duracaoDias);
      if (it.duracaoModo !== "continuo" && !(dias > 0)) {
        atualiza(idx, "erroSalvar", "Informe por quantos dias, ou marque uso contínuo.");
        continue;
      }
      const inicio = new Date().toISOString().slice(0, 10);
      try {
        await criar.mutateAsync({
          patientName,
          medicationName: it.medicationName,
          dose: it.dose,
          times: it.times,
          startDate: inicio,
          // Uso contínuo é ausência de fim — é o que o banco e o cron
          // entendem por "não para".
          endDate: it.duracaoModo === "continuo" ? "" : endDateFromDuration(inicio, dias),
          instructions: it.instructions,
        });
        atualiza(idx, "salvo", true);
        atualiza(idx, "erroSalvar", "");
      } catch (err) {
        atualiza(idx, "erroSalvar", err.message);
      }
    }
  }

  const pendentes = itens.filter((i) => i.incluir && !i.salvo).length;
  const salvos = itens.filter((i) => i.salvo).length;

  return (
    <Modal open={open} title="Adicionar pela foto da receita" onClose={() => onClose(salvos > 0)} wide>
      {etapa === "foto" && (
        <>
          <div className="modal-warning">
            🖨️ <strong>Apenas receita impressa.</strong> Receita escrita à mão não é
            aceita: a leitura automática erra dose em letra manuscrita, e o erro
            não parece erro. Nesses casos, cadastre pelo formulário normal.
          </div>

          <div className="modal-context">
            📷 Fotografe a receita inteira, com boa luz e sem sombra. A leitura{" "}
            <strong>preenche o formulário</strong> — nada é salvo antes de você conferir.
          </div>
          {/* Três caminhos explícitos, no lugar de um seletor de arquivo
              cru. O "Escolher Arquivo / nenhum arquivo selecionado" do
              navegador não diz que aceita PDF, não abre a câmera com guia, e
              no celular fica com cara de formulário quebrado. */}
          <div className="receita-acoes">
            <button type="button" className="primary" onClick={() => setEtapa("camera")}>
              Fotografar receita
            </button>
            <button type="button" onClick={() => galeriaRef.current?.click()}>
              Escolher da galeria
            </button>
            <button type="button" onClick={() => pdfRef.current?.click()}>
              Enviar PDF
            </button>
          </div>

          {/* Dois inputs escondidos: a galeria filtra imagem, o outro filtra
              PDF. Um só, aceitando tudo, faria o seletor do celular abrir na
              aba errada. */}
          <input
            ref={galeriaRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={aoEscolherArquivo}
          />
          <input
            ref={pdfRef}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={aoEscolherArquivo}
          />

          <div className="small">
            A foto não é armazenada. Ela é usada para ler e descartada em seguida.
          </div>
          {recusadaManuscrita ? (
            <div className="modal-warning">
              ✋ {erro}
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="primary btn-compacto"
                  onClick={() => onClose(false)}
                >
                  Cadastrar manualmente
                </button>
              </div>
            </div>
          ) : (
            <Message type="error">{erro}</Message>
          )}
        </>
      )}

      {etapa === "camera" && (
        <CameraReceita
          aoCancelar={() => setEtapa("foto")}
          aoCapturar={(arquivo) => lerArquivo(arquivo)}
        />
      )}

      {etapa === "lendo" && <Loading label="Lendo a receita..." />}

      {etapa === "conferir" && (
        <>
          <div className="modal-warning">
            ⚠️ <strong>Confira cada item antes de adicionar.</strong> A leitura
            automática erra, e dose errada vira lembrete errado para o paciente.
          </div>

          {itens.map((it, idx) => (
            <div key={idx} className={it.salvo ? "receita-item salvo" : "receita-item"}>
              <label className="checkbox-linha">
                <input
                  type="checkbox"
                  checked={it.incluir}
                  disabled={it.salvo}
                  onChange={(e) => atualiza(idx, "incluir", e.target.checked)}
                />
                <span>
                  <strong>{it.medicationName || "(nome não lido)"}</strong>
                  {it.salvo && <span className="texto-sucesso"> · adicionada</span>}
                </span>
              </label>

              {/* O que o módulo não conseguiu ler aparece nomeado, e não como
                  aviso genérico: dizer ONDE olhar é o que salva a conferência
                  de seis medicações. */}
              {it.precisaRevisao && !it.salvo && (
                <div className="receita-motivos">
                  {it.motivos.map((m) => (
                    <div key={m}>⚠ {m}</div>
                  ))}
                </div>
              )}

              {it.incluir && !it.salvo && (
                <>
                  <div className="grid-2">
                    <div>
                      <label>Medicação</label>
                      <input
                        value={it.medicationName}
                        onChange={(e) => atualiza(idx, "medicationName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Dose</label>
                      <input
                        value={it.dose}
                        onChange={(e) => atualiza(idx, "dose", e.target.value)}
                      />
                    </div>
                  </div>

                  {it.posologiaTexto && (
                    <div className="small">
                      Na receita: <strong>“{it.posologiaTexto}”</strong>
                    </div>
                  )}

                  <label>Horários</label>
                  <TimesEditor times={it.times} onChange={(t) => atualiza(idx, "times", t)} />

                  <label>Duração do tratamento</label>
                  {it.duracaoTexto && (
                    <div className="small">
                      Na receita: <strong>“{it.duracaoTexto}”</strong>
                    </div>
                  )}
                  <div className="duracao-linha">
                    <label className="duracao-opcao">
                      <input
                        type="radio"
                        name={`duracao-${idx}`}
                        checked={it.duracaoModo === "continuo"}
                        onChange={() => atualiza(idx, "duracaoModo", "continuo")}
                      />
                      Uso contínuo
                    </label>
                    <label className="duracao-opcao">
                      <input
                        type="radio"
                        name={`duracao-${idx}`}
                        checked={it.duracaoModo === "dias"}
                        onChange={() => atualiza(idx, "duracaoModo", "dias")}
                      />
                      Por
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="duracao-dias"
                      aria-label="Quantidade de dias"
                      value={it.duracaoDias}
                      onChange={(e) => {
                        atualiza(idx, "duracaoDias", e.target.value);
                        if (e.target.value) atualiza(idx, "duracaoModo", "dias");
                      }}
                    />
                    <span>dias</span>
                  </div>
                  {!it.duracaoModo && (
                    <div className="small texto-alerta">
                      A receita não diz por quanto tempo. Escolha uma das duas — sem isso
                      o lembrete não sabe quando parar.
                    </div>
                  )}
                  {it.duracaoModo === "dias" && Number(it.duracaoDias) > 0 && (
                    <div className="small">
                      Os lembretes terminam em{" "}
                      <strong>
                        {formatarDataBR(
                          endDateFromDuration(
                            new Date().toISOString().slice(0, 10),
                            Number(it.duracaoDias)
                          )
                        )}
                      </strong>
                      .
                    </div>
                  )}

                  <label>Orientações ao paciente</label>
                  <textarea
                    value={it.instructions}
                    onChange={(e) => atualiza(idx, "instructions", e.target.value)}
                  />

                  <Message type="error">{it.erroSalvar}</Message>
                </>
              )}
            </div>
          ))}

          <Message type="error">{erro}</Message>

          <div className="modal-actions">
            <button type="button" className="btn-secondary-outline" onClick={() => onClose(salvos > 0)}>
              {salvos > 0 ? "Concluir" : "Cancelar"}
            </button>
            <button
              className="primary"
              disabled={criar.isPending || !pendentes}
              onClick={salvarTudo}
            >
              {criar.isPending
                ? "Adicionando..."
                : `Adicionar ${pendentes} ${pendentes === 1 ? "medicação" : "medicações"}`}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

function paraBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("Não consegui ler o arquivo."));
    reader.readAsDataURL(file);
  });
}
