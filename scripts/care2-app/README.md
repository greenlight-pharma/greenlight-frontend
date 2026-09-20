# Vytal Care2

Projeto independente do Care atual, originado do `vytal-care-web` commit `deaca619fe6008bc23eb88957cea561333541c29`.

- Página pública: `/vytal-care2/`.
- Aplicativo conectado: `/vytal-care2/app/`.
- Cadastro família: `/vytal-care2/app/familia`.
- Override opcional exclusivo: `VITE_CARE2_API_URL`; não herda configuração de outros painéis.
- Mesma API, autenticação e integração Pagar.me do Care atual. Nenhuma chave secreta no frontend. Configuração pública do checkout vem da API autenticada. Cartão tokenizado diretamente no Pagar.me; Pix e cupons passam pelo servidor existente.
- Dados e assinaturas reais compartilhados. A interface/código são independentes; não se trata de uma cópia dos dados.
- Sessão local usa `vytal-care2.sessao` para não colidir com outros apps no domínio.
- Recuperação de senha e confirmação de e-mail permanecem com os links emitidos pelo backend atual, que podem abrir o Care original; depois basta retornar ao Care2.
- Login Google só aparece com `VITE_CARE2_GOOGLE_CLIENT_ID` explicitamente configurado para este domínio. E-mail/senha são a entrada padrão.

## Desenvolvimento

`npm ci`, `npm test`, `npm run build`, `npm run dev`.

Prévia apenas em desenvolvimento: `/vytal-care2/app/?previa=familia`. Dados sintéticos; nunca preencha cartão nessa prévia. Build de produção remove esse caminho e exige autenticação real.

O build principal `scripts/build-vercel.sh` compila este projeto e publica apenas dist em `/vytal-care2/app/`. As fontes ficam em scripts, fora do conteúdo publicado. Vercel resolve rotas internas para o index apenas nesse prefixo.

## Validação

23 testes de modelos e contrato de sessão/API, compilação TypeScript/Vite e build completo do site. A validação visual local cobre landing, login/cadastro, painel família, avisos e checkout com fixtures locais. Não foram criadas assinaturas, enviados lembretes ou feitas cobranças reais durante a implementação. Validação final autenticada e cobrança homologada dependem de conta de teste.

## Programa Gestação

Rota `/gestacao` escolhe pessoa; `/p/:phone/gestacao` ativa por DPP/idade confirmada. Agenda editável, dúvidas, resumo imprimível, encerramento com histórico, doses do dia e resumo nos cartões. A API aditiva `/care2/pessoas/:phone/gestacao` persiste por conta+pessoa, exige vínculo/conta pessoal e versionamento para evitar sobrescritas. Backend deve ser publicado primeiro (greenlight-backend, CARE2-GESTACAO.md).

Compromissos avisam dentro do programa hoje/amanhã; exportação ICS usa horário de Brasília e alarmes1dia/1hora. O usuário precisa importar no calendário e permitir alertas. Não há novo envio WhatsApp/e-mail dos compromissos; medicamentos continuam com seu fluxo existente. Não há conteúdo clínico semanal gerado, avaliação de risco ou ajuste de doses. Conta compartilhada mantém acesso às informações; não há convite automático a familiar.

QA:29testes frontend e build; ativação por24semanas, dúvida e compromisso testados via CUA com fixturesDEV, inclusive390px. Banco e autorização testados no backend com PostgreSQL efêmero. Teste autenticado em produção ainda depende da conta de teste do usuário.

## Programas de cuidado

Menu pessoal: Início / Programas / Avisos / Conta. /programas permite escolher pessoa, buscar por nome/sinônimo e filtrar categoria; /programas/:phone mostra programas ativos/arquivados; /programas/:phone/:programa tem Hoje, Agenda, Anotações e Meu plano. Gestação mantém seu endpoint/rota anteriores e aparece no catálogo. 22 novos programas +Gestação; Outros cuidados cobre necessidades fora da seleção inicial. Conteúdo usa linguagem simples e perguntas para a equipe, não protocolos clínicos automáticos.

Dados por conta+pessoa+programa: ativação autorizada, cuidados diários definidos pelo usuário (última marcação, sem série histórica), agenda e ICS, anotações datadas, dúvidas, objetivo/orientações recebidas, impressão e arquivo/retomada. Medicamentos e medições remetem à mesma ficha existente, sem duplicar lembretes. Consultas não ganham WhatsApp automático; calendário exige importação/permissão do usuário. Arquivar não cancela medicamentos. Print mostra dados salvos, não rascunhos.

API care-programas.js no greenlight-backend: lista e GET/PUT versionado, auth+vínculo de conta pessoal, CAS409. Publicar backend antes do frontend. DEMO somente DEV, sintético e em memória. Fontes editoriais consultadas em20/09/2026: Ministério da Saúde, Diabetes (https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/diabetes), Hipertensão (https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/h/hipertensao), DRC (https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/drc), Uso Seguro de Medicamentos (https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-pessoa-idosa/uso-seguro-de-medicamentos). Perguntas não definem frequências, restrições ou condutas.

Validação:35testes frontend e build TS/Vite PASS. QA local com Maria fictícia: ativaDiabetes+Pressão alta, cria cuidado/anotação/dúvida/plano/consulta, aviso amanhã, menu móvel390px sem overflow. Backend462testes comPG sintético. Não rodaram jornada autenticada remota nem entrega real deWhatsApp/calendário. Site Care original e Pagar.me inalterados.

## Acompanhamento específico por programa — 20/09/2026

A aba Meu cuidado muda conforme a condição, com 22 definições em programas/personalizacao.json. Diabetes e hipertensão leem apenas o tipo correspondente de medição do resumo familiar autorizado (30 dias, gráfico dos 12 últimos registros). O diário registra contexto; não duplica medições na ficha. IC tem peso/sintomas; DRC tem resultados de laudo e unidades; diálise tem sessões; polifarmácia confere os medicamentos reais ativos e preserva nome/dose no histórico; pós-operatório tem cirurgia/data/alta, dias decorridos, dor e curativo. Asma/DPOC, memória, Parkinson, pós-AVC, dor, ossos, tireoide, saúde mental e oncologia têm campos próprios. Gestação mantém a jornada anterior.

Persistência: acompanhamento opcional em Programa, contendo perfil e registros datados (máximo 365). Campos validados na API pelo ID do programa; contrato antigo permanece válido. Backend preserva atomicamente a extensão existente quando cliente antigo a omite; CAS protege edições. Campos vazios não viram zero. Dor usa gráfico fixo de 0 a 10; outras medidas têm escala explícita. Gráficos não classificam melhora ou risco. Conferência de medicamentos não calcula interações, não altera doses e não prescreve. Novos registros não disparam alertas nem mensagens. Impressão inclui os registros exibidos; Ver mais expande o histórico.

Validação: 468 testes backend com PostgreSQL sintético e 42 frontend; build passou. QA fictício via CUA: diabetes mostra glicemias 104/112; conferência de medicamento com dificuldade de horário; pós-operatório com cirurgia em 15/09 mostra 5 dias em 20/09; registro de dor zero e curativo; 390px sem overflow. Os esquemas dos 22 programas têm testes, mas não houve revisão manual de cada fluxo. Não foram testados login remoto real ou envios reais.

Referências editoriais oficiais, sem gerar protocolos automáticos:
- https://linhasdecuidado.saude.gov.br/portal/insuficiencia-cardiaca-%28IC%29-no-adulto/sou-paciente
- https://linhasdecuidado.saude.gov.br/portal/asma/sou-paciente/
- https://linhasdecuidado.saude.gov.br/portal/doenca-renal-cronica-%28DRC%29-em-adultos/sou-paciente
- Referências de diabetes, hipertensão e pessoa idosa na seção anterior.
