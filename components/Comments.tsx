'use client';

import { useEffect, useRef, useState } from 'react';

type Comment = {
  id: number;
  name?: string | null;
  message: string;
  created_at: string;
  parent_id?: number | null;
  children?: Comment[];
};

type ReplyMeta = { id: number; name: string; snippet: string };

export default function Comments({ slug }: { slug: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyMeta, setReplyMeta] = useState<ReplyMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameLocked, setNameLocked] = useState(false);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved name on mount and keep in sync across tabs
  useEffect(() => {
    try {
      const saved = localStorage.getItem('commenter_name');
      if (saved && saved.trim()) {
        setName(saved.trim());
        setNameLocked(true);
      }
      const onStorage = (e: StorageEvent) => {
        if (e.key === 'commenter_name') {
          const v = (e.newValue || '').trim();
          if (v) { setName(v); setNameLocked(true); }
          else { setName(''); setNameLocked(false); }
        }
      };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    } catch {}
  }, []);

  // Persist name as user types (so refresh won’t forget)
  useEffect(() => {
    try {
      const v = name.trim();
      if (v) localStorage.setItem('commenter_name', v);
    } catch {}
  }, [name]);

  async function load() {
    try {
      const res = await fetch(`/api/public/comments?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setItems(data.comments || []);
    } catch {}
  }
  useEffect(() => { load(); }, [slug]);

  function onReplyIntent(c: Comment) {
    const snippetRaw = (c.message || '').replace(/\s+/g, ' ').trim();
    const snippet = snippetRaw.length > 84 ? snippetRaw.slice(0, 84) + '…' : snippetRaw;
    setReplyTo(c.id);
    setReplyMeta({ id: c.id, name: c.name || 'Reader', snippet });

    // Scroll to form and focus textarea
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => textareaRef.current?.focus(), 350);
    }, 0);
  }

  function clearReply() {
    setReplyTo(null);
    setReplyMeta(null);
  }

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
        // Make sure name is remembered and locked
        try { localStorage.setItem('commenter_name', nm); } catch {}
        setNameLocked(true);

        const newId: number = data.comment.id;

        if (replyTo) {
          setItems(prev => nestReply(prev, replyTo!, data.comment));
          clearReply();
        } else {
          setItems(prev => [...prev, data.comment]);
        }

        setMsg('');

        // Scroll to the new comment and highlight
        setTimeout(() => {
          const el = document.getElementById(`c-${newId}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightId(newId);
          setTimeout(() => setHighlightId(null), 1600);
        }, 120);
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
    try { localStorage.removeItem('commenter_name'); } catch {}
    setNameLocked(false);
    setName('');
  }

  return (
    <div className="comments-wrap">
      <h3 className="sec-title">Comments</h3>

      <div style={{ display:'grid', gap:12 }}>
        {items.map(c => <Node key={c.id} c={c} onReply={onReplyIntent} highlightId={highlightId} />)}
        {items.length === 0 ? <p className="sec-sub">Be the first to comment.</p> : null}
      </div>

      <form ref={formRef} className="comment-form" onSubmit={submit} style={{ marginTop: 12 }}>
        {!nameLocked ? (
          <input
            className="input"
            placeholder="Your name (required)"
            value={name}
            onChange={e=>setName(e.target.value)}
            required
          />
        ) : (
          <div className="reply-banner small" role="status" aria-live="polite">
            Commenting as <b>{name}</b>
            <button type="button" className="link" onClick={clearSavedName} aria-label="Change name">change</button>
          </div>
        )}

        {replyMeta ? (
          <div className="reply-banner" role="status" aria-live="polite">
            <div className="rb-top">
              Replying to <b>{replyMeta.name}</b>
              <button type="button" className="chip-nav rb-cancel" onClick={clearReply}>Cancel</button>
            </div>
            <div className="rb-quote">“{replyMeta.snippet}”</div>
          </div>
        ) : null}

        <textarea
          ref={textareaRef}
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

function Node({ c, onReply, highlightId }: { c: Comment; onReply: (c: Comment)=>void; highlightId: number | null }) {
  const directReplies = (c.children?.length || 0);

  return (
    <div id={`c-${c.id}`} className={`comment-card${highlightId === c.id ? ' comment-new' : ''}`}>
      <div className="comment-header">
        <div className="comment-author">{c.name || 'Reader'}</div>
        <div className="comment-time">{new Date(c.created_at).toLocaleString()}</div>
      </div>

      <div className="comment-body" style={{ marginTop:6 }}>{c.message}</div>

      <div className="comment-actions" style={{ display:'flex', gap:10, marginTop:8, alignItems:'center' }}>
        <button type="button" className="chip-nav" onClick={()=>onReply(c)}>Reply</button>
        {directReplies > 0 ? (
          <span className="badge replies-badge" aria-label={`${directReplies} repl${directReplies>1?'ies':'y'}`}>
            {directReplies} {directReplies>1?'replies':'reply'}
          </span>
        ) : null}
      </div>

      {c.children?.length ? (
        <div className="comment-children">
          {c.children.map(k => <Node key={k.id} c={k} onReply={onReply} highlightId={highlightId} />)}
        </div>
      ) : null}
    </div>
  );
}
