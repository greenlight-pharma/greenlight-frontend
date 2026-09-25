# Recuperação de ferramentas

## 25/09/2026 — Recuperação de módulos pronta

2Doctor: tela de erro PT/EN/ES agora oferece tentativa manual sem reload e volta ao chat preservando estado/rascunho. Recursos lazy rejeitados são recriados; componentes resolvidos/em andamento mantêm identidade. Sem loop automático, URLs geradas, cache-busting ou armazenamento clínico. Erro persistente avisa que atualização pode ser necessária e pede copiar textos pendentes antes. Casos/Scribe explicitam possível perda de alterações não salvas na ferramenta. WMed preserva boundary anterior; nenhuma alteração API/ECG.

Limite comprovado: HTTP503 de import em proxy local fica retido pelo cache ESM do navegador; recriar React.lazy não o elimina. Tentativa não é garantia. Fixture com rejeição transitória controlada recuperou de fato, preservando campo externo. Voltar ao chat após503 preservou rascunho fictício. Não há atualização automática que apagaria esse rascunho. Não injetar falhas em produção.

Diagnóstico dev: npm ci do build completo remove node_modules/.vite enquanto Vite5206 permanece vivo; dependências Three retornaram504 Outdated Optimize Dep. Cache da 2Doctor movido para .cache/2doctor-vite (ignorado no Git), sem alterar cache WMed. Servidor separado5212 iniciado antes do build completo: após build/npmci, atlas renderizou e console semerro, conferido390px. Servidor existente não foi encerrado; config pode ser recarregada pelo Vite.

162testes passaram (novos: rejeição transitória, sucesso/pending preservados, falha síncrona/persistente sem loop). Build2Doctor e sitecompleto passaram, aviso habitual chunksgrandes. CUA falhas locais320/390, PT/EN/ES, branco/escuro, tentativa persistente, retorno com rascunho, fixture recuperável e atlas real após build. Erros de console das abas com503 são esperados. Não testados Safari/iPhone físico, VoiceOver, chat autenticado/streaming, uploads reais ou falha durante análise clínica. Fixtures/proxy só temporários fora do deploy; sem pacientes/modelos novos.

Fontes primárias consultadas25/09/2026: https://react.dev/reference/react/lazy (cache da promessa/rejeição); https://vite.dev/config/shared-options.html#cachedir (cacheDir). Implementação autoral, sem novo conteúdo clínico ou mídia/licença externa; Lucide existente. Próximo: publicar exclusivamente2doctor-web comcwdapp/path-as-root, exigirSUCCESS/health/asset/UI. Rollback dca2009. Depois melhorar recuperação de consultas bibliográficas interrompidas (formulário/erro/retentativa), sem repetir automaticamente consultas clínicas.

