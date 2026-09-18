"""
Utilidades compartilhadas pelos agentes do Mapa do Governo: download com
cabeçalhos de navegador (o in.gov.br devolve 403 para clientes anônimos),
normalização de texto, leitura do grafo e um casador de nomes de órgãos.
"""
import datetime as dt
import json
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent.parent          # raiz do repositório
DADOS = RAIZ / "governo" / "dados"
CACHE = AQUI.parent / ".cache"

UA = "Mozilla/5.0 (compatible; mapadogoverno/0.2; +https://mapadogoverno.com.br)"


def baixar(url, tentativas=3, timeout=60, params=None, accept="text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"):
    """GET com cabeçalhos de navegador. Devolve texto ou '' se falhar."""
    if params:
        url = url + ("&" if "?" in url else "?") + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": accept,
        "Accept-Language": "pt-BR,pt;q=0.9",
    })
    for i in range(tentativas):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001
            print(f"  falhou ({e}) {url[:100]}", file=sys.stderr)
            time.sleep(2 ** i)
    return ""


def norm(s):
    """Minúsculas, sem acento, espaços colapsados."""
    s = unicodedata.normalize("NFD", str(s or ""))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", s).lower().strip()


PARTICULAS = {"de", "da", "do", "das", "dos", "e", "di", "del", "von", "van", "y"}


def nome_proprio(s):
    """'MUNIQUE REIS BRAZ COUTINHO' -> 'Munique Reis Braz Coutinho'."""
    palavras = []
    for i, p in enumerate(str(s or "").strip().split()):
        b = p.lower()
        if i and b in PARTICULAS:
            palavras.append(b)
        else:
            palavras.append("-".join(x.capitalize() for x in b.split("-")))
    return " ".join(palavras)


def hoje():
    return dt.date.today()


def ler_json(caminho, padrao=None):
    p = Path(caminho)
    if not p.exists():
        return padrao
    return json.loads(p.read_text(encoding="utf-8"))


def gravar_json(caminho, dados):
    p = Path(caminho)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(dados, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


class Grafo:
    """O grafo federal, com índices para casar nomes de órgãos e pessoas."""

    def __init__(self, caminho=DADOS / "governo-federal.json"):
        self.dados = ler_json(caminho)
        self.nos = self.dados["nos"]
        self.por_id = {n["id"]: n for n in self.nos}
        # nomes completos e siglas: os mais longos primeiro, para o casamento
        # preferir "Fundo Nacional de Desenvolvimento da Educação" a "Educação".
        self.nomes = sorted(
            [(norm(n["nome"]), n["id"]) for n in self.nos if n["tipo"] not in ("raiz", "poder", "grupo", "estado")],
            key=lambda x: -len(x[0]))
        self.siglas = {}
        for n in self.nos:
            s = n.get("sigla")
            if s and len(s) >= 3 and s != n["nome"] and n["tipo"] not in ("raiz", "poder", "estado"):
                self.siglas.setdefault(s, n["id"])
        # pessoas conhecidas (ocupantes verificados)
        self.pessoas = [(n["cargo"]["ocupante"], n["id"]) for n in self.nos
                        if n.get("cargo") and n["cargo"].get("ocupante")]
        # "Ministro de Estado da Saúde" -> "ms": índice pelo complemento do nome
        self.ministerios = {}
        for n in self.nos:
            if n["tipo"] == "ministerio" and norm(n["nome"]).startswith("ministerio "):
                self.ministerios[norm(n["nome"])[len("ministerio "):]] = n["id"]

    def casar_orgao(self, texto):
        """Devolve (id, trecho casado) do órgão mais específico citado no texto."""
        t = norm(texto)
        for nome, id_ in self.nomes:
            if len(nome) >= 8 and nome in t:
                return id_, nome
        # siglas (sensíveis a maiúsculas, com fronteira de palavra). Sigla que é
        # palavra comum ("Caixa") não casa quando vem seguida de "de": "Caixa de
        # Financiamento Imobiliário" não é a Caixa Econômica.
        for sigla, id_ in self.siglas.items():
            padrao = r"(?<![\wÀ-ÿ])" + re.escape(sigla) + r"(?![\wÀ-ÿ])"
            if not sigla.isupper():
                padrao += r"(?!\s+d[aeo]s?\s)"
            if re.search(padrao, texto):
                return id_, sigla
        return None, None

    def casar_ministerio_por_pasta(self, complemento):
        """'da Saúde' -> id do Ministério da Saúde."""
        c = norm(complemento)
        if c in self.ministerios:
            return self.ministerios[c]
        for pasta, id_ in self.ministerios.items():
            if c.startswith(pasta) or pasta.startswith(c):
                return id_
        return None

    def casar_pessoas(self, texto):
        t = norm(texto)
        return [(p, id_) for p, id_ in self.pessoas if norm(p) in t]

    def nos_citados(self, texto):
        """Todos os nós citados num texto (por nome completo ou sigla), sem repetição."""
        t = norm(texto)
        achados = []
        for nome, id_ in self.nomes:
            if len(nome) >= 10 and nome in t and id_ not in achados:
                achados.append(id_)
        for sigla, id_ in self.siglas.items():
            if id_ not in achados and re.search(r"(?<![\wÀ-ÿ])" + re.escape(sigla) + r"(?![\wÀ-ÿ])", texto):
                achados.append(id_)
        return achados
