'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [site_name, setSiteName] = useState('');
  const [site_description, setSiteDescription] = useState('');
  const [site_og_image, setSiteOg] = useState('');
  const [site_twitter, setSiteTwitter] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setSiteName(data.settings?.site_name || '');
      setSiteDescription(data.settings?.site_description || '');
      setSiteOg(data.settings?.site_og_image || '');
      setSiteTwitter(data.settings?.site_twitter || '');
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site_name, site_description, site_og_image, site_twitter })
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data?.error || 'Save failed');
    setMsg('Saved!');
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <h1>Settings</h1>
      {loading ? <p>Loading...</p> : null}
      {msg && <p className="help">{msg}</p>}
      <form className="form" onSubmit={save}>
        <div className="form-row">
          <label className="label">Site Name</label>
          <input className="input" value={site_name} onChange={(e)=>setSiteName(e.target.value)} />
        </div>
        <div className="form-row">
          <label className="label">Site Description</label>
          <input className="input" value={site_description} onChange={(e)=>setSiteDescription(e.target.value)} />
        </div>
        <div className="form-row">
          <label className="label">OG Image URL</label>
          <input className="input" value={site_og_image} onChange={(e)=>setSiteOg(e.target.value)} placeholder="https://..." />
        </div>
        <div className="form-row">
          <label className="label">Twitter (e.g. @handle)</label>
          <input className="input" value={site_twitter} onChange={(e)=>setSiteTwitter(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </>
  );
}
