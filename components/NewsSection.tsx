import Reveal from './Reveal';
import { getTopNews } from '../lib/news';

export default async function NewsSection() {
  const items = await getTopNews(4, 9);
  if (!items.length) return null;

  return (
    <section className="section container">
      <div className="sec-head">
        <h2 className="sec-title">Latest News</h2>
        <p className="sec-sub">From trusted sources (auto-refreshed)</p>
      </div>
      <div className="news-grid">
        {items.map((n, i) => (
          <Reveal key={n.url + i} delay={i * 0.04}>
            <a className="news-card" href={n.url} target="_blank" rel="noopener noreferrer">
              {n.image ? <img className="news-thumb" src={n.image} alt="" /> : <div className="news-thumb" />}
              <div>
                <h3 className="news-title">{n.title}</h3>
                <div className="news-meta">{n.source} {n.publishedAt ? '• ' + new Date(n.publishedAt).toLocaleDateString() : ''}</div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
