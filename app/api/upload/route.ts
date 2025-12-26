import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const folder = (form.get('folder') as string) || 'covers';

    if (!file) {
      return NextResponse.json({ ok: false, error: 'no_file' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ ok: false, error: 'not_image' }, { status: 400 });
    }

    const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(key, file, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({ ok: true, url: blob.url, pathname: blob.pathname });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'upload_failed' }, { status: 500 });
  }
}
