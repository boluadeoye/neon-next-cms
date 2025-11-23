import { sql } from '../lib/db';

export default async function HeaderBrand() {
  // Pull name + role from settings; fall back to Omolayo / Writer
  const rows = (await sql`
    SELECT key, value FROM settings
    WHERE key = ANY(${['hero_name','hero_title']})
  `) as { key:string; value:any }[];

  const map = Object.fromEntries(rows.map(r => [r.key, typeof r.value === 'string' ? r.value : r.value?.value]));
  const name = (map.hero_name as string) || 'Omolayo';
  const role = (map.hero_title as string) || 'Writer';

  return (
    <a href="/" aria-label="Home" style={{ textDecoration:'none' }}>
      <div className="brand-lockup">
        <span className="brand-title">{name}</span>
        <span className="brand-sub">{role}</span>
      </div>
    </a>
  );
}
