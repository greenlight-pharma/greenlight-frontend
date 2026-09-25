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

Rotina existente `evoluir-a-2doctor-internacional`, nesta conversa, a cada6horas. Atualizar escopo para esta fila sem duplicar tarefa nem prometer execução ininterrupta. Execução local depende de computador ligado/app em execução: https://learn.chatgpt.com/docs/automations?surface=app .

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
