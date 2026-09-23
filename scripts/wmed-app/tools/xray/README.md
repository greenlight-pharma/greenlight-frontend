# Laboratório de radiografia

Protótipo educacional de DRR, sem execução do registro neural XVR. Não aceita exames enviados e não produz diagnóstico.

Fonte: TotalSegmentator v2.0.1, caso s1397, reamostrado a aproximadamente 3 mm pelo PyVista. CC BY 4.0. Wasserthal et al., 2023, DOI 10.1148/ryai.230024. Fonte: https://zenodo.org/records/10047292. Licença: https://creativecommons.org/licenses/by/4.0/.

Download reproduzível: https://raw.githubusercontent.com/pyvista/data/6a55220dff84f3f9c0cd170945d2f9d695f871af/Data/whole_body_ct/s1397_resampled.zip

Transformações: recorte pélvico, remoção do suporte externo, atenuação simplificada Siddon pelo DiffDRR 0.6.0 (MIT), normalização visual, sete projeções de 0 a 90 graus. Malhas extraídas das mesmas segmentações; coordenadas físicas preservadas na transformação RAS → (R,S,-A). Máscaras projetadas codificam cinco estruturas em bits independentes, preservando sobreposições.

O recorte é incompleto inferiormente e não representa uma radiografia adquirida. Não houve revisão anatômica independente ou validação clínica. Os resultados são uma demonstração técnica de uma única aquisição.

Python 3.12 em ambiente isolado:

```sh
pip install -r requirements.txt
python build.py --source /caminho/s1397_resampled.vtm
```

Saída em public/xray/pelvis. catalog.json registra calibração, hashes dos arquivos e do gerador. A UI oferece zoom visual comum de 1,35, seleção pareada, incidências discretas e exercício de identificação. Nenhuma GPU ou serviço remoto é necessário na navegação.

Verificação: testes Node de integridade, nomes de estruturas, orientação e calibração independente dos cantos do detector. Inspeção visual em navegador desktop e móvel. Isso não equivale a validação clínica nem valida o registro XVR.

## Expansão 23/09/2026

- Modo de geometria: fonte, detector texturizado e raios nas coordenadas reais do catálogo; toque na projeção produz raio até o centro do pixel. Órbita livre apenas da câmera de observação, sem alterar a aquisição.
- Sobreposição: contornos ou preenchimento das máscaras projetadas; bits preservam sobreposições.
- Alinhamento educacional: comparação vermelho/ciano e diferença absoluta (ganho visual 2x); desafio em sete incidências e busca exaustiva NCC sobre pixels originais das sete DRRs. Referência é uma projeção do próprio conjunto, portanto coincidência perfeita é esperada. Sem ruído, domínio clínico, avaliação externa, erro em milímetros ou registro 6DoF. Não executa rede XVR.
- Fundamentação: https://github.com/eigenvivek/xvr e https://xvr.csail.mit.edu/ consultados em 23/09/2026. Código de registro neural não incorporado; nenhuma nova dependência ou GPU.

Testes adicionais verificam raios por projeção independente, contornos com bits sobrepostos e NCC com brilho/escala conhecidos. A revisão clínica e ensaios com radiografias adquiridas não foram executados.

## Regiões adicionais — 23/09/2026

Tórax, abdome e coluna lombar gerados por `build-regions.py` a partir da mesma TC pública s1397. Com pelve, são quatro regiões e 28 projeções, todas simuladas. Para reproduzir, use o mesmo ambiente e fonte, com `--region torax`, `--region abdome` ou `--region lombar`. Script registra corte de origem, affine, estruturas agrupadas, calibração do detector e hashes. Máscaras mantêm no máximo sete bits por região. Malhas suavizadas com sigma .55 voxels; sem registro entre pacientes.

No tórax: pulmões, coração, costelas, coluna torácica, esterno e traqueia. Abdome: fígado, baço, rins, coluna lombar, pelve e aorta no recorte. Lombar: L1–L5 e sacro. Limites do recorte podem truncar estruturas; máscara de órgão derivada da TC não significa visibilidade isolada no RX simples. Não há validação clínica ou radiografia adquirida neste conjunto.
