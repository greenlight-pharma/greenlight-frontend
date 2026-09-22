# Banco de questões: redesign e integração

O banco público usa o mesmo componente React do Vytal Acadêmico (`vytal-web/src/academico/questions`). Fonte canônica e exportador no repositório web; este repositório hospeda o build estático e preserva os arquivos originais de conteúdo.

770 questões e 7 bancos mantidos sem modificar enunciados, alternativas, comentários ou gabaritos. Nova interface por áreas, filtros, questões salvas, estudo comentado e simulado retomável. Alternativa E passa a ser renderizada quando existe. Progresso público conserva a chave local anterior. Exportação/importação JSON permite transportar respostas e marcadores; não existe sincronização em nuvem.

Versão anterior em `/bancodequestoes/classico/` (mesmo armazenamento de respostas). Original do commit 74bd2c2. A única mudança no backup é `<base href="/bancodequestoes/">` para manter os assets relativos. `/bancodequestoes/2/` e arquivos PDF/dados seguem intocados.

Build: no worktree de vytal-web, `npx vite build --config vite.questions.config.ts`, seguido de `node scripts/export-question-bank.mjs /caminho/do/worktree/deste/site`.

Validação antes do PR: 47 testes acadêmicos e builds web/standalone passaram; QA desktop e viewport390, importação de arquivo de teste, comentário e alternativa E verificados. Acervo JSON comparado integralmente com questoes.js original. Não houve revisão clínica do acervo, teste em aparelho físico, mudança na API nem sincronização em nuvem.
