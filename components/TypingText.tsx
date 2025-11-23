'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  text?: string;
  segments?: { text: string; className?: string }[];
  as?: keyof JSX.IntrinsicElements;
  speed?: number;      // ms per char
  delay?: number;      // ms before start
  className?: string;
  cursor?: boolean;    // show blink cursor
};

export default function TypingText({
  text, segments, as='span', speed=22, delay=0, className, cursor=true
}: Props){
  const segs = segments ?? [{ text: text || '' }];
  const full = segs.map(s => s.text).join('');
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    let t: any;
    if (!started.current) {
      started.current = true;
      t = setTimeout(() => setCount(c => Math.min(c + 1, full.length)), delay);
      return () => clearTimeout(t);
    }
    if (count < full.length) t = setTimeout(() => setCount(c => Math.min(c + 1, full.length)), speed);
    return () => clearTimeout(t);
  }, [count, delay, speed, full.length]);

  // Assemble typed output across segments
  let left = count;
  const rendered = segs.map((s, i) => {
    const take = Math.max(0, Math.min(left, s.text.length)); left -= take;
    return <span key={i} className={s.className}>{s.text.slice(0, take)}</span>;
  });

  const El = as;
  return (
    <El className={className} style={{ whiteSpace: 'pre-wrap' }} aria-label={full}>
      {rendered}{cursor ? <span className="typing-cursor" /> : null}
    </El>
  );
}
