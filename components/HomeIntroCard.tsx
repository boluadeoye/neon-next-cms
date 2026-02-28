'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HomeIntroCard() {
  return (
    <section style={{ padding: '0 20px', marginTop: '20px', marginBottom: '40px', position: 'relative', zIndex: 20 }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease:[0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'linear-gradient(145deg, #111827 0%, #0F172A 100%)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.05)',
          color: '#ffffff',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Subtle ambient background glow */}
        <div style={{ 
          position: 'absolute', 
          top: '-50%', 
          left: '-10%', 
          width: '50%', 
          height: '100%', 
          background: 'radial-gradient(circle, rgba(217,123,12,0.15) 0%, transparent 70%)', 
          filter: 'blur(40px)', 
          pointerEvents: 'none' 
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontFamily: 'Georgia, serif', 
            fontSize: '2.2rem', 
            fontWeight: 700, 
            marginBottom: '16px',
            letterSpacing: '-0.02em',
            color: '#F9FAFB',
            marginTop: 0
          }}>
            Welcome
          </h2>

          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: 1.7, 
            color: '#9CA3AF', 
            marginBottom: '32px',
            maxWidth: '600px',
            fontWeight: 400
          }}>
            A living studio of essays, culture notes, and field reports — edited with care.
            New writing lands often. Start with the blog or browse selected work.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {/* Primary Button */}
            <motion.a 
              href="/blog" 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#D97B0C',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '99px',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(217,123,12,0.3)',
                border: 'none'
              }}
            >
              Read the blog
              <ArrowRight size={18} />
            </motion.a>

            {/* Secondary Button (Glassmorphism) */}
            <motion.a 
              href="/portfolio" 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '99px',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              Portfolio
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
