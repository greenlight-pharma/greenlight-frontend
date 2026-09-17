#!/usr/bin/env python3
"""
Gera a camada estadual e municipal do Mapa do Governo:

  governo/dados/estados/<UF>.json     um grafo por unidade da Federação
  governo/dados/indice-municipios.json índice compacto para a busca global

Cada arquivo estadual tem o estado como raiz e, abaixo dele, as instituições
que a Constituição garante em todo estado (arts. 25 a 32, 75, 96, 125, 128,
134 e 144): Governo (com Polícia Militar, Polícia Civil e Secretaria de
Saúde), Assembleia Legislativa, Tribunal de Justiça, Tribunal de Contas,
Ministério Público, Defensoria Pública, Tribunal Regional Eleitoral e o
conjunto de municípios. O Distrito Federal segue as suas particularidades
(Câmara Legislativa, TJDFT e MPDFT mantidos pela União, sem municípios).

Os municípios vêm de scripts/governo/dados/municipios.csv (ver FONTES.md).
Cada município é um nó; os cargos (prefeito, presidente da Câmara e
secretário de saúde) são iguais para todos e ficam descritos uma vez em
meta.cargos_municipio, expandidos pela página.

Uso:
    python3 scripts/governo/gerar_estados.py
"""
import csv
import json
import sys
import unicodedata
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from ufs import por_sigla  # noqa: E402
from semente import TIPOS, PODERES, SITUACOES  # noqa: E402

RAIZ = AQUI.parents[1]
SAIDA = RAIZ / "governo" / "dados" / "estados"
CSV = AQUI / "dados" / "municipios.csv"

TIPOS = dict(TIPOS, estado="Unidade da Federação", municipio="Município")

CARGOS_MUNICIPIO = [
    {"titulo": "Prefeito(a)", "orgao": "Prefeitura Municipal", "situacao": "nao_verificado", "ocupante": None,
     "fonte": "https://dadosabertos.tse.jus.br"},
    {"titulo": "Presidente da Câmara Municipal", "orgao": "Câmara Municipal", "situacao": "nao_verificado", "ocupante": None},
    {"titulo": "Secretário(a) Municipal de Saúde", "orgao": "Secretaria Municipal de Saúde (gestor municipal do SUS)",
     "situacao": "nao_verificado", "ocupante": None, "fonte": "https://cnes.datasus.gov.br"},
]

# Tribunais de Contas dos Municípios que ainda existem (CF, art. 31, § 4º)
TCM_ESTADUAL = {"BA": "Tribunal de Contas dos Municípios do Estado da Bahia",
                "GO": "Tribunal de Contas dos Municípios do Estado de Goiás",
                "PA": "Tribunal de Contas dos Municípios do Estado do Pará"}
TCM_CAPITAL = {"SP": ("Tribunal de Contas do Município de São Paulo", "3550308"),
               "RJ": ("Tribunal de Contas do Município do Rio de Janeiro", "3304557")}


def norm(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn").lower()


def carregar_municipios():
    por_uf = {}
    with open(CSV, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            por_uf.setdefault(r["uf"], []).append(r)
    return por_uf


def gerar_estado(uf, municipios):
    sig, nome, art = uf["sigla"], uf["nome"], uf["artigo"]
    estado_de = f"{'do Distrito Federal' if sig == 'DF' else 'do Estado ' + art + ' ' + nome}"
    nos, arestas = [], []

    def no(id, nome_, tipo, poder, pai=None, relacao=None, **extra):
        n = {"id": id, "nome": nome_, "tipo": tipo, "poder": poder}
        if pai:
            n["pai"] = pai
            arestas.append({"de": pai, "para": id, "tipo": relacao or "integra", "hierarquica": True})
        n.update({k: v for k, v in extra.items() if v is not None})
        nos.append(n)
        return id

    def cargo(titulo, **k):
        c = {"titulo": titulo, "situacao": "nao_verificado", "ocupante": None, "desde": None,
             "mandato_ate": None, "verificado_em": None, "fonte": None}
        c.update(k)
        return c

    def liga(de, para, tipo, descricao=None):
        a = {"de": de, "para": para, "tipo": tipo, "hierarquica": False}
        if descricao:
            a["descricao"] = descricao
        arestas.append(a)

    raiz = no(f"uf-{sig}", nome, "estado", "uniao", sigla=sig, codigo_ibge=uf["codigo"],
              capital=uf["capital"], regiao=uf["regiao"], quantidade=len(municipios),
              descricao=(f"Unidade da Federação da região {uf['regiao']}. Capital: {uf['capital']}. "
                         f"{len(municipios)} município{'s' if len(municipios) != 1 else ''}. "
                         f"{uf['deputados_federais']} deputados federais e 3 senadores no Congresso."),
              lei="CF, arts. 25 a 28" if sig != "DF" else "CF, art. 32",
              ligacoes_externas=[{"vista": "federal", "id": "estados", "rotulo": "Integra a Federação"},
                                 {"vista": "federal", "id": "senado", "rotulo": "3 senadores no Senado Federal"},
                                 {"vista": "federal", "id": "camara", "rotulo": f"{uf['deputados_federais']} deputados na Câmara"}])

    # Executivo
    gov = no(f"gov-{sig}", f"Governo {estado_de}", "orgao", "executivo", raiz, "compõe",
             sigla=f"Gov. {sig}", cargo=cargo("Governador(a)", fonte="https://dadosabertos.tse.jus.br"),
             descricao="Chefia do Poder Executivo estadual. Mandato de quatro anos, eleição direta (CF, art. 28).",
             lei="CF, art. 28")
    no(f"vgov-{sig}", f"Vice-Governadoria {estado_de}", "orgao", "executivo", gov, sigla="Vice", cargo=cargo("Vice-Governador(a)"))
    ses = no(f"ses-{sig}", f"Secretaria de Estado da Saúde {'do DF' if sig == 'DF' else art + ' ' + nome}", "orgao", "executivo", gov,
             sigla=f"SES-{sig}", cargo=cargo("Secretário(a) de Estado da Saúde"),
             descricao="Gestor estadual do SUS: coordena a rede regional, a regulação e a vigilância em saúde no estado (Lei 8.080/1990).",
             ligacoes_externas=[{"vista": "federal", "id": "ms", "rotulo": "Integra o SUS com o Ministério da Saúde"}])
    no(f"pm-{sig}", f"Polícia Militar {estado_de}", "orgao", "executivo", gov, sigla=f"PM{sig}",
       cargo=cargo("Comandante-Geral"), lei="CF, art. 144, V e § 6º",
       descricao="Policiamento ostensivo e preservação da ordem pública. Força auxiliar e reserva do Exército.")
    no(f"pc-{sig}", f"Polícia Civil {estado_de}", "orgao", "executivo", gov, sigla=f"PC{sig}",
       cargo=cargo("Delegado(a)-Geral"), lei="CF, art. 144, IV", descricao="Polícia judiciária e apuração de infrações penais.")
    no(f"sec-{sig}", "Demais secretarias estaduais", "grupo", "executivo", gov,
       descricao="Educação, Segurança, Fazenda, Infraestrutura e as outras pastas do governo estadual. Ainda não mapeadas individualmente.")

    # Legislativo
    ale_nome = "Câmara Legislativa do Distrito Federal" if sig == "DF" else f"Assembleia Legislativa {estado_de}"
    ale = no(f"ale-{sig}", ale_nome, "casa_legislativa", "legislativo", raiz, "compõe", sigla=uf["ale"],
             quantidade=uf["deputados_estaduais"], cargo=cargo("Presidente"),
             descricao=f"{uf['deputados_estaduais']} deputados {'distritais' if sig == 'DF' else 'estaduais'}, "
                       "mandato de quatro anos (CF, art. 27).", lei="CF, art. 27" if sig != "DF" else "CF, art. 32")
    tce_nome = "Tribunal de Contas do Distrito Federal" if sig == "DF" else f"Tribunal de Contas {estado_de}"
    tce = no(f"tce-{sig}", tce_nome, "tribunal", "legislativo", ale, "auxiliado por",
             sigla="TCDF" if sig == "DF" else f"TCE-{sig}", quantidade=7, cargo=cargo("Presidente"),
             descricao="Controle externo do estado e, onde não há Tribunal de Contas dos Municípios, também das prefeituras e câmaras. "
                       "Sete conselheiros: três escolhidos pelo Governador (com aprovação da Assembleia) e quatro pela Assembleia (CF, art. 75).",
             lei="CF, arts. 31 e 75")
    tcm = None
    if sig in TCM_ESTADUAL:
        tcm = no(f"tcm-{sig}", TCM_ESTADUAL[sig], "tribunal", "legislativo", ale, "auxiliado por", sigla=f"TCM-{sig}",
                 cargo=cargo("Presidente"), descricao="Controle externo de todos os municípios do estado (CF, art. 31, § 1º).")

    # Judiciário
    tj_nome = "Tribunal de Justiça do Distrito Federal e dos Territórios" if sig == "DF" else f"Tribunal de Justiça {estado_de}"
    tj = no(f"tj-{sig}", tj_nome, "tribunal", "judiciario", raiz, "compõe", sigla="TJDFT" if sig == "DF" else f"TJ{sig}",
            cargo=cargo("Presidente"), lei="CF, arts. 125 e 126" if sig != "DF" else "CF, art. 21, XIII",
            descricao=("Organizado e mantido pela União, embora atue como Justiça local." if sig == "DF" else
                       "Cúpula da Justiça estadual: desembargadores, comarcas e varas em todo o estado."),
            ligacoes_externas=[{"vista": "federal", "id": "stj", "rotulo": "Recursos especiais sobem ao STJ"},
                               {"vista": "federal", "id": "cnj", "rotulo": "Controle administrativo pelo CNJ"}])
    no(f"comarcas-{sig}", "Comarcas e varas", "grupo", "judiciario", tj, descricao="Primeiro grau da Justiça estadual. Ainda não mapeadas.")
    tre = no(f"tre-{sig}", f"Tribunal Regional Eleitoral {'do Distrito Federal' if sig == 'DF' else art + ' ' + nome}", "tribunal", "judiciario", raiz, "compõe",
             sigla=f"TRE-{sig}", quantidade=7, cargo=cargo("Presidente"), lei="CF, arts. 120 e 121",
             descricao="Órgão da Justiça Eleitoral (federal) no estado: organiza as eleições estaduais e municipais e diploma os eleitos.",
             ligacoes_externas=[{"vista": "federal", "id": "tse", "rotulo": "Subordinado ao TSE"}])

    # Funções essenciais
    if sig == "DF":
        mp = no(f"mp-{sig}", "Ministério Público do Distrito Federal e Territórios", "orgao", "essencial", raiz, "compõe",
                sigla="MPDFT", cargo=cargo("Procurador(a)-Geral de Justiça"),
                descricao="Ramo do Ministério Público da União que atua no DF (CF, art. 128, I, d).",
                ligacoes_externas=[{"vista": "federal", "id": "mpdft", "rotulo": "É ramo do MPU"}])
    else:
        mp = no(f"mp-{sig}", f"Ministério Público {estado_de}", "orgao", "essencial", raiz, "compõe", sigla=f"MP{sig}",
                cargo=cargo("Procurador(a)-Geral de Justiça"), lei="CF, arts. 127 a 129",
                descricao="Chefiado pelo Procurador-Geral de Justiça, nomeado pelo Governador a partir de lista tríplice da carreira, para mandato de dois anos (CF, art. 128, § 3º).",
                ligacoes_externas=[{"vista": "federal", "id": "cnmp", "rotulo": "Controle pelo CNMP"}])
    dpe = no(f"dpe-{sig}", f"Defensoria Pública {'do Distrito Federal' if sig == 'DF' else estado_de}", "orgao", "essencial", raiz, "compõe",
             sigla="DPDF" if sig == "DF" else f"DPE-{sig}", cargo=cargo("Defensor(a) Público-Geral"), lei="CF, art. 134")

    # Municípios
    if sig == "DF":
        no(f"ras-{sig}", "Regiões Administrativas", "grupo", "executivo", gov, quantidade=33,
           descricao="O DF não se divide em municípios (CF, art. 32). As 33 regiões administrativas são unidades do próprio governo distrital, com administradores nomeados pelo Governador.")
        grupo_mun = None
    else:
        grupo_mun = no(f"municipios-{sig}", f"Municípios {art} {nome}", "grupo", "uniao", raiz, "compõe", quantidade=len(municipios),
                       descricao=f"{len(municipios)} municípios, cada um com Prefeitura e Câmara Municipal próprias (CF, arts. 29 a 31).",
                       lei="CF, arts. 29 a 31")
        for m in municipios:
            no(f"m-{m['codigo_ibge']}", m["nome"], "municipio", "uniao", grupo_mun, "integra",
               codigo_ibge=m["codigo_ibge"], capital=True if m["capital"] == "1" else None,
               ddd=m["ddd"] or None)
        if sig in TCM_CAPITAL:
            nome_tcm, cod = TCM_CAPITAL[sig]
            no(f"tcm-{sig}", nome_tcm, "tribunal", "legislativo", f"m-{cod}", "auxiliado por", sigla=f"TCM-{sig}",
               cargo=cargo("Presidente"), descricao="Controle externo do município da capital, em auxílio à Câmara Municipal (CF, art. 31, § 4º).")

    # Relações
    liga(ale, gov, "fiscaliza", "Fiscalização e controle dos atos do Executivo estadual, com auxílio do Tribunal de Contas (CF, arts. 31 e 75).")
    liga(gov, tce, "nomeia", "Escolhe três dos sete conselheiros, com aprovação da Assembleia (CF, art. 73, § 2º, por simetria).")
    liga(ale, tce, "escolhe", "Escolhe quatro dos sete conselheiros.")
    liga(gov, mp, "nomeia", "Nomeia o Procurador-Geral de Justiça a partir de lista tríplice (CF, art. 128, § 3º).") if sig != "DF" else None
    liga(gov, dpe, "nomeia", "Nomeia o Defensor Público-Geral a partir de lista tríplice (LC 80/1994).")
    liga(gov, tj, "nomeia", "Nomeia os desembargadores do quinto constitucional a partir de lista tríplice do tribunal (CF, art. 94).")
    if grupo_mun:
        fiscal = tcm or tce
        liga(fiscal, grupo_mun, "fiscaliza", "Controle externo das contas de prefeituras e câmaras municipais (CF, art. 31).")
        liga(tre, grupo_mun, "organiza eleições", "Organiza as eleições municipais e diploma prefeitos e vereadores.")
        liga(ses, grupo_mun, "coordena", "Coordena a rede regionalizada do SUS com as secretarias municipais de saúde (Lei 8.080/1990).")
        liga(mp, grupo_mun, "fiscaliza", "Promotorias de Justiça atuam em cada comarca, inclusive sobre os atos municipais.")
        liga(tj, grupo_mun, "julga", "Comarcas da Justiça estadual atendem os municípios.")

    return {
        "meta": {
            "titulo": f"Mapa do Governo · {nome}", "vista": "estado", "uf": sig, "nome": nome,
            "versao": "0.1.0", "gerado_por": "scripts/governo/gerar_estados.py",
            "tipos": TIPOS, "poderes": PODERES, "situacoes": SITUACOES, "cargos_municipio": CARGOS_MUNICIPIO,
            "aviso": "Instituições conforme a Constituição; ocupantes ainda não verificados. Municípios conforme o IBGE (ver scripts/governo/dados/FONTES.md).",
        },
        "nos": nos, "arestas": arestas,
    }


def main():
    ufs = por_sigla()
    mun = carregar_municipios()
    SAIDA.mkdir(parents=True, exist_ok=True)
    indice = []
    total_nos = 0
    for sig in sorted(ufs):
        d = gerar_estado(ufs[sig], mun.get(sig, []))
        (SAIDA / f"{sig}.json").write_text(json.dumps(d, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
        total_nos += len(d["nos"])
        for m in mun.get(sig, []):
            indice.append([m["nome"], sig, m["codigo_ibge"]])
    indice.sort(key=lambda x: (norm(x[0]), x[1]))
    (SAIDA.parent / "indice-municipios.json").write_text(json.dumps(indice, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"27 estados, {total_nos} nós, {len(indice)} municípios no índice -> {SAIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
