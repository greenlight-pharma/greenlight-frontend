# Fotos: o que faz o site parecer caro — e o que não se pode fazer

O site de referência que motivou este documento funciona por causa de **um
retrato profissional bem feito**. Não é a cor, não é a fonte: é a foto. Num
site de profissional único, a imagem é metade do produto.

Daí a pergunta óbvia: *dá para buscar no Instagram ou no Google?*

## Não. E o motivo é duplo

**Jurídico.** Uma foto tem dois donos:

- **O fotógrafo**, pelo direito autoral (Lei 9.610/98). O retrato de estúdio
  que a médica publicou no Instagram foi pago por ela, mas o direito autoral
  em geral continua com quem fotografou, salvo cessão por escrito. Baixar e
  republicar num site comercial é uso de obra alheia.
- **A pessoa retratada**, pelo direito de imagem (Constituição, art. 5º, X;
  Código Civil, art. 20). E aqui não há margem de dúvida: a Súmula 403 do STJ
  diz que a indenização por publicação não autorizada de imagem **com fins
  econômicos independe de prova de prejuízo**. Ou seja: não precisa ter dado
  nenhum problema para gerar dano indenizável.

Os termos de uso do Instagram também proíbem coletar conteúdo por raspagem.

**Comercial, e é o que deveria bastar.** Você está ligando para uma pessoa
para falar da reputação dela. Chegar com a foto que você pegou do perfil sem
pedir é exatamente o oposto do que você precisa transmitir. É o tipo de
detalhe que transforma um "que legal, me manda" num "quem é você?".

## O que funciona, em ordem

### 1. Peça na ligação. É a jogada mais forte que existe aqui

> "Doutora, tem uma foto sua que a senhora goste? Se me mandar aqui no
> WhatsApp eu coloco no site e te reenvio o link em dez minutos."

Trinta segundos, autorização explícita, e algo mais valioso: **ela passa a
ser coautora do preview.** Quem mandou a própria foto já está tratando o
site como dele. A taxa de fechamento depois disso não se compara.

### 2. Até lá, o preview vai sem foto — e de propósito

O layout `editorial` detecta que não há retrato e troca o quadro da foto por
um painel tipográfico com o monograma. Não fica um buraco nem um `alt`
quebrado: fica uma escolha de design.

É o estado normal do rascunho de prospecção, e é a sua deixa:

> "Ficou com o monograma porque eu não tenho foto sua. Me manda uma que
> muda em dois minutos."

### 3. Depois de fechar, peça o kit

Mande esta lista no WhatsApp, exatamente assim:

```
Pra deixar o site no ponto, me manda:

1 foto sua      — de pé ou sentada, do peito pra cima, olhando pra câmera,
                  fundo claro e liso, luz de janela (não precisa de estúdio,
                  celular na vertical resolve)
3 a 5 fotos do consultório — recepção, sala de atendimento, fachada e um
                  detalhe do equipamento
logo            — se tiver, em PNG com fundo transparente

Importante: nenhuma foto com paciente, nem de parte do corpo de paciente,
e nenhuma tela de computador aparecendo (prontuário na tela é vazamento de
dado de paciente).
```

Aquele último item parece exagero e não é: a foto mais comum de recepção de
clínica tem um monitor ligado ao fundo. Já vi nome de paciente legível em
foto de divulgação.

### 4. Se as fotos são ruins, isso é venda, não problema

Retrato ruim é o gargalo de qualidade mais comum. Ofereça: um fotógrafo
local, meia diária, retrato + ambientes. Custa R$ 400–800 na maior parte do
interior, você cobra R$ 600–1.200 e entrega um site que parece o dobro do
preço. É o upsell mais fácil do pacote — e o que mais melhora o resultado.

### 5. Banco de imagens: só para ambiência, sempre rotulado

Unsplash e Pexels permitem uso comercial. Mas há uma linha que o gerador
não deixa cruzar:

- **Nunca** uma pessoa de banco de imagens apresentada como a profissional.
  Isso é fabricar a identidade de quem assina o site.
- **Nunca** um consultório de banco de imagens apresentado como o
  consultório dela. É publicidade enganosa pelo CDC, e o paciente descobre
  na primeira visita.
- Para textura e ambiência, com `"tipo": "ilustrativa"`, o gerador estampa
  **"Imagem ilustrativa"** sobre a foto e pede o crédito no rodapé.

## O portão no código

O validador exige, sempre que houver `midia.retrato`:

| Campo | O que escrever |
|---|---|
| `midia.origem` | De onde a imagem veio. `"enviada pela clínica no WhatsApp em 14/09/2026"`, `"fotógrafo Nome, contratado pela clínica"`, `"Unsplash, foto de Autor, licença de uso comercial"` |
| `midia.autorizacao` | Quem autorizou e quando. `"Dra. Nome autorizou o uso no site em 14/09/2026"` |
| `midia.retratoAlt` | Descrição da imagem, para leitor de tela e para o Google |

Sem origem e autorização, o site não é gerado. Não é burocracia: é que sem
isso a foto não deveria estar na página, e seis meses depois você não vai
lembrar de onde ela veio.

Cada item da galeria exige `"tipo": "propria"` ou `"tipo": "ilustrativa"` —
a pergunta "essa foto é do consultório dele ou é de banco?" precisa ter uma
resposta registrada, não uma lembrança.

## Parte técnica

```json
"midia": {
  "retrato": "fotos/dra-nome.jpg",
  "retratoAlt": "Dra. Nome em seu consultório",
  "origem": "enviada pela clínica no WhatsApp em 14/09/2026",
  "autorizacao": "Dra. Nome autorizou o uso no site em 14/09/2026",
  "galeria": [
    { "src": "fotos/recepcao.jpg", "alt": "Recepção", "tipo": "propria" },
    { "src": "fotos/sala.jpg", "alt": "Sala de atendimento", "tipo": "propria" }
  ],
  "creditos": "Fotos: Nome do Fotógrafo (2026)"
}
```

Tamanhos: retrato com 1200 px de largura basta (o layout corta em `cover`);
galeria com 1400 px. Acima disso você só deixa o site lento no 4G da clínica.

**Otimize antes de subir.** Foto de celular vem com 4–8 MB e derruba o
tempo de carregamento, que é justamente o que faz o Google ranquear pior —
o contrário do que você vendeu. Não há ferramenta de imagem neste repo;
use [squoosh.app](https://squoosh.app) (arrasta, escolhe WebP ou JPEG a 75%,
baixa) ou instale o `sharp` se preferir automatizar. Meta: até 200 KB por
imagem.
