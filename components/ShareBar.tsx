'use client';

function IconX(){ return (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2.1h-3.2l-4.2 5.6L7.3 2.1H2.7l6 8.1-6.3 8.7h3.2l4.6-6.2 4.6 6.2h4.6l-6.7-8.9 6.6-8z"/>
  </svg>
);}
function IconLinkedIn(){ return (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 23h5V7H0v16zm7.5-16H12v2.2h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.7V23h-5v-6.7c0-1.6 0-3.7-2.3-3.7-2.3 0-2.6 1.8-2.6 3.6V23h-5V7z"/>
  </svg>
);}
function IconFacebook(){ return (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.94.17 1.94.17v2.14H14.5c-1.2 0-1.6.74-1.6 1.5V12h2.73l-.44 2.9H12.9v7A10 10 0 0 0 22 12z"/>
  </svg>
);}
function IconWhatsApp(){ return (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M.5 24l1.7-6.1A11 11 0 1 1 12 23a10.9 10.9 0 0 1-5.3-1.4L.5 24zM12 3a9 9 0 0 0-7.8 13.5l-.5 1.9 2-.5A9 9 0 1 0 12 3zm5 10.3c-.1-.2-.5-.3-1-.5s-.6-.2-.8.1-.9 1-1 1.1-.3.2-.7 0a7.3 7.3 0 0 1-3.6-3.1c-.3-.5.3-.5.8-1.5.1-.2 0-.3 0-.5l-.4-1c-.1-.2-.3-.4-.5-.3l-.9.1c-.2 0-.5.2-.6.5-.3.6-.9 1.8 0 3.3a10 10 0 0 0 4.6 4.4c2.5 1.1 3.1.9 3.7.8s1.8-.7 2-1.5.2-1.4.1-1.6z"/>
  </svg>
);}

export default function ShareBar({ title, url }: { title: string; url: string }) {
  const shareData = { title, url };

  async function nativeShare() {
    try { if (navigator.share) await navigator.share(shareData); } catch {}
  }

  const x  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const li = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;

  return (
    <div className="icon-row">
      <button className="btn btn-ghost" onClick={nativeShare} aria-label="Share">Share</button>
      <a className="icon-chip icon-x" href={x}  target="_blank" rel="noopener noreferrer" aria-label="Share on X"><IconX/></a>
      <a className="icon-chip icon-linkedin" href={li} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><IconLinkedIn/></a>
      <a className="icon-chip icon-facebook" href={fb} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"><IconFacebook/></a>
      <a className="icon-chip icon-whatsapp" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp"><IconWhatsApp/></a>
    </div>
  );
}
