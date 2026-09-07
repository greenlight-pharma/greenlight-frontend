import { useState } from "react";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import TimesEditor from "../../components/TimesEditor.jsx";
import { Loading } from "../../components/Loading.jsx";
import { api } from "../../lib/api.js";
import { expandPosologia, serializeScheduleTimes } from "../../lib/schedule.js";
import { useCreateMedication } from "./api.js";

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
export default function ReceitaFotoModal({ open, onClose, phone, patientName }) {
  const [etapa, setEtapa] = useState("foto"); // foto | lendo | conferir
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState("");
  // Recusa por manuscrita não é erro de uso — é o sistema funcionando. Ela
  // aparece diferente de "a foto ficou ruim", porque a ação é outra: numa
  // vale tentar de novo, na outra vale digitar.
  const [recusadaManuscrita, setRecusadaManuscrita] = useState(false);
  const criar = useCreateMedication(phone);

  async function aoEscolherArquivo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErro("Use uma foto JPG, PNG ou WEBP.");
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
      try {
        await criar.mutateAsync({
          patientName,
          medicationName: it.medicationName,
          dose: it.dose,
          times: it.times,
          startDate: new Date().toISOString().slice(0, 10),
          endDate: "",
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
          {/* capture="environment" abre a câmera traseira no celular, que é
              onde isso vai ser usado de verdade: no balcão, com o papel na mão. */}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
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
