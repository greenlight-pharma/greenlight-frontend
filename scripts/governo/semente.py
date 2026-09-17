#!/usr/bin/env python3
"""
Semente curada do Mapa do Governo (mapadogoverno.com.br), esfera federal.

Gera governo/dados/governo-federal.json a partir de uma lista escrita à mão,
baseada na Constituição de 1988 (arts. 76 a 135) e na Lei 14.600/2023
(organização básica da Presidência e dos Ministérios).

A regra desta semente: ESTRUTURA sim, PESSOAS quase nunca. Só entram nomes
de ocupantes quando o mandato é fixo e público (Presidente, Vice, presidentes
das Casas do Congresso e do STF). Todo o resto fica `ocupante: null` até que
os scripts de ingestão (baixar_siorg.py, baixar_congresso.py) preencham a
partir das fontes oficiais. Melhor um campo vazio do que um nome errado.

Uso:
    python3 scripts/governo/semente.py            # grava o JSON
    python3 scripts/governo/semente.py --stdout   # imprime
"""
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
SAIDA = RAIZ / "governo" / "dados" / "governo-federal.json"

nos = []
arestas = []
_ids = set()


SITUACOES = {
    "titular": "Titular",
    "interino": "Interino(a) ou substituto(a)",
    "vago": "Vago",
    "nao_verificado": "Não verificado",
}


def no(id, nome, tipo, poder, pai=None, sigla=None, cargo=None, ocupante=None,
       desde=None, mandato_ate=None, lei=None, site=None, descricao=None,
       relacao=None, verificado_em=None, fonte=None, quantidade=None, situacao=None):
    """Registra um nó. `relacao` é o rótulo da aresta pai->filho.

    `situacao` do cargo: titular | interino | vago | nao_verificado. Quando não
    informada, é "titular" se há ocupante e "nao_verificado" se não há. "vago"
    só deve ser usado com fonte e data: vacância é uma afirmação, não ausência
    de dado."""
    if id in _ids:
        raise SystemExit(f"id duplicado: {id}")
    _ids.add(id)
    n = {"id": id, "nome": nome, "tipo": tipo, "poder": poder}
    if sigla: n["sigla"] = sigla
    if pai: n["pai"] = pai
    if lei: n["lei"] = lei
    if site: n["site"] = site
    if descricao: n["descricao"] = descricao
    if quantidade: n["quantidade"] = quantidade
    if cargo:
        if situacao is None:
            situacao = "titular" if ocupante else "nao_verificado"
        assert situacao in SITUACOES, (id, situacao)
        if situacao == "vago":
            assert fonte and verificado_em, f"{id}: vacância exige fonte e data"
        n["cargo"] = {
            "titulo": cargo,
            "situacao": situacao,
            "ocupante": ocupante,
            "desde": desde,
            "mandato_ate": mandato_ate,
            "verificado_em": verificado_em,
            "fonte": fonte,
        }
    nos.append(n)
    if pai:
        if relacao is None:
            relacao = {
                "orgao": "integra", "ministerio": "integra", "poder": "compõe",
                "tribunal": "integra", "casa_legislativa": "integra",
                "forca_armada": "integra", "grupo": "integra",
            }.get(tipo, "vinculada a")
        arestas.append({"de": pai, "para": id, "tipo": relacao, "hierarquica": True})
    return id


def liga(de, para, tipo, descricao=None):
    a = {"de": de, "para": para, "tipo": tipo, "hierarquica": False}
    if descricao: a["descricao"] = descricao
    arestas.append(a)


# ---------------------------------------------------------------- raiz e poderes
no("uniao", "União", "raiz", "uniao", sigla="BR",
   descricao="A República Federativa do Brasil na esfera federal. Os três Poderes "
             "são independentes e harmônicos entre si (CF, art. 2º).",
   lei="Constituição Federal de 1988")
no("exec", "Poder Executivo", "poder", "executivo", pai="uniao",
   descricao="Exercido pelo Presidente da República, auxiliado pelos Ministros de Estado (CF, art. 76).",
   lei="CF, arts. 76 a 91")
no("leg", "Poder Legislativo", "poder", "legislativo", pai="uniao",
   descricao="Exercido pelo Congresso Nacional, composto pela Câmara dos Deputados e pelo Senado Federal (CF, art. 44).",
   lei="CF, arts. 44 a 75")
no("jud", "Poder Judiciário", "poder", "judiciario", pai="uniao",
   descricao="STF, CNJ, STJ, tribunais superiores, Justiça Federal, do Trabalho, Eleitoral e Militar (CF, art. 92).",
   lei="CF, arts. 92 a 126")
no("fej", "Funções essenciais à Justiça", "poder", "essencial", pai="uniao",
   descricao="Ministério Público, Advocacia Pública e Defensoria Pública. Não pertencem a nenhum dos três Poderes (CF, arts. 127 a 135).",
   lei="CF, arts. 127 a 135")

# ---------------------------------------------------------------- Executivo
no("pr", "Presidência da República", "orgao", "executivo", pai="exec", sigla="PR",
   cargo="Presidente da República", ocupante="Luiz Inácio Lula da Silva",
   desde="2023-01-01", mandato_ate="2026-12-31", verificado_em="2026-09",
   fonte="https://www.gov.br/planalto",
   descricao="Chefe de Estado e de Governo. Mandato de quatro anos, eleição direta em dois turnos.",
   lei="CF, art. 76; Lei 14.600/2023", site="https://www.gov.br/planalto")
no("vpr", "Vice-Presidência da República", "orgao", "executivo", pai="pr", sigla="VPR",
   cargo="Vice-Presidente da República", ocupante="Geraldo Alckmin",
   desde="2023-01-01", mandato_ate="2026-12-31", verificado_em="2026-09",
   fonte="https://www.gov.br/planalto",
   descricao="Substitui o Presidente nos impedimentos e o sucede na vaga (CF, art. 79).")

# Órgãos da Presidência (Lei 14.600/2023, art. 2º)
no("casa-civil", "Casa Civil da Presidência da República", "ministerio", "executivo", pai="pr",
   sigla="Casa Civil", cargo="Ministro(a) de Estado Chefe", lei="Lei 14.600/2023, art. 3º",
   descricao="Coordena e integra as ações do governo; analisa a constitucionalidade e o mérito dos atos presidenciais.")
no("seg-geral", "Secretaria-Geral da Presidência da República", "ministerio", "executivo", pai="pr",
   sigla="SG/PR", cargo="Ministro(a) de Estado Chefe", lei="Lei 14.600/2023, art. 4º",
   descricao="Relação com a sociedade civil e movimentos sociais; participação social.")
no("sri", "Secretaria de Relações Institucionais", "ministerio", "executivo", pai="pr",
   sigla="SRI", cargo="Ministro(a) de Estado Chefe", lei="Lei 14.600/2023, art. 5º",
   descricao="Articulação política com o Congresso, partidos, estados e municípios.")
no("secom", "Secretaria de Comunicação Social", "ministerio", "executivo", pai="pr",
   sigla="Secom", cargo="Ministro(a) de Estado Chefe", lei="Lei 14.600/2023, art. 6º",
   descricao="Comunicação e publicidade do governo federal.")
no("gsi", "Gabinete de Segurança Institucional", "ministerio", "executivo", pai="pr",
   sigla="GSI", cargo="Ministro(a) de Estado Chefe", lei="Lei 14.600/2023, art. 7º",
   descricao="Segurança pessoal do Presidente e das instalações; segurança da informação.")
no("agu", "Advocacia-Geral da União", "ministerio", "executivo", pai="pr", sigla="AGU",
   cargo="Advogado(a)-Geral da União", lei="CF, art. 131; LC 73/1993",
   descricao="Representa a União judicial e extrajudicialmente e presta consultoria ao Executivo. "
             "Constitucionalmente é função essencial à Justiça; o cargo tem status de Ministro de Estado.",
   site="https://www.gov.br/agu")
no("cgu", "Controladoria-Geral da União", "ministerio", "executivo", pai="pr", sigla="CGU",
   cargo="Ministro(a) de Estado", lei="Lei 14.600/2023, art. 9º",
   descricao="Controle interno, auditoria, correição, ouvidoria, transparência e combate à corrupção.",
   site="https://www.gov.br/cgu")

no("iti", "Instituto Nacional de Tecnologia da Informação", "autarquia", "executivo", pai="casa-civil",
   sigla="ITI", cargo="Diretor(a)-Presidente", descricao="Autoridade Certificadora Raiz da ICP-Brasil.")
no("abin", "Agência Brasileira de Inteligência", "orgao", "executivo", pai="casa-civil", sigla="ABIN",
   cargo="Diretor(a)-Geral", lei="Lei 9.883/1999; Lei 14.600/2023",
   descricao="Órgão central do Sistema Brasileiro de Inteligência. Transferida do GSI para a Casa Civil em 2023.")
no("ebc", "Empresa Brasil de Comunicação", "empresa_publica", "executivo", pai="secom", sigla="EBC",
   cargo="Presidente", descricao="TV Brasil, Rádio Nacional, Agência Brasil.")

# Ministérios (Lei 14.600/2023, art. 20, e Lei 14.720/2023 para o MEMP)
MINISTERIOS = [
    ("mapa", "Ministério da Agricultura e Pecuária", "MAPA"),
    ("mcid", "Ministério das Cidades", "MCid"),
    ("mcti", "Ministério da Ciência, Tecnologia e Inovação", "MCTI"),
    ("mcom", "Ministério das Comunicações", "MCom"),
    ("minc", "Ministério da Cultura", "MinC"),
    ("md", "Ministério da Defesa", "MD"),
    ("mda", "Ministério do Desenvolvimento Agrário e Agricultura Familiar", "MDA"),
    ("mds", "Ministério do Desenvolvimento e Assistência Social, Família e Combate à Fome", "MDS"),
    ("mdic", "Ministério do Desenvolvimento, Indústria, Comércio e Serviços", "MDIC"),
    ("mdhc", "Ministério dos Direitos Humanos e da Cidadania", "MDHC"),
    ("mec", "Ministério da Educação", "MEC"),
    ("memp", "Ministério do Empreendedorismo, da Microempresa e da Empresa de Pequeno Porte", "MEMP"),
    ("mesp", "Ministério do Esporte", "MEsp"),
    ("mf", "Ministério da Fazenda", "MF"),
    ("mgi", "Ministério da Gestão e da Inovação em Serviços Públicos", "MGI"),
    ("mir", "Ministério da Igualdade Racial", "MIR"),
    ("midr", "Ministério da Integração e do Desenvolvimento Regional", "MIDR"),
    ("mjsp", "Ministério da Justiça e Segurança Pública", "MJSP"),
    ("mma", "Ministério do Meio Ambiente e Mudança do Clima", "MMA"),
    ("mme", "Ministério de Minas e Energia", "MME"),
    ("mmulheres", "Ministério das Mulheres", "MMulheres"),
    ("mpa", "Ministério da Pesca e Aquicultura", "MPA"),
    ("mpo", "Ministério do Planejamento e Orçamento", "MPO"),
    ("mpor", "Ministério de Portos e Aeroportos", "MPor"),
    ("mps", "Ministério da Previdência Social", "MPS"),
    ("mre", "Ministério das Relações Exteriores", "MRE"),
    ("ms", "Ministério da Saúde", "MS"),
    ("mte", "Ministério do Trabalho e Emprego", "MTE"),
    ("mt", "Ministério dos Transportes", "MT"),
    ("mtur", "Ministério do Turismo", "MTur"),
    ("mpi", "Ministério dos Povos Indígenas", "MPI"),
]
for id, nome, sigla in MINISTERIOS:
    no(id, nome, "ministerio", "executivo", pai="pr", sigla=sigla,
       cargo="Ministro(a) de Estado",
       lei="Lei 14.720/2023" if id == "memp" else "Lei 14.600/2023, art. 20",
       fonte="https://www.gov.br/planalto/pt-br/conheca-a-presidencia/ministros")

# Entidades vinculadas e órgãos relevantes por ministério
V = "vinculada a"
# MAPA
no("embrapa", "Empresa Brasileira de Pesquisa Agropecuária", "empresa_publica", "executivo", pai="mapa", sigla="Embrapa", cargo="Presidente")
no("inmet", "Instituto Nacional de Meteorologia", "orgao", "executivo", pai="mapa", sigla="INMET", cargo="Diretor(a)")
# Cidades
no("cbtu", "Companhia Brasileira de Trens Urbanos", "empresa_publica", "executivo", pai="mcid", sigla="CBTU", cargo="Presidente")
no("trensurb", "Empresa de Trens Urbanos de Porto Alegre", "empresa_publica", "executivo", pai="mcid", sigla="Trensurb", cargo="Presidente")
# MCTI
no("cnpq", "Conselho Nacional de Desenvolvimento Científico e Tecnológico", "fundacao", "executivo", pai="mcti", sigla="CNPq", cargo="Presidente")
no("finep", "Financiadora de Estudos e Projetos", "empresa_publica", "executivo", pai="mcti", sigla="Finep", cargo="Presidente")
no("aeb", "Agência Espacial Brasileira", "autarquia", "executivo", pai="mcti", sigla="AEB", cargo="Presidente")
no("cnen", "Comissão Nacional de Energia Nuclear", "autarquia", "executivo", pai="mcti", sigla="CNEN", cargo="Presidente")
no("inpe", "Instituto Nacional de Pesquisas Espaciais", "orgao", "executivo", pai="mcti", sigla="INPE", cargo="Diretor(a)")
# Comunicações
no("anatel", "Agência Nacional de Telecomunicações", "agencia_reguladora", "executivo", pai="mcom", sigla="Anatel", cargo="Presidente", lei="Lei 9.472/1997")
no("correios", "Empresa Brasileira de Correios e Telégrafos", "empresa_publica", "executivo", pai="mcom", sigla="Correios", cargo="Presidente")
no("telebras", "Telecomunicações Brasileiras S.A.", "sociedade_economia_mista", "executivo", pai="mcom", sigla="Telebras", cargo="Presidente")
# Cultura
no("ancine", "Agência Nacional do Cinema", "agencia_reguladora", "executivo", pai="minc", sigla="Ancine", cargo="Diretor(a)-Presidente", lei="MP 2.228-1/2001")
no("iphan", "Instituto do Patrimônio Histórico e Artístico Nacional", "autarquia", "executivo", pai="minc", sigla="Iphan", cargo="Presidente")
no("funarte", "Fundação Nacional de Artes", "fundacao", "executivo", pai="minc", sigla="Funarte", cargo="Presidente")
no("fbn", "Fundação Biblioteca Nacional", "fundacao", "executivo", pai="minc", sigla="FBN", cargo="Presidente")
no("fcrb", "Fundação Casa de Rui Barbosa", "fundacao", "executivo", pai="minc", sigla="FCRB", cargo="Presidente")
no("palmares", "Fundação Cultural Palmares", "fundacao", "executivo", pai="minc", sigla="FCP", cargo="Presidente")
# Defesa
no("marinha", "Comando da Marinha", "forca_armada", "executivo", pai="md", sigla="MB", cargo="Comandante da Marinha", lei="CF, art. 142; LC 97/1999")
no("exercito", "Comando do Exército", "forca_armada", "executivo", pai="md", sigla="EB", cargo="Comandante do Exército", lei="CF, art. 142; LC 97/1999")
no("aeronautica", "Comando da Aeronáutica", "forca_armada", "executivo", pai="md", sigla="FAB", cargo="Comandante da Aeronáutica", lei="CF, art. 142; LC 97/1999")
no("amazul", "Amazônia Azul Tecnologias de Defesa", "empresa_publica", "executivo", pai="md", sigla="Amazul", cargo="Presidente")
no("imbel", "Indústria de Material Bélico do Brasil", "empresa_publica", "executivo", pai="md", sigla="Imbel", cargo="Presidente")
no("emgepron", "Empresa Gerencial de Projetos Navais", "empresa_publica", "executivo", pai="md", sigla="Emgepron", cargo="Presidente")
# MDA
no("incra", "Instituto Nacional de Colonização e Reforma Agrária", "autarquia", "executivo", pai="mda", sigla="Incra", cargo="Presidente")
no("conab", "Companhia Nacional de Abastecimento", "empresa_publica", "executivo", pai="mda", sigla="Conab", cargo="Presidente")
# MDIC
no("inmetro", "Instituto Nacional de Metrologia, Qualidade e Tecnologia", "autarquia", "executivo", pai="mdic", sigla="Inmetro", cargo="Presidente")
no("inpi", "Instituto Nacional da Propriedade Industrial", "autarquia", "executivo", pai="mdic", sigla="INPI", cargo="Presidente")
no("suframa", "Superintendência da Zona Franca de Manaus", "autarquia", "executivo", pai="mdic", sigla="Suframa", cargo="Superintendente")
no("bndes", "Banco Nacional de Desenvolvimento Econômico e Social", "empresa_publica", "executivo", pai="mdic", sigla="BNDES", cargo="Presidente", site="https://www.bndes.gov.br")
no("apex", "Agência Brasileira de Promoção de Exportações e Investimentos", "servico_social_autonomo", "executivo", pai="mdic", sigla="ApexBrasil", cargo="Presidente", relacao="supervisionada por")
# MEC
no("inep", "Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira", "autarquia", "executivo", pai="mec", sigla="Inep", cargo="Presidente")
no("capes", "Coordenação de Aperfeiçoamento de Pessoal de Nível Superior", "fundacao", "executivo", pai="mec", sigla="Capes", cargo="Presidente")
no("fnde", "Fundo Nacional de Desenvolvimento da Educação", "autarquia", "executivo", pai="mec", sigla="FNDE", cargo="Presidente")
no("ebserh", "Empresa Brasileira de Serviços Hospitalares", "empresa_publica", "executivo", pai="mec", sigla="Ebserh", cargo="Presidente")
no("universidades", "Universidades federais", "grupo", "executivo", pai="mec", quantidade=69,
   descricao="Autarquias e fundações de ensino superior vinculadas ao MEC. Cada uma tem reitor(a) escolhido por lista tríplice e nomeado pelo Presidente da República.",
   fonte="https://estruturaorganizacional.dados.gov.br")
no("institutos-federais", "Rede Federal de Educação Profissional, Científica e Tecnológica", "grupo", "executivo", pai="mec", quantidade=41,
   descricao="Institutos Federais, Cefets e Colégio Pedro II (Lei 11.892/2008).", lei="Lei 11.892/2008")
# Fazenda
no("rfb", "Secretaria Especial da Receita Federal do Brasil", "orgao", "executivo", pai="mf", sigla="RFB", cargo="Secretário(a) Especial", relacao="integra")
no("stn", "Secretaria do Tesouro Nacional", "orgao", "executivo", pai="mf", sigla="STN", cargo="Secretário(a)", relacao="integra")
no("pgfn", "Procuradoria-Geral da Fazenda Nacional", "orgao", "executivo", pai="mf", sigla="PGFN", cargo="Procurador(a)-Geral", relacao="integra")
no("cmn", "Conselho Monetário Nacional", "orgao", "executivo", pai="mf", sigla="CMN", relacao="integra",
   descricao="Órgão superior do Sistema Financeiro Nacional, presidido pelo Ministro da Fazenda (Lei 4.595/1964).")
no("bcb", "Banco Central do Brasil", "autarquia", "executivo", pai="mf", sigla="BCB", cargo="Presidente",
   ocupante="Gabriel Galípolo", desde="2025-01-01", mandato_ate="2028-12-31", verificado_em="2025-01",
   fonte="https://www12.senado.leg.br/noticias/materias/2024/10/08/senado-aprova-gabriel-galipolo-para-presidir-banco-central",
   lei="Lei 4.595/1964; LC 179/2021",
   descricao="Autarquia de natureza especial com autonomia técnica, operacional e financeira. Presidente e diretores têm mandatos fixos, aprovados pelo Senado.",
   site="https://www.bcb.gov.br")
no("cvm", "Comissão de Valores Mobiliários", "autarquia", "executivo", pai="mf", sigla="CVM", cargo="Presidente", lei="Lei 6.385/1976")
no("susep", "Superintendência de Seguros Privados", "autarquia", "executivo", pai="mf", sigla="Susep", cargo="Superintendente")
no("bb", "Banco do Brasil S.A.", "sociedade_economia_mista", "executivo", pai="mf", sigla="BB", cargo="Presidente")
no("caixa", "Caixa Econômica Federal", "empresa_publica", "executivo", pai="mf", sigla="Caixa", cargo="Presidente")
no("bnb", "Banco do Nordeste do Brasil S.A.", "sociedade_economia_mista", "executivo", pai="mf", sigla="BNB", cargo="Presidente")
no("basa", "Banco da Amazônia S.A.", "sociedade_economia_mista", "executivo", pai="mf", sigla="Basa", cargo="Presidente")
no("cmb", "Casa da Moeda do Brasil", "empresa_publica", "executivo", pai="mf", sigla="CMB", cargo="Presidente")
# MGI
no("enap", "Fundação Escola Nacional de Administração Pública", "fundacao", "executivo", pai="mgi", sigla="Enap", cargo="Presidente")
no("serpro", "Serviço Federal de Processamento de Dados", "empresa_publica", "executivo", pai="mgi", sigla="Serpro", cargo="Presidente")
no("dataprev", "Empresa de Tecnologia e Informações da Previdência", "empresa_publica", "executivo", pai="mgi", sigla="Dataprev", cargo="Presidente")
# MIDR
no("ana", "Agência Nacional de Águas e Saneamento Básico", "agencia_reguladora", "executivo", pai="midr", sigla="ANA", cargo="Diretor(a)-Presidente", lei="Lei 9.984/2000")
no("dnocs", "Departamento Nacional de Obras Contra as Secas", "autarquia", "executivo", pai="midr", sigla="DNOCS", cargo="Diretor(a)-Geral")
no("codevasf", "Companhia de Desenvolvimento dos Vales do São Francisco e do Parnaíba", "empresa_publica", "executivo", pai="midr", sigla="Codevasf", cargo="Presidente")
no("sudam", "Superintendência do Desenvolvimento da Amazônia", "autarquia", "executivo", pai="midr", sigla="Sudam", cargo="Superintendente")
no("sudene", "Superintendência do Desenvolvimento do Nordeste", "autarquia", "executivo", pai="midr", sigla="Sudene", cargo="Superintendente")
no("sudeco", "Superintendência do Desenvolvimento do Centro-Oeste", "autarquia", "executivo", pai="midr", sigla="Sudeco", cargo="Superintendente")
# MJSP
no("pf", "Polícia Federal", "orgao", "executivo", pai="mjsp", sigla="PF", cargo="Diretor(a)-Geral", lei="CF, art. 144, I", relacao="integra")
no("prf", "Polícia Rodoviária Federal", "orgao", "executivo", pai="mjsp", sigla="PRF", cargo="Diretor(a)-Geral", lei="CF, art. 144, II", relacao="integra")
no("senappen", "Secretaria Nacional de Políticas Penais", "orgao", "executivo", pai="mjsp", sigla="Senappen", cargo="Secretário(a) Nacional", relacao="integra")
no("cade", "Conselho Administrativo de Defesa Econômica", "autarquia", "executivo", pai="mjsp", sigla="CADE", cargo="Presidente", lei="Lei 12.529/2011")
# MMA
no("ibama", "Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis", "autarquia", "executivo", pai="mma", sigla="Ibama", cargo="Presidente")
no("icmbio", "Instituto Chico Mendes de Conservação da Biodiversidade", "autarquia", "executivo", pai="mma", sigla="ICMBio", cargo="Presidente")
no("jbrj", "Instituto de Pesquisas Jardim Botânico do Rio de Janeiro", "autarquia", "executivo", pai="mma", sigla="JBRJ", cargo="Presidente")
no("sfb", "Serviço Florestal Brasileiro", "orgao", "executivo", pai="mma", sigla="SFB", cargo="Diretor(a)-Geral", relacao="integra")
# MME
no("anp", "Agência Nacional do Petróleo, Gás Natural e Biocombustíveis", "agencia_reguladora", "executivo", pai="mme", sigla="ANP", cargo="Diretor(a)-Geral", lei="Lei 9.478/1997")
no("aneel", "Agência Nacional de Energia Elétrica", "agencia_reguladora", "executivo", pai="mme", sigla="Aneel", cargo="Diretor(a)-Geral", lei="Lei 9.427/1996")
no("anm", "Agência Nacional de Mineração", "agencia_reguladora", "executivo", pai="mme", sigla="ANM", cargo="Diretor(a)-Geral", lei="Lei 13.575/2017")
no("epe", "Empresa de Pesquisa Energética", "empresa_publica", "executivo", pai="mme", sigla="EPE", cargo="Presidente")
no("petrobras", "Petróleo Brasileiro S.A.", "sociedade_economia_mista", "executivo", pai="mme", sigla="Petrobras", cargo="Presidente")
no("ppsa", "Pré-Sal Petróleo S.A.", "empresa_publica", "executivo", pai="mme", sigla="PPSA", cargo="Presidente")
no("sgb", "Serviço Geológico do Brasil", "empresa_publica", "executivo", pai="mme", sigla="SGB-CPRM", cargo="Presidente")
no("enbpar", "Empresa Brasileira de Participações em Energia Nuclear e Binacional", "empresa_publica", "executivo", pai="mme", sigla="ENBPar", cargo="Presidente",
   descricao="Controla a Eletronuclear e a participação brasileira em Itaipu após a privatização da Eletrobras (2022).")
# MPO
no("ibge", "Fundação Instituto Brasileiro de Geografia e Estatística", "fundacao", "executivo", pai="mpo", sigla="IBGE", cargo="Presidente", site="https://www.ibge.gov.br")
no("ipea", "Fundação Instituto de Pesquisa Econômica Aplicada", "fundacao", "executivo", pai="mpo", sigla="Ipea", cargo="Presidente")
# MPor
no("antaq", "Agência Nacional de Transportes Aquaviários", "agencia_reguladora", "executivo", pai="mpor", sigla="Antaq", cargo="Diretor(a)-Geral", lei="Lei 10.233/2001")
no("anac", "Agência Nacional de Aviação Civil", "agencia_reguladora", "executivo", pai="mpor", sigla="Anac", cargo="Diretor(a)-Presidente", lei="Lei 11.182/2005")
no("infraero", "Empresa Brasileira de Infraestrutura Aeroportuária", "empresa_publica", "executivo", pai="mpor", sigla="Infraero", cargo="Presidente")
no("docas", "Companhias Docas", "grupo", "executivo", pai="mpor", quantidade=7,
   descricao="Autoridades portuárias federais (sociedades de economia mista): Santos, Rio de Janeiro, Espírito Santo, Bahia, Ceará, Pará e Rio Grande do Norte.")
# MPS
no("inss", "Instituto Nacional do Seguro Social", "autarquia", "executivo", pai="mps", sigla="INSS", cargo="Presidente", site="https://www.gov.br/inss")
no("previc", "Superintendência Nacional de Previdência Complementar", "autarquia", "executivo", pai="mps", sigla="Previc", cargo="Diretor(a)-Superintendente")
# MRE
no("funag", "Fundação Alexandre de Gusmão", "fundacao", "executivo", pai="mre", sigla="Funag", cargo="Presidente")
# Saúde
no("anvisa", "Agência Nacional de Vigilância Sanitária", "agencia_reguladora", "executivo", pai="ms", sigla="Anvisa", cargo="Diretor(a)-Presidente", lei="Lei 9.782/1999", site="https://www.gov.br/anvisa")
no("ans", "Agência Nacional de Saúde Suplementar", "agencia_reguladora", "executivo", pai="ms", sigla="ANS", cargo="Diretor(a)-Presidente", lei="Lei 9.961/2000")
no("fiocruz", "Fundação Oswaldo Cruz", "fundacao", "executivo", pai="ms", sigla="Fiocruz", cargo="Presidente", site="https://portal.fiocruz.br")
no("funasa", "Fundação Nacional de Saúde", "fundacao", "executivo", pai="ms", sigla="Funasa", cargo="Presidente")
no("hemobras", "Empresa Brasileira de Hemoderivados e Biotecnologia", "empresa_publica", "executivo", pai="ms", sigla="Hemobrás", cargo="Presidente")
no("ghc", "Grupo Hospitalar Conceição", "sociedade_economia_mista", "executivo", pai="ms", sigla="GHC", cargo="Presidente")
no("inca", "Instituto Nacional de Câncer", "orgao", "executivo", pai="ms", sigla="INCA", cargo="Diretor(a)-Geral", relacao="integra")
# Trabalho
no("fundacentro", "Fundação Jorge Duprat Figueiredo de Segurança e Medicina do Trabalho", "fundacao", "executivo", pai="mte", sigla="Fundacentro", cargo="Presidente")
# Transportes
no("antt", "Agência Nacional de Transportes Terrestres", "agencia_reguladora", "executivo", pai="mt", sigla="ANTT", cargo="Diretor(a)-Geral", lei="Lei 10.233/2001")
no("dnit", "Departamento Nacional de Infraestrutura de Transportes", "autarquia", "executivo", pai="mt", sigla="DNIT", cargo="Diretor(a)-Geral")
no("infra-sa", "Infra S.A.", "empresa_publica", "executivo", pai="mt", sigla="Infra S.A.", cargo="Presidente",
   descricao="Resultado da incorporação da EPL pela Valec (2022). Planejamento e infraestrutura ferroviária.")
# Turismo
no("embratur", "Agência Brasileira de Promoção Internacional do Turismo", "servico_social_autonomo", "executivo", pai="mtur", sigla="Embratur", cargo="Presidente", relacao="supervisionada por")
# Povos Indígenas
no("funai", "Fundação Nacional dos Povos Indígenas", "fundacao", "executivo", pai="mpi", sigla="Funai", cargo="Presidente")

# Segundo nível: secretarias finalísticas de alguns ministérios, conforme os
# decretos de estrutura regimental. O montar_grafo.py completa os demais a
# partir do SIORG quando o cache existir.
SECRETARIAS = {
    "ms": ("Decreto 11.798/2023", [
        ("saps", "Secretaria de Atenção Primária à Saúde", "SAPS"),
        ("saes", "Secretaria de Atenção Especializada à Saúde", "SAES"),
        ("svsa", "Secretaria de Vigilância em Saúde e Ambiente", "SVSA"),
        ("sgtes", "Secretaria de Gestão do Trabalho e da Educação na Saúde", "SGTES"),
        ("sectics", "Secretaria de Ciência, Tecnologia, Inovação e Complexo Econômico-Industrial da Saúde", "SECTICS"),
        ("seidigi", "Secretaria de Informação e Saúde Digital", "SEIDIGI"),
        ("sesai", "Secretaria de Saúde Indígena", "SESAI"),
    ]),
    "mec": ("Decreto 11.342/2023", [
        ("seb", "Secretaria de Educação Básica", "SEB"),
        ("sesu", "Secretaria de Educação Superior", "SESu"),
        ("setec", "Secretaria de Educação Profissional e Tecnológica", "SETEC"),
        ("secadi", "Secretaria de Educação Continuada, Alfabetização de Jovens e Adultos, Diversidade e Inclusão", "SECADI"),
        ("seres", "Secretaria de Regulação e Supervisão da Educação Superior", "SERES"),
        ("sase", "Secretaria de Articulação Intersetorial e com os Sistemas de Ensino", "SASE"),
    ]),
    "mjsp": ("Decreto 11.348/2023", [
        ("senasp", "Secretaria Nacional de Segurança Pública", "Senasp"),
        ("senad", "Secretaria Nacional de Políticas sobre Drogas e Ativos", "Senad"),
        ("senacon", "Secretaria Nacional do Consumidor", "Senacon"),
        ("senajus", "Secretaria Nacional de Justiça", "Senajus"),
        ("sal", "Secretaria de Assuntos Legislativos", "SAL"),
    ]),
}
for pai, (decreto, lista) in SECRETARIAS.items():
    for id, nome, sigla in lista:
        no(id, nome, "orgao", "executivo", pai=pai, sigla=sigla, cargo="Secretário(a)",
           lei=decreto, relacao="integra")

# ---------------------------------------------------------------- Legislativo
no("congresso", "Congresso Nacional", "casa_legislativa", "legislativo", pai="leg", sigla="CN",
   cargo="Presidente do Congresso Nacional", ocupante="Davi Alcolumbre",
   desde="2025-02-01", mandato_ate="2027-01-31", verificado_em="2025-02",
   fonte="https://www.congressonacional.leg.br",
   descricao="Sistema bicameral. A Mesa do Congresso é presidida pelo Presidente do Senado (CF, art. 57, § 5º).",
   lei="CF, arts. 44 a 75", site="https://www.congressonacional.leg.br")
no("camara", "Câmara dos Deputados", "casa_legislativa", "legislativo", pai="congresso", sigla="CD",
   cargo="Presidente da Câmara dos Deputados", ocupante="Hugo Motta",
   desde="2025-02-01", mandato_ate="2027-01-31", verificado_em="2025-02",
   fonte="https://www.camara.leg.br", quantidade=513,
   descricao="513 deputados federais, representantes do povo, mandato de quatro anos (CF, art. 45).",
   site="https://www.camara.leg.br")
no("senado", "Senado Federal", "casa_legislativa", "legislativo", pai="congresso", sigla="SF",
   cargo="Presidente do Senado Federal", ocupante="Davi Alcolumbre",
   desde="2025-02-01", mandato_ate="2027-01-31", verificado_em="2025-02",
   fonte="https://www.senado.leg.br", quantidade=81,
   descricao="81 senadores, três por estado e pelo DF, mandato de oito anos (CF, art. 46).",
   site="https://www.senado.leg.br")
no("tcu", "Tribunal de Contas da União", "tribunal", "legislativo", pai="congresso", sigla="TCU",
   cargo="Presidente", quantidade=9, relacao="auxiliado por",
   ocupante="Vital do Rêgo", desde="2025-01-01", mandato_ate="2026-12-31", verificado_em="2025-12",
   fonte="https://portal.tcu.gov.br/imprensa/noticias/vital-do-rego-e-jorge-oliveira-sao-reeleitos-presidente-e-vice-presidente-do-tcu",
   descricao="Controle externo da administração federal, em auxílio ao Congresso. Nove ministros: um terço escolhido pelo Presidente da República (com aprovação do Senado), dois terços pelo Congresso (CF, arts. 71 a 73).",
   lei="CF, arts. 70 a 75; Lei 8.443/1992", site="https://portal.tcu.gov.br")

# ---------------------------------------------------------------- Judiciário
no("stf", "Supremo Tribunal Federal", "tribunal", "judiciario", pai="jud", sigla="STF",
   cargo="Presidente", ocupante="Edson Fachin", desde="2025-09-29", mandato_ate="2027-09",
   verificado_em="2025-09", fonte="https://portal.stf.jus.br", quantidade=11,
   descricao="Guarda da Constituição. Onze ministros nomeados pelo Presidente da República após aprovação do Senado (CF, arts. 101 a 103).",
   lei="CF, arts. 101 a 103", site="https://portal.stf.jus.br")
no("cnj", "Conselho Nacional de Justiça", "orgao", "judiciario", pai="jud", sigla="CNJ",
   cargo="Presidente (o Presidente do STF)", ocupante="Edson Fachin", desde="2025-09-29", mandato_ate="2027-09",
   verificado_em="2025-09", fonte="https://www.cnj.jus.br", quantidade=15,
   descricao="Controle da atuação administrativa e financeira do Judiciário. Presidido pelo Presidente do STF (CF, art. 103-B).",
   lei="CF, art. 103-B", site="https://www.cnj.jus.br")
no("stj", "Superior Tribunal de Justiça", "tribunal", "judiciario", pai="jud", sigla="STJ",
   cargo="Presidente", quantidade=33, ocupante="Luis Felipe Salomão", desde="2026-08-19", mandato_ate="2028-08",
   verificado_em="2026-08", fonte="https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2026/19082026-Luis-Felipe-Salomao-assume-presidencia-do-STJ-com-foco-em-retomada-da-vocacao-da-corte.aspx",
   descricao="Uniformiza a interpretação da lei federal. Trinta e três ministros (CF, arts. 104 e 105).",
   lei="CF, arts. 104 e 105", site="https://www.stj.jus.br")
no("cjf", "Conselho da Justiça Federal", "orgao", "judiciario", pai="stj", sigla="CJF",
   cargo="Presidente (o Presidente do STJ)", ocupante="Luis Felipe Salomão", desde="2026-08-19", mandato_ate="2028-08",
   verificado_em="2026-08", fonte="https://www.stj.jus.br",
   descricao="Supervisão administrativa e orçamentária da Justiça Federal de primeiro e segundo graus. Funciona junto ao STJ (CF, art. 105, parágrafo único).")
no("trfs", "Tribunais Regionais Federais", "grupo", "judiciario", pai="cjf", quantidade=6,
   descricao="TRF1 (Brasília), TRF2 (Rio de Janeiro), TRF3 (São Paulo), TRF4 (Porto Alegre), TRF5 (Recife) e TRF6 (Belo Horizonte), com as seções judiciárias federais em cada estado.",
   lei="CF, arts. 106 a 110")
no("tst", "Tribunal Superior do Trabalho", "tribunal", "judiciario", pai="jud", sigla="TST",
   cargo="Presidente", quantidade=27, fonte="https://www.tst.jus.br",
   descricao="Cúpula da Justiça do Trabalho. Vinte e sete ministros (CF, art. 111-A).",
   lei="CF, arts. 111 a 116", site="https://www.tst.jus.br")
no("csjt", "Conselho Superior da Justiça do Trabalho", "orgao", "judiciario", pai="tst", sigla="CSJT",
   descricao="Supervisão administrativa e orçamentária da Justiça do Trabalho de primeiro e segundo graus (CF, art. 111-A, § 2º, II).")
no("trts", "Tribunais Regionais do Trabalho", "grupo", "judiciario", pai="csjt", quantidade=24,
   descricao="Vinte e quatro TRTs e as varas do trabalho.")
no("tse", "Tribunal Superior Eleitoral", "tribunal", "judiciario", pai="jud", sigla="TSE",
   cargo="Presidente", quantidade=7, ocupante="Nunes Marques", desde="2026-05-12", mandato_ate="2027-05",
   verificado_em="2026-05", fonte="https://www.tse.jus.br/comunicacao/noticias/2026/Maio/ao-tomar-posse-na-presidencia-do-tse-nunes-marques-defende-a-vontade-soberana-do-povo-nas-urnas",
   descricao="Sete ministros: três do STF, dois do STJ e dois advogados nomeados pelo Presidente da República (CF, art. 119).",
   lei="CF, arts. 118 a 121", site="https://www.tse.jus.br")
no("tres", "Tribunais Regionais Eleitorais", "grupo", "judiciario", pai="tse", quantidade=27,
   descricao="Um TRE em cada estado e no Distrito Federal (CF, art. 120).")
no("stm", "Superior Tribunal Militar", "tribunal", "judiciario", pai="jud", sigla="STM",
   cargo="Presidente", quantidade=15, fonte="https://www.stm.jus.br",
   descricao="Quinze ministros vitalícios nomeados pelo Presidente da República após aprovação do Senado (CF, art. 123).",
   lei="CF, arts. 122 a 124", site="https://www.stm.jus.br")

# ---------------------------------------------------------------- Funções essenciais
no("mpu", "Ministério Público da União", "orgao", "essencial", pai="fej", sigla="MPU",
   cargo="Procurador(a)-Geral da República", ocupante="Paulo Gonet", desde="2023-12-18", mandato_ate="2027-12",
   verificado_em="2025-11",
   fonte="https://www12.senado.leg.br/noticias/materias/2025/11/12/por-45-votos-a-26-senado-aprova-reconducao-de-gonet",
   descricao="Chefiado pelo Procurador-Geral da República, nomeado pelo Presidente entre integrantes da carreira, após aprovação do Senado, para mandato de dois anos (CF, art. 128).",
   lei="CF, arts. 127 a 130-A; LC 75/1993")
no("mpf", "Ministério Público Federal", "orgao", "essencial", pai="mpu", sigla="MPF", site="https://www.mpf.mp.br")
no("mpt", "Ministério Público do Trabalho", "orgao", "essencial", pai="mpu", sigla="MPT", cargo="Procurador(a)-Geral do Trabalho")
no("mpm", "Ministério Público Militar", "orgao", "essencial", pai="mpu", sigla="MPM", cargo="Procurador(a)-Geral de Justiça Militar")
no("mpdft", "Ministério Público do Distrito Federal e Territórios", "orgao", "essencial", pai="mpu", sigla="MPDFT", cargo="Procurador(a)-Geral de Justiça")
no("cnmp", "Conselho Nacional do Ministério Público", "orgao", "essencial", pai="fej", sigla="CNMP",
   cargo="Presidente (o Procurador-Geral da República)", ocupante="Paulo Gonet", desde="2023-12-18", mandato_ate="2027-12",
   verificado_em="2025-11", fonte="https://www.cnmp.mp.br", quantidade=14, descricao="Controle administrativo e financeiro do Ministério Público. Presidido pelo Procurador-Geral da República (CF, art. 130-A).",
   lei="CF, art. 130-A")
no("dpu", "Defensoria Pública da União", "orgao", "essencial", pai="fej", sigla="DPU",
   cargo="Defensor(a) Público-Geral Federal", fonte="https://www.dpu.def.br",
   descricao="Assistência jurídica integral e gratuita aos necessitados na esfera federal (CF, art. 134).",
   lei="CF, art. 134; LC 80/1994", site="https://www.dpu.def.br")

# ---------------------------------------------------------------- relações não hierárquicas
liga("pr", "stf", "nomeia", "Nomeia os ministros do STF, após aprovação do Senado (CF, art. 101).")
liga("senado", "stf", "aprova", "Aprova por maioria absoluta a indicação dos ministros do STF (CF, art. 52, III, a).")
liga("pr", "stj", "nomeia", "Nomeia os ministros do STJ, após aprovação do Senado (CF, art. 104).")
liga("senado", "stj", "aprova", "Aprova a indicação dos ministros do STJ (CF, art. 104).")
liga("pr", "tst", "nomeia", "Nomeia os ministros do TST, após aprovação do Senado (CF, art. 111-A).")
liga("pr", "stm", "nomeia", "Nomeia os ministros do STM, após aprovação do Senado (CF, art. 123).")
liga("pr", "tse", "nomeia", "Nomeia dois ministros advogados, indicados pelo STF (CF, art. 119, II).")
liga("stf", "tse", "elege", "Elege três de seus ministros para o TSE (CF, art. 119, I, a).")
liga("stj", "tse", "elege", "Elege dois de seus ministros para o TSE (CF, art. 119, I, b).")
liga("stf", "cnj", "preside", "O Presidente do STF preside o CNJ (CF, art. 103-B, § 1º).")
liga("cnj", "jud", "controla", "Controle administrativo e financeiro do Judiciário e do cumprimento dos deveres dos juízes.")
liga("pr", "mpu", "nomeia", "Nomeia o Procurador-Geral da República, após aprovação do Senado (CF, art. 128, § 1º).")
liga("senado", "mpu", "aprova", "Aprova a indicação do Procurador-Geral da República (CF, art. 52, III, e).")
liga("mpu", "cnmp", "preside", "O Procurador-Geral da República preside o CNMP (CF, art. 130-A, I).")
liga("cnmp", "mpu", "controla", "Controle administrativo e financeiro do Ministério Público.")
liga("pr", "tcu", "nomeia", "Escolhe um terço dos ministros do TCU, com aprovação do Senado (CF, art. 73, § 2º, I).")
liga("congresso", "tcu", "escolhe", "Escolhe dois terços dos ministros do TCU (CF, art. 73, § 2º, II).")
liga("tcu", "exec", "fiscaliza", "Controle externo: julga contas, aprecia a legalidade de admissões e aposentadorias, fiscaliza contratos (CF, art. 71).")
liga("tcu", "jud", "fiscaliza", "O controle externo alcança todos os Poderes e entidades da administração federal (CF, art. 70).")
liga("tcu", "leg", "fiscaliza", "Inclusive as Casas do Congresso.")
liga("congresso", "pr", "fiscaliza", "Fiscalização e controle dos atos do Executivo, inclusive da administração indireta (CF, art. 49, X).")
liga("congresso", "exec", "orcamento", "Aprova o PPA, a LDO e a LOA enviados pelo Presidente (CF, art. 166).")
liga("pr", "bcb", "nomeia", "Nomeia presidente e diretores para mandatos fixos de quatro anos, após aprovação do Senado (LC 179/2021).")
liga("senado", "bcb", "aprova", "Aprova a indicação do presidente e dos diretores do Banco Central (CF, art. 52, III, d).")
liga("cgu", "exec", "controla", "Controle interno do Poder Executivo federal (CF, art. 74).")
liga("agu", "uniao", "representa", "Representa a União judicial e extrajudicialmente (CF, art. 131).")
liga("agu", "fej", "integra", "Constitucionalmente, a Advocacia Pública é função essencial à Justiça (CF, arts. 131 e 132).")
liga("cmn", "bcb", "orienta", "O CMN fixa as diretrizes da política monetária, executadas pelo Banco Central.")
liga("mf", "cmn", "preside", "O Ministro da Fazenda preside o CMN (Lei 4.595/1964).")
liga("mpi", "funai", "vinculada a", "A Funai passou do MJSP para o novo Ministério dos Povos Indígenas em 2023.")
for ag in ["anatel", "ancine", "ana", "anp", "aneel", "anm", "antaq", "anac", "antt", "anvisa", "ans"]:
    liga("senado", ag, "aprova", "Aprova a indicação dos dirigentes das agências reguladoras (CF, art. 52, III, f; Lei 13.848/2019).")
    liga("pr", ag, "nomeia", "Nomeia os dirigentes para mandatos fixos de cinco anos (Lei 13.848/2019).")

# A ligação MPI->Funai já existe como hierárquica; remove a duplicata explicativa
arestas[:] = [a for a in arestas if not (a["de"] == "mpi" and a["para"] == "funai" and not a["hierarquica"])]
for n in nos:
    if n["id"] == "funai":
        n["descricao"] = "Transferida do MJSP para o Ministério dos Povos Indígenas em 2023 (Lei 14.600/2023)."

# ---------------------------------------------------------------- validação
ids = {n["id"] for n in nos}
for a in arestas:
    for k in ("de", "para"):
        if a[k] not in ids:
            raise SystemExit(f"aresta aponta para id inexistente: {a}")

TIPOS = {
    "raiz": "União", "poder": "Poder", "orgao": "Órgão", "ministerio": "Ministério",
    "autarquia": "Autarquia", "agencia_reguladora": "Agência reguladora", "fundacao": "Fundação pública",
    "empresa_publica": "Empresa pública", "sociedade_economia_mista": "Sociedade de economia mista",
    "servico_social_autonomo": "Serviço social autônomo", "forca_armada": "Força Armada",
    "tribunal": "Tribunal", "casa_legislativa": "Casa legislativa", "grupo": "Conjunto de entidades",
}
PODERES = {
    "uniao": "União", "executivo": "Executivo", "legislativo": "Legislativo",
    "judiciario": "Judiciário", "essencial": "Funções essenciais à Justiça",
}
for n in nos:
    assert n["tipo"] in TIPOS, n
    assert n["poder"] in PODERES, n

dados = {
    "meta": {
        "titulo": "Mapa do Governo",
        "site": "https://mapadogoverno.com.br",
        "esfera": "federal",
        "versao": "0.1.0",
        "gerado_por": "scripts/governo/semente.py",
        "aviso": "Semente curada à mão. Estrutura conforme CF/1988 e Lei 14.600/2023. "
                 "Ocupantes de cargo só quando o mandato é fixo e público; os demais "
                 "ficam nulos até a ingestão a partir das fontes oficiais.",
        "fontes": [
            {"nome": "Constituição Federal de 1988", "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"},
            {"nome": "Lei 14.600/2023 (organização básica dos órgãos da Presidência e dos Ministérios)", "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/L14600.htm"},
            {"nome": "SIORG, Sistema de Informações Organizacionais do Governo Federal", "url": "https://estruturaorganizacional.dados.gov.br"},
            {"nome": "Dados Abertos da Câmara dos Deputados", "url": "https://dadosabertos.camara.leg.br"},
            {"nome": "Dados Abertos do Senado Federal", "url": "https://www12.senado.leg.br/dados-abertos"},
        ],
        "tipos": TIPOS,
        "poderes": PODERES,
        "situacoes": SITUACOES,
    },
    "nos": nos,
    "arestas": arestas,
}

if __name__ == "__main__":
    texto = json.dumps(dados, ensure_ascii=False, indent=1)
    if "--stdout" in sys.argv:
        print(texto)
    else:
        SAIDA.parent.mkdir(parents=True, exist_ok=True)
        SAIDA.write_text(texto + "\n", encoding="utf-8")
        print(f"{len(nos)} nós, {len(arestas)} arestas -> {SAIDA.relative_to(RAIZ)}")
