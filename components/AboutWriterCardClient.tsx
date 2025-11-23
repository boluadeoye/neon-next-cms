'use client';
import TypingText from './TypingText';

export default function AboutWriterCardClient({
  name, role, bullets
}: { name: string; role: string; bullets: string[] }) {
  return (
    <section className="section container">
      <div className="about-card" style={{ maxWidth: 'min(var(--hero-max), 100vw - 32px)', marginInline: 'auto' }}>
        <TypingText as="h2" className="sec-title" text={name} speed={28} delay={200} loop />
        <TypingText as="p" className="sec-sub" text={role} speed={22} delay={600} loop />
        <div className="about-bullets" style={{ marginTop:12 }}>
          {bullets.slice(0,4).map((b, i) => (
            <TypingText
              key={i}
              as="span"
              className="chip"
              text={b}
              speed={16}
              delay={900 + i * 200}
              loop
            />
          ))}
        </div>
      </div>
    </section>
  );
}
