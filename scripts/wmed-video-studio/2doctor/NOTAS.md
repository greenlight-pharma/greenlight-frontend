# 2Doctor · estado do trabalho (25/09/2026)

## Produto e identidade
- 2Doctor (2doctor.ai): app internacional de apoio a médicos e estudantes. Começa no Brasil.
- Cores tiradas do app: verde-petróleo `#265B5A`, azul-tinta `#1A2C3E`, fundo `#F5F8F7`, cinza `#64737B`, branco. Monograma "2D" em `2d-mark.png` (recorte de print; pedir SVG oficial).

## Duas frentes de vídeo
1. **"Explicar em vídeo" dentro do app** (protótipo "Asma e DPOC: como diferenciar?", versões estudante e médico).
   Revisão em `revisao-asma-dpoc.src.html`: roteiro, storyboard, afirmações com status de fonte, doses, fluxo no app e plano de medição. Aguarda aprovação.
2. **Série "Por Dentro" para Instagram e X**, no estilo de documentário da Netflix, feita por nós (não pelos usuários).
   Rascunho em `por-dentro.src.html`, com o Ep. 1 Asma pronto. A página estava sendo reestruturada para três episódios e o render dos planos está quebrado: o elemento `#shots` saiu, falta `#episodes`.
   - Decisão do usuário: médica fictícia e **cenário internacional** (não São Paulo), porque a empresa é internacional. Renomear a personagem (hoje "Dra. Helena Duarte") para um nome internacional e trocar os cenários (cidade genérica/internacional, hospital, café).
   - Referência de estilo: piloto "The Last Invention" (apresentadora de IA consistente, fala sincronizada, noite com luz quente e azul, tipografia serifada, capítulos, cena de apoio com humor).
   - Ep. 2 Infarto e Ep. 3 Cirrose: roteiros a escrever (esboço abaixo). A verificação das afirmações foi disparada, mas não concluída.
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
Configurar a chave de API (portal `dev.runwayml.com`) e o MCP/API do Runway. No Mac dá para usar o Chrome logado pela extensão.
