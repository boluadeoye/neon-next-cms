'use client';
import { useEffect, useState } from 'react';

type BlobItem = { url: string; pathname: string; size: number; uploadedAt: string };

export default function MediaPage() {
  const [items, setItems] = useState<BlobItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/media', { cache: 'no-store' });
    const data = await res.json();
    setItems(data.blobs || []);
    setLoading(false);
  }

  async function remove(url: string) {
    if (!confirm('Delete this file?')) return;
    const res = await fetch('/api/admin/media?url=' + encodeURIComponent(url), { method: 'DELETE' });
    if (res.ok) load();
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <h1>Media</h1>
      {loading ? <p>Loading...</p> : null}
      <div className="grid">
        {items.map((b) => (
          <div key={b.url} className="card">
            <img src={b.url} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 8, maxHeight: 160, objectFit: 'cover' }} />
            <p style={{ wordBreak: 'break-all' }}>{b.pathname.replace('images/','')}</p>
            <p className="help">{(b.size/1024).toFixed(1)} KB</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <a className="btn" href={b.url} target="_blank">Open</a>
              <button className="btn" onClick={() => navigator.clipboard?.writeText(b.url)}>Copy URL</button>
              <button className="btn" onClick={() => remove(b.url)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
