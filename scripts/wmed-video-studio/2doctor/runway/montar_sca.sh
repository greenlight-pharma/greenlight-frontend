#!/usr/bin/env bash
# Montagem do explicador de síndrome coronariana aguda (~1:53, 1280x720, 24 fps). Sem custo de crédito.
# Entra: falas da Iris (h1..h6-final.mp4), apoio (a1, a2), grafismos (g*.mp4), narrações (n1..n4.mp3),
# cartões (ov-*-720.png) e trilha.mp3, todos em ../out/sca. Sai: ../out/sca/por-dentro-sca.mp4
set -euo pipefail
cd "$(dirname "$0")/../out/sca"
mkdir -p seg

# Tratamento de imagem aprovado (NOTAS.md) só nas imagens filmadas; grafismo já tem grão próprio.
G="scale=1280:720:flags=bicubic,scale=iw*0.5:-2:flags=bicubic,scale=1280:720:flags=bicubic,eq=saturation=0.78:contrast=0.93:brightness=-0.02:gamma=0.97,curves=r='0/0.03 0.5/0.52 1/0.95':g='0/0.04 0.5/0.5 1/0.93':b='0/0.07 0.5/0.49 1/0.88',noise=alls=9:allf=t+u,vignette=PI/5,fps=24,format=yuv420p"
ENC=(-c:v libx264 -crf 18 -preset medium -c:a aac -ar 48000 -ac 2 -shortest)   # áudio nunca passa do vídeo: evita perder a sincronia na concatenação

filmado() {  # filmado <entrada> <saída> [duração]
  local dur=${3:-}
  ffmpeg -v error -y -i "$1" ${dur:+-t "$dur"} -vf "$G" "${ENC[@]}" "seg/$2.mp4"
}
com_cartao() {  # com_cartao <entrada> <png> <entra_s> <sai_s> <saída>
  ffmpeg -v error -y -i "$1" -loop 1 -t 8 -i "$2" -filter_complex \
    "[0:v]$G[b];[1:v]format=rgba,fade=t=in:st=$3:d=0.5:alpha=1,fade=t=out:st=$4:d=0.5:alpha=1[o];[b][o]overlay=shortest=1[v]" \
    -map "[v]" -map 0:a "${ENC[@]}" "seg/$5.mp4"
}
fala_sobre_grafico() {  # fala_sobre_grafico <fala.mp4> <segundos de imagem da Iris> <grafico.mp4> <saída>
  ffmpeg -v error -y -i "$1" -i "$3" -filter_complex \
    "[0:v]trim=0:$2,setpts=PTS-STARTPTS,$G[a];[1:v]fps=24,format=yuv420p,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[v]" \
    -map "[v]" -map 0:a -t 8 "${ENC[@]}" "seg/$4.mp4"
}
grafico_narrado() {  # grafico_narrado <grafico.mp4> <narração.mp3> <saída>
  ffmpeg -v error -y -i "$1" -i "$2" -filter_complex "[1:a]adelay=300|300,apad[a]" \
    -map 0:v -map "[a]" -shortest "${ENC[@]}" "seg/$3.mp4"
}

anim_narrada() {  # anim_narrada <saída> <narração.mp3|-> <duração> "<clip1> [clip2...]" "<png:entra:sai> ..."
  local saida=$1 narr=$2 dur=$3 clips=($4) rot=($5) ins=() fc="" i=0 n=0
  for c in "${clips[@]}"; do ins+=(-i "$c"); fc+="[$i:v]$G,setpts=PTS-STARTPTS[c$i];"; i=$((i+1)); done
  n=$i; for ((k=0;k<n;k++)); do fc+="[c$k]"; done; fc+="concat=n=$n:v=1:a=0[b0];"
  local j=0
  for r in ${rot[@]+"${rot[@]}"}; do IFS=: read -r png e s <<<"$r"
    ins+=(-loop 1 -t "$dur" -i "$png")
    fc+="[$i:v]format=rgba,fade=t=in:st=$e:d=0.5:alpha=1,fade=t=out:st=$s:d=0.5:alpha=1[o$j];[b$j][o$j]overlay[b$((j+1))];"
    i=$((i+1)); j=$((j+1)); done
  if [ "$narr" = "-" ]; then ins+=(-f lavfi -t "$dur" -i anullsrc=r=48000:cl=stereo); fc+="[$i:a]anull[a]"
  else ins+=(-i "$narr"); fc+="[$i:a]adelay=150|150,apad[a]"; fi
  ffmpeg -v error -y "${ins[@]}" -filter_complex "$fc" -map "[b$j]" -map "[a]" -t "$dur" "${ENC[@]}" "seg/$saida.mp4"
}

filmado a1.mp4 s01
com_cartao h1-final.mp4 ov-nome-720.png 0.6 4.0 s02
ffmpeg -v error -y -i g-titulo.mp4 "${ENC[@]}" seg/s03.mp4
com_cartao h2-final.mp4 ov-termo-720.png 3.2 7.2 s04
# 26/09: corredor e escada da ambulância tinham "cara de IA" (Dilson); a Iris sai de cena
# nesses dois trechos e a fala dela vira narração sobre animação/apoio, como na referência.
ffmpeg -v error -y -i m1-wan.mp4 -vf "setpts=2*PTS,minterpolate=fps=24:mi_mode=blend" -an seg/m1-lento.mp4
anim_narrada s05 h3-voz.mp3 8 "seg/m1-lento.mp4" "r-coronarias.png:0.4:7.2"
anim_narrada s06 n1.mp3 11 "m2a-wan.mp4 m2b-wan.mp4" "r-placa.png:1.5:5.4 r-coagulo.png:6.3:10.5"
# m3: no fim o coração inteiro acinzenta (errado: só a região da artéria bloqueada sofre);
# usa só os 6 s iniciais, com o escurecimento concentrado embaixo, em câmera lenta 2x.
ffmpeg -v error -y -i m3-wan.mp4 -vf "trim=0:6,setpts=2*(PTS-STARTPTS),minterpolate=fps=24:mi_mode=blend" -an seg/m3-lento.mp4
anim_narrada s07 n2.mp3 12 "seg/m3-lento.mp4" "r-musculo.png:0.4:7.6 r-tempo.png:8.8:11.5"
filmado h4-final.mp4 s08
anim_narrada s09 n3.mp3 14 "m4-wan.mp4 m4b-wan.mp4" "r-sintomas.png:0.4:7.4 r-sintomas2.png:8.2:13.5"
ffmpeg -v error -y -ss 2.2 -t 3 -i a1.mp4 -an seg/a1-corte.mp4
anim_narrada s10 h5-voz.mp3 8 "seg/a1-corte.mp4 g5.mp4" ""
# ambulância chegando + monitor de ECG + balão e stent, com a narração n4 atravessando tudo
anim_narrada s11 n4.mp3 15 "a2.mp4 m6a-wan.mp4 m6b-wan.mp4" "r-ecg.png:5.3:8.6 r-stent.png:9.6:14.5"
filmado h6-final.mp4 s12
ffmpeg -v error -y -i g-final.mp4 "${ENC[@]}" seg/s13.mp4

(cd seg && ls s[0-9]*.mp4 | sort | sed "s/^/file '/; s/$/'/") > seg/lista.txt
ffmpeg -v error -y -f concat -safe 0 -i seg/lista.txt -c copy seg/corte.mp4

# Trilha em loop, baixa, com fade no fim; fala e narração por cima.
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 seg/corte.mp4)
ffmpeg -v error -y -i seg/corte.mp4 -stream_loop -1 -i trilha.mp3 -filter_complex \
  "[1:a]volume=0.16,afade=t=in:d=2,afade=t=out:st=$(echo "$DUR-3" | bc):d=3[m];[0:a][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t "$DUR" por-dentro-sca.mp4
echo "ok por-dentro-sca.mp4 ($DUR s)"
