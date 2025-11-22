import './globals.css';
import 'easymde/dist/easymde.min.css';
import HeaderBrand from '../components/HeaderBrand';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site',
  description: 'Minimal, fast, editorial.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="navbar">
          <div className="container navbar-inner">
            <HeaderBrand />
            <nav className="nav">
              <a href="/">Home</a>
              <a href="/blog">Blog</a>
              {/* Admin route exists but intentionally not linked */}
            </nav>
          </div>
        </header>
        <main id="main" className="container">{children}</main>
        <footer className="footer">
          <div className="container"><SiteFooter /></div>
        </footer>
      </body>
    </html>
  );
}
