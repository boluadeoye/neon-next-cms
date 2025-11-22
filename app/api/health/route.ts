import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type HealthRow = { now: string; version: string };

export async function GET() {
  try {
    // cast now() to text to avoid type ambiguity
    const rows = (await sql`
      SELECT now()::text AS now, version() AS version
    `) as HealthRow[];

    const { now, version } = rows?.[0] ?? { now: '', version: '' };
    return NextResponse.json({ ok: true, now, version });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
