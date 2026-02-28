'use client';
import { motion, type Variants } from 'framer-motion';

function AnimatedLetters({
  text,
  style,
  delay = 0,
  perChar = 0.04
}: {
  text: string;
  style?: React.CSSProperties;
  delay?: number;
  perChar?: number;
}) {
  const letters = Array.from(text);

  const parent: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: perChar, delayChildren: delay }
    }
  };

  const child: Variants = {
    hidden: { opacity: 0, y: 4 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.span
      variants={parent}
      initial="hidden"
      animate="show"
      style={{ 
        display: 'inline-flex', 
        whiteSpace: 'nowrap', // CRITICAL: Prevents the line break
        ...style 
      }}
      aria-label={text}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          variants={child}
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function HeaderBrandClient({
  name,
  role
}: {
  name: string;
  role: string;
}) {
  const roleDelay = Math.min(0.8, name.length * 0.04 + 0.1);
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start',
      gap: '2px'
    }}>
      {/* THE NAME: Bold, Serif, No-Wrap */}
      <AnimatedLetters 
        text={name} 
        style={{ 
          fontSize: '22px', 
          fontWeight: '800', 
          color: '#1A2C4E', 
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }} 
      />
      
      {/* THE ROLE: Small, Spaced, Modern */}
      <div style={{ 
        height: '1px', 
        width: '100%', 
        background: '#D97B0C', 
        opacity: 0.4, 
        margin: '2px 0' 
      }} />
      
      <AnimatedLetters 
        text={role} 
        delay={roleDelay} 
        perChar={0.03}
        style={{ 
          fontSize: '10px', 
          fontWeight: '600', 
          color: '#64748b', 
          textTransform: 'uppercase', 
          letterSpacing: '0.2em',
          fontFamily: 'system-ui, sans-serif'
        }} 
      />
    </div>
  );
}
