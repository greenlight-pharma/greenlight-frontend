# Mapa do Governo

No ar em [mapadogoverno.com.br](https://mapadogoverno.com.br) (e em `/governo` no site da Vytal).

Um mapa navegável da estrutura da União, inspirado no
[US Gov Graph da CivLab](https://graph.civlab.org/us): Poderes, órgãos,
entidades da administração indireta, tribunais, cargos de comando e as
relações constitucionais entre eles (quem nomeia, quem aprova, quem
fiscaliza).

* Página: `governo/index.html`, servida em `/governo` (estática, sem
  dependências externas, canvas próprio). O domínio `mapadogoverno.com.br`
  é o mesmo projeto na Vercel: um rewrite por host no `vercel.json` serve
  `/governo/*` na raiz, e `www` redireciona para o apex.
* Dados: `governo/dados/governo-federal.json` (União), `governo/dados/estados/<UF>.json`
  (um por estado, com governo, assembleia, tribunais, MP, defensoria, TRE e
  municípios) e `governo/dados/indice-municipios.json` (busca nacional).
* Fonte dos dados: os scripts desta pasta.

## Como o dado é produzido

```
semente.py  ─────────────────────────────┐
(estrutura curada à mão: CF/1988 e       │
 Lei 14.600/2023)                        ├──> montar_grafo.py ──> governo/dados/governo-federal.json
baixar_siorg.py     -> .cache/siorg.json │
baixar_congresso.py -> .cache/congresso.json
ler_dou.py          -> .cache/dou.md   (relatório para revisão humana; não altera o grafo)
gerar_estados.py    -> governo/dados/estados/*.json + indice-municipios.json
                       (a partir de ufs.py e dados/municipios.csv; chamado pelo montar_grafo.py)
```

## Agentes diários (notícias, mudanças e estrutura)

Como o "Latest Changes" e o "Power map" da CivLab. Três scripts em
`agentes/` rodam todo dia às 7h (Brasília) em
`.github/workflows/agentes-governo.yml` e gravam feeds que o site mostra no
botão **Novidades** e no **Mapa do poder**:

| Agente | Fonte | Grava | O que faz |
|---|---|---|---|
| `agente_dou.py` | DOU seção 2, busca pública filtrada por "Atos do Poder Executivo" (decretos do Presidente) e "Presidência da República" (portarias da Casa Civil, Decreto 9.794/2019) | `governo/dados/mudancas.json` | Baixa cada ato, separa os itens (NOMEAR, EXONERAR, DESIGNAR, DISPENSAR, RECONDUZIR), casa o cargo com um nó do grafo, classifica o nível (`comando`, `alta`, `outra`) e junta saída e entrada do mesmo cargo num registro só |
| `agente_estrutura.py` | SIORG, `orgao-entidade/resumida` (265 órgãos e entidades; a estrutura completa passa de 80 MB) | `mudancas.json` (tipo `estrutura`) e a foto em `dados/siorg-foto.json` | Compara a foto de hoje com a anterior: órgão criado, extinto, renomeado ou transferido de pai |
| `agente_noticias.py` | RSS da Agência Brasil, Agência Câmara, Agência Senado, Notícias do STF e Planalto | `governo/dados/noticias.json` | Liga cada matéria aos órgãos e pessoas do grafo, monta o ranking "quem está no noticiário" (90 dias) e um resumo em quatro frases |

### Ocupantes dos cargos

`agente_ocupantes.py` preenche quem ocupa cada cargo de comando do Executivo e
grava `scripts/governo/dados/ocupantes.json`, que o `montar_grafo.py` aplica
sobre a semente (roda no PR semanal, com revisão):

1. **e-Agendas (CGU)**: a rota pública
   `eagendas.cgu.gov.br/pesquisa/agentes-publicos-obrigados-por-orgao/orgao/<id>/ativo/true`
   lista, por órgão, cada autoridade ativa com nome, cargo, data de início e a
   marca `autoridade_maxima_orgao`. A lista de órgãos vem do `ng-init="orgaos=..."`
   da página inicial. Chefes de órgãos internos (secretarias, Receita, Tesouro,
   INPE) são procurados na lista do ministério-pai: o cargo tem de ser do mesmo
   tipo (secretário para secretaria) e começar pelo nome do órgão.
2. **DOU**: o e-Agendas atrasa (em setembro de 2026 ainda listava como ativa uma
   secretária exonerada em agosto). Cada nome é conferido contra as exonerações
   lidas pelo `agente_dou.py` (feed de 120 dias e, se existir,
   `.cache/dou-historico.json`). A busca pública do DOU não serve para isso: ela
   não ordena por relevância.
3. **`ocupantes-manual.json`**: estatais (eleitas pelo conselho, fora do DOU e do
   e-Agendas), tribunais, Ministério Público, Defensoria e órgãos sem cadastro,
   conferidos no site oficial com a URL exata onde o nome aparece.

### Estados e municípios

* `agentes/prefeitos.py`: prefeito e vice eleitos em 2024 nos 5.570 municípios,
  lidos do site oficial de resultados do TSE (`resultados.tse.jus.br`; o
  download de dados abertos do TSE devolve 403 para acesso automatizado).
  Grava `dados/prefeitos.json`, aplicado pelo `gerar_estados.py`.
* `agentes/juntar_estaduais.py`: junta os ocupantes dos 302 cargos estaduais
  (governador, vice, Saúde, PM, Polícia Civil, Assembleia, TCE/TCM, TJ, TRE, MP,
  Defensoria), conferidos um a um no site oficial ou no Diário Oficial de cada
  estado, em `dados/ocupantes-estaduais.json`. Só entra nome com URL de fonte.

Com o secret `ANTHROPIC_API_KEY`, a Claude (`claude-opus-5`, saída em JSON
com esquema) escreve o resumo das notícias e confirma o órgão e o nível dos
atos que as regras não casaram. Sem a chave, tudo sai só pelas regras:
manchetes no lugar do resumo, e casamento por nome e sigla. Nenhum agente
altera `cargo.ocupante` no grafo; isso continua no PR semanal, com revisão.

Rodar à mão:

```
python3 scripts/governo/agentes/agente_dou.py --dias 45 --sem-claude
python3 scripts/governo/agentes/agente_estrutura.py
python3 scripts/governo/agentes/agente_noticias.py --sem-claude
```

Detalhes que custaram para descobrir: a busca do DOU é por palavras soltas
(aspas não fazem frase) e devolve 403 para clientes sem User-Agent de
navegador; os resultados vêm num `<script type="application/json">` com
`jsonArray`; o filtro que importa é `orgPrin`. O SIORG exige
`Accept: application/json`.

## Três camadas

1. **União** (`governo-federal.json`): o grafo federal, mais o nó "Estados e
   Distrito Federal" com as 27 UFs. Cada UF traz `vista: "estados/UF.json"`.
2. **Estado** (`estados/UF.json`): raiz é a UF; abaixo, Governo (com
   Vice, Secretaria de Saúde, PM, PC e o conjunto das demais secretarias),
   Assembleia (com o TCE e, onde existe, o TCM), TJ (com comarcas), TRE, MP,
   Defensoria e o conjunto de municípios. Relações: Assembleia fiscaliza o
   Governo, Governo e Assembleia escolhem o TCE, TCE (ou TCM) fiscaliza os
   municípios, TRE organiza as eleições municipais, SES coordena o SUS,
   MP e TJ atuam sobre os municípios. Nós com `ligacoes_externas` apontam
   de volta para a União (TRE → TSE, SES → Ministério da Saúde, TJ → STJ).
3. **Município**: um nó por município (`m-<código IBGE>`), com os três
   cargos de comando (prefeito, presidente da Câmara, secretário de saúde)
   descritos uma vez em `meta.cargos_municipio`. Endereço: `#SP/m-3509502`.

Tudo isso roda sozinho toda segunda-feira em
`.github/workflows/grafo-governo.yml`, que abre um PR na branch
`bot/grafo-governo` com o JSON remontado e o relatório do DOU no corpo.
Também pode ser disparado à mão em Actions, "Run workflow".

1. `python3 scripts/governo/semente.py` gera o JSON só com a semente. É o que
   está versionado hoje.
2. `python3 scripts/governo/baixar_siorg.py --completa` e
   `python3 scripts/governo/baixar_congresso.py` baixam as fontes oficiais
   para `.cache/` (não versionado).
3. `python3 scripts/governo/montar_grafo.py` junta tudo e regrava o JSON.

Os scripts de download foram escritos em uma sessão sem acesso à rede
(dados.gov.br, camara.leg.br e senado.leg.br estavam bloqueados), então os
nomes de campos seguem a documentação pública das APIs e podem precisar de
ajuste na primeira execução. Cada um tem o ponto de ajuste marcado.

## Modelo de dados

```jsonc
{
  "meta": { "titulo", "esfera", "versao", "fontes": [...], "tipos": {...}, "poderes": {...} },
  "nos": [
    {
      "id": "anvisa",                 // estável; vira âncora na URL (/governo#anvisa)
      "nome": "Agência Nacional de Vigilância Sanitária",
      "sigla": "Anvisa",
      "tipo": "agencia_reguladora",   // ver meta.tipos
      "poder": "executivo",           // executivo | legislativo | judiciario | essencial | uniao
      "pai": "ms",                    // aresta hierárquica implícita
      "lei": "Lei 9.782/1999",
      "site": "https://...",
      "descricao": "...",
      "quantidade": 11,               // membros (tribunal, Casa) ou entidades (grupo)
      "cargo": {                      // cargo de comando, se houver
        "titulo": "Diretor(a)-Presidente",
        "situacao": "nao_verificado", // titular | interino | vago | nao_verificado
        "ocupante": null,             // null = não verificado
        "desde": "2025-02-01", "mandato_ate": "2027-01-31",
        "verificado_em": "2025-02", "fonte": "https://..."
      }
    }
  ],
  "arestas": [
    { "de": "ms", "para": "anvisa", "tipo": "vinculada a", "hierarquica": true },
    { "de": "senado", "para": "anvisa", "tipo": "aprova", "hierarquica": false, "descricao": "CF, art. 52, III, f" }
  ]
}
```

Tipos de aresta não hierárquica em uso: `nomeia`, `aprova`, `fiscaliza`,
`controla`, `preside`, `elege`, `escolhe`, `orcamento`, `representa`,
`integra`, `orienta`.

## Regra editorial sobre pessoas

Estrutura sim, pessoas só com fonte. A semente só nomeia ocupantes com
mandato fixo confirmado em fonte oficial e com `verificado_em` (Presidente,
Vice, Casas do Congresso, STF, STJ, TSE, TCU, PGR, Banco Central). Todo o
resto fica `null` até a ingestão preencher com fonte e data. Um campo vazio
é melhor que um nome errado, e 2026 é ano eleitoral: boa parte dos ministros
deixou o cargo em abril.

Situação do cargo:

| `situacao` | Significa | Regra |
|---|---|---|
| `titular` | ocupante efetivo | exige `ocupante` |
| `interino` | interino ou substituto | exige `ocupante`; o SIORG completo sinaliza substitutos |
| `vago` | cargo sem ocupante | é uma afirmação: exige `fonte` e `verificado_em` |
| `nao_verificado` | ainda não olhamos | padrão quando `ocupante` é `null` |

O `ler_dou.py` produz um relatório dos atos de pessoal da semana (seção 2
do DOU) por órgão, mas não altera o grafo: quem decide é quem revisa o PR.

## Segundo nível

A semente traz à mão as secretarias finalísticas da Saúde (Decreto
11.798/2023), da Educação (Decreto 11.342/2023) e da Justiça (Decreto
11.348/2023). O `montar_grafo.py` adiciona as dos demais ministérios a partir
do SIORG (unidades do tipo "Secretaria" diretamente abaixo do ministério),
sem duplicar as curadas.

## Fontes

| Fonte | O que dá | Acesso |
|---|---|---|
| [SIORG](https://estruturaorganizacional.dados.gov.br) | árvore completa do Executivo federal, natureza jurídica, competências, titulares | API pública, sem chave |
| [Dados Abertos da Câmara](https://dadosabertos.camara.leg.br) | deputados, Mesa, comissões, votações | API pública, sem chave |
| [Dados Abertos do Senado](https://www12.senado.leg.br/dados-abertos) | senadores, Mesa, comissões | API pública, sem chave |
| [Portal da Transparência](https://api.portaldatransparencia.gov.br) | órgãos SIAFI, orçamento e despesa por órgão | API pública, exige chave gratuita |
| [Diário Oficial da União](https://www.in.gov.br) | nomeações e exonerações (fonte primária para ocupantes) | consulta e API do Querido Diário/DOU |
| Constituição de 1988 e Lei 14.600/2023 | base legal de cada nó e relação | texto |

## Próximos passos sugeridos

1. Rodar os downloads em uma máquina com rede e ajustar os campos.
2. Preencher ocupantes com fonte e data; marcar vacância e interinidade.
3. Gerar o segundo nível (secretarias) a partir do SIORG.
4. Um agente semanal que lê o DOU (seção 2, nomeações) e abre um PR com as
   mudanças, como faz a CivLab.
5. Orçamento por órgão como tamanho do nó, opcional.
