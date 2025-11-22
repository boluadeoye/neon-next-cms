import { sql } from '../lib/db';

export default async function SiteFooter() {
  const rows = (await sql`SELECT value FROM settings WHERE key = 'site_name' LIMIT 1`) as any[];
  const site = rows[0]?.value ?? 'My Site';
  const year = new Date().getFullYear();
  return (
    <div style={{ display:'flex', gap:16, justifyContent:'space-between', flexWrap:'wrap' }}>
      <div>© {year} {String(site)}</div>
      <div style={{ display:'flex', gap:12 }}>
        <a href="/rss.xml">RSS</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </div>
  );
}
