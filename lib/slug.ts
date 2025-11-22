import { sql } from './db';

export function slugify(input: string) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

// Ensure unique slug in posts. If exists, append -2, -3, ...
export async function ensureUniquePostSlug(desired: string, excludeId?: string) {
  const base = slugify(desired) || 'post';
  let candidate = base;
  let n = 2;
  while (true) {
    let rows;
    if (excludeId) {
      rows = await sql`SELECT 1 FROM posts WHERE slug = ${candidate} AND id <> ${excludeId} LIMIT 1`;
    } else {
      rows = await sql`SELECT 1 FROM posts WHERE slug = ${candidate} LIMIT 1`;
    }
    if ((rows as any[]).length === 0) return candidate;
    candidate = `${base}-${n++}`;
  }
}

// Ensure unique slug in pages
export async function ensureUniquePageSlug(desired: string, excludeId?: string) {
  const base = slugify(desired) || 'page';
  let candidate = base;
  let n = 2;
  while (true) {
    let rows;
    if (excludeId) {
      rows = await sql`SELECT 1 FROM pages WHERE slug = ${candidate} AND id <> ${excludeId} LIMIT 1`;
    } else {
      rows = await sql`SELECT 1 FROM pages WHERE slug = ${candidate} LIMIT 1`;
    }
    if ((rows as any[]).length === 0) return candidate;
    candidate = `${base}-${n++}`;
  }
}
