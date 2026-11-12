# Fontes oficiais por país — 25/09/2026

Entrega: diretório editorial de nove acessos externos, em cinco países e uma referência internacional. Plantão → Fontes oficiais; atalhos em Medicações/Condições e abaixo de respostas completas do chat. Interface PT/EN/ES; país desta consulta inicia com a preferência explícita e não altera o chat. Idioma não seleciona jurisdição. País sem cobertura não recebe substituto americano/brasileiro. Filtros locais por categoria e órgão/nome, sem enviar consulta, conversa ou dados clínicos a terceiros. Links fixos HTTPS, no-referrer, noopener/noreferrer, sem iframe, coleta, resumo IA ou cache do conteúdo externo.

## Fontes e licença

- Brasil: ANVISA Bulário, CONITEC PCDT, Ministério da Saúde calendário, DATASUS SIGTAP. URLs em shared/official-sources.mjs. Página ANVISA examinada exibe CC BY-ND3.0; isso não é permissão geral de adaptação, ingestão ou redistribuição de bulas de terceiros. Sistema ANVISA bloqueou fetch automatizado403; acesso oferecido pela página oficial intermediária.
- Portugal: Infomed, https://extranet.infarmed.pt/INFOMED-fo/ , link localizado na página oficial INFARMED e destino consultado. Sem ingestão da base; cessão de dados/termos requerem avaliação separada.
- EUA: DailyMed, https://dailymed.nlm.nih.gov/dailymed/ . Base não exaustiva de produtos regulados pela FDA; não apresentar cada rótulo como aprovação. https://www.nlm.nih.gov/copyright.html distingue conteúdo público e materiais de terceiros. Só ligação, não uso de imagens/labels.
- Espanha: CIMA https://cima.aemps.es/cima/publico/home.html , finalidade corroborada pelas páginas oficiais AEMPS. Interface dinâmica não fornece texto completo no extrator. Nenhuma API incorporada ou licença de redistribuição presumida.
- Reino Unido: MHRA Products https://products.mhra.gov.uk/ , página carregada no navegador e catálogo descrito em https://www.gov.uk/guidance/find-product-information-about-medicines . Uso somente como link, sem reprodução das fichas.
- Fonte candidata retirada do diretório ativo nesta rodada: NICE https://www.nice.org.uk/guidance/published . Catálogo oficial confirmado por indexação primária; fetch direto403 e navegador real também403. Não publicar como acesso funcional; mantida apenas nesta pesquisa/avaliação de licença. Não significa que toda diretriz valha em todos os países do Reino Unido. Termos https://www.nice.org.uk/reusing-our-content/nice-uk-open-content-licence e https://www.nice.org.uk/forms/permission-to-use-nice-content-for-artificial-intelligence-ai-purposes exigem autorização própria para uso em IA e diferenciam uso internacional. Nenhum conteúdo NICE enviado ao modelo.
- Internacional: WHO https://www.who.int/publications/who-guidelines . Link externo, sem figuras/textos reutilizados e sem presunção de aplicabilidade nacional. Licença de cada publicação deve ser examinada antes de incorporar conteúdo.

Descrições curtas originais explicam o destino; sem tradução de recomendações, doses ou protocolos. Data exibida é revisão da seleção editorial, NÃO data de atualização de toda a fonte, auditoria clínica ou disponibilidade contínua. Não há parceria/endosso presumido. Não confundir este diretório com citações verificadas de respostas do chat, bulário interno, motor de interações ou cobertura clínica completa.

## Testes e limites

156 testes passaram: separação de jurisdições, ausência de fallback, filtros/acentos/idiomas e allowlist de links sem query dinâmica; demais testes existentes preservados. Build2Doctor e build completo do site aprovados, aviso pré-existente de chunks grandes. QA móvel e publicação registrados após conclusão abaixo. Não houve avaliação de modelo, dados reais, API clínica, alteração do tutor, gravação, persistência nova ou uso para treinamento.

## Próximo passo

Primeiro conteúdo interno próprio: ficha de interpretação laboratorial com unidades, referência do laboratório, população e limitações explícitas; fontes/licença e revisão médica antes de rotular para prática. Expandir países apenas após confirmar fontes locais. Nenhum novo quiz/desafio/ranking. Ainda não é paridadeWeMEDS.

## 25/09/2026 — Fontes oficiais regionais prontas para publicação

Diretório editorial exclusivo2Doctor: nove acessos emBR/PT/US/GB/ES eWHO internacional, filtros locais, país independente do idioma e do chat, sem fallback paraoutrajurisdição. Atalhos emPlantão, Medicações/Condições e após respostas completas. LinksHTTPSfixos, no-referrer, sem query de paciente, scraping, IA, persistência ou cache de documentos. Descrições autorais PT/EN/ES. Fontes/termos/limites em2DOCTOR_OFFICIAL_SOURCES.md. NICE403 confirmado no navegador: retirado do diretório ativo, substituído porMHRAProducts que abriu corretamente; licençaNICE de IA permanece dependência futura, não conteúdo integrado.

156testes, build2Doctor e sitecompleto passaram; avisopréviochunksgrandes. CUA local320/390/1280, PT/EN/ES, claro/escuro, menu, país semcobertura, filtro semresultado, busca semacento, reset, atalhoMedicações→fontes e abertura externa. Semoverflowhorizontal/errosconsole. Não testados login/chatreal, atalho abaixo de resposta real, aparelhos físicos, VoiceOver, abrangência/qualidadeclínica ou pesquisas internas de cada terceiro. Países adicionais continuamsemfonteslocais. Não alteraAPIVytal/ECG/outrosprodutos, modelos, dose/conduta ou dados clínicos. Publicação atual aindaanteriorf278636f. Próximo: commit/deploysomente2doctor-webpelo cwdapp+path-as-root; verificarSUCCESS/health/asset/UI. Depois primeira ficha laboratorial autoral com fontes/limites/unidades e revisão clínica antes de liberar para prática. Desafios permanecem abandonados.


## 25/09/2026 — Fontes oficiais publicadas e verificadas

Fonte b18ea90; deployment 11f5f025-6b43-4ac1-9c35-1ca2dfc138eb SUCCESS, exclusivamente 2doctor-web no projeto 2doctor. Publicação com cwd scripts/wmed-app e --path-as-root. healthz200/product2doctor, página200 e asset index-C79dUnlC.js idêntico ao build local e HTTP200. CUA público em390px: menu Plantão, seleção BR/GB, filtro Medicamentos, Bulário/MHRA com destinos corretos; clientWidth=scrollWidth375, console sem erros. Viewport restaurado. Entrega: https://2doctor-web-production.up.railway.app/2doctor/#fontes-oficiais .

156 testes, build2Doctor e site completo passaram. Diretório de links, não bulário interno nem ingestão de diretrizes/validação de IA. Países sem cobertura informados, sem substituição de jurisdição. Não testados aparelhos físicos, login/modelo real, atalho após resposta autenticada, VoiceOver nem buscas internas completas dos sites externos. NICE bloqueado403 foi retirado do catálogo ativo; MHRA abriu no navegador. Documentação em2DOCTOR_OFFICIAL_SOURCES.md. API Vytal/ECG intactos, sem modelos novos, dados clínicos ou contatos. Próximo: ficha laboratorial autoral com referência do próprio laboratório, unidades/população/limitações e revisão clínica; continuar expansão regional com fontes/licenças. Desafios continuam abandonados. Rollback: reconstruir7695495 a partir do cwdapp. Apenas saída não rastreada medico-app/dist-samu permanece de build completo; não incluída no commit.

