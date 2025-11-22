import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { getSession } from '../../../../lib/session';
import { ensureUniquePostSlug, slugify } from '../../../../lib/slug';

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
    FROM posts
    ORDER BY updated_at DESC
    LIMIT 100
  `) as any[];

  return NextResponse.json({ ok: true, posts: rows });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const title = String(body?.title || '').trim();
    const excerpt = String(body?.excerpt || '').trim();
    const content = String(body?.content || '').trim();
    const cover = String(body?.cover_image_url || '').trim();
    const tagsInput = String(body?.tags || '').trim(); // comma-separated
    const explicitSlug = String(body?.slug || '').trim();
    const status = body?.status === 'published' ? 'published' : 'draft';

    if (!title || !content) {
      return NextResponse.json({ ok: false, error: 'Title and content are required' }, { status: 400 });
    }

    const slug = await ensureUniquePostSlug(explicitSlug || title);
    const authorId = session.sub as string | undefined;

    const inserted = (await sql`
      INSERT INTO posts (title, slug, excerpt, content, cover_image_url, status, author_id, published_at)
      VALUES (${title}, ${slug}, ${excerpt || null}, ${content}, ${cover || null}, ${status}, ${authorId || null},
              ${status === 'published' ? sql`now()` : null})
      RETURNING id, title, slug, status, published_at
    `) as any[];

    const post = inserted[0];

    // tags
    if (tagsInput) {
      const tags = Array.from(new Set(tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean)));
      for (const name of tags) {
        const tslug = slugify(name);
        let tag = (await sql`SELECT id FROM tags WHERE slug = ${tslug} LIMIT 1`) as any[];
        let tagId: string;
        if (tag.length === 0) {
          const created = (await sql`INSERT INTO tags (name, slug) VALUES (${name}, ${tslug}) RETURNING id`) as any[];
          tagId = created[0].id;
        } else {
          tagId = tag[0].id;
        }
        await sql`INSERT INTO post_tags (post_id, tag_id) VALUES (${post.id}, ${tagId}) ON CONFLICT DO NOTHING`;
      }
    }

    return NextResponse.json({ ok: true, post });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error' }, { status: 500 });
  }
}
