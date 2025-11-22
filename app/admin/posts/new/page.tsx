'use client';
import { useState } from 'react';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft'|'published'>('draft');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, excerpt, content, tags, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      window.location.href = '/admin/posts';
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>New Post</h1>
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
          <label className="label">Excerpt (optional)</label>
          <input className="input" value={excerpt} onChange={e=>setExcerpt(e.target.value)} />
        </div>
        <div className="form-row">
          <label className="label">Content</label>
          <textarea className="input" rows={10} value={content} onChange={e=>setContent(e.target.value)} required />
        </div>
        <div className="form-row">
          <label className="label">Tags (comma separated)</label>
          <input className="input" value={tags} onChange={e=>setTags(e.target.value)} placeholder="news, updates" />
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
