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

  // Suggestion: Use your name as the brand. 
  // Fallback to 'Layo' instead of 'The Novelist'
  const name = (map.hero_name as string) || 'Layo';
  const role = (map.hero_title as string) || 'Writer';

  return (
    <a href="/" aria-label="Home" style={{ textDecoration: 'none', display: 'block' }}>
      <HeaderBrandClient name={name} role={role} />
    </a>
  );
}
