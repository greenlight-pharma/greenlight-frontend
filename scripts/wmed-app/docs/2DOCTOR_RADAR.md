# Radar web e pesquisa no X — 25/09/2026

## Entrega

Radar de inovação (#inovacoes) com destaque FleXray, fontes primárias e demonstração externa; prévia do acervo próprio com tórax/pelve e incidências 0/45/90 graus; ligação ao laboratório 3D existente. Interface PT/EN/ES, detalhes progressivos e atribuição do acervo. Não há inferência, upload de exames, download de pesos nem integração comercial FleXray. A projeção é identificada como simulação derivada de TC, não resultado do modelo. Preservados os projetos anteriores em “Outros projetos acompanhados”, chat, Scribe e autenticação.

Correção móvel adicional: abaixo de 360px, o atalho duplicado de histórico sai do cabeçalho (continua no Menu), liberando espaço para “Iniciar sesión”. Sem diminuir a área dos demais botões.

## Curadoria / fontes

X foi canal de descoberta, não evidência clínica. Datas abaixo são do anúncio consultado, não uma alegação de que tudo foi lançado nesta semana. Links externos; nenhum contato enviado.

### FleXray — 24/09/2026

- Autor: https://x.com/ion_barrel/status/2103142799986032650
- Projeto: https://flexray.csail.mit.edu/
- Preprint: https://arxiv.org/abs/2609.26756
- Licença dos pesos: https://huggingface.co/VictorButoi/flexray
- Avaliação detalhada: [2DOCTOR_FLEXRAY.md](2DOCTOR_FLEXRAY.md).
- Potencial: identificação anatômica em RX e ligação pedagógica ao atlas. Bloqueio comercial: pesos CC BY-NC4.0, apesar de código MIT. Não executar/embutir sem licença e avaliação próprias. Nenhuma promessa de reconstruir TC a partir de RX.

### MedASR / MedGemma 1.5 — anúncio conjunto 13/01/2026

- Post oficial Google AI Developers, localizado em citação no X: https://x.com/googleaidevs/status/2011181120793297361
- Anúncio original: https://research.google/blog/next-generation-medical-image-interpretation-with-medgemma-15-and-medical-speech-to-text-with-medasr/
- Model card: https://developers.google.com/health-ai-developer-foundations/medasr/model-card
- Termos: https://developers.google.com/health-ai-developer-foundations/terms
- MedASR foi criado em18/12/2025; a data de janeiro é o anúncio conjunto, não criação do modelo.
- Utilidade sugerida: transcrição revisável para Scribe após atendimento. Treino English-only; maioria de falantes nativos dos EUA e áudio de boa qualidade. Avaliar negações, medicamentos, unidades, datas, ruído e sotaques antes de uso; não extrapolar WER autoral para PT/ES. Uso comercial sujeito a HAI-DEF e restrições/avaliações aplicáveis; nada instalado/aceito/ativado.
- MedGemma já permanecia no radar. Não substituir o chat atual nem habilitar interpretação clínica de imagens nesta rodada.

### EVEE — 14/04/2026

- Anúncio do autor lido no X: https://x.com/GoodfireAI/status/2044086228983976202
- Pesquisa original Goodfire/Mayo Clinic: https://www.goodfire.com/research/evee-explaining-genetic-variants
- Potencial: material educativo conectando variante, mecanismo biológico e evidências, com incerteza explícita. Preprint anunciado em abril; não afirmar estado de revisão atual sem nova conferência.
- Predições de variantes não equivalem a diagnóstico/classificação clínica. Não apresentar benchmark autoral como validação nossa. Acesso público não estabelece autorização para incorporar dados/explicações à assinatura: licença comercial de reutilização não confirmada. Somente resumo autoral breve e link; nenhum banco de dados ou figura copiado.

## Acervo usado na prévia

Arquivos já presentes em public/xray/{torax,pelvis}/rx-{000,045,090}.webp. Catálogos identificam TotalSegmentator v2.0.1, s1397, reamostrado; projeção DiffDRR simplificada. Fonte https://zenodo.org/records/10047292 ; CC BY4.0 https://creativecommons.org/licenses/by/4.0/ ; Wasserthal et al.,2023,doi:10.1148/ryai.230024. São imagens educacionais derivadas de TC, não radiografias adquiridas nem segmentação FleXray. Referência sem revisão anatômica independente.

## Prioridade recomendada

1. Continuar contrato/conjunto sintético de avaliação do Scribe antes de habilitar texto livre generativo.
2. FleXray: licença comercial e critérios de avaliação, sem inferência nesta fase. Contato com autores depende de autorização específica do usuário.
3. Genética: curadoria autoral de mecanismos/variantes com fontes, independente de integrar EVEE; esclarecer termos antes de reutilizar dados.

## Validação

137 testes automatizados: conjunto existente + evidência/licença/tradução dos registros e existência/licença das seis projeções. Build 2Doctor e site completo aprovados. CUA local: PT/EN/ES,320/390/1280px, temas claro/escuro, seleção de região/ângulo com imagens carregadas, fontes expansíveis, atalhos Scribe e laboratório3D, menu e histórico. Correção do cabeçalho320px confirmada: scrollWidth=clientWidth305, sem overflow; console sem erros. Sem teste em aparelho físico, inferência/GPU, benchmark de modelos, paciente real, autenticação ou validação clínica. Deploy exclusivamente 2doctor-web a partir scripts/wmed-app com --path-as-root. Estado final de publicação será registrado abaixo.
