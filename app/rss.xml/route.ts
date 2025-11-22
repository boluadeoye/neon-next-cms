import { sql } from '../../lib/db';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { origin } = new URL(req.url);
  const siteTitle = 'Blog';
  const siteDesc = 'Latest posts';

  const rows = (await sql`
    SELECT title, slug, excerpt, COALESCE(published_at, updated_at) AS pubdate
    FROM posts
    WHERE status = 'published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 30
  `) as any[];

  const items = rows.map((r: any) => `
    <item>
      <title><![CDATA[${r.title}]]></title>
      <link>${origin}/blog/${r.slug}</link>
      <guid>${origin}/blog/${r.slug}</guid>
      <pubDate>${new Date(r.pubdate).toUTCString()}</pubDate>
      ${r.excerpt ? `<description><![CDATA[${r.excerpt}]]></description>` : ''}
    </item>
  `).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteTitle}</title>
    <link>${origin}</link>
    <description>${siteDesc}</description>
    ${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
