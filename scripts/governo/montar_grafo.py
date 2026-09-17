#!/usr/bin/env python3
"""
Junta a semente curada (semente.py) com o que os scripts de download trouxeram
(.cache/siorg.json e .cache/congresso.json) e grava o JSON final do grafo.

Hoje faz três coisas, todas conservadoras:
  1. Preenche `cargo.ocupante` das Casas do Congresso a partir das Mesas.
  2. Casa entidades da semente com unidades do SIORG pela sigla e anexa o
     código SIORG (`siorg`), competência e site quando existirem.
  3. Se o SIORG completo trouxer `titular`, preenche ocupantes ainda nulos,
     marcando `verificado_em` com a data do download.

Não cria nós novos: a decisão de quais unidades entram no grafo continua
sendo editorial (semente.py). Um passo seguinte é gerar automaticamente o
segundo nível (secretarias) a partir do SIORG.

Uso:
    python3 scripts/governo/montar_grafo.py
"""
import json
import sys
import unicodedata
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import semente  # noqa: E402  (gera `semente.dados` ao importar)

CACHE = AQUI / ".cache"


def norm(s):
    s = unicodedata.normalize("NFD", str(s or ""))
    return "".join(c for c in s if unicodedata.category(c) != "Mn").lower().strip()


def carregar(nome):
    p = CACHE / nome
    if not p.exists():
        print(f"(sem {p.name}; rode o script de download correspondente)")
        return None
    return json.loads(p.read_text(encoding="utf-8"))


def aplicar_congresso(dados, cong):
    por_id = {n["id"]: n for n in dados["nos"]}
    quando = cong["baixado_em"][:7]
    for m in cong["camara"]["mesa"]:
        if norm(m.get("cargo")).startswith("presidente") and m.get("nome"):
            c = por_id["camara"]["cargo"]
            c.update(ocupante=m["nome"], desde=m.get("desde"), mandato_ate=m.get("ate"), verificado_em=quando)
    for m in cong["senado"]["mesa"]["membros"]:
        if norm(m.get("cargo")) == "presidente" and m.get("nome"):
            for id_ in ("senado", "congresso"):
                por_id[id_]["cargo"].update(ocupante=m["nome"], verificado_em=quando)
    if cong["camara"].get("total_em_exercicio"):
        por_id["camara"]["quantidade_em_exercicio"] = cong["camara"]["total_em_exercicio"]
    if cong["senado"].get("total_em_exercicio"):
        por_id["senado"]["quantidade_em_exercicio"] = cong["senado"]["total_em_exercicio"]


def aplicar_siorg(dados, siorg):
    por_sigla = {}
    for u in siorg["unidades"]:
        if u.get("sigla"):
            por_sigla.setdefault(norm(u["sigla"]), []).append(u)
    quando = siorg["baixado_em"][:7]
    casados = 0
    for n in dados["nos"]:
        if n["poder"] != "executivo" or not n.get("sigla"):
            continue
        cands = por_sigla.get(norm(n["sigla"]), [])
        # Prefere a unidade de nível mais alto (pai nulo ou pai fora da lista)
        if not cands:
            continue
        u = sorted(cands, key=lambda x: (x["codigo_pai"] is not None, len(x["nome"] or "")))[0]
        n["siorg"] = u["codigo"]
        if u.get("competencia") and not n.get("descricao"):
            n["descricao"] = u["competencia"][:400]
        if u.get("titular") and n.get("cargo") and not n["cargo"].get("ocupante"):
            t = u["titular"]
            nome = t.get("nome") if isinstance(t, dict) else str(t)
            if nome:
                n["cargo"].update(ocupante=nome, verificado_em=quando, fonte=siorg["fonte"])
        casados += 1
    print(f"SIORG: {casados} nós casados por sigla")


def main():
    dados = semente.dados
    cong = carregar("congresso.json")
    if cong:
        aplicar_congresso(dados, cong)
    siorg = carregar("siorg.json")
    if siorg:
        aplicar_siorg(dados, siorg)
    if cong or siorg:
        dados["meta"]["gerado_por"] = "scripts/governo/montar_grafo.py"
    semente.SAIDA.write_text(json.dumps(dados, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(dados['nos'])} nós, {len(dados['arestas'])} arestas -> {semente.SAIDA.relative_to(semente.RAIZ)}")


if __name__ == "__main__":
    main()
