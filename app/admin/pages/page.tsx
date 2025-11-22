'use client';
import { useEffect, useState } from 'react';

type Page = { id:string; title:string; slug:string; status:'draft'|'published'; updated_at:string; published_at:string|null };

export default function PagesListPage() {
  const [items, setItems] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/pages', { cache: 'no-store' });
    const data = await res.json();
    setItems(data.pages || []);
    setLoading(false);
  }

  async function del(id: string) {
    if (!confirm('Delete this page?')) return;
    const res = await fetch('/api/admin/pages/' + id, { method: 'DELETE' });
    if (res.ok) load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="admin-card">
      <div className="toolbar">
        <h1 style={{ margin:0 }}>Pages</h1>
        <a className="btn btn-ochre" href="/admin/pages/new">New Page</a>
      </div>
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
              <td><span className={`badge ${p.status === 'published' ? 'ok' : ''}`}>{p.status}</span></td>
              <td>{new Date(p.updated_at).toLocaleDateString()}</td>
              <td style={{ textAlign:'right' }}>
                <a className="btn" href={`/admin/pages/${p.id}`} style={{ marginRight:8 }}>Edit</a>
                <button className="btn btn-ghost" onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {items.length === 0 ? <tr><td colSpan={4} className="sec-sub">No pages yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
