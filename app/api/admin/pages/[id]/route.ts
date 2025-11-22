import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/db';
import { getSession } from '../../../../../lib/session';
import { ensureUniquePageSlug } from '../../../../../lib/slug';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const id = params.id;
  const rows = (await sql`
    SELECT id, title, slug, content, status, published_at, updated_at
    FROM pages
    WHERE id = ${id}
    LIMIT 1
  `) as any[];

  if (rows.length === 0) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, page: rows[0] });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return unauthorized();

  try {
    const id = params.id;
    const body = await req.json();

    const title = body?.title !== undefined ? String(body.title).trim() : undefined;
    const content = body?.content !== undefined ? String(body.content).trim() : undefined;
    const status = body?.status === 'published' ? 'published' : (body?.status === 'draft' ? 'draft' : undefined);
    const slugInput = body?.slug !== undefined ? String(body.slug).trim() : undefined;

    const current = (await sql`SELECT title, slug, status FROM pages WHERE id = ${id} LIMIT 1`) as any[];
    if (current.length === 0) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    let newSlug = current[0].slug as string;
    if (slugInput !== undefined && slugInput !== current[0].slug) {
      newSlug = await ensureUniquePageSlug(slugInput || (title ?? current[0].title), id);
    }

    const updates: string[] = [];
    const values: any[] = [];
    const set = (col: string, val: any) => { updates.push(`${col} = $${values.length + 1}`); values.push(val); };

    if (title !== undefined) set('title', title);
    if (content !== undefined) set('content', content);
    if (newSlug !== current[0].slug) set('slug', newSlug);
    if (status !== undefined) {
      set('status', status);
      if (status === 'published') {
        updates.push(`published_at = COALESCE(published_at, now())`);
      } else if (status === 'draft') {
        updates.push(`published_at = NULL`);
      }
    }

    if (updates.length > 0) {
      const idParamIndex = values.length + 1;
      const query = `UPDATE pages SET ${updates.join(', ')} WHERE id = $${idParamIndex} RETURNING id`;
      await (sql as any)(query, [...values, id]);
    }

    const rows = (await sql`
      SELECT id, title, slug, content, status, published_at, updated_at
      FROM pages
      WHERE id = ${id}
      LIMIT 1
    `) as any[];

    return NextResponse.json({ ok: true, page: rows[0] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const id = params.id;
  await sql`DELETE FROM pages WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
