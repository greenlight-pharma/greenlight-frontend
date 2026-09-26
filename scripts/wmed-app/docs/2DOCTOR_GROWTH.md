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

