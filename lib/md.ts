import { slugify } from './slug';

export type Heading = { id: string; text: string; level: number };

export function extractHeadings(markdown: string): Heading[] {
  const out: Heading[] = [];
  const lines = String(markdown || '').split(/\r?\n/);
  for (const line of lines) {
    const m = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/#+$/,'').trim();
    const id = slugify(text);
    out.push({ id, text, level });
  }
  // de-dup ids if repeated
  const seen = new Map<string, number>();
  for (const h of out) {
    const n = seen.get(h.id) || 0;
    if (n > 0) h.id = `${h.id}-${n+1}`;
    seen.set(h.id, n+1);
  }
  return out;
}
