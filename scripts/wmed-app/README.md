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

## API e proteção
`api/wmed/academic.js` → proxy com operações fechadas (structure,transcribe,feedback,quality,images). Destino Vytal fixo, cookie HttpOnly/Secure existente, guardas institucionais preservadas, limite por sessão/instância adicional. Limite do feedback clínico original:5.000 caracteres de história/contexto; UI informa limite, sem truncar silenciosamente. Detecção de identificadores copiada do Vytal e revisão humana antes do envio; detector não garante anonimização perfeita. A transcrição recebe áudio explicitamente enviado pelo usuário; não grava consultas/pacientes automaticamente.

Timeout270s/function300s. Nenhuma alteração no backend Vytal, banco institucional, modelos clínicos ou ECG. Geração real depende de uma conta Vytal autorizada. Sem chave de provedor no frontend.

## Validação e limites
39 testes; build WMed e site completo. UI desktop1280x720 e móvel390x844:3D/catálogos reais, seleção de estrutura, corte celular, radiologia, Glasgow15, busca de medicação/condição; caso/feedback/nota/imagens autenticadas com fixture sintética. Sem teste de geração real autenticada, gravação em iPhone físico, calibração clínica ou Jev. Não confundir testes de contrato com avaliação médica.

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
