import { sql } from './db';

export type SiteSettings = {
  site_name?: string;
  site_description?: string;
  site_og_image?: string;
  site_twitter?: string;
};

export async function getSettings(keys?: string[]) {
  if (keys && keys.length) {
    const rows = (await sql`
      SELECT key, value FROM settings WHERE key = ANY(${keys})
    `) as any[];
    const map: Record<string, any> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  }
  const rows = (await sql`SELECT key, value FROM settings`) as any[];
  const map: Record<string, any> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const s = await getSettings(['site_name','site_description','site_og_image','site_twitter']);
  return {
    site_name: s.site_name?.value ?? s.site_name ?? undefined,
    site_description: s.site_description?.value ?? s.site_description ?? undefined,
    site_og_image: s.site_og_image?.value ?? s.site_og_image ?? undefined,
    site_twitter: s.site_twitter?.value ?? s.site_twitter ?? undefined,
  } as any;
}
