import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || '';
  if (!slug) return NextResponse.json({ ok: true, comments: [] });

  const post = await sql/*sql*/`SELECT id FROM posts WHERE slug=${slug} LIMIT 1`;
  if (!post?.[0]) return NextResponse.json({ ok: true, comments: [] });
  const postId = post[0].id;

  const rows = await sql/*sql*/`
    SELECT id, name, message, created_at
    FROM comments
    WHERE post_id=${postId} AND status='approved'
    ORDER BY created_at ASC
  `;
  return NextResponse.json({ ok: true, comments: rows || [] });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug || '');
  const name = (body.name && String(body.name).trim()) || 'Reader';
  const message = String(body.message || '').trim();

  if (!slug || !message) return NextResponse.json({ ok:false, error:'bad_request' }, { status: 400 });

  const post = await sql/*sql*/`SELECT id FROM posts WHERE slug=${slug} LIMIT 1`;
  if (!post?.[0]) return NextResponse.json({ ok:false, error:'not_found' }, { status: 404 });
  const postId = post[0].id;

  await sql/*sql*/`
    INSERT INTO comments (post_id, name, message, status)
    VALUES (${postId}, ${name}, ${message}, 'approved')
  `;
  return NextResponse.json({ ok:true });
}
