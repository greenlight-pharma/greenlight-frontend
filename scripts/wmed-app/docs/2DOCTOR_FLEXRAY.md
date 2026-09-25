# FleXray — avaliação de viabilidade, 25/09/2026

Status: análise documental; não instalado, não executado, não integrado. Prioridade proposta: pesquisa visual no Laboratório de IA. O desenvolvimento do Scribe continua na fila; esta análise não ativa outro modelo clínico.

## Conclusão

Boa correspondência com atlas/radiografia/ensino3D da 2Doctor, mas há impedimento de licença para integração comercial direta dos pesos publicados. CódigoMIT; pesosCC BY-NC4.0. Não embutir os pesos no app de assinatura, nem tratar uma função gratuita de produto comercial como autorização automática. Solicitar permissão/licença comercial em etapa separada, somente após autorização do usuário para contato. Esta rodada não enviou contato.

## O que foi conferido

- Publicação original noX, lida via navegador: https://x.com/ion_barrel/status/2103142799986032650 — Victor Ion Butoi anuncia FleXray em24/09/2026.
- Página oficial: https://flexray.csail.mit.edu/ . Segmentação anatômica de radiografias convencionais; demo de pesquisa com processamento anunciado como local emWebGPU/WASM. Download inicial anunciado ~194MB; ensemble adiciona~776MB. Isso não prova desempenho ou privacidade de uma futura integração nossa, e não foi testado no celular.
- Preprint: https://arxiv.org/abs/2609.26756 / https://arxiv.org/html/2609.26756v1 (22/09/2026). AutoresMIT/MGH/Harvard; reportam Dice médio0,875 em8bases retidas do treino. Resultado de segmentação, não87,5% de precisão diagnóstica. A configuração do estudo usa ensemble5×TTA16; o demo pode usar1modelo/1passo ouTTA8, logo não atribuir os resultados do ensemble ao modo leve.
- Relação comXVR demonstrada pelos autores: máscaras fornecem termo geométrico adicional para registroRX/TC. Não equivale a recuperar umaTC de umRX. Nosso XrayLab.jsx atual carrega projeções/máscaras precomputadas do catálogo; não implementa esse pipeline de registro com modeloFleXray.

## Contrato e limites relevantes

Model card: https://huggingface.co/VictorButoi/flexray (README obtido pelo endpoint raw e licença confirmada também viaAPI; revisão6b63ddf09cfdff99aea494e3738cf243a4e22cdb).

Saída:60estruturas anatômicas, canais independentes para sobreposição, resolução256×256. Estruturas pares agrupadas; não prediz lateralidade. São máscaras anatômicas, não diagnóstico de patologias nem malhas3D. Card declara ausência de estimativa de incerteza e uso somente para pesquisa. Não usar probabilidade de canal como confiança clínica calibrada. Entradas/preprocessamento e recomposição de coordenadas precisam de avaliação antes de sobrepor ao original. Python ofereceDICOM via dependência opcional; demo anunciado aceita8bitPNG/JPEG/WebP. Sem uso clínico/dental/mamografia neste escopo.

## Licenças separadas

- Código: https://github.com/VictorButoi/FleXray/blob/main/LICENSE — MIT.
- Pesos: https://huggingface.co/VictorButoi/flexray/raw/main/README.md — CC BY-NC4.0 explícita emmetadata e seçãoLicenses.
- TermosNC: https://creativecommons.org/licenses/by-nc/4.0/ — proíbe finalidade comercial; não inferir autorização pelo download aberto.
- Dados: https://huggingface.co/datasets/VictorButoi/flexray-data . Licenças por fonte/pasta; incluiFluXray sintéticoNC e outros conjuntos comtermos próprios. Não copiar dados/imagens automaticamente.
- A página oficial usa imagensRadiopaedia sobCC BY-NC-SA. Não incorporar o mosaico/figuras na divulgação comercial da2Doctor por serem acessíveis online.

## Proposta de experiência (não implementada)

1. Biblioteca deRX com licença adequada: original e contornos comopacidade, estrutura selecionada e nomenclaturaPT/EN/ES.
2. Ao selecionar uma estrutura, abrir atlas3D ilustrativo correspondente. Identificar que é referência anatômica e não reconstrução do paciente.
3. Futuro estudo de registro2D/3D comXVR, somente em paresRX/TC licenciados com geometria/referência disponível.
4. Medidas comoCobb e adaptação a patologia pertencem a avaliações próprias posteriores; não habilitar decisão diagnóstica/cirúrgica.

## Próximo passo executável

Preparar matriz de autorização de pesos/dados e roteiro de piloto: conjuntos públicos licenciados, critérios porregião/incidência, medidasdeerro/ausência/falsoscontornos e performance/memória emiOS/Android. Antes de executar pesos, resolver uso pretendido/licença e escopo de avaliação. Pode-se desenhar a interface com acervo/máscaras já licenciados da2Doctor, sem apresentar isso como resultadoFleXray.

Nenhum download de pesos/datasets, GPU, inferência, upload de imagem/paciente, instalaçãoMCP, contato a terceiros ou deploy nesta rodada. Não rodados benchmarks, testes de modelo, validação clínica ou testes móveis de inferência. Código do produto não mudou; builds/regressões não reexecutados por ser análise documental.
