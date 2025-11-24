import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

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
    SELECT c.id, c.message, c.created_at, c.parent_id, c.likes_count,
           u.id as user_id, u.name as user_name, u.image as user_image
    FROM comments c
    LEFT JOIN users_public u ON u.id = c.user_id
    WHERE c.post_id=${postId} AND c.status='approved'
    ORDER BY c.created_at ASC
  `;

  const byId: Record<string, any> = {};
  const roots: any[] = [];
  for (const r of rows) {
    byId[r.id] = {
      id: r.id, message: r.message, created_at: r.created_at,
      likes: r.likes_count || 0, parent_id: r.parent_id,
      user: r.user_id ? { id:r.user_id, name:r.user_name, image:r.user_image } : null,
      children: []
    };
  }
  for (const r of rows) {
    if (r.parent_id && byId[r.parent_id]) byId[r.parent_id].children.push(byId[r.id]);
    else roots.push(byId[r.id]);
  }
  return NextResponse.json({ ok: true, comments: roots });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ ok:false, error:'auth_required' }, { status: 401 });

  const body = await req.json().catch(()=>({}));
  const slug = String(body.slug || '');
  const message = String(body.message || '').trim();
  const parentId = toInt(body.parentId);
  if (!slug || !message) return NextResponse.json({ ok:false, error:'bad_request' }, { status: 400 });

  const post = await sql/*sql*/`SELECT id FROM posts WHERE slug=${slug} LIMIT 1`;
  if (!post?.[0]) return NextResponse.json({ ok:false, error:'not_found' }, { status: 404 });
  const postId = post[0].id;

  const rows = await sql/*sql*/`
    INSERT INTO comments (post_id, user_id, parent_id, message, status)
    VALUES (${postId}, ${session.user.id}, ${parentId}, ${message}, 'approved')
    RETURNING id, message, created_at, parent_id
  `;
  const c = rows[0];

  return NextResponse.json({ ok:true, comment:{
    id:c.id, message:c.message, created_at:c.created_at, parent_id:c.parent_id, likes:0,
    user:{ id: session.user.id, name: session.user.name || null, image: (session.user as any).image || null }
  }});
}
