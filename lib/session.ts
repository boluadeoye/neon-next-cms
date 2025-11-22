import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export async function getSession() {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload;
}
