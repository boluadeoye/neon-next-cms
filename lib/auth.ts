import bcrypt from 'bcryptjs';
import { sql } from './db';

type DbUserFull = {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'editor' | 'author';
  password_hash: string;
};

type DbUser = Omit<DbUserFull, 'password_hash'>;

export async function getUserByEmail(email: string) {
  const rows = (await sql`
    SELECT id, email, name, role, password_hash
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `) as DbUserFull[];
  return rows[0] || null;
}

export async function createUser(email: string, name: string, password: string) {
  const password_hash = await bcrypt.hash(password, 10);
  const rows = (await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (${email}, ${name}, ${password_hash})
    RETURNING id, email, name, role
  `) as DbUser[];
  return rows[0];
}

export async function verifyUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  const { password_hash, ...safe } = user;
  return safe as DbUser;
}

export async function usersCount(): Promise<number> {
  const rows = (await sql`SELECT COUNT(*)::int AS count FROM users`) as { count: number }[];
  const count = rows?.[0]?.count ?? 0;
  return typeof count === 'number' ? count : parseInt(String(count || 0), 10);
}
