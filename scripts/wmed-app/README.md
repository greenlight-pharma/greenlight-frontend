# Publicação da prévia no site Vytal

Rota: https://www.vytalsaude.com.br/wmed/. Fonte canônica desta publicação: scripts/wmed-app no repositório greenlight-frontend. O build usa VITE_BASE=/wmed/ e VITE_PUBLIC_PREVIEW=true. A API pública em /api/wmed usa apenas Europe PMC, sem chave e sem chamadas a modelos pagos, mesmo se o ambiente tiver credenciais Vytal. Login e síntese continuam pendentes. Prévia pública sem dados de contas e sem histórico persistente. Não indexar.

Testes: npm test --prefix scripts/wmed-app. Publicação: build normal scripts/build-vercel.sh. Rollback: reverter somente o commit WMed; as páginas existentes não são substituídas. Modelos de células originais com procedência/hashes em docs/MODEL-ASSETS.json. Os limites de requisição são por instância e não equivalem a uma quota distribuída de produção.

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
13 testes automatizados de contrato, erros, validação, fontes, Jev e parsing/streaming passaram; build de produção passou. Busca Europe PMC e UI verificados ao vivo. Jev e síntese só testados com respostas simuladas, pois não estão configurados. Desktop 1280x720 e largura móvel 390 testados no navegador; isso não substitui teste em dispositivo físico. Login Vytal, histórico persistente, pagamentos e publicação NÃO implementados.

## Próximos passos
1. Conectar credencial de síntese em ambiente seguro; validar respostas e referências com corpus médico revisado.
2. Liberar acesso Jev e medir ganho real de relevância, latência e custo versus busca base.
3. Compartilhar identidade Vytal por OIDC/autenticação central com permissões separadas por produto; não copiar dados institucionais.
4. Corpus editorial/licenciado e avaliação de suporte de cada afirmação, atualidade e fontes contraditórias. Afirmações clínicas críticas devem passar por revisão específica, não apenas score de Jev.
5. Expansão dos modelos/casos e internacionalização PT/EN, controle de custos e ambiente staging autenticado.

Não há modelo fundacional WMed treinado nesta etapa. A camada própria é o produto e sua orquestração de busca, respostas e acervo visual. O escopo inicial continua educacional. Uso em decisões clínicas exige trabalho e validação adicionais.
