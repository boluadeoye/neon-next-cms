import './globals.css';
import 'easymde/dist/easymde.min.css';
import HeaderBrand from '../components/HeaderBrand';
import HeaderAvatar from '../components/HeaderAvatar';
import SiteFooter from '../components/SiteFooter';
import { Playfair_Display, Inter } from 'next/font/google';

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400','600','700','800'],
  variable: '--font-display',
  display: 'swap'
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site',
  description: 'Editorial portfolio & blog'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable}`}>
      <body style={{ fontFamily: 'var(--font-sans)' }}>
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
