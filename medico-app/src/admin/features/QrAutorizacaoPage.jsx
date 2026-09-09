import { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import PageHeader from "../../components/PageHeader.jsx";
import {
  montarCartazPdf,
  nomeDoArquivo,
  carregarLogoDataUrl,
} from "./cartazPdf.js";

// [QR-AUTORIZACAO] Gera o cartaz que fica no balcão da UBS.
//
// O fluxo que ele resolve: o paciente sai da consulta com a prescrição na
// mão, escaneia o código, o WhatsApp abre com o texto pronto e ele toca em
// enviar. Três coisas acontecem nesse toque:
//
//   1. Consentimento registrado — mensagem do número dele, com data e hora.
//      É a prova que a LGPD pede e o opt-in que a Meta exige.
//   2. Janela de 24h aberta — dá para conversar por texto livre na hora,
//      sem depender do template.
//   3. O número chega CERTO. Hoje alguém digita o telefone no cadastro e um
//      erro entre "11 9xxxx" e "11 xxxx" cria um paciente que nunca recebe
//      nada. Vindo do próprio WhatsApp, é impossível estar errado.
//
// O QR é gerado aqui no navegador, não por serviço externo: um gerador de
// terceiros veria para onde cada UBS está apontando, e a imagem sumiria no
// dia em que o serviço saísse do ar — com o cartaz já impresso na parede.
const NUMERO_PADRAO = "5512996527434";

// Precisa casar com extraiCodigoUnidade() no backend, que lê [ALGO] do
// texto: letras, números, espaço, hífen e underscore, até 31 caracteres.
function normalizaCodigo(v) {
  return String(v || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z0-9 _-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 31)
    .replace(/^[- ]+/, "");
}

function codigoDoNome(nome) {
  return normalizaCodigo(String(nome || "").trim().replace(/\s+/g, "-"));
}

export default function QrAutorizacaoPage() {
  const [unidade, setUnidade] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoTocado, setCodigoTocado] = useState(false);
  const [numero, setNumero] = useState(NUMERO_PADRAO);
  // Paisagem é o padrão porque é o formato de uso real: plastificado, em pé
  // no balcão. Retrato serve para quem vai colar em mural estreito.
  const [orientacao, setOrientacao] = useState("paisagem");
  const [svg, setSvg] = useState("");
  const [erro, setErro] = useState("");
  const [baixando, setBaixando] = useState(false);

  // Enquanto ninguém editar o código à mão, ele acompanha o nome. Assim o
  // caso comum é zero digitação, e quem precisa de outro código ainda pode.
  const codigoEfetivo = codigoTocado ? normalizaCodigo(codigo) : codigoDoNome(unidade);

  // [TEXTO-JURIDICO] Redação do advogado (Anexo II-B dos Termos), VERBATIM.
  // Não parafrasear: é a mensagem que o paciente envia do próprio número, e
  // é ela que serve de prova do consentimento informado.
  //
  // O código entre colchetes é NOSSO e continua obrigatório — é como a
  // coordenação sabe de qual unidade veio cada adesão. O backend o lê do
  // texto cru (extraiCodigoUnidade).
  //
  // ATENÇÃO: esta frase não contém a palavra "autorizo". O backend só a
  // reconhece porque "quero receber lembretes" foi acrescentada à lista de
  // AUTORIZACAO_FRASES. Mudar uma ponta sem a outra faz o sistema parar de
  // registrar autorizações em silêncio.
  const texto = useMemo(() => {
    const base =
      "Quero receber lembretes de medicação pelo WhatsApp. " +
      "Estou ciente sobre o aviso de privacidade e segurança do serviço. " +
      "Sei que os lembretes são complementares, não substituem orientação " +
      "do profissional de saúde e posso interromper o recebimento enviando PARAR.";
    return codigoEfetivo ? `${base} [${codigoEfetivo}]` : base;
  }, [codigoEfetivo]);

  const link = useMemo(() => {
    const so_digitos = String(numero || "").replace(/\D/g, "");
    return `https://wa.me/${so_digitos}?text=${encodeURIComponent(texto)}`;
  }, [numero, texto]);

  useEffect(() => {
    let vivo = true;
    QRCode.toString(link, {
      type: "svg",
      margin: 0,
      // [ECC] Correção de erro alta: o cartaz vai viver num balcão, com
      // dobra, café e luz ruim. Nível H tolera ~30% da imagem danificada e
      // custa só um código um pouco mais denso.
      errorCorrectionLevel: "H",
    })
      .then((s) => vivo && (setSvg(s), setErro("")))
      .catch((e) => vivo && setErro(e.message));
    return () => {
      vivo = false;
    };
  }, [link]);

  const numeroValido = String(numero).replace(/\D/g, "").length >= 12;

  // [PDF-EM-VEZ-DE-IMPRIMIR] Baixar o PDF é o caminho principal, e não um
  // extra: `window.print()` depende do diálogo do navegador, que ignora a
  // orientação pedida (Safari) ou lembra a escolha anterior do usuário
  // (Chrome). O cartaz saía em retrato e o layout paisagem era cortado.
  // O PDF sai igual em qualquer máquina e é o arquivo que a gráfica pede.
  async function baixarPdf() {
    setBaixando(true);
    setErro("");
    try {
      // jsPDF pesa ~390kB: só entra quando alguém pede o cartaz.
      const { jsPDF } = await import("jspdf");
      const qrDataUrl = await QRCode.toDataURL(link, {
        width: 1400, // ~14 px/mm no tamanho impresso: nítido depois de plastificado
        margin: 0,
        errorCorrectionLevel: "H",
      });
      const doc = montarCartazPdf({
        JsPDF: jsPDF,
        qrDataUrl,
        logoDataUrl: await carregarLogoDataUrl(
          `${import.meta.env.BASE_URL}vytalsaude.png`
        ),
        unidade,
        orientacao,
      });
      doc.save(nomeDoArquivo(unidade, orientacao));
    } catch (e) {
      setErro(e?.message || "não foi possível gerar o PDF");
    } finally {
      setBaixando(false);
    }
  }

  return (
    <>
      <PageHeader
        title="QR de autorização"
        subtitle="Cartaz para o balcão da UBS — o paciente escaneia e autoriza os lembretes"
      />

      <div className="card no-print">
        <div className="grid-2">
          <div>
            <label htmlFor="qrUnidade">Nome da unidade</label>
            <input
              id="qrUnidade"
              placeholder="UBS Jardim Oriente"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="qrCodigo">Código no texto</label>
            <input
              id="qrCodigo"
              placeholder="JD-ORIENTE"
              value={codigoEfetivo}
              onChange={(e) => {
                setCodigoTocado(true);
                setCodigo(e.target.value);
              }}
            />
            <div className="small">
              Identifica de qual unidade veio cada adesão. Um cartaz por UBS.
            </div>
          </div>
        </div>

        <label htmlFor="qrNumero">Número que recebe (WhatsApp oficial)</label>
        <input
          id="qrNumero"
          inputMode="numeric"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
        />
        {!numeroValido && (
          <div className="small texto-alerta">
            Número incompleto — use o formato 55 + DDD + número.
          </div>
        )}

        <label htmlFor="qrLink">Link gerado (para conferir antes de imprimir)</label>
        <input id="qrLink" readOnly value={link} onFocus={(e) => e.target.select()} />

        {erro && <div className="small texto-erro">Falha ao gerar o código: {erro}</div>}

        <label htmlFor="qrOrientacao">Formato da folha</label>
        <select
          id="qrOrientacao"
          value={orientacao}
          onChange={(e) => setOrientacao(e.target.value)}
        >
          <option value="paisagem">Paisagem — para plastificar e deixar no balcão</option>
          <option value="retrato">Retrato — para mural ou parede estreita</option>
        </select>

        <div className="modal-actions">
          <button
            className="primary"
            disabled={!svg || !numeroValido || baixando}
            onClick={baixarPdf}
          >
            {baixando ? "Gerando…" : "⬇️ Baixar cartaz em PDF"}
          </button>
          <button
            disabled={!svg || !numeroValido}
            onClick={() => window.print()}
          >
            🖨️ Imprimir direto
          </button>
        </div>
        <div className="small">
          Prefira o PDF: o “imprimir direto” depende do diálogo do navegador,
          que pode trocar a orientação da folha e cortar o cartaz. O PDF sai
          igual em qualquer máquina — e é o arquivo para mandar à gráfica.
        </div>

        <div className="modal-context">
          💡 Antes de mandar para a gráfica, teste com seu próprio celular: escaneie,
          envie, e confirme que a resposta automática chegou.
        </div>
      </div>

      {/* @page não aceita seletor de classe, então a orientação da folha
          precisa ser injetada como regra. Sem isso, o navegador imprime no
          padrão do sistema e o cartaz paisagem sai cortado ao meio. */}
      <style>{`@page { size: A4 ${orientacao}; margin: 10mm; }`}</style>

      <Cartaz svg={svg} unidade={unidade} orientacao={orientacao} />
    </>
  );
}

// O cartaz é o que sai na impressora. O texto NÃO é decoração: consentimento
// só é válido se for informado, e "informado" quer dizer que a pessoa sabia
// o que ia receber, com que frequência e como sair — antes de autorizar.
function Cartaz({ svg, unidade, orientacao = "retrato" }) {
  return (
    <div className={orientacao === "paisagem" ? "cartaz cartaz-paisagem" : "cartaz"}>
      <div className="cartaz-topo">
        <img src={`${import.meta.env.BASE_URL}vytalsaude.png`} alt="Vytal Saúde" />
        <div>
          <h2>Lembretes de medicação pelo WhatsApp</h2>
          <p>Ao continuar, você confirma que leu este aviso e deseja receber lembretes no WhatsApp.</p>
        </div>
      </div>

      <div className="cartaz-corpo">
        <div className="cartaz-qr">
          {svg ? (
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <div className="cartaz-qr-vazio">gerando…</div>
          )}
          <div className="cartaz-passos">
            <div><strong>1</strong> Aponte a câmera do celular para o código</div>
            <div><strong>2</strong> O WhatsApp abre com uma mensagem pronta</div>
            <div><strong>3</strong> Toque em <strong>enviar</strong> para autorizar</div>
          </div>
        </div>

        <div className="cartaz-info">
          {/* [TEXTO-JURIDICO] Anexo II-A dos Termos, VERBATIM. Este é o texto
              que o paciente lê ANTES de autorizar — é ele que torna o
              consentimento informado. Não reescrever para "caber melhor";
              se faltar espaço, diminua o QR. */}
          <section>
            <h3>O que é este serviço</h3>
            <p>
              Este serviço envia pelo WhatsApp lembretes sobre medicamentos, horários e
              orientações previamente definidos pelo seu profissional ou unidade de saúde.
              Ele é uma ferramenta complementar de organização da rotina e não substitui
              consulta, receita, orientação médica ou acompanhamento assistencial.
            </p>
          </section>

          <section>
            <h3>Não altere seu tratamento</h3>
            <p>
              Não inicie, interrompa, aumente, reduza ou altere medicamentos com base em
              uma mensagem, em um lembrete não recebido ou em informações do sistema. Em
              caso de dúvida sobre o seu tratamento, procure o profissional de saúde
              responsável. Em urgência ou emergência, procure imediatamente o serviço de
              saúde adequado.
            </p>
          </section>

          <section>
            <h3>Como parar</h3>
            <p>
              Ao enviar a mensagem de autorização, você escolhe receber lembretes pelo
              WhatsApp. Você pode parar de recebê-los a qualquer momento, enviando
              <strong> PARAR</strong>. O envio de novos lembretes por esse canal será
              bloqueado após o processamento da solicitação.
            </p>
          </section>

          <section>
            <h3>Seus dados</h3>
            <p>
              Os dados necessários à assistência são tratados pelo seu profissional ou
              unidade de saúde, conforme a legislação aplicável. A Vytal presta a
              tecnologia utilizada para organização e comunicação. Leia a Política de
              Privacidade em vytalsaude.com.br/privacidade-lembretes.
            </p>
          </section>
        </div>
      </div>

      <div className="cartaz-rodape">
        {unidade ? <strong>{unidade}</strong> : <strong>&nbsp;</strong>}
        <span>Vytal Saúde · autorização registrada no seu WhatsApp</span>
      </div>
    </div>
  );
}
