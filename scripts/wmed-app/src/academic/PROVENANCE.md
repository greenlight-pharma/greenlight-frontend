# Acervo Vytal reutilizado no WMed

Fonte: greenlight-pharma/vytal-web, commit 887913594249c7beb6bc0545e199f63ffc9e2103. Visualizadores Anatomy/Histology/Radiology, Scene, cores/seleção/volumes e catálogo de scores preservados. Adaptação de navegação, base de assets e dimensões WMed. Dados CID e medicamentos copiados sem alteração de conteúdo. Malhas, imagens, atribuições e volumes servidos do acervo público original por rewrite /wmed/acervo. Nenhuma captura privada é publicada. Banco de imagens usa exclusivamente a rota autenticada de imagens aprovadas.

Detector PII e lista de nomes em shared/pii.mjs e shared/nomes.mjs: compilação TypeScript→ESM sem alteração de regras, de apps/api/src/common/pii no origin/main da API consultado em23/09/2026. Não equivale a garantia de anonimização.

Expansão WMed 23/09/2026: superfícies da radiologia extraídas das segmentações dos mesmos volumes públicos, via tools/radiology/surfaces.py. Metadados, origem, licença CC BY 4.0 e hashes em public/radiology/*.json; não são malhas de outro paciente registradas ao exame. Curso ECG adaptado de lib/trilhaEcg.ts e lib/ecgOnda.ts do app Vytal Acadêmico local, preservando dez etapas e questionários; as interações nativas foram adaptadas para traçados e diagramas web.
