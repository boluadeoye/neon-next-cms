import bcrypt from 'bcryptjs';
import { sql } from './db';

export async function getUserByEmail(email: string) {
  const rows = await sql<any>`SELECT id, email, name, role, password_hash FROM users WHERE email = ${email} LIMIT 1`;
  return rows[0] || null;
}

export async function createUser(email: string, name: string, password: string) {
  const password_hash = await bcrypt.hash(password, 10);
  const rows = await sql<any>`
    INSERT INTO users (email, name, password_hash)
    VALUES (${email}, ${name}, ${password_hash})
    RETURNING id, email, name, role
  `;
  return rows[0];
}

export async function verifyUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function usersCount(): Promise<number> {
  const rows = await sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM users`;
  const count = (rows as any)[0]?.count ?? 0;
  return typeof count === 'number' ? count : parseInt(String(count || 0), 10);
}
