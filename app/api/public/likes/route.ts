import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';

function getOrSetDeviceId() {
  const jar = cookies();
  let cid = jar.get('cid')?.value;
  if (!cid) {
    cid = crypto.randomUUID();
    // Set via response in handler
  }
  return cid;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug || body.postSlug || '');
  if (!slug) return NextResponse.json({ ok:false, error:'bad_request' }, { status: 400 });

  const post = await sql/*sql*/`SELECT id FROM posts WHERE slug=${slug} LIMIT 1`;
  if (!post?.[0]) return NextResponse.json({ ok:false, error:'not_found' }, { status: 404 });
  const postId = post[0].id;

  const res = NextResponse.json({ ok: true });
  const device = getOrSetDeviceId();
  if (!cookies().get('cid')) {
    res.cookies.set({
      name: 'cid',
      value: device,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365
    });
  }

  const has = await sql/*sql*/`SELECT 1 FROM post_likes WHERE post_id=${postId} AND device_id=${device} LIMIT 1`;

  if (has?.length) {
    await sql/*sql*/`DELETE FROM post_likes WHERE post_id=${postId} AND device_id=${device}`;
  } else {
    await sql/*sql*/`INSERT INTO post_likes (post_id, device_id) VALUES (${postId}, ${device}) ON CONFLICT DO NOTHING`;
  }

  const cnt = await sql/*sql*/`SELECT COUNT(*)::int AS n FROM post_likes WHERE post_id=${postId}`;
  return NextResponse.json({ ok:true, liked: !has?.length, count: cnt?.[0]?.n || 0 }, { headers: res.headers });
}
