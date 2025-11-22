'use client';
import { useEffect, useState } from 'react';

export default function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/public/likes?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
    const data = await res.json();
    if (res.ok) { setCount(data.count || 0); setLiked(!!data.liked); }
    setLoading(false);
  }

  async function toggle() {
    const res = await fetch(`/api/public/likes?slug=${encodeURIComponent(slug)}`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) { setCount(data.count || 0); setLiked(!!data.liked); }
  }

  useEffect(() => { load(); }, [slug]);

  return (
    <button className={`like-pill ${liked ? 'liked' : ''}`} onClick={toggle} aria-pressed={liked}>
      <span>{liked ? '❤️' : '🤍'}</span>
      <span>{loading ? '…' : count}</span>
    </button>
  );
}
