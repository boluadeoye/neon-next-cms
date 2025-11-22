'use client';
import { useEffect, useState } from 'react';

type Post = { id: string; title: string; slug: string; status: 'draft'|'published'; published_at: string | null; updated_at: string };

export default function PostsListPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/posts', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load');
      setItems(data.posts || []);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this post?')) return;
    const res = await fetch('/api/admin/posts/' + id, { method: 'DELETE' });
    if (res.ok) load();
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <h1>Posts</h1>
      <p className="help">Create, edit, publish.</p>
      <div style={{ margin: '12px 0 18px' }}>
        <a className="btn btn-primary" href="/admin/posts/new">New Post</a>
      </div>
      {loading ? <p>Loading...</p> : null}
      {msg ? <p className="error">{msg}</p> : null}
      <div className="grid">
        {items.map(p => (
          <div key={p.id} className="card">
            <h3>{p.title}</h3>
            <p>/{p.slug}</p>
            <p>Status: {p.status}{p.published_at ? ` • ${new Date(p.published_at).toLocaleDateString()}` : ''}</p>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <a className="btn" href={`/admin/posts/${p.id}`}>Edit</a>
              <button className="btn" onClick={() => del(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
