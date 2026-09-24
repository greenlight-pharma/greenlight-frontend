#!/usr/bin/env python3
"""Trilha original do Reels Vytal Acadêmico × DA UniFAA (topics/vytal-unifaa-caso.js), sintetizada do zero.

Eletrônica suave a 100 BPM em Ré maior (Dmaj9 → Bm9 → Gmaj9 → A add9). Os acentos caem nos cortes de cena
do vídeo; nas hipóteses a bateria sai e um sino marca cada cartão (alta → moderada → baixa); a música abaixa
sozinha (sidechain) enquanto a locução fala.

  python3 tools/trilha-vytal.py --voz narracao.wav --out-trilha trilha.wav --out-mix mix.wav
Requer numpy e scipy. Sem --voz, gera só a trilha.
"""
import argparse, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR = 48000, 61.3
# cortes do vídeo (mesmos valores de S no tópico)
CUT = dict(partner=4.3, caso=8.1, fb=19.5, zoom=24.2, hip=29.2, ia=42.3, quest=47.9, bonus=51.0, outro=56.0)
T0, BEAT = 0.3, 0.6                         # grade: 100 BPM, ancorada no impacto do logo (8.1, 19.5 e 42.3 caem no tempo)
BAR = 4 * BEAT
CLICKS = [30.70, 38.13, 39.65]              # toques do cursor na cena das hipóteses
CARDS = [32.69, 34.69, 36.69]               # destaque de cada cartão de hipótese
CHORDS = [[50, 54, 57, 61, 64], [47, 50, 54, 57, 61], [43, 47, 50, 54, 57], [45, 52, 57, 59, 61]]
ROOTS = [50, 47, 43, 45]  # uma oitava acima do sub: audível no alto-falante do celular

N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)
lp = lambda x, f, o=2: sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f, o=2: sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, a, b, o=2: sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)


def ramp(pts):
    """Envelope linear por pontos [(tempo, valor), ...]."""
    xs, ys = zip(*pts)
    return np.interp(t, xs, ys)


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf) or i + len(sig) <= 0:
        return
    s = sig[max(0, -i):]
    i = max(0, i)
    n = min(len(s), len(buf) - i)
    buf[i:i + n] += gain * s[:n]


def chord_at(tt):
    if tt >= CUT['outro']:
        return 0
    return int(max(0, tt - T0) // BAR) % 4


def beats(a, b, step=BEAT, off=0.0):
    k0 = int(np.ceil((a - T0 - off) / step - 1e-9))
    out, k = [], k0
    while T0 + off + k * step < b - 1e-9:
        out.append(T0 + off + k * step)
        k += 1
    return out


# ---------- pad: saws desafinados, filtro que respira ----------
def pad():
    L, R = np.zeros(N), np.zeros(N)
    edges = [0.0] + [T0 + i * BAR for i in range(1, 40) if T0 + i * BAR < CUT['outro']] + [CUT['outro'], DUR]
    for a, b in zip(edges[:-1], edges[1:]):
        notes = CHORDS[chord_at(a + 1e-3)]
        n0, n1 = int(a * SR), min(N, int((b + .6) * SR))
        tt = np.arange(n1 - n0) / SR
        env = np.minimum(1, tt / .35) * np.clip((b + .6 - a - tt) / .6, 0, 1)
        for m in notes:
            for d, (gl, gr) in zip([-9, -3, 3, 9], [(1, .4), (.8, .6), (.6, .8), (.4, 1)]):
                f = hz(m) * 2 ** (d / 1200)
                w = 2 * ((tt * f + rng.random()) % 1) - 1
                L[n0:n1] += gl * w * env
                R[n0:n1] += gr * w * env
    cut = ramp([(0, 500), (4, 1400), (CUT['hip'], 1600), (CUT['hip'] + 1, 900), (CUT['ia'] - 2, 1300), (CUT['ia'], 2200), (CUT['outro'], 2600), (DUR, 1200)])
    lfo = 1 + .25 * np.sin(2 * np.pi * t / (2 * BAR))
    out = []
    for x in (L, R):  # filtro variável aproximado: dois filtros misturados pela curva
        lo, hi = lp(x, 500), lp(x, 2600)
        k = np.clip((cut * lfo - 500) / 2100, 0, 1)
        out.append(lo * (1 - k) + hi * k)
    g = ramp([(0, 0), (1.6, .9), (CUT['caso'], .75), (CUT['hip'], .75), (CUT['hip'] + .5, 1), (CUT['ia'], .7), (CUT['outro'], .95), (DUR - 2.2, .9), (DUR, 0)])
    return np.array(out) * g * .045


# ---------- arpejo cristalino com eco pingue-pongue ----------
def arp():
    L, R = np.zeros(N), np.zeros(N)
    pat = [0, 2, 4, 3, 1, 3, 4, 2]
    tt = np.arange(int(.5 * SR)) / SR
    for i, at in enumerate(beats(CUT['partner'] - .3, CUT['outro'] + .05, BEAT / 4)):
        top = [m + 12 for m in CHORDS[chord_at(at + 1e-3)]]
        m = top[pat[i % 8]] + (12 if (i // 16) % 2 and at > CUT['ia'] else 0)
        f = hz(m)
        s = (np.sin(2 * np.pi * f * tt) + .35 * np.sin(2 * np.pi * 2 * f * tt) + .12 * np.sin(2 * np.pi * 3 * f * tt)) * np.exp(-tt * 14)
        acc = 1.0 if i % 4 == 0 else .72
        place(L, s, at, acc)
        place(R, s, at, acc * .85)
    # eco 3/16 alternando lados
    d = int(.45 * SR)
    eL, eR = np.zeros(N), np.zeros(N)
    srcL, srcR = L.copy(), R.copy()
    for k in range(1, 5):
        g = .42 ** k
        a, b = (srcR, srcL) if k % 2 else (srcL, srcR)
        eL[d * k:] += g * a[:-d * k]
        eR[d * k:] += g * b[:-d * k]
    L, R = lp(L + eL, 7000), lp(R + eR, 7000)
    g = ramp([(0, 0), (CUT['partner'] - .3, 0), (CUT['partner'] + 1.5, .55), (CUT['caso'], .7), (CUT['hip'], .75), (CUT['hip'] + .3, .5),
              (CUT['ia'] - 1, .6), (CUT['ia'], .85), (CUT['outro'] - .1, .85), (CUT['outro'] + .2, 0), (DUR, 0)])
    return np.array([L, R]) * g * .1


# ---------- bateria ----------
def kick():
    tt = np.arange(int(.45 * SR)) / SR
    f = 44 + 90 * np.exp(-tt * 28)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7.5)
    click = hp(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 300) * .25
    return np.tanh(1.6 * (body + click))


def hat(dec=55):
    tt = np.arange(int(.12 * SR)) / SR
    return hp(rng.standard_normal(len(tt)), 7500, 4) * np.exp(-tt * dec)


def clap():
    tt = np.arange(int(.35 * SR)) / SR
    n = bp(rng.standard_normal(len(tt)), 900, 5000)
    e = np.exp(-tt * 18) + .6 * np.exp(-np.maximum(0, tt - .012) * 30) * (tt > .012) + .4 * np.exp(-np.maximum(0, tt - .024) * 30) * (tt > .024)
    return n * e


def drums():
    D = np.zeros(N)
    duck = np.ones(N)                # sidechain do baixo e do pad
    K, H, Hs, C = kick(), hat(), hat(90), clap()
    full = [(CUT['fb'], CUT['hip']), (CUT['ia'], CUT['outro'])]
    for at in beats(CUT['caso'], CUT['fb'], 2 * BEAT) + [b for a, z in full for b in beats(a, z)]:
        place(D, K, at, .65)
        i = int(at * SR)
        n = min(int(.3 * SR), N - i)
        duck[i:i + n] = np.minimum(duck[i:i + n], 1 - .7 * np.exp(-np.arange(n) / SR * 9))
    for a, z in [(CUT['caso'], CUT['hip'])] + full[1:]:
        for at in beats(a, z, BEAT, BEAT / 2):
            place(D, H, at, .32)
    for a, z in full:
        for at in beats(a, z, 2 * BEAT, BEAT):
            place(D, C, at, .38)
    for at in beats(CUT['ia'], CUT['outro'], BEAT / 4):
        place(D, Hs, at, .1)
    # nas hipóteses: bateria sai; a partir do clique em "Entender" um 16 avos sutil vai crescendo até a volta
    for at in beats(CLICKS[1], CUT['ia'], BEAT / 4):
        place(D, Hs, at, .04 + .14 * (at - CLICKS[1]) / (CUT['ia'] - CLICKS[1]))
    # virada curta antes da volta da energia
    for at in beats(CUT['ia'] - BEAT, CUT['ia'], BEAT / 4):
        place(D, C, at, .22)
    return D, duck


def bass(duck):
    B = np.zeros(N)
    tt = np.arange(int(BEAT / 2 * SR)) / SR
    for a, z in [(CUT['caso'], CUT['hip']), (CUT['ia'], CUT['outro'])]:
        for at in beats(a, z, BEAT / 2):
            f = hz(ROOTS[chord_at(at + 1e-3)])
            s = np.sin(2 * np.pi * f * tt) * np.minimum(1, tt / .005) * np.exp(-tt * 3)
            place(B, np.tanh(2.2 * s), at, .5)
    return lp(B, 900) * duck


# ---------- efeitos: subidas, whooshes, impactos, cliques e sinos ----------
def riser(length, peak=.5):
    tt = np.arange(int(length * SR)) / SR
    n = rng.standard_normal(len(tt))
    out = np.zeros_like(n)
    parts = 12
    for p in range(parts):  # varredura de banda por trechos
        a, b = p * len(n) // parts, (p + 1) * len(n) // parts
        fc = 400 * (12000 / 400) ** (p / parts)
        seg = bp(n[max(0, a - 2000):b], fc * .7, min(fc * 1.4, 20000))
        out[a:b] = seg[-(b - a):]
    return out * (tt / length) ** 2.2 * peak


def impact(big=1.0):
    tt = np.arange(int(2.5 * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-tt * 12)) / SR) * np.exp(-tt * 2.2)
    air = lp(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 5) * .35
    return (np.tanh(1.4 * boom) * .8 + air) * big


def tick():
    tt = np.arange(int(.08 * SR)) / SR
    return (np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 90) + bp(rng.standard_normal(len(tt)), 2000, 6000) * np.exp(-tt * 160) * .4)


def bell(m):
    tt = np.arange(int(2.2 * SR)) / SR
    f = hz(m)
    return sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt * d) for a, r, d in [(1, 1, 2.6), (.5, 2.01, 4), (.25, 3.02, 6), (.12, 4.17, 9)])


def fx():
    F, W = np.zeros(N), np.zeros(N)       # W: parte que vai mais para o reverb
    for c, ln, pk in [('caso', 1.6, .35), ('fb', 1.8, .4), ('ia', 2.4, .5), ('outro', 2.2, .5)]:
        r = riser(ln, pk)
        place(W, r, CUT[c] - ln)
    for c in ['partner', 'zoom', 'hip', 'quest', 'bonus']:
        place(W, riser(.7, .28), CUT[c] - .7)
    place(F, impact(.55), T0)
    for c, g in [('caso', .6), ('fb', .75), ('ia', 1.0), ('outro', 1.0)]:
        place(F, impact(g), CUT[c])
    for c in ['zoom', 'hip', 'quest', 'bonus']:
        place(F, impact(.3), CUT[c])
    for at in CLICKS:
        place(F, tick(), at, .22)
    for at, m in zip(CARDS, [81, 78, 74]):   # alta → moderada → baixa: o sino desce
        place(W, bell(m), at, .12)
    # acorde final: sinos em Dmaj9 abertos
    for k, m in enumerate([62, 69, 73, 76, 81]):
        place(W, bell(m), CUT['outro'] + .05 + k * .07, .06)
    return F, W


def reverb(x, secs=2.8, damp=5000):
    tt = np.arange(int(secs * SR)) / SR
    irs = [lp(rng.standard_normal(len(tt)), damp) * np.exp(-tt * 6.9 / secs) for _ in range(2)]
    irs = [ir / np.sqrt(np.sum(ir ** 2)) for ir in irs]
    return np.array([fftconvolve(x[c % len(x)], irs[c])[:N] for c in range(2)])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voz')
    ap.add_argument('--out-trilha', default='trilha.wav')
    ap.add_argument('--out-mix', default='mix.wav')
    a = ap.parse_args()

    P, A = pad(), arp()
    D, duck = drums()
    B = bass(duck)
    F, Wx = fx()
    P = P * (0.55 + 0.45 * duck)                      # pad respira com o bumbo
    wet = reverb(np.array([P[0] * .5 + A[0] * .7 + Wx, P[1] * .5 + A[1] * .7 + Wx]))
    wet += reverb(np.array([D * .15 + F * .35]), 1.6, 7000)
    M = P + A + np.array([D + B + F, D + B + F]) * .9 + np.array([Wx, Wx]) * .5 + wet * .45
    M = hp(M, 28)
    M = M / np.max(np.abs(M)) * .89
    write(a.out_trilha, M)
    print('trilha', a.out_trilha)

    if a.voz:
        v = read_mono(a.voz)
        v = np.pad(v, (0, max(0, N - len(v))))[:N]
        # envelope da voz em blocos de 5 ms, suavizado (ataque 20 ms, soltura 450 ms)
        blk = int(.005 * SR)
        nb = N // blk
        rms = np.sqrt(np.mean(v[:nb * blk].reshape(nb, blk) ** 2, axis=1) + 1e-12)
        db = 20 * np.log10(rms)
        env, e = np.zeros(nb), -90.0
        for i, x in enumerate(db):
            c = .22 if x > e else .011
            e += c * (x - e)
            env[i] = e
        g_db = -9 * np.clip((env + 42) / 12, 0, 1)
        g = 10 ** (np.interp(np.arange(N), np.arange(nb) * blk, g_db) / 20)
        mix = M * g * .5 + np.array([v, v])
        mix = mix / np.max(np.abs(mix)) * .97
        write(a.out_mix, mix)
        print('mix', a.out_mix)


def read_mono(path):
    with wave.open(path) as w:
        assert w.getframerate() == SR and w.getsampwidth() == 2, 'voz precisa ser WAV 48 kHz 16 bits'
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        return x.reshape(-1, w.getnchannels()).mean(axis=1)


def write(path, x):
    y = (np.clip(x, -1, 1).T * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(y.tobytes())


if __name__ == '__main__':
    main()
