import { NextResponse } from 'next/server';
import { createUser } from '../../../../lib/auth';
import { signToken } from '../../../../lib/jwt';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
    }

    // Guard: allow up to two admins, then close registration
    const c = await sql/*sql*/`SELECT COUNT(*)::int AS n FROM users`;
    if ((c?.[0]?.n ?? 0) >= 2) {
      return NextResponse.json({ ok: false, error: 'registration_closed' }, { status: 403 });
    }

    const user = await createUser(name, email, password);
    if (!user) {
      return NextResponse.json({ ok: false, error: 'exists' }, { status: 409 });
    }

    const token = await signToken({ sub: user.id, email: user.email });

    const res = NextResponse.json({ ok: true, user });
    res.cookies.set('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
