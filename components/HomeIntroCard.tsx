export default function HomeIntroCard() {
  return (
    <section className="intro-card pro-intro">
      <div className="intro-content">
        <h2 className="intro-title">Welcome</h2>

        <p className="intro-copy">
          A living studio of essays, culture notes, and field reports — edited with care.
          New writing lands often. Start with the blog or browse selected work.
        </p>

        <div className="intro-actions">
          <a href="/blog" className="btn btn-ochre btn-pulse-strong finger-dangle" aria-label="Read the blog">
            Read the blog
          </a>
          <a href="/portfolio" className="btn btn-ghost btn-pulse-soft" aria-label="Open the portfolio">
            Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
