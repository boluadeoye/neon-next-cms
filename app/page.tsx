import { sql } from '../lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import HeroCard from '../components/HeroCard';
import Reveal from '../components/Reveal';
import PostCardFeatured from '../components/PostCardFeatured';
import PostCardCompact from '../components/PostCardCompact';
import ServiceCard from '../components/ServiceCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  cover_image_url: string | null; d: string | null;
};

export default async function Home() {
  noStore(); // prevent SSG/ISR caching

  const featured = (await sql`
    SELECT id, title, slug, excerpt, content, cover_image_url, COALESCE(published_at, updated_at) AS d
    FROM posts
    WHERE status='published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 6
  `) as Post[];

  const latest = (await sql`
    SELECT id, title, slug, excerpt, content, cover_image_url, COALESCE(published_at, updated_at) AS d
    FROM posts
    WHERE status='published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 9
  `) as Post[];

  return (
    <>
      <HeroCard />

      <section className="section container">
        <div className="sec-head">
          <h2 className="sec-title">Featured</h2>
          <p className="sec-sub">Hand-picked highlights</p>
        </div>
        <Reveal>
          <div className="h-scroll">
            {featured.map(p => (
              <PostCardFeatured key={p.id} title={p.title} slug={p.slug} excerpt={p.excerpt} cover={p.cover_image_url || undefined} date={p.d || undefined} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section container">
        <div className="sec-head">
          <h2 className="sec-title">Latest</h2>
          <p className="sec-sub">Fresh from the blog</p>
        </div>
        <div className="grid-auto">
          {latest.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <PostCardCompact title={p.title} slug={p.slug} excerpt={p.excerpt} date={p.d || undefined} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <div className="cta" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
            <div>
              <h3 style={{ margin:'0 0 6px' }}>Explore more stories</h3>
              <p className="sec-sub" style={{ margin:0 }}>Deep dives, notes, and experiments</p>
            </div>
            <a className="btn btn-primary" href="/blog">Go to Blog</a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
