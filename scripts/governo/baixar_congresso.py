#!/usr/bin/env python3
"""
Baixa das APIs de dados abertos da Câmara e do Senado o que o grafo precisa
hoje: composição das Mesas (quem preside cada Casa) e os totais de
parlamentares em exercício. Grava um JSON bruto em scripts/governo/.cache/.

Câmara: https://dadosabertos.camara.leg.br/api/v2   (JSON nativo)
Senado: https://legis.senado.leg.br/dadosabertos     (JSON via Accept ou sufixo .json)

Uso:
    python3 scripts/governo/baixar_congresso.py

Escrito sem acesso à rede; confira os campos se a API tiver mudado.
"""
import json
import sys
import time
import urllib.request
from pathlib import Path

CACHE = Path(__file__).resolve().parent / ".cache"
CAMARA = "https://dadosabertos.camara.leg.br/api/v2"
SENADO = "https://legis.senado.leg.br/dadosabertos"


def get(url):
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "grafo-governo-br/0.1"})
    for tentativa in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # noqa: BLE001
            print(f"  falhou ({e}); nova tentativa", file=sys.stderr)
            time.sleep(2 ** tentativa)
    raise SystemExit(f"desisti de {url}")


def legislatura_atual():
    d = get(f"{CAMARA}/legislaturas?ordem=DESC&ordenarPor=id&itens=1")
    return d["dados"][0]["id"]


def mesa_camara(leg):
    d = get(f"{CAMARA}/legislaturas/{leg}/mesa")
    return [{"nome": m.get("nome"), "cargo": m.get("titulo"), "partido": m.get("siglaPartido"),
             "uf": m.get("siglaUf"), "desde": m.get("dataInicio"), "ate": m.get("dataFim")} for m in d["dados"]]


def total_deputados():
    total, pagina = 0, 1
    while True:
        d = get(f"{CAMARA}/deputados?itens=100&pagina={pagina}&ordem=ASC&ordenarPor=nome")
        total += len(d["dados"])
        if not any(l["rel"] == "next" for l in d.get("links", [])):
            return total
        pagina += 1


def mesa_senado():
    d = get(f"{SENADO}/composicao/mesa/senado.json")
    # A estrutura tem variado; guardamos o bruto e tentamos extrair os cargos.
    membros = []
    try:
        colegiado = d["MesaSenado"]["Colegiado"]
        for c in colegiado.get("Cargos", {}).get("Cargo", []):
            membros.append({"cargo": c.get("NomeCargo"), "nome": c.get("NomeParlamentar"), "partido": c.get("SiglaPartido"), "uf": c.get("UfParlamentar")})
    except (KeyError, TypeError):
        pass
    return {"bruto": d, "membros": membros}


def total_senadores():
    d = get(f"{SENADO}/senador/lista/atual.json")
    try:
        return len(d["ListaParlamentarEmExercicio"]["Parlamentares"]["Parlamentar"])
    except (KeyError, TypeError):
        return None


def main():
    leg = legislatura_atual()
    print(f"==> Câmara: legislatura {leg}")
    saida = {
        "baixado_em": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "camara": {"legislatura": leg, "mesa": mesa_camara(leg), "total_em_exercicio": total_deputados()},
        "senado": {"mesa": mesa_senado(), "total_em_exercicio": total_senadores()},
    }
    CACHE.mkdir(parents=True, exist_ok=True)
    arq = CACHE / "congresso.json"
    arq.write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"-> {arq}")


if __name__ == "__main__":
    main()
