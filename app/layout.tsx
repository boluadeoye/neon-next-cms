import './globals.css';
import 'easymde/dist/easymde.min.css';
import HeaderBrand from '../components/HeaderBrand';
import HeaderAvatar from '../components/HeaderAvatar';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site',
  description: 'Portfolio & blog'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container header-inner">
            <HeaderBrand />
            <div className="header-right">
              <nav className="nav">
                <a href="/">Home</a>
                <a href="/blog">Blog</a>
              </nav>
              <HeaderAvatar />
            </div>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="container"><SiteFooter /></div>
        </footer>
      </body>
    </html>
  );
}
