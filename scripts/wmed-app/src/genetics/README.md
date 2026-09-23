# Genética — primeira biblioteca visual

Cinco cenas autorais procedurais em Three.js: célula nucleada em corte, núcleo em intérfase, cromossomo duplicado condensado, três nucleossomos e dupla hélice didática. Sem assets de terceiros, novos serviços, credenciais ou dependências. Não são reconstruções experimentais, geometrias atômicas nem modelos exportados pelo Blender. Escalas e quantidades simplificadas, declarado na UI.

## Conteúdo e fontes consultadas (23/09/2026)
- NHGRI: Mitochondrial DNA, Chromatin, Chromatid, Chromosome, Nucleosome, DNA, Nucleus, Nucleolus, Nucleopore e Base Pair. Fonte contextual por etapa na interface.
- https://www.ncbi.nlm.nih.gov/research/histonedb/help/ — octâmero, cerca de 1,7 volta super-helicoidal à esquerda, DNA de ligação.
- https://www.genome.gov/Pages/Careers/EducationalPrograms/ShortCourse/2016ShortCourse/2016-08-03ShortCourseGeneticsandGenomicsPrimer_BW.pdf — bases e ligações.

Não há parecer independente de geneticista. Conteúdo introdutório, não curso completo. Cromossomo descrito como duplicado; duas cromátides não são apresentadas como homólogos. Modelo nucleossômico representa a dupla hélice por um único tubo, com superenrolamento à esquerda; DNA isolado com hélice à direita, bases no interior e sentidos antiparalelos descritos. Nucléolo/poros e envoltório são esquemáticos; membranas não têm espessura proporcional.

## Interação e execução
Selecionar com raycast ou botões acessíveis, girar manual/automático, zoom e restaurar enquadramento; cinco perguntas com feedback imediato. Sem salvamento de resultados nesta versão. Layout enquadra a cena no espaço disponível; no celular painel fica abaixo do modelo. Respeita redução de movimento, pausa render de aba oculta, libera geometrias/materiais/contexto ao desmontar e fornece recuperação de falha WebGL.

Testes de catálogo, correspondência de partes com malhas e geometria finita. Não equivalem a validação anatômica/educacional. Próximas expansões possíveis: replicação/transcrição, divisão celular e heredogramas, com revisão de conteúdo antes de ampliar.
