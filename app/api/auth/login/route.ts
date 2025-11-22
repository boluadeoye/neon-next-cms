import { NextResponse } from 'next/server';
import { verifyUser } from '../../../../lib/auth';
import { signToken } from '../../../../lib/jwt';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 });
    }

    const user = await verifyUser(String(email).toLowerCase(), String(password));
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ sub: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({ ok: true, user });
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
