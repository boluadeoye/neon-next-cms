import { sql } from '../lib/db';

export default async function HeaderBrand() {
  const rows = (await sql`SELECT value FROM settings WHERE key = 'site_name' LIMIT 1`) as any[];
  const name = rows[0]?.value ?? process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site';
  return <div className="brand">{String(name)}</div>;
}
