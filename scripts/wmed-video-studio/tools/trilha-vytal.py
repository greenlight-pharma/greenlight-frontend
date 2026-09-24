#!/usr/bin/env python3
"""Trilha original do Reels Vytal Acadêmico × DA UniFAA (topics/vytal-unifaa-caso.js), sintetizada do zero.

Estética "healthtech": abre com batimento cardíaco e bipe de monitor afinado em Lá (A5, presente em todos os
acordes), que viram o pulso da música. 100 BPM, progressão IV–V–iii–vi em Ré maior (Gmaj9 → A6/9 → F#m7 → Bm9)
que resolve em Dmaj9 no final. Teclas de vidro (FM), arpejo cristalino, baixo pulsante no contratempo, bateria
limpa com shaker. Nas hipóteses a bateria sai e voltam coração e bipe; um sino marca cada cartão (alta →
moderada → baixa) e bipes de interface marcam os cliques. Swells reversos e glitches digitais nos cortes.
A música abaixa sozinha (sidechain) enquanto a locução fala.

  python3 tools/trilha-vytal.py --voz narracao.wav --out-trilha trilha.wav --out-mix mix.wav
Requer numpy e scipy. Sem --voz, gera só a trilha.
"""
import argparse, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR = 48000, 61.3
# cortes do vídeo (mesmos valores de S no tópico)
CUT = dict(partner=4.3, caso=8.1, fb=19.5, zoom=24.2, hip=29.2, ia=42.3, quest=47.9, bonus=51.0, outro=56.0)
T0, BEAT = 0.3, 0.6                         # 100 BPM ancorado no logo: 8.1, 19.5 e 42.3 caem no tempo
BAR = 4 * BEAT
CLICKS = [30.70, 38.13, 39.65]              # toques do cursor na cena das hipóteses
CARDS = [32.69, 34.69, 36.69]               # destaque de cada cartão de hipótese
PAD = [[55, 59, 62, 66, 69], [57, 61, 64, 66, 71], [54, 57, 61, 64, 69], [50, 54, 57, 59, 61]]   # Gmaj9 A6/9 F#m7 Bm9
ROOT = [43, 45, 42, 47]
FINAL, FINAL_ROOT = [50, 54, 57, 61, 64], 38                                                     # Dmaj9
BEEP = 81                                   # A5 = 880 Hz, o bipe de monitor

N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(11)
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)
lp = lambda x, f, o=2: sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f, o=2: sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, a, b, o=2: sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
FULL = [(CUT['fb'], CUT['hip']), (CUT['ia'], CUT['outro'])]      # seções com bateria completa
GROOVE = [(CUT['caso'], CUT['hip']), (CUT['ia'], CUT['outro'])]  # seções com baixo e teclas


def ramp(pts):
    xs, ys = zip(*pts)
    return np.interp(t, xs, ys)


def place(buf, sig, at, gain=1.0):
    i = int(round(at * SR))
    if i >= buf.shape[-1] or i + sig.shape[-1] <= 0:
        return
    s = sig[..., max(0, -i):]
    i = max(0, i)
    n = min(s.shape[-1], buf.shape[-1] - i)
    buf[..., i:i + n] += gain * s[..., :n]


def chord(tt):
    return None if tt >= CUT['outro'] else int(max(0, tt - T0) // BAR) % 4


def notes(tt):
    c = chord(tt)
    return FINAL if c is None else PAD[c]


def root(tt):
    c = chord(tt)
    return FINAL_ROOT if c is None else ROOT[c]


def grid(a, b, step=BEAT, off=0.0):
    k = int(np.ceil((a - T0 - off) / step - 1e-9))
    out = []
    while T0 + off + k * step < b - 1e-9:
        out.append(T0 + off + k * step)
        k += 1
    return out


def within(x, spans):
    return any(a <= x < b for a, b in spans)


def pan(sig, p):  # p em [-1, 1]
    return np.array([sig * np.sqrt((1 - p) / 2), sig * np.sqrt((1 + p) / 2)])


def env_ar(n, a, d):
    tt = np.arange(n) / SR
    return np.minimum(1, tt / max(a, 1e-4)) * np.exp(-tt * d)


# ---------- instrumentos ----------
def fm(f, secs, ratio=2.0, index=2.2, idec=9.0, adec=4.0, att=.002):
    tt = np.arange(int(secs * SR)) / SR
    mod = index * np.exp(-tt * idec) * np.sin(2 * np.pi * f * ratio * tt)
    return np.sin(2 * np.pi * f * tt + mod) * env_ar(len(tt), att, adec)


def heartbeat(g=1.0):
    """'Tum-tum' com fundamental grave e corpo em 120–400 Hz, para soar também no alto-falante do celular."""
    def thump(f0, dec, amp):
        tt = np.arange(int(.22 * SR)) / SR
        f = f0 * (1 + .6 * np.exp(-tt * 40))
        ph = 2 * np.pi * np.cumsum(f) / SR
        s = (np.sin(ph) + .55 * np.sin(2 * ph) + .3 * np.sin(3 * ph)) * env_ar(len(tt), .004, dec)
        thud = bp(rng.standard_normal(len(tt)), 90, 450) * env_ar(len(tt), .002, dec * 2.2) * .5
        return (s + thud) * amp
    out = np.zeros(int(.5 * SR))
    place(out, thump(64, 16, 1.0), 0)
    place(out, thump(57, 20, .7), .17)
    return np.tanh(2.0 * lp(out, 700)) * g


def beep(dur=.11, m=BEEP):
    tt = np.arange(int((dur + .05) * SR)) / SR
    f = hz(m)
    e = np.clip(tt / .004, 0, 1) * np.clip((dur + .05 - tt) / .05, 0, 1)
    return (np.sin(2 * np.pi * f * tt) + .18 * np.sin(2 * np.pi * 2 * f * tt)) * e


def kick():
    tt = np.arange(int(.4 * SR)) / SR
    f = 47 + 110 * np.exp(-tt * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 8)
    click = hp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 350) * .3
    return np.tanh(1.8 * (body + click))


def noise_hit(secs, a, b, dec, o=2):
    tt = np.arange(int(secs * SR)) / SR
    return bp(rng.standard_normal(len(tt)), a, b, o) * np.exp(-tt * dec)


def clap():
    tt = np.arange(int(.35 * SR)) / SR
    n = bp(rng.standard_normal(len(tt)), 1000, 6000)
    e = sum(np.exp(-np.maximum(0, tt - d) * (32 if d < .02 else 16)) * (tt >= d) for d in (0, .009, .019))
    return n * e * .6


def pluck_bass(f, secs):
    tt = np.arange(int(secs * SR)) / SR
    x = (2 * ((tt * f) % 1) - 1) * .55 + np.sin(2 * np.pi * f * tt)
    k = np.exp(-tt * 14)                      # filtro que abre e fecha: mistura de dois passa-baixas
    y = lp(x, 260) * (1 - k) + lp(x, 1400) * k
    return np.tanh(1.5 * y) * env_ar(len(tt), .003, 5)


def pad_voice(freqs, secs, bright):
    tt = np.arange(int(secs * SR)) / SR
    L, R = np.zeros(len(tt)), np.zeros(len(tt))
    for f in freqs:
        for d, p in [(-11, -.8), (-4, -.3), (4, .3), (11, .8)]:
            w = 2 * ((tt * f * 2 ** (d / 1200) + rng.random()) % 1) - 1
            L += w * np.sqrt((1 - p) / 2)
            R += w * np.sqrt((1 + p) / 2)
        body = .6 * np.sin(2 * np.pi * f / 2 * tt)   # corpo suave uma oitava abaixo
        L += body
        R += body
    return np.array([lp(L, bright), lp(R, bright)])


def reverb(x, secs=2.6, damp=6000, pre=.02):
    tt = np.arange(int(secs * SR)) / SR
    irs = []
    for _ in range(2):
        ir = lp(rng.standard_normal(len(tt)), damp) * np.exp(-tt * 6.9 / secs)
        ir = np.concatenate([np.zeros(int(pre * SR)), ir])
        irs.append(ir / np.sqrt(np.sum(ir ** 2)))
    return np.array([fftconvolve(x[c], irs[c])[:x.shape[-1]] for c in range(2)])


# ---------- camadas ----------
def layer_pad(duck):
    out = np.zeros((2, N))
    edges = sorted(set([0.0] + [T0 + i * BAR for i in range(40) if 0 < T0 + i * BAR < CUT['outro']] + [CUT['outro']]))
    edges.append(DUR)
    for a, b in zip(edges[:-1], edges[1:]):
        secs = b - a + .8
        v = pad_voice([hz(m) for m in notes(a + 1e-3)], secs, 2400 if a >= CUT['caso'] else 1300)
        tt = np.arange(v.shape[1]) / SR
        place(out, v * np.minimum(1, tt / .4) * np.clip((secs - tt) / .8, 0, 1), a)
    g = ramp([(0, 0), (1.8, .8), (CUT['caso'], .7), (CUT['hip'], .7), (CUT['hip'] + .6, 1.0), (CUT['ia'] - .3, 1.0),
              (CUT['ia'], .65), (CUT['outro'], 1.0), (DUR - 2.4, .95), (DUR, 0)])
    return out * g * (.45 + .55 * duck) * .010


def layer_keys():
    """Teclas de vidro no contratempo (acordes FM curtos), só nas seções com groove."""
    out = np.zeros((2, N))
    for at in [x for a, b in GROOVE for x in grid(a, b, BEAT, BEAT / 2)]:
        full = within(at, FULL)
        for i, m in enumerate(notes(at)[1:]):
            s = fm(hz(m + 12), .5, ratio=3.0, index=1.4, idec=18, adec=9)
            place(out, pan(s, (-.5, -.15, .15, .5)[i]), at + i * .004, .8 if full else .45)
    return lp(out, 9000) * .045


def layer_arp():
    out = np.zeros((2, N))
    pat = [0, 2, 4, 3, 1, 3, 4, 2]
    for i, at in enumerate(grid(CUT['partner'] - .3, CUT['outro'] + .05, BEAT / 4)):
        top = [m + 12 for m in notes(at)]
        m = top[pat[i % 8]] + (12 if at > CUT['ia'] and (i // 16) % 2 else 0)
        s = fm(hz(m), .45, ratio=2.0, index=1.8, idec=12, adec=11)
        place(out, pan(s, .45 * np.sin(i * .7)), at, 1.0 if i % 4 == 0 else .7)
    d = int(.45 * SR)                     # eco pingue-pongue 3/16
    echo = np.zeros_like(out)
    for k in range(1, 5):
        src = out[::-1] if k % 2 else out
        echo[:, d * k:] += .4 ** k * src[:, :-d * k]
    out = lp(out + echo, 8000)
    g = ramp([(0, 0), (CUT['partner'] - .3, 0), (CUT['partner'] + 1.4, .6), (CUT['caso'], .7), (CUT['hip'], .75), (CUT['hip'] + .3, .45),
              (CUT['ia'] - 1.2, .6), (CUT['ia'], .9), (CUT['outro'] - .1, .9), (CUT['outro'] + .2, 0), (DUR, 0)])
    return out * g * .075


def layer_hook():
    """Motivo curto de sinos (FM) a cada 2 compassos nas seções completas — a assinatura da marca."""
    out = np.zeros((2, N))
    motif = [(0, 76), (.45, 78), (.9, 81), (1.5, 78), (1.95, 83)]   # E F# A F# B (pentatônica de Ré)
    for a, b in FULL:
        for bar0 in grid(a, b - 2 * BAR + .01, 2 * BAR):
            for dt, m in motif:
                place(out, pan(fm(hz(m + 12), 1.2, ratio=3.5, index=2.4, idec=6, adec=3.5), .25), bar0 + dt, .8)
    return out * .016


def layer_drums():
    D = np.zeros((2, N))
    duck = np.ones(N)
    K, C = kick(), clap()
    for at in [x for a, b in FULL for x in grid(a, b)] + grid(CUT['caso'], CUT['fb'], 2 * BEAT):
        place(D, np.array([K, K]), at, .62)
        i = int(at * SR)
        n = min(int(.36 * SR), N - i)
        duck[i:i + n] = np.minimum(duck[i:i + n], 1 - .75 * np.exp(-np.arange(n) / SR * 8))
    for a, b in FULL:
        for at in grid(a, b, 2 * BEAT, BEAT):
            place(D, np.array([C, C]), at, .5)
    for a, b in GROOVE:                                 # hat aberto no contratempo
        for at in grid(a, b, BEAT, BEAT / 2):
            place(D, pan(noise_hit(.16, 7000, 16000, 26, 4), .2), at, .22)
    for a, b in FULL:                                   # shaker 16 avos com leve swing
        for j, at in enumerate(grid(a, b, BEAT / 4)):
            place(D, pan(noise_hit(.06, 5000, 12000, 70, 4), -.35), at + (.018 if j % 2 else 0), .16 if j % 4 == 2 else .09)
    for a, b in FULL:                                   # perc sincopada
        for at in grid(a, b, 2 * BAR, 1.5 * BEAT + BEAT / 4):
            place(D, pan(noise_hit(.08, 1800, 3500, 60), .5), at, .25)
    # hipóteses: shaker cresce a partir do clique em "Entender" + virada curta antes da volta
    for at in grid(CLICKS[1], CUT['ia'], BEAT / 4):
        place(D, pan(noise_hit(.06, 5000, 12000, 70, 4), -.3), at, .03 + .12 * (at - CLICKS[1]) / (CUT['ia'] - CLICKS[1]))
    for at in grid(CUT['ia'] - BEAT, CUT['ia'], BEAT / 4):
        place(D, np.array([C, C]), at, .3)
    return D, duck


def layer_bass(duck):
    B = np.zeros(N)
    for a, b in GROOVE:
        for at in grid(a, b, BEAT, BEAT / 2):             # contratempo (estilo house)
            place(B, pluck_bass(hz(root(at)), BEAT * .55), at, .55)
        if within(a + .01, FULL):
            for at in grid(a, b, BAR, 3.5 * BEAT):         # nota de passagem no fim do compasso
                place(B, pluck_bass(hz(root(at) + 7), BEAT * .3), at, .35)
    tt = np.arange(int(4.5 * SR)) / SR                     # final: sub longo em Ré
    place(B, np.sin(2 * np.pi * hz(FINAL_ROOT) * tt) * np.minimum(1, tt / .02) * np.exp(-tt * .7) * .3, CUT['outro'])
    return B * (.35 + .65 * duck)


def layer_clinical():
    """Coração e bipe de monitor: abertura (vira o pulso) e hipóteses (clima clínico)."""
    H, W = np.zeros((2, N)), np.zeros((2, N))
    hb = heartbeat()
    for at in grid(0, CUT['partner'] + .1, 2 * BEAT):          # abertura: 50 bpm
        place(H, np.array([hb, hb]), at, .8)
        place(W, pan(beep(), .1), at + .04, .22)
    for at in grid(CUT['partner'], CUT['caso'], 2 * BEAT):   # parceria: só o coração, mais baixo
        place(H, np.array([hb, hb]), at, .45)
    for at in grid(CUT['hip'] + .1, CUT['ia'] - BEAT, 2 * BEAT):
        place(H, np.array([hb, hb]), at, .6 if at < CLICKS[1] else .4)
        place(W, pan(beep(.08), -.1), at + .04, .12 if at < CLICKS[1] else .07)
    return H, W


def riser(length, peak=.5):
    tt = np.arange(int(length * SR)) / SR
    n = rng.standard_normal(len(tt))
    out = np.zeros_like(n)
    parts = 16
    for p in range(parts):
        a, b = p * len(n) // parts, (p + 1) * len(n) // parts
        fc = 350 * (13000 / 350) ** (p / parts)
        seg = bp(n[max(0, a - 2000):b], fc * .7, min(fc * 1.4, 21000))
        out[a:b] = seg[-(b - a):]
    return out * (tt / length) ** 2.4 * peak


def reverse_swell(at, secs=1.4):
    """Acorde da próxima cena passado por reverb e invertido: 'suga' para dentro do corte."""
    src = np.zeros((2, int((secs + .4) * SR)))
    for m in notes(at + .01):
        place(src, pan(fm(hz(m + 12), .6, ratio=2, index=1.2, idec=8, adec=6), 0), 0, .5)
    rev = reverb(src, secs, 7000, 0)[:, ::-1][:, -int(secs * SR):]
    return rev * np.linspace(0, 1, rev.shape[1]) ** 1.5


def glitch(length=.28):
    """Rajada digital: bipes quantizados e picotados (dados)."""
    n = int(length * SR)
    out = np.zeros(n)
    step = int(.028 * SR)
    for k in range(0, n, step):
        f = hz(BEEP + [0, 12, 7, 19, 12, 24][(k // step) % 6])
        tt = np.arange(min(step, n - k)) / SR
        on = 0 if rng.random() < .25 else 1
        out[k:k + len(tt)] += np.sign(np.sin(2 * np.pi * f * tt)) * .5 * np.exp(-tt * 60) * on
    return bp(np.round(out * 6) / 6, 600, 9000) * np.linspace(1, .4, n)   # bitcrush + banda


def impact(big=1.0):
    tt = np.arange(int(2.6 * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(40 + 70 * np.exp(-tt * 12)) / SR) * np.exp(-tt * 2.4)
    body = np.sin(2 * np.pi * 110 * tt) * np.exp(-tt * 9) * .35
    air = lp(rng.standard_normal(len(tt)), 7000) * np.exp(-tt * 5) * .3
    return (np.tanh(1.4 * boom) * .8 + body + air) * big


def ui_blip():
    out = np.zeros(int(.14 * SR))
    place(out, beep(.035, BEEP + 7), 0, .8)
    place(out, beep(.05, BEEP + 12), .045, .8)
    return out


def bell(m, secs=2.4):
    return fm(hz(m), secs, ratio=3.5, index=2.6, idec=5, adec=2.4) + .4 * fm(hz(m + 12), secs, ratio=2, index=1, idec=6, adec=3.5)


def layer_fx():
    F, W = np.zeros((2, N)), np.zeros((2, N))   # W: mais reverb
    for c, ln, pk in [('caso', 1.6, .3), ('fb', 1.8, .35), ('ia', 2.6, .45), ('outro', 2.4, .45)]:
        place(W, np.tile(riser(ln, pk), (2, 1)), CUT[c] - ln)
    for c in ['partner', 'caso', 'fb', 'hip', 'ia', 'outro']:
        place(W, reverse_swell(CUT[c]), CUT[c] - 1.4, .7)
    for c in ['zoom', 'quest', 'bonus']:
        place(W, np.tile(riser(.7, .22), (2, 1)), CUT[c] - .7)
    place(F, np.tile(impact(.5), (2, 1)), T0)
    for c, g in [('caso', .55), ('fb', .7), ('ia', .95), ('outro', .9)]:
        place(F, np.tile(impact(g), (2, 1)), CUT[c])
    for c in ['zoom', 'hip', 'bonus']:
        place(F, np.tile(impact(.25), (2, 1)), CUT[c])
    for c, p in [('fb', .4), ('quest', -.4), ('zoom', -.3)]:
        place(F, pan(glitch(), p), CUT[c] - .05, .35)
    for at in CLICKS:
        place(F, pan(ui_blip(), .2), at, .3)
    for i, (at, m) in enumerate(zip(CARDS, [81, 78, 74])):   # alta → moderada → baixa: o sino desce (A5 F#5 D5)
        place(W, pan(bell(m), (-.3, 0, .3)[i]), at, .09)
    for k, m in enumerate([62, 69, 73, 76, 81]):              # final: Dmaj9 em sinos + bipe resolvido
        place(W, pan(bell(m, 3.5), -.6 + .3 * k), CUT['outro'] + .05 + k * .08, .05)
    place(W, pan(beep(.5), 0), CUT['outro'] + .9, .12)
    return F, W


# ---------- master ----------
def compress(x, thr_db=-18, ratio=2.5, att=.01, rel=.18):
    blk = int(.002 * SR)
    mono = np.max(np.abs(x), axis=0)
    nb = len(mono) // blk
    lv = 20 * np.log10(np.sqrt(np.mean(mono[:nb * blk].reshape(nb, blk) ** 2, axis=1)) + 1e-9)
    ca, cr = 1 - np.exp(-.002 / att), 1 - np.exp(-.002 / rel)
    env, e = np.empty(nb), -90.0
    for i, v in enumerate(lv):
        e += (ca if v > e else cr) * (v - e)
        env[i] = e
    gr = np.minimum(0, (thr_db - env) * (1 - 1 / ratio))
    return x * 10 ** (np.interp(np.arange(x.shape[1]), np.arange(nb) * blk, gr) / 20)


def build():
    D, duck = layer_drums()
    P = layer_pad(duck)
    K, A, Hk = layer_keys(), layer_arp(), layer_hook()
    B = layer_bass(duck)
    H, Wc = layer_clinical()
    F, Wf = layer_fx()
    dry = P + K * (.6 + .4 * duck) + A + Hk + D + np.array([B, B]) * .9 + H + F + Wc * .6 + Wf * .5
    wet = reverb(P * .5 + K * .5 + A * .6 + Hk * .8 + Wc + Wf, 2.8, 6500) + reverb(D * .12 + F * .3, 1.4, 8000, .01)
    M = hp(dry + wet * .42, 30)
    M = compress(M / np.max(np.abs(M)) * .7)
    return np.tanh(M / np.max(np.abs(M)) * 1.05 / .9) * .9     # limitador suave


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voz')
    ap.add_argument('--out-trilha', default='trilha.wav')
    ap.add_argument('--out-mix', default='mix.wav')
    a = ap.parse_args()

    M = build()
    write(a.out_trilha, M)
    print('trilha', a.out_trilha)
    if not a.voz:
        return
    v = read_mono(a.voz)
    v = np.pad(v, (0, max(0, N - len(v))))[:N]
    blk = int(.005 * SR)                       # envelope da voz: ataque 20 ms, soltura 450 ms
    nb = N // blk
    db = 20 * np.log10(np.sqrt(np.mean(v[:nb * blk].reshape(nb, blk) ** 2, axis=1) + 1e-12))
    env, e = np.zeros(nb), -90.0
    for i, x in enumerate(db):
        e += (.22 if x > e else .011) * (x - e)
        env[i] = e
    g = 10 ** (np.interp(np.arange(N), np.arange(nb) * blk, -9 * np.clip((env + 42) / 12, 0, 1)) / 20)
    mix = M * g * .42 + np.array([v, v])
    write(a.out_mix, mix / np.max(np.abs(mix)) * .97)
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
