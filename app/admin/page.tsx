import { redirect } from 'next/navigation';
import { getSession } from '../../lib/session';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 16 }}>
      <h1>Admin Dashboard</h1>
      <p>Signed in as {String(session?.email)} ({String(session?.role)})</p>
      <p><a href="/api/auth/logout">Logout</a></p>
      <ul style={{ marginTop: 24 }}>
        <li><a href="/">Home</a></li>
        <li><a href="/api/health">Health</a></li>
      </ul>
    </main>
  );
}
