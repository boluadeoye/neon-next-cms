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
    <main style={{ maxWidth: 420, margin: '40px auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 16 }}>
      <h1>Create Admin</h1>
      <p style={{ color: '#555' }}>Allowed only if no users exist yet.</p>
      <form onSubmit={onSubmit}>
        <label>Name<br />
          <input value={name} onChange={e => setName(e.target.value)} type="text" style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        </label>
        <label>Email<br />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        </label>
        <label>Password<br />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        </label>
        <button disabled={loading} type="submit" style={{ padding: '8px 12px' }}>{loading ? '...' : 'Create Admin'}</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <a href="/login">Login</a>
      </p>
      {msg && <p style={{ color: 'crimson' }}>{msg}</p>}
    </main>
  );
}
