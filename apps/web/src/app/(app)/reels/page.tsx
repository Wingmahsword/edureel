"use client";

import { useState, useRef, useCallback } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, Zap, MoreHorizontal, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const REELS = [
  { id: 1, category: "Prompting", title: "Master ChatGPT Prompting in 60 Seconds", creator: "Sam Chen", handle: "@aiguru.sam", avatar: "SC", avatarColor: "#7c3aed", description: "Learn the RACI framework for perfect prompts. Role, Action, Context, Instructions = 10x better outputs.", likes: 24800, comments: 342, shares: 1200, duration: "0:58", bg: "linear-gradient(180deg,#0d0d0d 0%,#1a0a2e 60%,#000 100%)", accent: "#7c3aed", tags: ["#PromptEngineering","#ChatGPT","#AI"], course: "Prompt Engineering Mastery", sound: "Original audio · Sam Chen" },
  { id: 2, category: "Creator", title: "Build Your First AI Agent in 2 Minutes", creator: "Priya Mehta", handle: "@priya.builds", avatar: "PM", avatarColor: "#d97706", description: "Connect LangChain to your OpenAI key, add memory, deploy in minutes. No PhD required.", likes: 18400, comments: 289, shares: 940, duration: "2:04", bg: "linear-gradient(180deg,#0d0d0d 0%,#1f1200 60%,#000 100%)", accent: "#d97706", tags: ["#LangChain","#AIAgent","#BuildInPublic"], course: "AI Agent Development", sound: "Original audio · Priya Mehta" },
  { id: 3, category: "Anthropic", title: "Claude's Constitutional AI Explained", creator: "Anthropic", handle: "@anthropic", avatar: "AN", avatarColor: "#059669", description: "How Claude stays safe and helpful. Constitutional AI trains models with human feedback on ethics.", likes: 31200, comments: 512, shares: 2100, duration: "1:32", bg: "linear-gradient(180deg,#0d0d0d 0%,#061a12 60%,#000 100%)", accent: "#059669", tags: ["#Claude","#ConstitutionalAI","#Anthropic"], course: "Responsible AI Development", sound: "Anthropic Educational Series" },
  { id: 4, category: "Microsoft", title: "Azure OpenAI vs Direct API — Which Wins?", creator: "Microsoft Learn", handle: "@mslearn", avatar: "MS", avatarColor: "#2563eb", description: "Enterprise security, SLA, compliance — Azure wins for corp. Speed and simplicity — direct API for startups.", likes: 14700, comments: 201, shares: 780, duration: "1:15", bg: "linear-gradient(180deg,#0d0d0d 0%,#060d1f 60%,#000 100%)", accent: "#2563eb", tags: ["#Azure","#OpenAI","#Enterprise"], course: "Azure AI Fundamentals", sound: "Microsoft Learn Audio" },
  { id: 5, category: "Prompting", title: "Chain-of-Thought: Why AI Gets Smarter", creator: "Maya Patel", handle: "@maya.ai", avatar: "MP", avatarColor: "#db2777", description: "Add 'Think step by step' to any prompt. Watch accuracy jump 40%. CoT unlocks hidden reasoning.", likes: 22100, comments: 398, shares: 1560, duration: "0:47", bg: "linear-gradient(180deg,#0d0d0d 0%,#1f0614 60%,#000 100%)", accent: "#db2777", tags: ["#ChainOfThought","#PromptTips","#LLM"], course: "Advanced Prompting", sound: "Original audio · Maya Patel" },
];

const CATEGORIES = ["For You", "Prompting", "Creator", "Anthropic", "Microsoft"];

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

function ReelCard({ reel, active }: { reel: typeof REELS[0]; active: boolean }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [muted, setMuted] = useState(true);
  const [heartAnim, setHeartAnim] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const handleDoubleTap = useCallback(() => {
    setTapCount(c => c + 1);
    if (tapCount === 0) {
      setTimeout(() => setTapCount(0), 300);
    } else {
      setLiked(true);
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 900);
      setTapCount(0);
    }
  }, [tapCount]);

  return (
    <div
      className="snap-item relative w-full flex-shrink-0 select-none cursor-pointer"
      style={{ height: "calc(100vh - 64px)", background: reel.bg }}
      onClick={handleDoubleTap}
    >
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

      {/* Colored glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 opacity-20" style={{ background: `radial-gradient(ellipse at 50% 100%, ${reel.accent}55 0%, transparent 70%)` }} />

      {/* Top: category pill */}
      <div className="absolute top-4 left-4 z-20">
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${reel.accent}22`, color: reel.accent, border: `1px solid ${reel.accent}44` }}>
          {reel.category}
        </span>
      </div>

      {/* Top right: mute + more */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button onClick={e => { e.stopPropagation(); setMuted(m => !m); }} className="w-8 h-8 rounded-full glass-dark flex items-center justify-center">
          {muted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
        </button>
        <button className="w-8 h-8 rounded-full glass-dark flex items-center justify-center">
          <MoreHorizontal className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {/* Double-tap heart */}
      <AnimatePresence>
        {heartAnim && (
          <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 1.4, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <Heart className="w-28 h-28 fill-white text-white" style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.5))" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pb-6 z-10"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }}
      >
        {/* Creator */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/20"
            style={{ background: `${reel.accent}33`, border: `2px solid ${reel.accent}` }}>
            {reel.avatar}
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">{reel.creator}</p>
            <p className="text-white/50 text-xs mt-0.5">{reel.handle}</p>
          </div>
          <button onClick={e => e.stopPropagation()}
            className="ml-2 text-xs font-semibold px-4 py-1 rounded-full border border-white/70 text-white hover:bg-white hover:text-black transition-all">
            Follow
          </button>
        </div>

        {/* Title & desc */}
        <h3 className="text-white font-bold text-[15px] leading-snug mb-1.5">{reel.title}</h3>
        <p className="text-white/65 text-sm leading-relaxed line-clamp-2 mb-2.5">{reel.description}</p>

        {/* Tags */}
        <p className="text-sm" style={{ color: reel.accent }}>
          {reel.tags.join(" ")}
        </p>

        {/* Sound */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <Music2 className="w-3 h-3 text-white/40" />
          <span className="text-white/40 text-xs truncate">{reel.sound}</span>
        </div>

        {/* Course CTA */}
        <button onClick={e => e.stopPropagation()}
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl w-full"
          style={{ background: `${reel.accent}18`, border: `1px solid ${reel.accent}33` }}>
          <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: reel.accent }} />
          <span className="text-white/80 text-xs">Course: <span className="text-white font-medium">{reel.course}</span></span>
          <span className="ml-auto text-xs font-medium" style={{ color: reel.accent }}>Enroll →</span>
        </button>
      </div>

      {/* Right action bar */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-20">
        <button onClick={e => { e.stopPropagation(); setLiked(l => !l); }} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 1.3 }} className="w-10 h-10 rounded-full glass-dark flex items-center justify-center">
            <Heart className={`w-5 h-5 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />
          </motion.div>
          <span className="text-white text-[11px] font-medium">{fmt(reel.likes + (liked ? 1 : 0))}</span>
        </button>

        <button onClick={e => e.stopPropagation()} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 1.2 }} className="w-10 h-10 rounded-full glass-dark flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-white text-[11px] font-medium">{fmt(reel.comments)}</span>
        </button>

        <button onClick={e => e.stopPropagation()} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 1.2 }} className="w-10 h-10 rounded-full glass-dark flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-white text-[11px] font-medium">{fmt(reel.shares)}</span>
        </button>

        <button onClick={e => { e.stopPropagation(); setSaved(s => !s); }} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 1.2 }} className="w-10 h-10 rounded-full glass-dark flex items-center justify-center">
            <Bookmark className={`w-5 h-5 transition-colors ${saved ? "fill-white text-white" : "text-white"}`} />
          </motion.div>
        </button>

        {/* Spinning album art */}
        <div className="w-9 h-9 rounded-full ring-2 ring-white/20 overflow-hidden flex items-center justify-center"
          style={{ background: `${reel.accent}33`, animation: active ? "spin 4s linear infinite" : "none" }}>
          <Music2 className="w-4 h-4 text-white/60" />
        </div>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  const [activeCategory, setActiveCategory] = useState("For You");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const filtered = activeCategory === "For You" ? REELS : REELS.filter(r => r.category === activeCategory);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollTop / (window.innerHeight - 64));
    setActiveIdx(idx);
  }, []);

  return (
    <div className="flex h-screen bg-black overflow-hidden pt-16">
      {/* Desktop left sidebar */}
      <div className="hidden lg:flex flex-col w-52 border-r pt-8 gap-0.5 px-3" style={{ borderColor: "#1a1a1a" }}>
        <p className="text-[11px] font-semibold tracking-widest px-3 mb-3" style={{ color: "#666" }}>EXPLORE</p>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className="text-left px-3 py-2.5 rounded-xl text-sm transition-all"
            style={activeCategory === cat
              ? { background: "rgba(124,58,237,0.12)", color: "#a78bfa" }
              : { color: "#666" }
            }>
            {activeCategory === cat && <span className="inline-block w-1 h-1 rounded-full bg-violet-500 mr-2 mb-0.5" />}
            {cat}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="flex-1 flex items-start justify-center overflow-hidden bg-black">
        {/* Mobile top tabs */}
        <div className="lg:hidden absolute top-16 left-0 right-0 z-30 px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none"
          style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.9) 0%, transparent 100%)" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full transition-all"
              style={activeCategory === cat
                ? { background: "#fff", color: "#000" }
                : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }
              }>
              {cat}
            </button>
          ))}
        </div>

        {/* Snap scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full max-w-[430px] h-full overflow-y-scroll scrollbar-none"
          style={{ scrollSnapType: "y mandatory" }}
        >
          {filtered.map((reel, i) => (
            <ReelCard key={reel.id} reel={reel} active={i === activeIdx} />
          ))}
        </div>
      </div>
    </div>
  );
}
