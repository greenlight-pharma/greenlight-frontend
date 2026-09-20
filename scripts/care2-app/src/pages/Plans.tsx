import { useEffect, useState } from "react";
import { api, errorText } from "../api";
import { subscriptionDisplay, Schedule, UFS, type Expiry, type Plan, type Quota, type SubscriptionStatus } from "../models";
import { Button, Chip, Confirm, Dialog, Eyebrow, Field, Icon, Notice, Segmented, Surface, useLoad } from "../ui";

// [VENDA-NA-WEB] Cartão (assinatura que renova) ou Pix (período de 30 ou 365
// dias, sem renovação), pelo Pagar.me. O cartão vai DIRETO ao Pagar.me e vira
// um token; o servidor da Vytal só recebe o token. Só existe na web: o app iOS
// vende pela App Store e não cita este canal.
type SalePlan = Plan & { preco: string; precoCentavos?: number; precoAnual: string; precoAnualCentavos: number };
type Config = { disponivel: boolean; publicKey: string | null; planos: SalePlan[]; franquiaMensagensPorPaciente?: number };
type Cycle = "mensal" | "anual";
type Method = "cartao" | "pix";
type Coupon = { codigo: string; resumo: string; precoFinalTexto: string; precoOriginalTexto: string; cobrancas: number | null };
type PixOrder = { id: string; qrCode: string; qrCodeUrl?: string | null; expiraEm?: string | null; dias: number; valorCentavos?: number; teste?: boolean };
const CONTATO = "https://www.vytalsaude.com.br/vytal-care#contato";
const digits = (s: string) => s.replace(/\D/g, "");
/** [PESSOAL] Conta de família conta pessoas; a do profissional, pacientes. */
export const unidade = (n: number, pessoal?: boolean) => (pessoal ? (n === 1 ? "1 pessoa" : `${n} pessoas`) : n === 1 ? "1 paciente" : `${n} pacientes`);

export function PlanCard({ plan, onChanged }: { plan: SubscriptionStatus; onChanged: () => void }) {
  const [config, setConfig] = useState<Config | null>(null);
  const [buying, setBuying] = useState<SalePlan | null>(null);
  const [cycle, setCycle] = useState<Cycle>("mensal");
  const [canceling, setCanceling] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  useLoad(async (alive) => { try { const c = await api<Config>("/assinatura/web/config"); if (alive()) setConfig(c); } catch { /* sem venda: só mostra o plano */ } }, []);
  const used = plan.usados ?? 0, limit = plan.limite ?? plan.plano.limitePacientes;
  const pessoal = plan.tipoConta === "pessoal";
  const web = plan.web, apple = plan.assinatura;
  const {displayPlan,paidPlan,showTrialOffer,trialBonus,trialExpiry}=subscriptionDisplay(plan);
  // Assinatura de cartão em curso: não se assina outra por cima. Pix não renova, então pode pagar de novo.
  const webRunning = web && web.tipo !== "pix" && ["ativa", "em_atraso"].includes(web.status);
  const pixDays = web?.tipo === "pix" && web.acesso && web.expiraEm ? Math.ceil((new Date(web.expiraEm).getTime() - Date.now()) / 86400000) : null;
  async function cancel() { setBusy(true); try { await api("/assinatura/web", { method: "DELETE" }); setCanceling(false); onChanged(); } catch (e) { setError(errorText(e)); setCanceling(false); } setBusy(false); }
  return <Surface><Eyebrow>{pessoal&&paidPlan?"Plano contratado":"Seu plano"}</Eyebrow>
    <div className="row between wrap"><h2>{displayPlan.nome}</h2>{(web?.acesso || apple?.acesso) && <Chip tone={web?.status === "cancelada" ? "" : "ok"}>{web?.status === "cancelada" ? "Cancelada" : web?.tipo === "pix" ? "Pago por Pix" : "Assinatura ativa"}</Chip>}</div>
    {showTrialOffer && plan.teste && <Notice tone="info">{`Teste grátis até ${Schedule.dateTime(plan.teste.ate).slice(0, 10)}. Assine abaixo para os lembretes continuarem depois do teste.`}</Notice>}
    {pessoal&&paidPlan&&<p className="muted small">{`Seu plano pago acompanha ${unidade(paidPlan.limitePacientes,true)}.`}</p>}
    {trialBonus&&plan.teste&&<Notice tone="info">{`Benefício grátis: até ${plan.plano.limitePacientes} pessoas até ${Schedule.dateTime(plan.teste.ate).slice(0,10)}. Depois, vale o limite do plano ${paidPlan!.nome}.`}</Notice>}
    <div className="muted">{pessoal ? `${used} de ${unidade(limit, true)}` : `${used} de ${limit} pacientes`}</div><div className="meter"><div style={{ width: `${limit ? Math.min(100, (used / limit) * 100) : 0}%` }} /></div>
    {plan.franquia && <QuotaLine quota={plan.franquia} />}
    {plan.vencimento && <ExpiryNotice expiry={plan.vencimento} used={used} pessoal={pessoal} teste={trialExpiry} paidPlan={paidPlan?.nome} />}
    {web?.acesso && web.expiraEm && web.tipo !== "pix" && <div className="muted small">{web.status === "cancelada" ? "Cancelada. Acesso até" : web.status === "em_atraso" ? "Pagamento pendente. Acesso até" : "Renova até"} {Schedule.dateTime(web.expiraEm).slice(0, 10)}{web.cartaoFinal ? ` · cartão final ${web.cartaoFinal}` : ""}.</div>}
    {pixDays != null && web?.expiraEm && (pixDays <= 5
      ? <Notice tone="warn">{`O período pago por Pix vence em ${Schedule.dateTime(web.expiraEm).slice(0, 10)}. Pague de novo por Pix ou assine no cartão, que renova sozinho. Depois do vencimento há 7 dias de carência; em seguida, ${pessoal ? "os lembretes param" : "os lembretes dos pacientes acima do plano gratuito param"} até um novo pagamento.`}</Notice>
      : <div className="muted small">Pago por Pix. Acesso até {Schedule.dateTime(web.expiraEm).slice(0, 10)}.</div>)}
    {apple?.acesso && <div className="muted small">Assinatura feita pelo app do iPhone. A gestão dela fica na sua conta da App Store.</div>}
    <Notice>{error}</Notice>
    {config?.disponivel && !webRunning && !apple?.acesso && <div className="stack" style={{ gap: 8, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
      <Segmented label="Forma de pagamento" value={cycle} onChange={setCycle} options={[{ value: "mensal", label: "Mensal" }, { value: "anual", label: "Anual, 15% de desconto" }]} />
      {config.planos.filter((p) => pessoal || p.limitePacientes > plan.plano.limitePacientes || (web?.tipo === "pix" && web.acesso && p.id === plan.plano.id)).map((p) => <div key={p.id} className="row between wrap" style={{ background: "var(--bg)", borderRadius: 18, padding: 14 }}>
        <div className="grow" style={{ minWidth: 180 }}><b>{p.nome}</b><div className="muted small">{pessoal ? `${p.limitePacientes === 1 ? "1 pessoa" : `Até ${p.limitePacientes} pessoas`}. ` : `Até ${p.limitePacientes} pacientes. `}{p.descricao}</div></div>
        <div className="row"><span className="round tnum" style={{ fontSize: 18 }}>{cycle === "anual" ? p.precoAnual : p.preco}<span className="muted small" style={{ fontFamily: "inherit", fontWeight: 400 }}>{cycle === "anual" ? " /ano" : " /mês"}</span></span><Button onClick={() => setBuying(p)}>{p.id === displayPlan.id ? "Renovar" : "Assinar"}</Button></div></div>)}
      {!pessoal && <p className="muted small">Mais de 150 pacientes? <a href={CONTATO} target="_blank" rel="noreferrer">Fale com a Vytal</a> para um plano sob medida.</p>}
    </div>}
    {webRunning && <button className="link danger" style={{ alignSelf: "flex-start" }} onClick={() => setCanceling(true)}>Cancelar assinatura</button>}
    <p className="muted small">{pessoal ? "Cancele quando quiser. Sem plano, os lembretes param depois de 7 dias de carência; nada é apagado." : "Atingir o limite não interrompe nada: os pacientes atuais continuam recebendo os lembretes."}{webRunning ? " Para trocar de plano, cancele a assinatura atual e assine a nova." : ""}</p>
    {buying && config?.publicKey && <Checkout plan={buying} cycle={cycle} publicKey={config.publicKey} onClose={(done) => { setBuying(null); if (done) onChanged(); }} />}
    {canceling && <Confirm title="Cancelar assinatura?" message={pessoal ? "Não haverá novas cobranças. Seu plano continua valendo até o fim do período já pago. Depois disso há 7 dias de carência; em seguida, os lembretes param. Nada é apagado, e ao assinar de novo tudo volta." : "Não haverá novas cobranças. Seu plano continua valendo até o fim do período já pago. Depois disso há 7 dias de carência; em seguida, os lembretes dos pacientes acima do limite gratuito param (os mais antigos continuam). Nada é apagado, e ao assinar de novo tudo volta."} action="Cancelar assinatura" busy={busy} onCancel={() => setCanceling(false)} onConfirm={cancel} />}
  </Surface>;
}

function Checkout({ plan, cycle, publicKey, onClose }: { plan: SalePlan; cycle: Cycle; publicKey: string; onClose: (done: boolean) => void }) {
  const fullPrice = cycle === "anual" ? plan.precoAnual : plan.preco, per = cycle === "anual" ? "por ano" : "por mês";
  const [f, setF] = useState({ nome: "", cpf: "", celular: "", cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "", cartao: "", titular: "", validade: "", cvv: "" });
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null), [done, setDone] = useState(false);
  // Nenhuma forma escolhida no começo: o cliente toca em Cartão ou Pix e só então os campos aparecem.
  const [method, setMethod] = useState<Method | null>(null);
  const [pix, setPix] = useState<PixOrder | null>(null);
  const [until, setUntil] = useState<string | null>(null);
  // [CUPONS] O servidor confere de novo no pagamento; aqui é só a prévia do preço.
  const [couponOpen, setCouponOpen] = useState(false), [code, setCode] = useState(""), [coupon, setCoupon] = useState<Coupon | null>(null), [couponError, setCouponError] = useState<string | null>(null), [checking, setChecking] = useState(false);
  async function checkCoupon(codigo = code, metodo = method) {
    if (!codigo.trim()) return;
    setChecking(true); setCouponError(null);
    try { setCoupon(await api<Coupon>("/assinatura/web/cupom", { method: "POST", body: { cupom: codigo, planoId: plan.id, ciclo: cycle, metodo } })); }
    catch (err) { setCoupon(null); setCouponError(errorText(err)); } finally { setChecking(false); }
  }
  const price = coupon?.precoFinalTexto ?? fullPrice;
  // Cartão com desconto por algumas cobranças: diz quanto fica depois.
  const later = coupon && method === "cartao" && coupon.cobrancas ? ` ${coupon.cobrancas === 1 ? "Na primeira cobrança" : `Nas ${coupon.cobrancas} primeiras cobranças`}; depois, ${fullPrice} ${per}.` : "";
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  // CEP completo preenche rua, bairro, cidade e UF. É só ajuda: os campos continuam editáveis.
  async function cepBlur() { const cep = digits(f.cep); if (cep.length !== 8) return; try { const r = await (await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json(); if (!r.erro) setF((x) => ({ ...x, rua: x.rua || r.logradouro || "", bairro: x.bairro || r.bairro || "", cidade: x.cidade || r.localidade || "", uf: x.uf || r.uf || "" })); } catch { /* preenche à mão */ } }
  async function payPix() {
    setBusy(true); setError(null);
    try { setPix(await api<PixOrder>("/assinatura/web/pix", { method: "POST", body: { planoId: plan.id, ciclo: cycle, nome: f.nome, cpf: f.cpf, celular: f.celular, cupom: coupon?.codigo, metodo: "pix" } })); }
    catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  }
  async function pay(e: React.FormEvent) {
    e.preventDefault(); if (busy) return;
    if (method === "pix") return payPix();
    const val = digits(f.validade);
    if (val.length !== 4 && val.length !== 6) return setError("Validade no formato MM/AA.");
    const month = Number(val.slice(0, 2)), year = Number(val.length === 4 ? "20" + val.slice(2) : val.slice(2));
    if (month < 1 || month > 12) return setError("Validade no formato MM/AA.");
    setBusy(true); setError(null);
    try {
      // 1) cartão -> token, direto no Pagar.me (chave pública). O número nunca chega ao servidor da Vytal.
      const rt = await fetch(`https://api.pagar.me/core/v5/tokens?appId=${encodeURIComponent(publicKey)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "card", card: { number: digits(f.cartao), holder_name: f.titular.trim(), exp_month: month, exp_year: year, cvv: digits(f.cvv) } }) });
      const token = await rt.json().catch(() => ({}));
      if (!rt.ok || !token.id) throw new Error("Confira os dados do cartão.");
      // 2) assinatura no servidor da Vytal, só com o token.
      await api("/assinatura/web", { method: "POST", body: { planoId: plan.id, ciclo: cycle, cupom: coupon?.codigo, metodo: "cartao", cardToken: token.id, nome: f.nome, cpf: f.cpf, celular: f.celular, endereco: { cep: f.cep, rua: f.rua, numero: f.numero, complemento: f.complemento || undefined, bairro: f.bairro, cidade: f.cidade, uf: f.uf } } });
      setF((x) => ({ ...x, cartao: "", titular: "", validade: "", cvv: "" })); setDone(true);
    } catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  }
  if (done) return <Dialog title={until ? "Pagamento confirmado" : "Assinatura confirmada"} onClose={() => onClose(true)}><Notice tone="ok">{`Plano ${plan.nome} ativo${until ? ` até ${Schedule.dateTime(until).slice(0, 10)}` : ""}. ${plan.publico === "pessoal" ? `Os lembretes de ${unidade(plan.limitePacientes, true)} estão garantidos.` : `Você já pode acompanhar até ${plan.limitePacientes} pacientes.`}`}</Notice><Button className="big" icon="check" onClick={() => onClose(true)}>Concluir</Button></Dialog>;
  if (pix) return <PixPayment order={pix} planName={plan.nome} price={price} onPaid={(ate) => { setUntil(ate); setDone(true); }} onClose={() => onClose(false)} onRetry={() => setPix(null)} />;
  return <Dialog wide title={`Assinar ${plan.nome}`} eyebrow={`${price} ${per} · ${plan.publico === "pessoal" ? unidade(plan.limitePacientes, true) : `até ${plan.limitePacientes} pacientes`}`} onClose={() => onClose(false)} locked={busy}>
    <form className="stack" onSubmit={pay} autoComplete="on">
      <b>Como você quer pagar?</b>
      <div className="row pay-options" role="radiogroup" aria-label="Forma de pagamento">
        {([["cartao", "card", "Cartão de crédito", "Renova sozinho"], ["pix", "pix", "Pix", cycle === "anual" ? "Paga 12 meses de uma vez" : "Paga 30 dias por vez"]] as const).map(([valor, icone, titulo, dica]) =>
          <button key={valor} type="button" role="radio" aria-checked={method === valor} className={`option pay ${method === valor ? "on" : ""}`} onClick={() => { setMethod(valor); setError(null); if (coupon) void checkCoupon(coupon.codigo, valor); }}>
            <Icon name={icone} size={30} /><span style={{ fontWeight: 600, fontSize: 16 }}>{titulo}</span><span className="small" style={{ fontWeight: 400 }}>{dica}</span></button>)}
      </div>
      {method === null && <p className="muted small">Escolha uma opção para continuar.</p>}
      {method !== null && <>
      {method === "pix" && <p className="muted small">{`O Pix paga ${cycle === "anual" ? "12 meses" : "30 dias"} de uma vez e não renova sozinho. Perto do vencimento, você paga de novo ou passa para o cartão.`}</p>}
      <b>Seus dados</b>
      <Field label="Nome completo" autoComplete="name" required value={f.nome} onChange={set("nome")} />
      <div className="row wrap" style={{ alignItems: "flex-start" }}><div style={{ flex: "1 1 180px" }}><Field label="CPF" inputMode="numeric" required value={f.cpf} onChange={set("cpf")} placeholder="000.000.000-00" /></div><div style={{ flex: "1 1 180px" }}><Field label="Celular com DDD" inputMode="tel" autoComplete="tel-national" required value={f.celular} onChange={set("celular")} /></div></div>
      {method === "cartao" && <>
      <b>Endereço de cobrança</b>
      <div className="row wrap" style={{ alignItems: "flex-start" }}><div style={{ flex: "0 1 150px" }}><Field label="CEP" inputMode="numeric" autoComplete="postal-code" required value={f.cep} onChange={set("cep")} onBlur={cepBlur} /></div><div style={{ flex: "2 1 220px" }}><Field label="Rua" autoComplete="address-line1" required value={f.rua} onChange={set("rua")} /></div><div style={{ flex: "0 1 100px" }}><Field label="Número" required value={f.numero} onChange={set("numero")} /></div></div>
      <div className="row wrap" style={{ alignItems: "flex-start" }}><div style={{ flex: "1 1 140px" }}><Field label="Complemento" value={f.complemento} onChange={set("complemento")} /></div><div style={{ flex: "1 1 140px" }}><Field label="Bairro" required value={f.bairro} onChange={set("bairro")} /></div><div style={{ flex: "1 1 140px" }}><Field label="Cidade" autoComplete="address-level2" required value={f.cidade} onChange={set("cidade")} /></div>
        <label className="field" style={{ flex: "0 1 90px" }}><span>UF</span><select required value={f.uf} onChange={set("uf")}><option value="">UF</option>{UFS.map((u) => <option key={u}>{u}</option>)}</select></label></div>
      <b>Cartão de crédito</b>
      <Field label="Número do cartão" inputMode="numeric" autoComplete="cc-number" required value={f.cartao} onChange={set("cartao")} />
      <Field label="Nome impresso no cartão" autoComplete="cc-name" required value={f.titular} onChange={set("titular")} />
      <div className="row wrap" style={{ alignItems: "flex-start" }}><div style={{ flex: "1 1 120px" }}><Field label="Validade" placeholder="MM/AA" inputMode="numeric" autoComplete="cc-exp" required value={f.validade} onChange={set("validade")} /></div><div style={{ flex: "1 1 120px" }}><Field label="CVV" inputMode="numeric" autoComplete="cc-csc" required maxLength={4} value={f.cvv} onChange={set("cvv")} /></div></div>
      <div className="row muted small" style={{ alignItems: "flex-start" }}><Icon name="shield" size={16} /><span>O cartão é enviado direto ao Pagar.me, que processa o pagamento. A Vytal não recebe nem guarda o número.</span></div>
      </>}
      {coupon ? <div className="row between wrap" style={{ background: "var(--ok-soft)", borderRadius: 14, padding: "10px 14px" }}><span className="small"><b>{coupon.codigo}</b>: {coupon.resumo}. <s className="muted">{coupon.precoOriginalTexto}</s> <b>{coupon.precoFinalTexto}</b></span><button type="button" className="link" onClick={() => { setCoupon(null); setCode(""); }}>Remover</button></div>
        : couponOpen ? <div className="stack" style={{ gap: 6 }}><div className="row" style={{ alignItems: "flex-end" }}><div className="grow"><Field label="Cupom de desconto" autoCapitalize="characters" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void checkCoupon(); } }} /></div><Button type="button" busy={checking} onClick={() => checkCoupon()}>Aplicar</Button></div><Notice>{couponError}</Notice></div>
        : <button type="button" className="link" style={{ alignSelf: "flex-start" }} onClick={() => setCouponOpen(true)}>Tenho um cupom de desconto</button>}
      <p className="muted small">{method === "pix" ? `Pagamento único de ${price} por ${cycle === "anual" ? "12 meses" : "30 dias"} de acesso, contados a partir do fim do período que você já tiver pago.` : `Cobrança de ${price} ${per}, renovada sozinha até você cancelar.${later} Cancele quando quiser em Conta; o plano vale até o fim do período pago.`} <a href="https://www.vytalsaude.com.br/termos" target="_blank" rel="noreferrer">Termos de uso</a> e <a href="https://www.vytalsaude.com.br/privacidade" target="_blank" rel="noreferrer">política de privacidade</a>.</p>
      <Notice>{error}</Notice>
      <Button type="submit" className="big" icon={method === "pix" ? "send" : "check"} busy={busy}>{method === "pix" ? `Gerar Pix de ${price}` : `Assinar por ${price} ${per}`}</Button>
      </>}
    </form>
  </Dialog>;
}

/** QR Code e "copia e cola". Pergunta ao servidor a cada 4 s até o pagamento cair. */
function PixPayment({ order, planName, price, onPaid, onClose, onRetry }: { order: PixOrder; planName: string; price: string; onPaid: (until: string | null) => void; onClose: () => void; onRetry: () => void }) {
  const [status, setStatus] = useState("pendente"), [copied, setCopied] = useState(false), [now, setNow] = useState(Date.now());
  useEffect(() => {
    let on = true;
    const tick = async () => {
      try { const r = await api<{ status: string; acessoAte?: string | null }>(`/assinatura/web/pix/${encodeURIComponent(order.id)}`); if (!on) return; setStatus(r.status); if (r.status === "ativa") onPaid(r.acessoAte ?? null); }
      catch { /* tenta de novo no próximo ciclo */ }
    };
    const poll = setInterval(tick, 4000), clock = setInterval(() => setNow(Date.now()), 1000);
    return () => { on = false; clearInterval(poll); clearInterval(clock); };
  }, [order.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const left = order.expiraEm ? Math.max(0, Math.floor((new Date(order.expiraEm).getTime() - now) / 1000)) : null;
  const expired = status === "expirada" || left === 0;
  async function copy() { try { await navigator.clipboard.writeText(order.qrCode); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* seleciona à mão */ } }
  // O valor e o prazo vêm do pedido: numa conta de teste o Pix sai por R$ 1,00 e vale 1 dia.
  const valor = order.valorCentavos != null ? (order.valorCentavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : price;
  const prazo = order.dias === 365 ? "12 meses" : order.dias === 1 ? "1 dia" : `${order.dias} dias`;
  return <Dialog title="Pague com Pix" eyebrow={`${planName} · ${valor} · ${prazo}`} onClose={onClose}>
    {order.teste && <Notice tone="info">Pix de teste: esta conta paga um valor simbólico e o plano vale 1 dia.</Notice>}
    {expired ? <><Notice tone="warn">Este Pix expirou sem pagamento. Gere outro para continuar.</Notice><Button className="big" icon="send" onClick={onRetry}>Gerar outro Pix</Button></> : <>
      <p className="muted">Abra o app do seu banco, escolha Pix e leia o QR Code, ou use o código "copia e cola".</p>
      {order.qrCodeUrl && <img src={order.qrCodeUrl} alt="QR Code do Pix" width={220} height={220} style={{ alignSelf: "center", width: 220, height: 220, background: "#fff", borderRadius: 12, padding: 8 }} />}
      <label className="field"><span>Pix copia e cola</span><textarea readOnly value={order.qrCode} rows={3} onFocus={(e) => e.currentTarget.select()} style={{ fontFamily: "ui-monospace, monospace", fontSize: 16, wordBreak: "break-all" }} /></label>
      <Button className="big" icon="check" onClick={copy}>{copied ? "Código copiado" : "Copiar código"}</Button>
      <div className="row muted small" style={{ justifyContent: "center" }} role="status"><span className="spinner" aria-hidden="true" />Aguardando o pagamento{left != null ? ` · expira em ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : ""}</div>
      <p className="muted small">Pode fechar esta janela depois de pagar: o plano é liberado assim que o banco confirma.</p>
    </>}
  </Dialog>;
}

/** [VENCIMENTO] Aviso de plano vencendo, em carência ou com lembretes pausados. */
export function ExpiryNotice({ expiry: v, used, pessoal = false, teste = false, paidPlan }: { expiry: Expiry; used: number; pessoal?: boolean; teste?: boolean; paidPlan?: string }) {
  const day = (iso: string) => Schedule.dateTime(iso).slice(0, 10);
  const over = v.fase === "pausado" ? v.pausados : Math.max(0, used - v.limite);
  const who = unidade(over, pessoal);
  // [PESSOAL] Sem plano pessoal ninguém continua; no profissional, os mais antigos seguem.
  const kept = v.limite === 0 ? "" : `; ${v.limite === 1 ? `${pessoal ? "a pessoa" : "o paciente"} mais antigo continua` : `os ${v.limite} mais antigos continuam`}`;
  if(teste&&paidPlan) return <Notice tone={v.fase==='pausado'?'error':'warn'}>{v.fase==='vence_em_breve'?`O benefício extra do teste termina em ${day(v.venceEm)}. Seu plano ${paidPlan} continua válido. Após ${day(v.corteEm)}, os lembretes de ${who} acima do limite ficam pausados.`:v.fase==='carencia'?`O benefício extra do teste terminou. Seu plano ${paidPlan} continua válido. Após ${day(v.corteEm)}, os lembretes de ${who} acima do limite ficam pausados.`:`Seu plano ${paidPlan} continua válido. Os lembretes de ${who} acima do limite estão pausados. Nada foi apagado.`}</Notice>;
  const text = v.fase === "vence_em_breve"
    ? `${teste ? `Seu teste grátis termina em ${day(v.venceEm)}.` : `Seu plano vence em ${day(v.venceEm)} e ainda não foi renovado.`} Sem assinar, depois de 7 dias de carência (${day(v.corteEm)}) os lembretes de ${who} param${kept}.`
    : v.fase === "carencia"
      ? `${teste ? "Seu teste grátis terminou" : "Seu plano venceu"} em ${day(v.venceEm)}. Até ${day(v.corteEm)} nada muda. Depois, os lembretes de ${who} param${kept}.`
      : `${teste ? "Teste encerrado" : "Plano vencido"}: os lembretes de ${who} estão pausados${kept}. Nada foi apagado e, ao assinar, os lembretes voltam sozinhos.`;
  return <Notice tone={v.fase === "pausado" ? "error" : "warn"}>{text}</Notice>;
}

/** [FRANQUIA] Mensagens do mês. Passar do limite só gera aviso: os lembretes nunca param. */
export function QuotaLine({ quota }: { quota: Quota }) {
  const tone = quota.aviso === "excedida" ? "var(--bad)" : quota.aviso === "perto" ? "var(--warn)" : "var(--blue)";
  return <div className="stack" style={{ gap: 4 }}>
    <div className="muted small tnum">{quota.mensagens.toLocaleString("pt-BR")} de {quota.limite.toLocaleString("pt-BR")} mensagens neste mês</div>
    <div className="meter"><div style={{ width: `${Math.min(100, quota.percentual)}%`, background: tone }} /></div>
    {quota.aviso && <span className="small" style={{ color: tone }}>{quota.aviso === "excedida" ? "A franquia de mensagens do plano passou do limite. Os lembretes continuam saindo; para manter o acompanhamento dentro do plano, mude para um plano maior." : "A franquia de mensagens do plano está perto do limite deste mês."}</span>}
  </div>;
}
