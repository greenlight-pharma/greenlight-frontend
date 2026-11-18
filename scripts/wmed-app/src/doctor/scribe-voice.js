// Transcrição ao vivo do Scribe: o microfone vai direto do navegador ao serviço de voz,
// com uma chave temporária pedida ao nosso servidor. O áudio não passa pelo servidor do 2Doctor.
import { parseVoiceMessage } from '../../shared/scribe-client.mjs';

const OPEN = 1;

export class VoiceSession {
 // getKey: () => Promise<{api_key, ws, config}>; onPieces(pieces); onError({type,message}); onDrop()
 constructor({ getKey, onPieces, onError, onDrop, firstSession = 0 }) {
  Object.assign(this, { getKey, onPieces, onError, onDrop });
  this.session = firstSession;
  this.ws = null; this.recorder = null; this.stream = null; this.alive = undefined; this.done = null;
 }

 get paused() { return this.recorder?.state === 'paused' && this.ws?.readyState === OPEN; }

 // Abre microfone e conexão. Devolve '' se deu certo, ou o código do problema:
 // 'unsupported' | 'mic-denied' | 'mic-missing' | 'connect' | { message } (erro vindo do servidor ao pedir a chave).
 async start() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return 'unsupported';
  try {
   if (!this.stream) this.stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
  } catch (e) {
   return e?.name === 'NotFoundError' || e?.name === 'OverconstrainedError' ? 'mic-missing' : 'mic-denied';
  }
  let key;
  try { key = await this.getKey(); } catch (e) { return { message: e.message, code: e.code }; }
  if (!key?.ws || !key?.api_key) return 'connect';

  this.session++;
  const session = this.session;
  let ws;
  try { ws = this.ws = new WebSocket(key.ws, ['soniox-api-key', key.api_key]); } catch { return 'connect'; }
  return new Promise((resolve) => {
   let settled = false, opened = false;
   const settle = (value) => { if (!settled) { settled = true; clearTimeout(timer); resolve(value); } };
   const timer = setTimeout(() => { if (!settled) { settle('connect'); if (this.ws === ws) this.ws = null; try { ws.close(); } catch { /* já fechou */ } } }, 12000);
   ws.onopen = () => {
    try {
     ws.send(JSON.stringify(key.config || {}));
     const recorder = (this.recorder = new MediaRecorder(this.stream));
     recorder.ondataavailable = async (ev) => { if (ev.data.size && ws.readyState === OPEN) ws.send(await ev.data.arrayBuffer()); };
     recorder.start(250);
     opened = true; settle('');
    } catch { settle('connect'); try { ws.close(); } catch { /* já fechou */ } }
   };
   ws.onmessage = (ev) => {
    if (this.ws !== ws) return;
    const m = parseVoiceMessage(ev.data, session);
    if (m.error) { this.onError?.(m.error); return; }
    this.onPieces?.(m.pieces);
    if (m.finished && this.done) this.done();
   };
   ws.onerror = () => settle('connect');
   ws.onclose = () => {
    settle('connect');
    if (this.ws !== ws) return;
    this.ws = null;
    if (this.recorder && this.recorder.state !== 'inactive') { try { this.recorder.stop(); } catch { /* já parou */ } }
    this.recorder = null;
    if (this.done) this.done(); else if (opened) this.onDrop?.();
   };
  });
 }

 // Pausa sem fechar a conexão, para manter as mesmas vozes ao continuar.
 pause() {
  if (this.recorder?.state === 'recording') this.recorder.pause();
  clearInterval(this.alive);
  this.alive = setInterval(() => { if (this.ws?.readyState === OPEN) this.ws.send('{"type":"keepalive"}'); }, 15000);
 }

 resume() {
  clearInterval(this.alive);
  if (!this.paused) return false;
  this.recorder.resume();
  return true;
 }

 // Fecha tudo. Com `wait`, espera o serviço devolver as últimas palavras.
 async close(wait) {
  clearInterval(this.alive);
  const ws = this.ws;
  if (this.recorder && this.recorder.state !== 'inactive') { try { this.recorder.stop(); } catch { /* já parou */ } }
  if (ws && ws.readyState === OPEN && wait) {
   await new Promise((r) => setTimeout(r, 400));
   const done = new Promise((r) => { this.done = r; });
   try { ws.send(''); } catch { /* já fechou */ }
   await Promise.race([done, new Promise((r) => setTimeout(r, 4000))]);
  }
  this.done = null; this.ws = null;
  try { ws?.close(); } catch { /* já fechou */ }
  this.stream?.getTracks().forEach((t) => t.stop());
  this.stream = null; this.recorder = null;
 }
}
