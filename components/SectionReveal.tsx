'use client';
import { motion } from 'framer-motion';

export default function SectionReveal({
  children, delay = 0
}: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: .45, ease: [0.2, 0.9, 0.2, 1], delay }}
    >
      {children}
    </motion.section>
  );
}
