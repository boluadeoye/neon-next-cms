import { sql } from '../lib/db';

export default async function Home() {
  const siteName = (await sql`SELECT value FROM settings WHERE key = 'site_name' LIMIT 1`) as any[];
  const desc = (await sql`SELECT value FROM settings WHERE key = 'site_description' LIMIT 1`) as any[];

  const featured = (await sql`
    SELECT id, title, slug, excerpt, COALESCE(published_at, updated_at) AS d
    FROM posts
    WHERE status='published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 3
  `) as { id: string; title: string; slug: string; excerpt: string | null; d: string | null }[];

  const name = siteName[0]?.value ?? 'My Site';
  const description = desc[0]?.value ?? 'Writing, ideas, and updates.';

  return (
    <>
      <section className="hero container-narrow">
        <h1>{String(name)}</h1>
        <p>{String(description)}</p>
        <a className="btn btn-primary" href="/blog">Read the blog</a>
      </section>

      <section className="container grid" style={{ gap: 16, marginBottom: 48 }}>
        {featured.map(f => (
          <a key={f.id} className="card" href={`/blog/${encodeURIComponent(f.slug)}`}>
            <h3 style={{ margin: 0 }}>{f.title}</h3>
            {f.excerpt ? <p className="muted" style={{ marginTop: 8 }}>{f.excerpt}</p> : null}
            {f.d ? <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>{new Date(f.d).toLocaleDateString()}</p> : null}
          </a>
        ))}
      </section>
    </>
  );
}
