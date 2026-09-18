#!/usr/bin/env python3
"""
Agente de notícias: lê os feeds RSS das agências públicas de notícias, liga
cada matéria aos órgãos e pessoas do grafo e grava `governo/dados/noticias.json`,
com três coisas que o site mostra:

  * "Últimas notícias": as matérias mais recentes que citam algum nó do mapa,
    com um resumo de poucas frases (escrito pela Claude quando há chave; sem
    chave, entram as manchetes).
  * "Quem está no noticiário" (o mapa do poder): órgãos e pessoas mais
    citados nos últimos 90 dias, com contagem de matérias e a data da
    última citação.
  * Por nó: as matérias que o citam, para o painel de detalhe.

Fontes (todas públicas, sem chave): Agência Brasil (EBC), Agência Câmara,
Agência Senado, Notícias do STF e o noticiário do Planalto. São as fontes
oficiais ou públicas do próprio Estado; imprensa privada fica de fora de
propósito, para o mapa não depender de licenciamento de conteúdo.

O arquivo é acumulativo: cada rodada acrescenta as matérias novas e descarta
as com mais de 90 dias.

Uso:
    python3 scripts/governo/agentes/agente_noticias.py
    python3 scripts/governo/agentes/agente_noticias.py --sem-claude
"""
import argparse
import datetime as dt
import email.utils
import hashlib
import html
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comum import DADOS, Grafo, baixar, gravar_json, hoje, ler_json, norm  # noqa: E402

SAIDA = DADOS / "noticias.json"
JANELA_DIAS = 90
FONTES = [
    {"id": "agenciabrasil", "nome": "Agência Brasil", "url": "https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml"},
    {"id": "camara", "nome": "Agência Câmara", "url": "https://www.camara.leg.br/noticias/rss/ultimas-noticias"},
    {"id": "senado", "nome": "Agência Senado", "url": "https://www12.senado.leg.br/noticias/rss"},
    {"id": "stf", "nome": "Notícias do STF", "url": "https://noticias.stf.jus.br/rss"},
    {"id": "planalto", "nome": "Planalto", "url": "https://www.gov.br/planalto/pt-br/acompanhe-o-planalto/noticias/RSS"},
]
NS = {"content": "http://purl.org/rss/1.0/modules/content/", "dc": "http://purl.org/dc/elements/1.1/",
      "rss1": "http://purl.org/rss/1.0/", "atom": "http://www.w3.org/2005/Atom"}

# Nomes de nós curtos demais ou ambíguos para contar citação em notícia.
IGNORAR_NOS = {"uniao", "exec", "leg", "jud", "fej", "estados", "pr"}


def limpar(s):
    s = re.sub(r"<[^>]+>", " ", html.unescape(s or ""))
    return re.sub(r"\s+", " ", s).strip()


def data_iso(s):
    if not s:
        return None
    try:
        d = email.utils.parsedate_to_datetime(s)
        return d.astimezone(dt.timezone.utc).isoformat(timespec="minutes")
    except (TypeError, ValueError):
        pass
    m = re.match(r"(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})", s)
    return f"{m.group(1)}T{m.group(2)}:00+00:00" if m else None


def ler_feed(fonte):
    xml = baixar(fonte["url"])
    if not xml:
        return []
    try:
        raiz = ET.fromstring(xml.encode("utf-8"))
    except ET.ParseError as e:
        print(f"  {fonte['nome']}: XML inválido ({e})", file=sys.stderr)
        return []
    itens = raiz.findall(".//item") or raiz.findall(".//rss1:item", NS) or raiz.findall(".//atom:entry", NS)
    saida = []
    for it in itens:
        def campo(*nomes):
            for n in nomes:
                el = it.find(n, NS) if ":" in n else it.find(n)
                if el is not None and (el.text or el.get("href")):
                    return (el.text or el.get("href") or "").strip()
            return ""
        titulo = limpar(campo("title", "rss1:title", "atom:title"))
        url = campo("link", "rss1:link", "atom:link")
        if not titulo or not url:
            continue
        corpo = limpar(campo("description", "rss1:description", "atom:summary", "content:encoded"))
        data = data_iso(campo("pubDate", "dc:date", "atom:published", "atom:updated"))
        saida.append({"titulo": titulo, "url": url.strip(), "resumo": corpo[:600], "data": data, "fonte": fonte["id"]})
    return saida


def ligar(grafo, artigo):
    texto = artigo["titulo"] + ". " + artigo["resumo"]
    nos = [i for i in grafo.nos_citados(texto) if i not in IGNORAR_NOS]
    # a fonte institucional não conta como citação (toda notícia do STF "cita" o STF)
    proprio = {"stf": "stf", "camara": "camara", "senado": "senado", "planalto": "pr"}.get(artigo["fonte"])
    nos = [i for i in nos if i != proprio]
    pessoas = [p for p, _ in grafo.casar_pessoas(texto)]
    return nos, pessoas


def resumo_com_claude(artigos, grafo):
    """Quatro frases sobre a semana, cada uma apontando a matéria de origem. Só com chave."""
    if not os.environ.get("ANTHROPIC_API_KEY") or not artigos:
        return None
    try:
        import anthropic
    except ImportError:
        return None
    esquema = {
        "type": "object",
        "properties": {"frases": {"type": "array", "items": {
            "type": "object",
            "properties": {"texto": {"type": "string"}, "artigo": {"type": "integer"}, "no_id": {"type": ["string", "null"]}},
            "required": ["texto", "artigo", "no_id"], "additionalProperties": False}}},
        "required": ["frases"], "additionalProperties": False,
    }
    lista = [{"i": i, "fonte": a["fonte"], "data": a["data"], "titulo": a["titulo"], "resumo": a["resumo"][:300], "nos": a["nos"]}
             for i, a in enumerate(artigos[:40])]
    instrucao = ("Você resume o noticiário oficial do governo brasileiro para um mapa do Estado. Escolha as quatro matérias "
                 "mais relevantes sobre estrutura, cargos, nomeações, decisões dos Poderes ou políticas públicas e escreva "
                 "uma frase curta e factual para cada, em português direto, sem adjetivos, citando o órgão pelo nome. "
                 "Em 'artigo' devolva o índice i da matéria; em 'no_id' o id do órgão principal citado (da lista 'nos'), ou null.")
    client = anthropic.Anthropic()
    try:
        resposta = client.beta.messages.create(
            model="claude-opus-5", max_tokens=4000,
            betas=["server-side-fallback-2026-07-01"], fallbacks="default",
            system=instrucao,
            messages=[{"role": "user", "content": json.dumps(lista, ensure_ascii=False)}],
            output_config={"format": {"type": "json_schema", "schema": esquema}},
        )
    except anthropic.APIStatusError as e:
        print(f"  Claude respondeu erro {e.status_code}; resumo sai pelas manchetes", file=sys.stderr)
        return None
    except anthropic.APIConnectionError as e:
        print(f"  sem conexão com a API da Claude ({e})", file=sys.stderr)
        return None
    if resposta.stop_reason == "refusal":
        return None
    texto = next((b.text for b in resposta.content if b.type == "text"), "{}")
    try:
        frases = json.loads(texto).get("frases", [])
    except json.JSONDecodeError:
        return None
    saida = []
    for f in frases[:4]:
        i = f.get("artigo")
        if isinstance(i, int) and 0 <= i < len(artigos):
            saida.append({"texto": f["texto"].strip(), "artigo_id": artigos[i]["id"], "no_id": f.get("no_id") if f.get("no_id") in grafo.por_id else None})
    return saida or None


def resumo_por_manchetes(artigos):
    vistos, saida = set(), []
    for a in artigos:
        if a["fonte"] in vistos or not a["nos"]:
            continue
        vistos.add(a["fonte"])
        saida.append({"texto": a["titulo"], "artigo_id": a["id"], "no_id": a["nos"][0]})
        if len(saida) == 4:
            break
    return saida


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sem-claude", action="store_true")
    ap.add_argument("--saida", default=str(SAIDA))
    args = ap.parse_args()

    grafo = Grafo()
    existente = ler_json(args.saida, {"artigos": []})
    por_url = {a["url"]: a for a in existente.get("artigos", [])}
    novos = 0
    for fonte in FONTES:
        itens = ler_feed(fonte)
        print(f"==> {fonte['nome']}: {len(itens)} matérias no feed")
        for it in itens:
            if it["url"] in por_url:
                continue
            nos, pessoas = ligar(grafo, it)
            it["id"] = "n-" + hashlib.sha1(it["url"].encode()).hexdigest()[:10]
            it["nos"], it["pessoas"] = nos, pessoas
            it["visto_em"] = hoje().isoformat()
            por_url[it["url"]] = it
            novos += 1

    limite = (hoje() - dt.timedelta(days=JANELA_DIAS)).isoformat()
    artigos = [a for a in por_url.values() if (a.get("data") or a.get("visto_em") or "")[:10] >= limite]
    # religa tudo a cada rodada: o grafo e as regras de casamento mudam com o tempo
    for a in artigos:
        a["nos"], a["pessoas"] = ligar(grafo, a)
    artigos.sort(key=lambda a: a.get("data") or a.get("visto_em") or "", reverse=True)

    # ranking: órgãos e pessoas mais citados, com a última citação
    rank_nos, rank_pessoas = {}, {}
    for a in artigos:
        for i in a["nos"]:
            r = rank_nos.setdefault(i, {"id": i, "artigos": 0, "ultima": None})
            r["artigos"] += 1
            r["ultima"] = max(r["ultima"] or "", a.get("data") or "")
        for p in a["pessoas"]:
            r = rank_pessoas.setdefault(p, {"nome": p, "artigos": 0, "ultima": None})
            r["artigos"] += 1
            r["ultima"] = max(r["ultima"] or "", a.get("data") or "")
    for p, r in rank_pessoas.items():
        no = next((i for nome, i in grafo.pessoas if nome == p), None)
        r["no_id"] = no
        r["cargo"] = (grafo.por_id[no]["cargo"]["titulo"] + " · " + (grafo.por_id[no].get("sigla") or grafo.por_id[no]["nome"])) if no else None
    ranking = {
        "orgaos": sorted(rank_nos.values(), key=lambda r: (-r["artigos"], r["ultima"] or ""))[:30],
        "pessoas": sorted(rank_pessoas.values(), key=lambda r: (-r["artigos"], r["ultima"] or ""))[:20],
    }

    com_no = [a for a in artigos if a["nos"]]
    resumo = None if args.sem_claude else resumo_com_claude(com_no, grafo)
    fontes_usadas = sorted({a["fonte"] for a in artigos})
    saida = {
        "meta": {
            "gerado_em": dt.datetime.now(dt.timezone.utc).isoformat(timespec="minutes"),
            "gerado_por": "scripts/governo/agentes/agente_noticias.py",
            "janela_dias": JANELA_DIAS,
            "fontes": [{k: f[k] for k in ("id", "nome", "url")} for f in FONTES if f["id"] in fontes_usadas],
            "total_artigos": len(artigos), "artigos_com_no": len(com_no), "novos_nesta_rodada": novos,
            "resumo_por": "claude" if resumo else "manchetes",
        },
        "resumo": resumo or resumo_por_manchetes(com_no),
        "ranking": ranking,
        "artigos": [{k: a.get(k) for k in ("id", "titulo", "url", "data", "fonte", "nos", "pessoas", "resumo")} for a in artigos],
    }
    gravar_json(args.saida, saida)
    print(f"    {len(artigos)} matérias ({novos} novas), {len(com_no)} ligadas a nós, {len(ranking['orgaos'])} órgãos no ranking -> {args.saida}")


if __name__ == "__main__":
    main()
