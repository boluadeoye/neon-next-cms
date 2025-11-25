import { sql } from '../lib/db';

function val(v:any, fallback=''){ return typeof v === 'string' ? v : (v?.value ?? fallback); }

export default async function HomeIntroCard(){
  const rows = (await sql`
    SELECT key, value FROM settings
    WHERE key = ANY(${['site_description','hero_bio']})
  `) as { key:string; value:any }[];
  const map = Object.fromEntries(rows.map(r=>[r.key, typeof r.value==='string'?r.value:r.value?.value]));
  const line = (map.hero_bio as string) || (map.site_description as string) || 'Thoughtful essays, notes, and updates.';

  return (
    <div className="intro-card">
      <div className="intro-title">Welcome</div>
      <p className="intro-text">
        {line} Here you’ll find featured pieces, the latest posts, and quick updates.
      </p>
      <div className="intro-row">
        <a className="btn btn-ochre" href="/blog">Read the blog</a>
        <a className="btn btn-ghost" href="/portfolio">Portfolio</a>
      </div>
    </div>
  );
}
