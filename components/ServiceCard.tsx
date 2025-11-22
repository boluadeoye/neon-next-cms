'use client';
import { motion } from 'framer-motion';
import { PenTool, Megaphone, Rocket } from 'lucide-react';

const ICONS: Record<string, any> = { design: PenTool, marketing: Megaphone, launch: Rocket };

export default function ServiceCard({ icon='design', title, desc }:{
  icon?: 'design'|'marketing'|'launch'; title: string; desc: string;
}) {
  const Icon = ICONS[icon] || PenTool;
  return (
    <motion.div
      className="service"
      whileHover={{ y: -4, boxShadow: '0 8px 28px rgba(16,24,40,.12)' }}
      transition={{ type:'spring', stiffness: 260, damping: 20 }}
    >
      <Icon size={22} color="#7c3aed" />
      <h4>{title}</h4>
      <p>{desc}</p>
    </motion.div>
  );
}
