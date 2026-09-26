## 2026-09-26 20:38 BRT — Mensagem de falha do chat publicada

Código6fe46a8, deployment b988a6c1-9341-47bf-883e-d25dbe805761 SUCCESS no serviço isolado2doctor-web. Healthz200/product2doctor; asset index-Bw2w0Ur4.js público idêntico byte a byte ao build local. CUA público390×844 confirmou novoasset, chat/menu/compositor carregados e ausência de overflow; viewport restaurado. Não provocada falha no servidor público; reprodução do HTTP502 e recuperação da pergunta conferidas apenas na fixture local, agora encerrada e abas92/93 fechadas.

223 testes aprovados/10 integrações ignoradas; builds app/site completos e diffcheck aprovados. Sem API Vytal, modelo, persistência ou dados reais alterados. Não testados produção autenticada, banco ou dispositivo físico. Próximo executável: preservar versão e verificar outra fricção concreta; se surgir erro de rede/stream distinto do HTTP nãoJSON, reproduzir separadamente antes de ampliar este tratamento.

## 2026-09-26 20:37 BRT — Erro de gateway no chat corrigido localmente

Rodada 23:30Z: estado/diário e planos lidos; Git inicial 2ce18fe e Railway e7140d4e SUCCESS/health200. Reproduzido em fixture local sem upstream/persistência: resposta HTTP502 em HTML exibia “Unexpected token '<' ... is not valid JSON”. Correção restrita ao frontend 2Doctor: parser de erro com fallback traduzido “O assistente não conseguiu concluir a resposta. Tente novamente.” para corpo HTML, vazio ou JSON sem mensagem válida. Mantém mensagens válidas da API e AbortError; tratamento de401 segue acessível quando corpo não éJSON. Pergunta recuperada e envio habilitado, sem reenvio automático. WMed mantém o fluxo anterior; API/modelos/dados não alterados.

223 testes passaram/10 integrações ignoradas por TEST_DATABASE_URL ausente; testes novos cobrem HTML/vazio PT/EN/ES, mensagens de401/429, formato inválido e interrupção. Builds2Doctor e site completo aprovados, aviso preexistente de chunks grandes; diffcheck limpo. Logs /tmp/2doctor-chat-error-{tests,build,site}.log. CUA390×844 local confirmou fallback, pergunta preservada, envio habilitado, sem overflow; screenshot conferido. Fixture de histórico é simulada, não valida salvamento. Não provocada indisponibilidade real nem rodaram chamada clínica, banco, Safari/VoiceOver físicos.

Próximo: publicar somente2doctor-web comcwdapp/--path-as-root; Dockerfile/railway.json conferidos; confirmar SUCCESS/health200/asset/interface pública. Rollback funcional b46b3dd. Não declarar publicação concluída antes da conferência.

## 2026-09-26 18:33 BRT — Rascunho do chat preservado na navegação móvel

Rodada 21:30Z: estado/diário e planos relidos. HEAD 7409714; nenhum código novo desde b46b3dd, somente dist-samu preexistente não rastreado. Railway e7140d4e-c2b2-48d9-ad1a-51759ee6c9f0 permanece SUCCESS, healthz 200/product 2doctor. Não houve publicação.

CUA público 320×568: rascunho não clínico digitado no compositor, Menu → Chat preservou texto e retornou foco a Abrir menu. Controles visíveis, sem overflow lateral (305px em viewport 320px); screenshot conferido. Rascunho removido por selecionar tudo/Backspace, campo vazio e envio desabilitado confirmados. O fill vazio da automação não limpou o campo na primeira tentativa; teclado funcionou, sem evidência de falha de exclusão pelo usuário. Nenhuma solicitação enviada, conta acessada ou persistência clínica testada. Viewport restaurado.

Sem nova regressão reproduzível; nenhum ajuste artificial ou recurso criado. Testes e builds não repetidos porque código segue o snapshot verificado em 20:30Z (220 passaram, 10 integrações ignoradas, builds app/site completo aprovados). Não rodaram login/histórico autenticado, banco, iPhone/teclado iOS/VoiceOver físicos ou avaliação clínica. Próximo passo: preservar esta versão e atuar quando houver mudança de código ou fricção concreta; a reabertura do histórico depende de sessão de teste disponível, sem repetir pedido de login a cada rodada.

## 2026-09-26 18:03 BRT — Acesso móvel ao histórico sem sessão

Rodada 21:00Z: estado/diário e quatro planos relidos. Git b2481a4, código sem mudanças desde b46b3dd, somente dist-samu não rastreado. Railway e7140d4e-c2b2-48d9-ad1a-51759ee6c9f0 SUCCESS; healthz 200/product 2doctor; asset index-CNyOvHc2.js público idêntico ao build local. Nenhuma publicação ou alteração de produto.

CUA público 320×568: botão do histórico não aparece no cabeçalho estreito, mas Menu → Histórico está disponível. Sem sessão, abre entrada da conta com foco em Fechar entrada. Modal legível e sem overflow lateral (scrollWidth 305, viewport 320); fechar devolve foco a Abrir menu. Viewport restaurado. Não identificada regressão nesse percurso. Lista/reabertura de conversas salvas não conferida, pois navegador estava desconectado; não solicitada nova autenticação nem acessados dados privados. Não confundir teste de acesso ao histórico com validação de persistência.

Testes/builds não repetidos: código coincide com snapshot da rodada 20:30Z, com 220 testes aprovados/10 integrações ignoradas e builds app/site completo aprovados. Não rodaram autenticação real, histórico autenticado, banco, iPhone/Safari/VoiceOver físicos ou avaliação clínica. Sem mudança artificial para preencher rodada. Próximo: atuar em fricção reproduzível dos fluxos existentes; retomar reabertura do histórico em sessão de teste disponível, sem publicar por mera continuidade automática.

## 2026-09-26 17:35 BRT — Pesquisa no celular conferida, sem nova regressão

Rodada 20:30Z: estado/diário e planos lidos. Git b46b3dd (restrição regional de ENAMED feita por outra frente, preservada); somente medico-app/dist-samu não rastreado. Railway e7140d4e-c2b2-48d9-ad1a-51759ee6c9f0 SUCCESS, healthz 200/product 2doctor. Asset público /assets/index-CNyOvHc2.js idêntico byte a byte ao build local. Nenhum deploy ou mudança de produto por esta rodada.

CUA público 390×844: menu → Pesquisa → Fontes e estudos → busca bibliográfica “asthma”; loading encerrou com oito referências. Selecionar uma referência atualizou 1/8 e habilitou ações; “Ver seleção (1)” retornou ao painel com foco em “Sua seleção”. Sem overflow lateral (scrollWidth 375, viewport 390), screenshot legível. Busca e seleção limpas e retorno ao chat verificado; viewport restaurado. Nenhum dado de paciente, login, cópia/compartilhamento ou envio de caso. Conteúdo observado somente para QA de interface; não houve revisão clínica ou avaliação da relevância dos artigos.

230 testes existentes: 220 passaram, 10 integrações ignoradas por TEST_DATABASE_URL ausente. Build 2Doctor e build completo do site aprovados; diffcheck limpo. Logs /tmp/2doctor-2030-tests.log, -build.log e -site.log. Não rodaram iPhone/Safari/VoiceOver físicos, integrações de banco, fluxos autenticados, validação clínica ou teste geográfico real da alteração de outra frente. Nenhuma nova falha reproduzível neste percurso; não criado recurso para preencher a rodada.

Próximo passo executável: conferir fricção concreta relatada ou reproduzível nos fluxos existentes antes de editar; preservar estabilidade, sem ampliar catálogo, desafios ou Scribe. A automação não homologa nem expande as mudanças de comunidade da outra frente.

## 2026-09-26 17:02 BRT — Conferência de medicações sem nova regressão

Rodada20:00Z: estado/diário e planos lidos. Git2936955, sem mudança de código desde d9f0c8c e somente dist-samu não rastreado. Railway72349f44-0080-4eae-b871-42967daf1108 continuaSUCCESS; health200/product2doctor; asset/assets/index-DfjR_0wT.js comparado ao build local: idêntico=True.

CUA público390×844: abrir menu, pesquisar medica, abrir Medicações, buscar amoxicilina, abrir ficha, retornar porEnter. Busca preservada, dois resultados presentes e foco restaurado ao card selecionado; sem overflow na ficha/lista. Limpar filtros e voltar aoChat funcionou; viewport restaurado. Conteúdo apenas observado para verificar interface: não é revisão clínica, orientação de antibiótico nem validação do acervo. Nenhum login, dado de paciente, envio ou compartilhamento efetuado.

Sem regressão nova nesse percurso; nenhuma alteração de produto/deploy. Testes e builds não repetidos, pois o código coincide com o snapshot já verificado na rodada19:30Z (218 passaram,10 integrações ignoradas, buildsapp/site aprovados). Não rodaram iPhone/Safari/VoiceOver físicos, fluxos autenticados, integrações/banco ou avaliação clínica. Próximo: aguardar fricção concreta/retorno do usuário e preservar estabilidade; não gerar funcionalidades para preencher a rodada, nem ampliar desafios/comunidade por esta automação.

## 2026-09-26 16:33 BRT — Conferência móvel de calculadoras, sem alteração de produto

Rodada19:30Z. Estado/diário e planos GROWTH/SCRIBE/INTERNATIONAL/MOBILE relidos. Gitd9f0c8c, árvore limpa salvo dist-samu. Outra frente comitou compartilhamento público de casos como desafios e comunidade, incluindo persistência e metadados públicos. Isso não foi desenvolvido, ativado, utilizado para envio nem publicado por esta automação, cuja instrução continua vedando novos desafios/persistência clínica. Preservado trabalho existente; não considerar título/commit de outra frente como autorização para expandir esse escopo.

Railway72349f44-0080-4eae-b871-42967daf1108 SUCCESS; health200/product2doctor. Sem deploy nesta rodada. CUA público320×568: chat → Consultar um score → busca massa → IMC → valores sintéticos70/175 → Limpar → lista com busca preservada e foco no card → limpar filtros → Chat. Sem overflow; navegação, campos e retorno funcionaram. Conferência de interface/aritimética, não validação clínica de todos os scores. Não houve nova fricção reproduzível nesse percurso, portanto nenhum recurso ou ajuste artificial foi criado. Viewport restaurado, chat preservado.

Snapshot atual:228 testes,218 passaram/10 integrações ignoradas porTEST_DATABASE_URL ausente (nova integração da outra frente). Build2Doctor e build completo do site passaram; diffcheck limpo. Logs /tmp/2doctor-1930-tests.log, -build.log e -site.log. Nenhuma avaliação clínica, login/envio real, compartilhamento de casos, dados de pacientes, iPhone/Safari/VoiceOver físicos ou integração com banco rodou. Não inferir homologação da comunidade por esses testes.

Próximo: preservar versão estável; atuar em fricção concreta ou retorno do usuário. Antes de qualquer novo deploy, conferir mudanças de escopo da outra frente e não recriar desafios, enviar casos públicos ou alterar persistência por continuidade automática.


Observação ao encerrar19:00Z: surgiram alterações concorrentes não commitadas em server/accounts.mjs, db.mjs, railway.mjs e novo shared-cases.mjs. Não foram editadas, adicionadas ou publicadas intencionalmente por esta correção; não atribuir seu escopo a esta rodada. Na próxima retomada conferir estabilização e publicação da outra frente antes de qualquer deploy.

## 2026-09-26 16:07 BRT — Foco do caso publicado

Código10f73c9, deploymentce6ccf1c-b15c-4426-8684-7a944086e619 SUCCESS no2doctor-web. Health200/product2doctor, index-DGep-RQd.js público idêntico ao build local. CUA público390×844: Enter no card abriu caso com foco emVoltar à conversa/topo0; após carregar formulário, Tab foi paraMeus casos; Enter emVoltar restituiu foco ao card de origem. Sem overflow. Viewport restaurado, fixture encerrada e aba91 fechada. Publicação verificada; nenhuma API/modelo/persistência alterada por esta correção.

218 testes aprovados,9 integrações ignoradas; builds2Doctor/site completo e diffcheck aprovados. Teste dos dois atalhos e rascunho ficou na fixture local; no público, nenhum texto clínico/autenticação/envio foi feito. Não testados login aninhado, iPhone/Safari/VoiceOver físicos ou modalização completa; escopo foi transferência/restauração de foco. Próximo: manter versão estável e conferir apenas fricção reproduzível, preservando mudanças da outra frente e sem ampliar catálogo.

## 2026-09-26 16:03 BRT — Foco ao abrir e fechar caso clínico

Rodada19:00Z: estado/diário e planos relidos. Gitadac765 (outra frente adicionou mudança de senha; preservada), árvore limpa salvo dist-samu. Railway96bdff99 SUCCESS anterior, b079e43e emINITIALIZING na entrada. Reproduzido em CUA público390×844: abrir Discutir um caso porEnter mantém foco no botão atrás do formulário. Fechamento já havia mostradoBODY na rodada anterior.

Correção restrita ao main.jsx e produto2Doctor: ao abrir o painel, foco no botão Voltar à conversa com preventScroll; ao fechar, volta ao controle de origem somente se o foco ainda está no painel/BODY e o controle existe. Não toma foco de login/outra sobreposição nem reabre teclado. Não altera fechamento, rascunho, processamento ou API. Não adiciona role/aria-modal sem completar gestão modal; esse aspecto não é declarado resolvido.

CUA local390×844 com fixture sem upstream: Enter abriu com foco emVoltar; Tab seguiu paraMeus casos; digitar rascunho fictício e fechar voltou ao cardDiscutir; abrir pelo atalho do compositor preservou o texto e fechar devolveu foco àquele atalho. Sem overflow. 227 testes existentes:218 passaram,9 integrações ignoradas porTEST_DATABASE_URL ausente (nova integração de senha da outra frente); builds2Doctor/site completo e diffcheck aprovados. Logs /tmp/2doctor-case-focus-tests.log, -build.log, -site.log. Sem teste clínico/API autenticada/salvamento real/iPhone/Safari/VoiceOver físico; login aninhado não acionado, preservado por guarda de foco. Próximo: publicar só2doctor-web comcwdapp/--path-as-root, conferirSUCCESS/health/assets/interface. Dockerfile/railway.json conferidos. Rollbackadac765.

## 2026-09-26 15:38 BRT — Retorno do caso publicado e conferido

Código167fdfd, deployment96bdff99-d164-43b1-b072-2da6295d08d4 SUCCESS no2doctor-web. Health200/product2doctor. Assets index-lWz6mFns.js e ClinicalCase-B3SVMoZb.js públicos idênticos byte a byte ao build local. CUA público320×568, após carregamento do formulário: scrollTop0 e botão Voltar à conversa emy13, visível; retorno ao chat funcionou. Screenshot conferido, viewport restaurado. Fixture encerrada e aba90 fechada. Publicação desta rodada concluída; sem API/modelo/persistência alterados.

218 testes aprovados/8 integrações ignoradas; builds app/site e diffcheck aprovados. Não houve envio/autenticação/modelo clínico/pagamento, iPhone/Safari/VoiceOver físicos. Próxima fricção observável a avaliar: ao fechar overlay, foco retorna ao BODY em vez do botão que abriu o caso; o overlay também não declara role dialog. Tratar em correção pequena de foco se confirmado por teclado, preservando rascunho e modais de login; não ampliar catálogo. A ação Organizar meu relato está fixa por mudança da outra frente; qualquer ajuste deve respeitar essa simplificação recente.

## 2026-09-26 15:34 BRT — Retorno ao chat visível ao abrir caso

Rodada18:30Z: estado/diário/planos relidos. Git8fdf388, somente dist-samu preexistente. Frente paralela comitou simplificação de conta/caso e traduções; preservados, não atribuir a esta rodada. Railway1fb15cf6 SUCCESS na entrada, depois d5d07120-4682-43b0-8357-21b7b7f31cd3 SUCCESS em18:30:27Z. Health200. Fricção observada na interface pública320×568: abrir Discutir um caso dispara scrollIntoView do conteúdo e esconde cabeçalho/Voltar à conversa; scrollTop81, botão entre y-68 e-12.

Correção167fdfd restrita ao efeito de rolagem no ClinicalCase: no overlay2Doctor rola o próprio painel para0 ao abrir/trocar etapa; rota normal e outros produtos preservados. Cabeçalho não virou fixo. CUA local320×568: scrollTop0, botão y13–69 visível, sem overflow; digitar relato fictício, sair e reabrir preservou texto e topo. Fixture sem upstream, sem envio clínico/modelo/persistência. 226 testes existentes:218 passaram,8 integrações ignoradas por TEST_DATABASE_URL ausente (conjunto menor por remoções da outra frente, não por esta correção). Build2doctor/site completo/diffcheck aprovados. Logs /tmp/2doctor-case-return-tests.log, -build.log, -site.log. Sem avaliação clínica, geração/salvamento reais, teclado iOS/VoiceOver/Safari/iPhone físicos; transição de etapa com resposta real não executada.

Dockerfile/railway.json conferidos. Publicação solicitada só2doctor-web a partir do cwdapp/--path-as-root, ainda pendente deSUCCESS/health/asset/interface. Próximo: confirmar os critérios e testar botão público; não ampliar catálogo. Rollback8fdf388.

## 2026-09-26 15:02 BRT — Notas do chat: publicação confirmada na retomada

Rodada18:00Z. Relidos estado/diário e planos GROWTH/SCRIBE/INTERNATIONAL/MOBILE. Git agora1e345f1, alteração posterior da outra frente em cobrança/PlanPanel; árvore limpa salvo medico-app/dist-samu preexistente. Preservado esse trabalho, sem editar cobrança. Railway projeto2doctor/serviço2doctor-web confirmou deployment5e29cf84-7550-4348-99f5-cea6bcf238b9 SUCCESS, posterior às duas falhas de upload. Nenhum novo deploy necessário nesta rodada.

Correção58713f5 das notas do chat está incluída na versão pública: healthz200/product2doctor; asset /assets/index-DrsTFWO9.js byte a byte idêntico ao build atual e contém navegação das notas. SHA256c0144dc16b8b734362702e9dde51f4ed73f2ea8380bb7569c1552ffb0ef0a30e. Portanto o bloqueio de publicação registrado anteriormente está resolvido pela publicação posterior; não repetir upload antigo sobre trabalho atual.

Snapshot atual verificado:228 testes,220 passaram/8 integrações ignoradas por ausência de TEST_DATABASE_URL; build2doctor e site completo aprovados, diffcheck limpo. Logs /tmp/2doctor-1800-tests.log, -build.log, -site.log. CUA público390×844 confirmou abertura/fechamento do menu e retorno de foco, chat íntegro, sem overflow/inert residual; screenshot conferido e viewport restaurado. Fluxo de ida/retorno das notas com duas respostas e PT/EN/ES foi testado na fixture na rodada anterior, código inalterado; não houve envio autenticado real, pagamento/checkout, iPhone/Safari/VoiceOver físico ou avaliação clínica nesta rodada. Não alteradas API, modelos ou persistência.

Próximo executável: manter publicação estável e atuar apenas em nova fricção observável ou retorno do usuário; não ampliar catálogo nem recriar Scribe. Caso precise retomar notas, usar esta versão publicada como base, não a anterior aos uploads falhos.

## 2026-09-26 14:43 BRT — Publicação das notas bloqueada no upload

Código58713f5 concluído e testado. Duas tentativas railway up no cwdapp, com --path-as-root e service2doctor-web, expiraram no upload ao backboard antes de build. Primeira tentativa b76c7414-76fc-4b39-9c67-33eb49333493 FAILED, sem build associado. Não atribuir isso à aplicação nem afirmar publicação da correção. Health público200/product2doctor; asset público continua /assets/index-BH_QakA6.js. CUA público390×844 confirmou chat/menu da versão anterior carregando; viewport restaurado. Fixture local encerrada, aba89 fechada.

Próximo executável: verificar Git e estado do serviço, repetir publicação do código58713f5 quando o envio ao Railway estiver disponível; exigir SUCCESS, health200, asset novo idêntico ao build e interface pública. Não recriar funcionalidades para contornar bloqueio. Testes/builds e limites registrados na entrada anterior; não houve alterações de código após verificação. Site permanece na versão anterior, que já tinha notas no PDF, ainda sem notas clicáveis no chat. Sem mudanças API/modelo/dados/contas/cobrança.

## 2026-09-26 14:37 BRT — Notas navegáveis no chat 2Doctor

Rodada 17:30Z. Estado/diário e quatro planos lidos; Git13be04c, somente dist-samu preexistente. Railway24e35b93 SUCCESS e health200 antes da mudança. Fricção reproduzida no navegador: marcador e retorno das notas eram spans e título Footnotes. CitationText extraído em ChatResponseText, com IDs únicos por resposta, rótulos PT/EN/ES e navegação por foco/rolagem sem mudar o hash usado pelo roteador. Apenas âncoras geradas pelo processador de notas são habilitadas; política de links externos preservada. Comportamento antigo preservado fora do produto2Doctor. Não altera texto/modelo/fontes/API/PDF.

CUA local390×844 com fixture fictícia sem upstream: duas respostas usando nota com mesmo identificador mantiveram IDs distintos; clique no segundo marcador focou segunda nota e retorno focou segundo marcador; URL intacta e sem overflow. Título e retorno conferidos também em EN e ES. Screenshot móvel conferido. 228 testes existentes:220 passaram,8 integrações ignoradas por falta de TEST_DATABASE_URL. Builds2Doctor/site completo e diffcheck passaram. Logs /tmp/2doctor-note-nav-tests.log, -build.log, -site.log. Sem avaliação clínica, envio real autenticado, iPhone/Safari/VoiceOver físicos ou nova renderização do PDF. Dockerfile/railway.json conferidos. Publicação ainda pendente; próximo: publicar apenas2doctor-web e verificar SUCCESS/health/asset/interface. Rollback13be04c.

## 2026-09-26 14:11 BRT — Notas do PDF publicadas

Código6fcb133, deployment24e35b93-ac40-4ed8-a0e8-e4d3e11754b0 SUCCESS no2doctor-web. Railway demorou na preparação do snapshot, depois concluiu build/rollout. Healthz200/product2doctor; index-BH_QakA6.js e chat-pdf-B3hdYMSi.js públicos idênticos ao build. CUA público390×844 carregou chat/navegação, viewport restaurado. Verificação de assets durante BUILDING ainda mostrou versão antiga/404 do novo chunk; repetida somente apósSUCCESS e aprovada. Não foi falha da versão ativa.

220 testes aprovados,8 integrações ignoradas por falta de TEST_DATABASE_URL, buildsapp/site aprovados. Referências em notas do PDF testadas com fonte fictícia e download real local; não é avaliação clínica. Sem API/modelo/login real/Safari/iPhone físico. Nenhuma configuração de contas/cobrança alterada. Próximo: avaliar chamadas internas de notas na tela do chat (atualmente filtro só permiteHTTPS, sem salto à nota), mantendo mudanças pequenas; sem criar funcionalidades. Rollback210693b, dist-samu preservado.

## 2026-09-26 14:04 BRT — PDF: referências em notas de rodapé

Retomada17:00Z: documentos antigos estavam atrás do Git. Worktree limpa salvo dist-samu, HEAD210693b; frente anterior já comitou simplificação, contas/cobrança, traduções e nome do PDF. Railway f7cc7d3b-ed3b-4932-9fdb-564f3b77071f SUCCESS, health200. Não desfazer esses trabalhos nem atribuí-los a esta rodada. Nenhuma configuração de modelo/contas/cobrança/API alterada aqui.

Fricção reproduzida em chatPdfDefinition: Markdown com texto[^1] e definição da nota exportava só texto, perdendo tanto marcador quanto fonte. Correção no conversor: numera por primeira citação, preserva referências repetidas, inclui somente notas citadas, mantém formatação/URLs seguras e liga marcadores ao destino no PDF. Notas que citam notas incluídas sem duplicação cíclica. Dois testes de regressão cobrem notas/repetição/links por referência. Não inventa conteúdo nem busca fontes remotas.

228 testes:220 passaram e8 de integração de contas ignorados por TEST_DATABASE_URL ausente. Build2doctor e build completo do site passaram; diffcheck limpo. PDF fictício renderizado e revisado; CUA390×844 local gerou e baixou 2doctor-notas-no-pdf.pdf com nota/URL presentes, foco em Baixar PDF e sem overflow. Arquivo baixado também renderizado/inspecionado. Fixture sem upstream e sem persistência encerrada, aba88 fechada, viewport restaurado. Sem testes clínicos, API real autenticada ou iPhone/Safari físico. Logs /tmp/2doctor-pdf-notes-tests.log, -build.log e -site.log.

Código6fcb133; publicação solicitada apenas no2doctor-web com cwdapp/--path-as-root, aguardandoSUCCESS/health/asset/UI. Dockerfile agora inclui dependências de servidor de contas da frente anterior; conferido, sem editar. Rollback210693b. Observação para próxima revisão: chamadas internas de notas no chat são mostradas como texto (filtro de links), enquanto o PDF já mantém destino; avaliar como fricção separada, sem ampliar catálogo.

## 2026-09-26 09:36 BRT — Foco do PDF publicado

Código 8af0d2e, deployment c7b3ab39-ea7d-4320-acf6-1506658cbf2b SUCCESS exclusivamente no 2doctor-web. Healthz 200/product2doctor; asset index-CSGWDSvt.js público idêntico ao build local. CUA público 390×844 confirmou chat e navegação íntegros, viewport restaurado. Teste funcional do foco ficou na fixture local: Enter mantém foco durante geração e em Baixar PDF; Tab segue para próxima opção. 214 testes e builds app/site passaram. Não realizado envio autenticado em produção, iPhone/Safari/VoiceOver físico; não alterada geração do documento, prompt/API ou modelo. Próximo: acompanhar eventual fricção real ao salvar/compartilhar PDF; sem nova demanda ou regressão observável, manter versão estável. Rollback f379800; dist-samu preservado.

## 2026-09-26 09:33 BRT — PDF: correção do foco por teclado

Rodada 12:30Z. Git f379800; Railway 22b5df42-0727-47ff-9ad6-8679544f4382 SUCCESS confirmado. Fricção reproduzida em fixture isolada: ativar Gerar PDF por Enter fazia activeElement voltar ao BODY quando o botão recebia disabled. Ao terminar, o usuário perdia a posição na navegação.

Correção restrita à interface: aria-disabled/aria-busy preservam o foco durante geração; trava síncrona já existente impede segunda execução. Ao substituir pelo link, transfere foco com preventScroll somente se o usuário ainda estiver no botão. Contorno focus-visible torna a posição identificável. Documento PDF, API, modelo e persistência inalterados.

CUA local 390×844 com resposta fictícia: antes BODY; depois Gerando PDF focado, seguido por link Baixar PDF focado; Tab segue para Automático. Sem overflow, screenshot conferido. Fixture sem upstream/persistência, encerrada e aba87 fechada; viewport restaurado. 214 testes existentes, build2doctor, build completo do site e diffcheck passaram. Não repetida renderização do PDF (conteúdo não mudou), nem testes clínicos/login real/Safari/iPhone físico/VoiceOver. Próximo: publicar só 2doctor-web, conferir SUCCESS/health/asset/UI; não recriar Scribe nem ativar prompt pendente. Rollback f379800; dist-samu preexistente preservado.

## 2026-09-26 09:28 BRT — PDF do chat publicado e conferido

Commit0f6183c, deployment22b5df42-0727-47ff-9ad6-8679544f4382 SUCCESS no2doctor-web/projeto2doctor. Healthz200/product2doctor; index-RrkA_zBD.js e chunks pdfmake-BFTYH9M7.js, chat-pdf-r6KWyWfE.js, vfs_fonts-DhSc05oJ.js, symbols-Bp3breFH.js públicos idênticos ao build local. Interface pública do chat carregada viaCUA. Build completo do site passou na raiz da worktree; tentativa anterior no cwdapp falhou por diretório incorreto e foi refeita corretamente, sem alteração para contornar checks.

214 testes, buildapp/site e diffcheck passaram. Download real de resposta fictícia via navegador local inspecionado em PNG; PDF multipágina3p inteiramente revisado visualmente. Telas390×844 e320×568 sem overflow e alvo44px. Aba86/fixture encerrados, viewportrestaurado. Não testado download em iPhone físico/Safari nem envio autenticado em produção. Novo prompt continua desativado; API/modelo inalterados. Próximo: acompanhar uso real do botão, especialmente salvar/compartilhar no Safari, corrigindo eventual fricção observada sem ampliar escopo. Rollbacka0db5bd; preexistente dist-samu preservado.

## 2026-09-26 09:24 BRT — Exportação PDF por resposta do chat

Pedido direto: botão Gerar PDF nas respostas. Implementado ao lado de Copiar resposta, apenas 2Doctor, em respostas completas sem erro. Geração local sob demanda, sem API ou envio a terceiros; link Baixar PDF permanece disponível após download automático para reabrir/salvar. Estados gerando/erro, bloqueio de clique repetido e liberação de Blob ao desmontar. Resposta individual, sem anexos nem restante da conversa.

Markdown convertido em texto selecionável A4 com títulos, negrito/itálico, listas, tabelas de até4 colunas (cabeçalho repetido), tabelas largas como registros rotulados, links HTTP(S) e fontes existentes. Remove metadata TEMAS; nenhuma fonte inventada. Cabeçalho2Doctor, data de exportação e paginação. pdfmake0.2.20/MIT carregado dinamicamente; parser unified/remark/MIT. Roboto embutido; DejaVu local para símbolos/setas, licença preservada no código e /licenses/DejaVu.txt. Referência técnica https://pdfmake.github.io/docs/0.1/getting-started/client-side/ e /document-definition-object/tables/.

214 testes passaram. Build2doctor passou; build completo do site em andamento. Fixture /tmp/2doctor-pdf-fixture.mjs isolada, sem rede/upstream/persistência: CUA390×844 gerou resposta fictícia, clicou Gerar PDF, mostrou Baixar PDF e arquivo apareceu em Downloads/2doctor-resposta.pdf. Alvo44px/sem overflow. PDF baixado renderizado e inspecionado; teste multipágina3p com setas/acentos/tabelas revisado visualmente. Não testado iPhone físico/Safari ou chat real autenticado. Nenhuma mudança no prompt/modelo, história ou API. Próximo: concluir buildsite, publicar somente2doctor-web, conferirSUCCESS/health/assets/interface. Baseline a0db5bd; dist-samu preexistente preservado.

## 2026-09-26 09:18 BRT — Loading do feedback e remoção do Scribe publicados

Código 77cd829 publicado exclusivamente no 2doctor-web/projeto 2doctor. Deployment 26a1f830-1a05-4208-95b6-673f4556b077 SUCCESS; healthz público 200/product2doctor. Assets index-DKvjZs9w.js, ClinicalCase-DyE-0QJU.js e ClinicalCase-DXnPXreE.css públicos comparados byte a byte com build local: iguais. Deploy no cwd scripts/wmed-app com --path-as-root.

CUA público 390×844: busca por Scribe retorna nenhuma ferramenta; #caso carrega relato, áudio, revisão e acessos móveis. Viewport restaurado. Loading/erro/retry verificados antes em fixture local isolada (entrada anterior); 210 testes e builds app/site passaram. Não realizado envio autenticado em produção, medição de latência real, avaliação clínica ou iPhone físico/Safari. A demora de geração da IA não foi reduzida nem medida; corrigida a confirmação visual imediata, recuperação de erro e prevenção de envio duplicado.

Prompt dedicado preparado anteriormente permanece desativado (TWO_DOCTOR_CHAT_ENABLED não true), API Vytal/ECG intactos. Não recriar Scribe automaticamente. Próximo passo executável: em sessão de teste autenticada disponível, medir a duração de um feedback fictício antes de propor otimização do backend; preservar escopo da API e autorização pendente do prompt. Rollback de código 8be7c7a; pasta preexistente medico-app/dist-samu preservada.

## 2026-09-26 09:14 BRT — Feedback: tela de espera imediata e retirada do Scribe

Pedido direto: feedback demora, exibir loading ao solicitar e remover Scribe pois não corresponde ao desejado. Implementado somente2Doctor: etapa aguardando substitui revisão imediatamente; título focado, animação com reduced-motion, tempo decorrido (sem percentual/etapas fictícias), aviso de demora após30s e instrução de não reenviar. Trava síncrona evita evaluate duplicado. Erro devolve revisão preservando campos/confirmação e recebe foco; feedback recebido substitui loading antes da pontuação/salvamento. Nenhuma alteração no conteúdo clínico/API.

Diagnóstico por leitura: /case-feedback upstream retorna JSON completo após geração não streaming; tela anterior deixava indicador no fim do formulário. Não se mediu latência real nem se trocou modelo; mudança resolve ausência de confirmação visual, não promete reduzir geração. As etapas de quality/save permanecem existentes.

Scribe removido do registro de módulos, grupoLaboratório, atalhos e link no Radar; deep link#scribe cai no chat em vez de abrir demonstração. Código antigo de demonstração/testes permanece como histórico não importado, para não apagar trabalho. Transcrição/estruturação usadas por Caso clínico permanecem intactas. Atualizar direção: não recriar demonstração Scribe automaticamente.

210 testes existentes, builds2doctor/site completos e diff--check passaram. CUA local390×844 screenshot: loading visível imediatamente, foco no título.320×568 sem overflow. Fixture isolada /tmp/2doctor-feedback-fixture.mjs sem rede/persistência:35s→erro visível/focado y233–282; nova tentativa→loading→resultado enquanto quality ainda pendente8s; log confirmou2 requests para2 tentativas. BuscaScribe sem resultados; antigo#scribe abriuchat. Teste usa resultado fictício, não clínica. Não testado envio real/login/iPhone/Safari. Aba85/servidor encerrados; viewportrestaurado.

Próximo: publicar apenas2doctor-web após build; validarSUCCESS/health/assets/UI pública. Dockerfile/railway.json e projeto8e161bd1 conferidos. TWO_DOCTOR_CHAT_ENABLED=false confirmado; integração do prompt preparada antes viaja desativada, sem ativar API compartilhada nem novo prompt. Rollback8be7c7a; preexistente dist-samu preservado.

## 2026-09-26 09:01 BRT — Prompt pendente: regressão de limites verificada nos dois caminhos

Rodada12:00Z não é resposta à confirmação pendente de publicar extensão na API compartilhada. Nenhuma ativação/deploy. Git app a7d33d9 e API candidata f6e8610; preexistente medico-app/dist-samu preservado. Railway a033a3a6-9ab5-4105-94fd-42c431a062d8 SUCCESS, TWO_DOCTOR_CHAT_ENABLED não true (inspecionado booleano, sem valores secretos), health200/product2doctor.

Entrega independente: ampliado teste de limites para executar caminhos tutor atual e2Doctor opt-in.504 combinações idioma/país/estilo/com-sem anexos: pergunta2000, documento12000, imagem/PDF e preferências passam pela janela10/corte4000 sem perder final. Teste também confere endpoint escolhido.210 testes passaram; builds2doctor e site completo passaram, diff--check limpo. Nenhuma mudança de runtime nesta rodada. Testes são simulados e não atestam precisão clínica/posologia nem geração real.

CUA público390×844: chat acessível/campo visível e sem overflow horizontal; viewport restaurado. Não testados login/envio/modelo, iPhone físico/Safari, clínica, API real nova. Não repetida suíteAPI (sem mudança nela);5 testes/buildNest/prisma pertencem à etapa anterior. Logs /tmp/2doctor-prompt-budget-{tests,build,site}.log.

Próximo: aguardar resposta explícita já solicitada para avaliação/publicação da extensão compartilhada. Não repetir pedido nem ativar por heartbeat. Se outra fricção concreta não for observada, manter versão atual; não inventar recurso ou nova persistência. Candidata documentada em2DOCTOR_PROMPT_V1.md.

## 2026-09-26 08:40 BRT — Prompt exclusivo com doses: implementado, não ativado

Pedido explícito: usuário concordou em alterar o prompt da2Doctor e autoriza orientar doses. Preparado sistema 2doctor-clinical-support-v1 com apoio a médicos/estudantes, hipóteses/condutas e posologia para revisão profissional, unidades/intervalos/vias, dados necessários para ajustes e fontes honestas. Não proíbe doses em bloco; não inventa parâmetros nem promete certeza. Fontes FDA/OMS registradas em2DOCTOR_PROMPT_V1.md. Nenhuma prescrição concreta produzida.

Integração atual usa tutor Vytal com bloqueio em system; não é resolvido acrescentando instrução contraditória no texto user. Serviço2doctor-web sem credenciais diretas de modelo (somente nomes de variáveis foram inspecionados). Criada worktree isolada /Users/dilson/Vytal-Migracao-20260911/_worktrees/2doctor-prompt-api, branch codex/2doctor-prompt-20260926 a partir bdff9198. Nova rota /estudante/2doctor/chat-stream seleciona prompt no servidor, mantém JWT/role/instituição/quotas/modelo/SSE, flag TWO_DOCTOR_CHAT_ENABLED false por padrão. Código tutorVytal conserva prompt/default. Nenhuma edição no checkout canônico API ou rolloutAPI/ECG. node_modules da worktree é symlink para dependências existentes, não comitar.

App worktree2doctor-preview: proxy opt-in pela mesma variável do servidor, preferências sem conflito com o novo system; body não pode habilitar rota ou passar system. Sem variável mantém versão legada. Documento completo em scripts/wmed-app/docs/2DOCTOR_PROMPT_V1.md; não publicado. Não ligar proxy antes de nova rota validada e ativa.

Validação:209 testes app,5 testesAPI com transporte simulado, build2doctor, buildsite completo, buildNest e prisma validate passaram. TesteAPI inicialmente corrigido na fixture (constructor9args, não10); depois verde. Schema sem mudança, validação usou URL fictícia sem conexãoDB. Não executados avaliação clínica/geração real, envio autenticado, teste móvel novo (interface não mudou), testesECG completos ou deploy. Produção permanece a033a3a6-9ab5-4105-94fd-42c431a062d8/código0eaf551. Pré-existente dist-samu e trabalho canônico preservados.

Próximo executável: obter autorização explícita para publicar a extensão isolada na API compartilhada, pois a instrução anterior da automação proíbe alterar API Vytal. Depois avaliar respostas fictícias com o mesmo modelo, sobretudo posologia/ajustes/fontes/negações, antes de ativar; seguir roteiro em2DOCTOR_PROMPT_V1.md. Não confundir testes estruturais com validação clínica nem publicar automaticamente na próxima rodada. Nada comprado, nenhum fornecedor/modelo/persistência novo.

## 2026-09-26 08:35 BRT — Correção de pergunta longa publicada

Código0eaf551; deployment a033a3a6-9ab5-4105-94fd-42c431a062d8 SUCCESS no2doctor-web/projeto2doctor. Healthz200/product2doctor; index-0mWKEJXY.js público idêntico ao build (frontend não mudou; correção está no proxy servidor). Deploy a partir de scripts/wmed-app com --path-as-root, Dockerfile/railway.json conferidos. API Vytal/ECG intactos.

207 testes e builds app/site passaram. CUA público390×844 confirmou campo2000 caracteres, Enviar habilitado, sem overflow; rascunho fictício limpo e viewport restaurado. Um timeout do seletor da ferramenta ao ler o campo foi resolvido por observação atual e leitura DOM do id conhecido; não se reproduziu falha do app. Não enviado ao modelo. Aba local84/servidor encerrados. Sem teste autenticado end-to-end, iPhone/Safari ou validação clínica. Teste de contrato comprova integridade do texto sob limites locais existentes, não qualidade clínica da resposta.

Próximo: quando houver sessão disponível, conferir uma pergunta fictícia com informação relevante no final, sem repetir solicitação de login. A revisão do prompt principal continua apenas identificada/proposta; não alterar o tutor Vytal nem ampliar escopo clínico nesta automação. Rollback6b31b5a; preexistente medico-app/dist-samu preservado.

## 2026-09-26 08:33 BRT — Pergunta longa: correção do corte causado pelas preferências

Rodada 11:30Z. Baseline 6b31b5a; Railway dad2025f-1941-400d-83f4-6fbc99fd9e23 SUCCESS, projeto2doctor conferido. Leitura do prompt mostrou que 2Doctor usa tutor Vytal educacional como sistema, preferências no conteúdo user; não revisado o escopo clínico, não criada IA independente.

Bug reproduzido no contrato local: API TutorService.preparar conserva 4000 caracteres por mensagem. Pergunta permitida de2000 + prefixos PT/BR resulta em4284(auto)/4381(concise)/4382(study), cortando284/381/382 caracteres do fim. Proxy 2Doctor agora envia preferências como mensagem user separada antes da pergunta original; mantém os textos das instruções, modelo, autenticação e limites. Com anexos, janela já existente reserva mensagens e preserva preferências/documentos/pergunta. WMed sem contexto conserva contrato legado. Nenhuma edição na API Vytal/ECG ou novo fornecedor.

207 testes passaram, incluindo regressão nas252 combinações idioma/país/estilo/com-sem arquivos, aplicando janela10 e corte4000 antes de verificar pergunta2000 inteira, fim do TXT12000 e imagem/PDF. Teste simula transporte, não valida resposta clínica. Primeiro teste novo corrigido por tamanho incorreto da própria fixture (2001→2000), depois suíte completa verde. Builds2doctor e site completo passaram; warning de bundle grande preexistente. CUA local390×844:2000/2000 visível, botão habilitado, modoEstudar selecionado, sem overflow; screenshot legível. Não enviado ao modelo, sem login real/iPhone/Safari. Dockerfile/railway.json conferidos.

Próximo: publicar só2doctor-web com cwd correto/path-as-root, conferir SUCCESS/health200/asset/interface. Rollback6b31b5a. Pré-existente medico-app/dist-samu preservado. Logs /tmp/2doctor-question-budget-{tests,build,site}.log.

## 2026-09-26 08:02 BRT — Anexo preservado na navegação móvel, sem mudança de produto

Rodada 11:00Z. Documentos de continuidade e quatro planos relidos; Git baseline 8689d6d com apenas medico-app/dist-samu/ preexistente não rastreado. Railway mantém dad2025f-1941-400d-83f4-6fbc99fd9e23 SUCCESS. Healthz 200/product 2doctor e /assets/index-0mWKEJXY.js público idêntico ao dist local, conferidos nesta rodada.

CUA público390×844, sem login: anexado TXT fictício sem dados clínicos (39 caracteres) e preenchido rascunho não enviado. Chat → Scores → Chat; menu/busca → Medicações → Voltar ao chat; dois retornos pelo navegador preservaram rascunho e cartão do arquivo com mesmo nome/contagem. Campo sem inert residual; sem overflow horizontal. Não houve falha reproduzida. Não foi inspecionado payload privado nem enviado ao modelo, portanto a verificação comprova presença do anexo na interface, não integridade do conteúdo entregue ao backend. Nenhuma nova persistência.

Arquivo removido e rascunho apagado ao fim, confirmados zero cartões/campo vazio; viewport restaurado. Sem edição de código, testes automatizados/build/deploy não repetidos. A versão anterior tem seus próprios 206 testes/builds registrados, não contados como novos. Não testados anexos após recarga, histórico autenticado, iPhone físico/Safari ou envio real.

Próximo passo: a navegação de rascunho/anexo testada está encerrada sem correção necessária. Em nova rodada, reproduzir outra fricção real antes de editar; fluxos autenticados de envio e reabertura continuam pendentes de sessão disponível, sem repetir pedido de login. Não criar recursos nem persistência para preencher a fila.

## 2026-09-26 07:34 BRT — Navegação móvel: rascunho preservado, sem alteração de produto

Rodada de 10:30Z. Baseline 26e1f25, código aee32eb; Git e Railway conferidos. Mantido deployment dad2025f-1941-400d-83f4-6fbc99fd9e23 SUCCESS, index-0mWKEJXY.js. Apenas diretório preexistente medico-app/dist-samu/ não rastreado, preservado.

CUA público em https://www.2doctor.ai, viewport 390×844, sessão sem login: texto fictício não enviado permaneceu idêntico após Chat → Consultar um score → Chat, menu com busca medicações → Medicações → Voltar ao chat, e dois retornos pelo histórico do navegador. Campo visível, sem ancestral inert e sem overflow horizontal (390/390). Nenhuma falha reproduzida; nenhuma mudança no runtime ou novo recurso. Rascunho de teste apagado ao final, viewport restaurado. Nenhum dado clínico, envio ao modelo ou persistência nova.

Não foram executados novamente testes automatizados/builds nem deploy nesta rodada sem alteração de código. A aprovação anterior de 206 testes/builds continua sendo evidência daquela versão, não um teste novo. Não testados histórico autenticado, recarga com rascunho, anexos nesse percurso, iPhone físico/Safari/VoiceOver.

Próximo passo executável: conferir o mesmo percurso com um anexo TXT estritamente fictício e verificar se nome/conteúdo permanecem no compositor; se não houver regressão, registrar sem mudar produto. Evitar novas funcionalidades ou alterações especulativas.

## 2026-09-26 07:05 BRT — Ajuda de relato curto publicada

Fonteaee32eb; deploymentdad2025f-1941-400d-83f4-6fbc99fd9e23 SUCCESS em 2doctor-web/projeto2doctor. Health200/product2doctor; index-0mWKEJXY.js e ClinicalCase-Br1qUdf8.js públicos idênticos ao build local. CUA público390×844 confirmou texto fictício15 caracteres com ajuda ligada por aria-describedby/botão bloqueado; acima20 remove ajuda e habilita, sem envio. Sem overflow/console errors. 206 testes e builds app/site aprovados. Relato de teste limpo, aba83/servidor encerrados, viewport restaurado. Não testados iPhone físico/Safari/VoiceOver.

Próximo executável: conferir navegação móvel de retorno entre chat e ferramentas existentes com texto ainda não enviado; reproduzir eventual perda de contexto antes de alterar código. Manter preservação do rascunho, autenticação/histórico e ausência de novos recursos. Rollback1388eea; preexistente medico-app/dist-samu preservado; API/ECG/modelos intocados.

## 2026-09-26 07:02 BRT — Relato curto: motivo do botão desabilitado

Baseline1388eea/deploymentb98f423d-7084-45b2-87c4-ceb821b37c61 SUCCESS. Git/Railway conferidos. Produção390×844 com texto fictício15 caracteres: Organizar desabilitado sem orientação de mínimo e textarea sem descrição associada.

Somente 2Doctor: ajuda Escreva pelo menos 20 caracteres para continuar quando campo tem texto e trim<20. Fica junto à ação, associada à textarea via aria-describedby/useId e role status. Some no mínimo ou campo vazio. Critério20, limite5000, conteúdo clínico, autenticação/API e demais produtos intocados.

206 testes existentes passaram; builds app/site completos e diff --check aprovados. CUA local:19→ajuda/botão desabilitado;20→sem ajuda/habilitado;19 com espaços externos segue bloqueado; apagar tudo remove descrição. 320×568 screenshot legível,390×844/1280×800 sem overflow, console sem erros. Dados fictícios, nenhuma submissão/modelo/áudio. Não testados iPhone físico/Safari/VoiceOver. Dockerfile/railway.json conferidos.

Próximo: deploy isolado com SUCCESS/health200/assets e UI pública. Rollback1388eea; preexistente medico-app/dist-samu preservado.

## 2026-09-26 06:37 BRT — Aviso do caso clínico publicado

Fontebe1648e; deploymentb98f423d-7084-45b2-87c4-ceb821b37c61 SUCCESS no serviço2doctor-web/projeto2doctor. Healthz200/product2doctor; index-YJztBLaJ.js e ClinicalCase-BPkVPhUi.js públicos idênticos ao build local. CUA público390×844 confirmou aviso local y412–488 antes do dock783, foco role alert e console sem erros. Exemplo inteiramente fictício, sem envio ao modelo. Relato limpo por recarga ao final; viewport restaurado, aba82/servidor local encerrados.

206 testes e builds app/site completos aprovados. Sem teste clínico, sessão real, iPhone físico/Safari/VoiceOver. Rollback9dcd400. API/ECG/modelos intocados, diretório preexistente medico-app/dist-samu preservado.

Próximo executável: conferir orientação existente para relato curto (botão Organizar desabilitado antes de20 caracteres sem motivo visível) e definir correção mínima de ajuda no campo, sem alterar limiares ou gerar resposta. Não ampliar funcionalidades.

## 2026-09-26 06:34 BRT — Caso clínico: erro visível junto à ação

Baseline9dcd400/deploymentbf35b88a-4390-45ac-9b5b-51a1328ac8db SUCCESS; Git/Railway conferidos. Produção390×844: relato fictício com endereço example.invalid acionou validação local existente, mas alerta aparecia em y884–953 abaixo do bloco explicativo, fora da tela844. Nenhum relato enviado ao modelo.

Somente etapa Relato da 2Doctor: erro agora fica antes de Organizar meu relato, recebe foco programático e scroll nearest quando aparece/retoma tela. Ao tentar continuar com texto corrigido, limpa aviso antigo antes de exigir login. Mensagens, detector, limites, API e demais etapas não alterados; WMed preservado.

206 testes existentes e builds app/site completos passaram após versão final; diff --check limpo. CUA local390×844: alerta y412–488, acima do dock783;320×568:y274–373/dock507;1280×800:y729–781, foco role alert/sem overflow. Corrigir texto → login abre → fechar mantém relato e zero alertas antigos. Screenshot320 e console conferidos. Não houve login real, geração clínica, microfone nem persistência; sem iPhone físico/Safari/VoiceOver. Dockerfile/railway.json conferidos.

Próximo: publicar isoladamente, verificar SUCCESS/health200/assets/interface. Rollback9dcd400; pré-existente medico-app/dist-samu preservado.

## 2026-09-26 06:05 BRT — Foco dos anexos publicado

Fonte4b65d98; deploymentbf35b88a-4390-45ac-9b5b-51a1328ac8db SUCCESS em 2doctor-web/projeto2doctor. Health200/product2doctor e index-Qf2IGV5i.js público idêntico ao build local. CUA público390×844: anexar TXT fictício e remover por Enter deixou foco em BUTTON Anexar arquivos, zero anexos, sem overflow ou console errors. Arquivo removido, nenhuma mensagem enviada ao modelo. 206 testes, build app e site completos aprovados. Servidor local encerrado, aba81 fechada, viewport restaurado. Sem teste iPhone físico/Safari/VoiceOver.

Próximo executável: verificar legibilidade e navegação de mensagens de erro já existentes em caso clínico (sessão ausente, texto vazio, recuperação), sem gerar resposta clínica ou mudar API. Corrigir somente falha observável; não ampliar catálogo. Rollback ba0c513. Trabalho preexistente medico-app/dist-samu preservado.

## 2026-09-26 06:02 BRT — Remoção de anexo: foco preservado

Baseline ba0c513/deployment24aa5a7a-ec5e-4497-be3b-9666fa0d2860 SUCCESS; Git/Railway conferidos. Em produção390×844, remover o último TXT fictício por Enter deixava document.activeElement=BODY. Tab seguinte ainda alcançava a textarea, mas a remoção não preservava foco explícito em controle identificável.

ChatAttachments agora registra índice apenas em remoção deliberada na 2Doctor. Após atualizar lista, foco vai ao próximo botão Remover, ao anterior quando retirado o último da lista, ou a Anexar arquivos quando lista vazia; preventScroll evita rolagem programática. Nenhuma mudança de processamento, limites, persistência ou foco automático no campo de texto; WMed mantém comportamento anterior.

206 testes existentes passaram, builds app/site completos aprovados, diff --check limpo. CUA local390×844: três arquivos fictícios, remover2→foco3, remover3→foco1, remover1→Anexar. 320×568 foco visível solid/sem overflow;1280×800 foco preservado/sem overflow. Console sem erros. Nenhum arquivo enviado ao modelo; não testado iPhone físico/Safari/VoiceOver. Retorno nativo do seletor não foi alterado. Dockerfile/railway.json conferidos.

Próximo: deploy isolado com SUCCESS/health200/asset/interface. Rollback ba0c513. Pré-existente medico-app/dist-samu preservado; API/ECG intocados.

## 2026-09-26 05:35 BRT — Controles de anexo publicados

Fonte a9c1537; deployment24aa5a7a-ec5e-4497-be3b-9666fa0d2860 SUCCESS em 2doctor-web/projeto2doctor. Healthz200/product2doctor; JS index-x3kQAae6.js e CSS index-CrrrQz45.css públicos idênticos ao build local. CUA público390×844 confirmou anexar44px e remover44×44px, nome longo sem overflow e remoção concluída. Console sem erros; TXT fictício removido ao final, nenhuma mensagem enviada ao modelo. 206 testes e builds app/site aprovados. Viewport restaurado, servidor local encerrado e aba80 fechada. Sem iPhone físico/Safari/VoiceOver.

Próximo executável: verificar foco após remover anexo e ao retornar do seletor de arquivos no chat, com material fictício e sem envio clínico; corrigir apenas falha reproduzida. Não ampliar escopo. Rollback ca597ae; pré-existente medico-app/dist-samu preservado; API/ECG/modelos intocados.

## 2026-09-26 05:33 BRT — Anexos: alvos de toque ampliados

Baseline ca597ae/deploymentffc674ab-423b-4d38-874b-134990f766b3 SUCCESS, Git/Railway conferidos. Reproduzido em produção390×844 com TXT fictício local, sem envio ao modelo: remover anexo media23×23px, anexar33px de altura. Nome longo mantido; nenhum dado pessoal/clínico.

Correção CSS restrita a .doctor-app: anexar com altura mínima44px, remover44×44 sem encolhimento, ícone do arquivo preservado e foco visível. WMed, processamento dos arquivos, limites, APIs, autenticação e persistência intocados. Não há nova funcionalidade.

206 testes existentes passaram, build 2Doctor e site completo aprovados, diff --check limpo. CUA local320×568/390×844/1280×800: alvos44px, nome longo legível e sem overflow, remoção mantém mensagem fictícia. TXT vazio mostra erro existente e mantém texto/botão disponível. Screenshot conferido, console sem erros. Sem envio ao modelo; sem teste iPhone físico/Safari/VoiceOver. Dockerfile/railway.json conferidos.

Próximo: deploy isolado e confirmar SUCCESS, health200, CSS/JS e interface pública. Rollback ca597ae; preexistente medico-app/dist-samu preservado.

## 2026-09-26 05:07 BRT — Atalho da seleção bibliográfica publicado

Fonte f267f20; deployment ffc674ab-423b-4d38-874b-134990f766b3 SUCCESS em 2doctor-web/projeto2doctor. Healthz200/product2doctor e assets index-Dp1KTqmG.js, Research-xzG5c2h_.js, Research-D8ZWyYYG.css públicos idênticos ao build local. CUA público390×844 com busca asthma real: selecionar último artigo mostra Ver seleção (1), bottom756 antes do dock783; toque leva ao painel y17,8/foco Sua seleção e esconde atalho. Sem overflow horizontal/console errors. Cópia e limpeza verificadas localmente. 206 testes/builds app e site completos aprovados.

Servidor local encerrado, aba79 fechada, viewport restaurado. Sem teste físico iPhone/Safari/VoiceOver ou avaliação clínica dos resultados; nenhuma mudança de conteúdo/API/ECG/modelos. Rollback def92cb. Pré-existente medico-app/dist-samu preservado.

Próximo executável: revisar interação existente de anexos no chat móvel (seleção, remoção, estados de erro e leitura), somente com arquivo fictício e sem enviar ao modelo; corrigir apenas fricção reproduzida. Fluxo real autenticado do banco de imagens permanece pendente até sessão disponível, sem novo pedido de login.

## 2026-09-26 05:04 BRT — Pesquisa: acesso à seleção sem rolagem longa

Baseline def92cb/deployment6859aaa2-ff98-472a-a697-a86b0debf118 SUCCESS, Git/Railway conferidos. Pesquisa pública asthma em Europe PMC: selecionar último de oito artigos deixou Copiar lista em y−2534,5 com rolagem3407. Atrito concreto de acesso à exportação existente.

Research adiciona somente atalho Ver seleção (N), PT/EN/ES, quando há seleção e o painel está fora de vista (IntersectionObserver). Um toque rola para o painel existente e transfere foco; some quando painel aparece, seleção fica vazia ou tipo/tema muda. Botão fica acima do dock móvel. Nenhuma nova busca, API, síntese, fonte, persistência ou conteúdo clínico. ReferenceExport aceita ref de foco, exportação inalterada.

206 testes existentes, build 2Doctor e build completo do site passaram; git diff --check limpo. CUA local com busca real bibliográfica: último artigo selecionado → atalho → painel em y17,8/foco Sua seleção → Lista copiada; selecionar todos/limpar remove atalho; troca para ensaios remove seleção. 320×568: botão45px, bottom480 antes do dock507, sem overflow; 390×844 screenshot conferido e desktop1280×800 funcional. Console sem erros. Não testados iPhone físico/Safari/VoiceOver; navegação não valida qualidade clínica dos artigos. Dockerfile/railway.json conferidos.

Próximo: publicar apenas serviço2doctor-web e conferir SUCCESS, health200, assets e interface pública. Rollback def92cb. Pré-existente medico-app/dist-samu preservado.

## 2026-09-26 04:36 BRT — Navegação do banco de imagens publicada

Fonte d1ad509; deployment 6859aaa2-ff98-472a-a697-a86b0debf118 SUCCESS em 2doctor-web/projeto 2doctor. Healthz200/product2doctor; index-B5CcQOGj.js e Libraries-CsTbqn0i.js públicos idênticos byte a byte ao build local. CUA público390×844 confirmou tela de entrada do banco, ausência de overflow horizontal, abertura/fechamento do login e console sem erros. Não houve sessão autenticada disponível: comportamento do leitor/lista foi verificado em fixture local conforme entrada anterior, NÃO em acervo real de produção. Sem iPhone físico/Safari/VoiceOver.

206 testes e builds app/site aprovados. Fixture encerrada, aba78 fechada, viewport restaurado. Nenhuma mudança de API, dados clínicos, autenticação ou outros produtos. Rollback por reconstrução b8a4a1f; diretório preexistente medico-app/dist-samu preservado.

Próximo executável: verificar fluxo já existente de busca bibliográfica no celular (termo, resultados, abrir fonte, retorno), corrigindo apenas fricção concreta reproduzida. Manter pendente validação do banco de imagens com conta real quando houver sessão disponível, sem repetir solicitação de login ou criar funcionalidades para preencher a rodada.

## 2026-09-26 04:33 BRT — Banco de imagens: navegação corrigida em teste isolado

Git e Railway conferidos: baseline b8a4a1f, produção d8c2420b-0f27-4ff5-a088-261d479d470b SUCCESS. Site público exige login para imagens; sessão desconectada, sem repetir pedido ao usuário. Fixture local auth/academic com seis imagens da própria marca, texto explicitamente fictício, sem upstream, prontuários ou persistência. Fricção reproduzida em 390×844: último cartão em y1549, abrir deixava Acervo em y−91,5; voltar perdia contexto (y0/foco BODY).

ImageLibrary agora, somente no build 2Doctor, abre leitor no topo com foco em Acervo e restaura cartão/rolagem ao voltar. Preserva tanto rolagem da página móvel quanto da grade desktop. Navegação Anterior/Próxima no leitor não sobrescreve origem; zoom mantém comportamento. Sem modificar conteúdo, filtros, API, autenticação, arquivos de imagem ou WMed.

206 testes existentes passaram, build 2Doctor e site completo aprovados (bundle warning preexistente). CUA local: y1549→0→1549; busca teste e página 2 preservadas, zoom125%, retorno após trocar imagem; grade desktop1280×600 retornou scrollTop165; 320×568/390×844 sem overflow horizontal, screenshot e console conferidos. Não testados iPhone físico/Safari/VoiceOver nem acervo autenticado de produção. Dockerfile/railway.json inspecionados.

Próximo: deploy isolado e confirmar SUCCESS, health200, assets e acesso público. Limite explícito: fluxo autenticado verificado em fixture local, não na conta real. Rollback b8a4a1f. Pré-existente medico-app/dist-samu preservado.

## 2026-09-26 04:09 BRT — Navegação de condições publicada

Fonte 86729b0; deployment d8c2420b-0f27-4ff5-a088-261d479d470b SUCCESS no serviço 2doctor-web/projeto 2doctor. Healthz 200/product 2doctor; index-DHeIEfQg.js e Libraries-BB4FD_8h.js públicos idênticos byte a byte ao build local. Interface pública 390×844 comprovou cartão O24 y1013→detalhe y0→retorno y1013 com foco no cartão, busca diabetes preservada e sem overflow horizontal. Screenshot conferido; nenhum erro de console. 206 testes e builds app/site completos aprovados. Fixture encerrada, aba temporária fechada e viewport restaurado. Não testado iPhone físico/Safari/VoiceOver, sem alterações clínicas/API/ECG.

Próximo executável: conferir no celular navegação por teclado e retorno no banco de imagens existente; corrigir somente fricção reproduzida, sem ampliar acervo ou criar ferramenta nova. Synthetic Hospital continua proposta de avaliação offline, sem execução autorizada. Rollback por reconstrução 2b7facb. Trabalho preexistente medico-app/dist-samu preservado.

## 2026-09-26 04:06 BRT — Condições: retorno à lista preservado

Fricção reproduzida no site público em 390×844: busca diabetes, cartão O24 em y1013; abrir e voltar perdia a posição e retornava a y0. ReferenceLibrary estende às condições o mecanismo já existente nas medicações, restrito à 2Doctor: abre detalhe no topo e devolve foco e rolagem ao cartão anterior. Sem mudar dados clínicos, busca, autenticação ou persistência.

206 testes passaram; build 2Doctor e build completo do site aprovados (warning preexistente de bundle). CUA local em 390×844 comprovou y1013→0→1013 e foco correto. Em 320×640 e 1280×800 não houve overflow horizontal; consulta diabetes e filtro gravidez preservados; Mostrar mais manteve 60 cartões após abrir A69 e voltar. Smoke de medicações preservou retorno e foco. Sem teste em iPhone físico, Safari ou VoiceOver. Fixture local sem upstream/dados reais. Dockerfile e railway.json conferidos.

Próximo: publicar somente no serviço 2doctor-web, exigir SUCCESS, healthz 200, assets idênticos e retorno à lista na interface pública. Rollback por reconstrução 2b7facb. Trabalho preexistente medico-app/dist-samu preservado; nenhum outro produto alterado.

## 2026-09-26 03:38 BRT — Navegação dos scores publicada

Fonte 1b579f6; deployment a842e7f0-3e96-4961-8938-906552691d73 SUCCESS em 2doctor-web/projeto 2doctor. Health 200/product 2doctor; /assets/index-BKExKWSP.js e Libraries-D938F7gi.js públicos idênticos byte a byte ao build local. CUA público 390×844: cartão Winter em y844, toque abriu detalhe no topo y0 com foco em Voltar; retorno restaurou y844 e foco no mesmo cartão, sem overflow horizontal ou console errors. Busca/especialidade e score por critérios conferidos localmente conforme registro anterior. 206 testes e builds app/site completos passaram. Sem validação em iPhone físico; nenhuma alteração clínica. Viewport restaurado; trabalho preexistente medico-app/dist-samu preservado.

Próximo executável: verificar jornada de condições médicas (buscar, abrir conteúdo, voltar à lista) no celular e corrigir perda de contexto somente se reproduzida; não ampliar acervo. Synthetic Hospital segue proposta, sem treino, benchmark ou modelo novo. Rollback por reconstrução cc210ac.

## 2026-09-26 03:34 BRT — Scores: navegação de ida e volta validada

Fricção pública reproduzida em 390×844: abrir Winter deixou página em y439,5, título em y−220,5 e botão Voltar em y−289,5; retorno colocou lista no início. Scores agora guarda apenas referência de cartão/rolagem em memória: abre calculadora ou score no topo com foco em Voltar, e retorna à posição/cartão anteriores. Busca/especialidade permanecem no estado existente. Escopo 2Doctor; WMed não recebe reposicionamento. Fórmulas, critérios, limiares, fontes e limpeza de respostas não alterados. Nenhuma persistência nova.

206 testes passaram; builds 2Doctor e site completo aprovados (warning de bundle preexistente). CUA local com auth fictícia, sem upstream: toque direto em Winter preservou y852→0→852, entrada fictícia produziu saída e voltou à lista; locator Playwright reposicionou cartão antes do clique, por isso prova da posição usou toque direto. Score NYHA: seleção gera resultado, retorno preserva classificação/Cardiologia, reabertura segue limpando respostas como antes. Conferidos 320×568, 390×844 e 1280×800; foco no botão Voltar/cartão, sem overflow horizontal ou erros de console. Isto verifica interação, não validação clínica. Não testados iPhone físico/Safari/VoiceOver. Fixture encerrada e aba76 fechada.

Próximo: commit/deploy isolado, exigir SUCCESS/health200/asset e UI pública. Rollback por reconstrução cc210ac. Synthetic Hospital permanece proposta sem benchmark executado; API/ECG/modelos intocados.

## 2026-09-26 03:04 BRT — Login compacto publicado

Fonte 26c1215; deployment 66404018-c7af-449d-8cf6-077a4f885845 SUCCESS no projeto 2doctor/serviço 2doctor-web. Health 200/product 2doctor; asset público /assets/index-DEXDcRmr.js idêntico byte a byte ao build local. Conferência pública CUA em 320×400: auth-scroll rolou 282px, Fechar 44×44 permaneceu em y56,5; clique fechou, liberou rolagem e voltou ao chat, sem overflow horizontal ou erros de console. Sem envio de credenciais. Viewport restaurado. 206 testes e builds app/site aprovados, limites físicos e de autenticação registrados acima. API, ECG, fornecedores e persistência inalterados. Árvore preserva apenas medico-app/dist-samu preexistente fora do commit.

Próximo executável: revisar em celular uma jornada existente de calculadora (abrir, preencher valores fictícios, calcular, voltar à lista), verificando legibilidade e preservação de navegação; só corrigir fricção reproduzida e não alterar fórmulas/limiares sem avaliação própria. Não criar ferramentas para preencher a rodada. Rollback por reconstrução 83ee57b.

## 2026-09-26 03:01 BRT — Login em pouca altura: fechamento fixo validado

Reproduzido publicamente em 320×400: rolagem de 368px do login levou botão Fechar a y−334, fora da tela. Mudança restrita à apresentação 2Doctor: cabeçalho com título e Fechar 44×44 fora da área rolável; formulário e ajuda dentro de auth-scroll. Limite acompanha 100dvh, rolagem interna contém encadeamento. Textos, campos, autenticação e estrutura anterior WMed preservados; decoração de cadeado mantida apenas no layout anterior para economizar altura na 2Doctor.

206 testes, build 2Doctor e build completo do site passaram. CUA fixture sem upstream/persistência em 320×400: rolagem interna 282px, Fechar permanece y56,5 e clicável, rascunho retorna intacto, Tab traz e-mail à área visível, tentativa fictícia recusada mostra alerta e mantém foco/fechamento corretos. Conferido também 390×844 e 1280×800, sem corte do diálogo. Fixture encerrada e aba75 fechada. Não testados teclado iOS, Safari/VoiceOver físicos nem login real bem-sucedido. Beforeunload candidato segue não aplicado; API/ECG intactos.

Próximo: commit e publicação isolada 2doctor-web, exigir SUCCESS, health200, asset idêntico e conferência móvel pública. Rollback por reconstrução 83ee57b.

## 2026-09-26 02:36 BRT — Login: publicado e conferido

Fonte 937306b; deployment c88e60b6-a2b7-414b-9dfd-69d6a0e2954e SUCCESS no serviço 2doctor-web/projeto 2doctor. Health 200/product 2doctor, asset /assets/index-C2t6b93I.js público idêntico byte a byte ao build local. Interface pública 390×844 confirmou menu → Minha conta → foco Fechar entrada, Escape fecha, foco volta a Abrir menu e overflow da raiz é restaurado. Largura 390 sem rolagem horizontal; console sem erros. Não foram inseridas credenciais no site público. Viewport restaurado. 206 testes, build 2Doctor e build completo do site aprovados; demais limites registrados acima.

Próximo executável: conferir a janela de login em altura reduzida (320×400), verificando se o botão Fechar permanece alcançável quando o conteúdo precisa rolar; corrigir somente se reproduzido. Preservar autenticação e rascunho, sem ampliar catálogo. API/ECG intactos. Árvore limpa exceto medico-app/dist-samu preexistente. Rollback por reconstrução b642595.

## 2026-09-26 02:33 BRT — Login: foco e retorno ao chat corrigidos

Reprodução pública em 320×568: Minha conta pelo menu deixou foco em Abrir menu atrás do login; Escape não fechava. AuthDialog da 2Doctor agora foca Fechar após cleanup do drawer, bloqueia rolagem da página enquanto aberto e restaura estilos/foco sem reabrir teclado do compositor. Campo e-mail deixa de receber autofocus na 2Doctor. Durante envio, foco fica no diálogo enquanto controles estão desabilitados; após resposta recusada volta a Fechar. Tab/ShiftTab ficam nos controles disponíveis. Contrato HTTP, cookies, validação de formulário e callback de sucesso preservados; WMed conserva autofocus anterior.

206 testes passaram; build 2Doctor e build completo do site aprovados, com warning preexistente de bundles grandes. CUA local em 320×568, 390×844 e 1280×800: entrada pelo menu/cabeçalho/envio, foco inicial, ciclo de Tab, Escape, rascunho preservado, retorno ao botão de origem. Fixture sem upstream/persistência recusou credenciais fictícias: estado ocupado impede fechar; erro devolve foco e Escape fecha normalmente. Sem credenciais reais nem alteração de autenticação. Não testados login bem-sucedido real, teclado iOS, Safari ou VoiceOver físicos. Fixture e aba74 encerradas. Patch beforeunload segue fora do runtime.

Próximo: publicar somente serviço 2doctor-web, validar SUCCESS, health, asset e interface. Rollback por reconstrução b642595. Não ampliar catálogo.

## 2026-09-26 02:08 BRT — Conta: correção publicada na 2Doctor

Fonte 90c97e9. Deployment 14754033-7159-43a7-878a-bf5f8debcfb3 confirmado SUCCESS no serviço 2doctor-web/projeto 2doctor. Health 200 e produto 2doctor; asset público /assets/index-DRNREAeO.js idêntico byte a byte ao build local. Os 206 testes e os builds da 2Doctor e do site completo passaram. Interface pública em 390×844: Minha conta exige login, fechar entrada retorna ao chat, largura 390 sem overflow horizontal e console sem erros. Sem login real; janela autenticada validada com fixture sintética conforme registro anterior. Fixture encerrada, aba 73 fechada, viewport restaurado. API Vytal/ECG intactos; candidato beforeunload não aplicado.

Próximo passo executável: verificar abertura e fechamento da janela de login pelo menu móvel, pois a conferência pública mostrou foco ainda no botão Abrir menu atrás do diálogo. Reproduzir e corrigir somente esse problema, preservando autenticação. Não ampliar catálogo. Rollback por reconstrução c8c67bf no diretório scripts/wmed-app. Não foram testados iPhone físico, Safari/VoiceOver nem sessão real de usuário.

## 2026-09-26 02:05 BRT — Conta: fechamento e leitura preservados, candidata validada

Fricção reproduzida na conta em320×568: rolar o conteúdo deixou o botãoFechar em y−222; Escape não fechou, foco permaneceu emAbrir menu atrás da janela; rolar margem moveu chat y3860→4428. AccountDialog agora mantém cabeçalho/Fechar44px fora da rolagem, contémTab/ShiftTab, fechaEscape e restaura foco/overflow após fechar. Efeito apóscleanup do drawer mantém posição da página. Header ganhou nome acessívelMinha conta quando texto oculto. Restrito à2Doctor; conteúdo/conexões/login/logout preservados, WMed conserva estrutura anterior.

206testes passaram; npm run build:2doctor e bash scripts/build-vercel.sh na raiz da worktree passaram, apenas warning preexistente de chunks. CUA fixture local semupstream/dadosreais:320×568,390×844,1280×800; Fechar visível apósscroll interno247px,TabciclaFechar↔Sair,Escape devolve foco, chat y2840 preservado ao abrir/rolar margem/fechar móvel e desktop; console semerros. Sair alcançável, semacionar logout. Não testados conta real, iPhone/Safari/VoiceOver físicos. Candidata beforeunload continua não aplicada.

Próximo:commit explícito e deploy isolado2doctor-web comcwd scripts/wmed-app/--path-as-root; exigirSUCCESS,health200,asset e interface pública. Rollback: reconstruirc8c67bf. API/ECG/modelos/persistência intocados.

## 2026-09-26 01:37 BRT — Posição de leitura preservada: publicado

Fonte6aca53d; deployment2bce02ce-c336-4fce-9030-625b2e7a01ae SUCCESS no projeto2doctor/serviço2doctor-web. Health200/product2doctor; assetindex-D-Tiklug.js200 idêntico byte a byte ao build local.206testes existentes/build2Doctor/buildsite completo passaram. CUA público390 confirmou acesso ao histórico protegido por login, fechamento retorna ao chat, largura390=scroll390 e console semerros. Não houve login ou acesso a histórico real. Travamento/retorno de rolagem e foco validados na fixture com conteúdo fictício, conforme seção anterior; não equivalem a teste em iPhone físico.

Fixture encerrada, aba72fechada, viewport restaurado. Candidata de beforeunload continua não aplicada/não publicada. Git preservou medico-app/dist-samu preexistente; API/ECG intactos. Próximo executável: verificar na conversa longa se abrir e fechar Minha conta também desloca a leitura/foco; só corrigir após reproduzir. Não ampliar catálogo. Rollback por reconstrução3f246d4 no diretório scripts/wmed-app.

## 2026-09-26 01:34 BRT — Histórico sem mover a leitura ao fundo

Fricção reproduzida com conversa fictícia longa: abrir Histórico pelo menu móvel em y5171,5 e rolar na margem da janela moveu a página para y6015,5; fechar manteve o deslocamento indesejado de844px. Correção restrita à2Doctor: enquanto Histórico está montado, trava overflow da raiz e reserva gutter; cleanup restaura estilos anteriores. Não fixa o corpo nem força scroll ao fechar, permitindo abrir outro chat no topo. Efeito roda depois da liberação do drawer móvel. Foco inicial/retorno também migrou para efeito posterior ao cleanup do drawer, pois o drawer roubava o foco do botãoFechar.

206 testes existentes passaram; builds2Doctor e site completo aprovados. CUA fixture semupstream:390×844 manteve y4327,5 ao abrir/rolar fundo/fechar; lista interna rolou1649px, Escape mantém posição e libera rolagem.320×568 manteve y6502, focoFechar histórico→Abrir menu, largura305=scroll305. Selecionar conversa mudou para y0 e removeu bloqueio. Desktop1280 clique direto manteve y1570 ao abrir/rolar margem/fechar. Locator automático reposicionou stickyrail230px antes do clique; conferência por clique direto eliminou esse artefato. Rascunho+confirmaçãoManter não libera fundo enquanto histórico aberto; fechar libera e conserva texto. Console semerros. Sem testes em iPhone/Safari/VoiceOver físicos ou histórico real.

Aviso de saída da rodada anterior continua só como patch não aplicado. API/modelos/persistência/ECG inalterados. Próximo: commit explícito e deploy isolado2doctor-web; exigirSUCCESS/health/asset/UI. Rollback pela reconstrução3f246d4. Não enviar raiz do repositório.

## 2026-09-26 01:06 BRT — Aviso de saída preservado como candidata, sem publicação

Decisão de qualidade: não publicar sem comprovar diálogo nativo de saída. Patch e roteiro em scripts/wmed-app/docs/candidates/20260926-chat-exit.{patch,md}; git apply --check aprovado. Mudanças de runtime retiradas do código ativo, preservando exatamente main.jsx publicado. Teste adicional do harness confirmou saída livre após término da resposta fictícia. Harness/fixtures encerrados e abas temporárias fechadas; nenhuma chamada clínica, persistência, conta ou outro produto alterado. Teste nativo inconclusivo: não atribuir causa nem tratar evento sintético como validação de UI nativa.

Produção permanece e53cd3e/deployment50026317-a0d9-46a5-8f12-8f837ca0c331, proteção ao trocar de conversa intacta.208 testes/builds referem-se à candidata. Versão ativa restaurada e reconstruída: 206 testes, build 2Doctor e build completo do site passaram; health público200 e asset index-9aQvxGjm.js byte a byte igual ao build restaurado. Interface pública390×844 conferida, viewport restaurado. Sem novo deploy. Próximo executável: validar patch em navegador convencional sem depuração, com relato/arquivo fictícios e recarga Cancelar; enquanto indisponível, revisar outra fricção existente (por exemplo retorno à posição de leitura após fechar histórico), sem repetir tentativas inconclusivas ou expandir catálogo.

## 2026-09-26 01:06 BRT — Proteção ao sair da página em verificação

Reproduzida perda de rascunho no reload da prévia. A 2Doctor registra beforeunload somente enquanto há texto não vazio, anexo, preparo de arquivo ou resposta em andamento; remove o listener ao concluir/limpar. Sem persistência nova, envio de conteúdo ou alteração do histórico existente. Helper remove apenas seu próprio listener. WMed não ativa a proteção adicional.

Fonte técnica: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event (consultada nesta rodada): aviso depende de interação e suporte do navegador, mensagem é nativa, encerramento pelo sistema móvel pode não disparar evento. Não é recuperação nem salvamento do rascunho.

208 testes passaram (2 novos verificam cancelamento/cleanup e coexistência com proteção do histórico). Build 2Doctor e site completo passaram. CUA com harness temporário fora do repositório, usando bundle real e evento sintético cancelável, comprovou estado livre→protegido com texto/anexo→livre após apagar/remover; resposta fictícia em andamento também protegida. Esse teste confirma registro do handler, NÃO confirma exibição do diálogo nativo. Reload por automação IAB/Chrome e botão nativo na sessão depurada não exibiram diálogo; motivo não determinado. Não prometer suporte físico iOS/Safari, proteção contra encerramento do app ou conta/histórico reais. Próximo: concluir conferência após resposta, verificar interface móvel normal e registrar decisão de publicação com estes limites.

## 2026-09-26 00:06 BRT — Histórico com fechamento visível publicado

## 2026-09-26 00:41 BRT — Proteção de rascunho publicada

Fonte e53cd3e; deployment50026317-a0d9-46a5-8f12-8f837ca0c331 SUCCESS no serviço2doctor-web/projeto2doctor. Health200/product2doctor; assetindex-9aQvxGjm.js200 idêntico byteabyte ao build local.206testes existentes/build2Doctor/buildsite completo aprovados; gitdiffcheck semerro. CUA público390×844 verificou aviso de Nova conversa, Manter rascunho preservando texto e descarte explícito voltando ao chat vazio; nenhum envio real/autenticação efetuados. Console semerros. Fixture encerrada, aba69fechada e viewportrestaurado. Histórico/anexos/falha503 foram testados apenas na fixture sintética.

Limites: rascunhos continuam em memória; fechar/recarregar página não ganha salvamento nesta mudança. Não testados histórico de conta real, Safari/iPhone físico ou VoiceOver. Sem novos modelos, persistência, APIs ou conteúdo médico. Próximo executável: conferir fechamento acidental da página com rascunho e, se reproduzir perda, avaliar aviso de saída sem armazenar conteúdo; manter foco em fricções existentes. Rollback reconstruindo92f662a em scripts/wmed-app; não usar raiz no Railway.


## 2026-09-26 00:38 BRT — Proteger rascunho ao trocar de conversa

Reproduzida perda do texto não enviado ao abrir item do histórico na fixture local. A2Doctor agora pede escolha entre Manter rascunho e Descartar e continuar quando Nova conversa/abrir histórico encontra texto ou anexos. Sem rascunho não acrescenta etapa. Confirmação própria com foco inicial na opção segura, Escape/cancelar, Tab contido e textos PT/EN/ES; tentativa inicial de confirmação nativa teve comportamento inconsistente no navegador de QA e foi substituída. Rascunho só é limpo após sucesso da troca; falha mantém texto/arquivos. Bloqueio de troca/envio concorrente e edição/anexação enquanto carrega; atualização funcional preserva alterações mais recentes de outras ações. Nada de armazenamento novo ou mudança de API.

206testes existentes passaram; build2Doctor aprovado. CUA fixture semupstream/banco real: cancelar e Escape preservam texto+1anexo;503 simulado ao abrir preserva ambos; descarte explícito abre conversa3 ou inicia vazia; anexo semtexto também protegido; ausência de rascunho não abre aviso; Tab alterna os2botões.320×568 semcorte após corrigir largura(areavisível305px, direita285px),390×844 e desktop1280 semoverflow. Não testados conta/histórico real, Safari/iPhone físico, VoiceOver ou falha real de rede. Build completo do site em andamento; publicação pendente. Próximo: conferir build completo, deployisolado,health/asset/UI pública. Rollback reconstruindo92f662a com cwd scripts/wmed-app.


Fonte5e6ce3c; deployment4120333b-0e8a-47dc-8d37-4bb1e508ac34 SUCCESS em2doctor/2doctor-web. Health200/product2doctor, entrada/assets/index-Bn9q5U94.js confere com local e asset200/bytes idênticos. CUA público390: abrir Histórico exige login e fechar retorna ao chat, width390=scroll390, console vazio. Não houve login nem leitura de conversas reais. Nova janela foi validada com30conversas sintéticas localmente, incluindo scroll, Escape, Tab, reabertura e rascunho conforme registro anterior.206testes/builds completos passaram.

Limites: sem conta/histórico real, iPhone/VoiceOver físicos, nem avaliação clínica. Viewportrestaurado e fixtureencerrada. Próximo executável: revisar abertura de conversa salva quando há texto/anexos não enviados (atualmente pode apagar o rascunho); reproduzir com fixture antes de mudar comportamento. Não ampliar catálogo. Rollback por reconstruçãoc2707bc em scripts/wmed-app.

## 2026-09-26 00:03 BRT — Histórico: fechar sem voltar ao topo

Fixture com30conversas fictícias reproduziu botãoFechar fora da tela(top−1156px) após rolar e Escape sem efeito. Na2Doctor, cabeçalho/título/Fechar44px ficam fora da área de rolagem; só a lista/conteúdo rola. Escape fecha, Tab/ShiftTab permanecem nos controles do diálogo; foco inicial semscroll e retorno ao acionador sem abrir teclado. Fechar mantém rascunho; selecionar conversa usa fluxo existente. WMed mantém markup anterior e não recebe CSS scoped. Sem alterar autenticação/historyAPI/persistência.

206testes existentes/build2Doctor/buildsite passaram. CUA local390 rolou lista1137px mantendoFechar top36; Escape fecha e preserva rascunho/foco. ShiftTab deFechar→últimaconversa; Tab→Fechar. Conversa30reaberta com texto sintético.320×568:Fechar44×44/lista451px/largura305=scroll305; desktop1280 foco retorna e semoverflow. Console vazio. Fixture semupstream/banco real encerrada/aba68fechada/viewportrestaurado. Sem conta real, persistência real/VoiceOver/iPhone físico; posição de janela longa atrás do modal não foi validada. Publicação pendente: próximo deployisolado/health/asset/UI pública.

## 2026-09-25 23:36 BRT — Recuperação de falha do chat publicada

Fonte72fb5a1; deployment0037cfe9-6b4a-4e7f-acd3-b4ee7eabbbf8 SUCCESS no serviço2doctor-web/projeto2doctor. Health200/product2doctor; entradaindex-BMUAJ05S.js200 com bytes idênticos ao build local. CUA público390 conferiu chat, nova linha, largura390/scroll390 e console semerros; nenhum envio real efetuado. Campo limpo/viewportrestaurado.206testes e builds completos aprovados.

ErroSSE+done,503, rascunho concorrente, cancelamento e sucesso seguinte verificados na fixture local com dados fictícios, não provocados em produção. Não testados login real, erro401 real, queda física de rede/Safari/VoiceOver. Anexos e rascunho recuperados continuam só na sessão em memória, sem armazenamento novo ou treinamento. Próximo executável: conferir o fluxo de abrir/fechar histórico no celular e retorno à conversa existente, antes de qualquer alteração; não adicionar catálogo. Rollback reconstruindo4489a16 com cwd scripts/wmed-app.

## 2026-09-25 23:33 BRT — Recuperar chat após falha

Fixture local reproduziu errorSSE→done apagando anexo e deixando campo vazio. Somente2Doctor passa a rastrear falha no stream: done após error não limpa anexos nem marca resposta completa. FalhaSSE/HTTP/abort recupera pergunta enviada no campo apenas se vazio; preserva novo rascunho digitado.401 também evita sobrescrever novo texto. Usa pergunta efetivamente enviada/revisada, não original antes da revisão. Sem reenvio automático/persistência nova/API/modelo.

Durante QA foi reproduzida corrida no botãoParar: abort fazia o mesmo nó virar submit antes da ação padrão do clique, reenviando a pergunta recuperada. preventDefault no clique deParar da2Doctor resolveu: teste final manteve exatamente1mensagem após interromper/aguardar.

206testes existentes e builds2Doctor/site completo passaram após ajuste final. CUA fixture semupstream nem histórico real: erroSSE+done mantém1anexo e pergunta; HTTP503 recupera; falha atrasada preserva novo rascunho; abort não reenvia; sucesso subsequente envia mesmo anexo e limpa0/campo vazio. Logs só contagens/tamanho confirmam anexos na requisição. Mobile375/375 e desktop1265/1265 sem overflow. HTTP503 e falhas são simulados, não avaliação clínica. Sem conta/API real, socket interrompido/Safari físico/401 real. Fixture e aba67encerradas/viewportrestaurado. Publicação pendente; próximo deploy+health+asset+UI pública.

## 2026-09-25 23:05 BRT — Limite do chat publicado

Fontebd02689; deployment12d8de53-9a7a-42b2-b8b2-719034dfd34c SUCCESS em2doctor/2doctor-web. Health200/product2doctor; entrada/assets/index-Bo2_Dr0s.js e bytes do asset público idênticos ao local/200. CUA público390 confirmou2008caracteres com finalCONCLUSAO intacto, aviso reduza8, botão desativado; editar para2000 reabilita. Screenshot conferido, largura390/scroll390, console semerros. Texto fictício removido/viewport restaurado.206testes/build2Doctor/buildsite passaram. Não testados sessão real, envio clínico, dispositivo físico ou VoiceOver.

Rascunho continua só na memória da tela: manter texto no campo não significa salvar em conta ou preservar após reload. WMed/API/ECG intactos. Próximo executável: verificar recuperação de falha de rede no chat e preservação da pergunta/anexos usando fixture, antes de qualquer alteração. Rollback reconstruindo e1df3a1 com cwd scripts/wmed-app.

## 2026-09-25 23:02 BRT — Limite visível sem cortar rascunho

Reproduzido público: maxLength2000 interrompeu CONCLUSAO em C sem aviso.2Doctor mantém limite de envio2000, mas retira corte do textarea, preservando texto longo na memória. Contagem aparece a partir1800, erro acima2000 explica excesso e impede botão/atalho antes de login/revisão/API. aria-describedby/invalid associados ao aviso, PT/EN/ES. WMed conserva maxLength anterior; nenhum limite/backend/modelo/persistência alterado.

206testes passaram(3novos: fronteira, excesso/edição, UTF16/espaços); builds2Doctor e site completo exit0. CUA local390:2008caracteres mantidos incluindoCONCLUSAO, aviso reduza8, envio desativado; desktopEnter acima do limite não abriu login; edição para2000 liberou botão e abriu login da fixture. MensagensEN/ES/PT conferidas, texto curto remove aviso. Screenshot móvel legível e console vazio. Fixture somente semupstream encerrada/aba66fechada/viewportrestaurado. Sem conta real, envio clínico, teclado iPhone/VoiceOver físicos ou validação clínica. Publicação pendente; próximo deploy+SUCCESS/health/asset/UI pública.

## 2026-09-25 22:35 BRT — Enter no chat publicado

Fonte779b29d, deploymentf778d55d-9d6b-43c5-80c4-b2fac08a47b4 SUCCESS no serviço2doctor-web/projeto2doctor. Health200/product2doctor; entrada/assets/index-DVjASMY9.js igual ao build local, asset200/bytes idênticos. CUA público390: texto em dois parágrafos após Enter, sem iniciar login/envio; screenshot legível, largura390/scroll390, console vazio. Texto fictício apagado e viewport restaurado.203testes e builds2Doctor/site completo aprovados.

Limites: teste de EnterviaCUA e IME/coarse via unidade, sem teclado virtual/IME/iPhone físicos, sessão autenticada ou resposta clínica. Não alterado fluxo de autenticação/armazenamento/API. Próximo executável: verificar uma fricção concreta de escrita/edição no chat (por exemplo visibilidade do limite já existente), sem ampliar funcionalidades. Rollback reconstruindo f33ca71 em scripts/wmed-app.

## 2026-09-25 22:32 BRT — Chat: Enter no celular

Fricção pública reproduzida anonimamente390px: Enter ao compor texto dispara fluxo de envio/login em vez de nova linha.2Doctor agora permite linha em viewport≤760px ou ponteiro primário coarse; desktop mantém Enterenvia/ShiftEnterlinha. enterkeyhint=enter. Helper bloqueia envio durante composiçãoIME, keyCode229 e repetição de tecla. WMed mantém atalho anterior. Sem alterar API, autenticação, modelo ou persistência; nada enviado ao assistente real.

203testes passaram(3novos: desktop, compact/touch, IME/repeat); build2Doctor e site completo passaram. CUA local390: Enter adiciona\n sem modal, botãoEnviar abre login; desktop1280: ShiftEnter adiciona\n e Enterabrelogin. Screenshot de dois parágrafos legível, viewport390/scroll390, console semerros. IME/coarse avaliados unitariamente; sem teclado/iPhone/IME físicos, sessão autenticada ou chamada clínica. Fixture semupstream encerrada/aba65fechada/viewportrestaurado. Publicação pendente; próximo deploy isolado+SUCCESS/health/asset/UI.

## 2026-09-25 22:06 BRT — Retorno à lista de medicações publicado

Fonte e1cf29f, deployment b59ed3a0-5be3-4440-b841-a5c1c7da25f7 SUCCESS no serviço2doctor-web/projeto2doctor. Health200/product2doctor; entrada pública index-CxIT7hRR.js confere com build local, asset200 e bytes idênticos. CUA público390: amoxicilina abriu no topo(título300px), voltar restaurou scroll3532/cartão341px e foco no item; screenshot legível, largura375/scroll375 e console vazio.200 testes e ambos os builds aprovados, sem alteração médica/API. Viewport restaurado.

Limites: sem iPhone físico/VoiceOver, autenticação real ou avaliação clínica. Retomada permanece só em memória durante a visita ao módulo, não entre sessões. Próximo executável: observar uma fricção concreta no chat ou caso clínico antes de editar; evitar ampliar catálogo e não extrapolar esta correção a outros módulos sem reproduzir problema. Rollback por reconstrução9fb34a5 usando cwd scripts/wmed-app.

## 2026-09-25 22:02 BRT — Medicações: abrir ficha e retomar lista

Fricção reproduzida no público390px: abrir amoxicilina distante da lista mantinha scrollY398,5 e título acima da tela(-98,5px); voltar perdia item e retornava topo. Correção somente na2Doctor/Medicações: guarda posição e nome em refs na memória, abre detalhe no topo com foco no botão de voltar e, no retorno, restaura scroll e foco no cartão após montagem. Busca/grupo/limite preservados. Nenhuma persistência, conteúdo médico ou API alterada; WMed/Condições mantêm comportamento anterior.

200 testes existentes passaram; build2Doctor e build completo na raiz concluídos exit0; gitdiffcheck limpo. CUA local390: amoxicilina abre scroll0/título300px, volta scroll3532/cartão341px; Mostrar mais→60 itens, cianocobalamina abre0 e volta8138 mantendo60. Busca biguanida metformina e grupoEndócrino preservados. Desktop1280 abre título250px e volta cartão316px; sem overflow375/375 e1265/1265, console semerros. Fixture somente estática/sem upstream encerrada e aba64 fechada. Sem aparelho físico, VoiceOver, sessão real ou teste clínico. Publicação pendente. Próximo: deploy isolado, health/asset/UI pública; não ampliar catálogo.

## Publicação verificada — busca de medicações — 2026-09-25 21:40 BRT

Código 8ab4666, fonte enviada 413a4e7. Deployment fccbb0ae-c45b-4cfb-bfca-1d9f2f2f809a SUCCESS no projeto2doctor/serviço2doctor-web. Healthz200/product2doctor; entrada pública index-BfpSnWzn.js igual ao build local, asset200 e bytes idênticos. A tentativa anterior86f29cd7 falhou no transporteTLS; repetição bem-sucedida. Build completo na raiz, build2doctor e200testes passaram.

CUA público em390×844: busca biguanida metformina→1resultado/ficha correta; Limpar busca e filtros→214resultados; retorno ao chat funciona. Screenshot conferido, largura útil375/scroll375, console semerros. Localmente verificados acentos, caixa, espaços, grupo clínico, ausência de resultados e desktop1280. Sem aparelho físico, login real, chamadas clínicas ou avaliação clínica do acervo. API Vytal/ECG preservados. Commit de documentação posterior não exige novo deploy.

Próximo passo executável: revisar a navegação de busca→ficha→voltar em Medicações no celular, verificando preservação do ponto de leitura antes de qualquer mudança; não ampliar catálogo. Rollback por reconstrução383b8ac usando somente cwd scripts/wmed-app.

## Correção de verificação — busca de medicações — 25/09/2026 (build repetido)

Código 8ab4666. A última invocação do build completo inicialmente usou cwd incorreto (scripts/wmed-app), falhando por ausência do lockfile relativo esperado. Upload interrompido; Railway registrou a9455d2c-576f-4320-94c7-f0ebeb26fcb2 FAILED, mantendo 37613971 SUCCESS. Diretório descartável .vercel-out criado dentro do app removido antes de novo envio. Build completo repetido na raiz da worktree terminou exit0; 200 testes e build2doctor também aprovados. QA local móvel/desktop concluído. Publicação da correção ainda pendente; próximo passo enviar somente scripts/wmed-app e verificar SUCCESS, health, asset e UI pública. Sem teste em aparelho físico, login real ou validação clínica.

## 25/09/2026 — Busca de medicações por termos

Retomada da falha reproduzida em produção: “biguanida metformina” retornava0 pela exigência de ordem exata. Somente Medicações da2Doctor agora reutiliza matchesInstrument (normalização de acentos/caixa/espaços e todos os termos presentes em nome/classe/mecanismo em qualquer ordem). Filtro de grupo continua AND/exato. Botão Limpar busca e filtros restaura query/grupo/limite30, alvo mínimo44px; contagem acessível e singular; ausência de resultado orienta limpar. WMed/Condições/conteúdo clínico/fórmulas não alterados. Não cria sinônimos nem recomenda tratamento.

200 testes existentes e builds2Doctor/site completo passaram; helper já coberto por testes de normalização/termos combinados. CUA local390: “ BIGUANIDA metformina ”→1; Cardiovascular→0; limpar restaura214. “ascorbico vitamina”→1, ficha abre e volta; “biguanida aciclovir”→0, evitando união indevida. Mobile375/375, desktop1265/1265 sem overflow, console sem erros. Inspeção pontual da altura via CUA teve timeout, sem falha funcional; CSS fixa44px, screenshot conferido. Não houve API/modelo/conta real, teste Safari físico ou avaliação clínica. Fixture encerrada/aba63 fechada/viewport restaurado. Publicação pendente; próximo deploy/health/asset/interface. Sem testes médicos novos pois conteúdo intacto.

## 25/09/2026 — Retomada de revisão publicada

Fonte4f088d0; deployment edc83e01-f36c-4be2-8c54-2840c6ea01c3 SUCCESS em2doctor/2doctor-web. Raiz https://www.2doctor.ai/200; healthz200/product2doctor; asset/assets/index--U--TgXZ.js200 idêntico ao build local. CUA público390px carregou caso clínico e voltou à conversa, width=scroll390, console sem erros.200 testes existentes/build2Doctor/site completo passaram. Novo comportamento conferido em fixture local com casos fictícios, contagem de chamadas e falha simulada; não houve teste de sessão/casos reais, teclado Safari físico ou validade clínica. Viewport restaurado/aba47 preservada; cadastros sociais58/59 mantidos para continuidade, sem envio.

Próximo executável: quando houver e-mail/público do marketing, continuar cadastro conforme pedido; no produto, verificar uma fricção observável de navegação/busca existente antes de novas mudanças, evitando expandir formulário sem demanda. Não habilitar gravação ambiente. Worktree limpa exceto dist-samu preexistente. Não há necessidade de novas chamadas de IA para validar esta mudança de interface.

## 25/09/2026 — Retomar revisão sem refazer campos

Fricção comprovada: voltar ao Relato obrigava chamar structure novamente, sobrescrevendo correções manuais mesmo sem mudança no texto.2Doctor passa a guardar na memória do componente o relato da última organização bem-sucedida. Igualdade exata libera Continuar revisão sem nova requisição e preserva campos. Texto alterado mostra Reorganizar relato e aviso de substituição; só atualiza referência após sucesso. Falha não apaga campos anteriores. Novo caso zera referência; abrir caso salvo usa relato correspondente; troca de identidade já remonta componente. Sem persistência nova ou mudança de contrato/API.

200 testes existentes e builds2Doctor/site completo passaram. Conferência CUA em fixture local autenticada sintética390px: organizar(1)→editar campo→voltar→continuar preserva correção sem request; alterar relato→reorganizar(2) falha simulada503; restaurar texto original→continuar mantém correção; alteração nova→reorganizar(3) sucesso mostra novos campos. Logs da fixture confirmaram exatamente3 chamadas.375/375 e desktop1265/1265 sem overflow. Nenhum feedback/transcrição/modelo real chamado. Sem testes de conta real, caso salvo real, Safari físico/teclado ou validação clínica. Fixture encerrada/aba60 fechada/viewport restaurado. Sem novos testes unitários para condicional simples; comportamento conferido end-to-end na fixture. Publicação pendente; próximo deploy/health/asset/UI. Marketing continua aguardando e-mail/público, sem novo pedido.

## 25/09/2026 — Revisão de campos publicada

Fonte a860a9f; deployment c0f02fee-f965-47fb-bb76-eca43e2f2536 SUCCESS em2doctor/2doctor-web. Raiz https://www.2doctor.ai/200, healthz200/product2doctor, asset/assets/index-Cpi41wxB.js200 coincide com dist local. CUA público390px abriu caso clínico, aguardou textarea e retornou ao chat; width=scroll390 e console sem erros. Viewport restaurado/aba47 preservada.200 testes e builds completos passaram. Fluxo privado de revisão testado com fixture local; sem sessão real/feedback clínico/Safari físico. API/ECG e demais serviços preservados.

Próximo passo executável: observar continuidade ao voltar de Revisão ao Relato e editar texto, especialmente preservação/indicação de campos corrigidos, antes de alterar fluxo. Não ampliar catálogo nem habilitar consulta ambiente nesta automação. Worktree limpa salvo dist-samu preexistente.

## 25/09/2026 — Revisão: campos pendentes com acesso direto

Fricção observada no código e reproduzida em fixture: Receber feedback desativado quando queixa<3 ou história<20 caracteres, sem explicar o motivo nos campos fechados.2Doctor agora mostra pendências reais com atalho que abre/foca campo, indicação acessível e limite já exigido pelo contrato; não cria requisitos novos nem inventa dados. Opcionais vazios continuam válidos. Edição após confirmação desmarca confirmação na2Doctor; checkbox indisponível enquanto processa. Não altera backend/prompt/modelo.

200 testes passaram (3 novos: opcionais, paridade de limites/espaços com contrato, ausência de mutação). Build2Doctor e site completo aprovados, avisos de bundles grandes preexistentes. Fixture local com sessão/estruturação sintéticas sem chamadas reais:390px, dois atalhos abrem/focam campos, correção remove pendência correspondente, preencher/conferir libera feedback, editar novamente desmarca e bloqueia até revisão. Mobile375/375 e desktop1265/1265 sem overflow; console vazio. Não enviamos feedback clínico, não testamos sessão real, iPhone físico/teclado Safari nem validação clínica. Fixture encerrada/aba57 fechada/viewport restaurado. Publicação pendente; próximo passo deploy isolado e checagens públicas.

## 25/09/2026 — Cancelar espera publicado

Fonteb29ecba; deployment3d9654d5-9ea5-4b4b-8dca-9c7408ab0ffe SUCCESS no projeto2doctor/serviço2doctor-web. https://www.2doctor.ai/200, healthz200/product2doctor, asset/assets/index-CCxHXbkV.js200 idêntico ao build local. Conferência CUA pública390px abriu Caso clínico, formulário completo carregou e voltou à conversa, sem overflow390/390 nem erros de console. Viewport restaurado; aba47 preservada.197 testes/build2Doctor/build completo passaram. Autenticação real/transcrição real/Safari físico não testados; fluxo novo validado com sessão e áudio sintéticos locais. Sem mudanças de API, ECG, fornecedor ou gravação ambiente.

Próximo passo executável: observar fricção na revisão dos campos após transcrição (texto/campos e navegação móvel), sem ampliar catálogo. Projeto de consulta assistida continua separado, aguardando escopo técnico próprio antes de habilitar áudio ambiente. Worktree limpa exceto dist-samu preexistente. Cancelamento interrompe somente a espera cliente, não garante interrupção do upstream; áudio recuperável apenas na aba atual.

## 25/09/2026 — Cancelar espera da transcrição

Correção de fricção no ditado existente: botão Cancelar espera junto aos controles de áudio (2Doctor). Cancelamento libera formulário, mantém Blob apenas na aba para nova tentativa/descarte e preserva relato. Controller criado antes da leitura; cancelamento durante leitura não inicia envio, resposta tardia não é anexada, tentativa nova é independente. Cancela espera no navegador, sem garantir interrupção do processamento upstream; API/fornecedor inalterados. Não habilita gravação ambiente.

197 testes passaram, incluindo quatro novos de cancelamento antes/durante leitura, resposta tardia/nova tentativa, sucesso/erro. Build2Doctor e build completo do site passaram. Fixture local com sessão sintética e WAV silencioso: primeira resposta atrasada25s, cancelar→repetir usa mesmo áudio e anexa somente resposta nova; texto prévio preservado após resposta antiga. Segunda conferência390px comprovou controle próximo ao áudio, cancelar→descartar e botões liberados. Sem overflow375/375. Sem teste de voz real, autenticação real, Safari/iPhone físico ou validação clínica. Fixture encerrada, abas55/56 fechadas, viewport restaurado. Publicação pendente; próximo passo deploy isolado, health/asset/interface públicos.

## 25/09/2026 — Correção de permissão publicada

Fonte0d47b62; deployment9634ecde-c9ec-4e90-85ae-2a11556976c6 SUCCESS no projeto2doctor/serviço2doctor-web. https://www.2doctor.ai/200, healthz200/product2doctor, entrypoint/assets/index-FGrE3CYH.js200 idêntico ao build local. CUA público390 abriu caso clínico e voltou ao chat; width=scroll390, console semerros. Viewport restaurado/aba47 mantida. Nenhum microfone ou API de transcrição real acionado.

193 testes e builds2Doctor/site completo passaram. Corrida de permissão testada com dispositivos sintéticos locais: autorização após saída não inicia gravação e libera stream; recusa destrava controles; nova autorização inicia simulador e Parar libera tracks. Teste móvel de retorno/repetição foi limitado por sobreposição do painel da fixture, completado no desktop; não alegar validação em Safari/iPhone físico. Não testados sessão real, áudio/voz real, fidelidade clínica ou fornecedor. API/ECG/outrosprodutos intactos. Próximo passo executável: revisar a continuidade da transcrição quando usuário sai/volta ao caso e clareza de estados pendentes, ou protótipo de consulta assistida simulada segundo direção documentada; não habilitar gravação ambiente/modelos automaticamente. Worktree limpa exceto dist-samu preexistente.

## 25/09/2026 — Permissão do microfone: corrida corrigida

Código permitia múltiplos getUserMedia enquanto aguardava permissão e verificava apenas montagem, não tela ativa, após resolução. Correção2Doctor: pedido único com ticket, estado Aguardando microfone e orientação de que ainda não grava; sair da tela/desmontar invalida ticket. Resposta tardia libera somente as tracks recebidas e não inicia MediaRecorder, não sobrescreve stream novo nem gera erro atrasado em nova tela. Conclusão antiga não destrava pedido mais recente. Stream capturado por cada gravação é encerrado pelo próprio onstop/catch. Não muda fornecedor/modelo/limite/gravação ambiente.

193 testes passaram (4 novos de exclusão, cancelamento, ordem de respostas e tracks), build2Doctor e build completo aprovados. Fixture local cópia temporária do build com navigator/MediaRecorder simulados, sessão sintética, sem microfone real/áudio/upstream: CUA390 pediu permissão, saiu ao chat, autorizou tardiamente → pedidos1/gravações0/tracksencerradas1. Em desktop1280, recusa retornou mensagem conhecida e botão reabilitado; tentativa seguinte autorizada → gravação simulada1, Parar → tracksencerradas1; Blob vazio rejeitado localmente. Sobreposição do painel da fixture atrapalhou cliques de retorno no celular; cenário de recusa/repetição foi conferido no desktop, sem atribuir o problema da fixture ao produto. Sem teste em aparelho físico, permissão nativa real, voz, transcritor ou autenticacão real. Publicação pendente. Fixture encerrada/aba54 fechada/viewport restaurado. Próximo deploy/health/asset/UI; depois revisar transições de estado necessárias à futura consulta assistida, preservando escopo atual de ditado.

## 25/09/2026 — Nova tentativa de áudio publicada e conferida

Fonte3fc41a7; deployment5e71cc68-03fe-4c78-99d4-88ce39ef18f9 SUCCESS em2doctor-web/projeto2doctor. Raiz https://www.2doctor.ai/200, healthz200 product2doctor, asset/assets/index-B8oJlBk3.js200 igual ao build local. CUA público390: chat→Discutir um caso abriu relato/áudio e voltou normalmente, width=scroll390, console semerros. Viewport restaurado. 189 testes, build2Doctor e build completo aprovados. Sessão sintética, WAV e retries usados apenas no servidor local isolado, encerrado após QA; não enviados em produção. Aba53 fechada;47 oficial mantida.

Áudio pendente só em memória do componente; sucesso/descarte encerra pendência. Falha recuperável testada localmente com mesmos bytes e sem duplicação de texto. Não testados transcritor real, voz/microfone, sessão expirada, aparelho físico ou validade clínica. Não é Scribe de consulta completa; protótipo permanece Laboratório, sem novos modelos/fornecedores/persistência. Próximo passo concreto ligado a Scribe: revisar o ciclo de permissão do microfone e saída da tela no ditado existente; depois protótipo de consulta simulada conforme escopo documentado. Não ampliar catálogo automaticamente. Git somente dist-samu preexistente fora do escopo.

## 25/09/2026 — Áudio do caso clínico: nova tentativa sem regravar

Fricção confirmada no código: erro de transcrição descartava acesso ao Blob e exigia gravar/selecionar novamente. 2Doctor agora mantém áudio pendente apenas no estado do componente/aba durante falha; Tentar transcrição novamente requer ação e sessão, Descartar áudio libera controles sem apagar relato. Sucesso limpa referência; fechar/desmontar/trocar identidade elimina estado, sem armazenamento local/histórico. Enquanto pendente, novo áudio/histórico/organizar ficam bloqueados para evitar perder/ignorar gravação; aviso beforeunload e proteção de reset existentes consideram pendência. Guard contra tentativas simultâneas. Entrada vazia/incompatível/maior2,9MB é recusada antes de reter/enviar. Não habilita gravação ambiente, novo fornecedor, consulta inteira ou persistência clínica.

189 testes passaram, build2Doctor e build completo passaram (aviso conhecido de chunks). Fixture HTTP isolada localhost5214 com sessão sintética e handlers próprios sem upstream, WAV silencioso1s: falha503 primeira tentativa, sucesso segunda com mesmos bytes, texto original preservado e uma única transcrição fictícia acrescentada; terceira tentativa falhou e descarte não fez quarto envio nem apagou relato. CUA390 botões visíveis/largura=scroll375, controle de envio reativado após descarte. Não foi testado transcritor real, microfone, áudio de paciente, sessão real/expiração, aparelho físico ou fidelidade médica. Publicação pendente. Próximo verificar Railway/raiz/asset/UI; depois continuar desenho da consulta assistida no Laboratório conforme direção mais recente, sem expandir catálogo.

## 25/09/2026 — 2Doctor publicada na raiz do domínio

Pedido concluído: https://www.2doctor.ai/ agora responde200 diretamente, sem /2doctor/. Fonte e1a8cf3; deployment28e01e70-eeab-4cc1-b6c1-3d880c6f2345 SUCCESS no serviço isolado2doctor-web. Health200/product2doctor, asset /assets/index-CvSuSvj2.js200 igual ao build local, favicon200, auth anônimo200. /2doctor/ redireciona para / e querylang preservada. CUA aba47 recarregada foi para /#chat; clique scores→busca→volta chat funcionou, width=scroll375, console semerros. Viewport restaurado. DNS, PUBLIC_ORIGIN, API/cookies, outras aplicações e acervos não alterados. 186 testes + builds2Doctor/site completo aprovados.

Scribe reforçado como próxima prioridade: consulta gravada/transcrição automática, registro fiel e hipóteses/condutas sugeridas em áreas separadas, revisão do médico. Conceito detalhado em2DOCTOR_SCRIBE.md; não está implementado como consulta contínua nem validado para uso real. Capacidade existente é áudio curto do caso clínico, não consulta completa. Próximo executável: protótipo de uma tela Nova consulta com simulação e estados de captura/transcrição/revisão, avaliar pipeline existente para áudio longo e diarização, sem novo fornecedor/persistência ou dados reais antes de avaliação. Jev não é transcritor e não possui acesso confirmado. Não testar dados clínicos reais automaticamente. Não foram testados login real, todas as telas3D, dispositivo físico ou gravação/IA. Repo limpo exceto dist-samu preexistente. Servidor de teste encerrado.

## 25/09/2026 — Migração da 2Doctor para a raiz, pronta para publicação

Pedido explícito: remover /2doctor/ da URL e reforçar Scribe como consulta assistida. Build/dev2Doctor passam base /; servidor isolado serve index e assets na raiz. /2doctor, /2doctor/ e /2doctor/index.html redirecionam302 para / preservando query e fragmento pelo navegador. Aliases de assets anteriores preservados para arquivos ainda existentes, sem prometer preservar hashes antigos. API/auth/cookiePath/api/wmed e proxy/acervos inalterados. Recuperação de atualização reconhece entrypoints legados e da raiz, abre nova aba na raiz.

186 testes passaram (rotas, redirects, range/HEAD, host/origin/auth e detecção de versão ajustados), build2Doctor e build completo do site passaram. CUA local: /2doctor/#scores virou /#scores; desktop e390px, menu→medicações carregou214itens, width=scroll375, console semerros. Testes reais de login, mensagens, todas as bibliotecas3D e aparelho físico não executados. Publicação ainda pendente nesta entrada. Scribe: escopo documentado em2DOCTOR_SCRIBE, sem gravação/IA nova habilitada; consulta inteira é prioridade de produto, não expandir catálogo sem demanda. Próximo publicar isoladamente e verificar raiz/domínio/asset/UI.

## 25/09/2026 — Recuperação após atualização publicada

Fonte c18e4fc; Railway deployment21b216df-326d-4b95-9762-ae63f10b1c74 SUCCESS no projeto2doctor/serviço2doctor-web. healthz200/product2doctor, HTML200, entrypoint index-DpfvKWM2.js200 igual ao build local. CUA público390 confirmou entrypoint novo, scores/busca Glasgow/volta ao chat, width=scroll375, console semerros. Viewport restaurado, aba oficial47 mantida; fixture local encerrada e abas50/51 fechadas.

186 testes + build2Doctor + build completo aprovados. Fluxo de erro reproduzido end-to-end só na fixture local (arquivos públicos rotacionados, nova aba funcional, rascunho original preservado), sem provocar erro em produção. Limites: não transfere conversas entre abas, não recupera campos de componente que já caiu, não corrige código de abas abertas antes deste deploy sem atualização inicial, não testado login real entre abas ou aparelho físico. Nenhuma nova persistência, fornecedor, modelo ou conteúdo clínico. Próximo executável: revisar duplicação e identificação dos scores conceituais versus instrumentos existentes, preservando acervo e sem alterar algoritmos sem fontes/validação. Scribe doc e dist-samu preexistentes preservados.

## 25/09/2026 — Recuperação de aba antiga, verificada localmente

Fricção reproduzida: após publicação, aba aberta tenta baixar chunk removido e retry não resolve. Correção exclusiva da recuperação2Doctor: diante de falha de import, compara nome do entrypoint público atual com o carregado, GET sem credenciais/cache e timeout5s. Só quando diferença confirmada mostra Nova versão disponível e link explícito Nova aba para a mesma ferramenta, noopener/noreferrer. Não recarrega automaticamente, não copia nem persiste conversa/rascunhos; aba original permanece. Rede falha/página desconhecida/rendererror mantêm recuperação anterior, sem alegar atualização.

186 testes passaram (4 novos de reconhecimento, troca/sameversion, erros/offline e requisição pública), build2Doctor e build completo do site aprovados; aviso existente de chunks grandes. Fixture descartável local copiou dist, abriu chat com rascunho fictício, rotacionou nomes de entrypoint/Libraries e retirou chunk velho. CUA390 confirmou aviso, clique abriu aba51 com35 instrumentos, voltar ao chat na aba50 preservou rascunho literal (limpo depois). Nenhum dado real enviado. Viewport restaurado. Não testados aparelho físico, consulta real, sessão autenticada entre abas nem atualização de código já aberto antes desta correção. Publicação pendente. Próximo executar deploy/health/asset/UI no domínio oficial; depois retomar fricções concretas existentes, sem ampliar catálogo.

## 25/09/2026 — Diretório compacto publicado

Fonte cdecc7c; deployment a6ad2454-4c96-4c24-a7e6-e43933e19831 SUCCESS em 2doctor-web/projeto2doctor. healthz200 product2doctor, página200, asset index-DUyHWt5B.js200 igual ao build local. CUA público390: busca CHA2DS2 encontra CHA₂DS₂-VASc; limpar restaura catálogo35, layout branco conferido, largura/scroll375 (sem overflow), viewport restaurado. Testes182 e ambos builds aprovados, conforme entrada anterior. Nenhum módulo ou algoritmo médico adicionado.

Achado na conferência: aba pública aberta antes do deploy ainda executava index-Cph0ep6r.js; ao navegar por hash tentou baixar Libraries-D9gFa2hr.js removido e exibiu limite de erro. Reload carregou index-DUyHWt5B.js e resolveu. Não é falha do novo diretório; é uma fricção real de atualização de abas antigas. Próximo passo executável: melhorar recuperação de chunks obsoletos sem recarregar automaticamente nem perder rascunho/conversa. Separação dos scores conceituais permanece pendente, sem alegação de validação clínica. Não testados aparelho físico, auth/chat real ou precisão clínica nesta rodada. Scribe doc e dist-samu preexistentes preservados; servidor local encerrado.

## 25/09/2026 — Diretório de calculadoras: menos rolagem e busca coerente

Implementação local: lista compacta em duas colunas no desktop e uma no celular, mantendo todas as descrições; busca 2Doctor por nome/sigla/especialidade traduzida, tolerante a acentos, subscritos e espaços; limpar filtros em uma ação. Fórmulas e conteúdo clínico não alterados. WMed conserva apresentação e busca anteriores.

182 testes passaram, build2Doctor e build completo do site aprovados (aviso existente de chunks grandes). CUA local: 390 e 320px sem overflow horizontal; busca cardiologia+HEART retorna um item; abertura/volta preserva filtro; estado vazio e limpeza funcionam; busca em inglês neurology+glasgow confirmada; desktop1280 conferido. Sem erros de console. Não houve teste em aparelho físico, autenticação/envio real, validação clínica ou novo teste dos algoritmos além da suíte existente. Publicação pendente nesta entrada. Próximo: verificar deploy/health/asset/UI; depois revisar distinção dos exemplos conceituais já existentes, sem ampliar catálogo.

## 25/09/2026 — Simplificação publicada e verificada

Fonte d5b220a; deployment8370a73b-ceb2-403e-9410-98234e49f70c SUCCESS no serviço isolado2doctor-web. https://www.2doctor.ai/healthz200/product2doctor, página200 e asset index-Cph0ep6r.js igual ao build local/HTTP200. CUA público390px: chat sem textos/menu redundantes, Plantão com caso/scores/medicações/condições/imagens/divisão de plantão; sem Exames, Scribe e fontes nessa categoria. Menu abre/fecha e devolve foco, width/scroll390, console semerros. Viewport restaurado e aba oficial47 mantida.

180 testes, build2Doctor e build completo aprovados. Exames retirado do catálogo e acesso antigo abre chat; Scribe demonstrativo em Laboratório, fontes oficiais em Pesquisa. País/idioma preservados nas preferências. Teste local confirma rascunho preservado ao sair para scores e voltar. API, autenticação, histórico, conteúdo médico e bibliotecas intactos. Não testados envio/autenticação real, dispositivos físicos ou precisão clínica dos acervos nesta mudança. Código anterior preservado no Git, rollback f6e11be se necessário.

Decisão vigente: menos fricção, sem expansão automática de funcionalidades. Automação ACTIVE/30min atualizada e confirmada. Próximo executável: auditar utilidade e clareza de tarefas existentes, começando por separar exemplos conceituais de calculadoras completas; não apresentar protótipos como recursos clínicos validados e não acrescentar módulos sem direcionamento.

## 25/09/2026 — Direção corrigida: simplificar o trabalho do médico

Usuário rejeitou excesso de features, especialmente Exames laboratoriais. Nova prioridade explícita substitui fila de expansão: reduzir etapas e melhorar tarefas existentes. Não recriar comparador de laudos, desafios ou novos módulos sem demanda. Chat central, caso clínico, calculadoras, medicações, condições, acervos e pesquisa continuam. Não confundir protótipo com ferramenta clínica pronta.

Em implementação: retirar Exames laboratoriais do catálogo público (URL antiga retorna chat); retirar menu redundante Ferramentas da conversa, atalhos de país e sugestões da home, preservando três ações principais e preferências de país/idioma no menu; Plantão começa por caso/scores/medicações/condições/imagens, com divisão de plantão ao final; fontes oficiais em Pesquisa; Scribe demonstrativo apenas no Laboratório. Código anterior preservado no Git. API, conteúdo médico, modelos e dados intactos.

Automação evoluir-a-2doctor-internacional atualizada mantendo ACTIVE/cadência30min/thread: corrigir fricção real, não criar features para preencher rodadas; novas features exigem direcionamento. 180 testes passaram. UI local PT/ES em390px e PT320px: menu reorganizado, link antigo Exames abre chat, score abre e retorna preservando rascunho, sem overflow/erro. Cabeçalho inicial encurtado: removidos slogan e texto genérico, marca menor no celular; em320×740 os três atalhos principais ficam inteiros acima da navegação. Build completo final em verificação antes de publicar. Próximo após publicação: auditar tarefas existentes, incluindo distinguir calculadoras completas de exemplos conceituais, sem anunciar estes como ferramentas prontas de plantão.

# Direção atual — utilidade clínica, sem desafios — 25/09/2026

Decisão explícita do usuário: abandonar completamente o formato de desafios. Esta decisão substitui TODAS as filas e sugestões históricas abaixo. Não retomar desafios diários, competições, rankings ou novos quizzes como estratégia de crescimento. Banco de questões e bibliotecas existentes preservados.

## Fila ativa

1. Usabilidade móvel e regressões sempre primeiro.
2. Cobertura funcional WeMEDS solicitada pelo usuário: matriz completa em [2DOCTOR_WEMEDS.md](2DOCTOR_WEMEDS.md). Primeira entrega: estilos de resposta e divisão de plantão PT/EN/ES. Fontes regionais implementadas: [2DOCTOR_OFFICIAL_SOURCES.md](2DOCTOR_OFFICIAL_SOURCES.md). Fichas laboratoriais iniciais: [2DOCTOR_LAB_REFERENCE.md](2DOCTOR_LAB_REFERENCE.md), protótipo PT/EN/ES sem interpretação clínica validada. Atalhos explícitos implementados: [2DOCTOR_CHAT_TOOLS.md](2DOCTOR_CHAT_TOOLS.md). Recuperação de módulos: [2DOCTOR_MODULE_RECOVERY.md](2DOCTOR_MODULE_RECOVERY.md). Recuperação da pesquisa: [2DOCTOR_RESEARCH_RECOVERY.md](2DOCTOR_RESEARCH_RECOVERY.md). Seleção e exportação simples de referências implementadas: [2DOCTOR_REFERENCE_EXPORT.md](2DOCTOR_REFERENCE_EXPORT.md). Ficha de sódio PT/EN/ES adicionada, com fonte primária e limites, sem interpretação/conduta automática. Auditoria de ânion gap/Winter, validação decimal e apresentação corrigidas: [2DOCTOR_ACID_BASE.md](2DOCTOR_ACID_BASE.md). Corpus offline de 38 exemplos autorais concluído: [2DOCTOR_ACID_BASE_EVALUATION.md](2DOCTOR_ACID_BASE_EVALUATION.md), revisão clínica pendente e interpretação automática desabilitada. Ficha de glicose PT/EN/ES e revisão da fonte de potássio concluídas, sem limiares diagnósticos/urgência. Scribe móvel revisado: atalhos de seção/revisão e prévia recolhível. Domínio https://www.2doctor.ai online e verificado. Próximo: melhorar descoberta de ferramentas existentes; autenticação real no novo host ainda depende de login do usuário. As demais trilhas abaixo permanecem relevantes.
3. Scribe: especificação em [2DOCTOR_SCRIBE.md](2DOCTOR_SCRIBE.md). Protótipo determinístico SOAP implementado; contrato extrativo e avaliação offline v1 concluídos (2DOCTOR_SCRIBE_EVALUATION.md). Demonstração SBAR com fatos/recomendações já informados implementada; geração livre segue não habilitada. Próximo: atalhos contextuais do chat para recursos existentes, com seleção explícita e sem inferir diagnóstico. Não confundir com feedback educativo de casos.
4. Passagem de plantão SBAR e encaminhamento derivados exclusivamente do relato e plano confirmados pelo profissional.
5. Evidências relacionadas à dúvida, com fontes verificáveis; explicação visual 3D para ensino, selecionada pelo profissional.
6. Tradução PT/EN/ES de ferramentas existentes, terminologia e modelos documentais por país. Medir utilidade por conclusão da tarefa e correções da nota, nunca inferir competência clínica.


## Retirada dos desafios

Removidos do catálogo de módulos, renderizador, home, menu e atalhos por país. Links antigos resolvem para o chat pelo fallback existente. Código e dados locais anteriores preservados apenas como histórico; não há entrada pública para o recurso. Automação existente permanece a cada 30 minutos, com esta decisão explícita. Scribe agora tem demonstração determinística (ver SCRIBE), ainda sem IA e sem validação clínica.

## Verificação da retirada

131 testes existentes passaram. Build 2Doctor e build completo do site aprovados (aviso pré-existente de chunks grandes). CUA local: link antigo de desafio abriu chat; home e menu Estudos sem desafios em390px, demais bibliotecas preservadas; país EUA mostra Interpretar um estudo e abre a ferramenta (NNT25 no exemplo fictício); tela320px sem overflow horizontal ou erros de console. Scribe não executado, áudio não gravado; login/histórico autenticados, aparelhos físicos e revisão clínica não testados nesta mudança. Publicação isolada pendente da confirmação final. Git anterior a21a90f preserva o estado de rollback, sem intenção de retomar desafios.


Publicação da retirada confirmada em25/09/2026: fonte e756f10; deployment2d06df58-462e-4df7-9e3e-cfe39c3d3114 SUCCESS, health200/product2doctor, assetindex-DA-h0-HE.js idêntico ao local e HTTP200. CUA público: reload do link antigo abriu chat; home390px sem Desafio do dia, sem overflow horizontal/erros de console. Viewport restaurado. Nenhuma alteração emAPI/ECG/outrosprodutos. Próximo: protótipo Scribe com relatos fictícios conforme2DOCTOR_SCRIBE.md, sem desafios. Scribe ainda não implementado nem validado. Rollback técnico por reconstruçãoa21a90f, apenas se necessário para incidente; decisão de não retomar desafios permanece.

## 25/09/2026 — Scribe demonstrativo publicado e verificado

Fonte ace3939, deployment a1ae3781-47cd-4341-a9fe-fbe43c7fdb82 SUCCESS exclusivamente no serviço2doctor-web. Health200/product2doctor, assetindex-bsBTGXgA.js igual ao build local eHTTP200. Público: https://2doctor-web-production.up.railway.app/2doctor/#scribe . CUA público390px: organizaçãoSOAP, edição, revisão invalidada após editar, copiar desabilitado, reinício com confirmação; semoverflowhorizontal, campos sem rolagem interna nos exemplos e console semerros. Demo reiniciada e viewport restaurado.

135testes + build2Doctor + sitecompleto aprovados; QA local PT/EN/ES,320/390/1280, claro/escuro e cópia selecionável. Não houve áudio, paciente real, API/modelo novo, persistência clínica ou treinamento. Não testados aparelhos físicos, auth/histórico real, eficácia/validação clínica. É demonstração determinística com2casos fictícios, não Scribe generativo. Próximo executável: contrato e conjunto sintético de avaliação de texto livre com trechos de origem e checagem de negações/doses/unidades/correções, offline e sem ativar fornecedor/modelo. Desafios continuam abandonados. Rollback reconstruindo958f12c comcwd scripts/wmed-app.

## 25/09/2026 — Scribe demonstrativo pronto para publicação

Entrega na worktree2doctor-preview: Plantão → Scribe · demonstração, exclusivo2Doctor. Dois relatos fictícios autorais PT/EN/ES, organizaçãoSOAP determinística, nota editável, trechos de origem, informação ausente vazia, revisão antes de exportar; edição invalida revisão; exportação marcada como exemplo fictício. Confirmação antes de substituir edições, idioma da nota preservado ao mudarUI e recarga explícita. Rascunho em memória apenas, descartado ao sair com aviso; nenhuma API/modelo/gravação/persistência clínica nova. Chat/banco de questões intactos; desafios continuam abandonados.

135testes passaram: preservação literal dos trechos, negações/incerteza/correção500→850mg e frequência ausente, ausência de exame/avaliação/plano, estados de revisão/exportação. Build2Doctor e sitecompleto aprovados, aviso pré-existente de chunks grandes. CUA local390/320/1280 PT/EN/ES: organizar, editar, reviewinvalidada, substituição cancelar/confirmar, cópia com texto selecionável, fontes abertas, dark/light, idioma com preservação de nota e recarga, menu Plantão; sem overflow/consoleerros. Camposautoheight corrigidos apósQA, sem rolagem interna dos exemplos. Não rodados aparelho físico, login/auth/fluxos clínicos reais, áudio, avaliação gerativa ou validação clínica externa.

Fonte primáriaMDH para estruturaSOAP, casos/textos autorais sem mídia externa. Próximo: publicar somente2doctor-web a partirscripts/wmed-app comDockerfile/path-as-root; verificarSUCCESS/health/asset/UI. Depois contrato + conjunto sintético de avaliação de texto livre com trechos obrigatórios; NÃO habilitar IA clínica antes de avaliação própria. Rollback por reconstrução958f12c.


## Oportunidade em avaliação: FleXray

Ver [2DOCTOR_FLEXRAY.md](2DOCTOR_FLEXRAY.md). PesosNC: não integrar ao produto comercial sem licença/autorização; nenhuma inferência liberada. Não substitui a filaScribe.

## 25/09/2026 — Radar web e pesquisa no X

Entrega e fontes em [2DOCTOR_RADAR.md](2DOCTOR_RADAR.md). Destaque FleXray com demo externa e prévia do acervo licenciado; oportunidades MedASR/EVEE. Nenhum modelo novo integrado. Preserva prioridade Scribe e bloqueio comercial dos pesos FleXray. Publicação será registrada no documento.

## Histórico arquivado — não executar as filas abaixo

# Produto internacional e crescimento por utilidade — 25/09/2026

## Entrega desta rodada

1. **Seu país**: diretório de 12 contextos, independente do idioma, com fonte oficial, finalidade e atalhos às ferramentas existentes. Em celular, seletor nativo; em desktop, cartões pesquisáveis. Não é homologação clínica, treinamento completo para cada prova nem certificação profissional.
2. **Desafio do dia**: sete questões autorais de leitura crítica, PT/EN/ES, feedback imediato, dica de memorização, fonte e link estável por questão. Sugestão diária gira nesse conjunto finito; não são sete novos itens todos os dias. Primeira resposta salva apenas neste aparelho; não há ranking global, sincronização entre aparelhos nem certificação de competência. Compartilhar depende de uma ação do usuário; nada é enviado a terceiros automaticamente.
3. **Interpretar um estudo**: comparação educativa de riscos absolutos de um evento indesejável no mesmo período; diferença absoluta, risco relativo e NNT/NNH arredondado para cima. Dados iniciais fictícios. Não converte odds/hazard ratio em risco, não calcula IC e não demonstra causalidade. Valores iguais, zero basal, dano e entradas inválidas têm tratamento explícito.

Navegação mantém o chat como início. Dois atalhos discretos na tela inicial; país/desafio em Estudos, leitura crítica em Pesquisa. As três novas telas são trilingues; bibliotecas antigas ainda podem estar em português, com aviso.

## O que desenvolver por mercado (proposta; não entregue ainda)

| Mercado | Próxima utilidade específica | Distribuição a testar |
|---|---|---|
| Brasil | Revisão autoral por temas do ENAMED, feedback de caso e simulados revisados | Desafio entre turmas, com comentário e fonte |
| Portugal | Português europeu, termos clínicos locais, discussão de caso orientada à PNA | Grupos de estudo e portfólio de aprendizado |
| EUA | Fundamentos visuais e raciocínio por etapas; questões autorais mapeadas ao conteúdo USMLE | Desafios de mecanismos com cena 3D anotada |
| Reino Unido | Comunicação clínica, passagem de caso e incerteza; matriz MLA/PLAB | Cenários curtos de comunicação e ensino entre colegas |
| Espanha | Casos e imagens autorais, revisão do conteúdo MIR | Desafio de imagem com explicação após responder |
| México | Raciocínio para ENARM com referências mexicanas e revisão local | Grupos pequenos de revisão compartilhada |
| Argentina | Revisão por temas e processos de ingresso em residência | Rodadas de casos entre colegas |
| Colômbia | Registro/formação, atenção primária e fontes locais; residências variam por instituição | Casos fictícios comentados em grupos de estudo |
| Chile | Conteúdo mapeado à matriz/perfil EUNACOM, com versão explícita | Revisões curtas de clínica geral |
| Canadá | Decisão clínica e comunicação, conteúdo relacionado ao MCCQE; francês depois de revisão | Journal clubs e discussão estruturada de evidência |
| Austrália | Casos e comunicação voltados às competências do AMC, referências locais | Sessões curtas de raciocínio entre estudantes/IMGs |
| Índia | Básicas visuais e questões por mecanismo; distinguir NEET-PG de FMGE | Desafios leves, acessíveis em redes lentas |

Essas são hipóteses de produto. Não há estimativa comprovada de mercado nem garantia de viralidade/aprovação. Não copiar questões protegidas, emblemas ou marcas de organizadores para sugerir vínculo. Registrar evidência e licença de cada acervo.

## Fila executável

1. Regressões mobile têm prioridade. Conferir navegação, teclado, rolagem, fonte16px e compartilhamento com poucos toques em 320/390px; iPhone/Android físicos ainda necessários.
2. Expandir desafios com conteúdo autoral validado por fonte e revisão clínica, variando áreas e posições das respostas; adicionar roteiro de revisão por erros sem inferir competência profissional. Rever cada tradução e criar testes dos resultados.
3. Tradução de scores/calculadoras e apresentação de casos; depois glossário controlado PT/EN/ES e adaptação PT-PT. Preservar unidades e regras clínicas, nunca traduzir nomes comerciais como equivalentes automáticos.
4. Exportar cartões de estudo/3D com atribuição e link de retorno, apenas de conteúdo curado ou caso fictício. Confirmar licenças dos modelos. Não publicar conversa/caso real por padrão.
5. Montador PICO com pesquisa de referências reais e exportação bibliográfica. Depois, journal club privado com comentários e moderação, sem dados de pacientes.
6. Evoluir para revisão por prova com matriz versionada e questões próprias. Só afirmar alinhamento depois de cobertura e revisão documentadas.
7. Medir funil agregado com minimização/consentimento apropriado: abrir desafio → responder → abrir fonte → copiar/compartilhar → visita pelo link → retorno em7dias. Ainda NÃO há instrumentação nem dados de crescimento nesta entrega. Não capturar perguntas de chat, texto clínico ou destinatários.
8. Cadastro/cobrança internacional, suporte, privacidade e revisão por país continuam necessários antes de declarar produto global completo. Não executar compras/parcerias/disparos promocionais sem autorização específica.

## Fontes primárias

Diretório e URLs por país: `shared/country-hub.mjs` (Inep, ACSS, USMLE, GMC, Sanidad, CIFRHS, Ministerio de Salud AR/CO, EUNACOM, MCC, AMC, NBEMS), consultados em25/09/2026. Links oficiais, sem ingestão de questões de exame.

Fontes das questões em `shared/challenges.mjs`: Oxford CEBM (NNT e medidas de efeito), Cochrane (acurácia e valores preditivos), NCI (randomização) e CDC Field Epi Manual (desenhos e prevalência). Questões/exemplos numéricos são autorais; não são resultados de estudo real. Matemática isolada em `shared/evidence-math.mjs`.

## Continuidade e limites

Rotina existente `evoluir-a-2doctor-internacional`, nesta conversa, a cada30minutos (alterado a pedido do usuário em25/09/2026). Atualizar escopo para esta fila sem duplicar tarefa nem prometer execução ininterrupta. Execução local depende de computador ligado/app em execução: https://learn.chatgpt.com/docs/automations?surface=app .

Publicar somente no projeto Railway2doctor/serviço2doctor-web. API Vytal, ECG, WMed e outros sites preservados. Segredos e dados identificáveis nunca em frontend/Git. Próximo passo desta rodada: QA final, testes/build completo, commit e deploy isolado; registrar resultado abaixo.

## Validação antes da publicação

126/126 testes passaram, incluindo matemática de benefício/dano/zero/valores inválidos, tradução de questões, roteamento de links e progresso tolerante a corrupção. Build 2Doctor e build completo do site aprovados; aviso preexistente de bundle grande em questões permanece.

CUA local: 390×844 e320×568, diretório com seleçãoUS independente do idioma, fonteUSMLE, desafioVPP com resposta20%/explicação; persistência depois de reload e trocaPT→ES; próximaquestão voltou ao topo; copiarlink exibiu URL completa e estável. Clipboard do harness retornou vazio apesar do toast, portanto foi adicionada caixa de link selecionável; não afirmar envio real ao WhatsApp. Leitura crítica mostrouNNT25 (12%→8%), NNH17 (12%→18%) e rejeitou101%; fórmulas comzero/equaldados também testadas por unidade. EN centralpaís e buscaMIR retornaramEspanha; desktop1280 revisado; console sem erros.

Não testados: iPhone/Android físicos, teclado nativo, WebShare enviado a destinatário real, login/chat/histórico autenticados (não mudaram), revisão clínica/terminológica externa ou métricas reais de crescimento.

Heartbeat existente atualizado com esta fila; mantidoACTIVE a cada6horas, sem duplicação, após consulta à documentação oficial. Não é execução ininterrupta garantida.

## Publicação verificada — 25/09/2026

Fonte `3bc36ec`, branch `codex/2doctor-preview-20260925`. Deployment Railway `24d1e8cb-7d7e-467e-b915-f31267071ea5` SUCCESS, somente serviço `2doctor-web`. Público: https://2doctor-web-production.up.railway.app/2doctor/ . Health OK e HTML com `index-0F2UPUUc.js`, igual ao build aprovado.

CUA público em 390×844: atalhos na home, desafio carregado, copiar link exibiu URL pública estável da questão, navegação para leitura crítica mostrou NNT25 no exemplo12%→8%, retorno ao chat e diretório com12países. Sem erro de console; calculadora sem overflow horizontal. Não houve envio a destinatário real nem modificação de conta. Limites da seção anterior permanecem.

Rollback por reconstrução do Git `6a80e88` (estado anterior); deployment anterior `bc224585-a083-4f87-85f0-fa8c924b35c8` está REMOVED após substituição, portanto não assumir instância ativa. Próximo passo: tradução e revisão das ferramentas de plantão, expansão de desafios autorais por área e preparação de cartões3D compartilháveis com licença conferida; regressões mobile continuam prioritárias.

## Continuação — calculadoras internacionais e rotina30min

A automação existente foi atualizada pelo app para ACTIVE a cada30minutos, sem duplicação; prompt e limites preservados.

Cinco calculadoras agora têm títulos, campos, opções, resultados, validação, notas e fórmulas de exibição PT/EN/ES: IMC, superfície corporal Mosteller, CKD-EPI2021, ânion gap e Winter. Motor/fórmulas/unidades de entrada/limites intactos; não há conversão automática de unidades por país. Busca aceita nome traduzido, original e identificador; seletor de especialidade mantém valores estáveis. Aviso de português restrito aos scores ainda não traduzidos, menu indica tradução parcial.

128testes passaram, incluindo preservação dos códigos/intervalos clínicos e erros traduzidos por campo. QA local em390/320px: buscaGFR, CKD-EPI60anos/Cr1/masculino=86.16, idade15 rejeitada; trocaEN→ES mantém valores e mostra86,16; Borrar limpa campos e resultado. Sem overflow ou erros de console. Não realizados aparelho físico, validação clínica externa ou fluxos autenticados. NIDDK e CDC consultados; nenhuma nova recomendação/limiar clínico. Build completo aprovado; publicação desta continuação pendente da validação final.

### Contexto obrigatório para deploy

Executar `railway up . --path-as-root` com diretório de trabalho **scripts/wmed-app**, que contém Dockerfile/railway.json e .railwayignore. Nunca a raiz do repositório: a tentativa9a17c570 acionou Railpack/Caddy e produziu404 apesar de SUCCESS; foi substituída por publicação do contexto correto. Conferir healthz, asset público e navegador em toda rodada. Instrução adicionada também ao heartbeat30min.

Publicação final: deployment9e1b0fe0-4560-4d10-8cb7-b17e67a6a2f5 SUCCESS, Dockerfile do app, fonte8745b54. Health200 comproduct2doctor; HTML/assetindex-D7WAKxcy.js confere com buildlocal. QA público390px emPT:5calculadoras, IMC80kg/200cm=20, Limpar e console semerros. EN/ES verificados localmente conforme acima. Falha transitória de contexto anterior resolvida. Rollback por reconstruçãoGit6fdab21 a partir de scripts/wmed-app. Próximo: desafios por área/revisão por erros e tradução de scores específicos com fontes e revisão, mantendo prioridade mobile.

## Revisão dos desafios — rodada automática25/09/2026

Adicionados Continuar estudo (primeira questão não respondida), Revisar erros (fila de primeiras respostas incorretas), Tentar novamente com explicação oculta até responder e marca Revisto. Primeira resposta preservada em2doctor-challenges-v1; revisões corretas guardadas separadamente em2doctor-challenge-reviews-v1, somente neste navegador. Uma nova revisão errada devolve o item à fila. Sem ranking, nota clínica, sincronização em conta ou promessa de ganho de aprendizagem. Conteúdo/fonte/licença das7questões autorais existentes não alterados; nenhum acervo externo novo.

131testes passaram; builds2Doctor e site completo aprovados. Testes de fila/registro original/corrupção/itens inválidos e reentrada após erro. CUA local390/320px e desktop1280: erroNNT, fila1, acertorevisão→fila0, reload mantendo marca e primeira resposta; Continuar levou à próxima inédita; revisão de erro em outra questão atravessou hash corretamente. ES/EN/PT exibiram ações traduzidas, console semerros. Sem aparelho físico, teste autenticado, revisão clínica externa, envio a terceiros ou teste de sincronização multicelular. Publicação pendente da checagem final.

Publicação concluída: fonte7479428; deploymentfd8d3983-3229-4db8-9423-bdfda2111d7d SUCCESS, health200/product2doctor, assetindex-C5llT3fR.js igual ao local. CUA público390px confirmou link estávelNNT, Continuar estudo7, fila vazia desabilitada, sem overflow/consoleerros. Não alterado progresso público durante QA. Rollback por reconstruçãoGitdc4c0c1; usar cwd scripts/wmed-app. Próximo: ampliar desafios autorais por domínio com fontes primárias e revisão de traduções; não copiar exames nem inferir competência clínica das respostas.

