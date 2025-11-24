'use client';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '';
  return (
    <nav className="nav" style={{ display:'flex', gap:12 }}>
      {!isHome && <a className="nav-chip" href="/">Home</a>}
      {isHome
        ? <a href="/blog" className="chip-shine chip-home-wider">Blog</a>
        : <a href="/blog" className="nav-chip">Blog</a>
      }
    </nav>
  );
}
