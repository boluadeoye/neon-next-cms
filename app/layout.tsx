import './globals.css';
import 'easymde/dist/easymde.min.css';
import HeaderBrand from '../components/HeaderBrand';
import HeaderAvatar from '../components/HeaderAvatar';
import SiteFooter from '../components/SiteFooter';
import NavLinks from '../components/NavLinks';
import { Cormorant_Garamond, Sora } from 'next/font/google';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  variable: '--font-display',
  display: 'swap'
});
const sans = Sora({
  subsets: ['latin'],
  weight: ['400','500','600','700','800'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site',
  description: 'Editorial portfolio & blog'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body style={{ fontFamily: 'var(--font-sans)' }}>
        <header className="header">
          <div className="container header-inner">
            <HeaderBrand />
            <div className="header-right">
              <NavLinks />
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
