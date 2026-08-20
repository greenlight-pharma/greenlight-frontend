# Migrar da Evolution API para o WhatsApp oficial (Cloud API)

Guia de migração para a **WhatsApp Business Platform / Cloud API**, da Meta.
Escrito para o caso concreto da Vytal: lembrete de medicação disparado por
cron para pacientes de UBS.

> ⚠️ Preços e limites da Meta mudam com frequência. Todo número citado aqui
> precisa ser conferido na página oficial antes de fechar contrato com a
> prefeitura. As **regras estruturais** (template, janela de 24h, opt-in)
> são estáveis e é nelas que o roteiro se apoia.

---

## 1. Por que sair da Evolution

A Evolution API roda em cima do protocolo do **WhatsApp Web** (Baileys). Ou
seja: um número de WhatsApp comum automatizado por engenharia reversa.

| | Evolution (hoje) | Cloud API (oficial) |
|---|---|---|
| Situação nos Termos da Meta | não autorizado | autorizado |
| Risco de banimento do número | real e sem aviso | não existe se seguir a política |
| Volume | trava por heurística antispam | cota formal, escalonável |
| Entrega | sem garantia | com status por mensagem (`sent`/`delivered`/`read`/`failed`) |
| Botões nativos | não | sim |
| Contrato com órgão público | difícil de sustentar | é o esperado |

O ponto decisivo não é técnico. É que **um piloto com prefeitura vira
contrato**, e um contrato apoiado em número que pode sumir da noite pro dia
é risco que a Secretaria vai transferir para vocês.

---

## 2. O que muda no produto (leia antes do passo a passo)

Esta é a parte que costuma pegar de surpresa e que **muda o código do
backend**, não só a credencial.

### 2.1 Não dá para mandar texto livre quando quiser

No WhatsApp oficial existem duas situações:

- **Janela de serviço (24h)** — abre quando o *paciente* manda mensagem.
  Dentro dela você responde o que quiser, em texto livre.
- **Fora da janela** — você só pode iniciar conversa com um **template
  pré-aprovado** pela Meta.

O lembrete das 08:00 é iniciado por vocês, quase sempre fora da janela.
**Logo, o lembrete de medicação obrigatoriamente vira um template.**

O resto do bot (a conversa com a IA, a triagem) continua funcionando em
texto livre, porque acontece *depois* que o paciente respondeu — ou seja,
com a janela já aberta.

### 2.2 O template resolve um bug que vocês têm hoje

Hoje o fluxo é `Responda: 1 - Já tomei / 2 - Ainda não / 3 - Efeito colateral`,
e o backend casa a resposta com a última `pending_action` (`ORDER BY id DESC`).

Isso quebra em polifarmácia — que na UBS é a regra, não a exceção. Idoso com
losartana **e** metformina às 08:00 recebe duas mensagens, gera duas
pendências, responde "1" uma vez, e só uma medicação é registrada. A outra
fica pendurada e captura a próxima mensagem qualquer que ele mandar.

Com o oficial, o template leva **botões de resposta rápida**, e o webhook
devolve o **ID do botão que o paciente tocou**. Você põe o `medicationId`
dentro desse ID e a ambiguidade acaba:

```
button.payload = "tomou:1234"   ->  medicationId 1234, sem adivinhação
```

Não é um ganho estético. É a diferença entre ter e não ter dado de adesão
confiável para mostrar à Secretaria.

### 2.3 Opt-in é obrigatório

A Meta exige consentimento registrado antes de mandar template. Vocês
precisam guardar **quando, como e por qual canal** o paciente aceitou.
Isso conversa direto com a LGPD (dado de saúde é dado sensível, art. 11),
então resolva as duas coisas de uma vez: uma coluna `optInAt` e
`optInSource` na tabela do paciente.

---

## 3. Passo a passo

### Passo 0 — Junte os documentos (é aqui que trava)

A verificação de empresa da Meta é o gargalo. Tenha em mãos:

- CNPJ ativo
- Cartão CNPJ / contrato social
- **Site no ar em domínio próprio**, com o nome da empresa, endereço e
  contato batendo com o cadastro — a Meta cruza isso
- E-mail corporativo **no domínio do site** (não Gmail)
- Telefone da empresa que atenda

> O motivo mais comum de reprovação é divergência boba: razão social
> abreviada no site, endereço diferente do cartão CNPJ, e-mail Gmail.
> Confira antes de submeter — reprovação queima tempo de reanálise.

### Passo 1 — Meta Business Manager

1. Crie/entre em `business.facebook.com`.
2. Cadastre a empresa com os dados **idênticos** ao CNPJ.
3. **Configurações → Central de Segurança → Verificação da empresa.**
4. Envie os documentos e aguarde (costuma levar dias; pode pedir
   complemento).

### Passo 2 — App e produto WhatsApp

1. Em `developers.facebook.com`, crie um app do tipo **Business**.
2. Vincule ao Business Manager verificado.
3. Adicione o produto **WhatsApp**.
4. A Meta já entrega um número de teste — use para desenvolver **antes**
   de mexer no número de produção.

### Passo 3 — O número

Regra que pega todo mundo: **o número precisa estar livre do WhatsApp.**
Um número já registrado no WhatsApp comum ou no WhatsApp Business App não
pode ser registrado na Cloud API sem antes ser apagado de lá.

Recomendação forte para o caso de vocês:

> **Use um número NOVO para a Cloud API.** Mantenha o número da Evolution
> rodando em paralelo durante a transição. Assim você não fica sem canal
> se a homologação atrasar, e migra os pacientes por lote.

Se insistir em reaproveitar o número atual: apague a conta dele no app do
WhatsApp, espere a propagação, e só então registre. Durante esse intervalo
o canal fica fora do ar.

### Passo 4 — Registre os templates

`Business Manager → WhatsApp Manager → Modelos de mensagem`.

Para o lembrete, categoria **Utility** (utilidade). Não marque Marketing —
categoria errada custa mais caro e é motivo de rejeição.

```
Nome:      lembrete_medicacao
Categoria: UTILITY
Idioma:    pt_BR

Corpo:
Olá, {{1}}. Está na hora da sua medicação: {{2}}.
Orientação do seu médico: {{3}}

Botões (resposta rápida):
  [Já tomei]  [Ainda não tomei]  [Tive efeito colateral]
```

Cuidados que causam rejeição:
- **Não comece nem termine o corpo com variável.** Por isso o "Olá," e o
  ponto final fixos.
- **Não use duas variáveis coladas** (`{{1}} {{2}}` sem texto entre elas).
- Preencha os exemplos de variável na submissão — template sem exemplo é
  rejeitado.
- Não prometa nem diagnostique nada no texto. Mantenha o enquadramento
  educacional/lembrete que vocês já usam.

Se o médico não preencheu orientações, `{{3}}` não pode ir vazia — mande
algo neutro como "conforme a prescrição" ou registre **dois templates**,
um com e um sem o bloco de orientação.

### Passo 5 — Trocar o envio no backend

Hoje o `server.js` já isola o provedor — isso foi bem feito e facilita
tudo:

```js
async function sendMessage(number, text) {
  const provider = process.env.WHATSAPP_PROVIDER || "evolution";
  if (provider === "evolution") return sendEvolutionText(number, text);
  // ...
}
```

Basta acrescentar o ramo `cloud`. Só que o envio de **template** tem uma
forma diferente de texto livre, então vale uma função própria:

```js
// Texto livre — SÓ funciona dentro da janela de 24h.
async function sendCloudText(number, text) {
  return cloudPost({
    messaging_product: "whatsapp",
    to: number,
    type: "text",
    text: { body: text },
  });
}

// Template — é o que inicia conversa (o lembrete das 08:00).
async function sendCloudTemplate(number, nome, variaveis, botoes) {
  return cloudPost({
    messaging_product: "whatsapp",
    to: number,
    type: "template",
    template: {
      name: nome,
      language: { code: "pt_BR" },
      components: [
        {
          type: "body",
          parameters: variaveis.map((v) => ({ type: "text", text: v })),
        },
        // Cada botão de resposta rápida recebe o payload que volta no webhook.
        ...botoes.map((payload, i) => ({
          type: "button",
          sub_type: "quick_reply",
          index: String(i),
          parameters: [{ type: "payload", payload }],
        })),
      ],
    },
  });
}

async function cloudPost(body) {
  const resp = await fetch(
    `https://graph.facebook.com/v21.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await resp.json();
  // A Cloud API responde 200 com erro no corpo em vários casos —
  // checar só o status HTTP deixa falha passar batido.
  if (!resp.ok || data.error) {
    throw new Error(data.error?.message || `Falha ao enviar (${resp.status})`);
  }
  return data;
}
```

E o cron passa a mandar template:

```js
await sendCloudTemplate(
  med.phone,
  "lembrete_medicacao",
  [primeiroNome(med.patientName), nomeDose, orientacao || "conforme a prescrição"],
  [`tomou:${med.id}`, `nao_tomou:${med.id}`, `efeito:${med.id}`]
);
```

Repare que o `medicationId` viaja no payload do botão. **É isso que mata a
ambiguidade da polifarmácia** — não precisa mais de `pending_actions` para
o fluxo de medicação.

### Passo 6 — Webhook de entrada

A Cloud API entrega as mensagens por webhook (não é polling).

**Verificação (GET)** — a Meta chama uma vez para validar a URL:

```js
app.get("/webhook/whatsapp", (req, res) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === process.env.WA_VERIFY_TOKEN
  ) {
    return res.status(200).send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});
```

**Recebimento (POST)** — responda `200` **imediatamente**, antes de
processar. A Meta reenvia o que demora, e reenvio vira mensagem duplicada
para o paciente:

```js
app.post("/webhook/whatsapp", (req, res) => {
  res.sendStatus(200);              // primeiro confirma
  processarWebhook(req.body).catch((e) =>
    console.log("[WA_WEBHOOK]", e.message)
  );
});

async function processarWebhook(body) {
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};

      for (const msg of value.messages || []) {
        // Botão tocado: o payload traz a intenção E o id da medicação.
        if (msg.type === "button") {
          const [acao, medicationId] = (msg.button.payload || "").split(":");
          await registrarRespostaMedicacao(msg.from, acao, Number(medicationId));
          continue;
        }
        // Texto livre: cai no fluxo de IA que já existe.
        if (msg.type === "text") {
          await tratarMensagemLivre(msg.from, msg.text.body);
        }
      }

      // Status de entrega: aqui você descobre quem NÃO recebeu.
      for (const st of value.statuses || []) {
        await registrarStatus(st.id, st.status, st.errors);
      }
    }
  }
}
```

> O bloco `statuses` é ouro para vocês. Hoje não há como saber se o
> lembrete chegou. Com ele dá para responder à coordenação: "esses 12
> pacientes não recebem há duas semanas porque o número está errado".

### Passo 7 — Segurança do webhook

O endpoint é público. Duas coisas obrigatórias:

1. **Valide a assinatura** `X-Hub-Signature-256` (HMAC SHA-256 do corpo
   cru com o App Secret). Sem isso, qualquer um posta adesão falsa no
   prontuário dos seus pacientes.
2. Guarde o `msg.id` e **ignore repetido** — a Meta pode entregar a mesma
   mensagem mais de uma vez.

---

## 4. Custos

Modelo atual da Meta (confirmar valores vigentes):

- Conversa **iniciada pelo paciente** (serviço): sem custo.
- Template de **utilidade** (o lembrete): cobrado por mensagem, e é a
  categoria **mais barata** depois de autenticação. Há isenção quando a
  janela de atendimento já está aberta.
- **Marketing** custa bem mais. Categorizar o lembrete como Marketing é o
  erro que estoura orçamento — não deixe.

Para dimensionar o piloto, a conta é direta:

```
pacientes × doses/dia × 30  =  templates/mês
```

300 pacientes × 2 doses = 18.000 templates/mês. Multiplique pela tarifa
de utilidade vigente. **Faça essa conta antes de propor preço à
prefeitura** — é custo variável que cresce linearmente com o sucesso do
programa.

---

## 5. Limites e qualidade

O número começa com cota baixa (na faixa de 1.000 destinatários únicos por
24h) e sobe conforme o histórico. Isso escala sozinho **se** a qualidade
for boa.

A qualidade cai quando o paciente **bloqueia** ou **denuncia**. Para um
serviço de saúde isso é gerenciável, mas exige:

- opt-in de verdade (não cadastrar quem não pediu);
- saída fácil e respeitada — "PARAR" tem que parar de verdade, e isso
  precisa estar no código, não só no discurso;
- não mandar em horário absurdo;
- não misturar lembrete clínico com divulgação.

Se a qualidade cair para vermelho, a Meta reduz sua cota. Com 300
pacientes na UBS isso vira interrupção de serviço.

---

## 6. LGPD e saúde — o que não se resolve com API

Trocar de API resolve o risco de banimento. **Não** resolve:

- **Base legal** para tratar dado de saúde (art. 11 da LGPD). Consentimento
  específico e destacado, ou execução de política pública de saúde — a
  segunda hipótese muda bastante o desenho se o cliente é a Secretaria.
- **Conteúdo da mensagem.** Nome do medicamento no WhatsApp revela condição
  de saúde a quem estiver com o celular na mão. Vale avaliar mensagem mais
  discreta como padrão, com o nome do remédio só para quem optar.
- **Contrato com a prefeitura**: operador ou controlador? Isso define de
  quem é a responsabilidade num vazamento, e precisa estar escrito.

Isso é conversa com jurídico/DPO, não comigo. Mas entra no mesmo pacote
de decisão, e é melhor decidir antes do piloto do que depois.

---

## 7. Ordem sugerida

1. Reunir documentos e submeter a verificação de empresa — **começa hoje**,
   é o que demora e não depende de código.
2. Enquanto aguarda: app + número de teste + implementar `sendCloudTemplate`
   e o webhook com o provider `cloud` desligado em produção.
3. Submeter os templates assim que a conta for aprovada (aprovação de
   template costuma ser rápida, mas rejeição custa nova rodada).
4. Número novo de produção, testar com a equipe.
5. Migrar por lote, com a Evolution ainda de pé.
6. Só desligar a Evolution quando o status de entrega da Cloud API mostrar
   que os pacientes estão recebendo.
