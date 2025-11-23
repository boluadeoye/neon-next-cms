'use client';
import { motion, type Variants } from 'framer-motion';

function AnimatedLetters({
  text,
  className,
  delay = 0,
  perChar = 0.04
}: {
  text: string;
  className?: string;
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
    hidden: { opacity: 0, y: 6 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.24, ease: 'easeOut' }
    }
  };

  return (
    <motion.span
      className={className}
      variants={parent}
      initial="hidden"
      animate="show"
      style={{ display: 'inline-block' }}
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
  const roleDelay = Math.min(0.8, name.length * 0.04 + 0.15);
  return (
    <div className="brand-lockup">
      <AnimatedLetters text={name} className="brand-title" delay={0} perChar={0.04} />
      <AnimatedLetters text={role} className="brand-sub" delay={roleDelay} perChar={0.035} />
    </div>
  );
}
