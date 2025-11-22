'use client';
import { motion } from 'framer-motion';

export default function PostCardCompact({
  title, slug, excerpt, date
}: { title: string; slug: string; excerpt?: string | null; date?: string | null }) {
  const showExcerpt = excerpt && excerpt !== 'null' && excerpt !== 'undefined';
  const prettyDate = date ? new Date(date).toLocaleDateString() : '';
  return (
    <motion.a
      href={`/blog/${encodeURIComponent(slug)}`}
      className="compact"
      whileHover={{ y: -3 }}
      whileTap={{ scale: .98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <h3>{title}</h3>
      {showExcerpt ? <p>{excerpt}</p> : null}
      {prettyDate ? <p style={{ marginTop: 8, fontSize: 13 }}>{prettyDate}</p> : null}
    </motion.a>
  );
}
