"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Menu, X, CheckCircle2, Circle, Minus, Plus, Zap, StickyNote } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const COURSE_DATA: Record<string, {
  title: string; provider: string; logo: string;
  chapters: { id: number; title: string; duration: string; content: string }[];
}> = {
  "anthropic-intro": {
    title: "Introduction to Responsible AI",
    provider: "Anthropic", logo: "🌿",
    chapters: [
      { id: 1, title: "What is Constitutional AI?", duration: "12 min", content: `# What is Constitutional AI?\n\nConstitutional AI (CAI) is Anthropic's approach to making AI systems that are safe, beneficial, and understandable.\n\n## The Core Idea\n\nInstead of relying solely on human feedback for every decision, Constitutional AI trains models using a *set of principles* — a "constitution" — that guides the AI's behavior.\n\n> "The goal is to train a helpful, harmless, and honest AI assistant using a set of principles during training rather than relying only on human feedback."\n> — Anthropic Research Team\n\n## Why Does It Matter?\n\nTraditional RLHF (Reinforcement Learning from Human Feedback) requires human labelers to evaluate thousands of outputs. This is:\n\n- **Expensive** — requires large teams of annotators\n- **Inconsistent** — humans disagree on edge cases\n- **Slow** — bottlenecked by human availability\n\nConstitutional AI solves this by having the model itself evaluate outputs against a written constitution.\n\n## The Two Phases\n\n**Phase 1: Supervised Learning from AI Feedback (SL-CAI)**\n1. The model generates responses\n2. It evaluates its own responses against constitutional principles\n3. It revises responses to better align with those principles\n4. The revised responses become training data\n\n**Phase 2: RL from AI Feedback (RLAIF)**\n1. The model generates pairs of responses\n2. A "preference model" trained on constitutional principles ranks them\n3. The original model is fine-tuned using these AI-generated preferences\n\n## Key Principles in Anthropic's Constitution\n\nThe constitution includes principles like:\n- Choose the response that is least likely to contain harmful or unethical content\n- Choose the response that is most helpful, honest, and thoughtful\n- Choose the response that a reasonable person would find most ethical\n\n## Summary\n\nConstitutional AI represents a shift from "learning what humans prefer" to "learning to reason about principles." This makes Claude more predictable, more consistent, and easier to align with human values at scale.` },
      { id: 2, title: "Claude's Design Philosophy", duration: "10 min", content: `# Claude's Design Philosophy\n\nClaude is Anthropic's AI assistant, built from the ground up with safety and helpfulness as co-equal goals.\n\n## The Three Core Properties\n\nClaude is designed to be:\n\n### 1. Helpful\nClaude aims to genuinely help users accomplish their goals. This means going beyond surface-level responses to understand what users actually need.\n\n### 2. Harmless\nClaude avoids producing content that could cause real-world harm — whether physical, psychological, or societal.\n\n### 3. Honest\nClaude acknowledges uncertainty, admits mistakes, and doesn't try to create false impressions.\n\n## Why "Harmless AND Helpful" Is Hard\n\nThere's a natural tension: being maximally helpful sometimes means providing information that could be misused. Being maximally harmless could mean refusing too many requests.\n\nAnthropic's insight is that *genuine helpfulness* and *genuine safety* are more complementary than they are in conflict — a truly helpful assistant wouldn't help someone harm others.\n\n## Claude's Personality\n\nBeyond safety properties, Claude has a distinct character:\n- Intellectual curiosity across all domains\n- Warmth and care for the humans it interacts with\n- Playful wit balanced with substance and depth\n- Directness and openness to other viewpoints\n\nThis personality emerged through training but is genuinely Claude's own — not a performance.` },
      { id: 3, title: "AI Safety Principles", duration: "15 min", content: `# AI Safety Principles\n\nUnderstanding AI safety is essential for anyone working with or deploying AI systems.\n\n## What Is AI Safety?\n\nAI safety is the field of research dedicated to ensuring that AI systems behave in ways that are safe, beneficial, and aligned with human values — especially as they become more capable.\n\n## Key Concepts\n\n### Alignment\nThe challenge of ensuring an AI's goals and behaviors match human intentions. A misaligned AI might optimize for the wrong objective, causing unintended harm.\n\n**Example:** An AI tasked with "maximize user engagement" might learn to show outrage-inducing content because it keeps users on the platform — technically achieving the goal but harmful in practice.\n\n### Robustness\nAI systems should behave safely even in unusual or adversarial conditions — inputs they weren't specifically trained on.\n\n### Interpretability\nBeing able to understand *why* an AI system makes a particular decision. This is crucial for debugging, trust, and accountability.\n\n## The Alignment Tax\n\nThere's a common belief that making AI safer necessarily makes it less capable. Anthropic's research suggests this "alignment tax" is smaller than expected — and may even be negative (safe AI is also more useful AI).` },
    ]
  },
  "prompt-mastery": {
    title: "Prompt Engineering Mastery",
    provider: "EduSpark", logo: "⚡",
    chapters: [
      { id: 1, title: "The Anatomy of a Prompt", duration: "10 min", content: `# The Anatomy of a Prompt\n\nA prompt is your primary interface with an AI model. Understanding its structure unlocks dramatically better results.\n\n## The Four Core Components\n\n### 1. Role\nTell the model who it is.\n\n\`\`\`\nYou are an expert Python developer with 10 years of experience in backend systems.\n\`\`\`\n\n### 2. Context\nProvide relevant background.\n\n\`\`\`\nI am building a REST API for a fintech startup that needs to handle 10,000 concurrent users.\n\`\`\`\n\n### 3. Task\nBe specific about what you want.\n\n\`\`\`\nReview the following code snippet and identify any performance bottlenecks or security vulnerabilities.\n\`\`\`\n\n### 4. Format\nSpecify the output structure.\n\n\`\`\`\nRespond with: 1) A brief summary, 2) A numbered list of issues, 3) Fixed code\n\`\`\`\n\n## The RACI Framework\n\nA useful mnemonic for prompt construction:\n- **R**ole — Who is the AI?\n- **A**ction — What should it do?\n- **C**ontext — What background matters?\n- **I**nstructions — How should it respond?\n\n## Why Structure Matters\n\nLLMs are trained on human text, which tends to be structured. Structured prompts align with patterns the model has seen millions of times, leading to more predictable, higher-quality outputs.` },
      { id: 2, title: "Chain-of-Thought Prompting", duration: "12 min", content: `# Chain-of-Thought Prompting\n\nChain-of-thought (CoT) prompting is one of the most powerful techniques for improving LLM reasoning.\n\n## The Basic Idea\n\nAdd "Think step by step" to your prompt. This forces the model to show its work before giving an answer.\n\n**Without CoT:**\n> Q: Roger has 5 tennis balls. He buys 2 more cans, each with 3 balls. How many does he have?\n> A: 11\n\n**With CoT:**\n> Q: Roger has 5 tennis balls... Think step by step.\n> A: Roger starts with 5 balls. He buys 2 cans × 3 balls = 6 new balls. 5 + 6 = **11 balls total.**\n\n## Why It Works\n\nLLMs generate text token by token. By forcing the model to "think out loud," each token generation benefits from the reasoning tokens that came before it. The model essentially solves the problem in its context window.\n\n## Advanced CoT Techniques\n\n### Zero-Shot CoT\nSimply append: *"Let's think step by step."*\n\n### Few-Shot CoT\nProvide 2-3 worked examples before your question.\n\n### Self-Consistency\nGenerate multiple CoT paths, then take the majority answer. Dramatically improves accuracy on math/logic tasks.\n\n### Tree of Thought\nExplore multiple reasoning paths simultaneously, evaluate each, and select the best.` },
    ]
  },
};

const DEFAULT_COURSE = COURSE_DATA["anthropic-intro"];

export default function CourseReaderPage({ params }: { params: { id: string } }) {
  const course = COURSE_DATA[params.id] ?? DEFAULT_COURSE;
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState(17);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const chapter = course.chapters[currentChapter];
  const progress = Math.round((completed.size / course.chapters.length) * 100);

  const markDone = () => {
    setCompleted(prev => new Set(Array.from(prev).concat(chapter.id)));
    if (currentChapter < course.chapters.length - 1) setCurrentChapter(c => c + 1);
  };

  const renderContent = (raw: string) => {
    return raw.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h3 key={i} className="text-white font-semibold text-lg mt-6 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-white font-bold text-xl mt-8 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith("# ")) return <h1 key={i} className="text-white font-bold text-2xl mt-2 mb-4">{line.slice(2)}</h1>;
      if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-violet-500 pl-4 my-4 text-zinc-300 italic">{line.slice(2)}</blockquote>;
      if (line.startsWith("- ")) return <li key={i} className="text-zinc-300 ml-4 mb-1 list-disc">{line.slice(2)}</li>;
      if (/^\d+\. /.test(line)) return <li key={i} className="text-zinc-300 ml-4 mb-1 list-decimal">{line.replace(/^\d+\. /, "")}</li>;
      if (line.startsWith("```")) return <div key={i} className="bg-zinc-800 rounded-lg px-4 py-2 my-3 font-mono text-sm text-emerald-300" />;
      if (line.startsWith("**")) return <p key={i} className="text-zinc-300 mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />;
      if (line === "") return <div key={i} className="h-3" />;
      return <p key={i} className="text-zinc-300 mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-16 flex">
      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chapters sidebar */}
      <AnimatePresence>
        {(sidebarOpen) && (
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-16 left-0 bottom-0 w-72 bg-zinc-900 border-r border-zinc-800 z-50 flex flex-col lg:hidden"
          >
            <SidebarContent course={course} currentChapter={currentChapter} completed={completed} setCurrentChapter={(i) => { setCurrentChapter(i); setSidebarOpen(false); }} onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-zinc-800 fixed top-16 bottom-0 bg-zinc-900 z-10">
        <SidebarContent course={course} currentChapter={currentChapter} completed={completed} setCurrentChapter={setCurrentChapter} onClose={() => {}} />
      </aside>

      {/* Main reader */}
      <main className="flex-1 lg:ml-72 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-16 z-20 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 px-4 py-2 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden mx-2">
            <div className="h-full bg-violet-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-zinc-400 text-xs whitespace-nowrap">{progress}% complete</span>
          <div className="flex items-center gap-1 border-l border-zinc-800 pl-3">
            <button onClick={() => setFontSize(f => Math.max(14, f - 1))} className="text-zinc-500 hover:text-white p-1"><Minus className="w-3.5 h-3.5" /></button>
            <span className="text-zinc-500 text-xs w-8 text-center">{fontSize}px</span>
            <button onClick={() => setFontSize(f => Math.min(24, f + 1))} className="text-zinc-500 hover:text-white p-1"><Plus className="w-3.5 h-3.5" /></button>
          </div>
          <button onClick={() => setNoteOpen(n => !n)} className={`p-1.5 rounded-lg transition-all ${noteOpen ? "bg-amber-500/20 text-amber-400" : "text-zinc-500 hover:text-white"}`}>
            <StickyNote className="w-4 h-4" />
          </button>
          <Link href="/courses" className="text-zinc-500 hover:text-white text-xs hidden sm:block">← Library</Link>
        </div>

        {/* Content */}
        <div className="flex flex-1">
          <div className={`flex-1 max-w-2xl mx-auto px-6 py-10 transition-all`} style={{ fontSize: `${fontSize}px` }}>
            {/* Chapter header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                <span>{course.logo}</span>
                <span>{course.provider}</span>
                <span>·</span>
                <span>Chapter {currentChapter + 1} of {course.chapters.length}</span>
                <span>·</span>
                <span>{chapter.duration}</span>
              </div>
            </div>

            {/* Rendered content */}
            <div className="prose prose-invert max-w-none">
              {renderContent(chapter.content)}
            </div>

            {/* Bottom navigation */}
            <div className="mt-16 pt-8 border-t border-zinc-800 flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentChapter(c => Math.max(0, c - 1))}
                disabled={currentChapter === 0}
                className="flex items-center gap-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-all text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={markDone}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  completed.has(chapter.id)
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-violet-600 hover:bg-violet-500 text-white"
                }`}
              >
                {completed.has(chapter.id) ? (
                  <><CheckCircle2 className="w-4 h-4" /> Completed</>
                ) : (
                  <><Zap className="w-4 h-4" /> Mark Complete & Continue</>
                )}
              </button>

              <button
                onClick={() => setCurrentChapter(c => Math.min(course.chapters.length - 1, c + 1))}
                disabled={currentChapter === course.chapters.length - 1}
                className="flex items-center gap-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-all text-sm"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes panel */}
          <AnimatePresence>
            {noteOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden"
              >
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-white text-sm font-medium">My Notes</span>
                  <button onClick={() => setNoteOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Take notes here…"
                  className="flex-1 bg-transparent p-4 text-zinc-300 text-sm resize-none focus:outline-none placeholder-zinc-600"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ course, currentChapter, completed, setCurrentChapter, onClose }: {
  course: typeof DEFAULT_COURSE;
  currentChapter: number;
  completed: Set<number>;
  setCurrentChapter: (i: number) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{course.logo}</span>
          <div>
            <p className="text-white text-sm font-medium line-clamp-1">{course.title}</p>
            <p className="text-zinc-500 text-xs">{course.provider}</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-zinc-500"><X className="w-4 h-4" /></button>
      </div>

      <div className="p-3 text-xs text-zinc-500 border-b border-zinc-800 flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5" />
        {completed.size}/{course.chapters.length} chapters complete
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {course.chapters.map((ch, i) => {
          const isDone = completed.has(ch.id);
          return (
            <button
              key={ch.id}
              onClick={() => setCurrentChapter(i)}
              className={`w-full text-left p-3 rounded-xl mb-1 flex items-start gap-3 transition-all ${
                currentChapter === i
                  ? "bg-violet-600/20 border border-violet-500/30"
                  : "hover:bg-zinc-800"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isDone
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  : <Circle className={`w-4 h-4 ${currentChapter === i ? "text-violet-400" : "text-zinc-600"}`} />
                }
              </div>
              <div>
                <p className={`text-sm ${currentChapter === i ? "text-violet-300 font-medium" : isDone ? "text-zinc-400" : "text-zinc-300"}`}>
                  {ch.title}
                </p>
                <p className="text-zinc-600 text-xs mt-0.5">{ch.duration}</p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
