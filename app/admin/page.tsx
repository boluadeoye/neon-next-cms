export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div className="admin-card">
      <h1 style={{ marginTop: 0 }}>Admin</h1>
      <p className="sec-sub" style={{ marginTop: 6 }}>Quick links</p>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:12 }}>
        <a className="btn btn-ochre" href="/admin/posts/new">New Post</a>
        <a className="btn" href="/admin/posts">Manage Posts</a>
        <a className="btn" href="/admin/pages">Manage Pages</a>
        <a className="btn" href="/admin/media">Media</a>
        <a className="btn btn-ghost" href="/admin/settings">Settings</a>
      </div>
    </div>
  );
}
