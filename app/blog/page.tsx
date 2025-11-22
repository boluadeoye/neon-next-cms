import { unstable_noStore as noStore } from 'next/cache';
import { sql } from '../../lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = { id:string; title:string; slug:string; excerpt:string|null; published_at:string|null; updated_at?:string|null };

function mapToCat(slug:string){
  const s = slug.toLowerCase();
  if (s.includes('life')) return 'Life';
  if (s.includes('culture')) return 'Culture';
  if (s.includes('news')) return 'News';
  return 'Essays';
}

export default async function BlogIndex({ searchParams }:{ searchParams?: { cat?: string } }){
  noStore();
  const cat = searchParams?.cat ? String(searchParams.cat) : null;

  const posts = cat
    ? (await sql`
        SELECT p.id, p.title, p.slug, p.excerpt, p.published_at, p.updated_at
        FROM posts p
        LEFT JOIN post_tags pt ON pt.post_id = p.id
        LEFT JOIN tags t ON t.id = pt.tag_id
        WHERE p.status='published' AND (
          (${cat} = 'Essays' AND (t.slug IS NULL OR (LOWER(t.slug) NOT LIKE '%life%' AND LOWER(t.slug) NOT LIKE '%culture%' AND LOWER(t.slug) NOT LIKE '%news%')))
          OR (${cat} <> 'Essays' AND LOWER(t.slug) LIKE ${'%' + cat.toLowerCase() + '%'})
        )
        GROUP BY p.id
        ORDER BY COALESCE(p.published_at, p.updated_at) DESC
        LIMIT 48
      `) as Post[]
    : (await sql`
        SELECT id, title, slug, excerpt, published_at, updated_at
        FROM posts
        WHERE status='published'
        ORDER BY COALESCE(published_at, updated_at) DESC
        LIMIT 48
      `) as Post[];

  const chips = ['Essays','Life','Culture','News'];

  return (
    <>
      <section className="section container">
        <h1 className="sec-title">Blog</h1>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:12 }}>
          {chips.map(c => (
            <a key={c} className="chip" href={c==='Essays' ? '/blog' : `/blog?cat=${encodeURIComponent(c)}`} style={{ background: cat===c ? '#fff' : '#fff' }}>
              {c}
            </a>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '48px' }}>
        <div className="grid-auto">
          {posts.map(p => (
            <a key={p.id} href={`/blog/${p.slug}`} className="compact">
              <h3 style={{ margin:0 }}>{p.title}</h3>
              {p.excerpt ? <p style={{ marginTop:6 }}>{p.excerpt}</p> : null}
              <p style={{ marginTop:8, fontSize:13, color:'var(--muted)' }}>
                {new Date(p.published_at || p.updated_at || '').toLocaleDateString()} • {mapToCat('' /* fallback no tag here */)}
              </p>
            </a>
          ))}
          {posts.length===0 ? <p className="sec-sub">No posts yet.</p> : null}
        </div>
      </section>
    </>
  );
}
