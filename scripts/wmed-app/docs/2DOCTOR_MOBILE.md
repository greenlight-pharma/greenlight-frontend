# Correção de navegação móvel — 25/09/2026

Relato do usuário: versão inutilizável no celular; confirmou menu e navegação como problema principal.

## Alterações

- Navegação inferior no celular: Chat, Plantão, Estudos e Menu, sem fixar o cabeçalho. Espaço inferior reservado para não cobrir conteúdo.
- Menu de largura inteira em celulares, alvos de toque maiores e categorias expansíveis. Atalhos para conversa atual, nova conversa e histórico.
- Busca de 16px sem foco automático (evita teclado ao abrir e zoom automático por fonte pequena no Safari). O menu acompanha a altura visível quando o teclado abre, preservando pinch zoom.
- Idioma/país e aparência dentro do menu no celular. Cabeçalho com marca, histórico, nova conversa e conta.
- Rolagem do fundo bloqueada/restaurada; fundo inert durante o diálogo; foco retorna sem pular a página nem reabrir teclado; controles ocultos excluídos da navegação por Tab.
- Troca de módulo inicia no topo; Chat retorna à conversa, sem apagá-la.
- Escopo: frontend 2Doctor, contratos de API/histórico intactos. viewport-fit=cover compartilhado no HTML; WMed não recebe o novo menu.

## Verificação

121/121 testes existentes; build 2Doctor e build completo do site aprovados. Aviso preexistente sobre tamanho do bundle de questões permanece.

CUA em navegador desktop com viewport 390×844, 320×568 e 320×400: abrir/fechar, foco no botão de fechar, categorias, busca “mol”, navegação para anatomia/molecular/scores, retorno da rolagem, largura sem overflow; mudança PT→EN e menu traduzido; preferências acessíveis em área rolável. Não equivale a validação em iPhone físico.

Não testados neste patch: teclado iOS real, VoiceOver físico, login real, geração/salvamento autenticados. Nenhuma chave, dado de paciente ou API clínica alterada.

## Publicação

Publicado no serviço isolado 2doctor-web: https://2doctor-web-production.up.railway.app/2doctor/ . Commit 3f230ab; deployment bc224585-a083-4f87-85f0-fa8c924b35c8 SUCCESS, asset index-FlyJgWlA.js, health e página HTTP200. CUA público390px confirmou dock, Estudos expandido, busca16px, foco em Fechar menu, anatomia carregada, corpo sem bloqueio/inert residual e retorno ao Chat. Viewport restaurado após QA.

Verificação adicional local: fechar o menu preservou scrollY1736 em uma calculadora longa; tema escuro funcionou; desktop1280px manteve gaveta354px e ocultou dock.

Próximo: colher retorno do aparelho e validar teclado iOS/Android e fluxos autenticados. Não declarar todos os módulos internos homologados em mobile. Versão anterior recuperável no deployment fc4d81f1-bbad-4a5e-92fc-c55f3dc7c9c7 ou no Git495ab54.
