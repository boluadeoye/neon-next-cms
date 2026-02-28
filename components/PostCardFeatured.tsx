'use client';
import { motion } from 'framer-motion';
import PostImage from './PostImage';

export default function PostCardFeatured({ title, slug, excerpt, cover, date }:{
  title:string; slug:string; excerpt?:string|null; cover?:string|null; date?:string|null;
}){
  return (
    <motion.a
      href={`/blog/${encodeURIComponent(slug)}`}
      className="feature-card"
      whileHover={{ y: -2 }}
      whileTap={{ scale: .98 }}
      transition={{ type:'spring', stiffness:260, damping:22 }}
      style={{ position: 'relative', overflow: 'hidden', display: 'block' }}
    >
      <PostImage 
        className="feature-media" 
        src={cover} 
        alt={title} 
        fill 
        style={{ objectFit: 'cover' }}
      />
      <div className="feature-grad" />
      <div className="feature-body">
        <h3 className="feature-title">{title}</h3>
        <div style={{ opacity:.85, fontSize:13 }}>
          {date ? new Date(date).toLocaleDateString() : ''}
        </div>
      </div>
    </motion.a>
  );
}
