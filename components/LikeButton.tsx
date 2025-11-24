'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LikeButton({ slug, initialCount=0, initiallyLiked=false }:{ slug:string; initialCount?:number; initiallyLiked?:boolean }) {
  const [count,setCount]=useState(initialCount);
  const [liked,setLiked]=useState(initiallyLiked);
  const [busy,setBusy]=useState(false);
  async function toggle(){
    if(busy) return;
    setBusy(true);
    try{
      const r=await fetch('/api/public/likes',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ slug })});
      if(r.status===401){ await signIn('google'); return; }
      const d=await r.json(); if(d?.ok){ setLiked(Boolean(d.liked)); setCount(Number(d.count||0)); }
    } finally { setBusy(false); }
  }
  return <button onClick={toggle} className="like-pill" aria-pressed={liked}>{liked?'💛':'🤍'} {busy?'…':count}</button>;
}
