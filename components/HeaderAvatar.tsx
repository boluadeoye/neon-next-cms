import { sql } from '../lib/db';

export default async function HeaderAvatar() {
  const rows = (await sql`SELECT value FROM settings WHERE key = 'hero_avatar_url' LIMIT 1`) as any[];
  const url = rows[0]?.value
    ?? 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=300&auto=format&fit=crop';
  return <img className="header-avatar" src={String(url)} alt="Profile" />;
}
