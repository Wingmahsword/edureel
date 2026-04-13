"use client";

import { useState } from "react";
import { BookOpen, ChevronRight, Star, Clock, Users, Zap, CheckCircle2, Lock, Play, Award } from "lucide-react";
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
    <div className="min-h-screen bg-zinc-950 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">AI Learning Library</h1>
          <p className="text-zinc-400 text-sm">Free courses from Anthropic, Microsoft, Google, Hugging Face, and more.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Enrolled", value: enrolledIds.size, icon: <BookOpen className="w-4 h-4 text-violet-400" />, color: "border-violet-500/20 bg-violet-500/5" },
            { label: "Completed", value: 0, icon: <Award className="w-4 h-4 text-amber-400" />, color: "border-amber-500/20 bg-amber-500/5" },
            { label: "Credits Earned", value: 320, icon: <Zap className="w-4 h-4 text-emerald-400" />, color: "border-emerald-500/20 bg-emerald-500/5" },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-4 ${s.color} text-center`}>
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-zinc-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-full border transition-all ${
                activeFilter === f ? "bg-violet-600 border-violet-600 text-white" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
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
                  <div className={`border rounded-2xl p-5 transition-all cursor-pointer bg-gradient-to-br ${course.gradient} ${course.border} group`}>
                    {/* Provider */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{course.logo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${course.providerColor}`}>{course.provider}</span>
                      <span className="ml-auto text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{course.price}</span>
                    </div>

                    <h3 className="text-white font-bold text-base mb-2 group-hover:text-violet-300 transition-colors">{course.title}</h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{course.description}</p>

                    {/* Tags */}
                    <div className="flex gap-1.5 mb-4 flex-wrap">
                      {course.tags.map(tag => (
                        <span key={tag} className="text-xs text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.chapters} chapters</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(course.students / 1000).toFixed(1)}k</span>
                      <span className="flex items-center gap-1 text-amber-400"><Star className="w-3 h-3 fill-amber-400" />{course.rating}</span>
                    </div>

                    {/* Progress or Enroll */}
                    {isEnrolled ? (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-400">Progress</span>
                          <span className="text-violet-400">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-violet-600 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-violet-400 font-medium group-hover:gap-3 transition-all">
                          <Play className="w-4 h-4 fill-violet-400" />
                          {course.progress > 0 ? "Continue Reading" : "Start Reading"}
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleEnroll(course.id, e)}
                        className="w-full py-2 rounded-xl text-sm font-medium border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4 text-amber-400" />Enroll Free
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
