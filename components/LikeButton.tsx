'use client';
import { useState } from 'react';

export default function LikeButton({ slug, initialCount = 0, initiallyLiked = false }: { slug: string; initialCount?: number; initiallyLiked?: boolean }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initiallyLiked);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/public/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      const data = await res.json();
      if (data?.ok) {
        setLiked(Boolean(data.liked));
        setCount(Number(data.count || 0));
      }
    } finally { setBusy(false); }
  }

  return (
    <button onClick={toggle} className="like-pill" aria-pressed={liked}>
      {liked ? '💛' : '🤍'} {busy ? '…' : count}
    </button>
  );
}
