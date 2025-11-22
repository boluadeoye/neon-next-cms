import { sql } from '../../lib/db';

export const dynamic = 'force-dynamic';

type Post = { id: string; title: string; slug: string; excerpt: string | null; published_at: string | null; updated_at?: string };

export default async function BlogIndex() {
  const rows = (await sql`
    SELECT id, title, slug, excerpt, published_at, updated_at
    FROM posts
    WHERE status = 'published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 20
  `) as Post[];

  return (
    <>
      <h1>Blog</h1>
      <div className="grid">
        {rows.map((p) => (
          <a key={p.id} className="card" href={`/blog/${p.slug}`}>
            <h3>{p.title}</h3>
            <p>{p.excerpt || ''}</p>
            <p style={{ marginTop: 8, opacity: .8 }}>
              {(p.published_at || p.updated_at) ? new Date(p.published_at || p.updated_at!).toLocaleDateString() : ''}
            </p>
          </a>
        ))}
      </div>
    </>
  );
}
