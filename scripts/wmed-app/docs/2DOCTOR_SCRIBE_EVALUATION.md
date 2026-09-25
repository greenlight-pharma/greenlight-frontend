# Scribe — contrato extrativo e avaliação offline v1

25/09/2026. **Ferramenta de desenvolvimento; nenhum modelo avaliado ou ativado.** Não é transcrição, geração livre ou validação clínica. A UI publicada continua sendo a demonstração fixa anterior.

## Entrega executável

Em `evaluations/scribe/`:
- `contract.mjs`: contrato estrito de extração, validação mecânica e comparação com anotações fictícias.
- `fixtures.mjs`: 18 relatos autorais, seis situações em PT-BR/EN/ES. Os dois exemplos do protótipo são reaproveitados; quatro situações novas.
- `run.mjs`: CLI local sem rede, modelo, GPU, persistência clínica ou chamada à API Vytal. Avalia somente o conjunto completo de casos fictícios; não aceita denominador escolhido pelo candidato.
- `tests/scribe-evaluation.test.mjs`: regressões de conteúdo, formato, erros, cobertura e saída da CLI.

Não são arquivos importados pelo frontend ou backend. Não há endpoint novo e não há alteração no app público nesta rodada. Corpus para desenvolvimento/avaliação, não treinamento. Traduções e anotações ainda não passaram por revisão clínica independente.

## Contrato v1

Entrada do validador: `{text, locale}`. Idiomas exatos: `pt-BR`, `en`, `es`; até 24.000 unidades UTF-16; relato não vazio. O sistema chamador preserva o texto original. Não normalizar espaços, decimal, Unicode ou quebras de linha antes de conferir a resposta.

Saída:
```json
{
  "version": "scribe-extractive-v1",
  "sourceHash": "sha256 do texto original codificado em UTF-8",
  "locale": "pt-BR",
  "blocks": [
    {"section": "subjective", "start": 0, "end": 17, "text": "trecho literal..."}
  ]
}
```
O exemplo acima ilustra campos, não constitui uma resposta válida. Offsets `start/end` são inteiros em **unidades UTF-16**, intervalo `[start,end)`, sobre o texto original. Nenhum limite pode dividir um par substituto de Unicode. Quem produz offsets em Python deve converter índices de pontos de código explicitamente; índices de bytes também não servem.

- Até 128 blocos; seções permitidas: subjective, objective, assessment, plan.
- Texto deve coincidir exatamente com o intervalo de origem. Sem campos extras, texto livre lateral, confiança inventada ou recomendação nova.
- Intervalos sobrepostos/duplicados são rejeitados. Frases idênticas em posições diferentes têm referências distintas.
- Hash e idioma precisam corresponder à entrada, evitando aceitar resposta atrasada de outra revisão.
- Campos ausentes não são preenchidos. Lista vazia pode ser estruturalmente válida, mas falha no corpus se omitir trechos obrigatórios.
- v1 é **extrativo**, não aceita paráfrases nem tradução. É uma base conservadora para medir preservação antes de desenhar geração de texto livre. Não representa o contrato final de produção.

## Duas verificações diferentes

1. **Validação estrutural:** checa formato, versão/hash/idioma e citação literal. Não determina se a citação está completa, é clinicamente relevante ou preserva sentido. Exemplo: selecionar só “febre” dentro de “Nega febre” pode passar nesta etapa.
2. **Oráculo de desenvolvimento:** conhece os intervalos completos necessários em cada fixture e sua seção esperada. Rejeita omissões, recortes não previstos, classificação incorreta e reordenação cronológica dentro de uma seção. Assim o exemplo de negação invertida é rejeitado. O oráculo não existe automaticamente para um novo relato real.

Não inferir que passar o validador estrutural significa nota fiel. Um futuro sistema precisa de avaliação semântica com revisores, conjunto independente, gestão de erros e revisão profissional da nota antes de exportar. Mudança do texto continua invalidando a revisão no protótipo atual.

## Matriz do corpus

| Situação | O que deve permanecer | O que o teste detecta |
|---|---|---|
| História e achados | Negação, duração, temperatura e incerteza | Negação removida, plano inventado, omissão |
| Correção | 500→850 mg explicitamente como correção; frequência ausente; alergia incerta | Dose antiga isolada, frequência inventada, certeza de alergia |
| Atribuição | Diagnóstico da mãe distinto da pessoa atendida; relato do acompanhante | Confusão de sujeito e fonte |
| Medidas | Decimal, unidade, via e receita não conferida | mg por microgramas, troca de fármaco/via/valor |
| Cronologia | Ontem/hoje, lado direito, duas medidas repetidas, plano condicional | Inversão de ordem, fusão de ocorrências, corte Unicode |
| Instrução colada | Relato e diagnóstico não definido | Trecho imperativo indevido incluído como exame normal |

A exclusão da instrução colada é uma anotação manual da fixture. Não é demonstração de que um modelo resiste a prompt injection; não executamos um modelo. Variações clínicas reais podem permitir múltiplas organizações SOAP válidas; o oráculo estrito pode rejeitá-las. Isso mede adesão a este contrato, não qualidade clínica geral.

## Como executar

Na pasta `scripts/wmed-app`:
```sh
node evaluations/scribe/run.mjs --self-check
npm test
```
O self-check aceita as 18 respostas de referência e rejeita 72 mutações controladas (omissão, alteração de texto, seção errada, hash antigo). Isso testa o avaliador, não mede acurácia de IA.

Para avaliar respostas produzidas **apenas para este corpus fictício**:
```sh
node evaluations/scribe/run.mjs --responses /caminho/respostas-ficticias.json
```
Formato do arquivo: lista de `{caseId, output}`, um item por fixture, todos os 18 IDs exatamente uma vez; output segue o contrato. Entrada limitada a 2 MB. Não há modo que gere respostas nem conector de modelo. Não oferecer a CLI como ferramenta para receber relatos reais.

Códigos de saída: 0 se todos aprovados; 1 para falha de avaliação; 2 para arquivo/argumentos/batch inválidos. Relatório só contém IDs fictícios, códigos, contagens e hash do corpus. Erros não imprimem trechos de JSON nem caminhos. O programa não grava candidatos ou relatórios automaticamente; arquivos de entrada permanecem onde o operador os criou.

## Evidências e direitos

- Estrutura geral SOAP: Maryland Department of Health, Board of Acupuncture, https://health.maryland.gov/bacc/Pages/Professional-Documentation-(SOAP-Notes).aspx , relido em25/09/2026. Apenas nomes/separação dos campos, sem copiar exemplos/recomendações e sem generalizar suas regras de faturamento para outros países.
- Nabla descreve combinação de avaliação automática e revisão profissional: https://nabla.com/whitepapers/ai-for-clinical-documentation , relido em25/09/2026. É declaração do fornecedor; nenhum formulário enviado, whitepaper restrito baixado ou método proprietário copiado. Não é validação da 2Doctor.
- Casos, mutações e código desta rodada são autorais. Não foram usados dados de pacientes nem questões protegidas. Nenhuma licença de modelo foi aceita.

## Próximo passo executável

Ampliar revisão independente do contrato/corpus e especificar adaptador de avaliação separado do endpoint de feedback (que pode gerar hipóteses/condutas). Definir fonte/modelo, localização/retenção, custo, conjunto separado de avaliação e critérios antes de qualquer chamada gerativa. Não ativar geração livre ou afirmar aptidão clínica com o self-check. Uma entrega de produto independente possível é a demonstração SBAR a partir de relatos fictícios, com recomendações já ditas pelo profissional e origem rastreável.

## Resultado desta rodada

146 testes aprovados. Self-check:18 referências aceitas/72 mutações rejeitadas, `modelEvaluated:false` e `clinicalValidation:false`. Hash e saída em `evaluations/scribe/self-check.json`. Build2Doctor/sitecompleto e conferência pública registrados ao final da rodada. Não executados: inferência, áudio, revisão clínica independente, aparelhos físicos, login/histórico autenticado, benchmark de modelo.

## 25/09/2026 — Scribe: contrato e avaliação offline concluídos

Entrega sem mudança de runtime: evaluations/scribe/contract.mjs, fixtures.mjs, run.mjs e self-check.json; especificação emdocs/2DOCTOR_SCRIBE_EVALUATION.md na worktree2doctor-preview. Contrato extrativo estrito comhash/idioma, spansUTF-16, texto literal, rejeição de campos extras/sobreposição eoráculo de cobertura/seção/ordem porfixture.18relatos fictícios autorais(6situações×PT/EN/ES),18referências aceitas e72mutações rejeitadas no self-check. Testes adicionais mostram que citação literal sozinha NÃO prova preservação do sentido; recorte “febre” de“nega febre” só é barrado pelo oráculo anotado. Não confundir com avaliação/validação de modelo; nenhuma inferência executada. Anotações/traduções sem revisão clínica independente.

146testes +build2Doctor +sitecompleto passaram. ServiçoRailway3b94b127-d8cc-4afb-8e10-306eeaee937a segueSUCCESS, health200/product2doctor, assetindex-lHV5vGNd.js idêntico ao buildlocal. CUA público390px: exemplo de correção preserva500→850mg e frequência ausente, camposO/A vazios, cópia bloqueada sem revisão; semoverflow375=375, textareas semrolagem interna econsole semerros. Nenhum deploy novo porque somente ferramentas offline/docs/testes mudaram. Não rodados modelo/áudio/GPU/loginreal/aparelho físico/revisão clínica/benchmark real. API Vytal/ECG intactos, nenhum dado clínico oucontato externo.

Próximo executável: demonstrar SBAR com relatos fictícios e recomendações já informadas, aproveitando rastreabilidade e revisão; em paralelo de escopo futuro, revisar corpus/contrato e definir adaptador de avaliação separado dofeedback, modelo/localização/retenção/critérios antes dechamadasgerativas. Desafios continuam abandonados; pesosFleXrayNC continuam sem integração.

