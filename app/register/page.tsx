'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Registration failed');
      window.location.href = '/admin';
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Create Admin</h1>
      <p className="help">Allowed only if no users exist yet.</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-row">
          <label className="label">Name (optional)</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} type="text" />
        </div>
        <div className="form-row">
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="form-row">
          <label className="label">Password</label>
          <input className="input" value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </div>
        <button className="btn btn-primary" disabled={loading} type="submit">{loading ? '...' : 'Create Admin'}</button>
        <p className="help">Already have an account? <a href="/login">Login</a></p>
        {msg && <p className="error">{msg}</p>}
      </form>
    </>
  );
}
