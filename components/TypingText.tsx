'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

type Seg = { text: string; className?: string };

export default function TypingText({
  text,
  segments,
  as = 'span',
  speed = 28,       // ms per char while typing
  deleteSpeed = 18, // ms per char while deleting
  delay = 0,        // initial delay
  pause = 1200,     // pause when fully typed before deleting
  loop = true,
  className,
  cursor = true
}: {
  text?: string;
  segments?: Seg[];
  as?: keyof JSX.IntrinsicElements;
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  pause?: number;
  loop?: boolean;
  className?: string;
  cursor?: boolean;
}) {
  const segs: Seg[] = useMemo(() => segments ?? [{ text: text || '' }], [segments, text]);
  const full = useMemo(() => segs.map(s => s.text).join(''), [segs]);

  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    let t: any;
    if (!started.current) {
      started.current = true;
      t = setTimeout(() => setCount(c => Math.min(c + 1, full.length)), delay);
      return () => clearTimeout(t);
    }
    if (!deleting && count < full.length) {
      t = setTimeout(() => setCount(c => Math.min(c + 1, full.length)), speed);
    } else if (!deleting && count === full.length) {
      if (loop) t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && count > 0) {
      t = setTimeout(() => setCount(c => Math.max(c - 1, 0)), deleteSpeed);
    } else if (deleting && count === 0) {
      setDeleting(false);
    }
    return () => clearTimeout(t);
  }, [count, deleting, speed, deleteSpeed, pause, loop, delay, full.length]);

  // Render the first 'count' characters across segments with styles intact
  let left = count;
  const rendered = segs.map((s, i) => {
    const take = Math.max(0, Math.min(left, s.text.length));
    left -= take;
    return <span key={i} className={s.className}>{s.text.slice(0, take)}</span>;
  });

  const El = as;
  return (
    <El aria-label={full} className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {rendered}{cursor ? <span className="typing-cursor" /> : null}
    </El>
  );
}
