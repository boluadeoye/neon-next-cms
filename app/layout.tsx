import './globals.css';
import 'easymde/dist/easymde.min.css';
import HeaderBrand from '../components/HeaderBrand';

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
            <HeaderBrand />
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/blog">Blog</a>
              <a href="/admin">Admin</a>
              <a href="/admin/posts">Posts</a>
              <a href="/admin/pages">Pages</a>
              <a href="/admin/media">Media</a>
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
