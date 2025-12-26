'use client';

import { useRef, useState } from 'react';

export default function CoverField({
  name = 'cover_image_url',
  defaultValue = '',
  label = 'Post cover'
}: {
  name?: string;
  defaultValue?: string;
  label?: string;
}) {
  const [value, setValue] = useState<string>(defaultValue || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErr('Please choose an image'); return; }
    if (file.size > 8 * 1024 * 1024) { setErr('Image is too large (max 8MB)'); return; }
    setErr(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'covers');

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data?.ok && data.url) {
        setValue(data.url);
      } else {
        setErr(data?.error || 'Upload failed');
      }
    } catch {
      setErr('Upload failed');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function triggerPick() {
    fileRef.current?.click();
  }

  function clearCover() {
    setValue('');
    setErr(null);
  }

  return (
    <div className="cover-field">
      <label className="label" style={{ display:'block', fontWeight:700 }}>{label}</label>

      {/* Hidden value for form submit */}
      <input type="hidden" name={name} value={value} />

      {/* Preview or placeholder */}
      {value ? (
        <div className="cover-preview">
          <img src={value} alt="Post cover preview" />
        </div>
      ) : (
        <div className="cover-placeholder">No cover selected</div>
      )}

      <div className="cover-actions">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePick}
          style={{ display:'none' }}
        />
        <button type="button" className="btn btn-ochre" onClick={triggerPick} disabled={busy}>
          {busy ? 'Uploading…' : (value ? 'Change image' : 'Choose image')}
        </button>
        {value ? (
          <button type="button" className="btn btn-ghost" onClick={clearCover} disabled={busy}>
            Remove
          </button>
        ) : null}
      </div>

      <div className="cover-manual">
        <input
          className="input"
          placeholder="Or paste image URL"
          value={value}
          onChange={(e)=>setValue(e.target.value)}
        />
      </div>

      {err ? <p className="sec-sub" style={{ color:'#b00020', marginTop:6 }}>{err}</p> : null}

      <style jsx>{`
        .cover-field { display: grid; gap: 8px; }
        .cover-placeholder {
          border:1px solid rgba(0,0,0,.08); border-radius: 12px; background:#f6f8fb;
          color:#6b7485; padding: 24px; text-align:center;
        }
        .cover-preview img {
          display:block; width:100%; height:auto; border-radius: 12px; border:1px solid rgba(0,0,0,.08);
          background:#f6f8fb; max-height: 320px; object-fit: cover;
        }
        .cover-actions { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
        .cover-manual { margin-top: 2px; }
      `}</style>
    </div>
  );
}
