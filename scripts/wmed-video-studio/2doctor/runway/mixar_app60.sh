#!/usr/bin/env bash
# Mixa trilha + efeitos no vídeo "Meet 2Doctor" (60 s). Tempos casados com topics/2doctor-app60.js:
# transições das cenas (4, 11, 29, 42, 51, 56 s), cliques do cursor no caso e no chat, pontuação e PDF salvo.
set -euo pipefail
cd "$(dirname "$0")/../.."
A=2doctor/out/app60
V=out/2doctor-app60-mudo.mp4
OUT=out/2doctor-app60.mp4
EF=()   # "arquivo:segundos:volume"
EF+=("$A/abertura.mp3:0.0:0.9")
for s in 3.8 10.8 28.8 41.8 50.8 55.8; do EF+=("$A/whoosh.mp3:$s:0.55"); done
for s in 11.55 16.25 18.7 19.35 38.1 40.1 40.9; do EF+=("$A/clique.mp3:$s:0.7"); done
for s in 27.2 38.9 57.2; do EF+=("$A/sinal.mp3:$s:0.5"); done
IN=(-i "$V" -stream_loop 1 -i "$A/trilha.mp3"); FC="[1:a]atrim=0:60,volume=0.55,afade=t=in:d=1.5,afade=t=out:st=56.5:d=3.5[m];"; MIX="[m]"; i=2
for e in "${EF[@]}"; do IFS=: read -r f s v <<<"$e"; IN+=(-i "$f"); ms=$(printf '%.0f' "$(echo "$s*1000" | bc)"); FC+="[$i:a]volume=$v,adelay=$ms|$ms[e$i];"; MIX+="[e$i]"; i=$((i+1)); done
FC+="${MIX}amix=inputs=$((i-1)):duration=first:normalize=0,loudnorm=I=-16:TP=-1.5,aresample=48000[a]"
ffmpeg -v error -y "${IN[@]}" -filter_complex "$FC" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t 60 "$OUT"
echo "ok $OUT"
