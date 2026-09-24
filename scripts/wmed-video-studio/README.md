# Estúdio de resumos ENAMED (WMed)

Gera vídeos de até 90 s, em aquarela e nanquim, a partir de resumos de temas cobrados no ENAMED.
A abordagem se inspira no [PDoomVideo](https://github.com/JohnHeibel/PDoomVideo): cada quadro é pintado com
[p5.brush](https://github.com/acamposuribe/p5.brush) em Chrome headless e o MP4 é montado com ffmpeg. O código daqui
foi escrito do zero para este projeto; nada foi copiado de lá.

Os vídeos prontos ficam em `wmed-videos/resumos-enamed/` e são publicados em `/wmed-videos/resumos-enamed/`.

## Como renderizar

```bash
cd scripts/wmed-video-studio
npm install
node render.mjs --topic=insuficiencia-cardiaca --sheet=3,10,30,46,62,75   # folha de contato para conferir (out/<tema>/sheet.jpg)
node render.mjs --topic=insuficiencia-cardiaca --frames --workers=4       # pinta todos os quadros (retomável)
node render.mjs --topic=insuficiencia-cardiaca --encode --poster=4        # MP4 + pôster em wmed-videos/resumos-enamed/
```

- Chrome: por padrão usa o Chromium do Playwright (`/opt/pw-browsers/chromium`). Para outro: `CHROME=/caminho` ou `--chrome=`.
- ffmpeg vem do pacote `ffmpeg-static`. Para incluir narração ou trilha: `--encode --audio=voz.mp3`.
- Para abrir o estúdio no navegador e percorrer o vídeo com a barra: sirva esta pasta (`npx serve .`) e abra
  `studio.html?topic=insuficiencia-cardiaca`.
- Sem GPU (servidor de 4 núcleos, um Chrome por aba), sai cerca de 45 quadros por minuto: um vídeo de 90 s
  (2.160 quadros a 24 fps) leva uns 45 min. Com GPU é bem mais rápido.

## Dois visuais

| Visual | Página | Motor | Exemplo |
|---|---|---|---|
| Aquarela (padrão) | `studio.html` | p5.brush + WebGL, 24 fps, ~45 quadros/min sem GPU | `topics/insuficiencia-cardiaca.js` |
| Tech (visual do app WMed) | `studio-tech.html` | Canvas 2D puro, 30 fps, ~160 quadros/min | `topics/insuficiencia-cardiaca-tech.js` |

O visual tech usa os tokens do app (`scripts/wmed-app/src/*.css`), a fonte Plus Jakarta Sans do app, o símbolo da
marca (`tech/brand.js`, gerado de `scripts/wmed-app/public/brand/logo.svg`) e JetBrains Mono nos rótulos. Peças em
`tech/engine.js`: `panel`, `text` (com revelação por linha), `pill`, `eyebrow`, `header`, `icon`/`badge` (ícones de
linha), `strokePath`, `logo`. Renderize com `--studio=tech`:

```bash
node render.mjs --studio=tech --topic=insuficiencia-cardiaca-tech --sheet=4,10,40
node render.mjs --studio=tech --topic=insuficiencia-cardiaca-tech --frames --workers=4
node render.mjs --studio=tech --topic=insuficiencia-cardiaca-tech --encode --poster=4.5
```

## Como criar um tema novo

1. Copie `topics/insuficiencia-cardiaca.js` para `topics/<slug>.js`. O slug usa só letras minúsculas, números e hífen.
2. Troque o conteúdo das cenas. Cada cena é `fn(t, lt, dur)`: `t` é o tempo do vídeo, `lt` o tempo desde o início da cena.
   Ela pinta o quadro inteiro, fundo incluso.
3. Registre com `video({ slug, title, dur, sections, scenes })`. Cada seção nova ganha uma transição em pincelada
   e um trecho na barra de progresso.
4. Confira com `--sheet` em vários tempos, principalmente no início e no fim de cada cena. Depois renderize.
5. Escreva `<slug>-roteiro.txt` com a narração por bloco de tempo e adicione o vídeo em `wmed-videos/resumos-enamed/index.html`.

Estrutura sugerida para 90 s: abertura (6 s) → classificação (15 s) → diagnóstico (14 s) → tratamento (22 s) →
escala/estadiamento (10 s) → pegadinhas (15 s) → revisão relâmpago (8 s).

## Regras importantes

- **Cada quadro é uma função pura do tempo.** Os quadros são pintados em paralelo e fora de ordem. Não use
  `Math.random()` nem guarde estado entre quadros: use `hash(i)` para aleatoriedade estável e `jit(a)` para o tremor
  do traço (10×/s, que dá o efeito de desenho animado à mão).
- **Aquarela (`fill`) é cara sem GPU** (~2 s por forma). Por isso, fora dos sprites, `paint()` converte `fill` em cor
  chapada (`wash`). As manchas de aquarela de verdade são sprites pintados uma vez (`defSprite`) e aplicados com
  `stain()`. Ficam guardados em `out/<tema>/sprites` e só são refeitos quando a definição muda.
- Texto: `txt('texto com *destaque*', x, y, { size, font: 'title' | 'body', maxW, pop, alpha, type })`. O trecho entre
  `*` recebe a cor `hl`. Deixe a faixa inferior (y > 1000) livre para a barra de progresso.

## Peças disponíveis

| Arquivo | O que tem |
|---|---|
| `src/core.js` | paleta `PAL`, easings, `kf` (keyframes), câmera, `paint`, `inkLine`, `arrow`, `card`, texto, sprites |
| `src/cast.js` | `doc()` (guia da WMed de jaleco), `heart()` (coração-personagem), `face()` e `emote()` |
| `src/kit.js` | `bg`, `header`, `chip`, `stamp`, `checkmark`, `crossmark`, `warnSign`, `ecg`, ícones (`iconSteth`, `iconEcho`, `iconTube`, `iconDrop`, `iconArtery`) |
| `src/timeline.js` | registro do vídeo, selo WMed, barra de progresso por seção e transições em pincelada |
| `render.mjs` | folha de contato, quadros, MP4 e pôster |

## Conteúdo

Os vídeos são material educacional esquemático. Todo tema novo deve ser revisado por um médico antes de ir ao ar,
com as referências listadas na página do vídeo.
