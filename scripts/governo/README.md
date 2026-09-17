# Grafo do Governo Brasileiro

Um mapa navegável da estrutura da União, inspirado no
[US Gov Graph da CivLab](https://graph.civlab.org/us): Poderes, órgãos,
entidades da administração indireta, tribunais, cargos de comando e as
relações constitucionais entre eles (quem nomeia, quem aprova, quem
fiscaliza).

* Página: `governo/index.html`, servida em `/governo` (estática, sem
  dependências externas, canvas próprio).
* Dados: `governo/dados/governo-federal.json`.
* Fonte dos dados: os scripts desta pasta.

## Como o dado é produzido

```
semente.py  ─────────────────────────────┐
(estrutura curada à mão: CF/1988 e       │
 Lei 14.600/2023)                        ├──> montar_grafo.py ──> governo/dados/governo-federal.json
baixar_siorg.py     -> .cache/siorg.json │
baixar_congresso.py -> .cache/congresso.json
```

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

Estrutura sim, pessoas quase nunca. A semente só nomeia ocupantes com mandato
fixo e público (Presidente, Vice, presidências das Casas e do STF). Todo o
resto fica `null` até a ingestão preencher com fonte e data. Um campo vazio é
melhor que um nome errado, e 2026 é ano eleitoral: boa parte dos ministros
deixou o cargo em abril.

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
