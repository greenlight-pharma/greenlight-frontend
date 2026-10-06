# Qbank: integração à base unificada do 2Doctor

Base remota verificada: `claude/2doctor-producao-unificada`, `a004e229c0a904da0bf1e31b06ccbfb0bdcaa85b`, em `greenlight-pharma/greenlight-frontend`. A main geral do site está em `3021bd5` e não contém a base unificada do produto. Branch desta integração: `codex/2doctor-qbank-local-20261006`, criada em clone separado; nenhum worktree concorrente foi editado. O PR de radiologia #99 tem outra base.

## Comportamento

O módulo existente de questões mantém o catálogo legado como padrão, incluindo 770 itens/7 bancos e namespace legado. No 2Doctor, um seletor de catálogo só aparece quando `approved-qbank.mjs` tem conteúdo aprovado; a escolha explícita usa o mesmo renderer/motor com namespace por conta/catalogId. WMed continua no catálogo existente. Sessão authenticated fornece progressScope; visitante usa guest, sem migração implícita.

Catálogo novo tem ledger de primeira tentativa, dicas/tempo ativo e retentativas; simulado oculta correção até finalizar e retoma estado local. Snapshot localStorage único evita escrita parcial; falha mantém aviso e recovery em memória, com retry/export/import. Web Locks exclui segundo escritor durante a montagem; sem suporte, catálogo fica indisponível. Falha de leitura inicial exige recuperação explícita, sem sobrescrever dados não lidos. Persistência apenas neste navegador, sem backend/sync; gabaritos existem no cliente, portanto não é exame seguro.

Três exemplos originais permanecem `review.status=pending` exclusivamente em `tools/india-preview`; manifest público vazio. Fixture autônoma usa exatamente os mesmos objetos da recuperação previamente validada, sem dependências de campanha/landing. Nenhum conteúdo externo copiado. Revisão técnica não equivale a revisão clínica/editorial.

Vite conserva cacheDir, identidade de produto, base, proxies, host/porta e chunks da branch unificada; acrescenta apenas gates de manifesto aprovado e proibição de build da fixture. Não aplica config/landing Índia por inteiro. Nenhuma mudança de preço, gratuito, auth, billing, consentimento, Pixel ou modo paciente.

## Validação nesta integração

- Suite final: 280 testes, 261 passaram, 19 pulados, zero falhas. Pulos são cenários externos existentes (contas/PostgreSQL etc.); nenhum banco real ou conta real utilizado.
- Build 2Doctor passou em 4,56 s; build WMed `/wmed/` passou em 4,19 s, com avisos conhecidos de chunks grandes.
- Testes novos verificam seleção explícita de conteúdo aprovado, preservação do catálogo/namespace legado, guest/conta separados e rejeição de drafts no caminho de produção.
- Build explícito da fixture foi rejeitado por `no-editorial-fixture-release`.
- Build com drafts no manifesto, modificado temporariamente apenas neste clone e restaurado em finally, foi rejeitado por `qbank-editorial-release-gate`.
- Enunciados das três questões pendentes ausentes dos assets JS de ambos os builds; manifest público novamente vazio.
- `git diff --check` passou. Logs locais em `task-2/evidence/integration-tests.log`, `integration-build-2doctor.log`, `integration-build-wmed.log` e `integration-gates.log`.

QA Chrome real de quota cheia/injetada, retry, troca Guest/A/B, reload/duplo clique, lock entre abas e fallback sem Web Locks foi realizado anteriormente na cópia isolada do núcleo portado. Esses resultados não são um novo QA da integração final. A tentativa de smoke visual da integração em 127.0.0.1:5238 falhou por indisponibilidade de transporte/policy do navegador; não considerada aprovada. Nenhuma API oculta, instalação/extensão ou permissão nova usada para contornar.

**Restauração de arquivo recovery pela UI nunca teve aceite ponta a ponta.** Unitários cobrem parseRecovery/replace com storage simulado; não exercitam input file, File.text ou handler React completo. O QA de navegador recuperou disponibilidade do storage e usou Retry saving, sem importar JSON. Restauração pela UI permanece pendência explícita.

## Revisão pendente

Revisão clínica/editorial independente, autoria/licença, fontes e versão exata antes de incluir questões no manifest. Smoke visual da integração e importação JSON pela UI precisam de ferramenta de navegador funcional. Não foram feitos merge, deploy nem validação clínica. Este PR é rascunho para revisão de código; não libera os exemplos no site.
