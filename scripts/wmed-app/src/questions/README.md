# Banco de questões no WMed

Integração nativa React do componente de Vytal Acadêmico (`_worktrees/academico-experience/src/academico/questions`, versão com escolha inicial por prova), sem iframe ou dependência do backend. Catálogo preservado: 770 itens / 7 provas, mesmos enunciados, alternativas, comentários e gabaritos. O conteúdo não foi submetido a nova revisão clínica nesta integração.

Menu `Banco de questões`, rota `/wmed/#questoes`. Filtros, alternativas A–E, favoritos, estudo comentado e simulado retomável. Layout do leitor se ajusta à altura disponível; textos longos permanecem roláveis.

Progresso local separado por `progressScope` do servidor autenticado, com escopo de visitante próprio. Troca de conta remonta o componente. Não copia respostas de visitantes implicitamente nem sincroniza entre aparelhos. Importar/Salvar progresso usa formato `vytal-questions` compatível com o banco público. Os arquivos não incluem simulado em andamento.

Para atualizar o acervo, comparar integralmente `catalog.json` com `bancodequestoes/questoes.js`; não editar bundles minificados. Estilos de identidade do WMed ficam em `wmed.css`. Testes de modelo foram reaproveitados e ampliados com separação de contas e filtro por prova.
