import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { createUser } from '../../../../lib/auth';
import { signToken } from '../../../../lib/jwt';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 });
    }

    // LIMIT: allow up to TWO admins only
    const rows = (await sql`SELECT COUNT(*)::int AS c FROM users WHERE role = 'admin'`) as { c: number }[];
    const adminCount = rows?.[0]?.c ?? 0;
    if (adminCount >= 2) {
      return NextResponse.json({ ok: false, error: 'Registration closed: 2 admins already created' }, { status: 403 });
    }

    const user = await createUser(String(email).toLowerCase(), String(name || ''), String(password));
    const token = await signToken({ sub: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
    res.cookies.set('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error' }, { status: 500 });
  }
}
