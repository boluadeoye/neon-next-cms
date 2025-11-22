import { sql } from '../lib/db';

function val(v:any, fallback=''){ return typeof v === 'string' ? v : (v?.value ?? fallback); }

export default async function HeroEditorial(){
  const rows = (await sql`
    SELECT key, value FROM settings
    WHERE key = ANY(${[
      'hero_name','hero_bio','hero_avatar_url','hero_portrait_url',
      'hero_email','hero_phone'
    ]})
  `) as { key:string; value:any }[];

  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  const name = val(map.hero_name, 'Omolayo');
  const subcopy = val(map.hero_bio, 'I write clear, compelling stories that move people to action.');
  const portrait = val(map.hero_portrait_url, val(map.hero_avatar_url,
    'https://images.unsplash.com/photo-1531123414780-f7423c5dd0c6?q=80&w=1080&auto=format&fit=crop'
  ));
  const email = val(map.hero_email, '');
  const phone = val(map.hero_phone, '');

  return (
    <section className="section container">
      <div className="hero-wrap">
        <div className="rail-ochre" />
        <div className="hero-card">
          <div className="hero-social">
            <a className="icon-btn" href="https://twitter.com" aria-label="X/Twitter">x</a>
            <a className="icon-btn" href="https://linkedin.com" aria-label="LinkedIn">in</a>
            <a className="icon-btn" href="https://instagram.com" aria-label="Instagram">ig</a>
          </div>
          <div className="watermark" style={{ fontFamily: 'var(--font-display)' }}>WELCOME</div>

          <div className="hero-grid">
            <img className="hero-portrait" src={portrait} alt="" />
            <div>
              <div className="hero-eyebrow">HELLO</div>
              <h1 className="hero-title">I’m <b>{String(name)}</b></h1>
              <p className="hero-sub">{subcopy}</p>

              <div className="band-navy">
                <div className="band-grid">
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    <a className="btn btn-ochre" href="/portfolio">Portfolio</a>
                    <a className="btn btn-outline" href="/resume">Resume</a>
                    <a className="btn btn-ghost" href="/blog">Read the blog</a>
                  </div>
                  {(email || phone) ? <div className="band-info">{email}{email && phone ? ' • ' : ''}{phone}</div> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </section>
  );
}
