# AMBOSS — levantamento para a 2Doctor

Data: 25/09/2026. Pedido: verificar todas as features do AMBOSS.

## Escopo e método

Inventário documental público: páginas oficiais de produto, central de ajuda, anúncios e diferenças US/internacional/Alemanha. Não houve sessão paga, instalação, compra, contato, teste funcional autenticado nem auditoria clínica. Disponibilidade por plano, país, plataforma e beta precisa de confirmação dentro da conta. Não tratar este levantamento como garantia de exaustividade de funcionalidades privadas.

## Mapa de fontes para a implementação futura

| Área | Fonte oficial |
|---|---|
| Catálogo Learn / Practice / Teach | https://www.amboss.com/us/features |
| Operação da biblioteca | https://support.amboss.com/hc/en-us/articles/360035199871-Feature-Overview |
| Navegação, planos e análise | https://support.amboss.com/hc/en-us/articles/360034825692-Platform-Overview |
| Estudo e simulados | https://support.amboss.com/hc/en-us/articles/360036038991-Using-Study-Mode-Exam-Mode |
| Catálogo completo de ajuda | https://support.amboss.com/hc/en-us/categories/360004593212-AMBOSS-Features-Functions |
| IA de aprendizagem e anexos | https://support.amboss.com/hc/en-us/articles/43601233276689-AI-Mode-Learning-FAQs |
| IA clínica | https://www.amboss.com/us/clinical-ai-mode |
| Assistentes especializados beta | https://www.amboss.com/us/newsroom/amboss-assistants |
| Medicamentos AHFS | https://www.amboss.com/us/clinicians/drug-database |
| Anki e AnKing | https://www.amboss.com/us/anki |
| Aplicativo de biblioteca | https://support.amboss.com/hc/en-us/articles/12457713436308-Knowledge-App |
| Aplicativo de questões | https://support.amboss.com/hc/en-us/articles/12458054853524-Qbank-App |
| Tradução de artigos, inclusive PT-BR | https://support.amboss.com/hc/en-us/articles/46861153334545-AMBOSS-in-Different-Languages |
| Unidades laboratoriais beta | https://support.amboss.com/hc/en-us/articles/45815946061201-Unit-Converter-for-Laboratory-Values-Beta |
| Educadores e residência | https://www.amboss.com/us/residency-programs |
| Configuração de tarefas docentes | https://support.amboss.com/hc/en-us/articles/30030991328913-Editing-New-Assignments |
| Cursos de pesquisa NEJM | https://www.amboss.com/us/newsroom/amboss-and-nejm-group-launch-master-classes-in-medicine |
| MCP para agentes | https://www.amboss.com/us/newsroom/amboss-mcp |
| Recursos clínicos da edição alemã | https://support.amboss.com/hc/de/articles/360057455371-Schl%C3%BCsselfunktionen-f%C3%BCr-die-klinische-Praxis |

## Achados que mudam decisões

- A documentação atual oferece tradução de artigos PT-BR, combinando tradução humana e automática. Não usar a antiga landing portuguesa como prova de ausência de português. Tradução não comprova adaptação às diretrizes brasileiras.
- A FAQ Learning ainda diz que os recursos ligados estão em inglês; registrar a divergência com a documentação de tradução, sem prometer cobertura integral.
- Assistants anuncia ferramentas de documentação e preparação de interconsulta em beta. Não confirmei gravação ambiente/transcrição de consultas nem atlas anatômico 3D navegável nas fontes revisadas; ausência de confirmação não prova inexistência.
- MCP merece avaliação comercial: anúncio de interface para agentes não equivale a licença para revender conteúdo, disponibilidade irrestrita ou preço público conhecido.
- Não somar quantidades de questões entre versões e especialidades. Números das páginas divergem por região/produto/data.
- Banco farmacológico US AHFS e alemão IFAP demonstram regionalização. Não inferir base brasileira ou verificador individualizado de interações apenas por haver tabelas em monografias.

## Recomendações próprias, ainda não implementadas

1. Conectar respostas do chat a conteúdo, scores e visualizações 3D pertinentes, preservando o chat central e menu móvel simples.
2. Diferenciar finalidade estudar/consultar sem criar produtos desconectados; fontes, datas e país explícitos.
3. Avançar Scribe e passagem de caso por etapas avaliadas. Hoje Scribe 2Doctor é demonstração determinística e corpus offline, não geração clínica validada.
4. Melhorar comparação de condições, explicação para pacientes e checklists contextuais com conteúdo autoral revisado.
5. Priorizar curadoria e manutenção por país antes de prometer cobertura mundial. Localizar unidades, medicamentos e diretrizes, além do idioma.

Desafios, competições e rankings continuam abandonados. Preservar banco de questões existente. Painel de coordenação não vira prioridade da 2Doctor por constar no concorrente. Não copiar acervo proprietário. Nenhum novo modelo clínico, persistência clínica ou fornecedor foi habilitado.

## Validação e continuidade

Somente pesquisa e documentação; testes de software, build, QA móvel e deploy não executados nesta rodada porque runtime não mudou. Serviço Railway não foi alterado nem revalidado neste levantamento. Próximo passo executável: especificar o fluxo chat → recurso relacionado e continuar SBAR fictício conforme fila já autorizada; MCP exige escopo/licença próprios.
