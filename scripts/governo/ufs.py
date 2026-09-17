"""As 27 unidades da Federação: código IBGE, nome, capital, região e
tamanho das bancadas. Compartilhado por semente.py e gerar_estados.py.

Deputados federais por UF conforme a distribuição vigente (CF, art. 45).
Deputados estaduais pela regra do art. 27 da CF: o triplo da bancada
federal até 36, e a partir daí 36 mais o que exceder 12."""

UFS = [
    # sigla, código IBGE, nome, capital, região, deputados federais
    ("AC", "12", "Acre", "Rio Branco", "Norte", 8),
    ("AL", "27", "Alagoas", "Maceió", "Nordeste", 9),
    ("AP", "16", "Amapá", "Macapá", "Norte", 8),
    ("AM", "13", "Amazonas", "Manaus", "Norte", 8),
    ("BA", "29", "Bahia", "Salvador", "Nordeste", 39),
    ("CE", "23", "Ceará", "Fortaleza", "Nordeste", 22),
    ("DF", "53", "Distrito Federal", "Brasília", "Centro-Oeste", 8),
    ("ES", "32", "Espírito Santo", "Vitória", "Sudeste", 10),
    ("GO", "52", "Goiás", "Goiânia", "Centro-Oeste", 17),
    ("MA", "21", "Maranhão", "São Luís", "Nordeste", 18),
    ("MT", "51", "Mato Grosso", "Cuiabá", "Centro-Oeste", 8),
    ("MS", "50", "Mato Grosso do Sul", "Campo Grande", "Centro-Oeste", 8),
    ("MG", "31", "Minas Gerais", "Belo Horizonte", "Sudeste", 53),
    ("PA", "15", "Pará", "Belém", "Norte", 17),
    ("PB", "25", "Paraíba", "João Pessoa", "Nordeste", 12),
    ("PR", "41", "Paraná", "Curitiba", "Sul", 30),
    ("PE", "26", "Pernambuco", "Recife", "Nordeste", 25),
    ("PI", "22", "Piauí", "Teresina", "Nordeste", 10),
    ("RJ", "33", "Rio de Janeiro", "Rio de Janeiro", "Sudeste", 46),
    ("RN", "24", "Rio Grande do Norte", "Natal", "Nordeste", 8),
    ("RS", "43", "Rio Grande do Sul", "Porto Alegre", "Sul", 31),
    ("RO", "11", "Rondônia", "Porto Velho", "Norte", 8),
    ("RR", "14", "Roraima", "Boa Vista", "Norte", 8),
    ("SC", "42", "Santa Catarina", "Florianópolis", "Sul", 16),
    ("SP", "35", "São Paulo", "São Paulo", "Sudeste", 70),
    ("SE", "28", "Sergipe", "Aracaju", "Nordeste", 8),
    ("TO", "17", "Tocantins", "Palmas", "Norte", 8),
]

# Preposição para "Estado de/do/da": "Governo do Estado de São Paulo",
# "Tribunal de Justiça do Pará" etc.
ARTIGO = {"AC": "do", "AL": "de", "AP": "do", "AM": "do", "BA": "da", "CE": "do", "DF": "do",
          "ES": "do", "GO": "de", "MA": "do", "MT": "de", "MS": "de", "MG": "de", "PA": "do",
          "PB": "da", "PR": "do", "PE": "de", "PI": "do", "RJ": "do", "RN": "do", "RS": "do",
          "RO": "de", "RR": "de", "SC": "de", "SP": "de", "SE": "de", "TO": "do"}

# Siglas consagradas das Assembleias Legislativas
ALE = {"SP": "Alesp", "MG": "ALMG", "RJ": "Alerj", "RS": "ALRS", "PR": "Alep", "BA": "ALBA",
       "SC": "Alesc", "PE": "Alepe", "CE": "Alece", "GO": "Alego", "PA": "Alepa", "MA": "Alema",
       "ES": "Ales", "MT": "ALMT", "MS": "ALEMS", "PB": "ALPB", "PI": "Alepi", "RN": "ALRN",
       "AL": "ALE-AL", "SE": "Alese", "AM": "Aleam", "AC": "Aleac", "AP": "Alap", "RO": "ALE-RO",
       "RR": "ALE-RR", "TO": "Aleto", "DF": "CLDF"}


def deputados_estaduais(federais):
    return federais * 3 if federais <= 12 else 36 + (federais - 12)


def por_sigla():
    return {u[0]: {"sigla": u[0], "codigo": u[1], "nome": u[2], "capital": u[3], "regiao": u[4],
                   "deputados_federais": u[5], "deputados_estaduais": deputados_estaduais(u[5]),
                   "artigo": ARTIGO[u[0]], "ale": ALE[u[0]]} for u in UFS}
