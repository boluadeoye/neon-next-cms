'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HomeIntroCard() {
  return (
    <section style={{ padding: '0 20px', marginTop: '10px', marginBottom: '50px', position: 'relative', zIndex: 20 }}>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 12px 35px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)',
          color: '#111827',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* The "Life" Accent: A subtle gradient line at the top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #1A2C4E 0%, #D97B0C 100%)' }} />

        <h2 style={{ 
          fontFamily: 'Georgia, serif', 
          fontSize: '2rem', 
          fontWeight: 800, 
          marginBottom: '12px',
          letterSpacing: '-0.02em',
          color: '#1A2C4E',
          marginTop: 0
        }}>
          Welcome.
        </h2>

        <p style={{ 
          fontSize: '1.05rem', 
          lineHeight: 1.6, 
          color: '#4B5563', 
          marginBottom: '30px',
          maxWidth: '600px',
          fontWeight: 400
        }}>
          A living studio of essays, culture notes, and field reports — edited with care.
          New writing lands often. Start with the blog or browse selected work.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Primary Button */}
          <motion.a 
            href="/blog" 
            whileHover={{ scale: 1.02, backgroundColor: '#111e36' }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1A2C4E',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(26,44,78,0.2)',
              border: 'none'
            }}
          >
            Read the blog
            <ArrowRight size={16} />
          </motion.a>

          {/* Secondary Button */}
          <motion.a 
            href="/portfolio" 
            whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#ffffff',
              color: '#1A2C4E',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            Portfolio
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
