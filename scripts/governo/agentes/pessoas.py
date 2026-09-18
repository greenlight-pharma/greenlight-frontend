"""
Índice de pessoas para o "Mapa do poder": quem pode ser reconhecido numa
notícia, com cargo, Poder, partido, UF e foto.

Três origens, todas oficiais:
  * ocupantes verificados do grafo federal (ministros, presidentes de
    autarquias, tribunais, Casas...);
  * deputados em exercício, API de Dados Abertos da Câmara (com foto oficial);
  * senadores em exercício, API de Dados Abertos do Senado (com foto oficial).

Para quem vem do grafo, a foto sai do Wikidata (imagem do Wikimedia Commons),
só quando a descrição da entidade confirma que é a pessoa brasileira certa.
O cache fica em `scripts/governo/dados/fotos.json`, versionado.

Reconhecer um nome em notícia: a imprensa escreve "Alexandre Padilha", não
"Alexandre Rocha Santos Padilha". Por isso cada pessoa tem variantes:
nome completo, primeiro + último sobrenome (pulando Filho, Júnior, Neto),
o rótulo do Wikidata e apelidos conhecidos (Lula).
"""
import json
import re
import time
import urllib.parse
from pathlib import Path

from comum import CACHE, DADOS, baixar, gravar_json, ler_json, norm

AQUI = Path(__file__).resolve().parent
FOTOS = AQUI.parent / "dados" / "fotos.json"
SUFIXOS = {"filho", "junior", "neto", "sobrinho", "segundo", "terceiro"}
APELIDOS = {"luiz inacio lula da silva": ["Lula"]}   # apelidos de uma palavra só entram à mão


def slug(nome):
    return re.sub(r"[^a-z0-9]+", "-", norm(nome)).strip("-")


def variantes(nome, extras=()):
    t = norm(nome).split()
    vs = {norm(nome)}
    if len(t) >= 3:
        ult = len(t) - 1
        while ult > 1 and t[ult] in SUFIXOS:
            ult -= 1
        vs.add(f"{t[0]} {t[ult]}")
        if ult != len(t) - 1:
            vs.add(f"{t[0]} {t[ult]} {t[-1]}")
    for e in extras:
        if e and (len(e.split()) >= 2 or e in sum(APELIDOS.values(), [])):
            vs.add(norm(e))
    for a in APELIDOS.get(norm(nome), []):
        vs.add(norm(a))
    return sorted(v for v in vs if len(v) >= 4)


def _json(url, pausa=0.3):
    texto = baixar(url, accept="application/json")
    time.sleep(pausa)
    try:
        return json.loads(texto)
    except json.JSONDecodeError:
        return None


def deputados():
    cache = CACHE / "deputados.json"
    if cache.exists() and time.time() - cache.stat().st_mtime < 20 * 3600:
        return json.loads(cache.read_text(encoding="utf-8"))
    d = _json("https://dadosabertos.camara.leg.br/api/v2/deputados?itens=1000&ordem=ASC&ordenarPor=nome")
    lista = [{"nome": x["nome"], "partido": x.get("siglaPartido"), "uf": x.get("siglaUf"),
              "foto": (x.get("urlFoto") or "").replace("http://", "https://"),
              "fonte": f"https://www.camara.leg.br/deputados/{x['id']}"} for x in (d or {}).get("dados", [])]
    if lista:
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(json.dumps(lista, ensure_ascii=False), encoding="utf-8")
    return lista


def senadores():
    cache = CACHE / "senadores.json"
    if cache.exists() and time.time() - cache.stat().st_mtime < 20 * 3600:
        return json.loads(cache.read_text(encoding="utf-8"))
    d = _json("https://legis.senado.leg.br/dadosabertos/senador/lista/atual.json")
    ps = (((d or {}).get("ListaParlamentarEmExercicio") or {}).get("Parlamentares") or {}).get("Parlamentar") or []
    lista = []
    for p in ps:
        i = p.get("IdentificacaoParlamentar") or {}
        lista.append({"nome": i.get("NomeParlamentar"), "nome_completo": i.get("NomeCompletoParlamentar"),
                      "partido": i.get("SiglaPartidoParlamentar"), "uf": i.get("UfParlamentar"), "sexo": i.get("SexoParlamentar"),
                      "foto": (i.get("UrlFotoParlamentar") or "").replace("http://", "https://"),
                      "fonte": (i.get("UrlPaginaParlamentar") or "").replace("http://", "https://")})
    if lista:
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(json.dumps(lista, ensure_ascii=False), encoding="utf-8")
    return lista


def mesma_pessoa(a, b):
    ta, tb = norm(a).split(), norm(b).split()
    curto, longo = (ta, tb) if len(ta) <= len(tb) else (tb, ta)
    return bool(curto) and len(curto) >= 2 and curto[0] == longo[0] and curto[-1] in longo and all(t in longo for t in curto)


def indice(grafo):
    """Lista de pessoas com variantes de nome para casar em texto."""
    fotos = ler_json(FOTOS, {})
    pessoas = {}
    for n in grafo.nos:
        c = n.get("cargo") or {}
        if not c.get("ocupante"):
            continue
        nome = c["ocupante"]
        pid = slug(nome)
        if pid in pessoas:      # quem acumula (Presidente do STF preside o CNJ): fica o primeiro cargo, o principal
            continue
        f = fotos.get(pid) or {}
        pessoas[pid] = {"id": pid, "nome": f.get("rotulo") or nome, "nome_completo": nome,
                        "cargo": f"{c['titulo']} · {n.get('sigla') or n['nome']}", "no_id": n["id"], "poder": n["poder"],
                        "partido": None, "uf": None, "foto": f.get("foto"), "foto_fonte": f.get("fonte"),
                        "variantes": variantes(nome, [f.get("rotulo")] + (f.get("apelidos") or []))}
    for origem, lista, cargo in (("camara", deputados(), "Deputado(a) federal"), ("senado", senadores(), "Senador(a)")):
        for p in lista:
            if not p.get("nome"):
                continue
            dono = next((q for q in pessoas.values() if mesma_pessoa(q["nome_completo"], p.get("nome_completo") or p["nome"]) or mesma_pessoa(q["nome"], p["nome"])), None)
            if dono:   # já está no grafo (presidente da Casa): herda partido, UF e a foto oficial
                dono.update(partido=p["partido"], uf=p["uf"], foto=p["foto"] or dono["foto"], foto_fonte=p["fonte"])
                dono["variantes"] = sorted(set(dono["variantes"]) | set(variantes(p["nome"])))
                continue
            pid = slug(p["nome"])
            if origem == "senado" and p.get("sexo"):
                cargo = "Senadora" if p["sexo"].startswith("F") else "Senador"
            pessoas[pid] = {"id": pid, "nome": p["nome"], "nome_completo": p.get("nome_completo") or p["nome"],
                            "cargo": f"{cargo}, {p['uf']}", "no_id": "camara" if origem == "camara" else "senado",
                            "poder": "legislativo", "partido": p["partido"], "uf": p["uf"], "foto": p["foto"], "foto_fonte": p["fonte"],
                            "variantes": [norm(p["nome"])] if len(p["nome"].split()) >= 2 else []}
    return list(pessoas.values())


def casar(texto, pessoas):
    t = " " + re.sub(r"[^a-z0-9 ]+", " ", norm(texto)) + " "
    t = re.sub(r"\s+", " ", t)
    return [p["id"] for p in pessoas if any(f" {v} " in t for v in p["variantes"])]


# ----------------------------------------------------------------- fotos (Wikidata)
DESCR_OK = re.compile(r"brazil|brasil", re.I)
PUBLICO = re.compile(r"politic|polític|minist|govern|secret|president|diretor|director|economist|economista|jurist|advog|lawyer|"
                     r"judge|juiz|magistrad|diplomat|militar|military|admiral|almirante|general|officer|civil servant|servidor|"
                     r"physician|médic|scientist|cientista|sociolog|professor|engineer|engenheir", re.I)


def foto_wikidata(nome, pausa=0.4):
    """(rótulo, url da foto, página, apelidos) da pessoa brasileira com esse nome, ou None."""
    t = nome.split()
    ult = len(t) - 1
    while ult > 1 and norm(t[ult]) in SUFIXOS:
        ult -= 1
    curto = f"{t[0]} {t[ult]}" if len(t) >= 3 else nome
    for termo in dict.fromkeys([nome, curto]):
        frouxa = termo != nome
        busca = _json("https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode(
            {"action": "wbsearchentities", "search": termo, "language": "pt", "uselang": "pt", "format": "json", "limit": 5}), pausa)
        for r in (busca or {}).get("search", []):
            descr = r.get("description") or ""
            if not DESCR_OK.search(descr):
                continue
            # na busca pelo nome curto, homônimo é fácil: exige descrição de cargo público
            if frouxa and not PUBLICO.search(descr):
                continue
            ent = _json("https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode(
                {"action": "wbgetentities", "ids": r["id"], "props": "claims|labels|aliases", "languages": "pt|en", "format": "json"}), pausa)
            e = ((ent or {}).get("entities") or {}).get(r["id"]) or {}
            cl = e.get("claims") or {}
            # tem de ser humano (P31 = Q5) e ter nacionalidade brasileira (P27 = Q155)
            humano = any(((c.get("mainsnak") or {}).get("datavalue") or {}).get("value", {}).get("id") == "Q5" for c in cl.get("P31", []))
            brasil = any(((c.get("mainsnak") or {}).get("datavalue") or {}).get("value", {}).get("id") == "Q155" for c in cl.get("P27", []))
            if not (humano and brasil):
                continue
            img = next((((c.get("mainsnak") or {}).get("datavalue") or {}).get("value") for c in cl.get("P18", [])), None)
            rotulo = ((e.get("labels") or {}).get("pt") or (e.get("labels") or {}).get("en") or {}).get("value")
            apelidos = [a["value"] for a in (e.get("aliases") or {}).get("pt", [])][:6]
            url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{urllib.parse.quote(img.replace(' ', '_'))}?width=160" if img else None
            return {"rotulo": rotulo, "foto": url, "fonte": f"https://www.wikidata.org/wiki/{r['id']}", "apelidos": apelidos}
    return None


def preparar_grafo(grafo, limite=400):
    """Rótulo, apelidos e foto do Wikidata para os ocupantes do grafo ainda sem cache.
    Roda uma vez por pessoa; o resultado fica em fotos.json."""
    fotos = ler_json(FOTOS, {})
    novos = 0
    for n in grafo.nos:
        nome = (n.get("cargo") or {}).get("ocupante")
        if not nome or slug(nome) in fotos or novos >= limite:
            continue
        fotos[slug(nome)] = foto_wikidata(nome) or {"foto": None}
        novos += 1
    if novos:
        gravar_json(FOTOS, dict(sorted(fotos.items())))
    return novos


def completar_fotos(pessoas_rank, limite=30):
    """Busca foto no Wikidata para quem está no ranking e ainda não tem."""
    fotos = ler_json(FOTOS, {})
    novos = 0
    for p in pessoas_rank[:limite]:
        if p.get("foto") or p["id"] in fotos:
            continue
        achado = foto_wikidata(p["nome_completo"])
        fotos[p["id"]] = achado or {"foto": None}
        novos += 1
        if achado:
            p["foto"], p["foto_fonte"] = achado.get("foto"), achado.get("fonte")
            if achado.get("rotulo"):
                p["nome"] = achado["rotulo"]
    if novos:
        gravar_json(FOTOS, dict(sorted(fotos.items())))
    return novos
