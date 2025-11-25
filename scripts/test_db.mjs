import { neon } from '@neondatabase/serverless';
import { readFileSync, existsSync } from 'fs';
function load(p){ if(!existsSync(p)) return; for(const line of readFileSync(p,'utf8').split(/\r?\n/)){ const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m){ let v=m[2]; if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v=v.slice(1,-1); if(!(m[1] in process.env)) process.env[m[1]]=v; } } }
if(!process.env.DATABASE_URL){ load('.env.local'); load('.env'); }
if(!process.env.DATABASE_URL){ console.error('DATABASE_URL missing'); process.exit(1); }
const sql = neon(process.env.DATABASE_URL);
const r = await sql`select current_database() db, current_user usr`;
console.log('ok', r[0]);
