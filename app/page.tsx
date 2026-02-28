import { unstable_noStore as noStore } from 'next/cache';
import { sql } from '../lib/db';
import HomeMasthead from '../components/HomeMasthead';
import HomeIntroCard from '../components/HomeIntroCard';
import PostCardFeatured from '../components/PostCardFeatured';
import NewsMiniList from '../components/NewsMiniList';
import PostImage from '../components/PostImage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type Post = { id:string; title:string; slug:string; excerpt:string|null; cover_image_url:string|null; d:string|null };

export default async function Home(){
  noStore();

  const featured = (await sql`
    SELECT id, title, slug, excerpt, cover_image_url, COALESCE(published_at, updated_at) AS d
    FROM posts WHERE status='published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 6
  `) as Post[];

  const latest = (await sql`
    SELECT id, title, slug, excerpt, cover_image_url, COALESCE(published_at, updated_at) AS d
    FROM posts WHERE status='published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 9
  `) as Post[];

  const recent = latest.slice(0,5);

  return (
    <>
      <HomeMasthead />
      <HomeIntroCard />

      <section className="section container">
        <div className="home-grid">
          {/* Main feed */}
          <div>
            <h2 className="sec-title">Featured</h2>
            <p className="sec-sub">Hand‑picked highlights</p>
            <div className="h-scroll" style={{ marginTop:12 }}>
              {featured.map(p => (
                <PostCardFeatured key={p.id} title={p.title} slug={p.slug} cover={p.cover_image_url} date={p.d} />
              ))}
            </div>

            <h2 className="sec-title" style={{ marginTop: 22 }}>Latest</h2>
            <p className="sec-sub">Fresh from the blog</p>
            <div style={{ display:'grid', gap:16 }}>
              {latest.map(p => (
                <div key={p.id} className="post-card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f0f0f0' }}>
                    <PostImage src={p.cover_image_url} alt={p.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="post-body">
                    <h3 className="post-title"><a href={`/blog/${p.slug}`}>{p.title}</a></h3>
                    <div className="post-meta">{p.d ? new Date(p.d).toLocaleDateString() : ''}</div>
                    {p.excerpt ? <p className="sec-sub" style={{ marginTop: 6 }}>{p.excerpt}</p> : null}
                  </div>
                </div>
              ))}
              {latest.length === 0 ? <p className="sec-sub">No posts yet.</p> : null}
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="widget">
              <h3>Recent Posts</h3>
              <div className="recent-list">
                {recent.map(p => (
                  <div key={p.id} className="recent-item">
                    <div className="recent-thumb" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                      <PostImage src={p.cover_image_url} alt={p.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <a href={`/blog/${p.slug}`}>{p.title}</a>
                      <div className="post-meta">{p.d ? new Date(p.d).toLocaleDateString() : ''}</div>
                    </div>
                  </div>
                ))}
                {recent.length === 0 ? <p className="sec-sub">No posts yet.</p> : null}
              </div>
            </div>
            <NewsMiniList />
          </aside>
        </div>
      </section>
    </>
  );
}
