import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await sql<{ now: string; version: string }>`
      SELECT now() AS now, version() AS version
    `;
    const { now, version } = rows[0];
    return NextResponse.json({ ok: true, now, version });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
