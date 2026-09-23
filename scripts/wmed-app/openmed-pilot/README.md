# Piloto OpenMed WMed — revisão de privacidade

Implementação isolada. Não habilitada em produção por padrão. A interface local usa regras já disponíveis no WMed, identificadas como regras, e oferece revisão humana. Nenhum peso é enviado ao navegador ou incluído no deploy Vercel.

## Preparar e testar

Python 3.12, ambiente virtual separado:

```sh
pip install -r requirements.txt
python provision.py /caminho/modelo
python evaluate.py --model-dir /caminho/modelo --output resultado.json
```

Modelo: OpenMed/OpenMed-PII-Portuguese-BioClinicalBERT-Base-110M-v1, revisão 3252a8885fefc2490a124c2be7ed7bce40088326, ficha Apache-2.0. SDK OpenMed 2.5.0 Apache-2.0. Pesos não redistribuídos. Fonte/licença: https://huggingface.co/OpenMed/OpenMed-PII-Portuguese-BioClinicalBERT-Base-110M-v1 e https://github.com/maziyarpanahi/openmed/blob/master/LICENSE.

provision.py é a única etapa com download. Engine verifica hashes do manifesto WMed, usa arquivos locais, CPU, HF offline, telemetria HF desligada e cache de resultados desligado. Warning upstream sobre ausência de `.openmed-integrity.json` não deve ser confundido com nosso manifesto; usamos `wmed-integrity.json` e hashes SHA256. Na infraestrutura final também bloquear egress e logs de corpos de requisição.

## Serviço privado, após avaliação

Configurar WMED_OPENMED_MODEL_DIR e WMED_OPENMED_TOKEN (segredo >=32 caracteres), executar `uvicorn service:app --host 127.0.0.1 --port 5220 --no-access-log`. Expor apenas atrás de um gateway privado autenticado/TLS. Não instalar no processo da API clínica existente.

No backend WMed, WMED_OPENMED_URL (HTTPS) e WMED_OPENMED_TOKEN habilitam a rota `/api/wmed/privacy`. Sem ambos, GET informa disabled e POST retorna indisponibilidade explícita. O proxy exige cookie válido, verifica sessão upstream, origem, tamanho e limite de chamadas. O piloto nunca substitui a revisão humana nem autoriza o envio de áudio identificável. Quando habilitado, o usuário clica explicitamente em analisar no servidor; essa etapa recebe texto e não é processamento no dispositivo.

Apenas spans e rótulos retornam ao frontend. Índices Python são convertidos para UTF-16 JavaScript. Age/sexo/doses não são removidos indiscriminadamente. Texto bruto não é gravado em logs pelo código. Uma análise indisponível não vira resultado silencioso de IA.

## Limitações / promoção

A avaliação de 100 relatos usa poucos templates sintéticos, nomes fictícios e identificadores de teste, não uma amostra clínica representativa. Conservar relatório agregado; não chamar seus resultados de validação clínica. Antes da ativação: revisar casos variados PT-BR, dados raros, relatos longos, sinais clínicos e negações, OCR/transcrição, medir falsos positivos e identificadores não cobertos por categoria, dimensionar concorrência e revisar licenças/dados de treinamento. Não há autorização automática de promoção após estes testes.

O assistente e o feedback continuam usando os serviços Vytal existentes. Biblioteca contextual usa sugestões de navegação curadas; não afirma ter encontrado a estrutura exata nem gera diagnósticos a partir de palavras-chave.
