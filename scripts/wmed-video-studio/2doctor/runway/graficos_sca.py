"""Grafismos animados do explicador de síndrome coronariana aguda (sem custo de crédito).

Gera segmentos 1280x720, 24 fps, em ../out/sca/g-*.mp4, desenhando quadro a quadro
com Pillow e enviando para o ffmpeg. Paleta 2Doctor sobre fundo escuro, tipografia
Georgia (a máquina não tem a fonte da marca instalada).

Uso: python graficos_sca.py            (precisa de Pillow e ffmpeg)
"""
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

SAIDA = Path(__file__).resolve().parent.parent / 'out' / 'sca'
W, H, FPS = 1280, 720, 24
F = '/System/Library/Fonts/Supplemental/'
FUNDO = (13, 20, 24)
CREME = (237, 230, 218)
MUTED = (160, 170, 172)
TEAL = (47, 110, 107)
OURO = (233, 184, 114)
SANGUE = (150, 32, 44)
PAREDE = (196, 120, 118)
PLACA = (228, 196, 120)
COAGULO = (90, 16, 24)


def fonte(tam, italico=False):
    return ImageFont.truetype(F + ('Georgia Italic.ttf' if italico else 'Georgia.ttf'), tam)


def suave(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def fade(t, ini, dur=0.5):
    return suave((t - ini) / dur)


def texto(d, xy, s, tam, cor=CREME, alfa=1.0, italico=False, anchor='la'):
    if alfa <= 0:
        return
    d.text(xy, s, font=fonte(tam, italico), fill=cor + (int(255 * alfa),), anchor=anchor)


def quadro():
    im = Image.new('RGBA', (W, H), FUNDO + (255,))
    return im, ImageDraw.Draw(im, 'RGBA')


def gravar(nome, dur, desenhar):
    n = int(round(dur * FPS))
    cmd = ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
           '-i', '-', '-f', 'lavfi', '-t', str(dur), '-i', 'anullsrc=r=48000:cl=stereo',
           '-vf', 'noise=alls=6:allf=t+u,vignette=PI/5', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p',
           '-c:a', 'aac', '-shortest', str(SAIDA / f'{nome}.mp4')]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        im = desenhar(i / FPS)
        p.stdin.write(im.convert('RGB').tobytes())
    p.stdin.close()
    p.wait()
    print('ok', nome, dur)


def arteria(d, t_placa, t_racha, t_coagulo, t_fluxo):
    """Corte longitudinal de uma coronária: parede, placa, rachadura, coágulo e fluxo."""
    y0, y1, x0, x1 = 250, 470, 120, 1160
    d.rounded_rectangle([x0, y0 - 26, x1, y1 + 26], 40, fill=PAREDE + (255,))
    d.rectangle([x0, y0, x1, y1], fill=SANGUE + (255,))
    cx = 640
    alt = 70 * suave(t_placa)                       # placa cresce da parede de cima
    if alt > 1:
        d.ellipse([cx - 190, y0 - 20, cx + 190, y0 + alt * 1.6], fill=PLACA + (255,))   # nasce na parede e invade a luz
    if t_racha > 0:                                 # rachadura na capa da placa
        k = suave(t_racha)
        pts = [(cx - 40, y0 + alt * 1.55), (cx - 10, y0 + alt * 1.2), (cx + 15, y0 + alt * 1.5), (cx + 45, y0 + alt * 1.25)]
        d.line(pts[:2 + int(2 * k)], fill=(60, 30, 20, 255), width=5)
    if t_coagulo > 0:                               # coágulo cresce sobre a rachadura
        r = 140 * suave(t_coagulo)
        d.ellipse([cx - r * 0.9, y0 + alt * 1.2, cx + r * 0.9, y0 + alt * 1.2 + r * 1.05], fill=COAGULO + (255,))
    # partículas de sangue: desaceleram conforme a luz fecha
    livre = max(0.05, 1 - 0.95 * suave(t_coagulo))
    for k in range(26):
        x = (x0 + ((k * 97 + t_fluxo * 260 * livre) % (x1 - x0)))
        y = y0 + 30 + (k * 53) % int(y1 - y0 - 60)
        if abs(x - cx) < 150 and t_coagulo > 0.6 and y < y0 + alt * 1.2 + 140 * suave(t_coagulo):
            continue
        d.ellipse([x - 7, y - 7, x + 7, y + 7], fill=(215, 90, 96, 200))


def g1(t):  # 3,5 s: a artéria e a placa crescendo (fala h3 continua por cima)
    im, d = quadro()
    arteria(d, t / 3.0, 0, 0, t)
    texto(d, (120, 120), 'coronary artery', 40, alfa=fade(t, 0.1), italico=True)
    texto(d, (640, 560), 'plaque', 30, OURO, fade(t, 1.4), anchor='ma')
    return im


def g2(t):  # 11 s: placa racha, coágulo, artéria fecha (narração n1)
    im, d = quadro()
    arteria(d, 1, (t - 2.0) / 1.2, (t - 4.2) / 3.5, t)
    texto(d, (120, 120), 'plaque cracks', 40, alfa=fade(t, 2.0) * (1 - fade(t, 4.0)), italico=True)
    texto(d, (120, 120), 'a clot forms on top', 40, alfa=fade(t, 4.2) * (1 - fade(t, 7.3)), italico=True)
    texto(d, (120, 120), 'the artery narrows, or shuts', 40, alfa=fade(t, 7.5), italico=True)
    return im


def coracao(d, cx, cy, s, fill):
    pts = []
    for k in range(200):
        a = 2 * math.pi * k / 200
        x = 16 * math.sin(a) ** 3
        y = 13 * math.cos(a) - 5 * math.cos(2 * a) - 2 * math.cos(3 * a) - math.cos(4 * a)
        pts.append((cx + x * s, cy - y * s))
    d.polygon(pts, fill=fill)


def g3(t):  # 12,5 s: área sem sangue cresce; "time is muscle" (narração n2)
    im, d = quadro()
    coracao(d, 470, 360, 15, (122, 36, 46, 255))
    k = suave((t - 1.5) / 8.0)
    if k > 0:                                       # área de necrose cresce de um ponto
        escuro = Image.new('L', (W, H), 0)
        r = 30 + 150 * k
        ImageDraw.Draw(escuro).ellipse([560 - r, 400 - r * 0.8, 560 + r, 400 + r * 0.8], fill=235)
        mascara = Image.new('L', (W, H), 0)
        coracao(ImageDraw.Draw(mascara), 470, 360, 15, 255)
        alfa = Image.composite(escuro, Image.new('L', (W, H), 0), mascara)   # só dentro do coração
        im.paste(Image.new('RGBA', (W, H), (25, 12, 14, 255)), (0, 0), alfa)
        d = ImageDraw.Draw(im, 'RGBA')
    # relógio que avança
    cx, cy, r = 980, 300, 90
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=MUTED + (180,), width=3)
    ang = -90 + 360 * suave(t / 11.0) * 2
    d.line([cx, cy, cx + r * 0.8 * math.cos(math.radians(ang)), cy + r * 0.8 * math.sin(math.radians(ang))], fill=OURO + (255,), width=4)
    texto(d, (980, 430), 'minutes, then hours', 26, MUTED, fade(t, 1.5), anchor='ma')
    texto(d, (980, 520), 'time is muscle', 54, CREME, fade(t, 9.3), italico=True, anchor='ma')
    return im


def g4(t):  # 14,5 s: onde dói e como pode aparecer (narração n3)
    im, d = quadro()
    # silhueta simples
    cx = 360
    d.ellipse([cx - 55, 120, cx + 55, 240], fill=(40, 52, 58, 255))
    d.rounded_rectangle([cx - 120, 250, cx + 120, 560], 60, fill=(40, 52, 58, 255))
    d.rounded_rectangle([cx - 190, 270, cx - 130, 520], 30, fill=(40, 52, 58, 255))
    d.rounded_rectangle([cx + 130, 270, cx + 190, 520], 30, fill=(40, 52, 58, 255))
    pontos = [((cx - 20, 330), 0.2, 'chest'), ((cx - 160, 380), 1.0, 'arm'), ((cx, 215), 1.8, 'jaw'),
              ((cx + 25, 255), 2.4, 'neck'), ((cx + 90, 330), 3.1, 'back')]
    for (x, y), ini, _ in pontos:
        a = fade(t, ini)
        pulso = 18 + 6 * math.sin(t * 5)
        d.ellipse([x - pulso, y - pulso, x + pulso, y + pulso], fill=(230, 90, 80, int(170 * a)))
    texto(d, (660, 170), 'chest pressure or tightness', 34, alfa=fade(t, 0.2))
    texto(d, (660, 225), 'arm · jaw · neck · back', 34, alfa=fade(t, 1.0))
    texto(d, (660, 280), 'sweating · nausea · breathlessness', 34, alfa=fade(t, 3.8))
    d.rectangle([660, 360, 720, 362], fill=OURO + (int(255 * fade(t, 7.2)),))
    texto(d, (660, 385), 'women · older people · diabetes', 30, OURO, fade(t, 7.2), italico=True)
    texto(d, (660, 430), 'may be just breathlessness,', 30, alfa=fade(t, 8.5))
    texto(d, (660, 472), 'nausea or exhaustion', 30, alfa=fade(t, 8.5))
    return im


def g5(t):  # 5 s: ligue para a emergência (fala h5 continua por cima)
    im, d = quadro()
    texto(d, (640, 250), 'Call an ambulance.', 64, alfa=fade(t, 0.1), italico=True, anchor='ma')
    d.rectangle([610, 345, 670, 347], fill=OURO + (int(255 * fade(t, 0.6)),))
    texto(d, (640, 380), 'Brazil 192   ·   US & Canada 911   ·   Europe 112   ·   UK 999', 30, MUTED, fade(t, 0.8), anchor='ma')
    return im


def g6(t):  # 9 s: ECG em 10 min, balão e stent (narração n4, continuação)
    im, d = quadro()
    if t < 4.2:
        texto(d, (120, 120), 'ECG within 10 minutes', 40, alfa=fade(t, 0.1), italico=True)
        pts, n = [], int(1100 * suave(t / 3.5))
        for x in range(n):
            fase = (x % 180) / 180
            y = 380
            if 0.40 < fase < 0.44: y -= 150 * math.sin((fase - 0.40) / 0.04 * math.pi)
            elif 0.46 < fase < 0.50: y += 40 * math.sin((fase - 0.46) / 0.04 * math.pi)
            elif 0.62 < fase < 0.74: y -= 30 * math.sin((fase - 0.62) / 0.12 * math.pi)
            pts.append((90 + x, y))
        if len(pts) > 1:
            d.line(pts, fill=(120, 210, 190, 255), width=4)
    else:
        u = t - 4.2
        arteria(d, 1, 1, 1 - suave(u / 2.5), u)       # o coágulo sai e o fluxo volta
        k = suave((u - 0.3) / 1.6)                      # balão infla e deixa a malha
        if k > 0:
            d.rounded_rectangle([640 - 170, 360 - 55 * k, 640 + 170, 360 + 55 * k], 30, outline=(200, 200, 205, 255), width=3)
            for x in range(470, 811, 26):
                d.line([x, 360 - 55 * k, x + 26, 360 + 55 * k], fill=(200, 200, 205, 200), width=2)
                d.line([x + 26, 360 - 55 * k, x, 360 + 55 * k], fill=(200, 200, 205, 200), width=2)
        texto(d, (120, 120), 'balloon · stent', 40, alfa=fade(u, 0.3), italico=True)
        texto(d, (120, 180), 'the sooner, the better', 30, OURO, fade(u, 2.8), italico=True)
    return im


def titulo(t):  # 3 s
    im, d = quadro()
    texto(d, (640, 290), 'POR DENTRO', 70, alfa=fade(t, 0.2), anchor='ma')
    texto(d, (640, 390), 'The heart attack, explained', 34, MUTED, fade(t, 0.8), italico=True, anchor='ma')
    return im


def final(t):  # 5 s
    im, d = quadro()
    texto(d, (640, 250), 'POR DENTRO', 58, alfa=fade(t, 0.1), anchor='ma')
    texto(d, (640, 330), 'a 2Doctor series', 30, OURO, fade(t, 0.4), italico=True, anchor='ma')
    texto(d, (640, 430), 'Educational content, not medical advice  ·  Sources in the caption', 22, MUTED, fade(t, 0.8), anchor='ma')
    texto(d, (640, 470), 'Presenter and some scenes created with AI', 22, MUTED, fade(t, 0.8), anchor='ma')
    return im


if __name__ == '__main__':
    SAIDA.mkdir(parents=True, exist_ok=True)
    for nome, dur, fn in [('g-titulo', 3.0, titulo), ('g1', 3.5, g1), ('g2', 11.0, g2), ('g3', 12.5, g3),
                          ('g4', 14.5, g4), ('g5', 5.0, g5), ('g6', 9.0, g6), ('g-final', 5.0, final)]:
        gravar(nome, dur, fn)


def sobreposicoes():
    """Cartões transparentes (PNG) aplicados sobre as falas da Iris na montagem."""
    nome = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(nome)
    d.rectangle([60, 612, 92, 614], fill=OURO + (255,))
    texto(d, (60, 624), 'Dr Iris Maren', 32)
    texto(d, (62, 666), 'P H Y S I C I A N   ·   2 D O C T O R', 12, CREME, 0.7)
    nome.save(SAIDA / 'ov-nome-720.png')
    termo = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(termo)
    texto(d, (760, 70), 'acute coronary syndrome', 38, italico=True)
    texto(d, (763, 122), 'M E D I C A L   T E R M', 12, CREME, 0.65)
    d.rectangle([763, 146, 803, 147], fill=OURO + (255,))
    texto(d, (763, 162), 'Part of the heart muscle suddenly', 21, CREME, 0.9)
    texto(d, (763, 190), 'stops getting enough blood', 21, CREME, 0.9)
    termo.save(SAIDA / 'ov-termo-720.png')
    print('ok sobreposicoes')


if __name__ == '__main__':
    sobreposicoes()
