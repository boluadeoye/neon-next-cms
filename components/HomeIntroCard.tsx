'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HomeIntroCard() {
  // Explicitly typing as Variants to satisfy the TypeScript compiler
  const container: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1], 
        staggerChildren: 0.15 
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section style={{ padding: '0 20px', marginTop: '20px', marginBottom: '60px', position: 'relative', zIndex: 20 }}>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        whileHover={{ 
          y: -4, 
          boxShadow: '0 25px 50px -12px rgba(26,44,78,0.15), 0 0 0 1px rgba(0,0,0,0.03)' 
        }}
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '48px 40px',
          boxShadow: '0 15px 35px -10px rgba(26,44,78,0.1), 0 0 0 1px rgba(0,0,0,0.03)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.4s ease'
        }}
      >
        {/* Top Accent Line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(90deg, #1A2C4E 0%, #D97B0C 100%)' }} />

        <motion.h2 variants={item} style={{ 
          fontFamily: 'Georgia, serif', 
          fontSize: '2.4rem', 
          fontWeight: 800, 
          marginBottom: '16px',
          letterSpacing: '-0.03em',
          color: '#1A2C4E',
          marginTop: 0
        }}>
          Welcome.
        </motion.h2>

        <motion.p variants={item} style={{ 
          fontSize: '1.1rem', 
          lineHeight: 1.75, 
          color: '#4B5563', 
          marginBottom: '36px',
          maxWidth: '600px',
          fontWeight: 400
        }}>
          A living studio of essays, culture notes, and field reports — edited with care.
          New writing lands often. Start with the blog or browse selected work.
        </motion.p>

        <motion.div variants={item} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <motion.a 
            href="/blog" 
            whileHover={{ scale: 1.03, backgroundColor: '#111e36' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#1A2C4E',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 8px 20px -6px rgba(26,44,78,0.4)',
              border: 'none',
              transition: 'background-color 0.2s ease'
            }}
          >
            Read the blog
            <ArrowRight size={18} />
          </motion.a>

          <motion.a 
            href="/portfolio" 
            whileHover={{ scale: 1.03, backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              color: '#1A2C4E',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)',
              transition: 'background-color 0.2s ease, border-color 0.2s ease'
            }}
          >
            Portfolio
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
