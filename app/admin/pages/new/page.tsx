'use client';
import { useState } from 'react';
import MarkdownEditor from '../../../../components/MarkdownEditor';

export default function NewPagePage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft'|'published'>('draft');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, content, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      window.location.href = '/admin/pages';
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>New Page</h1>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-row">
          <label className="label">Title</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div className="form-row">
          <label className="label">Slug (optional)</label>
          <input className="input" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="auto from title if blank" />
        </div>
        <div className="form-row">
          <label className="label">Content (Markdown)</label>
          <MarkdownEditor value={content} onChange={setContent} uniqueId="new-page" />
        </div>
        <div className="form-row">
          <label className="label">Status</label>
          <select className="input" value={status} onChange={e=>setStatus(e.target.value as any)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button className="btn btn-primary" disabled={loading} type="submit">{loading ? '...' : 'Create'}</button>
        {msg && <p className="error">{msg}</p>}
      </form>
    </>
  );
}
