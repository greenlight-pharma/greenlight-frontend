import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../lib/api.js";

// [AVISO-DE-CONFIRMACAO] Faixa que aparece enquanto o e-mail não foi
// confirmado. Ela diz o que está bloqueado — cadastrar paciente — em vez de
// pedir a confirmação sem motivo: aviso que não explica a consequência é
// ignorado, e aí o médico só descobre o bloqueio no meio do atendimento.
//
// Some sozinha quando o servidor diz que não há pendência (conta antiga,
// entrada pelo Google, ou servidor sem envio de e-mail configurado).
export default function AvisoEmail() {
  const [recado, setRecado] = useState("");

  const estado = useQuery({
    queryKey: ["email-estado"],
    queryFn: () => api.get("/auth/email/estado"),
    // O médico confirma no celular e volta para esta aba. Reconsultar ao
    // focar a janela evita que ele precise recarregar para a faixa sumir.
    refetchOnWindowFocus: true,
    retry: false,
  });

  const reenviar = useMutation({
    mutationFn: () => api.post("/auth/email/reenviar", {}),
    onSuccess: () => setRecado("E-mail enviado. Confira também a caixa de spam."),
    onError: (e) => setRecado(e.message),
  });

  if (!estado.data?.confirmacaoPendente) return null;

  return (
    <div className="aviso-email" role="status">
      <div>
        <strong>Confirme seu e-mail.</strong>{" "}
        Enviamos um link para <b>{estado.data.email || "o e-mail da sua conta"}</b>.
        Enquanto ele não for confirmado, esta conta não cadastra pacientes novos —
        cadastrar dispara mensagem de WhatsApp para o número do paciente.
        {recado ? <div className="aviso-email-recado">{recado}</div> : null}
      </div>
      <div className="aviso-email-acoes">
        <button
          type="button"
          className="aviso-email-botao"
          onClick={() => estado.refetch()}
          disabled={estado.isFetching}
        >
          Já confirmei
        </button>
        <button
          type="button"
          className="aviso-email-botao"
          onClick={() => reenviar.mutate()}
          disabled={reenviar.isPending}
        >
          {reenviar.isPending ? "Enviando..." : "Reenviar"}
        </button>
      </div>
    </div>
  );
}
