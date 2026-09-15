# clinicas/ — gerador de sites para clínicas e consultórios

Máquina de prospectar clínica sem site, gerar o site e vender com o preview
já pronto na tela. Adaptada ao Brasil, com as regras de publicidade em
saúde dentro do código.

```
clinicas/
  prospectar.mjs      lista clínicas SEM SITE via Google Places API → CSV
  briefar.mjs         CSV + modelo de nicho → rascunhos de briefing → sites
  validar.mjs         conformidade de publicidade médica (CFM/CFO/CFP/LGPD)
  estilos.mjs         6 paletas e 2 layouts nomeados
  gerar.mjs           briefing JSON → site HTML de arquivo único
  testar.mjs          74 casos: conformidade, estilos, fotos, renderização
  template/
    editorial.html    profissional único: hero claro, retrato, serifa grande
    clinico.html      clínica multiespecialidade: hero escuro, grade, convênios
  modelos/            bases por nicho e praça (odonto, fisio e derma em Angra)
  exemplos/           um briefing completo e um propositalmente irregular
  sites/<slug>/       saída dos modelos, publicada em /preview/<slug>/
  prospectos/         seus CSVs, rascunhos e sites de prospecto real
                      (fora do git — levam dados de terceiros)

  PLAYBOOK.md         prospecção, abordagem, preço, os 30 primeiros dias
  COMPLIANCE.md       o que pode e o que não pode num site de saúde
  FOTOS.md            por que não se pega foto do Instagram, e o que fazer
  abordagem/          roteiros de ligação, WhatsApp, e-mail e indicação
```

## Uso

```bash
# 1. achar quem não tem site
export GOOGLE_PLACES_API_KEY=...
node clinicas/prospectar.mjs --cidade "Campinas" --uf SP \
     --nichos cardiologista,ortopedista --saida clinicas/prospectos/campinas.csv
node clinicas/prospectar.mjs --simular --cidade X   # testa sem chave e sem custo

# 2. três rascunhos prontos a partir das melhores linhas do CSV
node clinicas/briefar.mjs --csv clinicas/prospectos/campinas.csv \
     --modelo derma-angra --top 3
#   → clinicas/prospectos/briefings/<slug>.json  (confira _confirmarNaLigacao)
#   → clinicas/prospectos/sites/<slug>/index.html

# ou à mão: copie um modelo e troque os dados
cp clinicas/modelos/derma-angra.json clinicas/prospectos/minha-clinica.json

# 3. conferir e gerar
node clinicas/validar.mjs clinicas/exemplos/minha-clinica.json
node clinicas/gerar.mjs   clinicas/exemplos/minha-clinica.json
#   → clinicas/sites/minha-clinica/index.html
#   → publicado em /preview/minha-clinica/ depois do deploy
```

## Dois layouts, seis paletas

Para os sites não parecerem o mesmo site com a cor trocada, **layout e
paleta mudam junto** — e o briefing pede um nome, não seis hexadecimais:

```json
{ "layout": "editorial", "paleta": "nude" }
```

| Layout | Para quem | Como é |
|---|---|---|
| `editorial` | profissional único, consultório particular, dermatologia e estética | hero claro dividido, retrato à direita, serifa grande, muito branco, lista numerada em vez de cartões |
| `clinico` | clínica com várias especialidades e convênios | hero escuro, cartão de atendimento, grade de serviços, informação densa |

Paletas: `nude` (off-white e bordô, serifa de alto contraste), `oceano`
(litoral), `salvia` (pediatria, nutrição, psicologia), `grafite` (ortopedia,
fisioterapia, medicina do trabalho), `clinico` (azul institucional), `rose`
(odontologia e estética). Cada uma já vem com o par tipográfico.

`marca` no briefing sobrescreve ponto a ponto, para quando o cliente já tem
identidade visual.

## Fotos

O retrato é metade do produto num site de profissional único — e é a peça
que tem dono. **Não se pega do Instagram nem do Google**: ver `FOTOS.md`
para o porquê (direito autoral do fotógrafo, direito de imagem da pessoa,
Súmula 403 do STJ) e para o que funciona no lugar.

O que o código garante:

- `midia.retrato` só é aceito com `midia.origem` **e** `midia.autorizacao`
  preenchidos — de onde a foto veio e quem autorizou. Sem isso o site não
  é gerado
- cada item da galeria declara `"tipo": "propria"` ou `"ilustrativa"`;
  imagem de banco sai **rotulada** na página e pede crédito no rodapé
- menção a paciente em legenda ou alt é erro
- sem retrato, o `editorial` troca o quadro da foto por um painel
  tipográfico com o monograma — não fica buraco, fica escolha. É o estado
  do rascunho, e a deixa para pedir a foto na ligação

## Modo rascunho

`"preview": true` no briefing é o estado "ainda não falei com a clínica":

- a página leva `noindex, nofollow` — nunca compete no Google com o site
  real da clínica nem é confundida com ele
- ganha uma tarja dizendo que é demonstração feita com dados públicos
- **registro e RQE que faltam saem como "a confirmar", marcados em
  amarelo** — nunca inventados. É a primeira pergunta da ligação, e você
  pode consultar o portal público do conselho antes
- todas as outras vedações continuam sendo erro: mostrar um rascunho com
  depoimento ou "melhor da cidade" é o mesmo desastre

Sem `preview`, publicar exige o registro real. `briefar.mjs` nunca herda do
modelo o registro nem o nome do responsável fictício, e limpa referência,
estacionamento e acessibilidade — são afirmações de fato sobre um endereço
que o modelo não conhece.

## As três decisões de projeto

**1. O validador bloqueia a geração.** Não avisa: bloqueia. Um gerador
genérico coloca depoimento de paciente, antes e depois e "melhor da cidade"
por padrão — tudo vedado pelo CFM. Site irregular vira problema do seu
cliente no conselho, e ele vai lembrar quem fez. Ver `COMPLIANCE.md`.

```bash
node clinicas/validar.mjs clinicas/exemplos/reprovado-o-que-nao-fazer.json
# 16 erros — é o site que o roteiro viral americano manda fazer
```

**2. A nota do Google não vai para o site.** Ela fica no briefing, em
`_prospeccao`, porque serve para a **sua conversa de venda** ("o senhor tem
4,9 com 143 avaliações e nenhum site"). Na página ela é testemunho de
paciente usado como propaganda. Campos com prefixo `_` nunca são
renderizados nem validados.

**3. Não há formulário.** Agendamento é por WhatsApp e telefone. Dado de
saúde é dado sensível (LGPD art. 11); um site estático sem coleta não tem
essa superfície, e a conversa acontece onde já acontecia.

## O site gerado

Arquivo único, ~32 KB, zero dependência, zero build. Abre em 4G ruim, que é
como o paciente vai chegar nele.

- Agendamento por WhatsApp com mensagem pré-escrita, no topo, no cartão, no
  meio, no rodapé e na barra fixa do celular
- `JSON-LD` de `MedicalClinic` com endereço, horário convertido para o
  formato do schema.org, especialidades e formas de pagamento — é isto que
  faz a clínica aparecer na busca local (sem `aggregateRating`, de propósito)
- Registro do responsável técnico junto de cada nome e no rodapé; RQE
  exigido quando a página anuncia especialidade
- Aviso de que o conteúdo não substitui consulta, com orientação de
  emergência
- Cores derivadas de uma única cor do briefing; títulos de seção com texto
  padrão em português, sobrescrevíveis em `textos`
- Acessível no básico: foco visível, `prefers-reduced-motion`, contraste,
  menu com `aria-expanded`
