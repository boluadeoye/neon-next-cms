export function readingTime(text: string, wpm = 220) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / wpm));
  return { words, minutes };
}
