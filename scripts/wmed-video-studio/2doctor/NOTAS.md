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
   - Referência analisada em 25/09 (vídeo do Gavin Purcell no X, 5:15, feito por um agente Claude com o MCP do Runway; post x.com/gavinpurcell/status/2103304514329854102): **16:9 horizontal**, rascunho em 480p, teto de 25 mil créditos. Apresentadora britânica fixa (casaco caramelo, gola alta preta), fala para a câmera em plano médio num pub e andando à beira do rio; muito material de apoio sem ela (livros, robôs, data centers, gente na chuva), talvez metade do tempo; cartões tipográficos serifados (nome e função na apresentação; verbete de dicionário). Imagem suave, cores lavadas, pretos esmagados, granulação: é a textura que tira a cara de IA, não só o enquadramento.
   - Teste sem custo (25/09): tratamento de cor e textura em ffmpeg sobre os vídeos do café (meia resolução e volta, saturação 0,78, contraste 0,93, curvas puxando o preto para o azul, granulação e vinheta). Saída `out/grade/`. Filtro no NOTAS para repetir na montagem: `scale=iw*0.5:-2,scale=iw*2:-2,eq=saturation=0.78:contrast=0.93:brightness=-0.02:gamma=0.97,curves=r='0/0.03 0.5/0.52 1/0.95':g='0/0.04 0.5/0.5 1/0.93':b='0/0.07 0.5/0.49 1/0.88',noise=alls=9:allf=t+u,vignette=PI/5`.
   - Ep. 2 Infarto e Ep. 3 Cirrose: roteiros escritos. Fontes checadas em 25/09 só por extratos de busca (a rede bloqueou os sites), então todas estão como "parcial". Fontes novas: 5ª Definição Universal de IAM (2026) e Baveno VIII (2026). Reformulado: sem "tipo 1", sem limiar de 20 min na dor, sem a palavra "atípico".
   - Regra: vídeo gerado por IA (Runway) só em cenas sem afirmação clínica; mecanismo sempre nos nossos modelos 3D; rótulo "criado por IA" na legenda e em selo discreto (regra do Instagram e do X).

## Produção do Ep. 2 (Runway)
- **Formato decidido (26/09): 16:9.** Planos do Ep. 2 com `runway/planos-ep2.mjs` (imagem inicial `gpt_image_2` 1920:1088 → Veo 3.1 Fast 1920:1080, 8 s, com som → troca da voz da Iris pela Lara → tratamento de imagem). Saída `out/ep2/*-final.mp4`.
  - UBS (imagem b): 10 + 120 créditos. Boa: pai com a mão no peito, filho, enfermeira mede a pressão.
  - Rua (imagem a): 10 + 120 + 3. Anda e fala para a câmera com bonde desfocado; no fim ela vira o rosto e parece outra pessoa, e o letreiro do bonde está aceso (conferir texto). Usar só o começo ou refazer.
  - Corredor (imagem a): 10 + 120 + 3. Bom enquadramento pela porta. A fala (149 caracteres) ocupa os 8 s inteiros: conferir se não ficou corrida ou cortada; se ficou, encurtar a fala e refazer.
  - O café aprovado é vertical: refazer em 16:9 (cerca de 130 créditos).
  - Saldo: 3.976 créditos.
- **2ª versão dos planos (26/09)**, depois da crítica do Dilson (UBS com elenco que não parecia brasileiro; Iris perto e de frente demais): abrir com o paciente já passando mal; elenco brasileiro; Iris de lado ou três-quartos, falando com alguém fora do quadro; falas em tom de entrevista (o "pause e responda" vai para o cartão). Processo novo: aprovar as imagens paradas antes do vídeo.
  - Imagens: 8 (2 por plano), 40 créditos. Escolhidas: ubs2-b, rua2-b, corredor2-b, cafe2-a.
  - Vídeos: 4 × 120 créditos + 3 trocas de voz (9). Saídas `out/ep2/{ubs2,rua2,corredor2,cafe2}-final.mp4`.
  - Saldo: 3.447 créditos.
- **3ª versão (26/09)**, depois da crítica: aparelho de pressão duplicado na UBS; rio e café não combinam com ensino de medicina; câmera ainda perto. Correções: UBS começa com o aparelho já no braço e a técnica só com a pera ("only one cuff"); Iris em cenários médicos, pequena no quadro (≤ 1/4): anfiteatro vazio à noite (desafio), posto da emergência às 3 h (resposta), sala de descanso dos médicos (fora da prova). Cenários fixos da apresentadora passam a ser hospital e faculdade; porto e café saem.
  - Imagens 40 créditos (ubs3-b, anfiteatro-a, posto-a, descanso-a); vídeos 4 × 120; troca de voz 9. Saídas `out/ep2/{ubs3,anfiteatro,posto,descanso}-final.mp4`.
  - Leitura: UBS com um só aparelho; posto e descanso bons. No anfiteatro o residente vira e sorri para a câmera no meio do plano: usar só começo e fim ou refazer.
  - Saldo: 2.918 créditos.
- **Formato novo (26/09): só a Iris + grafismo.** O Dilson reprovou a 3ª versão (cara de IA, figurantes artificiais). Decisão: uma pessoa só, a Iris, falando para a câmera em plano médio como na referência; sem paciente nem figurantes; a explicação vai em grafismo nosso (verbete do termo, nome na apresentação, números, alternativas, 3D). Script `runway/teste-modelo.mjs`, saída `out/modelo/`.
  - Cenário: biblioteca de faculdade de medicina à noite, luminária verde (imagem `gpt_image_2` com @Iris, 10 créditos; escolhida biblioteca-a).
  - **Seedance 2.5 bloqueado de novo** pela moderação, agora também com a imagem como primeiro quadro (0 crédito): não aceita a Iris. Descartado para a apresentadora.
  - **Veo 3.1 completo**: falhou 4 vezes ("try again later", 0 crédito) e funcionou na 5ª: 8 s 1920×1080 com áudio, **320 créditos**, 166 s. Voz trocada pela Lara (3).
  - Grafismo sem custo: cartões PNG transparentes (Pillow, Georgia) sobrepostos com fade no ffmpeg (o ffmpeg daqui não tem `drawtext`): nome "Dr Iris Maren · Physician · 2Doctor" e verbete "hypertensive emergency · medical term · Very high blood pressure + an organ already in trouble". Script de composição em `out/modelo/grade.sh`.
  - Saldo: 2.585 créditos.
  - Pedido seguinte: câmera mais longe (biblioteca aberta, 10 créditos) e cenário menos sofisticado. Testados sala de aula de faculdade e sala dos médicos no hospital (20 créditos). **Escolhida: sala dos médicos no hospital, imagem hospital-b** (jaleco, negatoscópio com raio-X, jalecos pendurados, computador, café).
  - Comparação no mesmo plano: Veo 3.1 Fast 120 créditos (111 s) × Veo 3.1 completo 320 (137 s, funcionou de primeira desta vez); voz Lara 3 + 3. Nos dois a câmera se aproxima dela durante o plano, apesar de "no zoom": no próximo, pedir "locked-off, framing stays exactly as the first frame".
  - Saldo: 2.109 créditos.
- **Explicador "Por Dentro · The heart attack, explained" (26/09, 1:53, 16:9, 1280×720).** Briefing do Dilson: o prompt do vídeo de referência "exatamente igual", trocando o tema por síndrome coronariana aguda para leigos; ~2 min pelo saldo; a Iris britânica. Arquivo final `out/sca/por-dentro-sca.mp4`.
  - Scripts: `runway/ep-sca.mjs` (vozes, imagens, falas no Veo 3.1 Fast, apoio no wan3, troca de voz, narração), `runway/graficos_sca.py` (grafismos animados com Pillow + ffmpeg, sem custo) e `runway/montar_sca.sh` (montagem, tratamento, trilha, loudnorm −16 LUFS).
  - Voz: **Maggie** (`eleven_v3`, escolhida pelo Dilson entre Eleanor, Serene, Mabel, Maggie e Paula). As falas saem do Veo com sotaque britânico pedido no prompt e são convertidas para a Maggie; as narrações do grafismo são TTS da Maggie.
  - Cenários (Iris sempre de longe, câmera travada): sala dos médicos (h1, h2, h4), corredor (h3), escada de madrugada (h5, h6). Corredor e escada: ela se aproxima da câmera no fim, então a montagem usa só o começo e a fala continua sobre o grafismo.
  - Apoio sem pessoas: `wan3` 832×480, 5 s, 25 créditos cada (ambulância na chuva; entrada da emergência). Trilha ambiente: `eleven_text_to_sound_v2` 30 s em loop, 30 créditos.
  - Falhas: troca de voz da h1 recusada 2× por "content policy" (3 créditos cada) e aceita mandando o vídeo em vez do áudio; narração n5 ("Por Dentro. A 2Doctor series.") falha sempre sem custo, a assinatura ficou só em texto; n4 falhou 1× sem custo.
  - Sincronia: cada trecho com `-shortest`, desvio acumulado ≤ 0,03 s.
  - Afirmações usadas: I1, I2 ("within minutes"), I3, I4, I5, EM, I6, I8 e uma nova, acesso pelo punho no cateterismo (conferir na ESC 2023, preferência pela via radial). Todas "parcial" até anotar as páginas.
  - Gasto do explicador: 886 créditos. Saldo: 1.220.
- **Versão 2 do explicador (26/09): animação médica realista no lugar do grafismo.** Pedido do Dilson ("tem que ter realismo"). **Muda a regra da série**: o mecanismo agora é vídeo gerado por IA, conferido quadro a quadro aqui e com revisão médica obrigatória antes de publicar. Os textos continuam por cima (`rotulos()` em `graficos_sca.py`).
  - Modelo: `wan3` texto para vídeo, 1280:720, sem áudio, **10 créditos por segundo** (o preço de 5/s é só em 480p). Veo 3.1 Fast barrou o coração na moderação e **cobrou 40 créditos**.
  - Planos: m1 coronárias (4 s), m2a placa rachando (6 s), m2b coágulo fechando a artéria (6 s), m3 músculo escurecendo (8 s), m4 e m4b corpo translúcido com pontos de dor (8 + 6 s), m6a monitor de ECG (4 s), m6b fio-guia, balão e stent (6 s).
  - Moderação do wan3: m3a barrado na entrada (**cobrou 60**), m3b barrado na saída (0); refeito como m3 com descrição neutra ("the light in that area is slowly fading"). No fim do m3 o coração inteiro acinzenta (errado: só a região da artéria bloqueada sofre), então a montagem usa só os 6 s iniciais em câmera lenta 2x.
  - Revisão quadro a quadro: placa, coágulo, stent e ECG coerentes; sem texto legível.
  - Gasto desta versão: 580 créditos (100 perdidos em moderação). Saldo: 640.
- **Versão 3 (26/09, sem custo):** o Dilson achou a Iris com cara de IA no corredor (h3) e na escada da ambulância (h5). Ela sai de cena nesses dois trechos: h3 vira narração sobre as coronárias em câmera lenta; h5 vira narração sobre a ambulância na chuva + cartão "Call an ambulance". A Iris fica na tela só na sala dos médicos (h1, h2, h4) e no encerramento (h6), como na referência (metade do tempo sem a apresentadora).

## Modelos 3D próprios (`../models3d/`)
Tudo procedural, com código nosso. Visual de documentário no palco comum (`stage.js`, `look:'doc'`): luz quente de lado, contraluz azul, vinheta, grão por quadro, foco raso (`dof` + `stage.setFocus`), oclusão de ambiente (`ao`) e texturas de tecido (`tissueMaterial`). Cada cena exporta `stageOptions`.
- Pulmões: `build_lungs.py` (Kitaoka 1999 + lei de Murray; cerca de 3.300 ramos, 13 gerações) → `scene-lungs`.
- Brônquio (Ep. 1): `bronchus.js` → `scene-bronchus` (12 s: normal → crise com eosinófilos, contração, edema, muco e dobras → reabre). Câmera se aproxima no clímax.
- Ácino (DPOC, futuro): `acinus.js` → `scene-acinus` (12 s: normal → enfisema centroacinar com bolhas; `?mode=normal` em loop de 8 s).
- Coração (Ep. 2): `heart.js`, `heart-vessel.js`, `heart-slice.js`, `heart-geo.js` → `scene-heart` (8 s), `scene-coronary` (12 s: placa → ruptura → plaquetas e fibrina → trombo), `scene-necrosis` (10 s: frente de onda do endocárdio ao epicárdio no território da DA), `scene-cath` (12 s: fio-guia, balão, stent, fluxo volta).
- Fígado (Ep. 3): `liver-geom.js`, `liver.js`, `liver-lobule.js`, `liver-vessels.js` → `scene-liver` (8 s), `scene-liver-injury` (10 s), `scene-fibrosis` (12 s: estreladas → septos → nódulos), `scene-portal` (11 s: varizes, baço, ascite), `scene-ultrasound` (7 s).
- Render em CPU (swiftshader), 540x960: 0,9 a 4,5 s por quadro. Em 1080x1920, cerca de 4 vezes mais.
- Pendências de acabamento: baço com cara de rim na cena porta; bolhas do enfisema ainda parecem cacho por fora; cartilagem do brônquio ainda chama atenção demais.
- Simplificações para o revisor médico estão nos relatórios de cada modelo (resumo: anatomia idealizada, cirrose exagerada para ler no celular, esôfago deslocado para aparecer, stent comprime o trombo em vez de removê-lo).
- Rodar: `node models3d/serve.mjs` (porta 3070) e `QS="mode=normal" node models3d/stills.mjs <cena> <t1,t2> <saída> 540 960`. Precisa de `pip install numpy scipy scikit-image trimesh fast-simplification` e `npm install` em `scripts/wmed-app` (three.js).
- Não usar Z-Anatomy (CC BY-SA) nem o CT TotalSegmentator s1397.

## Fontes verificadas (Asma/DPOC; o proxy bloqueou os PDFs, confirmar a página exata)
- GINA 2026 (05/05/2026), GOLD 2026 v1.3 (08/12/2025), PCDT Asma (Portaria Conjunta SAES/SCTIE nº 43, 24/03/2026), PCDT DPOC (nº 29, 27/11/2025), SBPT Asma 2020, StatPearls NBK551579, bulas Symbicort/Spiolto/Anoro.
- Mudanças que importam: o GINA 2026 trocou "dose máxima" do alívio por um aviso para reavaliar; a budesonida-formoterol 12/400 do SUS não serve para alívio; o acesso do SUS a LABA+LAMA/tripla na DPOC tem critérios (conferir na Portaria 29/2025).
- Sem fonte ainda: anatomia das vias aéreas e histologia da parede brônquica.

## Doses e interações
- Não há validador. `wmed-app/shared/interactions.mjs` é um rascunho escrito com IA: sem referência por regra e sem inalatórios (propranolol com salbutamol não gera alerta).
- Proposta: tabela de doses curada, cada linha com a bula Anvisa, a diretriz e o revisor; a IA só cita linhas aprovadas.
- Interações: licenciar. Candidatos: DrugBank, Micromedex, Lexidrug, Memed. Fontes não comerciais que não podem entrar: DDInter, DrugBank acadêmico, ATC/DDD da OMS e o FTN 2010.

## Ep. 2 no formato de questão (25/09/2026, escolha do Dilson)
- Questão 10 do Revalida 2024/1 (INEP), gabarito definitivo D: dor torácica, dispneia e confusão na UBS com PA 190×120 → monitorar, AAS 300 mg e encaminhar para a urgência. Página reescrita: "Dor no peito: questão de prova", 12 planos, 1:32.
- Decisão do Dilson (25/09): a questão é só **inspiração**. O caso e as alternativas do vídeo são escritos por nós, em inglês, sem copiar o texto da prova (a licença CC BY-ND do gov.br proíbe traduzir ou adaptar o texto original). Assinatura: "Case inspired by Revalida 2024/1 (INEP)".
- Narração do Ep. 2 em inglês (voz natural, "sem parecer IA"); a página mostra o inglês e, abaixo, o português para revisão.
- Ressalva que o episódio acrescenta: dor torácica com PA muito alta também pode ser dissecção de aorta; se houver suspeita, o AAS espera a imagem (afirmação DA2, localizar a frase exata na diretriz ESC 2024 de aorta).
- Buscas no Revalida 2023/1 a 2025/1: a Q46 de 2024/2 (dor precordial com ECG seriado) foi anulada; a Q76 de 2023/2 (TV após angioplastia, gabarito A) ficou como reserva.
- Todas as afirmações do Ep. 2 estão como "parcial": DOIs conferidos em 25/09, falta ler as seções e anotar as páginas.

## Esboço antigo do Ep. 2 · Infarto ("cada minuto conta"), substituído
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
- Leitura da 1ª rodada: nenhuma parece ter 40 e poucos anos (todas aparentam 25 a 30); maquiagem marcada, não mínima; luz de fim de tarde, não noite. iris-02 tem bindi (marca cultural, contra "traços sem país"). iris-01 e 02 têm relógio dourado; iris-01 mostra letras soltas numa fachada. A mais próxima do briefing é iris-04 (trilhos, relógio de aço, luz quente e azul). Reprovada pelo Dilson.
- 2ª rodada (`gerar r2`, saída `out/ref/r2/`): prompt com idade explícita (42, linhas finas, fios grisalhos), sem maquiagem, brincos, esmalte ou marcas na testa, noite de céu escuro, relógio de aço, "no text anywhere". Mesmas seeds. 8 créditos por imagem (4968 → 4936), 29 a 42 s por imagem.
- Leitura da 2ª rodada: só r2/iris-03 parece ter 40 e poucos, com noite de verdade, relógio de aço e trilhos. As outras continuam jovens e maquiadas; "after a long shift" trouxe estetoscópio (01, 02) e "no forehead markings" não impediu o bindi (04, que ainda ganhou piercing no nariz). O gen4_image obedece pouco a negativas, e citar o objeto parece até puxá-lo. Reprovada pelo Dilson.
- Outros modelos (`modelo gpt_image_2|gemini_image3_pro`), prompt r2 igual, 4 imagens numa chamada, **sem seed** (refazer só com o arquivo e o id da tarefa, guardados em `iris-log.json`):
  - `gpt_image_2`, qualidade média, 1088:1920: 20 créditos (4936 → 4916), 43 s. Tarefa a83d64a1-5993-449a-82aa-0e50711daf2b. Saída `out/ref/gpt_image_2/`.
  - `gemini_image3_pro`, 1536:2752 (2K): 80 créditos (4916 → 4836), 93 s. Tarefa b631b74d-23bf-45c1-bd62-206a7d5eb02f. Saída `out/ref/gemini_image3_pro/`.
- Leitura: os dois acertaram o que o gen4_image errou (idade de 40 e poucos, rosto sem maquiagem, noite, relógio de aço, trilhos). gpt_image_2: tom de cinema escuro, porto com mastros; suéter saiu azul-marinho escuro, não verde-petróleo; a 04 ganhou estetoscópio. gemini_image3_pro: parece foto real, suéter no verde-petróleo certo; cabelo abaixo do ombro; a 03 é de fim de tarde; vitrines com letreiros borrados (conferir se nada fica legível no vídeo).
- Saldo depois dos testes de rosto: 4.836 créditos (164 gastos: 32 + 32 + 20 + 80).
- **Rosto aprovado pelo Dilson (25/09/2026): `gpt_image_2/iris-03.png`** (tarefa a83d64a1-5993-449a-82aa-0e50711daf2b, 3ª saída). Cópia em `out/ref/iris-aprovada.png`. Sem seed: esta imagem é a referência de todas as cenas; não apagar. Guardar uma cópia fora do Mac (o `out/` não vai para o Git).
- Ajustes pendentes para o pacote de referência: suéter no verde-petróleo da marca (`#265B5A`; na aprovada saiu azul-marinho escuro). Antes de publicar, checagem humana e busca reversa de imagem para confirmar que não lembra uma pessoa real.
- **Pacote de referências (25/09/2026)**: `node gerar-ref.mjs pacote`. `gpt_image_2` médio, 1088:1920, aprovada como referência (`uploads.createEphemeral`, tag `@Iris`), 6 planos × 2 variações. 10 créditos por plano, 60 no total (4836 → 4776), 39 a 48 s por plano. Saída `out/ref/pacote/` e `pacote-log.json` (prompts e ids das tarefas).
- Leitura: rosto, idade, cabelo e relógio iguais nas 12; suéter corrigido para verde-petróleo. p2 (três-quartos) saiu quase de frente: refazer se precisar do ângulo. p4 (jaleco) tem placas borradas no corredor; p5-b tem um quadro com letras borradas na parede. p1, p3-b, p5-a e p6 prontas para uso.
- Saldo: 4.776 créditos (224 gastos em referências).
- **Fase 1 do Ep. 2 (25/09/2026)**, script `runway/fase1-voz-avatar.mjs`, saída `out/fase1/`:
  - Voz em inglês (pedido do Dilson: natural, sem parecer IA). `eleven_v3`, `languageCode: en`, presets Rachel, Eleanor, Lara e Claudia com a mesma fala (145 caracteres): 3 créditos cada, 12 no total; 11,5 a 13,5 s de áudio. O catálogo do Runway não descreve as vozes. Alternativa não testada: voz desenhada por descrição (`voices.preview` / `voices.create` com `from: text`), preço não publicado.
  - Avatar falante: `avatars.create` com p5-cafe-a (grátis, cerca de 40 s de processamento) + `avatarVideos.create` (`gwm1_avatars`, áudio da Rachel, 6,7 s): **2 créditos**. Saída **1088×704, horizontal, 24 fps**: não dá 9:16 nativo (recorte vertical ficaria com 396×704). A boca acompanha o áudio, mas o **rosto muda** em parte dos quadros (fica mais fino e o nariz muda); a imagem é recomposta em paisagem.
  - Saldo depois da fase 1: 4.760 créditos (16 gastos).
- **Teste cinematográfico (25/09)**, `runway/teste-cinema.mjs`, saída `out/cinema/`. Motivo: o Dilson achou o avatar com cara de IA.
  - Voz escolhida: **Lara** (`eleven_v3`, en). Fala do café: 2 créditos.
  - A) `seedance2_5` com a Iris como referência e a voz da Lara como áudio de referência: **bloqueado pela moderação do fornecedor** (`INPUT_PREPROCESSING.SAFETY.THIRD_PARTY`, provável rosto realista), 0 crédito. Também não aceita áudio de referência junto com quadro-chave (`position: first`).
  - B) `veo3.1_fast`, primeiro quadro p5-cafe-a, 1080:1920, 8 s, áudio gerado pelo modelo: **120 créditos**, 131 s. Saída vertical nativa, câmera se aproxima, rosto estável e expressão natural. A voz é do Veo (não é a Lara): risco de mudar de plano para plano.
  - Saldo: 4.638 créditos.
- **Estilo aprovado: "de longe" (25/09)**, `runway/teste-longe.mjs`, saída `out/longe/`. O Dilson achou o close para a lente com cara de IA e pediu câmera mais longe.
  - 2 versões do café, cada uma com 2 imagens iniciais (`gpt_image_2` médio com `@Iris`, 10 créditos por versão) + Veo 3.1 Fast 8 s vertical (120 créditos) + troca da voz do Veo pela Lara (`eleven_multilingual_sts_v2`, `removeBackgroundNoise`, 3 créditos).
  - **Escolhida: v1, pela janela** (imagem v1-a; câmera do lado de fora, através do vidro com chuva, ela conversa com alguém à frente, não com a câmera). Cópia em `out/longe/cafe-aprovado.mp4`. v2 (entrevista, olhar fora da lente) ficou de reserva.
  - A troca de voz remove o ambiente do café: repor chuva e burburinho na mixagem.
  - Regra para os próximos planos da Iris: plano aberto ou médio-aberto, olhar fora da lente, algo em primeiro plano, luz irregular, câmera quase parada.
  - Saldo: 4.372 créditos.
