'use client';
import { motion } from 'framer-motion';

export default function PostCardFeatured({
  title, slug, excerpt, cover, date
}: { title: string; slug: string; excerpt?: string | null; cover?: string | null; date?: string | null }) {
  return (
    <motion.a
      className="feature-card"
      href={`/blog/${encodeURIComponent(slug)}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: .99 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {cover ? <img className="feature-media" src={cover} alt="" /> : null}
      <div className="feature-grad" />
      <div className="feature-body">
        <h3 className="feature-title">{title}</h3>
        <div className="feature-meta">
          {(date ? new Date(date).toLocaleDateString() : '')}{excerpt ? ` • ${excerpt}` : ''}
        </div>
      </div>
    </motion.a>
  );
}
