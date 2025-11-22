export default function Home() {
  return (
    <>
      <h1>Neon + Next.js CMS</h1>
      <p>Starter stack with Vercel (Next.js) + Neon (Postgres). Auth + Admin built-in.</p>

      <div className="grid">
        <a className="card" href="/admin">
          <h3>Admin</h3>
          <p>Manage content. Requires login.</p>
        </a>
        <a className="card" href="/login">
          <h3>Login</h3>
          <p>Sign in with your admin account.</p>
        </a>
        <a className="card" href="/register">
          <h3>Register</h3>
          <p>Only works for the very first admin user.</p>
        </a>
        <a className="card" href="/api/health">
          <h3>Health</h3>
          <p>Database connectivity check.</p>
        </a>
      </div>
    </>
  );
}
