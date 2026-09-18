#!/usr/bin/env python3
"""
Agente de ocupantes: descobre quem ocupa hoje cada cargo de comando do
Executivo federal no mapa e grava `scripts/governo/dados/ocupantes.json`,
que o `montar_grafo.py` aplica sobre a semente.

Duas fontes oficiais, uma contra a outra
  1. e-Agendas (CGU). Toda autoridade do Executivo federal é obrigada a
     publicar agenda (Lei 12.813/2013, Decreto 10.889/2021), então o
     e-Agendas lista, por órgão, cada agente público obrigado ativo: nome,
     cargo, data de início e a marca de "autoridade máxima do órgão". É a
     rota pública que a própria página usa:
       /pesquisa/agentes-publicos-obrigados-por-orgao/orgao/<id>/ativo/true
  2. Diário Oficial da União. O e-Agendas atrasa: quando alguém sai, o
     registro às vezes fica ativo por semanas. Por isso cada nome escolhido
     passa por uma busca no DOU (seção 2) por exoneração ou dispensa
     publicada depois da data de início. Se houver, o nome é descartado e
     o agente tenta o próximo candidato para o mesmo cargo.

Como escolhe o ocupante de um nó
  * Se o nó é um órgão do e-Agendas (ministério, autarquia, agência...), vale
    quem tem a marca de autoridade máxima; havendo mais de um, o mais recente.
  * Se não é (secretarias, Receita, Tesouro, Abin, INPE), procura na lista do
    ministério-pai um cargo de chefia cujo texto contenha o nome do nó.
  * Estatais sem cadastro no e-Agendas (Petrobras, Banco do Brasil, Caixa,
    BNDES...) ficam como estão: o cargo é eleito pelo conselho e não sai no
    DOU. Entram por `ocupantes-manual.json`, com fonte, quando alguém confere.

Os 14 ocupantes da semente (Presidente, Vice, Casas, tribunais superiores,
PGR, Banco Central) não são sobrescritos; divergência vira aviso no relatório.

Uso:
    python3 scripts/governo/agentes/agente_ocupantes.py            # baixa, confere e grava
    python3 scripts/governo/agentes/agente_ocupantes.py --aplicar  # também regrava o JSON do grafo
"""
import argparse
import datetime as dt
import html
import json
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comum import CACHE, DADOS, Grafo, baixar, gravar_json, hoje, ler_json, nome_proprio, norm  # noqa: E402

EAG = "https://eagendas.cgu.gov.br"
ROTA = EAG + "/pesquisa/agentes-publicos-obrigados-por-orgao/orgao/{id}/ativo/true"
DOU_BUSCA = "https://www.in.gov.br/consulta/-/buscar/dou"
DOU_ARTIGO = "https://www.in.gov.br/web/dou/-/"
AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "dados" / "ocupantes.json"
MANUAL = AQUI.parent / "dados" / "ocupantes-manual.json"
CACHE_EAG = CACHE / "eagendas"

# Órgãos do mapa com nome diferente no e-Agendas.
MAPA_MANUAL = {"sri": 1387, "gsi": 512, "infra-sa": 1427}
CHEFIA = re.compile(r"^(ministr|secretari|diretor|presidente|superintendente|comandante|procurador|chefe|reitor|"
                    r"advogad|controlador|defensor|administrador|coordenador-geral|ouvidor)")
NAO_CHEFIA = re.compile(r"adjunt|substitut|subsecret|assessor|diretor\(a\) de programa|diretor de programa|"
                        r"chefe de gabinete|chefe da assessoria|vice-|coordenador\(a\)|coordenador |gerente")
PALAVRAS_VAZIAS = {"de", "da", "do", "das", "dos", "e", "a", "o", "em", "para", "na", "no", "a"}
GENERICAS = {"secretaria", "ministerio", "nacional", "especial", "federal", "brasil", "brasileira", "brasileiro"}


def limpar_cargo(c):
    return re.sub(r"\s+", " ", norm(re.sub(r"\s*\((a|o|as|os)\)", "", c or "", flags=re.I)).replace("-", " ")).strip()


def raiz(w):
    """secretária/secretário -> secretari; diretora -> diretor; ministra -> ministr."""
    return re.sub(r"[ao]s?$", "", w)


POSTOS = re.compile(r"^(almirante de esquadra|general de exercito|tenente[- ]brigadeiro do ar|brigadeiro|general|almirante)\s+", re.I)


def limpar_nome(nome):
    return POSTOS.sub("", nome_proprio(nome)).strip()


def mesma_pessoa(a, b):
    """'Gabriel Galípolo' e 'Gabriel Muricca Galípolo' são a mesma pessoa."""
    ta, tb = norm(a).split(), norm(b).split()
    curto, longo = (ta, tb) if len(ta) <= len(tb) else (tb, ta)
    return bool(curto) and curto[0] == longo[0] and curto[-1] == longo[-1] and all(t in longo for t in curto)


TITULOS = r"(ministr[oa]|secretari[oa]|diretor[a]?|presidente|presidenta|superintendente|comandante|procurador[a]?|chefe|reitor[a]?)"


def _sem_ligas(t):
    return re.sub(r"\b(d[aeo]s?|e|a|o|em|na|no)\b", " ", t)


def resto_orgao(nome):
    """'Secretaria de Educação Superior' -> 'educacao superior'; 'Instituto Nacional de Câncer' fica inteiro."""
    t = limpar_cargo(nome)
    t = re.sub(r"^(secretaria|ministerio)( (especial|nacional|extraordinaria))?\b", "", t)
    return re.sub(r"\s+", " ", _sem_ligas(t)).strip()


def resto_cargo(c):
    """'secretario da secretaria nacional de justica' -> 'justica'; 'diretor do instituto x' -> 'instituto x'."""
    t = re.sub(r"^" + TITULOS + r"( (geral|executivo|executiva|especial|nacional|extraordinario|extraordinaria))*\b", "", c)
    t = re.sub(r"^\s*(d[aeo]s?\s+)?(secretaria|ministerio)( (especial|nacional|extraordinaria))?\b", "", t)
    return re.sub(r"\s+", " ", _sem_ligas(t)).strip()


def palavras(s):
    return [w for w in re.findall(r"[a-z0-9]+", limpar_cargo(s)) if w not in PALAVRAS_VAZIAS]


# ----------------------------------------------------------------- e-Agendas
def orgaos_eagendas():
    pagina = baixar(EAG + "/")
    m = re.search(r'ng-init="orgaos=(\[.*?\])"', pagina, re.S)
    if not m:
        raise SystemExit("e-Agendas: lista de órgãos não encontrada na página inicial (formato mudou?)")
    return [o for o in json.loads(html.unescape(m.group(1))) if o.get("activa")]


def agentes_do_orgao(org_id, pausa):
    cache = CACHE_EAG / f"{org_id}.json"
    if cache.exists() and time.time() - cache.stat().st_mtime < 6 * 3600:
        return json.loads(cache.read_text(encoding="utf-8"))
    texto = baixar(ROTA.format(id=org_id), accept="application/json")
    time.sleep(pausa)
    try:
        dados = json.loads(texto)
    except json.JSONDecodeError:
        return []
    if not isinstance(dados, list):
        return []
    lista = [{
        "nome": a.get("nome"), "cargo": a.get("cargo") or "", "inicio": a.get("fecha_inicio"),
        "exercicio": a.get("tipo_exercicio"), "maxima": bool((a.get("cargo_confianca") or {}).get("autoridade_maxima_orgao")),
        "orgao_id": a.get("orgao_id"), "orgao": a.get("orgao"),
    } for a in dados if not a.get("fecha_termino")]
    cache.parent.mkdir(parents=True, exist_ok=True)
    cache.write_text(json.dumps(lista, ensure_ascii=False), encoding="utf-8")
    return lista


def data_iso(br):
    m = re.match(r"(\d{2})-(\d{2})-(\d{4})", br or "")
    return f"{m.group(3)}-{m.group(2)}-{m.group(1)}" if m else None


# ----------------------------------------------------------------- DOU
# A busca pública do DOU devolve os atos mais recentes com qualquer das palavras,
# sem ordenar por relevância; procurar "exonerar FULANO" não acha o ato. Por isso
# a conferência usa o nosso próprio leitor do DOU (agente_dou.py), que separa cada
# exoneração e dispensa assinada pelo Presidente e pela Casa Civil: o feed público
# (governo/dados/mudancas.json, 120 dias) e, se existir, um histórico mais longo em
# .cache/dou-historico.json (python3 agente_dou.py --dias 262 --janela 400 --saida ...).
_saidas = None


def _carregar_saidas():
    global _saidas
    if _saidas is not None:
        return _saidas
    regs = {}
    for f in (DADOS / "mudancas.json", CACHE / "dou-historico.json"):
        for m in (ler_json(f, {}) or {}).get("mudancas", []):
            regs[m["id"]] = m
    _saidas = [m for m in regs.values() if m.get("sai")]
    return _saidas


def saiu_no_dou(nome, desde, pausa=0):
    """(data, url) da exoneração ou dispensa de `nome` publicada depois de `desde`, ou None."""
    alvo = norm(nome)
    for m in _carregar_saidas():
        if norm(m["sai"]) == alvo or mesma_pessoa(m["sai"], nome):
            data = m.get("publicado_em") or m.get("data")
            if not desde or (data and data > desde):
                return (data, m.get("fonte"))
    return None


def cobertura_dou():
    datas = sorted(m.get("publicado_em") or "" for m in _carregar_saidas() if m.get("publicado_em"))
    return (datas[0], datas[-1]) if datas else (None, None)


# ----------------------------------------------------------------- escolha
def candidatos(no, grafo, orgao_do_no, listas):
    """Agentes que podem ser o chefe do nó, do melhor para o pior."""
    proprio = orgao_do_no.get(no["id"])
    if proprio and listas.get(proprio):
        lista = listas[proprio]
        maximos = [a for a in lista if a["maxima"]]
        if maximos:
            return sorted(maximos, key=lambda a: data_iso(a["inicio"]) or "", reverse=True), proprio
        titulo = palavras(no["cargo"]["titulo"])[:1]
        por_titulo = [a for a in lista if titulo and palavras(a["cargo"])[:1] == titulo and not NAO_CHEFIA.search(limpar_cargo(a["cargo"]))]
        return sorted(por_titulo, key=lambda a: data_iso(a["inicio"]) or "", reverse=True), proprio
    # chefe de órgão interno: procura na lista dos ancestrais
    chave = [w for w in palavras(no["nome"]) if w not in GENERICAS]
    sigla = norm(no.get("sigla") or "")
    titulo_raiz = raiz((palavras(no["cargo"]["titulo"]) or [""])[0])
    resto_nome = resto_orgao(no["nome"])
    achados = []
    pai = no.get("pai")
    while pai and not achados:
        org = orgao_do_no.get(pai)
        for a in listas.get(org, []) if org else []:
            c = limpar_cargo(a["cargo"])
            if not CHEFIA.match(c) or NAO_CHEFIA.search(c):
                continue
            # o cargo tem de ser o mesmo tipo de chefia do nó: secretário para secretaria, diretor para instituto
            if titulo_raiz and raiz(c.split()[0]) != titulo_raiz:
                continue
            # "Secretário de Educação Superior" é da SESu; "Secretária de Regulação e Supervisão da
            # Educação Superior" não é, embora contenha as mesmas palavras: o cargo tem de começar
            # pelo nome do órgão, logo depois do título.
            rc = resto_cargo(c)
            if resto_nome and rc.startswith(resto_nome):
                achados.append((len(rc) - len(resto_nome), a))
            elif resto_nome and len(resto_nome.split()) >= 3 and rc.startswith(" ".join(resto_nome.split()[:3])) \
                    and set(resto_nome.split()) <= set(rc.split()):
                # "políticas sobre drogas e ativos" x "políticas sobre drogas e gestão de ativos"
                achados.append((100 + len(rc), a))
            elif sigla and len(sigla) >= 3 and re.search(r"\b" + re.escape(sigla) + r"\b", c):
                achados.append((50, a))
        pai = grafo.por_id[pai].get("pai")
        if achados:
            break
    achados.sort(key=lambda t: (t[0], -(int((data_iso(t[1]["inicio"]) or "0").replace("-", "")))))
    return [a for _, a in achados], org if achados else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pausa", type=float, default=0.6)
    ap.add_argument("--aplicar", action="store_true", help="regrava governo/dados/governo-federal.json")
    ap.add_argument("--sem-dou", action="store_true", help="pula a conferência no DOU (só para teste)")
    args = ap.parse_args()

    grafo = Grafo()
    print("==> e-Agendas: órgãos ativos")
    orgaos = orgaos_eagendas()
    por_nome = {norm(o["nombre"]): o["id"] for o in orgaos}
    por_sigla = {}
    for o in orgaos:
        if o.get("sigla"):
            por_sigla.setdefault(norm(o["sigla"]).split("/")[0], o["id"])
    nome_org = {o["id"]: o["nombre"] for o in orgaos}

    alvos = [n for n in grafo.nos if n.get("cargo") and n["poder"] == "executivo"]
    orgao_do_no = {}
    for n in grafo.nos:
        if n["id"] in MAPA_MANUAL:
            orgao_do_no[n["id"]] = MAPA_MANUAL[n["id"]]
        elif norm(n["nome"]) in por_nome:
            orgao_do_no[n["id"]] = por_nome[norm(n["nome"])]
        elif n.get("sigla") and n["tipo"] != "orgao" and norm(n["sigla"]) in por_sigla:
            orgao_do_no[n["id"]] = por_sigla[norm(n["sigla"])]
    precisa = {orgao_do_no[i] for i in orgao_do_no}
    print(f"    {len(orgaos)} órgãos no e-Agendas; {len(orgao_do_no)} nós do mapa casados; baixando {len(precisa)} listas")
    listas = {}
    for i, org in enumerate(sorted(precisa)):
        listas[org] = agentes_do_orgao(org, args.pausa)
        if (i + 1) % 20 == 0:
            print(f"    {i+1}/{len(precisa)} listas")

    anterior = ler_json(SAIDA, {"ocupantes": {}})
    resultado, relatorio = {}, {"confirmados": [], "descartados_dou": [], "sem_candidato": [], "divergencias": []}
    for n in alvos:
        semente_ok = bool(n["cargo"].get("ocupante"))
        cands, org = candidatos(n, grafo, orgao_do_no, listas)
        escolhido = None
        for a in cands[:3]:
            desde = data_iso(a["inicio"])
            saida = None if args.sem_dou else saiu_no_dou(a["nome"], desde, args.pausa)
            if saida:
                relatorio["descartados_dou"].append({"no": n["id"], "nome": nome_proprio(a["nome"]), "cargo": a["cargo"], "exonerado_em": saida[0], "ato": saida[1]})
                continue
            escolhido = a
            break
        if not escolhido:
            if not semente_ok:
                relatorio["sem_candidato"].append({"no": n["id"], "nome": n["nome"], "orgao_eagendas": nome_org.get(orgao_do_no.get(n["id"]))})
            continue
        nome = limpar_nome(escolhido["nome"])
        if semente_ok:
            if not mesma_pessoa(nome, n["cargo"]["ocupante"]) and escolhido["maxima"]:
                relatorio["divergencias"].append({"no": n["id"], "semente": n["cargo"]["ocupante"], "eagendas": nome, "cargo": escolhido["cargo"]})
            continue
        interino = bool(re.search(r"interin|substitut", (escolhido["exercicio"] or "") + " " + escolhido["cargo"], re.I))
        resultado[n["id"]] = {
            "ocupante": nome,
            "situacao": "interino" if interino else "titular",
            "desde": data_iso(escolhido["inicio"]),
            "cargo_na_fonte": escolhido["cargo"].capitalize(),
            "verificado_em": hoje().isoformat(),
            "fonte": ROTA.format(id=org),
            "fonte_nome": f"e-Agendas (CGU), {nome_org.get(org, '')}".strip(", "),
            "conferido_dou": not args.sem_dou,
            "dou_coberto": "{} a {}".format(*cobertura_dou()) if not args.sem_dou else None,
        }
        relatorio["confirmados"].append(n["id"])
        antigo = anterior.get("ocupantes", {}).get(n["id"])
        if antigo and norm(antigo["ocupante"]) != norm(nome):
            resultado[n["id"]]["anterior"] = antigo["ocupante"]

    # ocupantes conferidos à mão (estatais, órgãos sem e-Agendas) têm prioridade
    manual = ler_json(MANUAL, {"ocupantes": {}}).get("ocupantes", {})
    for k, v in manual.items():
        resultado[k] = {**v, "manual": True}

    gravar_json(SAIDA, {
        "meta": {
            "gerado_em": dt.datetime.now(dt.timezone.utc).isoformat(timespec="minutes"),
            "gerado_por": "scripts/governo/agentes/agente_ocupantes.py",
            "fontes": ["e-Agendas (CGU): agentes públicos obrigados ativos, por órgão",
                       "Diário Oficial da União, seção 2 (decretos do Presidente e portarias da Casa Civil, lidos pelo agente_dou.py): conferência de exoneração posterior à posse",
                       "ocupantes-manual.json: conferência manual, com fonte, para quem não está no e-Agendas"],
        },
        "ocupantes": dict(sorted(resultado.items())),
        "relatorio": relatorio,
    })
    print(f"    {len(relatorio['confirmados'])} confirmados, {len(relatorio['descartados_dou'])} descartados pelo DOU, "
          f"{len(relatorio['sem_candidato'])} sem candidato, {len(relatorio['divergencias'])} divergências com a semente -> {SAIDA}")
    if args.aplicar:
        aplicar_no_grafo(DADOS / "governo-federal.json")


def aplicar(dados, ocupantes=None):
    """Aplica ocupantes.json sobre o grafo (usado pelo montar_grafo.py). Não sobrescreve a semente."""
    ocupantes = ocupantes if ocupantes is not None else ler_json(SAIDA, {"ocupantes": {}}).get("ocupantes", {})
    n_aplicados = 0
    for n in dados["nos"]:
        o = ocupantes.get(n["id"])
        c = n.get("cargo")
        if not o or not c or (c.get("ocupante") and not c.get("fonte_agente")):
            continue
        c.update(ocupante=o["ocupante"], situacao=o["situacao"], desde=o.get("desde"),
                 verificado_em=o["verificado_em"][:7], fonte=o["fonte"], fonte_nome=o.get("fonte_nome"),
                 fonte_agente=True)
        n_aplicados += 1
    return n_aplicados


def aplicar_no_grafo(caminho):
    dados = ler_json(caminho)
    n = aplicar(dados)
    gravar_json(caminho, dados)
    print(f"    {n} ocupantes aplicados -> {caminho}")


if __name__ == "__main__":
    main()
