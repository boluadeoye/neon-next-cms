'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Toast = { id: number; title: string; type?: 'success' | 'error' | 'info' };

export function toast(msg: string, type: Toast['type']='success') {
  window.dispatchEvent(new CustomEvent('toast', { detail: { msg, type } }));
}

export default function ToasterClient() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    let id = 0;
    const onToast = (e: any) => {
      id += 1;
      const t: Toast = { id, title: e.detail?.msg || '', type: e.detail?.type || 'success' };
      setItems((prev) => [...prev, t]);
      setTimeout(() => setItems((prev) => prev.filter(x => x.id !== t.id)), 2500);
    };
    window.addEventListener('toast', onToast as any);
    return () => window.removeEventListener('toast', onToast as any);
  }, []);

  return (
    <div style={{ position:'fixed', left:'50%', bottom:18, transform:'translateX(-50%)', zIndex:1000, pointerEvents:'none' }}>
      <AnimatePresence>
        {items.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale:.98 }}
            animate={{ opacity: 1, y: 0, scale:1 }}
            exit={{ opacity: 0, y: 10, scale:.98 }}
            transition={{ duration:.22, ease:'easeOut' }}
            style={{
              marginTop:8, pointerEvents:'auto',
              background: t.type==='error' ? '#7f1d1d' : (t.type==='info' ? '#0b1f36' : '#0D2340'),
              color:'#fff', border:'1px solid rgba(255,255,255,.18)',
              borderRadius:12, padding:'10px 14px',
              boxShadow:'0 14px 30px rgba(13,35,64,.28)'
            }}
          >
            {t.title}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
