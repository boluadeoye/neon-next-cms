import { getTopNews } from '../lib/news';

export default async function NewsMiniList() {
  const items = await getTopNews(3, 6);
  if (!items.length) return null;
  return (
    <div className="widget" style={{ marginTop: 16 }}>
      <h3>Updates</h3>
      <div className="updates-list">
        {items.map((n, i) => (
          <a key={n.url + i} href={n.url} target="_blank" rel="noopener noreferrer" className="update-item" style={{ textDecoration:'none' }}>
            {n.image ? <img className="update-thumb" src={n.image} alt="" /> : <div className="update-thumb" />}
            <div>
              <p className="update-title">{n.title}</p>
              <div className="update-meta">{n.source}{n.publishedAt ? ' • ' + new Date(n.publishedAt).toLocaleDateString() : ''}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
