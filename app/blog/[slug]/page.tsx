import { notFound } from 'next/navigation';
import { sql } from '../../../lib/db';
import MarkdownView from '../../../components/MarkdownView';

export const dynamic = 'force-dynamic';

type PostFull = {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  cover_image_url: string | null; published_at: string | null; updated_at?: string | null;
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const rows = (await sql`
    SELECT title, excerpt
    FROM posts
    WHERE LOWER(slug) = LOWER(${params.slug}) AND status = 'published'
    LIMIT 1
  `) as any[];
  if (rows.length === 0) return { title: 'Not found' };
  return { title: rows[0].title, description: rows[0].excerpt || undefined };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const rows = (await sql`
    SELECT id, title, slug, excerpt, content, cover_image_url, published_at, updated_at
    FROM posts
    WHERE LOWER(slug) = LOWER(${params.slug}) AND status = 'published'
    LIMIT 1
  `) as PostFull[];

  if (rows.length === 0) notFound();
  const post = rows[0];

  return (
    <>
      <h1>{post.title}</h1>
      {post.cover_image_url ? (
        <img src={post.cover_image_url} alt="" style={{ width: '100%', borderRadius: 12, margin: '12px 0' }} />
      ) : null}
      <MarkdownView content={post.content} />
    </>
  );
}
