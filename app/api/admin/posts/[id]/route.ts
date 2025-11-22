import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/db';
import { getSession } from '../../../../../lib/session';
import { ensureUniquePostSlug, slugify } from '../../../../../lib/slug';

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
    SELECT id, title, slug, excerpt, content, cover_image_url, status, published_at, updated_at
    FROM posts
    WHERE id = ${id}
    LIMIT 1
  `) as any[];

  if (rows.length === 0) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  const tagRows = (await sql`
    SELECT t.name, t.slug
    FROM tags t
    JOIN post_tags pt ON pt.tag_id = t.id
    WHERE pt.post_id = ${id}
    ORDER BY t.name ASC
  `) as any[];

  return NextResponse.json({ ok: true, post: rows[0], tags: tagRows });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return unauthorized();

  try {
    const id = params.id;
    const body = await req.json();

    const title = body?.title !== undefined ? String(body.title).trim() : undefined;
    const excerpt = body?.excerpt !== undefined ? String(body.excerpt).trim() : undefined;
    const content = body?.content !== undefined ? String(body.content).trim() : undefined;
    const cover = body?.cover_image_url !== undefined ? String(body.cover_image_url).trim() : undefined;
    const status = body?.status === 'published' ? 'published' : (body?.status === 'draft' ? 'draft' : undefined);
    const slugInput = body?.slug !== undefined ? String(body.slug).trim() : undefined;
    const tagsInput = body?.tags !== undefined ? String(body.tags).trim() : undefined; // comma-separated

    // fetch current to decide defaults
    const current = (await sql`SELECT title, slug, status FROM posts WHERE id = ${id} LIMIT 1`) as any[];
    if (current.length === 0) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    let newSlug = current[0].slug as string;
    if (slugInput !== undefined && slugInput !== current[0].slug) {
      newSlug = await ensureUniquePostSlug(slugInput || (title ?? current[0].title), id);
    } else if (title !== undefined && !slugInput) {
      // if title changed but slug not provided, keep existing slug
      newSlug = current[0].slug;
    }

    // build update dynamically
    const updates: string[] = [];
    const values: any[] = [];
    function set(col: string, val: any) { updates.push(`${col} = $${updates.length + 1}`); values.push(val); }

    if (title !== undefined) set('title', title);
    if (excerpt !== undefined) set('excerpt', excerpt || null);
    if (content !== undefined) set('content', content);
    if (cover !== undefined) set('cover_image_url', cover || null);
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
      const query = `UPDATE posts SET ${updates.join(', ')} WHERE id = $${updates.length + 1} RETURNING id, title, slug, status, published_at`;
      const updated = await (sql as any)(query, [...values, id]);
      // ignore result content here; we refetch below
    }

    // handle tags
    if (tagsInput !== undefined) {
      const tags = Array.from(new Set(String(tagsInput).split(',').map((t) => t.trim()).filter(Boolean)));
      // current tag ids
      const cur = (await sql`
        SELECT t.id, t.slug
        FROM tags t
        JOIN post_tags pt ON pt.tag_id = t.id
        WHERE pt.post_id = ${id}
      `) as any[];

      const curBySlug = new Map<string, string>(cur.map((r: any) => [r.slug, r.id]));
      const desiredSlugs = tags.map((name) => slugify(name));

      // add desired
      for (let i = 0; i < tags.length; i++) {
        const name = tags[i];
        const tslug = desiredSlugs[i];
        let found = (await sql`SELECT id FROM tags WHERE slug = ${tslug} LIMIT 1`) as any[];
        let tagId: string;
        if (found.length === 0) {
          const created = (await sql`INSERT INTO tags (name, slug) VALUES (${name}, ${tslug}) RETURNING id`) as any[];
          tagId = created[0].id;
        } else {
          tagId = found[0].id;
        }
        await sql`INSERT INTO post_tags (post_id, tag_id) VALUES (${id}, ${tagId}) ON CONFLICT DO NOTHING`;
      }

      // remove extras
      for (const [slug, tagId] of curBySlug.entries()) {
        if (!desiredSlugs.includes(slug)) {
          await sql`DELETE FROM post_tags WHERE post_id = ${id} AND tag_id = ${tagId}`;
        }
      }
    }

    // refetch
    const rows = (await sql`
      SELECT id, title, slug, excerpt, content, cover_image_url, status, published_at, updated_at
      FROM posts
      WHERE id = ${id}
      LIMIT 1
    `) as any[];

    return NextResponse.json({ ok: true, post: rows[0] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const id = params.id;
  await sql`DELETE FROM posts WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
