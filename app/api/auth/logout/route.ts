import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function clearCookie(url: string) {
  const res = NextResponse.redirect(new URL('/login', url));
  res.cookies.set('session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });
  return res;
}

export async function POST(req: Request) {
  return clearCookie(req.url);
}

export async function GET(req: Request) {
  return clearCookie(req.url);
}
