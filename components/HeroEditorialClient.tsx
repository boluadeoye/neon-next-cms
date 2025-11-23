'use client';
import { motion } from 'framer-motion';
import TypingText from './TypingText';

export default function HeroEditorialClient({
  name, subcopy, links
}: {
  name: string;
  subcopy: string;
  links: { portfolio?: string; blog?: string; x?: string; linkedin?: string; instagram?: string };
}) {
  return (
    <motion.section
      className="hero-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5, ease: [0.2, 0.9, 0.2, 1] }}
    >
      <div className="hero-card-xl">
        <div className="soc-strip">
          {links.x && <a className="soc-chip" href={links.x} aria-label="X/Twitter">x</a>}
          {links.linkedin && <a className="soc-chip" href={links.linkedin} aria-label="LinkedIn">in</a>}
          {links.instagram && <a className="soc-chip" href={links.instagram} aria-label="Instagram">ig</a>}
        </div>

        <div className="wm">WELCOME</div>

        <div>
          <TypingText as="div" className="hero-eyebrow" text="HELLO" speed={20} delay={150} />
          <TypingText
            as="h1"
            className="hero-title"
            segments={[{ text: "I’m " }, { text: name, className:'gold' }]}
            speed={22}
            delay={420}
          />
          <TypingText as="p" className="hero-sub" text={subcopy} speed={16} delay={800} />

          <div className="cta-panel">
            <div className="cta-row">
              <a className="btn btn-ochre" href={links.portfolio || '/portfolio'}>Portfolio</a>
              <a className="btn btn-ghost" href={links.blog || '/blog'}>Read the blog</a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
