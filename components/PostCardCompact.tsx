'use client';
import { motion } from 'framer-motion';

export default function PostCardCompact({
  title, slug, excerpt, date, cover
}: {
  title: string;
  slug: string;
  excerpt?: string | null;
  date?: string | null;
  cover?: string | null;
}) {
  const d = date ? new Date(date).toLocaleDateString() : '';
  const showEx = !!(excerpt && excerpt !== 'null' && excerpt !== 'undefined');

  return (
    <motion.a
      href={`/blog/${encodeURIComponent(slug)}`}
      className="card-shiny latest-card"
      whileTap={{ scale: .98 }}
      transition={{ type:'spring', stiffness: 280, damping: 22 }}
    >
      {cover ? <img className="latest-thumb" src={cover} alt="" /> : <div className="latest-thumb" />}
      <div>
        <h3 className="latest-title">{title}</h3>
        {showEx ? <p className="line-2" style={{ color:'var(--muted)', margin:0 }}>{excerpt}</p> : null}
        {d ? <p className="latest-meta" style={{ marginTop: showEx ? 6 : 0 }}>{d}</p> : null}
      </div>
    </motion.a>
  );
}
