import { NextResponse } from 'next/server';
import { sql } from '../../../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';

export const runtime = 'nodejs';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ ok:false, error:'auth_required' }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ ok:false, error:'bad_id' }, { status: 400 });

  const has = await sql/*sql*/`SELECT 1 FROM comment_likes WHERE comment_id=${id} AND user_id=${session.user.id} LIMIT 1`;
  if (has?.length) {
    await sql/*sql*/`DELETE FROM comment_likes WHERE comment_id=${id} AND user_id=${session.user.id}`;
    await sql/*sql*/`UPDATE comments SET likes_count = GREATEST(likes_count-1,0) WHERE id=${id}`;
  } else {
    await sql/*sql*/`INSERT INTO comment_likes (comment_id, user_id) VALUES (${id}, ${session.user.id}) ON CONFLICT DO NOTHING`;
    await sql/*sql*/`UPDATE comments SET likes_count = likes_count+1 WHERE id=${id}`;
  }
  const cnt = await sql/*sql*/`SELECT likes_count FROM comments WHERE id=${id}`;
  return NextResponse.json({ ok:true, liked: !has?.length, likes: cnt?.[0]?.likes_count || 0 });
}
