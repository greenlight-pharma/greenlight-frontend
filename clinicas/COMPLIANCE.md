# Publicidade em saúde no Brasil — o que muda tudo

> Isto é documentação de engenharia, escrita para quem vai gerar sites.
> **Não é parecer jurídico.** As regras abaixo estão codificadas em
> `validar.mjs`; antes de prometer conformidade a um cliente, confirme a
> redação vigente no conselho dele (o CRM do estado responde consulta) e,
> em contrato acima de alguns milhares de reais, passe por um advogado.

## O problema central

O roteiro que circula em vídeo — "copie as avaliações do Google e cole no
site" — é o passo que **não se pode dar** quando o cliente é médico,
dentista, psicólogo ou fisioterapeuta.

Depoimento de paciente em publicidade é vedado. Estrelas e nota do Google
estampadas no site entram na mesma vedação: é testemunho de paciente usado
para atrair clientela. O que nos Estados Unidos é o miolo da oferta, aqui é
o que abre sindicância no conselho.

Isso não mata o negócio. **Vira a sua vantagem**: todo gerador genérico de
site produz, por padrão, um site irregular para clínica. O seu não.

## Base declarada

| Conselho | Norma principal | Vale para |
|---|---|---|
| CFM | Res. CFM 1.974/2011, alterada pela Res. CFM 2.336/2023 | médicos |
| CFO | Código de Ética Odontológica, Res. CFO 196/2019 | dentistas |
| CFP | Res. CFP 010/2005 e 003/2007 | psicólogos |
| COFFITO | Código de Ética (fisioterapia e terapia ocupacional) | fisioterapeutas |
| CFN | Código de Ética e Conduta do Nutricionista | nutricionistas |
| CFMV | Código de Ética do Médico Veterinário | veterinários |
| — | Lei 13.709/2018 (LGPD), art. 11 (dado sensível de saúde) | todos |

As resoluções mudam. A Res. 2.336/2023 alterou vários pontos da 1.974/2011,
e pontos como divulgação de preço já foram tratados de formas diferentes ao
longo do tempo, inclusive com questionamento pelo CADE. Por isso o
validador trata **preço como aviso, não como erro**: a decisão é do cliente,
registrada por escrito, depois de confirmar com o conselho dele.

## O que o gerador nunca coloca no site

Estão fora por construção — não há campo no briefing para eles, e o
validador barra se aparecerem em texto livre:

1. **Depoimento, testemunho ou avaliação de paciente.** Nem transcrito, nem
   em print, nem em vídeo.
2. **Nota e número de estrelas do Google.** Inclusive no `aggregateRating`
   do JSON-LD: o gerador omite de propósito. A nota fica no briefing, no
   campo `_prospeccao`, porque ela serve para **a sua conversa de venda** —
   não para a página.
3. **Antes e depois.** Imagem ou descrição.
4. **Promessa de cura, garantia de resultado, "100% de eficácia".**
5. **Superlativo e exclusividade**: "o melhor da cidade", "único na região",
   "tecnologia exclusiva", "referência nacional".
6. **Promoção, desconto, brinde, sorteio, "leve 2 pague 1".** Oferta
   comercial em serviço de saúde é mercantilização.
7. **Urgência artificial**: "últimas vagas", "só hoje". (Aviso, não erro —
   mas não use: com clínica, converte pior.)

## O que o gerador exige no site

1. **Nome e número de registro do responsável técnico**, visível — no
   cartão da equipe e no rodapé. Formato validado por conselho:
   `CRM-SP 123456`, `CRO-RJ 45678`, `CRP 06/123456`.
2. **RQE junto do CRM** sempre que a página anunciar especialidade médica.
   Sem RQE, o site descreve a atuação sem chamar de especialidade. É a
   irregularidade mais comum que existe em site de clínica.
3. **Aviso de que o conteúdo não substitui consulta**, com a orientação de
   emergência (192). No rodapé, em todo site.

## LGPD: por que não há formulário

O template agenda por **WhatsApp e telefone**, e não por formulário. Não é
preguiça de implementar:

- Dado de saúde é **dado pessoal sensível** (LGPD, art. 11). Um formulário
  com "queixa principal" coleta dado sensível, e aí vêm base legal,
  finalidade declarada, retenção, segurança do armazenamento e a
  responsabilidade se vazar.
- Um site estático sem formulário praticamente não tem essa superfície. A
  conversa acontece no WhatsApp da clínica, onde ela já acontecia, sob a
  responsabilidade de quem já é responsável pelo prontuário.
- Se o cliente quiser formulário, o validador avisa e a decisão é dele —
  com política de privacidade de verdade, não um texto copiado.

Também evite Google Analytics e pixel de rede social em site de clínica sem
pensar duas vezes: você passa a mandar para terceiros o rastro de quem
visitou a página de um procedimento específico. Isso é inferência sobre
saúde de pessoa identificável.

## Odontologia, estética e o resto

- **Dentista (CFO):** regras próprias, também com vedação a antes/depois em
  propaganda e a testemunho. Use `"conselho": "CFO"`.
- **Estética sem profissional de saúde** (por exemplo salão que faz
  procedimento estético não invasivo, sem médico ou biomédico
  responsável): `"conselho": "NENHUM"`. Aí o campo `depoimentos` é
  liberado, e o CDC passa a ser o limite — publicidade não pode ser
  enganosa. Continua valendo: se há profissional de saúde responsável, o
  conselho dele manda.
- **Na dúvida, use o conselho mais restritivo.** Site regular não gera
  processo; site irregular gera — e o cliente vai lembrar de quem fez.
