import { unstable_noStore as noStore } from 'next/cache';
import { sql } from '../../lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  d: string | null;
  tags: string[] | null;
};

function pickCategory(tags: string[] | null): string {
  const t = (tags || []).map(s => s.toLowerCase());
  if (t.some(s => s.includes('life'))) return 'Life';
  if (t.some(s => s.includes('culture'))) return 'Culture';
  if (t.some(s => s.includes('news'))) return 'News';
  return 'Essays';
}

export default async function BlogIndex({ searchParams }: { searchParams?: { cat?: string; q?: string } }) {
  noStore();
  const cat = searchParams?.cat ? String(searchParams.cat) : null;
  const q = searchParams?.q ? String(searchParams.q).trim() : null;

  const rows = (await sql`
    SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image_url,
           COALESCE(p.published_at, p.updated_at) AS d,
           ARRAY_REMOVE(ARRAY_AGG(t.name), NULL) AS tags
    FROM posts p
    LEFT JOIN post_tags pt ON pt.post_id = p.id
    LEFT JOIN tags t ON t.id = pt.tag_id
    WHERE p.status='published'
    GROUP BY p.id
    ORDER BY COALESCE(p.published_at, p.updated_at) DESC
    LIMIT 120
  `) as any[];

  // Filter by category and q on server
  let posts: Post[] = rows.map(r => ({ ...r, tags: r.tags as string[] | null }));
  if (cat && cat !== 'Essays') {
    posts = posts.filter(p => pickCategory(p.tags) === cat);
  } else if (cat === 'Essays') {
    posts = posts.filter(p => !['Life','Culture','News'].includes(pickCategory(p.tags)));
  }
  if (q) {
    const low = q.toLowerCase();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(low) ||
      (p.excerpt || '').toLowerCase().includes(low)
    );
  }

  const chips = ['Essays','Life','Culture','News'];

  return (
    <>
      <section className="section container">
        <div className="blog-hero">
          <h1>Blog</h1>
          <p>Essays, notes, and stories.</p>
          <div className="cat-bar">
            {chips.map(c => (
              <a key={c} className={`cat-chip ${cat===c ? 'active' : ''}`} href={c==='Essays' ? '/blog' : `/blog?cat=${encodeURIComponent(c)}`}>{c}</a>
            ))}
          </div>
          <form className="search-wrap" action="/blog" method="get">
            <input className="search" name="q" placeholder="Search posts…" defaultValue={q || ''} />
            {cat ? <input type="hidden" name="cat" value={cat} /> : null}
            <button className="btn" type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="section container">
        <div className="article-grid">
          {posts.map(p => {
            const category = pickCategory(p.tags);
            const date = p.d ? new Date(p.d).toLocaleDateString() : '';
            return (
              <a key={p.id} href={`/blog/${p.slug}`} className="article-card">
                {p.cover_image_url ? <img src={p.cover_image_url} alt="" className="article-media" /> : <div className="article-media" style={{ background:'#eef2f7' }} />}
                <div className="article-body">
                  <h3 className="article-title">{p.title}</h3>
                  {p.excerpt ? <p className="article-ex">{p.excerpt}</p> : null}
                  <div className="article-meta">
                    <span className="pill">{category}</span>
                    {date ? <span>{date}</span> : null}
                  </div>
                </div>
              </a>
            );
          })}
          {posts.length === 0 ? <p className="sec-sub">No posts match your filters.</p> : null}
        </div>
      </section>
    </>
  );
}
