import { sql } from '../lib/db';
import AboutWriterCardClient from './AboutWriterCardClient';

export default async function AboutWriterCard(){
  const rows = (await sql`
    SELECT key, value FROM settings
    WHERE key = ANY(${['hero_name','hero_title','hero_bullets']})
  `) as { key:string; value:any }[];
  const map = Object.fromEntries(rows.map(r=>[r.key,r.value]));
  const name = (typeof map.hero_name==='string'?map.hero_name:map.hero_name?.value) || 'Omolayo';
  const role = (typeof map.hero_title==='string'?map.hero_title:map.hero_title?.value) || 'Writer';
  let bullets: string[] = [];
  const raw = map.hero_bullets;
  if (Array.isArray(raw)) bullets = raw;
  else if (raw) bullets = String(raw).split('\n').map(s=>s.trim()).filter(Boolean);
  if (!bullets.length) bullets = [
    'Weekly essays on life and culture',
    'Ghostwrites for founders and public figures',
    'Simple words, strong ideas, careful research',
    'Open to collaborations and speaking'
  ];
  return <AboutWriterCardClient name={name} role={role} bullets={bullets} />;
}
