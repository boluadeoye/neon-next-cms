'use client';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '';
  return (
    <nav className="nav">
      {!isHome && <a href="/">Home</a>}
      {isHome
        ? <a href="/blog" className="chip-shine">Blog</a>
        : <a href="/blog">Blog</a>
      }
    </nav>
  );
}
