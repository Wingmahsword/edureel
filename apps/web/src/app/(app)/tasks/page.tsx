"use client";

import { useState } from "react";
import { Zap, CheckCircle2, Clock, Star, Trophy, Lock, ChevronRight, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TASKS = [
  {
    id: 1, title: "Write 5 Chain-of-Thought Prompts", category: "Prompting",
    desc: "Create 5 prompts using the chain-of-thought technique for different domains: coding, math, creative writing, analysis, and planning.",
    credits: 50, difficulty: "Beginner", duration: "15 min",
    steps: ["Open the task editor below", "Write your 5 prompts in the provided fields", "Each prompt must include 'think step by step'", "Submit for AI review"],
    locked: false, completed: false, color: "violet",
  },
  {
    id: 2, title: "Build a Prompt Template Library", category: "Prompting",
    desc: "Design a reusable template library with 10 prompts covering customer support, content creation, data analysis, coding help, and research.",
    credits: 120, difficulty: "Intermediate", duration: "30 min",
    steps: ["Create 10 structured prompt templates", "Each template needs: Role, Context, Task, Format fields", "Test each template with an AI model", "Document outputs"],
    locked: false, completed: false, color: "amber",
  },
  {
    id: 3, title: "Replicate a Claude Use Case", category: "Anthropic",
    desc: "Follow Anthropic's documentation to implement one of their example use cases using the Claude API. Document what you learn.",
    credits: 200, difficulty: "Intermediate", duration: "45 min",
    steps: ["Pick a use case from Anthropic docs", "Implement it using the provided API key", "Write a 100-word reflection", "Share your output"],
    locked: false, completed: false, color: "emerald",
  },
  {
    id: 4, title: "Azure AI: Deploy a Chatbot", category: "Microsoft",
    desc: "Use Azure Cognitive Services to set up a basic AI chatbot endpoint. Configure the intent recognition and test it with 10 queries.",
    credits: 300, difficulty: "Advanced", duration: "60 min",
    steps: ["Sign up for Azure free tier", "Create Cognitive Services instance", "Configure intents", "Test 10 queries and log results"],
    locked: true, completed: false, color: "blue",
  },
  {
    id: 5, title: "Red-Team an AI Prompt", category: "Safety",
    desc: "Identify and document 3 potential failure modes in a given AI prompt. Suggest improved, safer alternatives for each.",
    credits: 150, difficulty: "Intermediate", duration: "25 min",
    steps: ["Analyze the provided prompt", "Find 3 potential risks or biases", "Write safer alternatives", "Explain your reasoning"],
    locked: false, completed: false, color: "rose",
  },
  {
    id: 6, title: "Fine-Tune a Sentiment Classifier", category: "ML",
    desc: "Label 50 sentences as positive/negative/neutral and use the EduSpark AI to fine-tune a classifier. Report accuracy.",
    credits: 400, difficulty: "Expert", duration: "90 min",
    steps: ["Label the provided 50 sentences", "Upload dataset to the task portal", "Run fine-tuning pipeline", "Report accuracy metrics"],
    locked: true, completed: false, color: "orange",
  },
];

const COLOR_MAP: Record<string, string> = {
  violet: "border-violet-500/30 bg-violet-500/5 hover:border-violet-500/60",
  amber: "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60",
  emerald: "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60",
  blue: "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60",
  rose: "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/60",
  orange: "border-orange-500/30 bg-orange-500/5 hover:border-orange-500/60",
};
const BADGE_MAP: Record<string, string> = {
  violet: "bg-violet-500/20 text-violet-400",
  amber: "bg-amber-500/20 text-amber-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/20 text-blue-400",
  rose: "bg-rose-500/20 text-rose-400",
  orange: "bg-orange-500/20 text-orange-400",
};
const DIFF_COLOR: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10",
  Intermediate: "text-amber-400 bg-amber-500/10",
  Advanced: "text-orange-400 bg-orange-500/10",
  Expert: "text-rose-400 bg-rose-500/10",
};

export default function TasksPage() {
  const [activeTask, setActiveTask] = useState<typeof TASKS[0] | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [credits, setCredits] = useState(320);
  const [activeFilter, setActiveFilter] = useState("All");
  const [taskInput, setTaskInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const categories = ["All", ...Array.from(new Set(TASKS.map(t => t.category)))];
  const filtered = activeFilter === "All" ? TASKS : TASKS.filter(t => t.category === activeFilter);
  const totalEarnable = TASKS.filter(t => !completed.has(t.id) && !t.locked).reduce((a, t) => a + t.credits, 0);

  const handleSubmit = () => {
    if (!activeTask || taskInput.trim().length < 20) return;
    setSubmitted(true);
    setTimeout(() => {
      setCompleted(prev => new Set(Array.from(prev).concat(activeTask.id)));
      setCredits(c => c + activeTask.credits);
      setSubmitted(false);
      setActiveTask(null);
      setTaskInput("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Tasks</h1>
            <p className="text-zinc-400 text-sm mt-1">Complete tasks to earn AI credits and unlock advanced models.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold text-lg">{credits.toLocaleString()}</span>
              <span className="text-zinc-400 text-sm">credits</span>
            </div>
            <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2">
              <Trophy className="w-4 h-4 text-violet-400" />
              <span className="text-violet-400 font-bold">{completed.size}</span>
              <span className="text-zinc-400 text-sm">done</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Progress</span>
            <span className="text-zinc-300">{completed.size}/{TASKS.length} tasks · <span className="text-amber-400">+{totalEarnable} credits remaining</span></span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completed.size / TASKS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-full border transition-all ${
                activeFilter === cat
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Task grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((task) => {
            const isDone = completed.has(task.id);
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative border rounded-xl p-5 transition-all cursor-pointer ${
                  isDone ? "border-emerald-500/30 bg-emerald-500/5" :
                  task.locked ? "border-zinc-700 bg-zinc-900/50 opacity-60 cursor-not-allowed" :
                  COLOR_MAP[task.color]
                }`}
                onClick={() => !task.locked && !isDone && setActiveTask(task)}
              >
                {task.locked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-4 h-4 text-zinc-500" />
                  </div>
                )}
                {isDone && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_MAP[task.color]}`}>
                    {task.category}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${DIFF_COLOR[task.difficulty]}`}>
                    {task.difficulty}
                  </div>
                </div>
                <h3 className={`font-semibold mb-2 ${isDone ? "text-emerald-300" : "text-white"}`}>{task.title}</h3>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{task.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{task.duration}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{task.steps.length} steps</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    <Zap className="w-3.5 h-3.5" />+{task.credits}
                  </div>
                </div>
                {!isDone && !task.locked && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500">
                    <span>Start Task</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Task modal */}
      <AnimatePresence>
        {activeTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setActiveTask(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={`text-xs px-2 py-0.5 rounded-full font-medium mb-2 inline-block ${BADGE_MAP[activeTask.color]}`}>
                    {activeTask.category}
                  </div>
                  <h2 className="text-white font-bold text-lg">{activeTask.title}</h2>
                </div>
                <button onClick={() => setActiveTask(null)} className="text-zinc-500 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-zinc-400 text-sm mb-5">{activeTask.desc}</p>

              <div className="mb-5">
                <p className="text-zinc-300 text-sm font-medium mb-3">Steps:</p>
                <div className="space-y-2">
                  {activeTask.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-zinc-400 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-zinc-300 text-sm font-medium block mb-2">Your submission:</label>
                <textarea
                  value={taskInput}
                  onChange={e => setTaskInput(e.target.value)}
                  placeholder="Paste your work here, describe your output, or share what you learned…"
                  rows={5}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-200 text-sm placeholder-zinc-600 resize-none focus:outline-none focus:border-violet-500 transition-colors"
                />
                <p className="text-xs text-zinc-600 mt-1">{taskInput.length} chars (min 20 required)</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={taskInput.trim().length < 20 || submitted}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: submitted ? '#059669' : 'linear-gradient(135deg, #7C3AED, #F59E0B)' }}
              >
                {submitted ? (
                  <><CheckCircle2 className="w-5 h-5" /> Awarding {activeTask.credits} credits…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Submit & Earn {activeTask.credits} Credits</>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
