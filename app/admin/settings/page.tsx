'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [form, setForm] = useState<any>({
    site_name:'', site_description:'',
    hero_name:'', hero_title:'', hero_bio:'', hero_avatar_url:'',
    hero_birthday:'', hero_phone:'', hero_email:'', hero_location:'',
    hero_social_twitter:'', hero_social_linkedin:'', hero_social_github:''
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(){
    setLoading(true); setMsg(null);
    const res = await fetch('/api/admin/settings', { cache:'no-store' });
    const data = await res.json();
    if(res.ok){
      setForm((prev:any) => ({ ...prev, ...Object.fromEntries(Object.entries(data.settings||{}).map(([k,v]: any)=>[k, typeof v==='string'?v:v?.value])) }));
    } else { setMsg(data?.error || 'Failed'); }
    setLoading(false);
  }

  async function save(e:React.FormEvent){
    e.preventDefault(); setMsg(null);
    const res = await fetch('/api/admin/settings', {
      method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)
    });
    const data = await res.json();
    setMsg(res.ok ? 'Saved!' : (data?.error || 'Error'));
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
    <>
      <h1>Settings</h1>
      {loading ? <p>Loading...</p> : null}
      {msg && <p className="muted">{msg}</p>}

      <form className="form" onSubmit={save} style={{maxWidth:760}}>
        <Field label="Site Name" name="site_name" />
        <Field label="Site Description" name="site_description" />

        <hr className="div" />
        <h3>Hero (Home)</h3>
        <Field label="Name" name="hero_name" />
        <Field label="Title" name="hero_title" />
        <Field label="Bio" name="hero_bio" />
        <Field label="Avatar URL" name="hero_avatar_url" />
        <Field label="Birthday" name="hero_birthday" />
        <Field label="Phone" name="hero_phone" />
        <Field label="Email" name="hero_email" />
        <Field label="Location" name="hero_location" />

        <hr className="div" />
        <h3>Social (optional)</h3>
        <Field label="Twitter" name="hero_social_twitter" placeholder="@handle" />
        <Field label="LinkedIn" name="hero_social_linkedin" placeholder="https://linkedin.com/in/..." />
        <Field label="GitHub" name="hero_social_github" placeholder="https://github.com/..." />

        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </>
  );
}
