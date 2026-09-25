# Exames laboratoriais — protótipo educativo

Entrega de 25/09/2026. Plantão → Exames laboratoriais, exclusivo da 2Doctor. Três fichas autorais em PT/EN/ES: hemoglobina, creatinina sanguínea e potássio sanguíneo. Não constitui biblioteca laboratorial completa nem interpretação clínica validada.

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
