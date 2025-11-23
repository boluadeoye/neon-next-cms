import { sql } from '../lib/db';
import HeroEditorialClient from './HeroEditorialClient';

function val(v:any, fallback=''){ return typeof v === 'string' ? v : (v?.value ?? fallback); }

export default async function HeroEditorial(){
  const rows = (await sql`
    SELECT key, value FROM settings
    WHERE key = ANY(${[
      'hero_name','hero_bio','hero_social_twitter','hero_social_linkedin','hero_social_github'
    ]})
  `) as { key:string; value:any }[];

  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  const name = val(map.hero_name, 'Omolayo');
  const subcopy = val(map.hero_bio, 'I write clear, compelling stories that move people to action.');
  const links = {
    portfolio: '/portfolio',
    resume: '/resume',
    blog: '/blog',
    x: val(map.hero_social_twitter, '') || '',
    linkedin: val(map.hero_social_linkedin, '') || '',
    instagram: val(map.hero_social_github, '') || '' // reuse if desired
  };

  return <HeroEditorialClient name={name} subcopy={subcopy} links={links} />;
}
