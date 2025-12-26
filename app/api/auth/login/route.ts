import { NextResponse } from 'next/server';
import { verifyUser } from '../../../../lib/auth';
import { signToken } from '../../../../lib/jwt';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
    }

    console.log(`[LOGIN_ATTEMPT] Email: ${email}`);

    const user = await verifyUser(email, password);
    if (!user) {
      return NextResponse.json({ ok: false, error: 'invalid_credentials' }, { status: 401 });
    }

    const payload: any = { sub: user.id, email: user.email };
    if ((user as any)?.role) payload.role = (user as any).role;

    const token = await signToken(payload);

    const res = NextResponse.json({ ok: true, user });
    res.cookies.set('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    
    console.log(`[LOGIN_SUCCESS] User: ${email}`);
    return res;

  } catch (error: any) {
    console.error('[LOGIN_CRASH]', error);
    return NextResponse.json(
      { ok: false, error: 'server_error', details: error.message }, 
      { status: 500 }
    );
  }
}
