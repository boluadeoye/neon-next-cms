import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { getSession } from '../../../../lib/session';
import { ensureUniquePageSlug } from '../../../../lib/slug';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const rows = (await sql`
    SELECT id, title, slug, status, published_at, updated_at
    FROM pages
    ORDER BY updated_at DESC
    LIMIT 100
  `) as any[];
  return NextResponse.json({ ok: true, pages: rows });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const title = String(body?.title || '').trim();
    const content = String(body?.content || '').trim();
    const explicitSlug = String(body?.slug || '').trim();
    const status = body?.status === 'published' ? 'published' : 'draft';

    if (!title || !content) {
      return NextResponse.json({ ok: false, error: 'Title and content are required' }, { status: 400 });
    }

    const slug = await ensureUniquePageSlug(explicitSlug || title);
    const inserted = (await sql`
      INSERT INTO pages (title, slug, content, status, published_at)
      VALUES (${title}, ${slug}, ${content}, ${status}, ${status === 'published' ? sql`now()` : null})
      RETURNING id, title, slug, status, published_at
    `) as any[];

    return NextResponse.json({ ok: true, page: inserted[0] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error' }, { status: 500 });
  }
}
