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
