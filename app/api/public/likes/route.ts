import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/nextauth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ ok:false, error:'auth_required' }, { status: 401 });

  const body = await req.json().catch(()=>({}));
  const slug = String(body.slug || body.postSlug || '');
  if (!slug) return NextResponse.json({ ok:false, error:'bad_request' }, { status: 400 });

  const post = await sql/*sql*/`SELECT id FROM posts WHERE slug=${slug} LIMIT 1`;
  if (!post?.[0]) return NextResponse.json({ ok:false, error:'not_found' }, { status: 404 });
  const postId = post[0].id;

  const has = await sql/*sql*/`SELECT 1 FROM post_likes WHERE post_id=${postId} AND user_id=${session.user.id} LIMIT 1`;
  if (has?.length) {
    await sql/*sql*/`DELETE FROM post_likes WHERE post_id=${postId} AND user_id=${session.user.id}`;
  } else {
    await sql/*sql*/`INSERT INTO post_likes (post_id, user_id) VALUES (${postId}, ${session.user.id}) ON CONFLICT DO NOTHING`;
  }
  const cnt = await sql/*sql*/`SELECT COUNT(*)::int AS n FROM post_likes WHERE post_id=${postId}`;
  return NextResponse.json({ ok:true, liked: !has?.length, count: cnt?.[0]?.n || 0 });
}
