export default function PostCard({ title, slug, excerpt, date }: { title: string; slug: string; excerpt?: string | null; date?: string | null }) {
  return (
    <a className="card" href={`/blog/${encodeURIComponent(slug)}`}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {excerpt ? <p className="muted" style={{ margin: '8px 0 0' }}>{excerpt}</p> : null}
      {date ? <p className="muted" style={{ margin: '8px 0 0', fontSize: 13 }}>{new Date(date).toLocaleDateString()}</p> : null}
    </a>
  );
}
