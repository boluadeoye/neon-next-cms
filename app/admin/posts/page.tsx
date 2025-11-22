'use client';
import { useEffect, useState } from 'react';

type Post = { id:string; title:string; slug:string; status:'draft'|'published'; published_at:string|null; updated_at:string };

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
    <div className="admin-card">
      <div className="toolbar">
        <h1 style={{ margin:0 }}>Posts</h1>
        <a className="btn btn-ochre" href="/admin/posts/new">New Post</a>
      </div>
      {msg ? <p className="sec-sub">{msg}</p> : null}
      {loading ? <p className="sec-sub">Loading…</p> : null}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <strong>{p.title}</strong>
                  <span className="sec-sub">/{p.slug}</span>
                </div>
              </td>
              <td>
                <span className={`badge ${p.status === 'published' ? 'ok' : ''}`}>{p.status}</span>
              </td>
              <td>{new Date(p.updated_at).toLocaleDateString()}</td>
              <td style={{ textAlign:'right' }}>
                <a className="btn" href={`/admin/posts/${p.id}`} style={{ marginRight:8 }}>Edit</a>
                <button className="btn btn-ghost" onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr><td colSpan={4} className="sec-sub">No posts yet.</td></tr>
          ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
