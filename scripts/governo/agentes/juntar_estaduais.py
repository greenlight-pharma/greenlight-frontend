#!/usr/bin/env python3
"""
Junta os ocupantes estaduais conferidos por pesquisa (um JSON por grupo de
estados) em scripts/governo/dados/ocupantes-estaduais.json, que o
gerar_estados.py aplica nos mapas estaduais.

Regras:
  * só entra nome com URL de fonte; sem fonte, o cargo fica "não verificado";
  * "vago" entra sem nome (é uma afirmação, com nota);
  * ids que não existem nos mapas estaduais são descartados e listados;
  * governador, vice e presidente da Assembleia ganham foto do Wikidata quando
    a entidade é humana e brasileira (mesma regra do mapa federal).

Uso:
    python3 scripts/governo/agentes/juntar_estaduais.py <arquivos.json ...>
"""
import datetime as dt
import glob
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comum import DADOS, gravar_json, ler_json  # noqa: E402
import pessoas as P  # noqa: E402

SAIDA = Path(__file__).resolve().parent.parent / "dados" / "ocupantes-estaduais.json"
COM_FOTO = ("gov-", "vgov-", "ale-")


def main():
    arquivos = sys.argv[1:]
    ids_validos = {}
    for f in glob.glob(str(DADOS / "estados" / "*.json")):
        e = json.load(open(f, encoding="utf-8"))
        for n in e["nos"]:
            if n.get("cargo"):
                ids_validos[n["id"]] = n["cargo"]["titulo"]
    anterior = ler_json(SAIDA, {"ocupantes": {}})["ocupantes"]
    juntos, descartados, sem_fonte = {}, [], []
    for a in arquivos:
        try:
            d = json.load(open(a, encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            print(f"  ignorado {a}: {e}", file=sys.stderr)
            continue
        for k, v in (d.get("ocupantes") or d).items():
            if k not in ids_validos:
                descartados.append(k)
                continue
            if not isinstance(v, dict):
                continue
            nome = (v.get("ocupante") or "").strip() or None
            sit = v.get("situacao") or ("titular" if nome else "nao_verificado")
            if nome and not v.get("fonte"):
                sem_fonte.append(k)
                continue
            if not nome and sit != "vago":
                continue
            juntos[k] = {"ocupante": nome, "situacao": sit if sit in ("titular", "interino", "vago") else "titular",
                         "desde": v.get("desde"), "mandato_ate": v.get("mandato_ate"),
                         "verificado_em": v.get("verificado_em") or dt.date.today().isoformat()[:7],
                         "fonte": v.get("fonte"), "fonte_nome": v.get("fonte_nome"), "nota": v.get("nota")}
    # fotos (Wikidata) para os cargos mais visíveis; reaproveita as da rodada anterior
    novas = 0
    for k, o in juntos.items():
        if not o["ocupante"] or not k.startswith(COM_FOTO):
            continue
        ant = anterior.get(k) or {}
        if ant.get("ocupante") == o["ocupante"] and "foto" in ant:
            o["foto"] = ant["foto"]
            continue
        achado = P.foto_wikidata(o["ocupante"])
        o["foto"] = (achado or {}).get("foto")
        novas += 1
    gravar_json(SAIDA, {"meta": {"descricao": "Ocupantes de cargos estaduais conferidos em fonte oficial (site do órgão ou Diário Oficial do estado), com a URL exata.",
                                 "gerado_em": dt.date.today().isoformat(), "total_cargos": len(ids_validos)},
                        "ocupantes": dict(sorted(juntos.items()))})
    com_nome = sum(1 for o in juntos.values() if o["ocupante"])
    print(f"{com_nome} com nome, {sum(1 for o in juntos.values() if o['situacao'] == 'vago')} vagos, "
          f"{len(ids_validos) - len(juntos)} sem verificação, {len(sem_fonte)} descartados sem fonte, "
          f"{len(descartados)} ids inválidos, {novas} buscas de foto -> {SAIDA}")
    if sem_fonte:
        print("  sem fonte:", sem_fonte)
    if descartados:
        print("  ids inválidos:", descartados)


if __name__ == "__main__":
    main()
