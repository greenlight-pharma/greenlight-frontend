#!/usr/bin/env python3
"""
Lê a Seção 2 do Diário Oficial da União (atos de pessoal: nomeações,
exonerações, designações) dos últimos N dias para os órgãos do grafo e
gera um relatório em Markdown com os atos encontrados, agrupados por órgão.

O relatório é para um humano revisar. O script NÃO altera o grafo: quem
decide se um ato muda o ocupante de um cargo é a pessoa que revisa o PR.
Essa é a regra editorial do projeto (estrutura sim, pessoas só com fonte).

Fonte: busca pública do DOU em https://www.in.gov.br/consulta/-/buscar/dou.
A página devolve os resultados em um <input type="hidden" ... _params>
com JSON escapado. Não exige chave.

Uso:
    python3 scripts/governo/ler_dou.py --dias 8 --saida scripts/governo/.cache/dou.md

Escrito sem acesso à rede; se o formato da página tiver mudado, o ponto de
ajuste é `extrair_resultados`.
"""
import argparse
import datetime as dt
import html
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import semente  # noqa: E402

BUSCA = "https://www.in.gov.br/consulta/-/buscar/dou"
ATOS = ["nomear", "exonerar", "designar", "dispensar", "interinamente", "substituto"]


def buscar(termo, de, ate):
    params = {
        "q": termo, "s": "do2", "exactDate": "personalizado", "sortType": "0",
        "publishFrom": de.strftime("%d-%m-%Y"), "publishTo": ate.strftime("%d-%m-%Y"),
        "delta": "50",
    }
    url = BUSCA + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "grafo-governo-br/0.1"})
    for tentativa in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001
            print(f"  {termo!r}: falhou ({e})", file=sys.stderr)
            time.sleep(2 ** tentativa)
    return ""


def extrair_resultados(pagina):
    """Localiza o JSON de resultados embutido na página de busca."""
    m = re.search(r'id="[^"]*_params"[^>]*value="([^"]*)"', pagina) or \
        re.search(r"id='[^']*_params'[^>]*value='([^']*)'", pagina)
    if not m:
        return []
    try:
        dados = json.loads(html.unescape(m.group(1)))
    except json.JSONDecodeError:
        return []
    itens = dados.get("jsonArray") or []
    saida = []
    for it in itens:
        saida.append({
            "titulo": it.get("title") or it.get("titulo") or "",
            "url": "https://www.in.gov.br/web/dou/-/" + str(it.get("urlTitle") or ""),
            "data": it.get("pubDate") or "",
            "orgao": it.get("artCategory") or it.get("hierarchyStr") or "",
            "tipo": it.get("artType") or "",
            "trecho": re.sub(r"\s+", " ", html.unescape(str(it.get("content") or "")))[:300],
        })
    return saida


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dias", type=int, default=8)
    ap.add_argument("--saida", default=str(AQUI / ".cache" / "dou.md"))
    ap.add_argument("--pausa", type=float, default=1.0, help="segundos entre consultas")
    args = ap.parse_args()

    ate = dt.date.today()
    de = ate - dt.timedelta(days=args.dias)

    # Órgãos com cargo de comando cujo ato sai no DOU: ministérios, órgãos da
    # Presidência e entidades do Executivo. Tribunais publicam no DJe, fora do escopo.
    alvos = [n for n in semente.nos if n.get("cargo") and n["poder"] == "executivo" and n["tipo"] != "grupo"]
    por_nome = {}
    vistos = set()
    print(f"==> DOU seção 2, {de} a {ate}, {len(alvos)} órgãos")
    for n in alvos:
        termo = f'"{n["nome"]}" ({" OR ".join(ATOS)})'
        pagina = buscar(termo, de, ate)
        for r in extrair_resultados(pagina):
            chave = r["url"]
            if chave in vistos:
                continue
            vistos.add(chave)
            por_nome.setdefault(n["id"], []).append(r)
        time.sleep(args.pausa)

    linhas = [f"# Atos de pessoal no DOU (seção 2), {de:%d/%m/%Y} a {ate:%d/%m/%Y}", "",
              "Relatório gerado por `scripts/governo/ler_dou.py` para revisão humana. "
              "Nenhum ocupante é alterado automaticamente a partir daqui.", ""]
    total = 0
    for n in alvos:
        atos = por_nome.get(n["id"])
        if not atos:
            continue
        linhas.append(f"## {n['nome']} ({n.get('sigla', n['id'])})")
        linhas.append("")
        for r in atos:
            total += 1
            linhas.append(f"- **{r['data']}** [{r['titulo'] or r['tipo'] or 'ato'}]({r['url']}) · {r['orgao']}")
            if r["trecho"]:
                linhas.append(f"  {r['trecho']}")
        linhas.append("")
    if not total:
        linhas.append("Nenhum ato encontrado no período (ou a busca do DOU mudou de formato; ver `extrair_resultados`).")
    saida = Path(args.saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text("\n".join(linhas) + "\n", encoding="utf-8")
    print(f"{total} atos -> {saida}")


if __name__ == "__main__":
    main()
