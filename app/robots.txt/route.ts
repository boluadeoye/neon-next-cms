export const runtime = 'edge';

export async function GET(req: Request) {
  const { origin } = new URL(req.url);
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
