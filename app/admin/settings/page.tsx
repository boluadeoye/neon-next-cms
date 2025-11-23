'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [form, setForm] = useState<any>({
    site_name:'', site_description:'',
    hero_name:'', hero_title:'', hero_bio:'', hero_avatar_url:'', hero_cover_url:'',
    hero_birthday:'', hero_phone:'', hero_email:'', hero_location:'',
    hero_social_twitter:'', hero_social_linkedin:'', hero_social_github:'',
    hero_bullets:'', news_feeds:''
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(){
    setLoading(true); setMsg(null);
    const res = await fetch('/api/admin/settings', { cache:'no-store' });
    const data = await res.json();
    if (res.ok) {
      setForm((prev:any)=>({
        ...prev, ...Object.fromEntries(Object.entries(data.settings||{}).map(([k,v]: any)=>[k, typeof v==='string'?v:v?.value]))
      }));
    } else setMsg(data?.error || 'Failed');
    setLoading(false);
  }
  async function save(e:React.FormEvent){
    e.preventDefault(); setMsg(null);
    const res = await fetch('/api/admin/settings', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    const data = await res.json(); setMsg(res.ok ? 'Saved!' : (data?.error || 'Error'));
  }
  useEffect(()=>{ load(); }, []);

  function Field({label, name, type='text', placeholder='' }:{label:string; name:string; type?:string; placeholder?:string}){
    return (
      <div className="form-row">
        <label className="label">{label}</label>
        <input className="input" type={type} value={form[name]||''} onChange={e=>setForm({...form,[name]:e.target.value})} placeholder={placeholder} />
      </div>
    )
  }

  return (
    <div className="admin-card">
      <h1 style={{ marginTop:0 }}>Settings</h1>
      {loading ? <p className="sec-sub">Loading…</p> : null}
      {msg && <p className="sec-sub">{msg}</p>}

      <form className="form" onSubmit={save}>
        <Field label="Site Name" name="site_name" />
        <Field label="Site Description" name="site_description" />

        <hr className="div" />
        <h3>Hero (Home)</h3>
        <Field label="Name" name="hero_name" />
        <Field label="Title/Role" name="hero_title" />
        <Field label="Bio (one line)" name="hero_bio" />
        <Field label="Avatar URL (header photo)" name="hero_avatar_url" placeholder="https://..." />
        <Field label="Hero Cover URL (background image)" name="hero_cover_url" placeholder="https://..." />
        <Field label="Birthday" name="hero_birthday" />
        <Field label="Phone" name="hero_phone" />
        <Field label="Email" name="hero_email" />
        <Field label="Location" name="hero_location" />

        <hr className="div" />
        <h3>Social (optional)</h3>
        <Field label="Twitter / X" name="hero_social_twitter" placeholder="https://twitter.com/..." />
        <Field label="LinkedIn" name="hero_social_linkedin" placeholder="https://linkedin.com/in/..." />
        <Field label="Instagram (or paste here)" name="hero_social_github" placeholder="https://instagram.com/..." />

        <hr className="div" />
        <h3>Hero bullets (optional; one per line)</h3>
        <div className="form-row">
          <textarea className="input" rows={4} value={form.hero_bullets||''} onChange={e=>setForm({...form,hero_bullets:e.target.value})} placeholder={"Weekly essays on life and culture\nSimple words, strong ideas"} />
        </div>

        <hr className="div" />
        <h3>News Feeds (optional; one RSS URL per line)</h3>
        <div className="form-row">
          <textarea className="input" rows={4} value={form.news_feeds||''} onChange={e=>setForm({...form,news_feeds:e.target.value})} placeholder={"https://feeds.foxnews.com/foxnews/latest\nhttps://dailypost.ng/feed/"} />
        </div>

        <button className="btn btn-ochre" type="submit">Save</button>
      </form>
    </div>
  );
}
