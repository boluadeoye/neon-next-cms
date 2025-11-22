'use client';
export default function ShareBar({ title, url }: { title: string; url: string }) {
  const shareData = { title, url };
  async function nativeShare() {
    try {
      if (navigator.share) await navigator.share(shareData);
      else window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,'_blank');
    } catch {}
  }
  const x  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const li = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
  return (
    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
      <button className="share-chip" onClick={nativeShare}>Share</button>
      <a className="share-chip" href={x}  target="_blank" rel="noopener noreferrer">X</a>
      <a className="share-chip" href={li} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a className="share-chip" href={fb} target="_blank" rel="noopener noreferrer">Facebook</a>
      <a className="share-chip" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </div>
  );
}
