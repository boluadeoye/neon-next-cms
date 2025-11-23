import { sql } from '../lib/db';

function val(v:any, fallback=''){ return typeof v === 'string' ? v : (v?.value ?? fallback); }

export default async function HomeMasthead(){
  const rows = (await sql`
    SELECT key, value FROM settings
    WHERE key = ANY(${[
      'hero_name','hero_bio','hero_email',
      'hero_avatar_url','hero_cover_url',
      'hero_social_twitter','hero_social_linkedin','hero_social_github'
    ]})
  `) as { key:string; value:any }[];

  const map = Object.fromEntries(rows.map(r=>[r.key,r.value]));
  const name   = val(map.hero_name, 'OMOLAYO');
  const bio    = val(map.hero_bio, 'I write clear, compelling stories that move people to action.');
  const email  = val(map.hero_email, '');
  const avatar = val(map.hero_avatar_url, 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=480&auto=format&fit=crop');
  const cover  = val(map.hero_cover_url, 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop');

  const x   = val(map.hero_social_twitter, '') || '';
  const li  = val(map.hero_social_linkedin, '') || '';
  const ig  = val(map.hero_social_github, '') || ''; // repurpose if needed

  return (
    <>
      {/* Dark cover masthead */}
      <div className="masthead">
        <div className="mast-bg" style={{ backgroundImage: `url(${cover})` }} />
        <div className="mast-overlay" />
        <div className="mast-inner">
          <h1 className="mast-name">{String(name).toUpperCase()}</h1>
        </div>
      </div>

      {/* Overlapping avatar & intro (sits above hero due to z-index) */}
      <div className="mast-intro">
        <span className="avatar-wrap">
          <img className="avatar-ring" src={avatar} alt="" />
        </span>
        <p className="mast-bio">{bio}</p>
        {email ? <p className="mast-email"><a href={`mailto:${email}`}>{email}</a></p> : null}
        <div className="mast-social">
          {x  ? <a href={x}  aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2.1h-3.2l-4.2 5.6L7.3 2.1H2.7l6 8.1-6.3 8.7h3.2l4.6-6.2 4.6 6.2h4.6l-6.7-8.9 6.6-8z"/></svg></a> : null}
          {li ? <a href={li} aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 23h5V7H0v16zm7.5-16H12v2.2h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.7V23h-5v-6.7c0-1.6 0-3.7-2.3-3.7-2.3 0-2.6 1.8-2.6 3.6V23h-5V7z"/></svg></a> : null}
          {ig ? <a href={ig} aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.75-2a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17.75 7.5Z"/></svg></a> : null}
        </div>
      </div>
    </>
  );
}
