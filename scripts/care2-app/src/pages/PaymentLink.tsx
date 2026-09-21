import { useEffect, useMemo, useState, type ReactNode } from "react";
import { api, errorText } from "../api";
import { Button, Logo, Notice, Segmented, Surface } from "../ui";
import { Checkout, type CheckoutRoutes, type Cycle, type PaymentConfig, type SalePlan, unidade } from "./Plans";

type PublicConfig = PaymentConfig & { nome?: string; usado?: boolean };

export default function PaymentLink() {
  const token = location.pathname.split("/pagar/")[1]?.split("/")[0] ?? "";
  const root = `/assinatura/whatsapp/${encodeURIComponent(token)}`;
  const routes = useMemo<CheckoutRoutes>(() => ({ coupon: `${root}/cupom`, card: `${root}/cartao`, pix: `${root}/pix`, pixStatus: (id) => `${root}/pix/${encodeURIComponent(id)}` }), [root]);
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [cycle, setCycle] = useState<Cycle>("mensal");
  const [buying, setBuying] = useState<SalePlan | null>(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Pagamento seguro — Vytal Care";
    api<PublicConfig>(root, { authenticated: false }).then(setConfig).catch((e) => setError(errorText(e)));
  }, [root]);

  if (completed) return <PublicShell><Surface><h2>Pagamento concluído</h2><Notice tone="ok">Seu plano foi atualizado. Você pode voltar ao WhatsApp.</Notice><Button className="big" icon="check" onClick={() => { location.href = "/vytal-care2/app/conta"; }}>Abrir minha conta</Button></Surface></PublicShell>;
  return <PublicShell>
    <div className="stack" style={{ width: "100%", maxWidth: 620 }}>
      <div><span className="eyebrow">PAGAMENTO SEGURO</span><h1 style={{ marginBottom: 8 }}>Continue cuidando de quem importa.</h1><p className="muted">{config?.nome ? `${config.nome.split(/\s+/)[0]}, escolha` : "Escolha"} o plano e pague por Pix ou cartão.</p></div>
      {error && <Surface><Notice tone="error">{error}</Notice><p className="muted small">Volte ao WhatsApp e envie <b>PAGAR</b> para receber um link novo.</p></Surface>}
      {config?.usado && <Surface><Notice tone="warn">Este link já foi usado. Volte ao WhatsApp e envie <b>PAGAR</b> para gerar outro.</Notice></Surface>}
      {config && !config.disponivel && <Surface><Notice tone="warn">O pagamento está temporariamente indisponível. Tente novamente em instantes.</Notice></Surface>}
      {config?.disponivel && !config.usado && <>
        <Segmented label="Período" value={cycle} onChange={setCycle} options={[{ value: "mensal", label: "Mensal" }, { value: "anual", label: "Anual, 15% de desconto" }]} />
        {config.planos.map((plan) => <Surface key={plan.id}>
          <div className="row between wrap"><div className="grow" style={{ minWidth: 210 }}><h2>{plan.nome}</h2><p className="muted">{unidade(plan.limitePacientes, true)} · {plan.descricao}</p></div><div className="stack" style={{ alignItems: "flex-end" }}><b className="round tnum" style={{ fontSize: 22 }}>{cycle === "anual" ? plan.precoAnual : plan.preco}<span className="muted small"> {cycle === "anual" ? "/ano" : "/mês"}</span></b><Button onClick={() => setBuying(plan)}>Escolher</Button></div></div>
        </Surface>)}
        <p className="muted small">O cartão é processado diretamente pela Pagar.me. A Vytal não recebe nem guarda o número do cartão.</p>
      </>}
    </div>
    {buying && config?.publicKey && <Checkout plan={buying} cycle={cycle} publicKey={config.publicKey} routes={routes} authenticated={false} onClose={(done) => { setBuying(null); if (done) { history.replaceState(null, "", "/vytal-care2/app/"); setCompleted(true); } }} />}
  </PublicShell>;
}

function PublicShell({ children }: { children: ReactNode }) {
  return <div className="login" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}><div className="stack" style={{ width: "100%", alignItems: "center" }}><div className="row"><Logo size={48} tile /><span className="round" style={{ fontSize: 24 }}>Vytal Care</span></div>{children}</div></div>;
}
