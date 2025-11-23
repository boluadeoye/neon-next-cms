import { unstable_noStore as noStore } from 'next/cache';
import { sql } from '../../lib/db';
import PostCardCompact from '../../components/PostCardCompact';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = { id:string; title:string; slug:string; excerpt:string|null; cover_image_url:string|null; d:string|null; tags:string[]|null };

export default async function PortfolioPage(){
  noStore();
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
    LIMIT 24
  `) as any[];

  let posts: Post[] = rows.map(r => ({ ...r, tags: r.tags as string[]|null }));
  const portfolio = posts.filter(p => (p.tags||[]).some(s => (s||'').toLowerCase().includes('portfolio')));
  if (portfolio.length) posts = portfolio;

  return (
    <>
      <section className="section container">
        <h1 className="sec-title">Portfolio</h1>
        <p className="sec-sub">Selected writing and work</p>
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
          {posts.length === 0 ? <p className="sec-sub">No items yet.</p> : null}
        </div>
      </section>
    </>
  );
}
