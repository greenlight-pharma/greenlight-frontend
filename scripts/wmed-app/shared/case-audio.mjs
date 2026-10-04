// Transport validation, not speech/content validation. Audio stays in the active component.
export function caseAudioType(blob) {
  if (!blob || !Number.isFinite(blob.size) || blob.size <= 0) throw Error('O arquivo de áudio está vazio. Escolha outro arquivo.');
  if (blob.size > 2900000) throw Error('O áudio deve ter até 2,9 MB. Grave um trecho menor.');
  const raw = (blob.type || 'audio/mp4').split(';')[0];
  const type = ({'audio/x-m4a':'audio/m4a','audio/x-wav':'audio/wav'})[raw] || raw;
  if (!['audio/mp4','audio/m4a','audio/webm','audio/mpeg','audio/wav','audio/ogg'].includes(type)) throw Error('Use áudio M4A, MP4, MP3, WAV, OGG ou WebM.');
  return type;
}
