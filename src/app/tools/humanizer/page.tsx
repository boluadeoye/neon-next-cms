'use client';

import React, { useState } from 'react';
import { Wand2, Copy, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function HumanizerTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // METRICS (The "Score")
  const [stats, setStats] = useState({ burstiness: 0, complexity: 0, score: 0 });

  // --- THE ALGORITHM (Local "Zero-Cost" Analysis) ---
  const analyzeText = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return { burstiness: 0, complexity: 0, score: 0 };

    // 1. Calculate Burstiness (Variance in sentence length)
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / lengths.length;
    const burstiness = Math.min(100, Math.round(Math.sqrt(variance) * 5));

    // 2. Calculate Complexity (Average word length + unique words)
    const words = text.trim().split(/\s+/);
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const complexity = Math.min(100, Math.round((uniqueWords / words.length) * 100));

    // 3. The "Human Score" (Heuristic)
    // High burstiness + High complexity = More Human
    const score = Math.round((burstiness + complexity) / 2);

    return { burstiness, complexity, score };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const txt = e.target.value;
    setInput(txt);
    setStats(analyzeText(txt));
  };

  // --- THE ACTION ---
  const handleHumanize = async () => {
    setIsProcessing(true);
    
    // TODO: Connect this to Gemini Free API in Phase 2
    // For now, we simulate the "Humanization" process
    setTimeout(() => {
      const fakeHumanized = input
        .replace(/furthermore/gi, "also")
        .replace(/in conclusion/gi, "basically")
        .replace(/utilize/gi, "use")
        .replace(/moreover/gi, "plus")
        .replace(/is important to note/gi, "keep in mind");
      
      setOutput(fakeHumanized);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" />
            <span>Stealth<span className="text-emerald-500">Writer</span> Protocol</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            ZERO-COST AI BYPASS ENGINE // V1.0
          </p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <div className="text-right">
            <div className="text-slate-500">BURSTINESS</div>
            <div className={`text-lg font-bold ${stats.burstiness > 50 ? 'text-emerald-400' : 'text-amber-500'}`}>
              {stats.burstiness}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-slate-500">HUMAN SCORE</div>
            <div className={`text-lg font-bold ${stats.score > 70 ? 'text-emerald-400' : 'text-rose-500'}`}>
              {stats.score}/100
            </div>
          </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 h-[70vh]">
        
        {/* INPUT (AI) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input (AI Generated)</label>
          <textarea 
            value={input}
            onChange={handleInputChange}
            placeholder="Paste your AI-generated text here..."
            className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl p-6 text-slate-300 focus:outline-none focus:border-emerald-500/50 resize-none font-mono text-sm leading-relaxed"
          />
        </div>

        {/* OUTPUT (HUMAN) */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex justify-between">
            <span>Output (Humanized)</span>
            {output && <Copy size={14} className="cursor-pointer hover:text-white" />}
          </label>
          <div className="flex-1 bg-[#0a0a0a] border border-emerald-500/20 rounded-xl p-6 text-emerald-100/90 relative overflow-hidden">
            {isProcessing && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="animate-spin text-emerald-500" size={32} />
                  <span className="text-xs font-mono text-emerald-500 animate-pulse">REWRITING PATTERNS...</span>
                </div>
              </div>
            )}
            <textarea 
              readOnly
              value={output}
              placeholder="Humanized output will appear here..."
              className="w-full h-full bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

      </div>

      {/* CONTROLS */}
      <div className="max-w-6xl mx-auto mt-6 flex justify-center">
        <button 
          onClick={handleHumanize}
          disabled={!input || isProcessing}
          className="flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 size={20} />
          <span>HUMANIZE TEXT</span>
        </button>
      </div>

    </main>
  );
}
