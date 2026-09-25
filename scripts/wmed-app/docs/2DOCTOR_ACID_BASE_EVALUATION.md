# Gasometria — corpus offline v1

25/09/2026. Entrega de engenharia para revisão. **38 exemplos sintéticos autorais; nenhuma avaliação de pacientes, nenhum modelo e nenhuma interpretação clínica habilitada.** O corpus não mede sensibilidade, especificidade, desempenho diagnóstico ou competência profissional. A aprovação médica e terminológica permanece pendente.

## Como executar

A partir da raiz desta worktree:

```sh
node scripts/wmed-app/evaluation/acid-base/evaluate.mjs
cd scripts/wmed-app
npm test
```

O comando imprime JSON e sai com código 1 se alguma expectativa divergir. Não faz chamadas de rede, grava dados clínicos ou utiliza GPU. As constantes esperadas foram escritas separadamente da implementação; o executor de referência não importa as expectativas. Ainda falta conferência aritmética por revisor independente. As entradas não representam trajetórias fisiológicas reais: os casos de limites e observações discrepantes são testes de software.

## Contrato proposto, somente offline

- Entradas identificam fórmula, população, valores, unidade, origem e grupo fictício de coleta. Não há nomes, datas de nascimento ou relatos de pacientes.
- A saída pode conter apenas `status`, motivo de bloqueio ou números/unidade previstos. Campos extras como diagnóstico, normalidade, urgência e tratamento fazem a comparação falhar.
- O cálculo usa as fórmulas existentes de ânion gap e Winter. Limites numéricos são guardas herdadas de software, não valores normais nem limiares clínicos validados.
- O contrato experimental exige adulto e mEq/L. O bloqueio de mmol/L significa **unidade ainda não implementada nesse contrato**, não que mmol/L seja clinicamente inadequada. Não há conversão automática de unidades.
- Gap usa valores do mesmo painel de química. Winter exige contexto de acidose metabólica declarado, amostra arterial, origem explícita do bicarbonato e reconciliação declarada de discrepâncias. Essas declarações não podem ser inferidas pelo algoritmo a partir dos números.
- `collection` é uma identificação sintética do grupo de coleta, não um critério validado de simultaneidade. Paineis de horários diferentes param para revisão; nenhuma tolerância temporal foi inventada.
- Na observação opcional de Winter, a unidade de pressão precisa ser mmHg e o grupo de coleta precisa coincidir. **pH e PCO₂ observados não são interpretados nem validados fisiologicamente por este executor.** Também não são usados para declarar distúrbios mistos, compensação adequada ou ausência de doença. Os testes demonstram justamente que o resultado aritmético não muda com esses campos.
- Qualquer bloqueio descreve o escopo restrito deste protótipo. Não significa contraindicação clínica universal. Não transportar essas regras para produção sem revisão.

## Fontes e direitos

Conferidas em 25/09/2026:

- [Merck Manual — Acid-Base Disorders](https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders), revisão março/atualização abril de 2025: referência editorial do próprio publicador para as fórmulas e distinção das origens de bicarbonato. Não é estudo de validação da 2Doctor. Copyright reservado; nenhum texto extenso, tabela ou mídia copiados.
- [MedlinePlus/NLM — Arterial Blood Gas Test](https://medlineplus.gov/lab-tests/arterial-blood-gas-abg-test/): referência institucional sobre amostra arterial e componentes da gasometria.
- [MedlinePlus — uso do conteúdo](https://medlineplus.gov/about/using/usingcontent/): informações de exames médicos em EN/ES estão em domínio público; isso não se estende à enciclopédia e a toda mídia. Somente links e síntese própria usados aqui, sem assets externos. Source: MedlinePlus, National Library of Medicine.

Os casos e expectativas são próprios; não foram copiados bancos de prova, casos de terceiros ou dados clínicos. O corpus é para avaliação de software, não treinamento.

## Testes e revisão

38/38 cenários aprovados no executor de referência. Suíte completa178/178, build2Doctor e build completo do site aprovados; aviso habitual de bundle de questões grande. A suíte verifica ainda: imutabilidade das entradas; rejeição de coeficiente alterado, gap negativo zerado e campos inventados; detecção de bypass de amostra/unidade/contexto; isolamento do corpus em relação a `src`, `shared`, `server` e ao Dockerfile. Aprovação destas verificações não valida o contrato clínico.

Revisão humana pendente para cada linha abaixo. Antes de um protótipo público: revisar domínios e metadados; definir origem/tempo de coleta e nomenclatura; preparar coerência de pH/PCO₂/bicarbonato com fontes e incerteza; confirmar casos simples/mistos por especialista. Sem isso, manter a interpretação automática desabilitada. Não há proposta de doses, urgência, ventilação ou tratamento nesta entrega.

## Estado de publicação

Nenhum arquivo desta avaliação é importado ou copiado para o runtime Docker. Esta rodada não altera telas nem requer republicação: permanece a versão `df4dcb2`, deployment `8b5a138f-d11c-4ab8-a179-5ca4876dfa36`. O menu móvel da versão pública foi conferido em 390px, sem overflow horizontal ou erros de console. Aparelhos físicos, VoiceOver, login, chat, áudio e avaliação médica independente não testados.

## Lista para revisão

Valores numéricos esperados abaixo são constantes autorais, não saídas de um modelo. Todos os itens aguardam revisão clínica independente.

| ID | Cobertura | Expectativa técnica | Revisão |
|---|---|---|---|
| gap-basic | arithmetic | 12 mEq/L | Pendente |
| gap-decimal-comma | decimal | 12 mEq/L | Pendente |
| gap-negative | negative-result | -4 mEq/L | Pendente |
| gap-lower-input-bounds | bounds-not-normal-ranges | 29 mEq/L | Pendente |
| gap-upper-input-bounds | bounds-not-normal-ranges | -30 mEq/L | Pendente |
| gap-outside-bound | bounds | Bloquear: invalid-number | Pendente |
| gap-hex | input-format | Bloquear: invalid-number | Pendente |
| gap-missing-chloride | missing | Bloquear: missing-measurement | Pendente |
| gap-empty-bicarbonate | missing | Bloquear: incomplete-number | Pendente |
| gap-unit-absent | units | Bloquear: unsupported-unit | Pendente |
| gap-unit-mgdl | units | Bloquear: unsupported-unit | Pendente |
| gap-unit-mmol | units-not-yet-enabled | Bloquear: unsupported-unit | Pendente |
| gap-mixed-collection | collection | Bloquear: collection-mismatch | Pendente |
| gap-missing-collection | collection | Bloquear: missing-collection | Pendente |
| gap-mixed-source | bicarbonate-origin | Bloquear: unsupported-source | Pendente |
| gap-child | population | Bloquear: unsupported-population | Pendente |
| winter-basic | arithmetic | 26 mmHg / intervalo 24–28 | Pendente |
| winter-comma | decimal | 26.75 mmHg / intervalo 24.75–28.75 | Pendente |
| winter-low-bound | bounds-not-normal-ranges | 9.5 mmHg / intervalo 7.5–11.5 | Pendente |
| winter-high-bound | bounds-not-normal-ranges | 53 mmHg / intervalo 51–55 | Pendente |
| winter-outside-bound | bounds | Bloquear: invalid-number | Pendente |
| winter-exponent | input-format | Bloquear: invalid-number | Pendente |
| winter-extra-precision | input-format | Bloquear: invalid-number | Pendente |
| winter-venous | sample | Bloquear: arterial-sample-required | Pendente |
| winter-unknown-sample | sample | Bloquear: arterial-sample-required | Pendente |
| winter-unconfirmed-context | context | Bloquear: context-unconfirmed | Pendente |
| winter-context-string | context | Bloquear: context-unconfirmed | Pendente |
| winter-unresolved-bicarbonates | bicarbonate-origin | Bloquear: bicarbonate-review-required | Pendente |
| winter-source-absent | bicarbonate-origin | Bloquear: unsupported-source | Pendente |
| winter-gas-bicarbonate | bicarbonate-origin | 26 mmHg / intervalo 24–28 | Pendente |
| winter-pco2-kpa | units-not-yet-enabled | Bloquear: unsupported-pressure-unit | Pendente |
| winter-observation-collection | collection | Bloquear: collection-mismatch | Pendente |
| winter-ph-apparently-normal | no-primary-diagnosis-inference | 26 mmHg / intervalo 24–28 | Pendente |
| winter-observed-pco2-above | no-mixed-disorder-classification | 26 mmHg / intervalo 24–28 | Pendente |
| winter-observed-pco2-below | no-mixed-disorder-classification | 26 mmHg / intervalo 24–28 | Pendente |
| winter-no-observation | arithmetic-without-interpretation | 26 mmHg / intervalo 24–28 | Pendente |
| winter-observation-unit-absent | units | Bloquear: unsupported-pressure-unit | Pendente |
| unknown-formula | allowlist | Bloquear: unsupported-calculator | Pendente |
