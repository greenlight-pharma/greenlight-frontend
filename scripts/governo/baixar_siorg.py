#!/usr/bin/env python3
"""
Baixa a estrutura organizacional do Poder Executivo federal a partir do SIORG
(API pública de dados abertos) e grava um JSON bruto para o montar_grafo.py.

API: https://estruturaorganizacional.dados.gov.br  (documentação Swagger em
/doc). Não exige chave. Códigos usados aqui:
  codigoPoder=1   Executivo
  codigoEsfera=1  Federal

Uso:
    python3 scripts/governo/baixar_siorg.py                 # grava em scripts/governo/.cache/siorg.json
    python3 scripts/governo/baixar_siorg.py --unidade 26    # só a subárvore de uma unidade (26 = Presidência)

Atenção: este script foi escrito sem acesso à rede (a sessão que o gerou
bloqueava dados.gov.br). Os nomes de campos seguem a documentação pública da
API; se o formato tiver mudado, ajuste `extrair_unidade` abaixo.
"""
import argparse
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

BASE = "https://estruturaorganizacional.dados.gov.br/doc"
CACHE = Path(__file__).resolve().parent / ".cache"


def get(caminho, **params):
    url = f"{BASE}/{caminho}"
    if params:
        url += "?" + urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "grafo-governo-br/0.1"})
    for tentativa in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # noqa: BLE001
            espera = 2 ** tentativa
            print(f"  falhou ({e}); nova tentativa em {espera}s", file=sys.stderr)
            time.sleep(espera)
    raise SystemExit(f"desisti de {url}")


def extrair_unidade(u):
    """Normaliza uma unidade do SIORG para o que o grafo usa."""
    return {
        "codigo": str(u.get("codigoUnidade")),
        "codigo_pai": str(u.get("codigoUnidadePai")) if u.get("codigoUnidadePai") else None,
        "nome": u.get("nome"),
        "sigla": u.get("sigla"),
        "tipo_unidade": u.get("codigoTipoUnidade"),
        "natureza_juridica": u.get("codigoNaturezaJuridica"),
        "nivel_normatizacao": u.get("nivelNormatizacao"),
        "competencia": u.get("competencia"),
        "finalidade": u.get("finalidade"),
        "endereco": u.get("endereco"),
        "contato": u.get("contato"),
        "titular": u.get("titular"),  # presente na versão "completa" da API
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--unidade", help="codigoUnidade raiz da subárvore (opcional)")
    ap.add_argument("--completa", action="store_true", help="usa a versão completa (mais lenta; traz titulares)")
    ap.add_argument("--saida", default=str(CACHE / "siorg.json"))
    args = ap.parse_args()

    versao = "completa" if args.completa else "resumida"
    print(f"==> SIORG: orgao-entidade/{versao} (Executivo federal)")
    dados = get(f"orgao-entidade/{versao}", codigoPoder=1, codigoEsfera=1, codigoUnidade=args.unidade)

    unidades = dados.get("unidades") or dados.get("unidade") or []
    if isinstance(unidades, dict):
        unidades = [unidades]
    normalizadas = [extrair_unidade(u) for u in unidades]

    print("==> tabelas de apoio (tipo de unidade, natureza jurídica)")
    tipos = get("tipo-unidade")
    naturezas = get("natureza-juridica")

    saida = Path(args.saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(json.dumps({
        "baixado_em": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "fonte": BASE,
        "unidades": normalizadas,
        "tipos_unidade": tipos,
        "naturezas_juridicas": naturezas,
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(normalizadas)} unidades -> {saida}")


if __name__ == "__main__":
    main()
