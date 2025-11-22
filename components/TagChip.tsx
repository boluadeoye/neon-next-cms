export default function TagChip({ name, slug }: { name: string; slug: string }) {
  return <a className="tag" href={`/blog?tag=${encodeURIComponent(slug)}`}>#{name}</a>;
}
