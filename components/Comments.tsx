'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

type User = { id?: string|null; name?: string|null; image?: string|null };
type Comment = { id:number; message:string; created_at:string; likes:number; parent_id?:number|null; user?:User|null; children?:Comment[] };

export default function Comments({ slug }: { slug: string }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<Comment[]>([]);
  const [msg, setMsg] = useState('');
  const [replyTo, setReplyTo] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);

  async function load(){ const r=await fetch(`/api/public/comments?slug=${encodeURIComponent(slug)}`,{cache:'no-store'}); const d=await r.json(); setItems(d.comments||[]); }
  useEffect(()=>{ load(); },[slug]);

  async function submit(e:React.FormEvent){ e.preventDefault(); if(!msg.trim()) return;
    if (status !== 'authenticated') { await signIn('google'); return; }
    setLoading(true);
    try{
      const r=await fetch('/api/public/comments',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ slug, message: msg.trim(), parentId: replyTo })});
      if (r.status===401){ await signIn('google'); return; }
      const d=await r.json();
      if(d?.ok&&d.comment){
        if(replyTo){ setItems(p=>p.map(c=>c.id===replyTo?{...c,children:[...(c.children||[]),d.comment]}:c)); }
        else { setItems(p=>[...p,d.comment]); }
        setMsg(''); setReplyTo(null);
      }
    } finally { setLoading(false); }
  }

  async function likeComment(id:number){
    const r=await fetch(`/api/public/comments/${id}/like`,{method:'POST'});
    if (r.status===401){ await signIn('google'); return; }
    const d=await r.json();
    if(d?.ok){ setItems(prev=>update(prev,id,d.likes)); }
  }
  function update(list:Comment[], id:number, likes:number):Comment[]{ return list.map(c=> c.id===id?{...c,likes}: (c.children?.length?{...c,children:update(c.children,id,likes)}:c)); }

  return (
    <div className="comments-wrap">
      <h3 className="sec-title">Comments</h3>
      <div style={{display:'grid',gap:12}}>
        {items.map(c=><Node key={c.id} c={c} onReply={setReplyTo} onLike={likeComment} />)}
        {items.length===0?<p className="sec-sub">Be the first to comment.</p>:null}
      </div>
      <form className="comment-form" onSubmit={submit} style={{marginTop:12}}>
        {status!=='authenticated' ? (
          <button type="button" className="btn btn-ghost" onClick={()=>signIn('google')}>Sign in with Google to comment</button>
        ) : (
          <>
            {replyTo ? <div className="sec-sub">Replying to #{replyTo} <button type="button" className="link" onClick={()=>setReplyTo(null)}>cancel</button></div> : null}
            <textarea className="input" placeholder="Write a thoughtful comment…" value={msg} onChange={e=>setMsg(e.target.value)} required rows={4}/>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-ochre" type="submit" disabled={loading}>{loading?'Posting…':'Post comment'}</button>
              <button className="btn btn-ghost" type="button" onClick={()=>signOut()}>Sign out</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

function Node({c,onReply,onLike}:{c:Comment;onReply:(id:number)=>void;onLike:(id:number)=>void}){
  return (
    <div className="comment-card">
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        {c.user?.image ? <img src={c.user.image!} alt="" style={{width:28,height:28,borderRadius:'50%'}}/> : <div style={{width:28,height:28,borderRadius:'50%',background:'#e5e9f2'}}/>}
        <div>
          <div className="comment-author">{c.user?.name || 'Reader'}</div>
          <div className="comment-time">{new Date(c.created_at).toLocaleString()}</div>
        </div>
      </div>
      <div className="comment-body" style={{marginTop:8}}>{c.message}</div>
      <div className="comment-actions" style={{display:'flex',gap:10,marginTop:8}}>
        <button type="button" className="chip-nav" onClick={()=>onLike(c.id)}>❤️ {c.likes||0}</button>
        <button type="button" className="chip-nav" onClick={()=>onReply(c.id)}>Reply</button>
      </div>
      {c.children?.length ? <div style={{borderLeft:'2px solid rgba(0,0,0,.06)',marginTop:10,paddingLeft:10,display:'grid',gap:10}}>
        {c.children.map(k=><Node key={k.id} c={k} onReply={onReply} onLike={onLike}/>)}
      </div> : null}
    </div>
  );
}
