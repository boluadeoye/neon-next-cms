import { sql } from './db';
import bcrypt from 'bcryptjs';

type DbUser = {
  id: string;
  name: string | null;
  email: string;
  password_hash?: string | null;
  password?: string | null;
};

export async function verifyUser(email: string, password: string) {
  const rows = await sql/*sql*/`
    SELECT id, name, email,
           CASE
             WHEN EXISTS (SELECT 1) THEN password_hash
             ELSE NULL
           END AS password_hash,
           CASE
             WHEN EXISTS (SELECT 1) THEN password
             ELSE NULL
           END AS password
    FROM users
    WHERE email = ${email}
    LIMIT 1
  ` as unknown as DbUser[];

  const u = rows?.[0];
  if (!u) return null;

  const hash = (u as any).password_hash || (u as any).password || '';
  if (!hash) return null;

  const ok = await bcrypt.compare(password, String(hash));
  if (!ok) return null;

  return { id: u.id, name: u.name, email: u.email };
}

export async function createUser(name: string, email: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  const ins = await sql/*sql*/`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${hash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id, name, email
  ` as unknown as DbUser[];

  if (ins?.[0]) return ins[0];

  const sel = await sql/*sql*/`SELECT id, name, email FROM users WHERE email=${email} LIMIT 1` as unknown as DbUser[];
  return sel?.[0] || null;
}
