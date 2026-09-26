#!/usr/bin/env bash
# Hipertensão para estudantes (~3:40, 1280x720, 24 fps), mesmo modelo do vídeo de SCA. Sem custo de crédito.
# Entra (../out/has): falas da Iris na câmera A (h1..h4-final.mp4), animações a1..a5-wan.mp4,
# narrações n1..n4 e e0..e6 (Maggie), app-motion.mp4 (render-app.mjs --pagina=has.html --saida=has),
# rótulos r-*.png, g-titulo-has.mp4, g-final.mp4, ov-nome-720.png e trilha.mp3.
# Linha do tempo e conferência clínica: ../hipertensao/roteiro.md.
set -euo pipefail
cd "$(dirname "$0")/../out/has"
rm -rf seg && mkdir -p seg

G="scale=1280:720:flags=bicubic,scale=iw*0.5:-2:flags=bicubic,scale=1280:720:flags=bicubic,eq=saturation=0.78:contrast=0.93:brightness=-0.02:gamma=0.97,curves=r='0/0.03 0.5/0.52 1/0.95':g='0/0.04 0.5/0.5 1/0.93':b='0/0.07 0.5/0.49 1/0.88',noise=alls=9:allf=t+u,vignette=PI/5,fps=24,format=yuv420p"
ENC=(-c:v libx264 -crf 18 -preset medium -c:a aac -ar 48000 -ac 2 -shortest)

filmado() { ffmpeg -v error -y -i "$1" -vf "$G" "${ENC[@]}" "seg/$2.mp4"; }
com_cartao() {  # com_cartao <entrada> <png> <entra_s> <sai_s> <saída>
  ffmpeg -v error -y -i "$1" -loop 1 -t 8 -i "$2" -filter_complex \
    "[0:v]$G[b];[1:v]format=rgba,fade=t=in:st=$3:d=0.5:alpha=1,fade=t=out:st=$4:d=0.5:alpha=1[o];[b][o]overlay=shortest=1[v]" \
    -map "[v]" -map 0:a "${ENC[@]}" "seg/$5.mp4"
}
lento() {  # lento <entrada> <fator> <saída> [início] [duração]
  ffmpeg -v error -y ${4:+-ss "$4"} ${5:+-t "$5"} -i "$1" -vf "setpts=$2*(PTS-STARTPTS),minterpolate=fps=24:mi_mode=blend" -an "$3"
}
anim_narrada() {  # anim_narrada <saída> <narração.mp3> <duração> "<clip1> [clip2...]" "<png:entra:sai> ..."
  local saida=$1 narr=$2 dur=$3 clips=($4) rot=($5) ins=() fc="" i=0 n=0
  for c in "${clips[@]}"; do ins+=(-i "$c"); fc+="[$i:v]$G,setpts=PTS-STARTPTS[c$i];"; i=$((i+1)); done
  n=$i; for ((k=0;k<n;k++)); do fc+="[c$k]"; done; fc+="concat=n=$n:v=1:a=0[b0];"
  local j=0
  for r in ${rot[@]+"${rot[@]}"}; do IFS=: read -r png e s <<<"$r"
    ins+=(-loop 1 -t "$dur" -i "$png")
    fc+="[$i:v]format=rgba,fade=t=in:st=$e:d=0.5:alpha=1,fade=t=out:st=$s:d=0.5:alpha=1[o$j];[b$j][o$j]overlay[b$((j+1))];"
    i=$((i+1)); j=$((j+1)); done
  ins+=(-i "$narr"); fc+="[$i:a]adelay=250|250,apad[a]"
  ffmpeg -v error -y "${ins[@]}" -filter_complex "$fc" -map "[b$j]" -map "[a]" -t "$dur" "${ENC[@]}" "seg/$saida.mp4"
}

# Parte 1: a Iris (câmera A, entrevista) explica; animações realistas com a narração dela.
com_cartao h1-final.mp4 ov-nome-720.png 0.6 4.0 p01
ffmpeg -v error -y -i g-titulo-has.mp4 "${ENC[@]}" seg/p02.mp4
lento a1-wan.mp4 1.8 seg/a1-lento.mp4
anim_narrada p03 n1.mp3 8.8 "seg/a1-lento.mp4" "r-arteria.png:0.4:8.0"
filmado h2-final.mp4 p04
lento a2-wan.mp4 2.1 seg/a2-lento.mp4
anim_narrada p05 n2.mp3 10.2 "seg/a2-lento.mp4" "r-afericao.png:0.4:9.4"
filmado h3-final.mp4 p06
lento a3-wan.mp4 1.0 seg/a3-c.mp4 0 4.4
lento a4-wan.mp4 1.0 seg/a4-c.mp4 0 4.4
anim_narrada p07 n3.mp3 8.6 "seg/a3-c.mp4 seg/a4-c.mp4" "r-coracao.png:0.3:3.9 r-rim.png:4.6:8.1"
lento a5-wan.mp4 1.6 seg/a5-lento.mp4
anim_narrada p08 n4.mp3 7.4 "seg/a5-lento.mp4" "r-retina.png:0.4:6.8"
filmado h4-final.mp4 p09

# Parte 2: só a voz da Iris (Maggie) sobre o app 2Doctor. Cartões começam em 8,7 s e depois
# a cada tempos.cartoes de ../hipertensao/conteudo.js (26,4 · 24,1 · 31,4 · 29,9 · 26,2); fontes em 146,7 s.
ffmpeg -v error -y -i app-motion.mp4 -i e0.mp3 -i e1.mp3 -i e2.mp3 -i e3.mp3 -i e4.mp3 -i e5.mp3 -i e6.mp3 -filter_complex \
  "[0:v]fps=24,format=yuv420p[v];\
   [1:a]adelay=400|400[a0];[2:a]adelay=9000|9000[a1];[3:a]adelay=35400|35400[a2];[4:a]adelay=59500|59500[a3];\
   [5:a]adelay=90900|90900[a4];[6:a]adelay=120800|120800[a5];[7:a]adelay=147000|147000[a6];\
   [a0][a1][a2][a3][a4][a5][a6]amix=inputs=7:duration=longest:normalize=0,apad[a]" \
  -map "[v]" -map "[a]" "${ENC[@]}" seg/p10.mp4
ffmpeg -v error -y -i g-final.mp4 "${ENC[@]}" seg/p11.mp4

# Junta com o filtro concat (reencoda): cada trecho entra com áudio e imagem alinhados.
# O concat por lista (-c copy) somava as sobras de áudio de cada trecho (até +33 ms) e a
# boca da Iris ficava 130 ms adiantada na última fala (medido em 26/09).
IN=(); FC=""; i=0
for f in $(ls seg/p*.mp4 | sort); do
  IN+=(-i "$f"); d=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$f")
  FC+="[$i:v]setpts=PTS-STARTPTS[v$i];[$i:a]aresample=48000,apad,atrim=0:$d,asetpts=PTS-STARTPTS[a$i];"; i=$((i+1))
done
for ((k=0;k<i;k++)); do FC+="[v$k][a$k]"; done
ffmpeg -v error -y "${IN[@]}" -filter_complex "${FC}concat=n=$i:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
  -c:v libx264 -crf 18 -preset medium -c:a aac -ar 48000 -ac 2 seg/corte.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 seg/corte.mp4)
ffmpeg -v error -y -i seg/corte.mp4 -stream_loop -1 -i trilha.mp3 -filter_complex \
  "[1:a]volume=0.12,afade=t=in:d=2,afade=t=out:st=$(echo "$DUR-3" | bc):d=3[m];[0:a][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t "$DUR" 2doctor-hipertensao-estudantes-full.mp4
# versão leve para celular/X
ffmpeg -v error -y -i 2doctor-hipertensao-estudantes-full.mp4 -c:v libx264 -crf 26 -preset medium -c:a aac -b:a 160k -ar 48000 -movflags +faststart 2doctor-hipertensao-estudantes.mp4
echo "ok 2doctor-hipertensao-estudantes.mp4 ($DUR s)"
