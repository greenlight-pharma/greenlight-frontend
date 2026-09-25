# 2Doctor Scribe — proposta, 25/09/2026

Status: protótipo determinístico implementado em 25/09/2026, publicado e verificado no serviço isolado2doctor-web. Não é IA ativa nem recurso validado para atendimento. Especificação de produto abaixo permanece como direção futura.

## Entrega desta rodada

Entrada em Plantão → Scribe · demonstração, exclusiva do build 2Doctor. Dois relatos inteiramente fictícios/autoria própria em PT/EN/ES; organização SOAP predefinida preservando literalmente os trechos, nota editável, origem por seção, campos ausentes vazios, revisão obrigatória antes de copiar e exportação rotulada EXEMPLO FICTÍCIO. Qualquer edição revoga revisão; trocar/reiniciar exemplo protege alterações com confirmação. Trocar idioma da interface preserva a nota e oferece recarga explícita do exemplo.

Desktop: relato e nota lado a lado. Celular: botões Relato/Nota, texto16px e campos com altura automática. Rascunho só em memória, descartado ao sair/recarregar e com aviso visível. Nenhum fetch do Scribe, banco, API, modelo, gravação, armazenamento local ou treinamento. Não processa relato livre por IA: os exemplos são demonstrações fixas; não anunciar transcrição automática ou qualidade clínica.

Fonte primária para nomenclatura do formato, consultada em25/09/2026: Maryland Department of Health, https://health.maryland.gov/bacc/Pages/Professional-Documentation-(SOAP-Notes).aspx . Usada somente a estrutura geral SOAP, sem copiar notas, recomendar tratamento ou aplicar regras de faturamento daquele conselho a outros países. Casos fictícios originais, sem mídia/licença externa incorporada.

Testes verificam fidelidade literal e preservação de negação/incerteza/correção de dose, ausência de exame e plano, exportação bloqueada antes da revisão e invalidação após edição. Esses testes são de integridade do protótipo, não avaliação de modelo clínico.

## Experiência recomendada

Chat permanece como início. Ação “Documentar atendimento” abre um espaço simples: Relato → Nota → Revisar e copiar. Primeiro ciclo com texto ou ditado curto do profissional APÓS o atendimento. Não iniciar com gravação ambiente de consultas.

1. Profissional relata história, achados e o plano que efetivamente decidiu.
2. Scribe organiza em SOAP ou evolução livre com subtítulos claros, mantendo negações, valores, unidades, cronologia e autoria das informações.
3. Cada trecho pode ser comparado com a transcrição. Informação ausente permanece ausente ou marcada “Não informado”; nunca preencher exame normal, diagnóstico ou prescrição por inferência.
4. Profissional edita e confirma antes de copiar. Rascunho não equivale a registro assinado ou integração com prontuário.
5. A partir da nota confirmada, pode solicitar passagem de caso SBAR, encaminhamento ou orientações em linguagem simples. Estes são documentos distintos do raciocínio clínico sugerido pelo chat.

## Utilidades seguintes (propostas)

- Passagem de plantão: situação, contexto, avaliação e recomendações já informadas; pendências explicitadas, sem envio automático.
- Evidência no contexto: pergunta do profissional gera consulta bibliográfica com fonte verificável e data; não anexar recomendações à nota como se tivessem sido feitas.
- Explicação visual: abrir modelo 3D relevante para ensino, com controle do profissional; sem atribuir diagnóstico à imagem demonstrativa.
- Estudantes: organizar casos fictícios e apresentações orais, com explicação de campos e lacunas. Sem desafios, rankings ou pontuação competitiva.

## Base existente e o que falta

ClinicalCase.jsx já captura MediaRecorder, trata formatos, limita áudio a 3min/2,9MB e permite revisão. server/academic.mjs encaminha transcrição e estruturação a endpoints autenticados Vytal. Isso é uma base de reaproveitamento, não um Scribe clínico pronto. Nenhuma chamada paga, gravação ou alteração de API foi feita nesta rodada.

O endpoint atual de feedback gera hipóteses/condutas e não deve ser reutilizado como gerador fiel de documentação. Implementar contrato separado para fatos documentados, trechos de origem, informações ausentes e edição. Não afirmar processamento local/no Brasil: localização, retenção e fornecedores ainda precisam ser mapeados antes de atendimento real.

## Contrato e avaliação offline v1 concluídos

Ver [2DOCTOR_SCRIBE_EVALUATION.md](2DOCTOR_SCRIBE_EVALUATION.md).18fixtures/3idiomas, contratoextrativo, CLI e testes; nenhum modelo avaliado. Próxima entrega de produto: demonstraçãoSBAR com relato fictício e fontes, sem geração livre. Integração gerativa depende de escopo e avaliação próprios.

## Plano de avaliação (base histórica, implementada na v1 offline)

Após QA/publicação deste protótipo, preparar contrato e conjunto sintético de avaliação da organização de texto livre: trechos de origem obrigatórios, negações, doses/unidades, correções e dados ausentes. O protótipo atual não mede qualidade de transcrição/modelo. Implementar avaliação offline com respostas simuladas e documentação antes de qualquer ativação gerativa. Passagem SBAR pode ser demonstrada com fixtures próprias em etapa posterior, sem recomendações inventadas. Não mudar API Vytal nem habilitar atendimento real nesta trilha.

Critérios antes de habilitar uso clínico: rastreabilidade de cada afirmação ao relato, taxa de omissões/invenções revisada por profissional, fidelidade de negações/doses e erros críticos, revisão por idioma, autorização/consentimento, retenção e controles de acesso definidos, comportamento em falhas e cancelamento, exportação só após revisão. Teste simulado não é validação clínica. Dados clínicos não serão usados para treinamento.

## Referências primárias de produto consultadas

- Heidi, templates de notas e documentos: https://support.heidihealth.com/en/articles/14648446-templates-101-the-basics
- Heidi, ditado: https://support.heidihealth.com/en/articles/11129458-dictate
- Nabla, avaliação de documentação: https://nabla.com/whitepapers/ai-for-clinical-documentation

São descrições dos fornecedores, não prova de desempenho da 2Doctor. Não foram copiados modelos proprietários, comprados serviços ou enviados contatos. A proposta combina documentação revisável, evidências e acervo 3D existente; utilidade e disposição a pagar ainda precisam ser testadas com usuários.

## 25/09/2026 — Scribe demonstrativo pronto para publicação

Entrega na worktree2doctor-preview: Plantão → Scribe · demonstração, exclusivo2Doctor. Dois relatos fictícios autorais PT/EN/ES, organizaçãoSOAP determinística, nota editável, trechos de origem, informação ausente vazia, revisão antes de exportar; edição invalida revisão; exportação marcada como exemplo fictício. Confirmação antes de substituir edições, idioma da nota preservado ao mudarUI e recarga explícita. Rascunho em memória apenas, descartado ao sair com aviso; nenhuma API/modelo/gravação/persistência clínica nova. Chat/banco de questões intactos; desafios continuam abandonados.

135testes passaram: preservação literal dos trechos, negações/incerteza/correção500→850mg e frequência ausente, ausência de exame/avaliação/plano, estados de revisão/exportação. Build2Doctor e sitecompleto aprovados, aviso pré-existente de chunks grandes. CUA local390/320/1280 PT/EN/ES: organizar, editar, reviewinvalidada, substituição cancelar/confirmar, cópia com texto selecionável, fontes abertas, dark/light, idioma com preservação de nota e recarga, menu Plantão; sem overflow/consoleerros. Camposautoheight corrigidos apósQA, sem rolagem interna dos exemplos. Não rodados aparelho físico, login/auth/fluxos clínicos reais, áudio, avaliação gerativa ou validação clínica externa.

Fonte primáriaMDH para estruturaSOAP, casos/textos autorais sem mídia externa. Próximo: publicar somente2doctor-web a partirscripts/wmed-app comDockerfile/path-as-root; verificarSUCCESS/health/asset/UI. Depois contrato + conjunto sintético de avaliação de texto livre com trechos obrigatórios; NÃO habilitar IA clínica antes de avaliação própria. Rollback por reconstrução958f12c.


## 25/09/2026 — Scribe demonstrativo publicado e verificado

Fonte ace3939, deployment a1ae3781-47cd-4341-a9fe-fbe43c7fdb82 SUCCESS exclusivamente no serviço2doctor-web. Health200/product2doctor, assetindex-bsBTGXgA.js igual ao build local eHTTP200. Público: https://2doctor-web-production.up.railway.app/2doctor/#scribe . CUA público390px: organizaçãoSOAP, edição, revisão invalidada após editar, copiar desabilitado, reinício com confirmação; semoverflowhorizontal, campos sem rolagem interna nos exemplos e console semerros. Demo reiniciada e viewport restaurado.

135testes + build2Doctor + sitecompleto aprovados; QA local PT/EN/ES,320/390/1280, claro/escuro e cópia selecionável. Não houve áudio, paciente real, API/modelo novo, persistência clínica ou treinamento. Não testados aparelhos físicos, auth/histórico real, eficácia/validação clínica. É demonstração determinística com2casos fictícios, não Scribe generativo. Próximo executável: contrato e conjunto sintético de avaliação de texto livre com trechos de origem e checagem de negações/doses/unidades/correções, offline e sem ativar fornecedor/modelo. Desafios continuam abandonados. Rollback reconstruindo958f12c comcwd scripts/wmed-app.



## 25/09/2026 — passagem SBAR demonstrativa pronta

Adicionados botões Nota SOAP / Passagem SBAR no mesmo módulo, mantendo o chat e menu. Três exemplos fictícios em PT/EN/ES, incluindo novo relato autoral de passagem de caso. Mapeamento SBAR explícito por trecho: situação, contexto, avaliação, recomendação/pedido. Campos ausentes continuam vazios; nenhuma hipótese ou conduta nova é gerada. Origem por seção, revisão antes de copiar e marca de exemplo fictício na exportação com formato. Troca de formato recarrega o exemplo original, com confirmação se houve edição; não converte as edições do usuário. Rascunho apenas em memória.

Estrutura consultada na fonte primária AHRQ TeamSTEPPS: https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/sbar.html . Somente nomenclatura geral; exemplos/textos próprios, sem copiar mídia ou modelos proprietários.

148 testes passaram; build 2Doctor e build completo do site aprovados. Primeiro teste detectou inclusão automática indevida do novo exemplo na avaliação offline: corrigida com allowlist explícita dos dois exemplos originais, preservando corpus v1 de 18 fixtures/72 mutações. O novo exemplo tem testes de UI/dados, não foi admitido automaticamente como avaliação clínica.

CUA local: PT/EN/ES, 320/390/1280px, claro/escuro; ordem SBAR, origem, revisão/cópia, edição invalidando revisão, cancelar/confirmar substituição e SOAP preservado. 320px: scrollWidth=clientWidth305; campos sem rolagem interna; console sem erros. Sem teste em aparelho físico, login real, áudio, modelo gerativo ou revisão clínica/terminológica independente. Publicação ainda pendente no momento deste registro.

Próximo: publicar serviço isolado e verificar SUCCESS/health/asset/UI. Depois especificar atalhos contextuais do chat para recursos existentes e manter avaliação Scribe antes de geração livre.
