import { sql } from '../lib/db';
import HeaderBrandClient from './HeaderBrandClient';

export default async function HeaderBrand() {
  const rows = (await sql`
    SELECT key, value FROM settings
    WHERE key = ANY(${['hero_name','hero_title']})
  `) as { key:string; value:any }[];

  const map = Object.fromEntries(
    rows.map(r => [r.key, typeof r.value === 'string' ? r.value : r.value?.value])
  );

  const name = (map.hero_name as string) || 'Omolayo';
  const role = (map.hero_title as string) || 'Writer';

  // Clickable brand (no icons), animated letter-by-letter
  return (
    <a href="/" aria-label="Home" style={{ textDecoration: 'none' }}>
      <HeaderBrandClient name={name} role={role} />
    </a>
  );
}
