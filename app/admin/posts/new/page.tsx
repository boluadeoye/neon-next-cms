'use client';
import { useState } from 'react';
import MarkdownEditor from '../../../../components/MarkdownEditor';

const CATS = ['Essays','Life','Culture','News'] as const;
type Cat = typeof CATS[number];

export default function NewPostPage() {
  const [title, setTitle] = useState(''); const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState(''); const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); const [category, setCategory] = useState<Cat>('Essays');
  const [status, setStatus] = useState<'draft'|'published'>('draft');
  const [msg, setMsg] = useState<string | null>(null); const [loading, setLoading] = useState(false);

  function mergeCategoryIntoTags(cat: Cat, raw: string) {
    const arr = raw.split(',').map(s=>s.trim()).filter(Boolean).map(s=>s.toLowerCase());
    const c = cat.toLowerCase();
    if (!arr.includes(c)) arr.unshift(c);
    return Array.from(new Set(arr)).join(', ');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg(null);
    try {
      const tagsOut = mergeCategoryIntoTags(category, tags);
      const res = await fetch('/api/admin/posts', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ title, slug, excerpt, content, tags: tagsOut, status })
      });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || 'Failed');
      window.location.href = '/admin/posts';
    } catch (e:any) { setMsg(e.message); } finally { setLoading(false); }
  }

  return (
    <div className="admin-card">
      <h1 style={{ marginTop:0 }}>New Post</h1>
      {msg && <p className="sec-sub">{msg}</p>}
      <form className="form" onSubmit={onSubmit}>
        <div className="form-row"><label className="label">Title</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} required /></div>
        <div className="form-row"><label className="label">Slug (optional)</label><input className="input" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="auto from title if blank" /></div>
        <div className="form-row"><label className="label">Excerpt</label><input className="input" value={excerpt} onChange={e=>setExcerpt(e.target.value)} /></div>
        <div className="form-row"><label className="label">Content</label><MarkdownEditor value={content} onChange={setContent} uniqueId="new-post" /></div>

        <div className="form-row">
          <label className="label">Category</label>
          <select className="input" value={category} onChange={e=>setCategory(e.target.value as Cat)}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <p className="help">We’ll add this as a tag automatically (e.g., “life”).</p>
        </div>

        <div className="form-row">
          <label className="label">Extra Tags (comma separated)</label>
          <input className="input" value={tags} onChange={e=>setTags(e.target.value)} placeholder="portfolio, featured" />
        </div>

        <div className="form-row">
          <label className="label">Status</label>
          <select className="input" value={status} onChange={e=>setStatus(e.target.value as any)}>
            <option value="draft">Draft</option><option value="published">Published</option>
          </select>
        </div>
        <button className="btn btn-ochre" disabled={loading} type="submit">{loading ? '...' : 'Create post'}</button>
      </form>
    </div>
  );
}
