import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function getPostId(slug: string) {
  const r = await sql`SELECT id FROM posts WHERE LOWER(slug) = LOWER(${slug}) LIMIT 1`;
  return (r as any[])[0]?.id as string | undefined;
}

function ensureAnon() {
  const jar = cookies();
  let id = jar.get('anon_id')?.value;
  if (!id) id = crypto.randomUUID();
  const set = NextResponse.next();
  set.cookies.set('anon_id', id, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 });
  return { id, set };
}

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug') || '';
  const postId = await getPostId(slug);
  if (!postId) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  const anon = cookies().get('anon_id')?.value || '';
  const countRows = await sql`SELECT COUNT(*)::int AS c FROM post_likes WHERE post_id = ${postId}`;
  const likedRows = anon ? await sql`SELECT 1 FROM post_likes WHERE post_id = ${postId} AND anon_id = ${anon} LIMIT 1` : [];
  return NextResponse.json({ ok: true, count: (countRows as any[])[0].c, liked: (likedRows as any[]).length > 0 });
}

export async function POST(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug') || '';
  const postId = await getPostId(slug);
  if (!postId) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  const { id, set } = ensureAnon();
  const exists = await sql`SELECT 1 FROM post_likes WHERE post_id = ${postId} AND anon_id = ${id} LIMIT 1`;
  if ((exists as any[]).length > 0) {
    await sql`DELETE FROM post_likes WHERE post_id = ${postId} AND anon_id = ${id}`;
  } else {
    await sql`INSERT INTO post_likes (post_id, anon_id) VALUES (${postId}, ${id})`;
  }
  const countRows = await sql`SELECT COUNT(*)::int AS c FROM post_likes WHERE post_id = ${postId}`;
  const liked = (exists as any[]).length === 0;
  return NextResponse.json({ ok: true, count: (countRows as any[])[0].c, liked }, { headers: set.headers });
}
