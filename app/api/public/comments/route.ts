import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';

function toInt(x:any){ const n=Number(x); return Number.isFinite(n)?n:null; }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || '';
  if (!slug) return NextResponse.json({ ok: true, comments: [] });

  const post = await sql/*sql*/`SELECT id FROM posts WHERE slug=${slug} LIMIT 1`;
  if (!post?.[0]) return NextResponse.json({ ok: true, comments: [] });
  const postId = post[0].id;

  const rows = await sql/*sql*/`
    SELECT id, name, message, created_at, parent_id
    FROM comments
    WHERE post_id=${postId} AND status='approved'
    ORDER BY created_at ASC
  `;

  // Build nested tree
  const byId: Record<string, any> = {};
  const roots: any[] = [];
  for (const r of rows) {
    byId[r.id] = { id:r.id, name:r.name, message:r.message, created_at:r.created_at, parent_id:r.parent_id, children: [] };
  }
  for (const r of rows) {
    if (r.parent_id && byId[r.parent_id]) byId[r.parent_id].children.push(byId[r.id]);
    else roots.push(byId[r.id]);
  }

  return NextResponse.json({ ok: true, comments: roots });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug || '');
  const name = String(body.name || '').trim();
  const message = String(body.message || '').trim();
  const parentId = toInt(body.parentId);

  if (!slug || !name || !message) {
    return NextResponse.json({ ok:false, error:'bad_request' }, { status: 400 });
  }

  const post = await sql/*sql*/`SELECT id FROM posts WHERE slug=${slug} LIMIT 1`;
  if (!post?.[0]) return NextResponse.json({ ok:false, error:'not_found' }, { status: 404 });
  const postId = post[0].id;

  const rows = await sql/*sql*/`
    INSERT INTO comments (post_id, name, message, status, parent_id)
    VALUES (${postId}, ${name}, ${message}, 'approved', ${parentId})
    RETURNING id, name, message, created_at, parent_id
  `;
  const c = rows[0];

  return NextResponse.json({ ok:true, comment:{ id:c.id, name:c.name, message:c.message, created_at:c.created_at, parent_id:c.parent_id, children: [] } });
}
