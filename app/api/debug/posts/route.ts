import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = (await sql`
    SELECT id, title, slug, status, published_at, updated_at
    FROM posts
    ORDER BY COALESCE(published_at, updated_at) DESC
    LIMIT 20
  `) as any[];
  return NextResponse.json({ ok: true, rows });
}
