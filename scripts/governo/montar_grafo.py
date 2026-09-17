#!/usr/bin/env python3
"""
Junta a semente curada (semente.py) com o que os scripts de download trouxeram
(.cache/siorg.json e .cache/congresso.json) e grava o JSON final do grafo.

Faz quatro coisas, todas conservadoras:
  1. Preenche `cargo.ocupante` das Casas do Congresso a partir das Mesas.
  2. Casa entidades da semente com unidades do SIORG pela sigla e anexa o
     código SIORG (`siorg`), competência e site quando existirem.
  3. Se o SIORG completo trouxer `titular`, preenche ocupantes ainda nulos,
     marcando `verificado_em` com a data do download e `situacao` como
     "interino" quando o SIORG sinalizar substituto.
  4. Gera o segundo nível dos ministérios (secretarias) a partir do SIORG,
     sem duplicar as que a semente já traz à mão.

O que entra no grafo continua sendo decisão editorial: só secretarias
(tipo de unidade "Secretaria" no SIORG) diretamente abaixo de um ministério.

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
            c.update(ocupante=m["nome"], situacao="titular", desde=m.get("desde"), mandato_ate=m.get("ate"), verificado_em=quando)
    for m in cong["senado"]["mesa"]["membros"]:
        if norm(m.get("cargo")) == "presidente" and m.get("nome"):
            for id_ in ("senado", "congresso"):
                por_id[id_]["cargo"].update(ocupante=m["nome"], situacao="titular", verificado_em=quando)
    if cong["camara"].get("total_em_exercicio"):
        por_id["camara"]["quantidade_em_exercicio"] = cong["camara"]["total_em_exercicio"]
    if cong["senado"].get("total_em_exercicio"):
        por_id["senado"]["quantidade_em_exercicio"] = cong["senado"]["total_em_exercicio"]


def _titular(u):
    """Extrai (nome, situacao) do campo titular do SIORG, em qualquer formato."""
    t = u.get("titular")
    if not t:
        return None, None
    if isinstance(t, list):
        t = t[0] if t else None
        if not t:
            return None, None
    if isinstance(t, dict):
        nome = t.get("nome") or t.get("nomeTitular")
        interino = bool(t.get("substituto") or t.get("interino") or
                        norm(t.get("tipo") or t.get("tipoTitular") or "") in ("substituto", "interino"))
        return nome, ("interino" if interino else "titular")
    return str(t), "titular"


def gerar_segundo_nivel(dados, siorg):
    """Adiciona secretarias dos ministérios a partir do SIORG."""
    bruto = siorg.get("tipos_unidade") or []
    if isinstance(bruto, dict):  # a API pode embrulhar a lista em uma chave
        bruto = bruto.get("tiposUnidade") or bruto.get("tipoUnidade") or next((v for v in bruto.values() if isinstance(v, list)), [])
    tipos = {str(t.get("codigo") or t.get("codigoTipoUnidade")): norm(t.get("descricao") or t.get("nome") or "")
             for t in bruto if isinstance(t, dict)}
    por_pai = {}
    for u in siorg["unidades"]:
        por_pai.setdefault(u.get("codigo_pai"), []).append(u)
    ids = {n["id"] for n in dados["nos"]}
    siglas_por_pai = {}
    for n in dados["nos"]:
        if n.get("pai") and n.get("sigla"):
            siglas_por_pai.setdefault(n["pai"], set()).add(norm(n["sigla"]))
    quando = siorg["baixado_em"][:7]
    novos = 0
    for n in [x for x in dados["nos"] if x["tipo"] == "ministerio" and x.get("siorg")]:
        for u in por_pai.get(n["siorg"], []):
            tipo = tipos.get(str(u.get("tipo_unidade")), "")
            if not tipo.startswith("secretaria"):
                continue
            if norm(u.get("sigla")) in siglas_por_pai.get(n["id"], set()):
                continue  # já está na semente
            id_ = f"siorg-{u['codigo']}"
            if id_ in ids:
                continue
            nome, situacao = _titular(u)
            dados["nos"].append({
                "id": id_, "nome": u["nome"], "sigla": u.get("sigla"), "tipo": "orgao",
                "poder": "executivo", "pai": n["id"], "siorg": u["codigo"],
                "descricao": (u.get("competencia") or "")[:400] or None,
                "cargo": {"titulo": "Secretário(a)", "situacao": situacao or "nao_verificado",
                          "ocupante": nome, "desde": None, "mandato_ate": None,
                          "verificado_em": quando if nome else None, "fonte": siorg["fonte"]},
            })
            dados["arestas"].append({"de": n["id"], "para": id_, "tipo": "integra", "hierarquica": True})
            ids.add(id_)
            novos += 1
    for n in dados["nos"]:
        if n.get("descricao") is None:
            n.pop("descricao", None)
    print(f"SIORG: {novos} secretarias adicionadas")


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
        if n.get("cargo") and not n["cargo"].get("ocupante"):
            nome, situacao = _titular(u)
            if nome:
                n["cargo"].update(ocupante=nome, situacao=situacao, verificado_em=quando, fonte=siorg["fonte"])
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
        gerar_segundo_nivel(dados, siorg)
    if cong or siorg:
        dados["meta"]["gerado_por"] = "scripts/governo/montar_grafo.py"
    semente.SAIDA.write_text(json.dumps(dados, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(dados['nos'])} nós, {len(dados['arestas'])} arestas -> {semente.SAIDA.relative_to(semente.RAIZ)}")


if __name__ == "__main__":
    main()
