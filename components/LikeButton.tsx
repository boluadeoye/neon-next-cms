'use client';
import { useEffect, useState } from 'react';

export default function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/public/likes?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) { setCount(data.count || 0); setLiked(!!data.liked); }
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [slug]);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    // optimistic update
    setCount(c => c + (liked ? -1 : 1));
    setLiked(v => !v);

    try {
      const res = await fetch(`/api/public/likes?slug=${encodeURIComponent(slug)}`, { method: 'POST', cache: 'no-store' });
      const data = await res.json();
      if (res.ok) { setCount(data.count || 0); setLiked(!!data.liked); }
      else throw new Error(data?.error || 'Error');
    } catch {
      // revert if failed
      setLiked(v => !v);
      setCount(c => c + (liked ? 1 : -1));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className={`btn ${liked ? 'btn-ochre' : ''}`} onClick={toggle} aria-pressed={liked} disabled={busy}>
      <span>{liked ? '❤️' : '🤍'}</span>
      <span style={{ marginLeft: 6 }}>{loading ? '…' : count}</span>
    </button>
  );
}
