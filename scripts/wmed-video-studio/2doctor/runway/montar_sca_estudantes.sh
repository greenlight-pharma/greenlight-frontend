#!/usr/bin/env bash
# Versão para estudantes do explicador de SCA (~3 min, 1280x720, 24 fps). Sem custo de crédito.
# Pré-requisito: ./montar_sca.sh (gera seg/s02, s04, s05, s06, s07) e node render-app.mjs (app-motion.mp4).
# Parte 1: a Iris explica o que é a SCA (sala + animações realistas).
# Parte 2: só a voz dela (narrações e0..e6) sobre a animação do app 2Doctor.
set -euo pipefail
cd "$(dirname "$0")/../out/sca"
mkdir -p seg-est
ENC=(-c:v libx264 -crf 18 -preset medium -c:a aac -ar 48000 -ac 2 -shortest)

ffmpeg -v error -y -i g-titulo-est.mp4 "${ENC[@]}" seg-est/p02.mp4
cp seg/s02.mp4 seg-est/p01.mp4          # Iris abre, com o nome
cp seg/s04.mp4 seg-est/p03.mp4          # "acute coronary syndrome", com o verbete
cp seg/s05.mp4 seg-est/p04.mp4          # coronárias (fala h3 como narração)
cp seg/s06.mp4 seg-est/p05.mp4          # placa e coágulo
cp seg/s07.mp4 seg-est/p06.mp4          # time is muscle

# App 2Doctor + narração posicionada no início de cada cartão (tempos de app-motion/conteudo.js:
# busca 0 s; cartões em 8,7 · 28,3 · 55,7 · 90,6 · 117,4 s; fontes em 131,6 s).
ffmpeg -v error -y -i app-motion.mp4 -i e0.mp3 -i e1.mp3 -i e2.mp3 -i e3.mp3 -i e4.mp3 -i e5.mp3 -i e6.mp3 -filter_complex \
  "[0:v]fps=24,format=yuv420p[v];\
   [1:a]adelay=400|400[a0];[2:a]adelay=9000|9000[a1];[3:a]adelay=28600|28600[a2];[4:a]adelay=56000|56000[a3];\
   [5:a]adelay=90900|90900[a4];[6:a]adelay=117700|117700[a5];[7:a]adelay=131900|131900[a6];\
   [a0][a1][a2][a3][a4][a5][a6]amix=inputs=7:duration=longest:normalize=0,apad[a]" \
  -map "[v]" -map "[a]" "${ENC[@]}" seg-est/p07.mp4
ffmpeg -v error -y -i g-final.mp4 "${ENC[@]}" seg-est/p08.mp4

(cd seg-est && ls p*.mp4 | sort | sed "s/^/file '/; s/$/'/") > seg-est/lista.txt
ffmpeg -v error -y -f concat -safe 0 -i seg-est/lista.txt -c copy seg-est/corte.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 seg-est/corte.mp4)
ffmpeg -v error -y -i seg-est/corte.mp4 -stream_loop -1 -i trilha.mp3 -filter_complex \
  "[1:a]volume=0.12,afade=t=in:d=2,afade=t=out:st=$(echo "$DUR-3" | bc):d=3[m];[0:a][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t "$DUR" por-dentro-sca-estudantes.mp4
echo "ok por-dentro-sca-estudantes.mp4 ($DUR s)"
