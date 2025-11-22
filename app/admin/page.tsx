import { redirect } from 'next/navigation';
import { getSession } from '../../lib/session';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <>
      <h1>Admin Dashboard</h1>
      <p>Signed in as {String(session?.email)} ({String(session?.role)})</p>

      <div className="grid" style={{ marginTop: 20 }}>
        <a className="card" href="/">
          <h3>Home</h3>
          <p>Back to the site</p>
        </a>
        <a className="card" href="/api/health">
          <h3>Health</h3>
          <p>DB status</p>
        </a>
        <a className="card" href="/api/auth/logout">
          <h3>Logout</h3>
          <p>End session</p>
        </a>
      </div>
    </>
  );
}
