# Ferramentas da conversa

## 25/09/2026 — Ferramentas junto ao chat prontas

Novo painel recolhido por padrão junto ao compositor, exclusivo da 2Doctor e traduzido PT/EN/ES. Seis destinos fixos: Scribe demonstrativo, fontes oficiais, artigos/ensaios, exames protótipo, scores e anatomia 3D. Apenas navegação explícita; não recebe texto/anexos nem faz inferência, copia relato, inicia busca ou chama modelos. Estado do chat permanece montado. Rascunho fictício preservado ao abrir/voltar; menu e autenticação intactos.

160 testes existentes, build2Doctor e site completo aprovados; aviso preexistente de chunk de questões grande. CUA320/390/1280, PT/EN/ES, branco/escuro, Enter/Space/Escape, foco, menu, seis rotas e rascunho. Semoverflow em320 (client/scroll305). Servidor dev5206 apresentou falha de import dinâmico Scene.tsx; não atribuir como corrigida. Build final testado separadamente pelo servidor Railway local5211: atlas/modelo carregaram, sem erro de console. A falha do dev não se reproduziu no artefato publicável. Não testados aparelhos físicos, VoiceOver, chat autenticado/streaming nem anexos reais; nenhum paciente/modelo/API Vytal/ECG alterado.

Referência de interação: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ (consultada25/09/2026). Implementação autoral, sem copiar código/mídia externa; ícones Lucide já licenciados no projeto. Não houve novo conteúdo clínico/licença de acervo. Próximo: publicar só2doctor-web e exigir SUCCESS/health/asset/UI. Rollback reconstruindo53adf62. Após publicação: melhorar a recuperação de falhas de carregamento de módulos sem perder a conversa, investigando devcache separadamente.

