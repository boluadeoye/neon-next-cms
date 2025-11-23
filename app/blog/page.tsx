import { unstable_noStore as noStore } from 'next/cache';
import { sql } from '../../lib/db';
import PostCardCompact from '../../components/PostCardCompact';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = { id:string; title:string; slug:string; excerpt:string|null; cover_image_url:string|null; d:string|null; tags:string[]|null };

function pickCategory(tags: string[] | null): 'Essays'|'Life'|'Culture'|'News' {
  const t = (tags || []).map(s => s.toLowerCase());
  if (t.some(s => s.includes('life'))) return 'Life';
  if (t.some(s => s.includes('culture'))) return 'Culture';
  if (t.some(s => s.includes('news'))) return 'News';
  return 'Essays';
}

export default async function BlogIndex({ searchParams }: { searchParams?: { cat?: string; q?: string } }) {
  noStore();
  const cat = (searchParams?.cat || '').trim();
  const q = (searchParams?.q || '').trim();

  const rows = (await sql`
    SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image_url,
           COALESCE(p.published_at, p.updated_at) AS d,
           ARRAY_REMOVE(ARRAY_AGG(t.slug), NULL) AS tags
    FROM posts p
    LEFT JOIN post_tags pt ON pt.post_id = p.id
    LEFT JOIN tags t ON t.id = pt.tag_id
    WHERE p.status='published'
    GROUP BY p.id
    ORDER BY COALESCE(p.published_at, p.updated_at) DESC
    LIMIT 120
  `) as any[];

  // Filter in memory (simple and safe for <=120 posts)
  let posts: Post[] = rows.map(r => ({ ...r, tags: r.tags as string[] | null }));
  if (cat) {
    if (cat === 'Essays') posts = posts.filter(p => !['Life','Culture','News'].includes(pickCategory(p.tags)));
    else posts = posts.filter(p => pickCategory(p.tags) === cat);
  }
  if (q) {
    const low = q.toLowerCase();
    posts = posts.filter(p => p.title.toLowerCase().includes(low) || (p.excerpt || '').toLowerCase().includes(low));
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
              <a key={c}
                 className={`cat-chip ${cat===c || (!cat && c==='Essays') ? 'active' : ''}`}
                 href={c==='Essays' ? '/blog' : `/blog?cat=${encodeURIComponent(c)}`}>
                {c}
              </a>
            ))}
          </div>

          <form className="search-wrap" action="/blog" method="get">
            <input className="search" name="q" placeholder="Search posts…" defaultValue={q} />
            {cat && <input type="hidden" name="cat" value={cat} />}
            <button className="btn btn-ghost" type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="section container">
        <div className="grid-auto">
          {posts.map(p => (
            <PostCardCompact
              key={p.id}
              title={p.title}
              slug={p.slug}
              excerpt={p.excerpt}
              date={p.d || undefined}
              cover={p.cover_image_url || undefined}
            />
          ))}
          {posts.length === 0 ? <p className="sec-sub">No posts match your filters.</p> : null}
        </div>
      </section>
    </>
  );
}
