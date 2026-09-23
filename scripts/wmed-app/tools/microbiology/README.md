# Microbiologia 3D — acervo inicial WMed

16 modelos didáticos originais criados por geometria procedural no Blender 4.5.13 LTS. Não há malhas ou imagens de terceiros copiadas. O kit de materiais foi adaptado do pipeline interno de Histologia. As fontes morfológicas e funcionais CDC/NCBI estão em `catalog.py` e na ficha de cada modelo.

## Reproduzir

Na raiz do repositório:

```sh
python3 scripts/wmed-app/tools/microbiology/catalog.py
blender --background --factory-startup --python scripts/wmed-app/tools/microbiology/build.py
npm test --prefix scripts/wmed-app
```

O gerador grava GLBs, texturas auxiliares e manifest em `public/microbiology`; as texturas já estão embutidas nos GLBs, portanto as pastas `*/textures` são intermediárias e não fazem parte da publicação. Os `.blend` editáveis, com imagens empacotadas, ficam em `../../../../outputs/wmed-microbiology-blender` a partir da pasta do app. O manifest registra hashes SHA256, estruturas, imagens, tamanho e triângulos. Scripts Python são as fontes editáveis versionadas.

## Escopo

- Bactérias: E. coli, S. aureus, S. pyogenes e V. cholerae.
- Vírus: SARS-CoV-2, Influenza A, HIV-1 e adenovírus.
- Fungos: Candida, Cryptococcus, Aspergillus (cabeça conidial) e Rhizopus (esporângio).
- Protozoários: Giardia, Toxoplasma, Trypanosoma cruzi e Entamoeba histolytica, com a fase explicitada.

31 GLBs: 16 externos e 15 cortes. Aspergillus mostra arquitetura externa de cultura, não tecido nem corte celular. Cores, contagens não essenciais, densidades, organização molecular e escala relativa são ilustrativas. Sem escala comum entre organismos. Não é atlas exaustivo, material diagnóstico ou reconstrução microscópica. Precisão pedagógica requer revisão editorial especializada; testes de malha não substituem essa revisão.

## Verificação 2026-09-23

44 testes passaram, inclusive integridade de todos os GLBs, hashes, estruturas selecionáveis, recursos embutidos e orçamento <150 mil triângulos / <5 MB por arquivo. Build WMed e build completo do site passaram. Inspeção interativa desktop de E.coli, HIV, Aspergillus, Giardia e Candida; Giardia também em viewport 390x844. Seleção com destaque e função do nucleoide verificada. Não executados: revisão independente por microbiologista, iPhone físico, estudo com alunos ou inspeção visual completa das 31 variantes.
