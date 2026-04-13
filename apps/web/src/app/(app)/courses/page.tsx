"use client";

import { useState } from "react";
import { BookOpen, Star, Clock, Users, Zap, CheckCircle2, Lock, Play, Award, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const COURSES = [
  {
    id: "anthropic-intro",
    title: "Introduction to Responsible AI",
    provider: "Anthropic",
    providerColor: "bg-emerald-500",
    logo: "🌿",
    description: "Learn the principles behind Constitutional AI, how Claude works, and best practices for safe AI deployment. Officially curated by Anthropic.",
    chapters: 8, duration: "2.5 hours", students: 14200, rating: 4.9,
    price: "Free",
    tags: ["Safety", "Ethics", "Claude"],
    gradient: "from-emerald-900/40 to-teal-900/20",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    progress: 60,
    enrolled: true,
  },
  {
    id: "microsoft-azure",
    title: "Azure AI Fundamentals",
    provider: "Microsoft Learn",
    providerColor: "bg-blue-500",
    logo: "🪟",
    description: "Master Azure Cognitive Services, build AI solutions on Microsoft cloud, and prepare for the AI-900 certification. Official Microsoft curriculum.",
    chapters: 12, duration: "4 hours", students: 22800, rating: 4.7,
    price: "Free",
    tags: ["Azure", "Cloud", "Certification"],
    gradient: "from-blue-900/40 to-indigo-900/20",
    border: "border-blue-500/20 hover:border-blue-500/50",
    progress: 25,
    enrolled: true,
  },
  {
    id: "prompt-mastery",
    title: "Prompt Engineering Mastery",
    provider: "EduSpark",
    providerColor: "bg-violet-500",
    logo: "⚡",
    description: "From zero to expert: chain-of-thought, few-shot learning, RAG, and agentic prompting. Used by 10,000+ students to land AI jobs.",
    chapters: 15, duration: "6 hours", students: 31000, rating: 4.9,
    price: "Free",
    tags: ["Prompting", "LLM", "Career"],
    gradient: "from-violet-900/40 to-purple-900/20",
    border: "border-violet-500/20 hover:border-violet-500/50",
    progress: 0,
    enrolled: false,
  },
  {
    id: "google-ml",
    title: "Machine Learning Crash Course",
    provider: "Google",
    providerColor: "bg-red-500",
    logo: "🔴",
    description: "Google's official ML course with TensorFlow. Covers linear models, neural networks, embeddings, and real-world case studies.",
    chapters: 20, duration: "8 hours", students: 45000, rating: 4.8,
    price: "Free",
    tags: ["ML", "TensorFlow", "Google"],
    gradient: "from-red-900/40 to-orange-900/20",
    border: "border-red-500/20 hover:border-red-500/50",
    progress: 0,
    enrolled: false,
  },
  {
    id: "huggingface",
    title: "NLP with Transformers",
    provider: "Hugging Face",
    providerColor: "bg-yellow-500",
    logo: "🤗",
    description: "The official Hugging Face NLP course. Build text classifiers, summarizers, and question-answering models using transformers.",
    chapters: 10, duration: "5 hours", students: 18500, rating: 4.8,
    price: "Free",
    tags: ["NLP", "Transformers", "Python"],
    gradient: "from-yellow-900/40 to-amber-900/20",
    border: "border-yellow-500/20 hover:border-yellow-500/50",
    progress: 0,
    enrolled: false,
  },
  {
    id: "deepmind",
    title: "Deep Learning Foundations",
    provider: "DeepMind Education",
    providerColor: "bg-indigo-500",
    logo: "🧠",
    description: "DeepMind's introduction to deep learning concepts — backpropagation, CNNs, RNNs, and attention mechanisms explained visually.",
    chapters: 14, duration: "7 hours", students: 9800, rating: 4.9,
    price: "Free",
    tags: ["Deep Learning", "Neural Nets"],
    gradient: "from-indigo-900/40 to-blue-900/20",
    border: "border-indigo-500/20 hover:border-indigo-500/50",
    progress: 0,
    enrolled: false,
  },
];

const FILTERS = ["All", "Enrolled", "Free", "Certification"];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(
    new Set(COURSES.filter(c => c.enrolled).map(c => c.id))
  );

  const filtered = COURSES.filter(c => {
    if (activeFilter === "Enrolled") return enrolledIds.has(c.id);
    if (activeFilter === "Free") return c.price === "Free";
    if (activeFilter === "Certification") return c.tags.some(t => t === "Certification");
    return true;
  });

  const handleEnroll = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setEnrolledIds(prev => {
      const next = new Set(Array.from(prev));
      next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "#000" }}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Learning Library</h1>
          <p className="text-sm" style={{ color: "#666" }}>Free courses from Anthropic, Microsoft, Google, Hugging Face, and more.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Enrolled", value: enrolledIds.size, color: "#7c3aed" },
            { label: "Completed", value: 0, color: "#d97706" },
            { label: "Credits", value: 320, color: "#059669" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: "#111", border: "1px solid #1a1a1a" }}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: s.color }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 text-sm px-4 py-1.5 rounded-full font-medium transition-all"
              style={activeFilter === f
                ? { background: "#fff", color: "#000" }
                : { background: "#111", color: "#666", border: "1px solid #1a1a1a" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((course, i) => {
            const isEnrolled = enrolledIds.has(course.id);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/courses/${course.id}/read`}>
                  <div className="rounded-2xl p-5 cursor-pointer group transition-all"
                    style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#333")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#1a1a1a")}>
                    {/* Provider */}
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="text-2xl">{course.logo}</span>
                      <div>
                        <p className="text-white text-sm font-semibold leading-none">{course.provider}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#555" }}>Official Course</p>
                      </div>
                      <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(5,150,105,0.1)", color: "#34d399" }}>{course.price}</span>
                    </div>

                    <h3 className="text-white font-bold text-[15px] leading-snug mb-2 group-hover:text-violet-300 transition-colors">{course.title}</h3>
                    <p className="text-sm line-clamp-2 mb-4 leading-relaxed" style={{ color: "#666" }}>{course.description}</p>

                    {/* Tags */}
                    <div className="flex gap-1.5 mb-4 flex-wrap">
                      {course.tags.map(tag => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#1a1a1a", color: "#555" }}>{tag}</span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs mb-4" style={{ color: "#444" }}>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.chapters} ch</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(course.students / 1000).toFixed(1)}k</span>
                      <span className="flex items-center gap-1" style={{ color: "#f59e0b" }}><Star className="w-3 h-3 fill-amber-400" />{course.rating}</span>
                    </div>

                    {/* Progress or Enroll */}
                    {isEnrolled ? (
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span style={{ color: "#555" }}>Progress</span>
                          <span style={{ color: "#a78bfa" }}>{course.progress}%</span>
                        </div>
                        <div className="h-0.5 rounded-full overflow-hidden mb-3" style={{ background: "#1a1a1a" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${course.progress}%`, background: "#7c3aed" }} />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#a78bfa" }}>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          {course.progress > 0 ? "Continue" : "Start Reading"}
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </div>
                      </div>
                    ) : (
                      <button onClick={(e) => handleEnroll(course.id, e)}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                        style={{ background: "#1a1a1a", color: "#fff", border: "1px solid #262626" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#7c3aed")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#1a1a1a")}>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />Enroll Free
                      </button>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
