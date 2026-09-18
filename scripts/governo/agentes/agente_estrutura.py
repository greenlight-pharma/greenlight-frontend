#!/usr/bin/env python3
"""
Agente de estrutura: detecta mudanças na hierarquia do Executivo federal
(órgão criado, extinto, renomeado ou transferido de pai) comparando a foto
de hoje do SIORG com a foto da rodada anterior, e acrescenta os registros ao
feed `governo/dados/mudancas.json` com `origem: "siorg"` e `tipo: "estrutura"`.

Fonte: SIORG (Sistema de Informações Organizacionais do Governo Federal),
API pública em https://estruturaorganizacional.dados.gov.br. Só entram no
diff os órgãos e entidades (ministérios, órgãos da Presidência, autarquias,
fundações, empresas), o endpoint leve do SIORG. Secretarias, coordenações e
divisões ficam de fora: são milhares e mudam toda semana sem alterar o mapa.

A foto fica em `scripts/governo/dados/siorg-foto.json` (versionada, pequena).
Na primeira rodada não há foto anterior: grava a foto e não emite mudança.

Uso:
    python3 scripts/governo/agentes/agente_estrutura.py
"""
import argparse
import datetime as dt
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comum import DADOS, Grafo, baixar, gravar_json, hoje, ler_json, norm  # noqa: E402

BASE = "https://estruturaorganizacional.dados.gov.br/doc"
FOTO = Path(__file__).resolve().parent.parent / "dados" / "siorg-foto.json"
SAIDA = DADOS / "mudancas.json"


def unidades_siorg():
    """Órgãos e entidades do Executivo federal (nível de órgão: ministérios,
    órgãos da Presidência, autarquias, fundações, empresas), ~260 unidades.
    É o endpoint leve do SIORG; a estrutura completa passa de 80 MB."""
    texto = baixar(f"{BASE}/orgao-entidade/resumida", params={"codigoPoder": 1, "codigoEsfera": 1}, timeout=180, accept="application/json")
    if not texto:
        return None
    try:
        dados = json.loads(texto)
    except json.JSONDecodeError:
        return None
    saida = {}
    for u in dados.get("unidades") or []:
        cod = str(u.get("codigoUnidade") or "").split("/")[-1]
        if not cod:
            continue
        saida[cod] = {
            "nome": u.get("nome") or "", "sigla": u.get("sigla") or "",
            "tipo": str(u.get("codigoTipoUnidade") or "").split("/")[-1],          # orgao | entidade
            "natureza": str(u.get("codigoNaturezaJuridica") or "").split("/")[-1],
            "pai": str(u.get("codigoUnidadePai") or "").split("/")[-1],
            "operacao": u.get("operacao"),
        }
    return saida


def filtrar_altos(unidades):
    """Todas as unidades desse endpoint já são de nível alto; só tira as sem nome."""
    return {cod: {k: u[k] for k in ("nome", "sigla", "tipo", "natureza", "pai")} for cod, u in unidades.items() if u["nome"]}


def comparar(antiga, nova, grafo):
    regs = []
    hoje_iso = hoje().isoformat()

    def registro(tipo_mud, cod, u, detalhe):
        no_id, _ = grafo.casar_orgao(u["nome"])
        pai_nome = nova.get(u["pai"], antiga.get(u["pai"], {})).get("nome") if u.get("pai") else None
        return {
            "id": "siorg-" + hashlib.sha1(f"{tipo_mud}|{cod}|{hoje_iso}".encode()).hexdigest()[:12],
            "data": hoje_iso, "publicado_em": hoje_iso,
            "tipo": "estrutura", "subtipo": tipo_mud,
            "cargo": None, "entra": None, "sai": None, "interino": False, "a_pedido": False,
            "orgao": u["nome"], "sigla": u.get("sigla"), "pai": pai_nome,
            "no_id": no_id, "nivel": "comando" if no_id else "alta",
            "ato": f"SIORG, unidade {cod}", "assinante": "SIORG (MGI)",
            "fonte": f"https://estruturaorganizacional.dados.gov.br/doc/unidade-organizacional/{cod}",
            "fonte_nome": "SIORG", "origem": "siorg", "resumo": detalhe,
        }

    for cod, u in nova.items():
        if cod not in antiga:
            regs.append(registro("criacao", cod, u, f"{u['nome']} passa a constar na estrutura" + (f", vinculado a {nova.get(u['pai'], {}).get('nome')}" if nova.get(u['pai']) else "") + "."))
            continue
        a = antiga[cod]
        if norm(a["nome"]) != norm(u["nome"]):
            regs.append(registro("renomeacao", cod, u, f"{a['nome']} passa a se chamar {u['nome']}."))
        if a.get("pai") != u.get("pai"):
            de = antiga.get(a.get("pai"), nova.get(a.get("pai"), {})).get("nome") or "?"
            para = nova.get(u.get("pai"), {}).get("nome") or "?"
            regs.append(registro("transferencia", cod, u, f"{u['nome']} deixa {de} e passa a {para}."))
    for cod, a in antiga.items():
        if cod not in nova:
            regs.append(registro("extincao", cod, a, f"{a['nome']} deixa de constar na estrutura."))
    return regs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--saida", default=str(SAIDA))
    ap.add_argument("--foto", default=str(FOTO))
    args = ap.parse_args()

    grafo = Grafo()
    print("==> SIORG, estrutura completa")
    unidades = unidades_siorg()
    if unidades is None:
        print("    não foi possível baixar o SIORG; nada a comparar", file=sys.stderr)
        return
    nova = filtrar_altos(unidades)
    print(f"    {len(nova)} órgãos e entidades")
    foto = ler_json(args.foto)
    if not nova:
        print("    o SIORG não devolveu unidades: o formato deve ter mudado; ver unidades_siorg", file=sys.stderr)
        return
    regs = []
    if foto and foto.get("unidades"):
        regs = comparar(foto["unidades"], nova, grafo)
        print(f"    {len(regs)} mudanças de estrutura desde {foto.get('data')}")
    else:
        print("    primeira foto: sem comparação nesta rodada")
    gravar_json(args.foto, {"data": hoje().isoformat(), "fonte": BASE, "unidades": nova})

    if regs:
        feed = ler_json(args.saida, {"meta": {}, "mudancas": []})
        ids = {m["id"] for m in feed["mudancas"]}
        feed["mudancas"] = [r for r in regs if r["id"] not in ids] + feed["mudancas"]
        feed["mudancas"].sort(key=lambda m: (m.get("publicado_em") or "", m.get("data") or ""), reverse=True)
        feed.setdefault("meta", {})["estrutura_verificada_em"] = hoje().isoformat()
        gravar_json(args.saida, feed)
        print(f"    feed atualizado -> {args.saida}")


if __name__ == "__main__":
    main()
