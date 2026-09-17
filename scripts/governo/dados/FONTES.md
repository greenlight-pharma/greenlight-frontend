# Fontes dos dados desta pasta

## municipios.csv

Os 5.570 municípios brasileiros com código IBGE de 7 dígitos, UF, nome,
marcação de capital e DDD. Montado em setembro de 2026 a partir de três
pacotes públicos, porque a API de localidades do IBGE estava bloqueada na
sessão que gerou o arquivo:

* conjunto de códigos (autoritativo, 5.570): pacote npm `municipios-ibge` 1.0.1;
* nomes com acentuação e DDD: pacote npm `brazilian-cities` 2.1.1;
* conferência de nomes: pacote PyPI `pyUFbr` 0.1.0.

Os cinco municípios criados em 2013 (Mojuí dos Campos, Paraíso das Águas,
Pescaria Brava, Balneário Rincão, Pinto Bandeira) e treze nomes divergentes
entre as fontes foram corrigidos à mão para a grafia atual do IBGE.

A contagem por UF bate com a oficial do IBGE (SP 645, MG 853, RS 497...).

Para atualizar a partir da fonte primária, use
`https://servicodados.ibge.gov.br/api/v1/localidades/municipios` (script
`baixar_ibge.py`), que substitui este arquivo.
