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
  try {
    // FIX: Simple select. If columns are missing, we handle it in JS.
    const rows = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    ` as unknown as DbUser[];

    const u = rows?.[0];
    if (!u) {
      console.warn(`[AUTH] User not found: ${email}`);
      return null;
    }

    // Support both old 'password' and new 'password_hash' columns
    const hash = u.password_hash || u.password;
    
    if (!hash) {
      console.error(`[AUTH] User found but no password hash: ${email}`);
      return null;
    }

    const ok = await bcrypt.compare(password, String(hash));
    if (!ok) {
      console.warn(`[AUTH] Password mismatch for: ${email}`);
      return null;
    }

    return { id: u.id, name: u.name, email: u.email };
  } catch (error) {
    console.error('[AUTH_DB_ERROR]', error);
    throw error; 
  }
}

export async function createUser(name: string, email: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  try {
    // Try inserting with password_hash first
    const ins = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${hash})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email
    ` as unknown as DbUser[];

    if (ins?.[0]) return ins[0];

    const sel = await sql`SELECT id, name, email FROM users WHERE email=${email} LIMIT 1` as unknown as DbUser[];
    return sel?.[0] || null;
  } catch (error) {
    console.error('[CREATE_USER_ERROR]', error);
    throw error;
  }
}
