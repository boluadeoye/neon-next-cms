import { redirect } from 'next/navigation';
import { getSession } from '../../lib/session';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <section className="section admin-container">
      <nav className="admin-subnav">
        <a className="chip-nav" href="/admin">Dashboard</a>
        <a className="chip-nav" href="/admin/posts">Posts</a>
        <a className="chip-nav" href="/admin/pages">Pages</a>
        <a className="chip-nav" href="/admin/media">Media</a>
        <a className="chip-nav" href="/admin/settings">Settings</a>
        <a className="chip-nav" href="/api/auth/logout">Logout</a>
      </nav>
      <div className="admin-main">{children}</div>
    </section>
  );
}
