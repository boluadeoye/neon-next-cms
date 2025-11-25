'use client';

import { useEffect, useState } from 'react';

type Comment = {
  id: number;
  name?: string | null;
  message: string;
  created_at: string;
  parent_id?: number | null;
  children?: Comment[];
};

export default function Comments({ slug }: { slug: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameLocked, setNameLocked] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('commenter_name') : null;
    if (saved) { setName(saved); setNameLocked(true); }
  }, []);

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
    const nm = name.trim();
    const body = msg.trim();
    if (!nm || !body) return;

    setLoading(true);
    try {
      const res = await fetch('/api/public/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: nm, message: body, parentId: replyTo })
      });
      const data = await res.json();
      if (res.ok && data?.ok && data.comment) {
        if (!nameLocked) {
          localStorage.setItem('commenter_name', nm);
          setNameLocked(true);
        }
        // Optimistic merge
        if (replyTo) {
          setItems(prev => nestReply(prev, replyTo!, data.comment));
        } else {
          setItems(prev => [...prev, data.comment]);
        }
        setMsg('');
        setReplyTo(null);
      }
    } finally { setLoading(false); }
  }

  function nestReply(list: Comment[], pid: number, c: Comment): Comment[] {
    return list.map(it => {
      if (it.id === pid) return { ...it, children: [...(it.children || []), c] };
      if (it.children?.length) return { ...it, children: nestReply(it.children, pid, c) };
      return it;
    });
  }

  function clearSavedName() {
    localStorage.removeItem('commenter_name');
    setNameLocked(false);
    setName('');
  }

  return (
    <div className="comments-wrap">
      <h3 className="sec-title">Comments</h3>

      <div style={{ display:'grid', gap:12 }}>
        {items.map(c => <Node key={c.id} c={c} onReply={setReplyTo} />)}
        {items.length === 0 ? <p className="sec-sub">Be the first to comment.</p> : null}
      </div>

      <form className="comment-form" onSubmit={submit} style={{ marginTop: 12 }}>
        {!nameLocked ? (
          <input
            className="input"
            placeholder="Your name (required)"
            value={name}
            onChange={e=>setName(e.target.value)}
            required
          />
        ) : (
          <div className="sec-sub" style={{ display:'flex', alignItems:'center', gap:8 }}>
            Commenting as <b>{name}</b>
            <button type="button" className="link" onClick={clearSavedName}>change</button>
          </div>
        )}

        {replyTo ? (
          <div className="sec-sub">
            Replying to comment #{replyTo}{' '}
            <button type="button" className="link" onClick={()=>setReplyTo(null)}>cancel</button>
          </div>
        ) : null}

        <textarea
          className="input"
          placeholder="Write a thoughtful comment…"
          value={msg}
          onChange={e=>setMsg(e.target.value)}
          required
          rows={4}
        />
        <button className="btn btn-ochre" type="submit" disabled={loading}>
          {loading ? 'Posting…' : (replyTo ? 'Post reply' : 'Post comment')}
        </button>
      </form>
    </div>
  );
}

function Node({ c, onReply }: { c: Comment; onReply: (id:number)=>void }) {
  return (
    <div className="comment-card">
      <div className="comment-author">{c.name || 'Reader'}</div>
      <div className="comment-time">{new Date(c.created_at).toLocaleString()}</div>
      <div className="comment-body" style={{ marginTop:6 }}>{c.message}</div>
      <div className="comment-actions" style={{ display:'flex', gap:10, marginTop:8 }}>
        <button type="button" className="chip-nav" onClick={()=>onReply(c.id)}>Reply</button>
      </div>
      {c.children?.length ? (
        <div style={{ borderLeft:'2px solid rgba(0,0,0,.06)', marginTop:10, paddingLeft:10, display:'grid', gap:10 }}>
          {c.children.map(k => <Node key={k.id} c={k} onReply={onReply} />)}
        </div>
      ) : null}
    </div>
  );
}
