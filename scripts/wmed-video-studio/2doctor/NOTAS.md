# 2Doctor · estado do trabalho (25/09/2026)

## Produto e identidade
- 2Doctor (2doctor.ai): app internacional de apoio a médicos e estudantes. Começa no Brasil.
- Cores tiradas do app: verde-petróleo `#265B5A`, azul-tinta `#1A2C3E`, fundo `#F5F8F7`, cinza `#64737B`, branco. Monograma "2D" em `2d-mark.png` (recorte de print; pedir SVG oficial).

## Duas frentes de vídeo
1. **"Explicar em vídeo" dentro do app** (protótipo "Asma e DPOC: como diferenciar?", versões estudante e médico).
   Revisão em `revisao-asma-dpoc.src.html`: roteiro, storyboard, afirmações com status de fonte, doses, fluxo no app e plano de medição. Aguarda aprovação.
2. **Série "Por Dentro" para Instagram e X**, no estilo de documentário da Netflix, feita por nós (não pelos usuários).
   Página `por-dentro.src.html` com os três episódios (29 planos), afirmações com código e status, fontes por episódio e custo estimado do Runway. Aguarda aprovação.
   - Apresentadora: **Dra. Iris Maren**, médica clínica fictícia (antes "Dra. Helena Duarte", São Paulo). Cenários sem marcos: rua de cidade portuária à noite, corredor de hospital, café de esquina. Buscar o nome antes de publicar.
   - Referência de estilo: piloto "The Last Invention" (apresentadora de IA consistente, fala sincronizada, noite com luz quente e azul, tipografia serifada, capítulos, cena de apoio com humor).
   - Ep. 2 Infarto e Ep. 3 Cirrose: roteiros escritos. Fontes checadas em 25/09 só por extratos de busca (a rede bloqueou os sites), então todas estão como "parcial". Fontes novas: 5ª Definição Universal de IAM (2026) e Baveno VIII (2026). Reformulado: sem "tipo 1", sem limiar de 20 min na dor, sem a palavra "atípico".
   - Regra: vídeo gerado por IA (Runway) só em cenas sem afirmação clínica; mecanismo sempre nos nossos modelos 3D; rótulo "criado por IA" na legenda e em selo discreto (regra do Instagram e do X).

## Modelos 3D próprios (`../models3d/`)
- `build_lungs.py`: pulmões por campo implícito (5 lobos, fissuras, incisura cardíaca, cúpulas) e árvore brônquica por divisão de volume (Kitaoka 1999) com a lei de Murray. Gera `out/lungs.glb` e `out/airways.json` (cerca de 3.300 ramos, 13 gerações). Volumes: D 2,55 L, E 2,16 L.
- `bronchus.js`: corte do brônquio com parâmetros contract, edema, mucus, eos, neut, goblet, fibrosis e flow. Está legível, mas precisa de acabamento: ficou chapado e sem textura; faltam as dobras bem visíveis e as células inflamatórias maiores.
- A fazer: ácino alveolar com enfisema; coração com coronárias (placa → ruptura → trombo → área de necrose → angioplastia); fígado (liso → fibrose → nódulos; circulação porta, varizes, ascite).
- Rodar: `node models3d/serve.mjs` (porta 3070) e `node models3d/stills.mjs <cena> <t1,t2> <saída>`. Precisa de `pip install numpy scipy scikit-image trimesh fast-simplification`.
- Não usar Z-Anatomy (CC BY-SA) nem o CT TotalSegmentator s1397: tem derrame e redução do pulmão esquerdo, então não serve de modelo normal.

## Fontes verificadas (Asma/DPOC; o proxy bloqueou os PDFs, confirmar a página exata)
- GINA 2026 (05/05/2026), GOLD 2026 v1.3 (08/12/2025), PCDT Asma (Portaria Conjunta SAES/SCTIE nº 43, 24/03/2026), PCDT DPOC (nº 29, 27/11/2025), SBPT Asma 2020, StatPearls NBK551579, bulas Symbicort/Spiolto/Anoro.
- Mudanças que importam: o GINA 2026 trocou "dose máxima" do alívio por um aviso para reavaliar; a budesonida-formoterol 12/400 do SUS não serve para alívio; o acesso do SUS a LABA+LAMA/tripla na DPOC tem critérios (conferir na Portaria 29/2025).
- Sem fonte ainda: anatomia das vias aéreas e histologia da parede brônquica.

## Doses e interações
- Não há validador. `wmed-app/shared/interactions.mjs` é um rascunho escrito com IA: sem referência por regra e sem inalatórios (propranolol com salbutamol não gera alerta).
- Proposta: tabela de doses curada, cada linha com a bula Anvisa, a diretriz e o revisor; a IA só cita linhas aprovadas.
- Interações: licenciar. Candidatos: DrugBank, Micromedex, Lexidrug, Memed. Fontes não comerciais que não podem entrar: DDInter, DrugBank acadêmico, ATC/DDD da OMS e o FTN 2010.

## Esboço Ep. 2 · Infarto ("cada minuto conta")
Abertura fria (homem de ~55 anos para na escada, mão no peito) → título → apresentadora: "tempo é músculo" → 3D: placa na coronária rompe, coágulo fecha → 3D: músculo sem sangue, área que cresce com o tempo → apresentadora: sinais (dor/aperto > 20 min, irradiação, suor, náusea; atípico em mulheres, idosos e diabéticos) → ligar para a emergência local (192 no Brasil; no internacional, "número de emergência") → 3D: ECG em até 10 min e cateterismo reabrindo a artéria → prevenção (pressão, glicose, colesterol, cigarro) → assinatura.

## Esboço Ep. 3 · Cirrose ("o fígado que se cala")
Abertura fria (exame de rotina, sem sintomas) → título → apresentadora: o fígado adoece em silêncio → 3D: agressão (álcool, hepatites B/C, gordura no fígado/MASLD) → inflamação → fibrose → nódulos → 3D: hipertensão porta (varizes, baço, ascite) → apresentadora: sinais de alerta (icterícia, barriga crescendo, vômito com sangue, confusão) → 3D: risco de câncer de fígado, ultrassom a cada 6 meses → tratar a causa pode frear (parar o álcool, curar a hepatite C, controlar a hepatite B, perder peso) → assinatura.

## Runway
- SDK oficial `@runwayml/sdk` (4.20.1). Não há MCP oficial no npm; os que existem são de terceiros (não passar a chave para eles).
- A API tem imagem (`gen4_image`), vídeo (`gen4_turbo`, `gen4.5`), atuação (`act_two`), avatar falante com áudio ou texto (`gwm1_avatars`) e voz (`eleven_multilingual_v2`).
- Na nuvem: a rede bloqueia `api.dev.runwayml.com` e não há Chrome logado. Precisa liberar o domínio e guardar `RUNWAYML_API_SECRET` nas variáveis do ambiente.

### Conta de API (conferido em 25/09/2026, no Mac)
- Organização de API **2Doctor** criada em dev.runwayml.com (login Google, dilsonpanisio@gmail.com). É separada do plano do app web: os créditos do app **não** valem na API.
- Chave `2doctor-por-dentro` em `~/.config/2doctor/runway.env` (permissão 600, carregada pelo `~/.zshrc`). Nunca no Git.
- **Saldo da API: 0 crédito.** Sem cartão salvo (o cadastro oferece 500 créditos grátis ao salvar um cartão). Compra: 1 crédito = US$ 0,01, no portal.
- Tier: teto de 10.000 créditos por mês (US$ 100). Limites: `gen4_image` e `gen4_image_turbo` 2 simultâneas / 200 por dia; `gen4_turbo`, `gen4.5`, `act_two`, `gwm1_avatars` e `eleven_multilingual_v2` 1 simultânea / 50 por dia.
- Modelos liberados incluem todos os da série: `gen4_image`, `gen4_image_turbo`, `gen4_turbo`, `gen4.5`, `act_two`, `gwm1_avatars`, `gwm1_avatar_async_audio_to_video`, `gwm1_avatar_async_text_to_video`, `eleven_multilingual_v2`, `eleven_v3` (e outros: veo3.1, seedance2, kling3.0, gpt_image_2…).

### Preços conferidos (docs.dev.runwayml.com/guides/pricing, 25/09/2026)
| Modelo | Preço |
|---|---|
| gen4_image | 5 créditos por imagem 720p; 8 por imagem 1080p |
| gen4_image_turbo | 2 créditos por imagem, qualquer resolução |
| gen4_turbo | 5 créditos por segundo |
| gen4.5 | 12 créditos por segundo |
| act_two | 5 créditos por segundo |
| gwm1_avatars (avatar em tempo real) | 2 créditos na entrada + 2 a cada 6 s |
| eleven_multilingual_v2 (voz) | 1 crédito a cada 50 caracteres |

### Rostos de referência da Dra. Iris Maren (1ª rodada: 25/09/2026, aguardando aprovação)
- Script: `runway/gerar-ref.mjs` (`node gerar-ref.mjs saldo` sem custo; `node gerar-ref.mjs gerar` gasta crédito). SDK `@runwayml/sdk` 4.20.1 em `runway/` (instalar com `npm install @runwayml/sdk`).
- `gen4_image`, ratio `1080:1920` (aceito), prompt da seção "A apresentadora" sem alteração.
- Seeds fixas: iris-01 = 250925001, iris-02 = 250925002, iris-03 = 250925003, iris-04 = 250925004.
- Saldo da API antes: 5.000 créditos (US$ 50). Custo real: 8 créditos por imagem (5000 → 4992 → 4984 → 4976 → 4968), igual à tabela. Total 32 créditos (US$ 0,32); 35 a 54 s por imagem, 169 s no total.
- Saída em `out/ref/iris-01..04.png` (1080×1920) e `out/ref/iris-log.json` (ids das tarefas e créditos antes e depois de cada chamada).
- Leitura da 1ª rodada: nenhuma parece ter 40 e poucos anos (todas aparentam 25 a 30); maquiagem marcada, não mínima; luz de fim de tarde, não noite. iris-02 tem bindi (marca cultural, contra "traços sem país"). iris-01 e 02 têm relógio dourado; iris-01 mostra letras soltas numa fachada. A mais próxima do briefing é iris-04 (trilhos, relógio de aço, luz quente e azul).
