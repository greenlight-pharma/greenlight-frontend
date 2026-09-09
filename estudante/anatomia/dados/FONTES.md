# Fontes dos volumes de imagem

Os arquivos `.vytalvol` desta pasta são gerados por
`scripts/anatomia/preparar_volumes.py` a partir de conjuntos públicos.
Todos são exames anônimos, publicados para pesquisa e ensino. O uso aqui é
exclusivamente educacional; nada nesta pasta serve para diagnóstico.

## torax, abdome, cabeca — TC de corpo inteiro com 117 estruturas segmentadas

* **Origem:** sujeito `s1397` do conjunto de dados do TotalSegmentator, versão 2.0.1
  (Zenodo, registro 10047292), reamostrado para 3 mm pelo projeto PyVista e
  distribuído no repositório `pyvista/vtk-data` (`Data/whole_body_ct/s1397_resampled.zip`).
* **Licença:** Creative Commons Attribution 4.0 International (CC BY 4.0).
* **Citação:** Wasserthal J. et al. *TotalSegmentator: Robust Segmentation of 104
  Anatomic Structures in CT Images.* Radiology: Artificial Intelligence, 2023.
  doi:10.1148/ryai.230024
* **O que fizemos:** convertemos para o sistema LPS (esquerda, posterior, superior),
  removemos a mesa do tomógrafo, recortamos três regiões (tórax; abdome e pelve;
  cabeça e pescoço) e agrupamos os 117 rótulos originais em estruturas de estudo
  com nomes em português (por exemplo, os cinco lobos pulmonares viram
  "Pulmão direito" e "Pulmão esquerdo"; as 24 costelas viram "Costelas").
  A tabela de agrupamento está no script.

## cranio — TC de crânio em alta resolução

* **Origem:** volume `FullHead` do VTKData (Kitware), distribuído no repositório
  `pyvista/vtk-data` (`Data/FullHead.mhd` e `Data/FullHead.raw.gz`), 256 × 256 × 94
  voxels de 0,94 × 0,94 × 1,5 mm.
* **Licença:** dados de exemplo do VTK, redistribuídos pelo PyVista sob licença
  permissiva compatível com BSD (ver o `LICENSE` do repositório `pyvista/vtk-data`).
* **O que fizemos:** convertemos os valores brutos para Hounsfield (offset de 1024),
  reduzimos o plano à metade (1,875 mm) e geramos **rótulos automáticos por limiar
  de densidade** para osso e para ar. Esses rótulos não são segmentação revisada:
  aparecem com a marca "auto" na interface. Não rotulamos o encéfalo neste volume
  porque, nesta resolução, a separação automática entre o interior do crânio e as
  partes moles da face não ficou confiável.

## Formato `.vytalvol`

Um único gzip contendo: `VYTALVOL` (8 bytes), o tamanho do cabeçalho (uint32
little-endian), o cabeçalho JSON (dimensões, espaçamento, estruturas, fonte),
os valores HU em int16 e os rótulos em uint8, ambos na ordem x-mais-rápido.
Os eixos seguem LPS com origem no centro do volume. O leitor está em
`estudante/anatomia/index.html`.
