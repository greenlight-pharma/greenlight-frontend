#!/usr/bin/env python3
"""
Agente do Diário Oficial: acompanha nomeações, exonerações, designações e
dispensas de cargos de comando do Executivo federal e grava o feed
`governo/dados/mudancas.json`, que o site mostra em "Últimas mudanças".

De onde vem
  Seção 2 do DOU, atos assinados pela Presidência da República: os decretos
  do Presidente (ministros, secretários-executivos, presidentes de agências e
  autarquias) e as portarias da Casa Civil (Decreto 9.794/2019, art. 4º:
  cargos CCE/FCE de nível 1.15 para cima, isto é, diretores, secretários
  nacionais, presidentes de fundações e empresas). É a fonte primária e a
  única onde um nome vira ocupante de cargo.

Como funciona
  1. Busca pública do DOU (in.gov.br/consulta), seção 2, órgão principal
     "Presidência da República", um verbo por consulta, janela de poucos dias.
  2. Para cada ato encontrado, baixa o texto integral e separa os itens
     ("Nº 1.040 - NOMEAR FULANA, para exercer o cargo de ...").
  3. Casa cada item com um nó do grafo (pelo nome do órgão ou da pasta) e
     classifica o nível: `comando` (o cargo de comando do nó, como Ministro,
     Presidente, Diretor-Presidente), `alta` (secretário-executivo,
     secretário nacional, diretor de agência, código 1.17 para cima) ou
     `outra` (o resto: diretores de departamento, coordenadores).
  4. Junta saída e entrada do mesmo cargo no mesmo dia num único registro
     (SAI fulano / ENTRA beltrano), como a CivLab faz.
  5. Se houver ANTHROPIC_API_KEY, pede à Claude uma frase de resumo e a
     confirmação do nó para os itens de comando e alta que ficaram sem casar.

O feed não altera `cargo.ocupante` no grafo: continua valendo a regra
"estrutura sim, pessoas só com fonte" e a revisão humana do PR semanal.
Cada registro traz o link do ato no DOU, que é a fonte.

Uso:
    python3 scripts/governo/agentes/agente_dou.py --dias 3
    python3 scripts/governo/agentes/agente_dou.py --dias 45 --sem-claude
"""
import argparse
import datetime as dt
import hashlib
import html
import json
import os
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comum import DADOS, Grafo, baixar, gravar_json, hoje, ler_json, nome_proprio, norm  # noqa: E402

BUSCA = "https://www.in.gov.br/consulta/-/buscar/dou"
ARTIGO = "https://www.in.gov.br/web/dou/-/"
VERBOS = ["nomear", "exonerar", "designar", "dispensar"]
SAIDA = DADOS / "mudancas.json"
JANELA_DIAS = 120       # o feed guarda quatro meses

# Cabeçalhos de cargo que caracterizam nível alto mesmo sem ser o cargo de
# comando do nó (o resto, como diretor de departamento, é "outra").
ALTA = re.compile(r"^(secretari[oa][- ]executiv|secretari[oa] (nacional|especial|extraordinari)|"
                  r"presidente|vice-presidente|diretor(a)?[- ]presidente|diretor(a)?[- ]geral|diretor(a)?[- ]executiv|"
                  r"superintendente|reitor|comandante|chefe de gabinete(?! adjunto)|procurador(a)?[- ]geral|controlador|ouvidor(a)?[- ]geral|"
                  r"consultor(a)?[- ]geral|subchefe|secretari[oa][- ]geral|diretor(a)? d[aeo] agencia)")


# Os decretos do Presidente ficam indexados sob "Atos do Poder Executivo"; as
# portarias da Casa Civil, sob "Presidência da República".
ORGAOS_BUSCA = ["Atos do Poder Executivo", "Presidência da República"]


def buscar_atos(de, ate, verbo, org_prin):
    """Resultados da busca do DOU (seção 2) para um verbo, um órgão e um período."""
    pagina = baixar(BUSCA, params={
        "q": verbo, "s": "do2", "exactDate": "personalizado", "sortType": "0",
        "publishFrom": de.strftime("%d-%m-%Y"), "publishTo": ate.strftime("%d-%m-%Y"),
        "delta": "50", "orgPrin": org_prin,
    })
    m = re.search(r'<script id="[^"]*_params" type="application/json">\s*(\{.*?\})\s*</script>', pagina, re.S)
    if not m:
        return []
    try:
        itens = json.loads(m.group(1)).get("jsonArray") or []
    except json.JSONDecodeError:
        return []
    saida = []
    for it in itens:
        hier = it.get("hierarchyStr") or ""
        # Só os atos de pessoal assinados pelo Presidente ou pela Casa Civil.
        if not (hier.startswith("Presidência da República/Casa Civil") or "Atos do Poder Executivo" in hier
                or hier == "Presidência da República"):
            continue
        titulo = it.get("title") or ""
        if not re.match(r"^\s*(DECRETOS?|PORTARIAS)\s+DE\s+\d", titulo, re.I) and "Atos do Poder Executivo" not in hier:
            continue
        saida.append({
            "titulo": titulo.strip(), "url_titulo": it.get("urlTitle"), "publicado": it.get("pubDate"),
            "hierarquia": hier, "tipo_ato": it.get("artType") or "",
        })
    return saida


def texto_do_ato(url_titulo):
    pagina = baixar(ARTIGO + url_titulo)
    m = re.search(r'<div class="texto-dou">(.*?)<div class="(?:info-dou|publicado|dou-paragraph-footer)', pagina, re.S) \
        or re.search(r'class="texto-dou"[^>]*>(.*?)Este conteúdo não substitui', pagina, re.S)
    if not m:
        return ""
    t = re.sub(r"<[^>]+>", " ", m.group(1))
    t = html.unescape(t)
    return re.sub(r"\s+", " ", t).strip()


# Um item: verbo em maiúsculas, opcionalmente ", a pedido," ou ", a partir de <data>,",
# o NOME EM MAIÚSCULAS, opcionalmente uma qualificação (", Professor da Universidade X,")
# e a ligação com o cargo ("para exercer o cargo de", "do cargo de", "ao cargo de"...).
VERBOS_RE = r"NOMEAR|EXONERAR|DESIGNAR|DISPENSAR|RECONDUZIR|TORNAR SEM EFEITO"
RE_ITEM = re.compile(
    r"\b(" + VERBOS_RE + r")\b\s*,?\s*"
    r"(?P<pedido>a pedido,?\s*)?(?:a partir de [^,]{6,40},\s*)?(?:interinamente\s+)?"
    r"(?P<nome>[A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ'\-\.]*(?:\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ'\-\.]*)+)"
    r"\s*(?:,\s*[^,]{0,120}?,)?\s*,?\s*(?P<liga>para exercer|para responder|para substituir|para compor|do cargo|da função|do emprego|da interinidade|no cargo|ao cargo)"
    r"(?P<resto>.*?)(?=\s+Nº\s+[\d\.]+\s*-\s*|\b(?:" + VERBOS_RE + r")\b|$)",
    re.S)
RE_CARGO = re.compile(r"(?:cargo|função|emprego)\s+(?:em comissão\s+)?de\s+(?P<cargo>.+?)(?:,\s*código|,\s*ficando|,\s*a partir|,\s*com mandato|\.\s|\.$|$)", re.S)
RE_CODIGO = re.compile(r"código\s+(?P<cod>(?:CCE|FCE|DAS|FCPE|CD|CA|CGE|NES)[\s\d\.\-]+)", re.I)
RE_DESDE = re.compile(r"a partir de (\d{1,2}º? de [a-zç]+ de \d{4})", re.I)
MESES = {m: i + 1 for i, m in enumerate(["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"])}


def data_pt(s):
    m = re.search(r"(\d{1,2})º?\s+de\s+([a-zç]+)\s+de\s+(\d{4})", s or "", re.I)
    if not m or norm(m.group(2)) not in {norm(k) for k in MESES}:
        return None
    mes = next(v for k, v in MESES.items() if norm(k) == norm(m.group(2)))
    return f"{m.group(3)}-{mes:02d}-{int(m.group(1)):02d}"


def data_br(s):
    m = re.match(r"(\d{2})/(\d{2})/(\d{4})", s or "")
    return f"{m.group(3)}-{m.group(2)}-{m.group(1)}" if m else None


def classificar(item, grafo):
    """Casa o cargo com um nó e decide o nível."""
    cargo = item["cargo"]
    head = norm(re.split(r"\s+d[aeo]s?\s+", cargo, maxsplit=1)[0])
    no_id = None
    m = re.match(r"ministr[oa] de estado (d[aeo]s? .+)$", norm(cargo))
    if m:
        no_id = grafo.casar_ministerio_por_pasta(m.group(1).split(" ", 1)[1])
        if no_id:
            return no_id, "comando"
    no_id, trecho = grafo.casar_orgao(cargo)
    if no_id:
        n = grafo.por_id[no_id]
        titulo = norm(re.sub(r"\(a\)", "", (n.get("cargo") or {}).get("titulo", ""))).replace("-", " ")
        cabeca = head.replace("-", " ")
        # O cargo de comando do nó é "<título> d[aeo] <nome do nó>": "Presidente da Fiocruz",
        # "Diretor-Presidente da Anvisa". "Presidente do Conselho X da Fiocruz" não é.
        logo_apos = re.match(re.escape(cabeca) + r" d[aeo]s? " + re.escape(norm(trecho)), norm(cargo).replace("-", " "))
        if titulo and logo_apos and (cabeca == titulo or (len(titulo.split()) >= 2 and cabeca.startswith(titulo))):
            return no_id, "comando"
    nivel = "alta" if ALTA.match(head) else "outra"
    cod = item.get("codigo") or ""
    mm = re.search(r"(\d)\.(\d{2})", cod)
    if mm and int(mm.group(2)) >= 17:
        nivel = "alta" if nivel == "outra" else nivel
    return no_id, nivel


def extrair_itens(ato, texto, grafo):
    itens = []
    for m in RE_ITEM.finditer(texto):
        verbo = m.group(1).upper()
        nome = re.sub(r"\s+", " ", m.group("nome")).strip(" ,.")
        if len(nome.split()) < 2 or len(nome) > 80:
            continue
        resto = (m.group("liga") + m.group("resto")).strip()
        mc = RE_CARGO.search(resto)
        if not mc and m.group("liga") == "para compor":
            mc = re.match(r"para compor\s+(?P<cargo>.+?)(?:,\s*código|,\s*a partir|\.\s|\.$|$)", resto)
        if not mc:
            # "DESIGNAR FULANO para substituir ..." / "para responder pelo cargo"
            mc2 = re.search(r"(?:substituir|responder)\s+(?:pel[oa]\s+)?(?:cargo de\s+)?(?P<cargo>.+?)(?:,\s*código|,\s*nos|\.\s|$)", resto)
            if not mc2:
                continue
            cargo = mc2.group("cargo")
        else:
            cargo = mc.group("cargo")
        cargo = re.sub(r"\s+", " ", cargo).strip(" ,.;")
        # "Reitor da referida Universidade": o órgão foi citado antes, na qualificação
        if re.search(r"\breferid[ao]\b", cargo):
            id_ref, _ = grafo.casar_orgao(m.group(0))
            ref = re.search(r"(Universidade[^,]+|Instituto[^,]+|Fundação[^,]+|Centro[^,]+)", m.group(0))
            if ref:
                art = "do" if ref.group(1).split()[0].endswith("o") else "da"
                cargo = re.sub(r"\b(?:d[ao]\s+)?referid[ao]\s+\w+", art + " " + ref.group(1).strip(), cargo)
        if len(cargo) < 6:
            continue
        cod = RE_CODIGO.search(resto)
        interino = bool(re.search(r"interin|substitut", resto, re.I)) or bool(re.search(r"interinamente", m.group(0), re.I))
        tipo = {"NOMEAR": "nomeacao", "EXONERAR": "exoneracao", "DESIGNAR": "designacao", "RECONDUZIR": "nomeacao",
                "DISPENSAR": "dispensa", "TORNAR SEM EFEITO": "sem_efeito"}[verbo]
        numero = re.search(r"Nº\s*([\d\.]+)\s*-\s*" + re.escape(m.group(1)), texto[max(0, m.start() - 40):m.end()])
        item = {
            "tipo": tipo, "pessoa": nome_proprio(nome), "cargo": cargo,
            "codigo": re.sub(r"\s+", " ", cod.group("cod")).strip() if cod else None,
            "interino": interino, "a_pedido": bool(m.group("pedido")),
            "desde": data_pt(RE_DESDE.search(resto).group(1)) if RE_DESDE.search(resto) else None,
            "numero": numero.group(1) if numero else None,
        }
        item["no_id"], item["nivel"] = classificar(item, grafo)
        itens.append(item)
    return itens


def montar_registros(ato, itens):
    """Junta saída e entrada do mesmo cargo no mesmo ato; um registro por cargo."""
    publicado = data_br(ato["publicado"])
    data = data_pt(ato["titulo"]) or publicado
    ato_nome = "Decreto" if ato["titulo"].upper().startswith("DECRETO") else "Portaria"
    assinante = "Presidência da República" if ato_nome == "Decreto" else "Casa Civil da Presidência da República"
    por_cargo = {}
    ordem = []
    for it in itens:
        chave = norm(it["cargo"])
        if chave not in por_cargo:
            por_cargo[chave] = {"entra": None, "sai": None, "itens": []}
            ordem.append(chave)
        por_cargo[chave]["itens"].append(it)
        if it["tipo"] in ("nomeacao", "designacao") and not por_cargo[chave]["entra"]:
            por_cargo[chave]["entra"] = it
        elif it["tipo"] in ("exoneracao", "dispensa") and not por_cargo[chave]["sai"]:
            por_cargo[chave]["sai"] = it
    regs = []
    for chave in ordem:
        g = por_cargo[chave]
        base = g["entra"] or g["sai"] or g["itens"][0]
        if base["tipo"] == "sem_efeito":
            continue
        tipo = "troca" if g["entra"] and g["sai"] else ("nomeacao" if g["entra"] else "saida")
        numeros = [i["numero"] for i in g["itens"] if i.get("numero")]
        chave_id = f"{ato['url_titulo']}|{chave}"
        regs.append({
            "id": "dou-" + hashlib.sha1(chave_id.encode()).hexdigest()[:12],
            "data": data, "publicado_em": publicado,
            "tipo": tipo,
            "cargo": base["cargo"], "codigo": base.get("codigo"),
            "entra": g["entra"]["pessoa"] if g["entra"] else None,
            "sai": g["sai"]["pessoa"] if g["sai"] else None,
            "interino": bool(g["entra"] and g["entra"]["interino"]),
            "a_pedido": bool(g["sai"] and g["sai"]["a_pedido"]),
            "desde": (g["entra"] or g["sai"]).get("desde"),
            "no_id": base["no_id"], "nivel": base["nivel"],
            "ato": f"{ato_nome}{' nº ' + numeros[0] if numeros else ''}" + (f", de {data[8:10]}/{data[5:7]}/{data[:4]}" if data else ""),
            "assinante": assinante,
            "fonte": ARTIGO + ato["url_titulo"], "fonte_nome": "DOU, seção 2",
            "origem": "dou",
        })
    return regs


# ----------------------------------------------------------------- Claude (opcional)
def refinar_com_claude(registros, grafo):
    """Para os registros de comando e alta sem nó casado, pede à Claude o nó e um resumo.
    Só roda com ANTHROPIC_API_KEY; sem a chave, o feed sai só pelas regras."""
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return 0
    alvo = [r for r in registros if r["nivel"] in ("comando", "alta") and not r.get("resumo")][:60]
    if not alvo:
        return 0
    try:
        import anthropic
    except ImportError:
        print("  (pacote anthropic ausente; pulei o refinamento)", file=sys.stderr)
        return 0
    candidatos = [{"id": n["id"], "nome": n["nome"], "sigla": n.get("sigla"), "pai": n.get("pai"),
                   "cargo": (n.get("cargo") or {}).get("titulo")}
                  for n in grafo.nos if n["tipo"] not in ("raiz", "poder", "estado", "municipio")]
    esquema = {
        "type": "object",
        "properties": {
            "itens": {"type": "array", "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "no_id": {"type": ["string", "null"]},
                    "nivel": {"type": "string", "enum": ["comando", "alta", "outra"]},
                    "resumo": {"type": "string"},
                },
                "required": ["id", "no_id", "nivel", "resumo"], "additionalProperties": False}},
        },
        "required": ["itens"], "additionalProperties": False,
    }
    instrucao = (
        "Você recebe atos de pessoal do Diário Oficial da União (nomeações e exonerações do Executivo federal) "
        "e a lista de órgãos do Mapa do Governo. Para cada ato: (1) diga qual órgão da lista é o dono do cargo "
        "(no_id), ou null se nenhum; (2) diga o nível: 'comando' quando o cargo é o de chefia máxima desse órgão "
        "(ministro, presidente, diretor-presidente, diretor-geral, reitor), 'alta' para secretário-executivo, "
        "secretário nacional ou especial, diretor de agência reguladora ou presidente de órgão fora da lista, "
        "'outra' para o resto; (3) escreva um resumo de uma frase, em português direto, no formato "
        "'Fulano assume a Secretaria X do Ministério Y' ou 'Beltrano deixa o cargo de ...; assume Sicrano'. "
        "Não invente nomes nem cargos: use só o que está no ato."
    )
    client = anthropic.Anthropic()
    pedido = {"orgaos": candidatos, "atos": [{k: r[k] for k in ("id", "cargo", "entra", "sai", "interino", "a_pedido", "no_id", "nivel")} for r in alvo]}
    try:
        resposta = client.beta.messages.create(
            model="claude-opus-5",
            max_tokens=16000,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            system=instrucao,
            messages=[{"role": "user", "content": json.dumps(pedido, ensure_ascii=False)}],
            output_config={"format": {"type": "json_schema", "schema": esquema}},
        )
    except anthropic.APIStatusError as e:
        print(f"  Claude respondeu erro {e.status_code}; feed segue só com as regras", file=sys.stderr)
        return 0
    except anthropic.APIConnectionError as e:
        print(f"  sem conexão com a API da Claude ({e}); feed segue só com as regras", file=sys.stderr)
        return 0
    if resposta.stop_reason == "refusal":
        return 0
    texto = next((b.text for b in resposta.content if b.type == "text"), "{}")
    try:
        itens = json.loads(texto).get("itens", [])
    except json.JSONDecodeError:
        return 0
    por_id = {r["id"]: r for r in registros}
    n = 0
    for it in itens:
        r = por_id.get(it["id"])
        if not r:
            continue
        if it.get("no_id") in grafo.por_id:
            r["no_id"] = it["no_id"]
        if it.get("nivel") in ("comando", "alta", "outra"):
            r["nivel"] = it["nivel"]
        if it.get("resumo"):
            r["resumo"] = it["resumo"].strip()
        n += 1
    return n


def resumo_por_regra(r, grafo):
    orgao = grafo.por_id[r["no_id"]]["nome"] if r.get("no_id") else None
    cargo = r["cargo"]
    if r["tipo"] == "troca":
        s = f"{r['sai']} deixa o cargo de {cargo}; assume {r['entra']}"
    elif r["tipo"] == "nomeacao":
        s = f"{r['entra']} assume {'interinamente ' if r['interino'] else ''}o cargo de {cargo}"
    else:
        s = f"{r['sai']} deixa {'a pedido ' if r['a_pedido'] else ''}o cargo de {cargo}"
    if orgao and norm(orgao) not in norm(cargo):
        s += f" ({orgao})"
    return s + "."


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dias", type=int, default=3, help="quantos dias para trás buscar")
    ap.add_argument("--pausa", type=float, default=1.0)
    ap.add_argument("--sem-claude", action="store_true")
    ap.add_argument("--saida", default=str(SAIDA))
    args = ap.parse_args()

    grafo = Grafo()
    ate = hoje()
    de = ate - dt.timedelta(days=args.dias)
    print(f"==> DOU seção 2, decretos do Presidente e portarias da Casa Civil, {de} a {ate}")

    atos = {}
    passo = dt.timedelta(days=3)
    ini = de
    while ini <= ate:
        fim = min(ini + passo - dt.timedelta(days=1), ate)
        for org in ORGAOS_BUSCA:
            for verbo in VERBOS:
                for a in buscar_atos(ini, fim, verbo, org):
                    atos.setdefault(a["url_titulo"], a)
                time.sleep(args.pausa)
        ini = fim + dt.timedelta(days=1)
    print(f"    {len(atos)} atos da Presidência ou da Casa Civil")

    novos = []
    for i, (chave, ato) in enumerate(sorted(atos.items(), key=lambda kv: kv[1]["publicado"])):
        texto = texto_do_ato(chave)
        if not texto:
            continue
        itens = extrair_itens(ato, texto, grafo)
        regs = montar_registros(ato, itens)
        novos.extend(regs)
        print(f"    [{i+1}/{len(atos)}] {ato['publicado']} {ato['titulo'][:60]}: {len(itens)} itens, {len(regs)} registros")
        time.sleep(args.pausa * .5)

    existente = ler_json(args.saida, {"meta": {}, "mudancas": []})
    por_id = {m["id"]: m for m in existente.get("mudancas", [])}
    for r in novos:
        antigo = por_id.get(r["id"])
        if antigo and antigo.get("resumo"):
            r["resumo"] = antigo["resumo"]
            if antigo.get("no_id") and not r.get("no_id"):
                r["no_id"] = antigo["no_id"]
        por_id[r["id"]] = r
    todos = list(por_id.values())
    limite = (ate - dt.timedelta(days=JANELA_DIAS)).isoformat()
    todos = [m for m in todos if (m.get("data") or m.get("publicado_em") or "") >= limite]

    refinados = 0 if args.sem_claude else refinar_com_claude(todos, grafo)
    for m in todos:
        if not m.get("resumo"):
            m["resumo"] = resumo_por_regra(m, grafo)
    todos.sort(key=lambda m: (m.get("publicado_em") or "", m.get("data") or ""), reverse=True)

    contagem = {"comando": 0, "alta": 0, "outra": 0}
    for m in todos:
        contagem[m["nivel"]] = contagem.get(m["nivel"], 0) + 1
    saida = {
        "meta": {
            "gerado_em": dt.datetime.now(dt.timezone.utc).isoformat(timespec="minutes"),
            "gerado_por": "scripts/governo/agentes/agente_dou.py",
            "janela_dias": JANELA_DIAS,
            "fonte": {"nome": "Diário Oficial da União, seção 2 (atos da Presidência da República e da Casa Civil)",
                      "url": "https://www.in.gov.br/consulta/-/buscar/dou"},
            "regra": "O feed registra o que o DOU publicou, com link para cada ato. Ocupantes no grafo só mudam com revisão humana.",
            "contagem": contagem, "refinados_por_claude": refinados,
        },
        "mudancas": todos,
    }
    gravar_json(args.saida, saida)
    print(f"    {len(todos)} registros no feed ({contagem}) -> {args.saida}")


if __name__ == "__main__":
    main()
