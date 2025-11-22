import { notFound } from 'next/navigation';
import { sql } from '../../lib/db';
import MarkdownView from '../../components/MarkdownView';

export const dynamic = 'force-dynamic';

const RESERVED = new Set(['api','admin','login','register','blog','_next','favicon.ico','robots.txt','sitemap.xml']);

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (RESERVED.has(params.slug)) return { title: 'Not found' };
  const rows = (await sql`
    SELECT title
    FROM pages
    WHERE slug = ${params.slug} AND status = 'published'
    LIMIT 1
  `) as any[];
  if (rows.length === 0) return { title: 'Not found' };
  return { title: rows[0].title };
}

export default async function SitePage({ params }: { params: { slug: string } }) {
  if (RESERVED.has(params.slug)) notFound();

  const rows = (await sql`
    SELECT title, content
    FROM pages
    WHERE slug = ${params.slug} AND status = 'published'
    LIMIT 1
  `) as any[];

  if (rows.length === 0) notFound();
  const page = rows[0];

  return (
    <>
      <h1>{page.title}</h1>
      <MarkdownView content={page.content} />
    </>
  );
}
