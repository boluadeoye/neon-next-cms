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
    // FIX: Select everything. If a column is missing in DB, this might still error 
    // depending on the driver, but it's safer than the weird CASE statement.
    // Better yet, let's assume the schema is correct or fail gracefully.
    const rows = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    ` as unknown as DbUser[];

    const u = rows?.[0];
    if (!u) {
      console.warn(`[AUTH] User not found: ${email}`);
      return null;
    }

    // Handle legacy 'password' vs new 'password_hash'
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
    throw error; // Let the route handler catch this
  }
}

export async function createUser(name: string, email: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  try {
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
