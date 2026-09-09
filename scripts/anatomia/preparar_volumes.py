#!/usr/bin/env python3
"""
Prepara os volumes de tomografia usados pelo protótipo de anatomia por imagem
(estudante/anatomia/). Baixa fontes públicas, converte para o formato compacto
lido pelo navegador (.vytalvol) e escreve as imagens de conferência.

Fontes (detalhes e licenças em estudante/anatomia/dados/FONTES.md):
  * TC de corpo inteiro com 117 estruturas segmentadas — sujeito s1397 do
    conjunto TotalSegmentator v2.0.1 (CC BY 4.0), reamostrado a 3 mm pelo
    projeto PyVista (repositório pyvista/vtk-data).
  * TC de crânio em alta resolução — "FullHead" do VTKData (pyvista/vtk-data).

Uso:
  pip install numpy scipy pyvista pillow
  python3 scripts/anatomia/preparar_volumes.py [--cache DIR] [--saida DIR]

Formato .vytalvol (tudo dentro de um único gzip):
  8 bytes  "VYTALVOL"
  4 bytes  uint32 little-endian: tamanho do cabeçalho JSON
  N bytes  cabeçalho JSON (UTF-8)
  int16[]  HU, ordem x-mais-rápido (i + nx*(j + ny*k)), little-endian
  uint8[]  rótulo por voxel (0 = sem rótulo)
Eixos do volume no sistema LPS: +i = esquerda do paciente, +j = posterior,
+k = superior. A origem fica no centro do volume.
"""
import argparse, gzip, io, json, os, struct, sys, urllib.request, zipfile
import numpy as np
from scipy import ndimage

RAW = "https://raw.githubusercontent.com/pyvista/vtk-data/master/Data/"
FONTES = {
    "corpo_zip": RAW + "whole_body_ct/s1397_resampled.zip",
    "fullhead_mhd": RAW + "FullHead.mhd",
    "fullhead_raw": RAW + "FullHead.raw.gz",
}

# ---------------------------------------------------------------------------
# Agrupamento das 117 estruturas do TotalSegmentator em estruturas de estudo
# ---------------------------------------------------------------------------
GRUPOS = [
    # (id, nome, cor, lista de rótulos originais ou prefixos terminados em *)
    (1,  "Fígado",                      "#c8785a", ["liver"]),
    (2,  "Vesícula biliar",             "#5ea36b", ["gallbladder"]),
    (3,  "Baço",                        "#9b5bb0", ["spleen"]),
    (4,  "Estômago",                    "#e0b96a", ["stomach"]),
    (5,  "Pâncreas",                    "#e39a4f", ["pancreas"]),
    (6,  "Duodeno",                     "#e8d8a8", ["duodenum"]),
    (7,  "Intestino delgado",           "#d9c090", ["small_bowel"]),
    (8,  "Cólon",                       "#b98c6a", ["colon"]),
    (9,  "Rim direito",                 "#d97a3a", ["kidney_right", "kidney_cyst_right"]),
    (10, "Rim esquerdo",                "#e5924f", ["kidney_left", "kidney_cyst_left"]),
    (11, "Adrenais",                    "#f4c7a1", ["adrenal_gland_*"]),
    (12, "Bexiga",                      "#e6c34a", ["urinary_bladder"]),
    (13, "Próstata",                    "#b88bd6", ["prostate"]),
    (14, "Pulmão direito",              "#7fb8e6", ["lung_upper_lobe_right", "lung_middle_lobe_right", "lung_lower_lobe_right"]),
    (15, "Pulmão esquerdo",             "#5f9fd6", ["lung_upper_lobe_left", "lung_lower_lobe_left"]),
    (16, "Traqueia e brônquios",        "#a7e0e6", ["trachea"]),
    (17, "Esôfago",                     "#d3ab8f", ["esophagus"]),
    (18, "Tireoide",                    "#f0a3b0", ["thyroid_gland"]),
    (19, "Coração",                     "#d64545", ["heart", "atrial_appendage_left"]),
    (20, "Aorta",                       "#ef5350", ["aorta"]),
    (21, "Ramos do arco aórtico",       "#f28b6b", ["brachiocephalic_trunk", "subclavian_artery_*", "common_carotid_artery_*"]),
    (22, "Veias braquiocefálicas e cava superior", "#3b9fd8", ["brachiocephalic_vein_*", "superior_vena_cava"]),
    (23, "Veias pulmonares",            "#7cc4f0", ["pulmonary_vein"]),
    (24, "Veia cava inferior",          "#4f8fe0", ["inferior_vena_cava"]),
    (25, "Veia porta e esplênica",      "#6fa8f5", ["portal_vein_and_splenic_vein"]),
    (26, "Artérias ilíacas",            "#f07a7a", ["iliac_artery_*"]),
    (27, "Veias ilíacas",               "#6b9ff0", ["iliac_vena_*"]),
    (28, "Coluna cervical",             "#f2efe4", ["vertebrae_C*"]),
    (29, "Coluna torácica",             "#ece7d6", ["vertebrae_T*"]),
    (30, "Coluna lombar",               "#e6dfc8", ["vertebrae_L*"]),
    (31, "Sacro",                       "#ddd4b8", ["sacrum", "vertebrae_S1"]),
    (32, "Medula espinhal",             "#f7e463", ["spinal_cord"]),
    (33, "Costelas",                    "#d8d2bf", ["rib_*"]),
    (34, "Cartilagens costais",         "#9fc4d6", ["costal_cartilages"]),
    (35, "Esterno",                     "#cfc8b4", ["sternum"]),
    (36, "Clavículas",                  "#d4c48c", ["clavicula_*"]),
    (37, "Escápulas",                   "#cbbf98", ["scapula_*"]),
    (38, "Úmeros",                      "#d9cfa5", ["humerus_*"]),
    (39, "Ossos do quadril",            "#e3d7ac", ["hip_*"]),
    (40, "Fêmures",                     "#ecdfb0", ["femur_*"]),
    (41, "Musculatura paravertebral",   "#a8574a", ["autochthon_*"]),
    (42, "Iliopsoas",                   "#b4665a", ["iliopsoas_*"]),
    (43, "Glúteos",                     "#a04f45", ["gluteus_*"]),
    (44, "Encéfalo",                    "#f2e9d0", ["brain"]),
    (45, "Crânio",                      "#efeada", ["skull"]),
]

def grupo_de(nome):
    for gid, _, _, membros in GRUPOS:
        for m in membros:
            if m.endswith("*") and nome.startswith(m[:-1]):
                return gid
            if nome == m:
                return gid
    return 0

# ---------------------------------------------------------------------------
def baixar(url, destino):
    if os.path.exists(destino):
        return destino
    print("  baixando", url)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with urllib.request.urlopen(url, timeout=600) as r, open(destino, "wb") as f:
        f.write(r.read())
    return destino

def escrever_vytalvol(caminho, hu, lab, meta):
    """hu e lab com shape (nz, ny, nx) — o C-order já é x-mais-rápido."""
    nz, ny, nx = hu.shape
    meta = dict(meta)
    meta["dims"] = [int(nx), int(ny), int(nz)]
    hdr = json.dumps(meta, ensure_ascii=False).encode("utf-8")
    buf = io.BytesIO()
    buf.write(b"VYTALVOL")
    buf.write(struct.pack("<I", len(hdr)))
    buf.write(hdr)
    buf.write(np.ascontiguousarray(hu, dtype="<i2").tobytes())
    buf.write(np.ascontiguousarray(lab, dtype=np.uint8).tobytes())
    with gzip.open(caminho, "wb", compresslevel=9) as f:
        f.write(buf.getvalue())
    print(f"  {os.path.basename(caminho)}: {nx}x{ny}x{nz}, {os.path.getsize(caminho)/1e6:.2f} MB")

def mascara_corpo(hu, limiar=-400, minimo_frac=0.05):
    """Maior componente conexo de tecido (remove mesa e ruído), buracos preenchidos por fatia."""
    bruto = hu > limiar
    bruto = ndimage.binary_opening(bruto, iterations=1)
    rot, n = ndimage.label(bruto)
    if n == 0:
        return np.ones_like(hu, bool)
    tam = ndimage.sum(bruto, rot, range(1, n + 1))
    manter = np.zeros(n + 1, bool)
    manter[1:] = tam >= max(tam) * minimo_frac
    corpo = manter[rot]
    for k in range(corpo.shape[0]):
        corpo[k] = ndimage.binary_fill_holes(corpo[k])
    return corpo

def recortar_caixa(mask, margem=2):
    idx = np.argwhere(mask)
    lo = np.maximum(idx.min(axis=0) - margem, 0)
    hi = np.minimum(idx.max(axis=0) + margem + 1, mask.shape)
    return tuple(slice(int(a), int(b)) for a, b in zip(lo, hi))

def estruturas_presentes(lab, minimo=25):
    ids, contagens = np.unique(lab, return_counts=True)
    presentes = {int(i): int(c) for i, c in zip(ids, contagens) if i}
    saida = []
    for gid, nome, cor, _ in GRUPOS:
        if presentes.get(gid, 0) >= minimo:
            saida.append({"id": gid, "nome": nome, "cor": cor, "voxels": presentes[gid]})
    return saida

def montagem(hu, lab, cores, caminho, passo):
    """Imagem de conferência: cortes axiais com contornos coloridos das estruturas."""
    from PIL import Image
    nz, ny, nx = hu.shape
    def janela(x): return np.clip((x + 150) / 400 * 255, 0, 255).astype(np.uint8)
    tiles = []
    for k in range(passo // 2, nz, passo):
        g = janela(hu[k]); rgb = np.stack([g, g, g], -1)
        l = lab[k]
        borda = l != 0
        borda &= (np.roll(l, 1, 0) != l) | (np.roll(l, 1, 1) != l) | (np.roll(l, -1, 0) != l) | (np.roll(l, -1, 1) != l)
        for gid, cor in cores.items():
            m = l == gid
            rgb[m] = (rgb[m] * 0.55 + np.array(cor) * 0.45).astype(np.uint8)
            rgb[borda & m] = cor
        tiles.append(Image.fromarray(rgb).resize((200, 200)))
    cols = 6; rows = (len(tiles) + cols - 1) // cols
    m = Image.new("RGB", (200 * cols, 200 * rows))
    for n, t in enumerate(tiles):
        m.paste(t, ((n % cols) * 200, (n // cols) * 200))
    m.save(caminho)

def hex_rgb(h):
    return (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16))

# ---------------------------------------------------------------------------
def preparar_corpo_inteiro(cache, saida, conferencia):
    import pyvista as pv
    z = baixar(FONTES["corpo_zip"], os.path.join(cache, "s1397_resampled.zip"))
    pasta = os.path.join(cache, "s1397")
    if not os.path.exists(os.path.join(pasta, "s1397_resampled.vtm")):
        with zipfile.ZipFile(z) as zf:
            zf.extractall(pasta, members=[n for n in zf.namelist() if "__MACOSX" not in n])
    mb = pv.read(os.path.join(pasta, "s1397_resampled.vtm"))
    ct = mb["ct"]
    nx, ny, nz = ct.dimensions
    sp = [float(s) for s in ct.spacing]
    hu = np.asarray(ct.point_data[ct.array_names[0]]).reshape(nz, ny, nx).astype(np.int16)
    segs = mb["segmentations"]
    lab = np.zeros_like(hu, dtype=np.uint8)
    # Pintamos na ordem dos grupos; grupos posteriores prevalecem em sobreposições raras.
    for nome in segs.keys():
        gid = grupo_de(nome)
        if not gid:
            print("  sem grupo:", nome)
            continue
        m = np.asarray(segs[nome].point_data[segs[nome].array_names[0]]).reshape(nz, ny, nx) > 0
        lab[m] = gid
    # O arquivo está em RAS (+i direita, +j anterior): invertemos i e j para LPS.
    hu = hu[:, ::-1, ::-1]
    lab = lab[:, ::-1, ::-1]

    corpo = mascara_corpo(hu)
    hu = np.where(corpo, hu, -1000).astype(np.int16)
    hu = np.clip(hu, -1024, 3000)

    def extensao_z(gids):
        m = np.isin(lab, gids)
        ks = np.where(m.any(axis=(1, 2)))[0]
        return int(ks.min()), int(ks.max())

    pul_lo, pul_hi = extensao_z([14, 15])
    cla_lo, cla_hi = extensao_z([36])
    fig_lo, fig_hi = extensao_z([1])
    pro_lo, pro_hi = extensao_z([13])
    enc_lo, enc_hi = extensao_z([44])

    conjuntos = [
        ("torax", "Tórax", "TC de tórax real, 3 mm, 24 estruturas segmentadas",
         slice(max(pul_lo - 8, 0), min(max(pul_hi, cla_hi) + 6, nz)), 400, 50, "torax"),
        ("abdome", "Abdome e pelve", "TC de abdome e pelve real, 3 mm, 30 estruturas segmentadas",
         slice(max(pro_lo - 4, 0), min(fig_hi + 6, nz)), 400, 50, "abdome"),
        ("cabeca", "Cabeça e pescoço", "TC de cabeça e pescoço real, 3 mm, estruturas segmentadas",
         slice(max(cla_lo - 4, 0), nz), 400, 50, "cabeca"),
    ]
    for chave, nome, desc, zsl, W, L, _ in conjuntos:
        hu_c = hu[zsl]; lab_c = lab[zsl]
        corpo_c = mascara_corpo(hu_c, minimo_frac=1.0)
        hu_c = np.where(corpo_c, hu_c, -1000).astype(np.int16)
        if chave == "cabeca":
            # Os braços erguidos ladeiam a cabeça: recortamos pela caixa do
            # crânio, do encéfalo e da coluna cervical, com margem.
            caixa = recortar_caixa(np.isin(lab_c, [44, 45, 28, 18, 16]), margem=8)
            caixa = (slice(0, hu_c.shape[0]),) + caixa[1:]
        else:
            caixa = recortar_caixa(corpo_c)
        hu_c = hu_c[:, caixa[1], caixa[2]]
        lab_c = lab_c[:, caixa[1], caixa[2]]
        estr = estruturas_presentes(lab_c)
        if chave == "cabeca":
            # Na cabeça, lista de cima para baixo (encéfalo primeiro, pulmões por último)
            def z_medio(e):
                ks = np.where((lab_c == e["id"]).any(axis=(1, 2)))[0]
                return -float(ks.mean()) if ks.size else 0.0
            estr.sort(key=z_medio)
        ids_ok = {e["id"] for e in estr}
        lab_c = np.where(np.isin(lab_c, list(ids_ok)), lab_c, 0).astype(np.uint8)
        meta = {
            "chave": chave, "nome": nome, "descricao": desc,
            "spacing": sp, "janela": [W, L],
            "fonte": "TotalSegmentator v2.0.1, sujeito s1397 (CC BY 4.0), reamostrado a 3 mm por pyvista/vtk-data",
            "rotulos": "Segmentação do conjunto original, agrupada em estruturas de estudo",
            "estruturas": estr,
        }
        escrever_vytalvol(os.path.join(saida, chave + ".vytalvol"), hu_c, lab_c, meta)
        montagem(hu_c, lab_c, {e["id"]: hex_rgb(e["cor"]) for e in estr},
                 os.path.join(conferencia, chave + ".png"), max(1, hu_c.shape[0] // 18))

# ---------------------------------------------------------------------------
def preparar_cranio(cache, saida, conferencia):
    mhd = baixar(FONTES["fullhead_mhd"], os.path.join(cache, "FullHead.mhd"))
    raw = baixar(FONTES["fullhead_raw"], os.path.join(cache, "FullHead.raw.gz"))
    cab = dict(l.split(" = ") for l in open(mhd).read().strip().splitlines() if " = " in l)
    nx, ny, nz = [int(v) for v in cab["DimSize"].split()]
    sx, sy, sz = [float(v) for v in cab["ElementSpacing"].split()]
    a = np.frombuffer(gzip.open(raw).read(), dtype="<i2").reshape(nz, ny, nx).astype(np.int32)
    hu = a - 1024                      # valores brutos do tomógrafo com offset de 1024
    # Orientação LAS com k apontando para baixo: invertemos k para ficar superior = +k.
    hu = hu[::-1, :, :]
    # Reduz pela metade no plano (0,94 -> 1,875 mm) para caber no navegador.
    hu = hu[:, :ny // 2 * 2, :nx // 2 * 2].reshape(nz, ny // 2, 2, nx // 2, 2).mean(axis=(2, 4))
    hu = np.clip(np.round(hu), -1024, 3000).astype(np.int16)
    sp = [sx * 2, sy * 2, sz]

    corpo = mascara_corpo(hu, limiar=-500)
    hu = np.where(corpo, hu, -1000).astype(np.int16)

    # Rótulos automáticos por limiar (não são segmentação manual)
    osso = corpo & (hu > 200)
    osso = ndimage.binary_opening(osso, iterations=1) | (corpo & (hu > 500))
    ar = corpo & (hu < -450)
    moles = corpo & ~osso & ~ar
    # Tentamos isolar o encéfalo por morfologia (erosão + reconstrução), mas
    # nesta resolução as partes moles da face ficam conectadas ao interior do
    # crânio pelos forames e órbitas; o rótulo saía errado. Preferimos não
    # rotular o encéfalo aqui: o conjunto "Cabeça e pescoço" tem a segmentação
    # revisada do encéfalo.
    lab = np.zeros_like(hu, dtype=np.uint8)
    lab[osso] = 1
    lab[ar] = 3
    caixa = recortar_caixa(corpo)
    hu = hu[:, caixa[1], caixa[2]]; lab = lab[:, caixa[1], caixa[2]]
    estr = [
        {"id": 1, "nome": "Crânio e ossos da face", "cor": "#efeada", "auto": True},
        {"id": 3, "nome": "Seios da face e vias aéreas", "cor": "#7fd3e6", "auto": True},
    ]
    meta = {
        "chave": "cranio", "nome": "Crânio (alta resolução)",
        "descricao": "TC de crânio real, 1,9 x 1,9 x 1,5 mm, rótulos automáticos por densidade (osso e ar)",
        "spacing": sp, "janela": [400, 50],
        "fonte": "VTKData 'FullHead' via pyvista/vtk-data",
        "rotulos": "Rótulos automáticos por limiar de densidade (osso e ar); não são segmentação revisada",
        "estruturas": estr,
    }
    escrever_vytalvol(os.path.join(saida, "cranio.vytalvol"), hu, lab, meta)
    montagem(hu, lab, {e["id"]: hex_rgb(e["cor"]) for e in estr},
             os.path.join(conferencia, "cranio.png"), max(1, hu.shape[0] // 18))

# ---------------------------------------------------------------------------
def main():
    raiz = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cache", default=os.path.join(raiz, ".cache-anatomia"), help="pasta para os downloads")
    ap.add_argument("--saida", default=os.path.join(raiz, "estudante", "anatomia", "dados"))
    ap.add_argument("--conferencia", default=None, help="pasta das imagens de conferência (padrão: <cache>/conferencia)")
    ap.add_argument("--so", choices=["corpo", "cranio"], default=None)
    args = ap.parse_args()
    conf = args.conferencia or os.path.join(args.cache, "conferencia")
    os.makedirs(args.saida, exist_ok=True); os.makedirs(conf, exist_ok=True)
    if args.so in (None, "corpo"):
        print("== TC de corpo inteiro (tórax, abdome e pelve, cabeça e pescoço)")
        preparar_corpo_inteiro(args.cache, args.saida, conf)
    if args.so in (None, "cranio"):
        print("== TC de crânio em alta resolução")
        preparar_cranio(args.cache, args.saida, conf)
    print("Imagens de conferência em", conf)

if __name__ == "__main__":
    main()
