# 2Doctor internacional — etapa 1

Pesquisa e decisões: 25/09/2026. Status desta nota: primeira etapa publicada no Railway; deployment fc4d81f1-bbad-4a5e-92fc-c55f3dc7c9c7, verificação registrada em 2DOCTOR_PREVIEW.md.

## O que já funciona nesta etapa

- Idiomas PT-BR, EN e ES para navegação, chat, login, histórico, anexos e pesquisa; atributo HTML lang e datas seguem a preferência. Escolha persistida neste navegador, sem dados clínicos no armazenamento dessa preferência.
- País separado do idioma, sem inferência pela localização/IP. A escolha orienta o contexto da conversa, não representa validação de diretrizes ou disponibilidade de medicamentos nesse país.
- Adaptador do chat aceita apenas idiomas/países da allowlist. Preferências são enviadas na pergunta ao tutor já integrado. Prompt educacional, autenticação, permissões e limites continuam vigentes. Geração real em cada idioma depende de teste autenticado; testes simulados não a comprovam.
- Bibliotecas, casos, questões, ENAMED e 3D ainda têm conteúdo em português: indicação visível no menu e na página. Tradução de interface não é tradução clínica do acervo.
- Menu Pesquisa → Fontes e estudos: Europe PMC (revisões/diretrizes), ClinicalTrials.gov (ensaios registrados), fontes clicáveis, cópia de referência, data da consulta e status do registro. Não há resumo inventado nem síntese automática nesta ferramenta.
- Radar de inovação: seis oportunidades verificadas; todas marcadas como em avaliação, sem execução de modelos nem integração fictícia.

## Países e idiomas: hipótese de trabalho, não ranking recuperado

Foi recuperado o plano inicial `outputs/medai-planejamento-20260923/PLANO-E-PARCERIAS.md`, que priorizava PT/EN e conteúdo regional. Não foi localizado o suposto relatório detalhado de países referido pelo usuário. A ordem abaixo é uma proposta operacional baseada no reaproveitamento de conteúdo e no custo de localização, não em estimativas de mercado não verificadas.

| Onda | Mercados para pilotos | Entrega necessária |
|---|---|---|
| 1 | Brasil | Concluir teste autenticado do chat, cadastro e jornada existente; medir retenção e custo por usuário com consentimento e dados mínimos. |
| 2 | Portugal; Espanha/México e outros países hispanofalantes | PT-PT e revisão ES por profissionais locais; nomenclatura, unidades, fontes e exemplos regionais. Não tratar português brasileiro como localização portuguesa completa. |
| 3 | Estados Unidos e Reino Unido | Conteúdo próprio para exames e prática local; revisão clínica, licenças de materiais, privacidade, cobrança e suporte. Interface EN já disponível; produto clínico local ainda não validado. |
| 4 | Outros mercados de língua inglesa; francês posteriormente | Expandir apenas após métricas, revisão e suporte. Suporte a novas línguas requer catálogo e revisão; não basta tradução automática. |

ENAMED continua identificado como conteúdo brasileiro. Não rebatizar suas questões como USMLE ou PLAB. USMLE tem etapas próprias; PLAB é compatível com MLA e baseado no mapa de conteúdo do GMC. Fontes: https://www.usmle.org/step-exams ; https://www.gmc-uk.org/education/medical-licensing-assessment/plab-and-the-mla . Licenciamento de exame/material deve ser verificado separadamente.

## Pesquisa de funcionalidades: prioridade e dependências

| Recurso | Evidência/tecnologia | Próxima entrega concreta | Status/limite |
|---|---|---|---|
| Fontes verificáveis | Europe PMC REST | Busca com referências reais e links | Implementado. Busca não equivale a revisão sistemática e não ranqueia qualidade clínica. |
| Descoberta de ensaios | ClinicalTrials.gov API v2 | Situação, países e registro do estudo | Implementado. Não determina elegibilidade, benefício ou indicação de tratamento; registro pode estar desatualizado. |
| Pesquisa por conceitos | PubTator 3.0, NCBI | Relacionar genes/doenças/fármacos com artigos selecionados | Avaliar API e extração. Relação textual não demonstra causalidade. |
| Imagens médicas para ensino | MedGemma 1.5 | Piloto offline com exames públicos licenciados e perguntas avaliadas | Em avaliação. Não alterar o chat atual nem executar interpretação clínica sem validação própria. |
| Ditado médico | MedASR | Benchmark com áudios fictícios consentidos PT/EN/ES, erros de termos e doses | Em avaliação. Não presumir desempenho multilíngue; revisar transcrição antes de uso. |
| Diretrizes regionais versionadas | WHO SMART Guidelines | Prova de conceito com uma recomendação, proveniência e versão | Em avaliação. Implementação técnica não cria autorização clínica nem substitui diretriz local. |
| Proteínas dinâmicas em 3D | BioEmu | Um conjunto de conformações pré-calculadas, exibido como pesquisa | Código/modelo sob MIT no repositório consultado; verificar licença de cada dado. Não alugar GPU automaticamente nem confundir ensemble com trajetória temporal. |
| Genética funcional | AlphaGenome Atlas, anunciado 08/09/2026 | Material educativo explicando variantes e incerteza | Avaliar contrato/comercial. Acesso público não comercial e canais comerciais têm termos diferentes. Nenhuma chamada/download de modelos nesta etapa. |

Fontes primárias verificadas:
- Europe PMC: https://europepmc.org/RestfulWebService (documentação indexada; endpoint de pesquisa testado com sucesso).
- NLM / API v2: https://www.nlm.nih.gov/pubs/techbull/ma24/ma24_clinicaltrials_api.html e https://clinicaltrials.gov/data-api/api . Endpoint real testado, campos reduzidos; contatos de participantes/centros não retornados ao frontend.
- PubTator: https://pmc.ncbi.nlm.nih.gov/articles/PMC11223843/ . Trabalho dos autores descreve busca semântica e relações de conceitos.
- Google Research (13/01/2026): https://research.google/blog/next-generation-medical-image-interpretation-with-medgemma-15-and-medical-speech-to-text-with-medasr/ . MedGemma 1.5 inclui CT/MRI/histopatologia e documentos; MedASR é base para ditado. São bases para desenvolvimento, exigem adaptação e avaliação.
- Model cards: https://developers.google.com/health-ai-developer-foundations/medgemma/model-card ; https://developers.google.com/health-ai-developer-foundations/medasr/model-card . Consultar termos HAI-DEF antes de hospedar/distribuir.
- WHO: https://www.who.int/teams/digital-health-and-innovation/smart-guidelines ; https://smart.who.int/ . Estruturas para diretrizes digitais e adaptação.
- BioEmu: https://github.com/microsoft/bioemu e https://www.microsoft.com/en-us/research/?p=1129428 . Ensembles conformacionais para pesquisa.
- AlphaGenome Atlas: https://deepmind.google/blog/alphagenome-atlas-a-predictive-map-of-every-possible-dna-letter-change-in-the-human-genome/ ; https://github.com/google-deepmind/alphagenome . Verificar autorização comercial no canal específico, sem supor que licença de código autoriza os outputs/dados.

## Próxima fila executável

1. Testar chat real PT/EN/ES com a conta de teste, com perguntas fictícias equivalentes; medir idioma, referências, latência, histórico e anexos. Não reutilizar conversas clínicas de usuários como treino por padrão.
2. Localizar scores/calculadoras e o formulário de caso, preservando unidades e regras; revisão de terminologia por idioma. Em paralelo de produto, sem agentes automáticos: traduzir taxonomia dos atlas a partir de nomenclatura controlada.
3. Adicionar preferência de público (estudante/profissional/pesquisador) e caminhos úteis, mantendo um chat simples. Nenhum modo deve prometer diagnóstico correto garantido.
4. Conectar artigos selecionados à conversa com citação verificável, distinguindo resumo, guideline, preprint e ensaio. Avaliar apoio à formulação PICO e exportação bibliográfica, sem prometer revisão sistemática completa.
5. Criar conjunto de avaliação desidentificado por idioma/país e especialidade antes de hospedar pesos próprios. Verificar nomes genéricos, unidades, doses (se houver escopo autorizado), referências e incerteza. Continuar API atual até evidência de equivalência.
6. Revisar cadastro internacional, privacidade, pagamentos, moeda e suporte; não liberar cobrança internacional automaticamente nesta etapa.

## Escopo preservado e validação

Branch isolada `codex/2doctor-preview-20260925`; produção Vytal, leitor ECG, bancos e DNS anteriores intocados. Não houve fine-tuning, compartilhamento de dados clínicos com modelos novos, treinamento de IA, compra de serviços ou contratação de parceria.

Testes incluem regressão WMed, preferências, allowlists, transporte SSE, fontes fixas, autenticação, erro/limite e descarte de contatos do registro de ensaios. Revisão visual cobre PT/EN/ES e viewport móvel. A validação clínica/terminológica, geração real autenticada e iPhone físico não podem ser inferidos desses testes.
