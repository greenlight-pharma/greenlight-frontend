# Pesquisa: falhas, cancelamento e nova tentativa

## 25/09/2026 — Recuperação da pesquisa bibliográfica pronta

Fontes e estudos: timeout25s no cliente, cancelar busca, repetir manualmente mantendo tema/aba, erros autorais PT/EN/ES por conexão, demora, HTTP400, indisponibilidade e limite429. Cooldown60s visível após429, sem repetição automática; proteção real continua no servidor existente. Editar tema/trocar aba cancela e invalida resultado anterior; identidade da requisição impede resposta atrasada. Resultado identifica tema efetivamente enviado. Campos16px e botões empilhados em telas até400px. Sem nova API/modelo/persistência; backendVytal/ECG intactos.

166testes aprovados: transporte same-origin, trim/aba, códigos sem detalhes internos, resposta inválida, timeout versus cancelamento, cancelamento antes do fetch e descarte de resposta tardia. Builds2Doctor/sitecompleto aprovados; aviso habitual de chunkgrande. CUA local com proxy temporário:502→tentativa→sucesso vazio, cancelamento, troca de aba/tema com resposta tardia, timeout25s,429/botões desabilitados e contador, PT/EN/ES,320/390/1280,claro/escuro, semoverflow. Falhas simuladas não são instabilidade de produção. Fixturesnão publicadas, sem paciente real.

Fontes técnicas: https://developer.mozilla.org/en-US/docs/Web/API/AbortController consultada25/09/2026; tentativa de consulta à documentaçãoEuropePMC retornou403 via ferramenta. Não houve mudança de contrato do provedor, conteúdo clínico, ingestão/licença, cópia de código externo ou fornecedor. Implementação autoral, metadados bibliográficos pelo conector existente. Limites: busca não é revisão sistemática, ordenação não mede qualidade; cancelamento local pode ocorrer após o provedor receber a consulta. Não testados aparelhos físicos, VoiceOver, auth/chat/áudio, efeitos clínicos ou pesquisa com dados identificáveis. A ausência de resultado nos testes é fixture, não evidência sobre acervo.

Próximo: commit e publicação somente2doctor-web comcwdapp/path-as-root; exigirSUCCESS/health/asset/UI e uma consulta pública real de tema não identificável. Rollback2c13e02. Depois melhorar organização de referências para estudo com seleção e exportação bibliográfica explícitas, sem guardar conteúdo clínico nem redistribuir textos integrais.


## 25/09/2026 — Recuperação da pesquisa publicada

Fonte540782b; deployment9ff3c809-97ef-46f6-8f6c-be452e2cf2df SUCCESS exclusivamenteprojeto2doctor/serviço2doctor-web, cwd scripts/wmed-app/path-as-root. Health200/product2doctor, página200 e assetindex-BtTiaEmp.js idêntico ao buildlocal/HTTP200. CUA público390px: consulta real asthma retornou8publicaçõesEuropePMC, tema/data/fontes explícitos, botãoCancelar duranteespera; semoverflow(client/scroll375), console semerros. Viewport restaurado. Sem falha simulada emprodução, semdadospessoais.

166testes/build2Doctor/sitecompleto aprovados. CUA local também confirmou cooldown429 expira e libera retentativa manual (sucessofixtureClinicalTrials), cancelamento, timeout25s, troca deaba/tema semrespostatardia e PT/EN/ES320/390/1280. ConsultarealClinicalTrials, aparelhosfísicos, VoiceOver, chat/auth/upload reais e validaçãoclínica não testados. Servidorestemporários5211/5213 encerrados. Próximo: seleção e exportação explícita de referências bibliográficas, com identificação de fonte/formato, semredistribuirtexto integral ou armazenar relato clínico. Rollback2c13e02 no cwdapp. API Vytal/ECG intactos.

