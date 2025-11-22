import { unstable_noStore as noStore } from 'next/cache';
import { sql } from '../lib/db';
import HeroEditorial from '../components/HeroEditorial';
import AboutWriterCard from '../components/AboutWriterCard';
import PostCardFeatured from '../components/PostCardFeatured';
import PostCardCompact from '../components/PostCardCompact';
import NewsSection from '../components/NewsSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = { id:string; title:string; slug:string; excerpt:string|null; cover_image_url:string|null; d:string|null };

export default async function Home(){
  noStore();

  const featured = (await sql`
    SELECT id, title, slug, excerpt, cover_image_url, COALESCE(published_at, updated_at) AS d
    FROM posts
    WHERE status='published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 6
  `) as Post[];

  const latest = (await sql`
    SELECT id, title, slug, excerpt, cover_image_url, COALESCE(published_at, updated_at) AS d
    FROM posts
    WHERE status='published'
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 9
  `) as Post[];

  return (
    <>
      <HeroEditorial />
      <AboutWriterCard />

      <section className="section container">
        <h2 className="sec-title">Featured</h2>
        <p className="sec-sub">Hand-picked highlights</p>
        <div className="h-scroll" style={{ marginTop:12 }}>
          {featured.map(p => (
            <PostCardFeatured key={p.id} title={p.title} slug={p.slug} cover={p.cover_image_url||undefined} date={p.d||undefined} />
          ))}
        </div>
      </section>

      <section className="section container">
        <h2 className="sec-title">Latest</h2>
        <p className="sec-sub">Fresh from the blog</p>
        <div className="grid-auto" style={{ marginTop:12 }}>
          {latest.map(p => (
            <PostCardCompact
              key={p.id}
              title={p.title}
              slug={p.slug}
              excerpt={p.excerpt}
              date={p.d || undefined}
              cover={p.cover_image_url || undefined}
            />
          ))}
        </div>
      </section>

      <NewsSection />
    </>
  );
}
