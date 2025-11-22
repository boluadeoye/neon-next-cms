export default function Home() {
  return (
    <main>
      <h1>Next.js + Neon CMS starter</h1>
      <p>Site: {process.env.NEXT_PUBLIC_SITE_NAME ?? 'My Site'}</p>
      <a href="/api/health">Check /api/health</a>
    </main>
  );
}
