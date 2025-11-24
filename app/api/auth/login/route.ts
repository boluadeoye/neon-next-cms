import { NextResponse } from 'next/server';
import { verifyUser } from '../../../../lib/auth';
import { signToken } from '../../../../lib/jwt';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
    }

    const user = await verifyUser(email, password);
    if (!user) {
      return NextResponse.json({ ok: false, error: 'invalid_credentials' }, { status: 401 });
    }

    // Build token payload without assuming a role field
    const payload: any = { sub: user.id, email: user.email };
    const maybeRole = (user as any)?.role;
    if (maybeRole) payload.role = maybeRole;

    const token = await signToken(payload);

    const res = NextResponse.json({ ok: true, user });
    res.cookies.set('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
