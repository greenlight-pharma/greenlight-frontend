import { useEffect, useRef, useState } from "react";
import Message from "../../components/Message.jsx";

// [CAMERA-COM-ENQUADRAMENTO] Câmera ao vivo com uma moldura na tela.
//
// O `<input capture>` abre a câmera do sistema, que não tem como mostrar
// guia nenhuma — a pessoa fotografa de qualquer jeito e a leitura erra por
// enquadramento, não por letra. Aqui a moldura tem a proporção de uma folha
// A4 em pé: encaixar o papel nela é a única instrução que precisa ser dada.
//
// Se a câmera não abrir (navegador antigo, permissão negada, contexto sem
// HTTPS), o componente avisa e o modal oferece os outros caminhos. Não
// insistir é melhor que travar quem só queria mandar um PDF.
const PROPORCAO_A4 = 297 / 210; // altura / largura

export default function CameraReceita({ aoCapturar, aoCancelar }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [erro, setErro] = useState("");
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErro(
          "Este navegador não abre a câmera aqui. Use “Escolher da galeria” ou envie o PDF."
        );
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          // A traseira é a que fotografa papel; a frontal é inútil aqui.
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } },
          audio: false,
        });
        if (cancelado) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setPronta(true);
      } catch (e) {
        setErro(
          e?.name === "NotAllowedError"
            ? "Permissão de câmera negada. Autorize nas configurações do navegador, ou use a galeria."
            : "Não consegui abrir a câmera. Use “Escolher da galeria” ou envie o PDF."
        );
      }
    })();

    // [DESLIGAR] Sem isso a luz da câmera fica acesa depois de fechar o
    // modal — o navegador só solta o dispositivo quando as trilhas param.
    return () => {
      cancelado = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  function capturar() {
    const video = videoRef.current;
    if (!video?.videoWidth) return;

    // Recorta exatamente o que está dentro da moldura. Mandar a imagem
    // inteira faria o modelo ler a mesa, o teclado e o que mais estiver em
    // volta — e é justamente o que a moldura existe para evitar.
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const larguraAlvo = Math.min(vw, vh / PROPORCAO_A4) * 0.92;
    const alturaAlvo = larguraAlvo * PROPORCAO_A4;
    const x = (vw - larguraAlvo) / 2;
    const y = (vh - alturaAlvo) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(larguraAlvo);
    canvas.height = Math.round(alturaAlvo);
    canvas
      .getContext("2d")
      .drawImage(video, x, y, larguraAlvo, alturaAlvo, 0, 0, canvas.width, canvas.height);

    // 0.9 de qualidade: texto de receita perde legibilidade antes de a
    // compressão economizar algo que importe.
    canvas.toBlob(
      (blob) => blob && aoCapturar(new File([blob], "receita.jpg", { type: "image/jpeg" })),
      "image/jpeg",
      0.9
    );
  }

  if (erro) {
    return (
      <div>
        <Message type="warning">{erro}</Message>
        <div className="modal-actions">
          <button type="button" onClick={aoCancelar}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="camera-palco">
        <video ref={videoRef} className="camera-video" playsInline muted />
        {/* A moldura é só desenho por cima do vídeo: quatro cantos e um
            escurecido em volta, que é o que faz o olho mirar no meio. */}
        <div className="camera-moldura" aria-hidden="true">
          <span className="canto ne" /><span className="canto no" />
          <span className="canto se" /><span className="canto so" />
        </div>
        <div className="camera-dica">Encaixe a receita inteira na moldura</div>
      </div>

      <div className="modal-actions">
        <button type="button" onClick={aoCancelar}>Cancelar</button>
        <button type="button" className="primary" onClick={capturar} disabled={!pronta}>
          {pronta ? "Fotografar" : "Abrindo câmera…"}
        </button>
      </div>
    </div>
  );
}
