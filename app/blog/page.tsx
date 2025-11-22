import { sql } from '../../lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import PostCard from '../../components/PostCard';
import PostCardCompact from '../../components/PostCardCompact';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = { id: string; title: string; slug: string; excerpt: string | null; published_at: string | null; updated_at?: string };

export default async function BlogIndex({ searchParams }: { searchParams?: { tag?: string } }) {
  noStore();

  const tag = searchParams?.tag ? String(searchParams.tag) : null;

  const posts = tag
    ? (await sql`
        SELECT p.id, p.title, p.slug, p.excerpt, p.published_at, p.updated_at
        FROM posts p
        JOIN post_tags pt ON pt.post_id = p.id
        JOIN tags t ON t.id = pt.tag_id
        WHERE p.status = 'published' AND LOWER(t.slug) = LOWER(${tag})
        ORDER BY COALESCE(p.published_at, p.updated_at) DESC
        LIMIT 40
      `) as Post[]
    : (await sql`
        SELECT id, title, slug, excerpt, published_at, updated_at
        FROM posts
        WHERE status = 'published'
        ORDER BY COALESCE(published_at, updated_at) DESC
        LIMIT 40
      `) as Post[];

  const topTags = (await sql`
    SELECT t.name, t.slug, COUNT(*)::int AS count
    FROM tags t
    JOIN post_tags pt ON pt.tag_id = t.id
    JOIN posts p ON p.id = pt.post_id AND p.status='published'
    GROUP BY t.id, t.name, t.slug
    ORDER BY count DESC, t.name ASC
    LIMIT 12
  `) as { name: string; slug: string; count: number }[];

  return (
    <>
      <section className="hero container">
        <h1>Blog</h1>
        <p className="muted">{tag ? `Filtering by #${tag}` : 'Latest writing'}</p>
      </section>

      <section className="container" style={{ display:'grid', gap:24, gridTemplateColumns:'1fr' }}>
        <div className="grid-auto">
          {posts.map(p => (
            <PostCardCompact key={p.id} title={p.title} slug={p.slug} excerpt={p.excerpt || ''} date={p.published_at || p.updated_at || null} />
          ))}
          {posts.length === 0 ? <p className="muted">No posts yet.</p> : null}
        </div>

        <aside style={{ position:'sticky', top: 84 }}>
          <div className="card">
            <h3 style={{ marginTop:0 }}>Tags</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
              <a className="tag" href="/blog">All</a>
              {topTags.map(t => (
                <a key={t.slug} className="tag" href={`/blog?tag=${encodeURIComponent(t.slug)}`}>#{t.name}</a>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
