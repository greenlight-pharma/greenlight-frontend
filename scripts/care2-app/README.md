# Vytal Care2

Projeto independente do Care atual, originado do `vytal-care-web` commit `deaca619fe6008bc23eb88957cea561333541c29`.

- Página pública: `/vytal-care2/`.
- Aplicativo conectado: `/vytal-care2/app/`.
- Cadastro família: `/vytal-care2/app/familia`.
- Override opcional exclusivo: `VITE_CARE2_API_URL`; não herda configuração de outros painéis.
- Mesma API, autenticação e integração Pagar.me do Care atual. Nenhuma chave secreta no frontend. Configuração pública do checkout vem da API autenticada. Cartão tokenizado diretamente no Pagar.me; Pix e cupons passam pelo servidor existente.
- Dados e assinaturas reais compartilhados. A interface/código são independentes; não se trata de uma cópia dos dados.
- Sessão local usa `vytal-care2.sessao` para não colidir com outros apps no domínio.
- Recuperação de senha e confirmação de e-mail permanecem com os links emitidos pelo backend atual, que podem abrir o Care original; depois basta retornar ao Care2.
- Login Google só aparece com `VITE_CARE2_GOOGLE_CLIENT_ID` explicitamente configurado para este domínio. E-mail/senha são a entrada padrão.

## Desenvolvimento

`npm ci`, `npm test`, `npm run build`, `npm run dev`.

Prévia apenas em desenvolvimento: `/vytal-care2/app/?previa=familia`. Dados sintéticos; nunca preencha cartão nessa prévia. Build de produção remove esse caminho e exige autenticação real.

O build principal `scripts/build-vercel.sh` compila este projeto e publica apenas dist em `/vytal-care2/app/`. As fontes ficam em scripts, fora do conteúdo publicado. Vercel resolve rotas internas para o index apenas nesse prefixo.

## Validação

23 testes de modelos e contrato de sessão/API, compilação TypeScript/Vite e build completo do site. A validação visual local cobre landing, login/cadastro, painel família, avisos e checkout com fixtures locais. Não foram criadas assinaturas, enviados lembretes ou feitas cobranças reais durante a implementação. Validação final autenticada e cobrança homologada dependem de conta de teste.

## Programa Gestação

Rota `/gestacao` escolhe pessoa; `/p/:phone/gestacao` ativa por DPP/idade confirmada. Agenda editável, dúvidas, resumo imprimível, encerramento com histórico, doses do dia e resumo nos cartões. A API aditiva `/care2/pessoas/:phone/gestacao` persiste por conta+pessoa, exige vínculo/conta pessoal e versionamento para evitar sobrescritas. Backend deve ser publicado primeiro (greenlight-backend, CARE2-GESTACAO.md).

Compromissos avisam dentro do programa hoje/amanhã; exportação ICS usa horário de Brasília e alarmes1dia/1hora. O usuário precisa importar no calendário e permitir alertas. Não há novo envio WhatsApp/e-mail dos compromissos; medicamentos continuam com seu fluxo existente. Não há conteúdo clínico semanal gerado, avaliação de risco ou ajuste de doses. Conta compartilhada mantém acesso às informações; não há convite automático a familiar.

QA:29testes frontend e build; ativação por24semanas, dúvida e compromisso testados via CUA com fixturesDEV, inclusive390px. Banco e autorização testados no backend com PostgreSQL efêmero. Teste autenticado em produção ainda depende da conta de teste do usuário.
