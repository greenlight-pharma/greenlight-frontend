# Arquitetura inicial e decisões

## Fluxo
React → POST /api/research (SSE) → Europe PMC (candidatos) → Jev (reranking opcional) → modelo generativo (síntese opcional) → interface Markdown com referências conferíveis. O visor Three.js carrega modelos locais e enquadra pelos limites geométricos e viewport.

A confiança do Jev não representa probabilidade de diagnóstico, qualidade clínica da publicação ou validação científica. Na v0.1 ele só reordena candidatos; não elimina fontes, não prescreve, não verifica verdade médica. Fallback em timeout, respostas incompletas ou baixa confiança conserva a busca. O limiar deve ser escolhido com dados de avaliação antes de uso real.

API da TypeSafe confirmada em 23/09/2026: POST https://api.typesafe.ai/v1/systemone, Bearer; state + model + questions; Score com criteria ordenados, response answers.score/confidence. https://docs.typesafe.ai/api e https://docs.typesafe.ai/cookbooks/rerank_typesafe. Não usamos páginas não oficiais como contrato.

Busca: https://www.ebi.ac.uk/europepmc/webservices/rest/search, parâmetros query, resultType=core, format=json, pageSize=8. Corrigido no teste real: parâmetro sort=RELEVANCE retornava JSON sem resultList; removido. Erro de pesquisa não é substituído por resultados inventados. HTTP 200 com estrutura inválida também falha.

## Fronteiras
- Frontend nunca recebe chaves. Serviços externos só recebem pergunta de pesquisa e trechos bibliográficos conforme o fluxo, não dados da base Vytal.
- Conversas apenas em memória do navegador. Recarregar apaga. Biblioteca da sessão é derivada das fontes efetivamente retornadas, sem lista fictícia.
- Servidor de desenvolvimento apenas 127.0.0.1, origem restringida, payload/consulta/histórico limitados, 10 requisições/minuto locais. Isso NÃO substitui segurança de produção.
- Cancelamento propaga para os serviços; timeout por etapa, erro visível e nenhuma falha mascarada.
- Markdown sem HTML bruto, imagens externas desativadas e links permitidos apenas para URLs das fontes recuperadas.
- Não há autenticação implementada. Integração Vytal deve respeitar permissões e segregação por produto; compartilhar login não concede acesso institucional.

## Avaliação antes do lançamento
Definir corpus fixo de perguntas PT/EN e revisão por médicos: cobertura de fontes, suporte das afirmações, contradições/atualidade, abstinência quando não há evidência, qualidade da busca contextual, erros clínicos, latência p50/p95 e custo por pergunta. Avaliar Jev em ablação sem presumir números de marketing. Nenhuma promessa de equivalência com OpenEvidence/MediSearch.
