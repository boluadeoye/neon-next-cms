'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Login failed');
      window.location.href = '/admin';
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Login</h1>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-row">
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="form-row">
          <label className="label">Password</label>
          <input className="input" value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </div>
        <button className="btn btn-primary" disabled={loading} type="submit">{loading ? '...' : 'Login'}</button>
        <p className="help">First time? <a href="/register">Create admin</a></p>
        {msg && <p className="error">{msg}</p>}
      </form>
    </>
  );
}
