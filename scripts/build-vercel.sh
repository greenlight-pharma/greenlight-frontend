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

echo "==> Construindo o painel em React"
npm ci --prefix medico-app
npm run build --prefix medico-app

# O nome do diretório evita colisão de rota: já existem painel.html e
# medico.html na raiz, e /painel ou /medico ficariam ambíguos.
echo "==> Publicando o painel em /painel-medico"
mkdir -p "$OUT/painel-medico"
cp -R medico-app/dist/* "$OUT/painel-medico"/

echo "==> Conteúdo publicado:"
ls "$OUT" | head -30
echo "    /painel-medico ->"
ls "$OUT/painel-medico"
