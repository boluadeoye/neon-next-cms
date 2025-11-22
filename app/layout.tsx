import './globals.css';
import 'easymde/dist/easymde.min.css';

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site',
  description: 'Next.js + Neon CMS'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <div className="navbar-inner">
            <div className="brand">{process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site'}</div>
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/admin">Admin</a>
              <a href="/admin/posts">Posts</a>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
              <a href="/api/health">Health</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
