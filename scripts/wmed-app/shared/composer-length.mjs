// Same UTF-16 count as the existing textarea/server string limits.
export const MAX_CHAT_CHARACTERS = 2000;
export function composerLength(text) {
  const used = text.length;
  return { used, remaining: MAX_CHAT_CHARACTERS - used, over: used > MAX_CHAT_CHARACTERS, visible: used >= 1800 };
}
