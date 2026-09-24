# WMed — caso clínico e acervo Acadêmico

Fonte canônica: `scripts/wmed-app` no repositório greenlight-frontend. Publicação em https://www.vytalsaude.com.br/wmed/.

## Módulos
- Chat e pesquisa bibliográfica existentes preservados.
- Caso clínico: texto livre, gravação MediaRecorder/arquivo de áudio (até 2,9 MB), transcrição e estruturação pelos serviços Vytal, revisão compacta, feedback original em quatro abas. Todos os campos retornados são exibidos, inclusive campos adicionais.
- Pontuação documental experimental, independente do feedback: cinco critérios, níveis0–4 ponderados em0–100, validação de esquema/limites e trechos literais. Pontuação inválida não vira zero nem bloqueia o feedback. Sem ranking público; sem alegação de validade clínica/calibração.
- Evolução pessoal: somente notas/datas em localStorage, vinculadas a escopo SHA256 do ID da conta. Relatos/áudios/feedback não são persistidos pelo WMed. Não há sincronização entre aparelhos; até200 registros locais. Conquistas de primeiro/cinco relatos.
- Anatomia13 agrupamentos, histologia48 células e radiologia3 recortes do exame de origem: visualizadores originais portados com painéis recolhidos, cores/destaques e cortes preservados. Assets por rewrite fixo `/wmed/acervo/*` para o acervo público de app.vytalsaude.com.br. Dependência externa explícita, atribuições preservadas.
- Scores/calculadoras:28 instrumentos do catálogo original, sem alteração de critérios/faixas; cada item exige resposta explícita antes do resultado.
- Medicações214 e condições2045: dados originais, busca, filtros e fichas. Sem nova curadoria médica nesta entrega.
- Banco de imagens: endpoint autenticado de imagens aprovadas; paginação e atribuição. Nunca lista rascunhos/capturas privadas.

## Paridade com apps de consulta clínica (item 1, 24/09/2026)

- **Favoritos e anotações** na conta WMed (`server/favorites.mjs`, migração `002_favorites.sql`, `/api/wmed/favorites`): estrela e nota em scores, calculadoras, medicações, condições e resumos ENAMED/USMLE; tela "Favoritos e anotações"; links internos (`#scores?id=…`, `#medicacoes?item=…`, `#condicoes?item=…`, `#usmle?topic=…`) reabrem o item.
- **100 ferramentas**: 74 scores (44 novos em `src/academic/more-scores.ts`) e 26 calculadoras (20 fórmulas novas em `shared/calculators.mjs`, incluindo Holliday-Segar, infusão de drogas vasoativas, dose por peso, QTc, Cockcroft-Gault, gradiente A-a, P/F, Parkland) + **doses pediátricas** por medicamento (`shared/pediatric-doses.mjs`, `src/PediatricDoses.jsx`). Só instrumentos de domínio público ou uso clínico livre. Conteúdo clínico novo é rascunho para revisão médica.
- **Offline (PWA)**: `public/manifest.webmanifest`, `public/sw.js` e `precache.json` gerado no build (núcleo de ~5 MB: interface, dados, scores, resumos). Modelos 3D entram no cache quando abertos; a API nunca é guardada. Em wmed.ai o service worker é `/sw.js` (reescrito para `/wmed/sw.js`).
- Testes: `tests/clinical-tools.test.mjs` (faixas cobrem toda soma possível, fórmulas contra exemplos à mão, tetos de dose) e favoritos em `tests/accounts.test.mjs`.

## Protocolos e guias (item 2, 24/09/2026)

- Módulo `#protocolos` (`src/Guides.jsx`) com conteúdo próprio em Markdown: 10 protocolos de emergência (`src/guides/emergencia.ts`: PCR, sepse, anafilaxia, AVC, asma, CAD, hipercalemia, intubação em sequência rápida, drogas vasoativas, SCA) e 9 guias de antimicrobianos (`src/guides/antimicrobianos.ts`: PAC, ITU, pele e partes moles, meningite, sepse sem foco, intra-abdominal, sífilis/IST, profilaxia cirúrgica, espectro das classes).
- Ampliação (mesmo dia): 8 condutas clínicas com modelo de prescrição de estudo (`condutas.ts`), 7 guias de exames laboratoriais (`laboratorio.ts`), 7 de toxicologia com CIATox e soros antipeçonhentos (`toxicologia.ts`), 6 de vacinação pelo PNI/SBIm (`vacinacao.ts`) e 7 de semiologia (`semiologia.ts`). Total: 54 guias.
- Cada guia cita as diretrizes-fonte, abre por link (`#protocolos?guia=iot`), aceita favorito e anotação (tipo `guide`) e liga direto aos scores e calculadoras (`#scores?id=…`).
- `tests/guides.test.mjs` garante ids únicos, fontes https, aviso final e que todo link interno abre um score, calculadora ou guia existente.
- **Rascunho escrito com apoio de IA: exige revisão médica antes da liberação ampla.** Doses para adultos com função renal normal; esquemas empíricos devem seguir a CCIH local.

## Contas WMed (fase A)

A WMed usa contas próprias; o login Vytal Acadêmico foi removido.

- **Banco:** Postgres no Railway (`DATABASE_URL`). Tabelas em `server/migrations/` (usuários, sessões, tentativas de login, uso diário, conversas, assinaturas); aplique com `npm run migrate`.
- **Contas:** `server/accounts.mjs` → `/api/wmed/auth` (GET sessão, POST `signup`/`login`, DELETE sair). Senha com scrypt; sessão de 30 dias em cookie `__Host-wmed_session` (HttpOnly, Secure, SameSite=Lax), guardada no banco só como hash. Limite de tentativas no banco (vale entre instâncias). Cadastro registra o aceite dos termos.
- **Chat:** `server/wmed-chat.mjs` → `/api/wmed/chat`, API da Claude via SDK oficial (`ANTHROPIC_API_KEY`, modelo `claude-opus-5` salvo `ANTHROPIC_MODEL`), streaming, prompt fixo por idioma em cache, fallback do servidor em recusas. Cota: `WMED_FREE_DAILY_CHATS` (padrão 10) no gratuito; Pro "ilimitado" com teto antiabuso `WMED_PRO_DAILY_CHATS` (300). Falhas e recusas antes da resposta não consomem cota.
- **Histórico:** `server/wmed-history.mjs` → `/api/wmed/history`, mesmo contrato de antes, isolado por conta.
- **Plano:** `users.plan` ('free'|'pro') ou assinatura ativa em `subscriptions` (preenchida pelos webhooks de Stripe/Pagar.me na fase C).
- **Em migração (fase B):** caso clínico, transcrição de áudio e análise OpenMed respondem 503 com aviso (`server/migrating.mjs`). Os módulos antigos que usavam o backend Vytal continuam no repositório como referência.
- **Testes:** `tests/accounts.test.mjs` roda contra Postgres real quando `WMED_TEST_DATABASE_URL` está definida; sem ela, só os testes sem banco rodam.
- **Pendências:** e-mail (verificação e recuperação de senha), termos de uso e política de privacidade da WMed, entrar com Google/Apple.

## Idiomas e domínio wmed.ai

- Interface em português e inglês (`src/i18n.js`, `src/i18n/en.js`). O texto-fonte continua em português dentro de `t('…')`; `msg('…')` marca textos de listas exibidos depois com `t()`.
- Escolha do idioma: `?lang=en|pt` → escolha salva (`wmed-lang`) → domínio. Em wmed.ai vale o idioma do navegador (português só se o navegador preferir pt); no site Vytal, português.
- Já traduzidos: casca do app, chat, entrada, revisão de privacidade, histórico, anexos, menu de módulos e Minha evolução. A lista fica em `tests/i18n.test.mjs` (`TRANSLATED`); o teste falha se faltar tradução. Os módulos de conteúdo (casos, anatomia, bibliotecas, ECG, questões, ENAMED) ainda estão só em português.
- Chat em inglês: o pedido leva `lang: 'en'` e o servidor acrescenta a instrução de responder em inglês (`withLanguage`), sem mudar a pergunta exibida.
- wmed.ai: `vercel.json` reescreve a raiz de wmed.ai para `/wmed/` (os assets e `/api/*` seguem direto) e redireciona www.wmed.ai. `/wmed/` no site Vytal continua igual. Falta apontar o DNS e adicionar o domínio no projeto Vercel.

## API e proteção
`api/wmed/academic.js` → proxy com operações fechadas (structure,transcribe,feedback,quality,images). Destino Vytal fixo, cookie HttpOnly/Secure existente, guardas institucionais preservadas, limite por sessão/instância adicional. Limite do feedback clínico original:5.000 caracteres de história/contexto; UI informa limite, sem truncar silenciosamente. Detecção de identificadores copiada do Vytal e revisão humana antes do envio; detector não garante anonimização perfeita. A transcrição recebe áudio explicitamente enviado pelo usuário; não grava consultas/pacientes automaticamente.

Timeout270s/function300s. Nenhuma alteração no backend Vytal, banco institucional, modelos clínicos ou ECG. Geração real depende de uma conta Vytal autorizada. Sem chave de provedor no frontend.

## Validação e limites
41 testes; build WMed e site completo. UI desktop1280x720 e móvel390x844:3D/catálogos reais, seleção de estrutura, corte celular, radiologia, Glasgow15, busca de medicação/condição; caso/feedback/nota/imagens autenticadas com fixture sintética. Sem teste de geração real autenticada, gravação em iPhone físico, calibração clínica ou Jev. Não confundir testes de contrato com avaliação médica.

`npm test --prefix scripts/wmed-app`; build completo `bash scripts/build-vercel.sh`. O servidor local original research-only não hospeda os novos proxies; para integração usar deployment autenticado Vercel. Não publicar uma fixture como serviço real. Rollback: reverter o PR deste conjunto; páginas Vytal existentes preservadas.

---

# WMed — fundação v0.1

Projeto independente, local, iniciado em 23/09/2026. Marca aprovada pelo usuário; nenhuma alteração em Vytal Acadêmico, Care ou API de produção.

## Executar
Node 22.18+ (flag `--env-file-if-exists`), npm. `npm ci`; em dois terminais `npm run server` e `npm run dev`. Interface http://127.0.0.1:5198; API http://127.0.0.1:5199. A prévia usa somente loopback. Não publicar o servidor sem autenticação, controle de acesso, limites por usuário e revisão de privacidade.

## Implementado
- Identidade WMed, navegação compacta, conversa com envio imediato, cancelamento, histórico apenas em memória, Markdown/tabelas, fontes clicáveis e biblioteca de referências da sessão.
- Pesquisa real Europe PMC, com metadados e resumos em memória. Escopo atual prioriza revisões/diretrizes; não é uma revisão sistemática nem cobertura exaustiva.
- Tradução determinística de oito famílias de termos PT/EN; consultas livres demais ou seguimentos pronominais ainda precisam de reformulação contextual.
- Jev: conector HTTP, ordenação por relevância com rubric de quatro níveis, timeout 4 s e retorno à ordem da busca em falhas/baixa confiança. Limiar de 0,75 provisório; NÃO calibrado em corpus médico. Não confundir relevância com certeza clínica.
- Conector Anthropic com streaming real de eventos, prompt restrito às fontes e referências vinculadas aos URLs recuperados. Chave/modelo ausentes: aviso explícito, sem resposta fictícia. Falha/interrupção não é sucesso.
- Três modelos celulares originais do Blender em GLB, completos e em corte: cardiomiócito, neurônio multipolar e célula ciliada traqueal. Giro, zoom, reenquadramento, tela cheia, seletor e carregamento/erro. Não são reconstruções microscópicas validadas.

## Configuração segura
Copie `.env.example` para `.env.local`, arquivo ignorado no Git. Defina TYPESAFE_API_KEY quando houver acesso e ANTHROPIC_API_KEY/ANTHROPIC_MODEL para síntese. Nenhuma chave foi copiada da Vytal ou criada. Não use VITE_ para segredos. Não envie chaves por chat. Alterar variáveis exige reiniciar o servidor.

## Estado comprovado
29 testes automatizados de contrato, erros, validação, fontes, Jev e parsing/streaming passaram; build de produção passou. Busca Europe PMC e UI verificados ao vivo. Jev e conectores locais só testados com respostas simuladas. O chat publicado usa a API Vytal, mantendo seus limites e permissões. Desktop 1280x720 e largura móvel 390 testados no navegador; isso não substitui teste em dispositivo físico. Login Vytal e publicação implementados; histórico persistente e pagamentos não implementados. O chat autenticado foi testado com mocks e interface móvel com fixture sintética; geração com conta real ainda pendente.

## Próximos passos
1. Conectar credencial de síntese em ambiente seguro; validar respostas e referências com corpus médico revisado.
2. Liberar acesso Jev e medir ganho real de relevância, latência e custo versus busca base.
3. Compartilhar identidade Vytal por OIDC/autenticação central com permissões separadas por produto; não copiar dados institucionais.
4. Corpus editorial/licenciado e avaliação de suporte de cada afirmação, atualidade e fontes contraditórias. Afirmações clínicas críticas devem passar por revisão específica, não apenas score de Jev.
5. Expansão dos modelos/casos e internacionalização PT/EN, controle de custos e ambiente staging autenticado.

Não há modelo fundacional WMed treinado nesta etapa. A camada própria é o produto e sua orquestração de busca, respostas e acervo visual. O escopo inicial continua educacional. Uso em decisões clínicas exige trabalho e validação adicionais.
