'use client';
import { useEffect, useState } from 'react';

type Comment = { id:number; name?:string; message:string; created_at:string };

export default function Comments({ slug }: { slug: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const res = await fetch(`/api/public/comments?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setItems(data.comments || []);
    } catch {}
  }
  useEffect(() => { load(); }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/public/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: name.trim() || undefined, message: msg.trim() })
      });
      if (res.ok) {
        setMsg('');
        await load();
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="comments-wrap">
      <h3 className="sec-title">Comments</h3>
      <div style={{ display:'grid', gap:12 }}>
        {items.map(c => (
          <div key={c.id} className="comment-card">
            <div className="comment-author">{c.name || 'Reader'}</div>
            <div className="comment-time">{new Date(c.created_at).toLocaleString()}</div>
            <div className="comment-body">{c.message}</div>
          </div>
        ))}
        {items.length === 0 ? <p className="sec-sub">Be the first to comment.</p> : null}
      </div>

      <form className="comment-form" onSubmit={submit}>
        <input className="input" placeholder="Your name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <textarea className="input" placeholder="Write a thoughtful comment…" value={msg} onChange={e=>setMsg(e.target.value)} required rows={4} />
        <button className="btn btn-ochre" type="submit" disabled={loading}>{loading ? 'Posting…' : 'Post comment'}</button>
      </form>
    </div>
  );
}
