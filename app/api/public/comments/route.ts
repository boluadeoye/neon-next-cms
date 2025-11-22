import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function getPostId(slug: string) {
  const r = await sql`SELECT id FROM posts WHERE LOWER(slug) = LOWER(${slug}) LIMIT 1`;
  return (r as any[])[0]?.id as string | undefined;
}

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug') || '';
  const postId = await getPostId(slug);
  if (!postId) return NextResponse.json({ ok: true, comments: [] });

  const rows = await sql`
    SELECT id, name, message, created_at
    FROM comments
    WHERE post_id = ${postId} AND status = 'approved'
    ORDER BY created_at ASC
  `;
  return NextResponse.json({ ok: true, comments: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || '');
    const name = String(body?.name || '').trim().slice(0, 60);
    const message = String(body?.message || '').trim().slice(0, 2000);

    if (!slug || !name || !message) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });

    const postId = await getPostId(slug);
    if (!postId) return NextResponse.json({ ok: false, error: 'Post not found' }, { status: 404 });

    await sql`INSERT INTO comments (post_id, name, message, status) VALUES (${postId}, ${name}, ${message}, 'approved')`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error' }, { status: 500 });
  }
}
