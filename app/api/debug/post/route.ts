import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return NextResponse.json({ ok: false, error: 'Missing ?slug=' }, { status: 400 });

  const rows = (await sql`
    SELECT id, slug, status, title, published_at, updated_at
    FROM posts
    WHERE LOWER(slug) = LOWER(${slug})
    ORDER BY updated_at DESC
    LIMIT 5
  `) as any[];

  return NextResponse.json({ ok: true, rows });
}
