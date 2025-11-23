import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { sql } from '../../../lib/db';
import MarkdownView from '../../../components/MarkdownView';
import ProgressBar from '../../../components/ProgressBar';
import { extractHeadings } from '../../../lib/md';
import { readingTime } from '../../../lib/reading';
import LikeButton from '../../../components/LikeButton';
import ShareBar from '../../../components/ShareBar';

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
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || '';
  const fullUrl = `${base}/blog/${post.slug}`;

  return (
    <>
      <ProgressBar />

      {/* Hero (centered) */}
      <section className="post-hero">
        <div className="container-narrow">
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

      {/* Content + TOC */}
      <section className="container post-bottom-pad">
        <div className="post-grid" style={{ width:'100%' }}>
          <article className="container-narrow" style={{ maxWidth:'min(var(--content), 100vw - 32px)' }}>
            <MarkdownView content={post.content} />

            {/* Tag chips */}
            {tags?.length ? (
              <>
                <hr className="div" />
                <div className="meta-row">
                  {tags.map(t => (
                    <a key={t.slug} className="tag-chip" href={`/blog?q=${encodeURIComponent(t.slug)}`}>#{t.name}</a>
                  ))}
                </div>
              </>
            ) : null}

            {/* Prev / Next chips */}
            <hr className="div" />
            <div className="prevnext">
              <div>
                {newer[0] ? (
                  <a className="chip-link" href={`/blog/${encodeURIComponent(newer[0].slug)}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.5 19l-7-7 7-7"/></svg>
                    <span>{newer[0].title}</span>
                  </a>
                ) : (
                  <span className="chip-link disabled" aria-disabled="true">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.5 19l-7-7 7-7"/></svg>
                    <span>No newer post</span>
                  </span>
                )}
              </div>
              <div>
                {older[0] ? (
                  <a className="chip-link" href={`/blog/${encodeURIComponent(older[0].slug)}`}>
                    <span>{older[0].title}</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.5 5l7 7-7 7"/></svg>
                  </a>
                ) : (
                  <span className="chip-link disabled" aria-disabled="true">
                    <span>No older post</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.5 5l7 7-7 7"/></svg>
                  </span>
                )}
              </div>
            </div>
          </article>

          {/* TOC */}
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
