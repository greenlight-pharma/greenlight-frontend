# Painel do Médico — React + Vite

Refactor do `medico.html` (arquivo único de 9.513 linhas) em uma aplicação
React com Vite. O `medico.html` original **continua no repositório e
funcionando** — este app roda em paralelo até você validar.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 84 testes
npm run build    # gera dist/ estático
```

O backend fica em `VITE_API_URL` (padrão: Railway de produção). Para apontar
para outro: `VITE_API_URL=http://localhost:3000 npm run dev`.

## Deploy

Publicado em **https://www.vytalsaude.com.br/painel-medico**, junto do
`medico.html` antigo, que segue no ar e intocado.

`npm run build` gera `dist/` com base **absoluta** `/painel-medico/`. Não é
`./` de propósito: com base relativa, abrir a URL sem a barra final fazia o
`./assets/...` resolver para a pasta pai e a página vinha em branco. Para
publicar em outro caminho: `VITE_BASE=/outro/ npm run build`.

O roteamento é por hash (`#/pacientes`), o que evita 404 no F5 sem precisar
de regra de rewrite no servidor.

## Estrutura

```
src/
  lib/            regras puras e testáveis — não conhecem React nem DOM
    api.js          toda chamada HTTP; 401 centralizado
    auth.js         token e sessão (único ponto que toca localStorage)
    phone.js        normalização BR + variantes do nono dígito
    schedule.js     horários de lembrete, posologia, fim de tratamento
    adherence.js    agregação da adesão a partir de patient_events
    calculators.js  as 5 calculadoras clínicas
    screening.js    rastreios por faixa etária
    examPanels.js   painéis e descrições de exames (dados de referência)
    markdown.js     markdown mínimo do assistente (escapa antes de formatar)
    stream.js       consumo do SSE do assistente
    pdf.js          geração de PDF (jsPDF por import dinâmico)
  components/     UI compartilhada (Modal, TimesEditor, ConfirmDialog, …)
  features/       uma pasta por domínio, com api.js próprio
  styles/         tokens.css + um arquivo por domínio
```

A regra que organiza tudo: **`lib/` não sabe que existe React**. É por isso
que dá para testar a fórmula da gasometria e a normalização de telefone sem
subir a tela.

## O que mudou de comportamento (de propósito)

| Antes | Agora |
|---|---|
| 36 `fetch` e nenhum tratava 401 | 401 em qualquer tela derruba a sessão com aviso claro |
| jsPDF vindo de CDN no clique | jsPDF no bundle, carregado sob demanda — funciona offline |
| `window.confirm` | diálogo próprio, com as consequências em lista |
| Horário só como lista manual | atalhos de posologia (8/8h, 12/12h) + aviso de duplicata |
| Adesão coletada e nunca exibida | painel de adesão no prontuário |
| Lembrete quebrado invisível | pendências na tela de Início |
| Fórmulas clínicas dentro do DOM | funções puras com teste |

## O que NÃO foi portado

Consciente, para não travar a entrega. O `medico.html` segue atendendo:

- Distinção de exame de imagem no upload (`examType: "imaging"`) — o app
  envia tudo como laboratorial; a leitura já separa os dois.
- Página dedicada de linha do tempo (existe como card no prontuário).
- Exibição dos resumos semanais (`weekly_summaries`).
- Tooltip flutuante dos exames — usamos `title` nativo, que cobre o caso
  mas não formata.

## Pendências que são do BACKEND

Estão documentadas com `[BR-PHONE-9DIG]`, `[FIM-TRATAMENTO]` e `[QUIRK-HBA1C]`
no código. Nenhuma se resolve só aqui — ver o relatório entregue junto.
