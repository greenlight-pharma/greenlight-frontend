# Exames laboratoriais — protótipo educativo

Entrega de 25/09/2026. Plantão → Exames laboratoriais, exclusivo da 2Doctor. Quatro fichas autorais em PT/EN/ES: hemoglobina, creatinina sanguínea, potássio sanguíneo e sódio sanguíneo. Não constitui biblioteca laboratorial completa nem interpretação clínica validada.

## Funcionamento e limites

Cada ficha explica o que mede, contexto e uma limitação, com fonte e data. Comparador local exige resultado, limites inferior/superior e unidade do próprio laudo. Não impõe faixas universais, converte unidades, detecta valores críticos, classifica gravidade, diagnostica ou recomenda tratamento. Resultado dentro do intervalo não exclui doença. Exemplos claramente fictícios, sem pretensão de referência universal. Sem revisão clínica independente até o momento.

Decimais com ponto ou vírgula, até três casas e seis dígitos inteiros; rejeita sinais, expoentes, separadores de milhares e valores não numéricos. Comparação por inteiros escalados evita arredondamento nas fronteiras; extremos inclusivos. Exige limite superior maior que inferior. Edição invalida o resultado; troca de unidade ou exame limpa os números. Nenhum dado é enviado, salvo em armazenamento ou repassado ao chat; estado apenas em memória do componente. Sem API/modelo novo, gravação ou paciente real.

## Fontes primárias e licença

Conferidas em 25/09/2026:
- https://medlineplus.gov/lab-tests/hemoglobin-test/ — proteína das hemácias, hemograma, diferença de HbA1c e contexto.
- https://medlineplus.gov/lab-tests/creatinine-test/ — função renal, influências musculares/alimentares/medicamentosas e limitações.
- https://medlineplus.gov/lab-tests/potassium-blood-test/ — função eletrolítica e influência da coleta.
- https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/ — referências variam por laboratório/população; comparação não equivale a diagnóstico.
- https://medlineplus.gov/about/using/usingcontent/ — seção Medical test information em domínio público, incluindo inglês/espanhol. Atribuição exibida: MedlinePlus, National Library of Medicine. Não foram reutilizadas enciclopédia A.D.A.M., monografias farmacológicas ou imagens de terceiros. Textos e traduções curtos autorais; nenhuma afiliação ou endosso alegado.

## Verificação

160 testes passaram, incluindo fronteiras exatas, vírgula decimal, entradas inválidas, referências invertidas, unidades e limpeza. Build 2Doctor e build completo do site aprovados; aviso já existente de bundle de questões grande. CUA local: 320/390 px e desktop 1280, PT/EN/ES, claro/escuro; sem overflow horizontal em 320 (client/scroll 305), números em 16px, menu acessível. Conferidos exemplo, abaixo/dentro, edição sem resultado antigo, erro de faixa, limpeza na troca de unidade/exame e fontes. Console sem erros na aba de teste.

Não testados: aparelhos físicos/Safari nativo, fluxos autenticados, avaliação clínica independente, inferência clínica ou pacientes reais. Testes técnicos não validam uso diagnóstico.

## Publicação e próximo passo

Preparado para publicação isolada em 2doctor-web. Rollback técnico: reconstruir b18ea90 usando scripts/wmed-app e --path-as-root. Próximo: atalhos explícitos do chat às ferramentas existentes, sem enviar conteúdo clínico automaticamente; revisão clínica independente antes de ampliar a ficha para orientação clínica.

## 25/09/2026 — Protótipo laboratorial publicado

Fonte 53adf62; deployment fccabdf6-c0fb-4294-969b-4e2bbf99211c SUCCESS no projeto 2doctor, serviço 2doctor-web. Upload executado em scripts/wmed-app com --path-as-root. Healthz200/product2doctor; página200; asset index-BcTdScwQ.js idêntico ao build local eHTTP200. URL: https://2doctor-web-production.up.railway.app/2doctor/#exames-laboratoriais . CUA público390px: três fichas, exemplo fictício comparado, troca de unidade apagou três números e resultado; client/scroll375 semoverflow, console semerros. Valores limpos e viewport restaurado.

160 testes e builds 2Doctor/site completo aprovados. Protótipo educativo com fonte/licença MedlinePlus documentada, sem revisão clínica independente, não diagnostica nem identifica valores críticos. API Vytal/ECG intactos. Não testados aparelhos físicos, auth/histórico ou pacientes reais. Rollback reconstruindo b18ea90 no diretório correto. Próximo executável: atalhos contextuais explícitos do chat às ferramentas existentes (Scribe, fontes, exames), sem transmitir relato ou inferir diagnóstico. Revisão clínica independente necessária antes de orientação clínica adicional.



## 25/09/2026 — Ficha de sódio pronta

Adicionada quarta ficha em Exames laboratoriais: sódio sanguíneo, autoral PT/EN/ES, conceito, contexto e limites. Unidades mmol/L e mEq/L, exemplo fictício140/135–145 com aviso de que não é faixa universal. Comparação usa somente intervalo informado; sem cálculo de reposição, urgência ou conduta. Fonte em espanhol quando UIes; fonte inglesa em PT/EN. Data e versão do acervo2026-09-25.2 visíveis; protótipo sem revisão clínica independente. Sem transmissão/persistência/modelos/alteraçõesAPI Vytal/ECG.

Fonte primária conferida25/09/2026: https://medlineplus.gov/lab-tests/sodium-blood-test/ e https://medlineplus.gov/spanish/pruebas-de-laboratorio/prueba-de-sodio-en-la-sangre/ . Contexto de referências: https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/ . Licença: https://medlineplus.gov/about/using/usingcontent/ declara Medical Test information domínio público EN/ES; atribuiçãoMedlinePlus/NLM preservada. Textos/traduções curtos próprios, sem copiar mídia/enciclopédia/monografias farmacológicas.

171 testes/build2Doctor/sitecompleto aprovados; aviso habitual chunksgrandes. Novo teste cobre limites inclusivos nas duas unidades, vírgula, faixa fornecida diferente, unidade inválida e limpeza. CUA local PT/EN/ES320/390/1280, claro/escuro, exemplo,134,999 abaixo, edição invalidaresultado, trocaunidade/exame limpa números; fonteES correta, semoverflow(305/305 em320), console semerro. Não testados aparelhosfísicos/Safari/VoiceOver, autenticação/chat/anexos ou revisão clínica/terminológica externa. Próximo: commit/publicar só2doctor-web pelo cwdapp/path-as-root; exigirSUCCESS/health/asset/UI. Rollbacke5aa755. Depois auditar calculadoras existentes de ânion gap e Winter e especificar fluxo educativo de gasometria, com domínios/limites/fontes/testes antes de liberar nova interpretação.

