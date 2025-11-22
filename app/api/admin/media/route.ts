import { NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';
import { getSession } from '../../../../lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return unauthorized();

  const res = await list({ prefix: 'images/', token: process.env.BLOB_READ_WRITE_TOKEN });
  return NextResponse.json({ ok: true, blobs: res.blobs });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return unauthorized();

  const url = new URL(req.url);
  const target = url.searchParams.get('url');
  if (!target) return NextResponse.json({ ok: false, error: 'Missing ?url=' }, { status: 400 });

  await del(target, { token: process.env.BLOB_READ_WRITE_TOKEN });
  return NextResponse.json({ ok: true });
}
