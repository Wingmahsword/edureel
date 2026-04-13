"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, ChevronUp, ChevronDown, Zap } from "lucide-react";

const REELS = [
  {
    id: 1,
    category: "Prompting",
    title: "Master ChatGPT Prompting in 60 Seconds",
    creator: "AI Guru · Sam Chen",
    avatar: "SC",
    description: "Learn the RACI framework for perfect prompts. Role, Action, Context, Instructions = 10x better outputs. #PromptEngineering #AI",
    likes: 24800,
    comments: 342,
    shares: 1200,
    duration: "0:58",
    gradient: "from-violet-600 to-purple-900",
    tags: ["#PromptEngineering", "#ChatGPT", "#AI"],
    course: "Prompt Engineering Mastery",
    badge: "AI Guru",
    badgeColor: "bg-violet-500",
  },
  {
    id: 2,
    category: "Creator Course",
    title: "Build Your First AI Agent in 2 Minutes",
    creator: "Creator · Priya Mehta",
    avatar: "PM",
    description: "Step-by-step: connect LangChain to your OpenAI key, add memory, deploy. No PhD needed. #LangChain #Agent #BuildInPublic",
    likes: 18400,
    comments: 289,
    shares: 940,
    duration: "2:04",
    gradient: "from-amber-500 to-orange-800",
    tags: ["#LangChain", "#AIAgent", "#BuildInPublic"],
    course: "AI Agent Development",
    badge: "Creator",
    badgeColor: "bg-amber-500",
  },
  {
    id: 3,
    category: "Anthropic",
    title: "Claude's Constitutional AI Explained",
    creator: "Anthropic Official",
    avatar: "AN",
    description: "How Claude stays safe and helpful. Constitutional AI trains models with human feedback on ethics, not just capability. #Claude #AnthropicAI",
    likes: 31200,
    comments: 512,
    shares: 2100,
    duration: "1:32",
    gradient: "from-emerald-500 to-teal-900",
    tags: ["#Claude", "#ConstitutionalAI", "#Anthropic"],
    course: "Responsible AI Development",
    badge: "Anthropic",
    badgeColor: "bg-emerald-500",
  },
  {
    id: 4,
    category: "Microsoft",
    title: "Azure OpenAI vs Direct API — Which to Use?",
    creator: "Microsoft Learn",
    avatar: "MS",
    description: "Enterprise security, SLA, compliance — Azure wins for corp. Speed & simplicity — direct API wins for startups. Know your use case. #Azure #OpenAI",
    likes: 14700,
    comments: 201,
    shares: 780,
    duration: "1:15",
    gradient: "from-blue-600 to-indigo-900",
    tags: ["#Azure", "#OpenAI", "#Enterprise"],
    course: "Azure AI Fundamentals",
    badge: "Microsoft",
    badgeColor: "bg-blue-500",
  },
  {
    id: 5,
    category: "Prompting",
    title: "Chain-of-Thought: Why AI Gets Smarter",
    creator: "AI Guru · Maya Patel",
    avatar: "MP",
    description: "Add 'Think step by step' to any prompt. Watch accuracy jump 40%. CoT unlocks hidden reasoning. #ChainOfThought #PromptTips",
    likes: 22100,
    comments: 398,
    shares: 1560,
    duration: "0:47",
    gradient: "from-pink-600 to-rose-900",
    tags: ["#ChainOfThought", "#PromptTips", "#LLM"],
    course: "Advanced Prompting",
    badge: "AI Guru",
    badgeColor: "bg-violet-500",
  },
];

const CATEGORIES = ["All", "Prompting", "Creator Course", "Anthropic", "Microsoft", "AI Guru"];

export default function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [muted, setMuted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showLikeAnim, setShowLikeAnim] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === "All" ? REELS : REELS.filter(r => r.category === activeCategory);
  const reel = filtered[currentIndex] ?? filtered[0];

  const go = (dir: 1 | -1) => {
    setCurrentIndex(i => Math.max(0, Math.min(filtered.length - 1, i + dir)));
  };

  const handleLike = (id: number) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
    setShowLikeAnim(true);
    setTimeout(() => setShowLikeAnim(false), 800);
  };

  useEffect(() => { setCurrentIndex(0); }, [activeCategory]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") go(-1);
      if (e.key === "ArrowDown") go(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [filtered.length]);

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  if (!reel) return null;

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden pt-16">
      {/* Category sidebar */}
      <div className="hidden md:flex flex-col w-44 border-r border-zinc-800 pt-6 gap-1 px-2">
        <p className="text-xs text-zinc-500 uppercase tracking-widest px-3 mb-2">Explore</p>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
              activeCategory === cat
                ? "bg-violet-600/20 text-violet-400 font-medium"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reel viewer */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Reel card */}
        <div
          ref={containerRef}
          className={`relative w-full max-w-sm h-[calc(100vh-64px)] bg-gradient-to-b ${reel.gradient} flex flex-col justify-end overflow-hidden select-none`}
          onDoubleClick={() => handleLike(reel.id)}
        >
          {/* Animated BG pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-white blur-2xl animate-pulse delay-700" />
          </div>

          {/* Top bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${reel.badgeColor}`}>
              {reel.badge}
            </span>
            <span className="text-xs text-white/70 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              {reel.duration}
            </span>
          </div>

          {/* Center play indicator */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-20 h-20 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-b-8 border-l-16 border-t-transparent border-b-transparent border-l-white ml-1" style={{borderLeftWidth: '20px'}} />
            </div>
          </div>

          {/* Double-tap heart animation */}
          {showLikeAnim && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <Heart className="w-24 h-24 text-white fill-white animate-ping opacity-80" />
            </div>
          )}

          {/* Bottom content */}
          <div className="relative z-10 p-4 pb-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-24">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
                {reel.avatar}
              </div>
              <span className="text-white text-sm font-medium">{reel.creator}</span>
              <button className="ml-auto text-xs border border-white/60 text-white px-3 py-0.5 rounded-full hover:bg-white hover:text-black transition-all">
                Follow
              </button>
            </div>
            <h3 className="text-white font-bold text-base mb-1">{reel.title}</h3>
            <p className="text-white/70 text-sm line-clamp-2 mb-2">{reel.description}</p>
            <div className="flex gap-2 flex-wrap">
              {reel.tags.map(t => (
                <span key={t} className="text-xs text-white/60">{t}</span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white/80 text-xs">From: <span className="text-white font-medium">{reel.course}</span></span>
              <button className="ml-auto text-xs text-violet-300 hover:text-violet-100 font-medium">Enroll →</button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute right-4 md:right-8 bottom-28 flex flex-col items-center gap-5 z-20">
          <button onClick={() => handleLike(reel.id)} className="flex flex-col items-center gap-1 group">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${liked[reel.id] ? "bg-red-500" : "bg-zinc-800/80 backdrop-blur-sm group-hover:bg-zinc-700"}`}>
              <Heart className={`w-5 h-5 ${liked[reel.id] ? "fill-white text-white" : "text-white"}`} />
            </div>
            <span className="text-white text-xs">{fmt(reel.likes + (liked[reel.id] ? 1 : 0))}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-11 h-11 rounded-full bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-zinc-700 transition-all">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xs">{fmt(reel.comments)}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-11 h-11 rounded-full bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-zinc-700 transition-all">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xs">{fmt(reel.shares)}</span>
          </button>

          <button onClick={() => setSaved(prev => ({ ...prev, [reel.id]: !prev[reel.id] }))} className="flex flex-col items-center gap-1 group">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${saved[reel.id] ? "bg-violet-600" : "bg-zinc-800/80 backdrop-blur-sm group-hover:bg-zinc-700"}`}>
              <Bookmark className={`w-5 h-5 ${saved[reel.id] ? "fill-white text-white" : "text-white"}`} />
            </div>
          </button>

          <button onClick={() => setMuted(m => !m)} className="flex flex-col items-center gap-1 group">
            <div className="w-11 h-11 rounded-full bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-zinc-700 transition-all">
              {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </div>
          </button>
        </div>

        {/* Up/Down navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 z-20">
          <button onClick={() => go(-1)} disabled={currentIndex === 0} className="w-9 h-9 rounded-full bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center disabled:opacity-30 hover:bg-zinc-700 transition-all">
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
          <span className="text-zinc-500 text-xs">{currentIndex + 1} / {filtered.length}</span>
          <button onClick={() => go(1)} disabled={currentIndex === filtered.length - 1} className="w-9 h-9 rounded-full bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center disabled:opacity-30 hover:bg-zinc-700 transition-all">
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Mobile category tabs */}
        <div className="md:hidden absolute top-4 left-0 right-0 flex gap-2 px-4 z-30 overflow-x-auto scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs px-3 py-1 rounded-full transition-all ${activeCategory === cat ? "bg-violet-600 text-white" : "bg-zinc-800/80 text-zinc-400 backdrop-blur-sm"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
