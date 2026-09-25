#!/usr/bin/env python3
"""Modelo 3D próprio 2Doctor: pulmões com lobos + árvore brônquica (procedural, sem dados de terceiros).

Pulmões: campo implícito esculpido com a anatomia de referência (ápice, face costal convexa, face mediastinal
com hilo, cúpulas diafragmáticas com a direita mais alta, impressão cardíaca e incisura cardíaca/língula à
esquerda). Lobos separados pelas fissuras oblíquas (D e E) e horizontal (D). Superfície por marching cubes
sobre o campo suavizado.

Árvore brônquica: traqueia, brônquios principais e lobares definidos anatomicamente; daí em diante,
algoritmo de divisão de volume (Kitaoka, Takaki & Suki, J Appl Physiol 1999;87:2207-17): cada ramo aponta
para o centróide da sua região, a região é dividida por um plano e os diâmetros seguem a lei de Murray.
Proporções aproximadas (Weibel 1963): traqueia ~11 cm × 18 mm; brônquio principal direito mais curto, largo
e vertical que o esquerdo. É um modelo didático, não uma reconstrução de paciente.

  python3 models3d/build_lungs.py   → models3d/out/lungs.glb e models3d/out/airways.json
Unidades em mm. Eixos: +x = lado esquerdo do paciente, +y = cranial, +z = anterior.
"""
import json, os
import numpy as np
from scipy import ndimage
from skimage import measure
import trimesh

OUT = os.path.join(os.path.dirname(__file__), 'out')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)
VOX = 1.6
X = np.arange(-165, 165, VOX); Y = np.arange(-20, 300, VOX); Z = np.arange(-115, 115, VOX)
gx, gy, gz = np.meshgrid(X, Y, Z, indexing='ij')


def smoothstep(a, b, v):
    t = np.clip((v - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def lung_field(side):
    """side = -1 (direito, x<0) ou +1 (esquerdo). Retorna campo >0 dentro (coordenadas espelhadas: lateral = +x)."""
    x = gx * side
    h = np.clip((gy - 10) / 245.0, 0, 1.2)
    # perfil vertical: base larga, ápice em cúpula arredondada (quarto de elipse acima de 30% da altura)
    w = np.where(h > 0.12, np.sqrt(np.clip(1 - ((h - 0.12) / 0.88) ** 2, 0, 1)), 1.0)
    w = w ** 1.25
    a = (66.0 if side < 0 else 58.0) * w ** 0.8 + 1e-3            # meia-largura médio-lateral
    c = 92.0 * w ** 0.75 + 1e-3            # meia-profundidade anteroposterior
    cx = 17.0 + a * 0.93                   # face mediastinal fica em x≈17
    cz = -10.0 - 12.0 * (1 - np.clip(h, 0, 1))   # mais volume posterior (goteira paravertebral)
    # seção horizontal: lateral convexa (elipse), anterior um pouco mais fina que a posterior
    zz = (gz - cz) / np.where(gz > cz, c * 0.92, c)
    f = 1 - (((x - cx) / a) ** 2 + zz ** 2)
    f = np.minimum(f, (x - 17.0) / 14.0)                         # face mediastinal
    # base: cúpula diafragmática (direita ~2 cm mais alta), mais baixa atrás (recesso costofrênico)
    y_base = (18.0 if side > 0 else 36.0) + 34.0 * np.exp(-(((x - 62) / 42) ** 2 + ((gz - 18) / 58) ** 2)) + 0.26 * gz
    f = np.minimum(f, (gy - y_base) / 10.0)
    # hilo: concavidade na face mediastinal
    hil = 1 - (((x - 17) / 20) ** 2 + ((gy - 150) / 30) ** 2 + ((gz - 0) / 24) ** 2)
    f = np.minimum(f, 0.35 - hil * 1.3)
    # impressão cardíaca; à esquerda maior e anterior → incisura cardíaca e língula
    if side > 0:
        heart = 1 - (((gx - 16) / 86) ** 2 + ((gy - 76) / 66) ** 2 + ((gz - 46) / 62) ** 2)
    else:
        heart = 1 - (((gx - 6) / 60) ** 2 + ((gy - 70) / 55) ** 2 + ((gz - 44) / 50) ** 2)
    f = np.minimum(f, 0.1 - heart * 1.4)
    # aorta descendente e coluna: sulco posteromedial à esquerda, suave
    if side > 0:
        ao = 1 - (((gx - 22) / 16) ** 2 + ((gz + 40) / 16) ** 2) - np.clip((gy - 190) / 60, 0, 1) * 2
        f = np.minimum(f, 0.3 - ao)
    return f


def lobes(side, inside):
    """Rótulos de lobo dentro do pulmão: D 1 sup, 2 médio, 3 inf · E 4 sup, 5 inf."""
    # fissura oblíqua: do posterior-superior (y~190,z=-70) ao anterior-inferior (y~25,z=+70)
    obl = (gy - 190) * (70 + 70) - (gz + 70) * (25 - 190)   # >0 acima/anterior do plano
    upper = obl > 0
    lab = np.zeros(inside.shape, np.uint8)
    if side < 0:
        horiz = gy > 142                                   # fissura horizontal (4ª cartilagem costal)
        lab[inside & ~upper] = 3
        lab[inside & upper & horiz] = 1
        lab[inside & upper & ~horiz] = 2
    else:
        lab[inside & ~upper] = 5
        lab[inside & upper] = 4
    return lab, obl


def mesh_of(mask, sigma=1.1):
    f = ndimage.gaussian_filter(mask.astype(np.float32), sigma)
    v, fa, n, _ = measure.marching_cubes(f, 0.5, spacing=(VOX, VOX, VOX))
    v += np.array([X[0], Y[0], Z[0]])
    m = trimesh.Trimesh(v, fa, process=True)
    trimesh.smoothing.filter_taubin(m, lamb=0.5, nu=-0.53, iterations=12)
    return m


LOBE_NAMES = {1: 'Lobo superior direito', 2: 'Lobo médio', 3: 'Lobo inferior direito', 4: 'Lobo superior esquerdo', 5: 'Lobo inferior esquerdo'}
labels = np.zeros(gx.shape, np.uint8)
for side in (-1, 1):
    f = lung_field(side)
    inside = ndimage.binary_opening(f > 0, iterations=2) & ((gx < -6) if side < 0 else (gx > 6))
    lab, obl = lobes(side, inside)
    labels = np.maximum(labels, lab)

# fissuras: afastamento de ~1 voxel entre lobos para que cada lobo seja uma peça
gap = np.zeros_like(labels, bool)
for a in range(1, 6):
    m = labels == a
    gap |= ndimage.binary_dilation(m, iterations=1) & (labels > 0) & (labels != a) & (labels < a)
labels_gap = labels.copy(); labels_gap[gap] = 0

scene = trimesh.Scene()
stats = {}
for k, name in LOBE_NAMES.items():
    m = mesh_of(labels_gap == k)
    m = m.simplify_quadric_decimation(face_count=min(len(m.faces), 26000)) if len(m.faces) > 26000 else m
    scene.add_geometry(m, node_name=name, geom_name=name)
    stats[name] = {'faces': int(len(m.faces)), 'vol_ml': round(float(np.sum(labels == k)) * VOX ** 3 / 1000, 1)}

# ---------------- árvore brônquica ----------------
pts_all = np.stack([gx[labels > 0], gy[labels > 0], gz[labels > 0]], 1)
lab_all = labels[labels > 0]
sel = rng.choice(len(pts_all), size=min(26000, len(pts_all)), replace=False)
P, PL = pts_all[sel] + rng.uniform(-VOX / 2, VOX / 2, (len(sel), 3)), lab_all[sel]

nodes = []   # {id, parent, a:[x,y,z], b:[x,y,z], d, gen, lobe}


def add(parent, a, b, d, gen, lobe, kind='branch'):
    nodes.append({'id': len(nodes), 'parent': parent, 'a': [round(float(v), 2) for v in a], 'b': [round(float(v), 2) for v in b],
                  'd': round(float(d), 3), 'gen': gen, 'lobe': int(lobe), 'kind': kind})
    return len(nodes) - 1


def unit(v):
    return v / (np.linalg.norm(v) + 1e-9)


def grow(parent, start, direction, d, gen, pts, lobe):
    """Divisão de volume (Kitaoka 1999)."""
    if len(pts) < 12 or d < 0.9 or gen > 23:
        return
    c = pts.mean(0)
    v = c - start
    dist = np.linalg.norm(v)
    dirn = unit(v)
    # limita o ângulo de ramificação a ~70° em relação ao pai
    if np.dot(dirn, direction) < np.cos(np.radians(70)):
        axis = unit(np.cross(direction, dirn))
        ang = np.radians(70)
        dirn = unit(direction * np.cos(ang) + np.cross(axis, direction) * np.sin(ang))
    L = max(2.8 * d, 0.42 * dist)
    L = min(L, dist * 0.9) if dist > 3 * d else L
    end = start + dirn * L
    me = add(parent, start, end, d, gen, lobe)
    # plano de divisão: contém a direção do ramo e é ortogonal ao eixo de maior espalhamento
    q = pts - pts.mean(0)
    q_perp = q - np.outer(q @ dirn, dirn)
    try:
        _, _, vt = np.linalg.svd(q_perp[:: max(1, len(q_perp) // 800)], full_matrices=False)
        axis = vt[0]
    except np.linalg.LinAlgError:
        return
    side = q_perp @ axis > 0
    A, B = pts[side], pts[~side]
    if len(A) == 0 or len(B) == 0:
        return
    ra = len(A) / len(pts)
    da, db = d * ra ** (1 / 3), d * (1 - ra) ** (1 / 3)      # lei de Murray (d³ = d1³ + d2³)
    grow(me, end, dirn, da, gen + 1, A, lobe)
    grow(me, end, dirn, db, gen + 1, B, lobe)


# traqueia e carina
top, carina = np.array([0.0, 282.0, 16.0]), np.array([0.0, 172.0, 4.0])
t_id = add(-1, top, carina, 18.0, 0, 0, 'trachea')
# principais: direito mais curto, largo e vertical (~25°); esquerdo mais longo e horizontal (~45°)
rmb_end = carina + unit(np.array([-np.sin(np.radians(27)), -np.cos(np.radians(27)), -0.10])) * 24
lmb_end = carina + unit(np.array([np.sin(np.radians(46)), -np.cos(np.radians(46)), -0.14])) * 48
r_id = add(t_id, carina, rmb_end, 15.0, 1, 0, 'main')
l_id = add(t_id, carina, lmb_end, 12.5, 1, 0, 'main')
# lobares
def lobe_pts(k):
    return P[PL == k]
# direito: superior sai logo; intermediário segue até médio e inferior
rul = lobe_pts(1); rml = lobe_pts(2); rll = lobe_pts(3); lul = lobe_pts(4); lll = lobe_pts(5)
rul_end = rmb_end + unit(rul.mean(0) - rmb_end) * 16
rul_id = add(r_id, rmb_end, rul_end, 9.5, 2, 1, 'lobar')
bi_end = rmb_end + unit(np.array([-0.18, -1, -0.05])) * 22
bi_id = add(r_id, rmb_end, bi_end, 11.5, 2, 0, 'lobar')
rml_end = bi_end + unit(rml.mean(0) - bi_end) * 14
rml_id = add(bi_id, bi_end, rml_end, 7.0, 3, 2, 'lobar')
rll_end = bi_end + unit(rll.mean(0) - bi_end) * 14
rll_id = add(bi_id, bi_end, rll_end, 10.0, 3, 3, 'lobar')
lul_end = lmb_end + unit(lul.mean(0) - lmb_end) * 16
lul_id = add(l_id, lmb_end, lul_end, 10.0, 2, 4, 'lobar')
lll_end = lmb_end + unit(lll.mean(0) - lmb_end) * 18
lll_id = add(l_id, lmb_end, lll_end, 9.5, 2, 5, 'lobar')
for nid, end, d, g, pts, k, a in [(rul_id, rul_end, 9.5, 3, rul, 1, rmb_end), (rml_id, rml_end, 7.0, 4, rml, 2, bi_end),
                                   (rll_id, rll_end, 10.0, 4, rll, 3, bi_end), (lul_id, lul_end, 10.0, 3, lul, 4, lmb_end),
                                   (lll_id, lll_end, 9.5, 3, lll, 5, lmb_end)]:
    q = pts - pts.mean(0)
    _, _, vt = np.linalg.svd(q[::20], full_matrices=False)
    s = q @ vt[0] > 0
    dirp = unit(end - a)
    for sub in (pts[s], pts[~s]):
        r = len(sub) / len(pts)
        grow(nid, end, dirp, d * r ** (1 / 3), g, sub, k)

gens = [n['gen'] for n in nodes]
stats['airways'] = {'branches': len(nodes), 'max_gen': int(max(gens)), 'min_d_mm': min(n['d'] for n in nodes)}
json.dump({'units': 'mm', 'axes': '+x esquerda do paciente, +y cranial, +z anterior', 'method': 'Kitaoka 1999 (divisão de volume), Murray',
           'nodes': nodes}, open(os.path.join(OUT, 'airways.json'), 'w'), separators=(',', ':'))
scene.export(os.path.join(OUT, 'lungs.glb'))
json.dump(stats, open(os.path.join(OUT, 'lungs-stats.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps(stats, indent=1, ensure_ascii=False))
