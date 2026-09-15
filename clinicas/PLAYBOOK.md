# Playbook: sites para clínicas e consultórios no Brasil

## Primeiro, o ajuste de expectativa

A história americana é real no formato e otimista no número. O que muda aqui:

| A história diz | No Brasil |
|---|---|
| US$ 1.000 por site (~R$ 5.400) | R$ 1.500–3.500 num consultório de capital. R$ 800–1.500 no interior. Acima disso você precisa vender resultado, não site. |
| Copiar as avaliações do Google para o site | **Vedado** para médico, dentista, psicólogo. Ver `COMPLIANCE.md`. A nota serve para a sua conversa, não para a página. |
| 500 e-mails por dia, 3% respondem | E-mail para clínica no Brasil responde perto de 0,5–1%. O `contato@` de consultório é um Gmail que ninguém abre. **O canal é telefone e WhatsApp.** |
| Fechou em 47 minutos | Acontece, e não é a média. Conte 20 a 40 contatos para o primeiro sim enquanto você não tem caso para mostrar. |
| Mês 6: US$ 15–20 mil | O que chega lá é a **mensalidade**, não o setup. 30 clientes × R$ 300/mês = R$ 9.000 recorrentes, com custo de hospedagem perto de zero. |

O que é verdade e é o essencial: **chegar com o site já pronto**. É a única
parte da história que explica o "sim na hora". Ninguém compra a ideia de um
site; todo mundo compra o site que já existe e está na tela.

## A máquina, em quatro peças

### 1. Lista — quem não tem site

```bash
export GOOGLE_PLACES_API_KEY=...
node clinicas/prospectar.mjs \
  --cidade "Campinas" --uf SP \
  --nichos cardiologista,dermatologista,ortopedista,ginecologista \
  --min-avaliacoes 15 --saida clinicas/prospectos/campinas.csv
```

Sai um CSV ordenado por número de avaliações, marcando quem **não tem site,
tem telefone público e tem reputação construída**. Esse é o alvo: quem tem
4,8 com 150 avaliações já provou que atende bem — falta só a vitrine.

Use a API oficial, não raspagem. Ver o comentário no topo de
`prospectar.mjs`: os termos do Google, o custo e o que você pode guardar.

**Estreite o nicho.** "Cardiologista em Campinas" vale mais que "clínicas no
Brasil": você reaproveita texto, entende as objeções em duas semanas e
ganha o ativo que mais importa nesse mercado — **médico indica médico**. O
segundo cliente do mesmo prédio custa um décimo do primeiro.

### 2. Briefing — sem conversar com o cliente

Copie `clinicas/exemplos/cardio-jardins.json`, troque os dados. O que você
consegue sozinho, antes de qualquer contato: nome, endereço, telefone,
horário, especialidade, convênios (costuma estar na foto do Google), o que a
clínica faz (está nas avaliações — você **lê** as avaliações para entender o
serviço, você não as **publica**).

O que você não sabe você deixa plausível e marca para confirmar. O preview
não precisa estar certo, precisa estar **reconhecível**.

### 3. Site — dois comandos

```bash
node clinicas/validar.mjs clinicas/exemplos/minha-clinica.json   # confere
node clinicas/gerar.mjs   clinicas/exemplos/minha-clinica.json   # gera
```

Sai um HTML único, ~30 KB, sem dependência, com agendamento por WhatsApp,
marcação de busca local e registro do responsável no lugar certo. Publica
em `/preview/<slug>/` no deploy deste repo.

Se o validador apontar erro, o site não sai. É de propósito: ver
`COMPLIANCE.md`.

### 4. Abordagem — ligar, não escrever

Roteiros em `clinicas/abordagem/`. A ordem que funciona com consultório:

1. **Ligação para a recepção** (10h–11h30 ou 14h–16h; nunca 8h nem depois
   das 17h). A recepcionista é a porteira, e é ela quem sente a dor —
   é ela que repete horário e endereço no telefone o dia inteiro.
2. **WhatsApp com o link do preview** para o número que a recepção passar.
3. **Presencial**, se a clínica está num prédio médico. Vinte consultórios
   num andar. Você vai por um e sai com três reuniões.
4. **E-mail** por último, e só personalizado. Não faça blast de 500: você
   queima o domínio, cai no spam e some do jogo em duas semanas. LGPD
   permite contato B2B com dado público por legítimo interesse (art. 7º,
   IX), mas exige identificação clara e saída fácil — e o bom senso exige
   volume baixo.

**Aviso sobre WhatsApp:** disparo frio em massa derruba número, e a API
oficial proíbe mensagem fria sem opt-in. Use número próprio, volume humano,
sempre depois de uma ligação que abriu a porta. O WhatsApp é onde a
conversa continua, não onde ela começa.

## O que realmente vende (e não é o site)

O site sozinho não traz paciente. Quem traz é o **perfil no Google** — e a
maioria das clínicas tem o perfil incompleto, sem horário, sem serviço, sem
link, às vezes sem dono reivindicado.

Venda o pacote:

1. Site com agendamento por WhatsApp
2. Perfil do Google arrumado e ligado ao site
3. Dados de busca local certos (é o que o `JSON-LD` do template faz)

Esse é o argumento que aguenta R$ 2.500 em vez de R$ 800, porque é o que
faz o telefone tocar. E é o que te dá a frase de abertura:

> "Doutor, quem procura cardiologista em Campinas no celular acha o senhor
> no Google, mas não acha horário, nem convênio, nem um jeito de marcar.
> Eu montei uma página com isso — o link está no seu WhatsApp, pode abrir."

## Preço e estrutura

Dois modelos. O segundo é o que vira os R$ 15–20 mil.

**À vista:** R$ 1.800–3.500 setup + R$ 180–300/mês (domínio, hospedagem,
ajustes, relatório do Google). Dinheiro agora, recorrência menor.

**Mensalidade cheia:** R$ 0 de setup + R$ 397/mês por 12 meses. O médico
diz sim muito mais rápido porque não há decisão de investimento, só uma
conta pequena. Você recebe R$ 4.764 por cliente ao longo do ano, e aos 30
clientes tem R$ 11.910/mês entrando sem vender nada de novo. Exige caixa
para atravessar os primeiros meses.

Custo real por cliente: domínio no registro.br ~R$ 40/ano, hospedagem
estática grátis (Vercel, Cloudflare Pages), seu tempo de ajuste ~1h/mês.
A margem é quase toda.

**Cuidados que evitam dor depois:**

- Registre o domínio **no CNPJ do cliente**, não no seu. Você administra,
  ele é o dono. Isso fecha venda (ele não fica preso) e te tira de briga.
- Emita nota fiscal. Consultório precisa da nota para lançar a despesa —
  sem CNPJ seu, boa parte do mercado não pode te contratar. Abra o CNPJ
  antes da primeira venda e confira na lista vigente qual enquadramento
  cabe na sua atividade: a lista do MEI muda e já excluiu ocupações de
  tecnologia.
- Contrato de uma página: o que inclui, o que é mensalidade, de quem é o
  domínio, prazo de ajuste (ex.: até 2 alterações/mês em 48h), como
  cancela. Uma página resolve; a ausência dela custa um cliente.
- Combine **quem responde o WhatsApp**. O site manda o paciente para a
  recepção. Se ninguém responde em 10 minutos, o site "não funcionou" e a
  culpa vai ser sua.

## Os primeiros 30 dias, na ordem

| Dias | O que fazer |
|---|---|
| 1–2 | CNPJ e nota fiscal encaminhados. Chave da Places API. Um nicho e uma cidade escolhidos. |
| 3 | Rodar o `prospectar.mjs`. Meta: 40 qualificados no CSV. |
| 4–5 | Gerar **3 previews completos** dos melhores da lista, antes de ligar para qualquer um. |
| 6–10 | 15 ligações por dia com preview na mão. Anotar objeção por objeção. |
| 11–15 | Fechar o primeiro. Entregar em 48h: domínio, site publicado, perfil do Google arrumado. Pedir **duas indicações** na entrega — é aqui que a máquina liga. |
| 16–30 | Repetir com o texto já calibrado pelas objeções reais. Meta do mês: 3 a 5 clientes. |

Meta honesta de mês 1: **R$ 3.000–6.000**. Se vier mais, foi sorte boa e
não é o número para planejar em cima.

## O gargalo de verdade

Não é gerar o site — isso aqui já são dois comandos. É:

1. **Falar com o médico.** A recepção filtra. Resolve-se com horário certo,
   preview pronto e insistência educada.
2. **Confiança.** Você tem 18, 25 ou 40 anos e está ligando para um médico
   sobre a reputação dele. O que derruba a desconfiança é o preview aberto
   no celular dele, os dados certos e a frase "isso já está no ar, é seu, o
   senhor decide se quer manter".
3. **Suporte.** Vinte clientes significam vinte pessoas pedindo para trocar
   um telefone no meio da quinta-feira. Se você não organiza isso, a
   recorrência morre — e a recorrência é o negócio.
