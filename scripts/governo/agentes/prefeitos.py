#!/usr/bin/env python3
"""
Prefeitos e vice-prefeitos eleitos em 2024, dos 5.570 municípios, a partir do
site oficial de resultados do TSE (resultados.tse.jus.br), o mesmo que alimenta
o app Resultados. O download de dados abertos do TSE (cdn.tse.jus.br e
divulgacandcontas) devolve 403 para acesso automatizado; este site não.

  * configuração: /oficial/ele2024/619/config/mun-e000619-cm.json
    (código TSE do município -> código IBGE, por UF)
  * resultado de prefeito no 1º turno (eleição 619, cargo 11):
    /oficial/ele2024/619/dados/<uf>/<uf><cod_tse>-c0011-e000619-u.json
  * 2º turno (eleição 620) para os municípios listados na configuração dela.

Grava scripts/governo/dados/prefeitos.json, indexado pelo código IBGE. O
gerar_estados.py aplica em cada município do mapa. É o resultado da eleição:
cassações, renúncias e mortes posteriores não são acompanhadas aqui.

Uso:
    python3 scripts/governo/agentes/prefeitos.py            # todos os estados
    python3 scripts/governo/agentes/prefeitos.py --uf SP AC
"""
import argparse
import concurrent.futures as cf
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comum import baixar, gravar_json, ler_json, nome_proprio  # noqa: E402

BASE = "https://resultados.tse.jus.br/oficial/ele2024"
SAIDA = Path(__file__).resolve().parent.parent / "dados" / "prefeitos.json"


def _json(url):
    t = baixar(url, accept="application/json", tentativas=3, timeout=40)
    try:
        return json.loads(t)
    except json.JSONDecodeError:
        return None


def municipios():
    """{uf: [(cod_tse, cod_ibge, nome)]} e o conjunto de (uf, cod_tse) com 2º turno."""
    cfg = _json(f"{BASE}/619/config/mun-e000619-cm.json") or {}
    por_uf = {}
    for abr in cfg.get("abr", []):
        por_uf[abr["cd"]] = [(m["cd"], m["cdi"], m["nm"]) for m in abr.get("mu", [])]
    ele = _json("https://resultados.tse.jus.br/oficial/comum/config/ele-c.json") or {}
    segundo = set()
    for p in ele.get("pl", []):
        for e in p.get("e", []):
            if str(e.get("cd")) == "620":
                for abr in e.get("abr", []):
                    for m in abr.get("mu", []):
                        segundo.add((abr["cd"], m["cd"]))
    return por_uf, segundo


def eleito(uf, cod, ele):
    url = f"{BASE}/{ele}/dados/{uf}/{uf}{cod}-c0011-e000{ele}-u.json"
    d = _json(url)
    if not d:
        return None, url
    for carg in d.get("carg", []):
        for agr in carg.get("agr", []):
            for par in agr.get("par", []):
                for c in par.get("cand", []):
                    if c.get("e") == "s" or str(c.get("st", "")).lower().startswith("eleito"):
                        vice = next((v for v in c.get("vs", []) if v.get("tp") == "v"), None)
                        return {
                            "prefeito": nome_proprio(c.get("nm")),
                            "nome_urna": nome_proprio(c.get("nmu")),
                            "partido": par.get("sg"),
                            "vice": nome_proprio(vice["nm"]) if vice else None,
                            "vice_urna": nome_proprio(vice.get("nmu")) if vice else None,
                            "vice_partido": vice.get("sgp") if vice else None,
                            "turno": 2 if ele == "620" else 1,
                            "votos_validos": c.get("pvap"),
                            "fonte": url,
                        }, url
    return None, url


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--uf", nargs="*")
    ap.add_argument("--paralelo", type=int, default=8)
    args = ap.parse_args()

    por_uf, segundo = municipios()
    ufs = [u.lower() for u in (args.uf or por_uf.keys())]
    tarefas = [(uf, cod, ibge, nome) for uf in ufs for cod, ibge, nome in por_uf.get(uf, [])]
    print(f"==> TSE 2024: {len(tarefas)} municípios, {len(segundo)} com 2º turno")
    saida = ler_json(SAIDA, {"meta": {}, "prefeitos": {}})
    faltas = []

    def uma(t):
        uf, cod, ibge, nome = t
        ele = "620" if (uf, cod) in segundo else "619"
        r, url = eleito(uf, cod, ele)
        return ibge, nome, uf, r, url

    with cf.ThreadPoolExecutor(args.paralelo) as ex:
        for i, (ibge, nome, uf, r, url) in enumerate(ex.map(uma, tarefas)):
            if r:
                saida["prefeitos"][ibge] = {**r, "uf": uf.upper()}
            else:
                faltas.append((ibge, nome, uf.upper(), url))
            if (i + 1) % 500 == 0:
                print(f"    {i+1}/{len(tarefas)}")
    saida["meta"] = {
        "fonte": "TSE, site oficial de resultados (resultados.tse.jus.br), eleições municipais de 2024",
        "eleicao": "2024, 1º turno (619) e 2º turno (620)",
        "mandato": "2025-01-01 a 2028-12-31",
        "aviso": "Resultado da eleição. Cassações, renúncias e mortes posteriores não são acompanhadas.",
        "sem_resultado": [{"ibge": f[0], "nome": f[1], "uf": f[2]} for f in faltas],
    }
    saida["prefeitos"] = dict(sorted(saida["prefeitos"].items()))
    gravar_json(SAIDA, saida)
    print(f"    {len(saida['prefeitos'])} prefeitos; {len(faltas)} sem resultado -> {SAIDA}")


if __name__ == "__main__":
    main()
