import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') || form.get('image'); // handle both keys
    if (!file || typeof file === 'string') {
      return NextResponse.json({ ok: false, error: 'No file' }, { status: 400 });
    }
    const f = file as File;
    const name = f.name?.replace(/\s+/g, '-') || 'upload.bin';
    const blob = await put(`images/${Date.now()}-${name}`, f, {
      access: 'public',
      contentType: f.type || 'application/octet-stream',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Upload failed' }, { status: 500 });
  }
}
