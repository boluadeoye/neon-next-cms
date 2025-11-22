'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MarkdownEditor from '../../../../components/MarkdownEditor';

type Page = {
  id: string; title: string; slug: string; content: string;
  status: 'draft' | 'published'; published_at: string | null;
};

export default function EditPagePage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/pages/' + id, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setPage(data.page);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!page) return;
    setMsg(null);
    const res = await fetch('/api/admin/pages/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page)
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data?.error || 'Save failed');
    setMsg('Saved!');
    setPage(data.page);
  }

  async function togglePublish() {
    if (!page) return;
    const res = await fetch('/api/admin/pages/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: page.status === 'published' ? 'draft' : 'published' })
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data?.error || 'Update failed');
    setPage({ ...page, status: data.page.status, published_at: data.page.published_at });
  }

  if (loading) return <p>Loading...</p>;
  if (!page) return <p className="error">{msg || 'Not found'}</p>;

  return (
    <>
      <h1>Edit Page</h1>
      {msg && <p className="help">{msg}</p>}
      <form className="form" onSubmit={save}>
        <div className="form-row">
          <label className="label">Title</label>
          <input className="input" value={page.title} onChange={e=>setPage({ ...page, title: e.target.value })} />
        </div>
        <div className="form-row">
          <label className="label">Slug</label>
          <input className="input" value={page.slug} onChange={e=>setPage({ ...page, slug: e.target.value })} />
        </div>
        <div className="form-row">
          <label className="label">Content (Markdown)</label>
          <MarkdownEditor value={page.content} onChange={(v)=>setPage({ ...page!, content: v })} uniqueId={String(id)} />
        </div>
        <div className="form-row" style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" type="submit">Save</button>
          <button className="btn" type="button" onClick={togglePublish}>
            {page.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          <a className="btn" href="/admin/pages">Back</a>
        </div>
      </form>
    </>
  );
}
