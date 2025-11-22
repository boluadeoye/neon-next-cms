'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Post = {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  cover_image_url: string | null; status: 'draft' | 'published'; published_at: string | null;
};
type Tag = { name: string; slug: string };

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [tags, setTags] = useState<string>('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/posts/' + id, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setPost(data.post);
      const tagStr = (data.tags as Tag[]).map((t) => t.name).join(', ');
      setTags(tagStr);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;
    setMsg(null);
    const res = await fetch('/api/admin/posts/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, tags })
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data?.error || 'Save failed');
    setMsg('Saved!');
    setPost(data.post);
  }

  async function togglePublish() {
    if (!post) return;
    const res = await fetch('/api/admin/posts/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: post.status === 'published' ? 'draft' : 'published' })
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data?.error || 'Update failed');
    setPost({ ...post, status: data.post.status, published_at: data.post.published_at });
  }

  if (loading) return <p>Loading...</p>;
  if (!post) return <p className="error">{msg || 'Not found'}</p>;

  return (
    <>
      <h1>Edit Post</h1>
      {msg && <p className="help">{msg}</p>}
      <form className="form" onSubmit={save}>
        <div className="form-row">
          <label className="label">Title</label>
          <input className="input" value={post.title} onChange={e=>setPost({ ...post, title: e.target.value })} />
        </div>
        <div className="form-row">
          <label className="label">Slug</label>
          <input className="input" value={post.slug} onChange={e=>setPost({ ...post, slug: e.target.value })} />
        </div>
        <div className="form-row">
          <label className="label">Excerpt</label>
          <input className="input" value={post.excerpt || ''} onChange={e=>setPost({ ...post, excerpt: e.target.value })} />
        </div>
        <div className="form-row">
          <label className="label">Content</label>
          <textarea className="input" rows={12} value={post.content} onChange={e=>setPost({ ...post, content: e.target.value })} />
        </div>
        <div className="form-row">
          <label className="label">Cover Image URL</label>
          <input className="input" value={post.cover_image_url || ''} onChange={e=>setPost({ ...post, cover_image_url: e.target.value })} />
        </div>
        <div className="form-row">
          <label className="label">Tags (comma separated)</label>
          <input className="input" value={tags} onChange={e=>setTags(e.target.value)} />
        </div>
        <div className="form-row" style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" type="submit">Save</button>
          <button className="btn" type="button" onClick={togglePublish}>
            {post.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          <a className="btn" href="/admin/posts">Back</a>
        </div>
      </form>
    </>
  );
}
