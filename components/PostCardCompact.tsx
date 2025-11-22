'use client';
import { motion } from 'framer-motion';

export default function PostCardCompact({ title, slug, excerpt, date }:{
  title:string; slug:string; excerpt?:string|null; date?:string|null;
}){
  const niceDate = date ? new Date(date).toLocaleDateString() : '';
  const showExcerpt = excerpt && excerpt !== 'null' && excerpt !== 'undefined';
  return (
    <motion.a
      href={`/blog/${encodeURIComponent(slug)}`}
      className="compact"
      whileHover={{ y:-3 }}
      whileTap={{ scale:.98 }}
      transition={{ type:'spring', stiffness:300, damping:22 }}
    >
      <h3>{title}</h3>
      {showExcerpt ? <p>{excerpt}</p> : null}
      {niceDate ? <p style={{ marginTop:8, fontSize:13 }}>{niceDate}</p> : null}
    </motion.a>
  );
}
