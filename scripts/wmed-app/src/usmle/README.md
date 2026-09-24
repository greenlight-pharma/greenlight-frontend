# WMed USMLE Review

Conteúdo próprio da WMed, em inglês, para quem estuda para o USMLE (Step 1 e Step 2 CK).
Primeira leva escrita em 24/09/2026 com apoio de IA (Claude): 8 áreas, 24 temas, 120 flashcards.

- Formato igual ao acervo ENAMED: tema = resumo em markdown com seção **Exam trap.**, 5 cartões por tema.
- A tela é a mesma (`src/study/StudyDeck.jsx`); o progresso fica em `wmed:usmle:v1:<conta>`, separado do ENAMED.
- O conteúdo fica em inglês mesmo com a interface em português, porque a prova é em inglês.
- `tests/usmle.test.mjs` confere estrutura, 5 cartões por tema, seção Exam trap e ausência de português.

**Antes de liberar amplamente:** revisão médica e editorial de cada tema contra referências atuais
(ACC/AHA, GINA, GOLD, ADA, IDSA, CDC, entre outras). Os números de corte e condutas mudam com as diretrizes.
USMLE® é um programa conjunto da FSMB e do NBME; a WMed não tem vínculo com eles.

Próximos passos sugeridos: ampliar para ~150 temas cobrindo os sistemas do Step 1 e as disciplinas do Step 2 CK,
e criar um banco de questões em formato de vinheta clínica (o formato da prova).
