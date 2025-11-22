'use client';
import { useEffect, useState } from 'react';

type C = { id:string; name:string; message:string; created_at:string };

export default function Comments({ slug }: { slug: string }) {
  const [items, setItems] = useState<C[]>([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/public/comments?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
    const data = await res.json();
    if (res.ok) setItems(data.comments || []);
    setLoading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('/api/public/comments', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ slug, name, message: msg })
    });
    const data = await res.json();
    if (res.ok) { setName(''); setMsg(''); setStatus('Posted!'); load(); }
    else setStatus(data?.error || 'Failed');
  }

  useEffect(() => { load(); }, [slug]);

  return (
    <div className="comments-wrap">
      <h3 style={{ margin:'0 0 8px' }}>Comments</h3>
      {loading ? <p className="sec-sub">Loading…</p> : null}
      <div style={{ display:'grid', gap:10, marginBottom:12 }}>
        {items.map(c => (
          <div key={c.id} className="comment-card">
            <div className="comment-author">{c.name}</div>
            <div className="comment-time">{new Date(c.created_at).toLocaleString()}</div>
            <div className="comment-body">{c.message}</div>
          </div>
        ))}
        {items.length === 0 && !loading ? <p className="sec-sub">Be the first to comment.</p> : null}
      </div>

      <form className="comment-form" onSubmit={submit}>
        <input className="input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required />
        <textarea className="input" placeholder="Write a thoughtful comment…" value={msg} onChange={e=>setMsg(e.target.value)} required rows={4} />
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-ochre" type="submit">Post comment</button>
          {status ? <span className="sec-sub" style={{ marginLeft:8 }}>{status}</span> : null}
        </div>
      </form>
    </div>
  );
}
