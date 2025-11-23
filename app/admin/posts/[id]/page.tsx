'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import MarkdownEditor from '../../../../components/MarkdownEditor';

const CATS = ['Essays','Life','Culture','News'] as const;
type Cat = typeof CATS[number];

type Post = {
  id:string; title:string; slug:string; excerpt:string|null; content:string;
  cover_image_url:string|null; status:'draft'|'published'; published_at:string|null;
};

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [tags, setTags] = useState<string>(''); const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function pickCategory(raw: string): Cat {
    const arr = raw.split(',').map(s=>s.trim().toLowerCase());
    if (arr.includes('life')) return 'Life';
    if (arr.includes('culture')) return 'Culture';
    if (arr.includes('news')) return 'News';
    return 'Essays';
  }
  const category: Cat = useMemo(()=>pickCategory(tags), [tags]);

  function mergeCategoryIntoTags(cat: Cat, raw: string) {
    const arr = raw.split(',').map(s=>s.trim()).filter(Boolean).map(s=>s.toLowerCase());
    const c = cat.toLowerCase();
    if (!arr.includes(c)) arr.unshift(c);
    return Array.from(new Set(arr)).join(', ');
  }

  async function load() {
    setLoading(true); setMsg(null);
    try {
      const res = await fetch('/api/admin/posts/' + id, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setPost(data.post);
      const tagStr = (data.tags || []).map((t:any)=>t.slug || t.name || '').filter(Boolean).join(', ');
      setTags(tagStr);
    } catch (e:any) { setMsg(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!post) return; setMsg(null);
    const outTags = mergeCategoryIntoTags(category, tags);
    const res = await fetch('/api/admin/posts/' + id, { method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...post, tags: outTags }) });
    const data = await res.json();
    if (!res.ok) return setMsg(data?.error || 'Save failed');
    setMsg('Saved!'); setPost(data.post);
  }

  async function togglePublish() {
    if (!post) return;
    const res = await fetch('/api/admin/posts/' + id, { method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ status: post.status==='published'?'draft':'published' }) });
    const data = await res.json();
    if (!res.ok) return setMsg(data?.error || 'Update failed');
    setPost({ ...post, status:data.post.status, published_at:data.post.published_at });
  }

  if (loading) return <p className="sec-sub">Loading…</p>;
  if (!post) return <p className="sec-sub">{msg || 'Not found'}</p>;

  return (
    <div className="admin-card">
      <h1 style={{ marginTop:0 }}>Edit Post</h1>
      {msg && <p className="sec-sub">{msg}</p>}
      <form className="form" onSubmit={save}>
        <div className="form-row"><label className="label">Title</label><input className="input" value={post.title} onChange={e=>setPost({ ...post, title:e.target.value })} /></div>
        <div className="form-row"><label className="label">Slug</label><input className="input" value={post.slug} onChange={e=>setPost({ ...post, slug:e.target.value })} /></div>
        <div className="form-row"><label className="label">Excerpt</label><input className="input" value={post.excerpt || ''} onChange={e=>setPost({ ...post, excerpt:e.target.value })} /></div>
        <div className="form-row"><label className="label">Content</label><MarkdownEditor value={post.content} onChange={(v)=>setPost({ ...post!, content:v })} uniqueId={String(id)} /></div>
        <div className="form-row"><label className="label">Cover Image URL</label><input className="input" value={post.cover_image_url || ''} onChange={e=>setPost({ ...post, cover_image_url:e.target.value })} /></div>

        <div className="form-row">
          <label className="label">Category</label>
          <select className="input" value={category} onChange={e=>setTags(mergeCategoryIntoTags(e.target.value as Cat, tags))}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <p className="help">We ensure this category tag exists in “tags”.</p>
        </div>

        <div className="form-row"><label className="label">Extra Tags (comma separated)</label><input className="input" value={tags} onChange={e=>setTags(e.target.value)} /></div>

        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-ochre" type="submit">Save</button>
          <button className="btn" type="button" onClick={togglePublish}>{post.status==='published'?'Unpublish':'Publish'}</button>
          <a className="btn btn-ghost" href="/admin/posts">Back</a>
        </div>
      </form>
    </div>
  );
}
