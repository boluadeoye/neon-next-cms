import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { sql } from '../../../lib/db';
import MarkdownView from '../../../components/MarkdownView';
import ProgressBar from '../../../components/ProgressBar';
import TagChip from '../../../components/TagChip';
import { extractHeadings } from '../../../lib/md';
import { readingTime } from '../../../lib/reading';
import LikeButton from '../../../components/LikeButton';
import ShareBar from '../../../components/ShareBar';
import Comments from '../../../components/Comments';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PostFull = {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  cover_image_url: string | null; published_at: string | null; updated_at: string | null;
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  noStore();

  const rows = (await sql`
    SELECT id, title, slug, excerpt, content, cover_image_url, published_at, updated_at
    FROM posts
    WHERE LOWER(slug) = LOWER(${params.slug}) AND status = 'published'
    LIMIT 1
  `) as PostFull[];
  if (rows.length === 0) notFound();

  const post = rows[0];
  const date = post.published_at || post.updated_at || null;
  const rt = readingTime(post.content);

  const tags = (await sql`
    SELECT t.name, t.slug
    FROM tags t
    JOIN post_tags pt ON pt.tag_id = t.id
    WHERE pt.post_id = ${post.id}
    ORDER BY t.name ASC
  `) as { name: string; slug: string }[];

  const dRow = (await sql`SELECT COALESCE(published_at, updated_at) AS d FROM posts WHERE id = ${post.id} LIMIT 1`) as { d: string }[];
  const d = dRow[0]?.d;

  const newer = (await sql`
    SELECT title, slug FROM posts
    WHERE status='published' AND COALESCE(published_at, updated_at) > ${d}
    ORDER BY COALESCE(published_at, updated_at) ASC
    LIMIT 1
  `) as { title: string; slug: string }[];

  const older = (await sql`
    SELECT title, slug FROM posts
    WHERE status='published' AND COALESCE(published_at, updated_at) < ${d}
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 1
  `) as { title: string; slug: string }[];

  const headings = extractHeadings(post.content).filter(h => h.level <= 3);
  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${post.slug}`;

  return (
    <>
      <ProgressBar />

      {/* Compact hero */}
      <section className="post-hero">
        <div className="article">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            {date ? new Date(date).toLocaleDateString() : ''} • {rt.minutes} min read
          </div>
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt=""
              style={{ width:'100%', borderRadius: 16, border: '1px solid rgba(2,6,23,.08)', marginTop:12 }}
            />
          ) : null}
          <div className="actions-wrap">
            <div className="actions-bar">
              <LikeButton slug={post.slug} />
              <ShareBar title={post.title} url={fullUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* Compact grid: article + TOC */}
      <section className="container">
        <div className="post-grid">
          <article className="article">
            <MarkdownView content={post.content} />

            {tags?.length ? (
              <>
                <hr className="div" />
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {tags.map(t => <TagChip key={t.slug} name={t.name} slug={t.slug} />)}
                </div>
              </>
            ) : null}

            <hr className="div" />
            <div style={{ display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
              <div>
                {newer[0] ? <a className="btn" href={`/blog/${encodeURIComponent(newer[0].slug)}`}>← {newer[0].title}</a> : <span className="muted">No newer post</span>}
              </div>
              <div>
                {older[0] ? <a className="btn" href={`/blog/${encodeURIComponent(older[0].slug)}`}>{older[0].title} →</a> : <span className="muted">No older post</span>}
              </div>
            </div>

            <Comments slug={post.slug} />
          </article>

          <aside className="toc" aria-label="Table of contents">
            <h3>Contents</h3>
            <ul>
              {headings.length === 0 ? <li className="muted" style={{ padding:'6px 8px' }}>No headings</li> : null}
              {headings.map((h) => (
                <li key={h.id}>
                  <a className={`h${h.level}`} href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
