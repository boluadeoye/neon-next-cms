import { sql } from '../lib/db';

function val(v:any, fallback=''){ return typeof v === 'string' ? v : (v?.value ?? fallback); }

export default async function ProfileCard() {
  const rows = (await sql`
    SELECT key, value FROM settings
    WHERE key = ANY(${['hero_avatar_url','hero_name','hero_title','hero_bullets']})
  `) as {key:string; value:any}[];

  const map = Object.fromEntries(rows.map(r=>[r.key,r.value]));
  const photo = val(map.hero_avatar_url,
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=960&auto=format&fit=crop');
  const name = val(map.hero_name, 'DONALD MCKINNEY');
  const title = val(map.hero_title, 'UI/UX DEVELOPER');
  let bullets: string[] = [];
  try { const raw = map.hero_bullets; bullets = Array.isArray(raw) ? raw : String(raw||'').split('\n').filter(Boolean); } catch {}

  return (
    <section className="section container">
      <div className="profile-card">
        <img src={photo} alt="" className="profile-photo" />
        <div>
          <h2 style={{ margin:'0 0 6px' }}>{name}</h2>
          <p className="muted" style={{ margin:'0 0 12px' }}>{title}</p>
          <ul className="profile-bullets">
            {(bullets.length ? bullets : [
              'Designing calm, clear interfaces',
              'Shipping fast, measuring outcomes',
              'Writing about product, UX, and growth'
            ]).slice(0,4).map((b,i)=> <li key={i}>{b}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
