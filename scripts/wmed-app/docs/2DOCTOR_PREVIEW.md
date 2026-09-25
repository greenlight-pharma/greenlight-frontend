# 2Doctor — prévia de identidade e navegação

Branch isolada `codex/2doctor-preview-20260925`, criada de `origin/main` em `c932cce`. O checkout e a versão publicada de WMed foram preservados. O Git dessa base permite recuperar integralmente os arquivos anteriores.

## Executar

Na pasta `scripts/wmed-app`: `npm ci` e `npm run dev:2doctor`.
Prévia: http://127.0.0.1:5206/2doctor/
Build separado: `npm run build:2doctor`, saída `dist-2doctor`.
O build convencional continua sendo WMed. O pipeline de publicação não foi alterado; não há rota 2Doctor publicada por esta etapa.

## Implementado

- Identidade escolhida: monograma 2D, verde-petróleo, marinho, Manrope (licença OFL incluída).
- Chat amplo, cabeçalho não fixo, navegação recolhida, atalhos no desktop e gaveta no celular.
- Menu pesquisável com Plantão, Estudos e Laboratório de IA; todos os módulos existentes continuam acessíveis. Laboratório contém o protótipo de radiografia existente; não inclui ainda publicações de comunidade ou novos projetos.
- Sugestões preenchem a pergunta para revisão antes de enviar. Atalhos abrem caso, scores e questões.
- Quatro temas com preferência de aparência separada do WMed.
- Mesmos componentes de chat, anexos, streaming, casos e histórico, sem migração ou cópia de dados. A autenticação continua sendo Vytal; a prévia não cria uma conta independente 2Doctor.

## Limites da prévia

O servidor local encaminha `/api/wmed` aos handlers existentes. A política de origem, cookies, permissões e limites desses handlers permanece inalterada. Não há simulação de login/respostas nem redução de segurança. A sessão autenticada, geração real e salvamento não foram retestados nesta origem local; validar em ambiente HTTPS autorizado antes de disponibilizar a usuários. Os testes automatizados incluem contratos dessas funções, mas não substituem um teste autenticado real.

Não houve alteração no backend, DNS, domínio, cobrança ou na rota WMed em produção. Esta etapa não revalida conteúdo clínico nem promete diagnóstico correto. Os avisos existentes foram preservados.

## Railway — publicação independente

Projeto: `2doctor` (`8e161bd1-87e2-4c82-9dbc-2bca138d7069`).
Serviço: `2doctor-web` (`dde31b3a-6f5e-4061-98b2-05d986576a29`).
URL: https://2doctor-web-production.up.railway.app/2doctor/

- Docker Node 22: build do frontend e runtime mínimo sem dependências adicionais, usuário não root.
- `server/railway.mjs` monta os mesmos handlers de autenticação, chat, casos, histórico e bibliotecas em `/api/wmed`. A sessão continua HttpOnly/Secure/SameSite=Strict. Não copia chaves do provedor nem o banco.
- `PUBLIC_ORIGIN=https://2doctor-web-production.up.railway.app` restringe Host e escrita à origem publicada. Uma futura mudança de domínio exige atualizar essa configuração.
- `/wmed/acervo/*` entrega apenas o acervo público do host acadêmico fixo; cookies/Authorization não são repassados ao acervo.
- `/healthz` verifica disponibilidade do processo, não a disponibilidade do backend Vytal ou do provedor de IA.
- 109 testes locais (incluindo seis do adaptador HTTP). Nenhum dado clínico real usado nos testes.
- Logs da aplicação não incluem requisições, texto de casos, senhas ou tokens. Limites existentes do upstream continuam em vigor.
- Upload com `railway up . --path-as-root --service 2doctor-web --project 8e161bd1-87e2-4c82-9dbc-2bca138d7069 --environment production --detach`, nesta pasta. Exclusões `.railwayignore`/`.dockerignore` mantêm env, dependências locais e artefatos fora do envio.
- A configuração railway.json é suportada atualmente; CLI avisa que deve migrar para Infrastructure as Code antes de 01/12/2026. Não confundir esse aviso com falha de build.

Rollback: usar a implantação anterior bem-sucedida no Railway; esta é a primeira versão deste serviço. O WMed e a API Vytal não são alterados por esse deploy.
