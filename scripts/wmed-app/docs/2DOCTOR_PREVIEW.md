# 2Doctor — prévia de identidade e navegação

Branch isolada `codex/2doctor-preview-20260925`, criada de `origin/main` em `c932cce`. O checkout e a versão publicada de WMed foram preservados. O Git dessa base permite recuperar integralmente os arquivos anteriores.

## Executar

Na pasta `scripts/wmed-app`: `npm ci` e `npm run dev:2doctor`.
Prévia: http://127.0.0.1:5206/2doctor/
Build separado: `npm run build:2doctor`, saída `dist-2doctor`.
O build convencional continua sendo WMed. O pipeline de publicação não foi alterado; não há rota 2Doctor publicada por esta etapa.

## Implementado

- Identidade escolhida: monograma 2D, verde-petróleo, marinho, Manrope (licença OFL incluída).
- Chat amplo, cabeçalho não fixo, navegação recolhida, atalhos no desktop e gaveta no celular.
- Menu pesquisável com Plantão, Estudos e Laboratório de IA; todos os módulos existentes continuam acessíveis. Laboratório contém o protótipo de radiografia existente; não inclui ainda publicações de comunidade ou novos projetos.
- Sugestões preenchem a pergunta para revisão antes de enviar. Atalhos abrem caso, scores e questões.
- Quatro temas com preferência de aparência separada do WMed.
- Mesmos componentes de chat, anexos, streaming, casos e histórico, sem migração ou cópia de dados. A autenticação continua sendo Vytal; a prévia não cria uma conta independente 2Doctor.

## Limites da prévia

O servidor local encaminha `/api/wmed` aos handlers existentes. A política de origem, cookies, permissões e limites desses handlers permanece inalterada. Não há simulação de login/respostas nem redução de segurança. A sessão autenticada, geração real e salvamento não foram retestados nesta origem local; validar em ambiente HTTPS autorizado antes de disponibilizar a usuários. Os testes automatizados incluem contratos dessas funções, mas não substituem um teste autenticado real.

Não houve alteração no backend, DNS, domínio, cobrança ou na rota WMed em produção. Esta etapa não revalida conteúdo clínico nem promete diagnóstico correto. Os avisos existentes foram preservados.
