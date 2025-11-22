import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../lib/jwt';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type DbUser = { id: string; email: string; name: string | null; role: string };

export async function GET() {
  try {
    const token = cookies().get('session')?.value;
    if (!token) return NextResponse.json({ ok: true, user: null });

    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ ok: true, user: null });

    const rows = (await sql`
      SELECT id, email, name, role
      FROM users
      WHERE id = ${payload.sub}
      LIMIT 1
    `) as DbUser[];

    const user = rows[0] || null;
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error' }, { status: 500 });
  }
}
