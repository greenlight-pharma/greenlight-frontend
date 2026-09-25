# Ânion gap e Winter — auditoria e próxima etapa

25/09/2026. Estado: calculadoras educativas existentes, sem interpretação completa de gasometria ou revisão clínica independente. Esta rodada corrige entrada/apresentação apenas no build2Doctor e especifica um fluxo futuro; não libera motor diagnóstico.

## Auditoria do código existente

- Ânion gap: Na − (Cl + HCO₃), sem potássio e sem correção por albumina. Entradas e resultado em mEq/L. Não há faixa normal automática; comparar com referência do laboratório. Gap negativo é preservado numericamente, nunca truncado para zero ou traduzido como diagnóstico.
- Winter: 1,5 × HCO₃ + 8 ±2 mmHg, apenas no contexto de acidose metabólica previamente identificada. Não calcula pH nem identifica por si só distúrbio primário; PaCO₂ refere-se à amostra arterial. Não é alvo de ventilador.
- Limites existentes de entrada preservados: Na80–200, Cl50–170, HCO₃1–60 para gap; HCO₃1–30 paraWinter. São guardas de software herdadas, NÃO faixas normais ou validação desses domínios em toda população. Nenhum limiar clínico novo.
- Achado técnico reproduzido: Number() no motor compartilhado aceita hexadecimal e expoentes, por exemploNa0x8c→140. Novo adaptador2Doctor restrito às duas calculadoras exige strings decimais com ponto/vírgula e até3casas; rejeita coerções, sinais, expoentes, milhares e precisão excedente. Não trunca texto para fazê-lo passar. Campos vazios continuam pendentes; erro marca apenas o campo afetado e remove resultado.
- Motor compartilhado/WMed e outras três fórmulas intactos. CSS e contexto novos aplicados somente pela classe2Doctor. Sem novos endpoints/modelos/dados salvos ou transmissão.

## Apresentação

Winter destaca o intervalo calculado e mostra a estimativa central abaixo. Gap tem rótulo específico. Instruções PT/EN/ES identificam os limites de entrada, formato aceito e alcance educativo. Instruções comuns aparecem uma vez; unidades e limites ficam em cada campo. Fontes existentes e coeficientes preservados; nenhuma tabela/imagem externa copiada.

## Fonte e direitos

Consultada25/09/2026: https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders , seção de diagnóstico e cálculo do gap; revisãoMar2025/atualizaçãoAbr2025. Autor/editor da fonte primária de referência consultada: Manual Merck. Fórmulas e contexto conferidos; exemplos numéricos de teste são próprios. Fonte protegida por copyright, não presumir licença aberta para texto/tabela/imagem. Apenas link externo e explicações curtas próprias; nenhum conteúdo de mídia ou manual foi incorporado. TentativaUCSF HospitalHandbook retornou503, não usada como confirmação adicional.

## Especificação futura — não implementada

Fluxo educativo separado, começando por exemplos inteiramente fictícios, sem áudio, paciente ou persistência:
1. Identificar tipo de amostra, unidades, momento da coleta e valores efetivamente disponíveis. Não substituir automaticamente PaCO₂ arterial por PvCO₂ venosa.
2. Apresentar pH, bicarbonato e PaCO₂ com seus significados e incertezas, distinguindo acidemia de acidose. Não inferir distúrbio primário apenas por bicarbonato baixo ou excluir distúrbios mistos por pH na faixa de referência.
3. Usar as duas fórmulas existentes dentro do contexto apropriado; tornar visível qual bicarbonato foi informado (química sérica versus gasometria), sem mesclar amostras/horários silenciosamente.
4. Correção por albumina, delta gap, compensação aguda/crônica e classificação de distúrbios mistos exigem contrato específico, fontes, avaliação e revisão médica antes de ativação. Nada disso foi adicionado.
5. Sem doses, reposição de bicarbonato/líquidos, ventilação ou triagem de urgência. Validação aritmética não comprova utilidade clínica.

Critérios de liberação futura: fixtures autorais revisadas com alterações simples/mistas, pH aparentemente normal, amostra venosa/arterial, bicarbonatos discrepantes, unidades ausentes/incompatíveis, limites exatos e dados incoerentes; comparação manual independente das fórmulas; revisão terminológicaPT/EN/ES e licença por fonte. Confirmar conduta esperada para fora do domínio, sem inventar recomendações.

## Verificação desta rodada

174 testes passaram: entradas coercíveis rejeitadas, ponto/vírgula, incompletos, limites herdados inclusivos, gapnegativo, erro porcampo traduzido, preservação motorWMed; exemplos próprios gap12 eWinter26/faixa24–28. Build inicial detectou chave JSX ausente, corrigida antes da verificação. Build2Doctor e site completo aprovados na edição final. Uma chamada do build completo no cwd incorreto gerou saída transitória na pasta do app e falhou; essa saída foi removida. Uma execução concorrente encontrou essa saída durante a limpeza e também falhou; a repetição final no cwd raiz correto terminou com código0. Nenhum desses resultados foi usado como aprovação. CUA: PT/EN/ES320/390/1280, claro/escuro, hex/expoente/precisão extra rejeitados, resultado antigo retirado, gap12 eWinter24,75–28,75, trocaidioma preserva números, limpar, fonte; semoverflow econsoleerros. Ajuste final reduz fonte da faixa para caber no cartão desktop.

Não testados iPhone/Safari/VoiceOver físicos, auth/chat/anexos reais, uso com pacientes ou revisão médica independente. Esta rodada não corrige/audita as versões conceituais de outros scores existentes.

Próximo executável: corpus offline autoral de gasometria para revisão, cobrindo domínio/amostra/unidades e resultados aritméticos; manter interpretação automática desligada. Rollback98dfccb no diretório scripts/wmed-app. Publicação somente2doctor-web apósSUCCESS/health/asset/UI.

## Publicação verificada

Fonte df4dcb2; Railway8b5a138f-d11c-4ab8-a179-5ca4876dfa36 SUCCESS somente2doctor-web. Health200, página200 e assetindex-DFucSo4o.js idêntico ao build local/HTTP200. CUA público390: Winter12→24–28/centro26, expoente rejeitado e resultado removido, aria-invalid=true, limpar, semoverflow/consoleerros. Viewport restaurado; aba43 mantida. Servidor local5211 encerrado. Limites de avaliação acima permanecem.
