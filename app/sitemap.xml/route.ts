import { sql } from '../../lib/db';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { origin } = new URL(req.url);
  const posts = (await sql`
    SELECT slug, COALESCE(published_at, updated_at) AS lastmod
    FROM posts
    WHERE status = 'published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 200
  `) as any[];

  const pages = (await sql`
    SELECT slug, COALESCE(published_at, updated_at) AS lastmod
    FROM pages
    WHERE status = 'published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 200
  `) as any[];

  const urls = [
    { loc: `${origin}/`, lastmod: new Date().toISOString() },
    { loc: `${origin}/blog`, lastmod: new Date().toISOString() },
    ...posts.map((p: any) => ({ loc: `${origin}/blog/${p.slug}`, lastmod: p.lastmod })),
    ...pages.map((p: any) => ({ loc: `${origin}/${p.slug}`, lastmod: p.lastmod })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${u.loc}</loc><lastmod>${new Date(u.lastmod).toISOString()}</lastmod></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
