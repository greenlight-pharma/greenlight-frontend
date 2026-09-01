#!/usr/bin/env bash
# Build do deploy na Vercel.
#
# O site sempre foi servido como estático puro a partir da raiz do repo
# (sem vercel.json, sem build). Este script PRESERVA exatamente esse
# comportamento e só acrescenta uma coisa: o painel novo em /painel-medico.
#
# Regra que não pode ser quebrada: /medico.html continua sendo o arquivo
# antigo, intocado, atendendo os médicos que já usam. O painel em React
# sobe ao lado, para validação, e só vira o padrão quando alguém decidir.
set -euo pipefail

OUT=".vercel-out"   # começa com ponto de propósito: o `cp ./*` abaixo o ignora

rm -rf "$OUT"
mkdir -p "$OUT"

echo "==> Copiando o site estático (raiz do repo)"
# `./*` não expande dotfiles, então .git/.claude/.gitignore ficam de fora
# naturalmente. Só precisamos remover depois o que é código-fonte.
cp -R ./* "$OUT"/

echo "==> Removendo do publicado o que é fonte, não site"
rm -rf "$OUT/medico-app" "$OUT/docs" "$OUT/scripts" "$OUT/vercel.json"

echo "==> Instalando dependências dos painéis"
npm ci --prefix medico-app

# Dois builds, um por painel, cada um autocontido na sua pasta. Os nomes
# evitam colisão de rota: já existem painel.html, medico.html e admin.html
# na raiz, então /painel, /medico e /admin ficariam ambíguos.
echo "==> Construindo o painel do médico"
( cd medico-app && VITE_BASE=/painel-medico/ VITE_ENTRY=./index.html \
    VITE_OUT_DIR=dist-medico npx vite build )

echo "==> Construindo o painel administrativo"
( cd medico-app && VITE_BASE=/painel-admin/ VITE_ENTRY=./admin.html \
    VITE_OUT_DIR=dist-admin npx vite build )

echo "==> Construindo o painel da UBS"
( cd medico-app && VITE_BASE=/painel-ubs/ VITE_ENTRY=./ubs.html \
    VITE_OUT_DIR=dist-ubs npx vite build )

echo "==> Publicando em /painel-medico, /painel-admin e /painel-ubs"
mkdir -p "$OUT/painel-medico" "$OUT/painel-admin" "$OUT/painel-ubs"
cp -R medico-app/dist-medico/* "$OUT/painel-medico"/
cp -R medico-app/dist-admin/* "$OUT/painel-admin"/
cp -R medico-app/dist-ubs/* "$OUT/painel-ubs"/
# O Vite nomeia a saída pelo arquivo de entrada; a pasta serve index.html.
mv "$OUT/painel-admin/admin.html" "$OUT/painel-admin/index.html"
mv "$OUT/painel-ubs/ubs.html" "$OUT/painel-ubs/index.html"

echo "==> Conteúdo publicado:"
ls "$OUT" | head -30
echo "    /painel-medico ->"
ls "$OUT/painel-medico"
echo "    /painel-admin ->"
ls "$OUT/painel-admin"
echo "    /painel-ubs ->"
ls "$OUT/painel-ubs"
