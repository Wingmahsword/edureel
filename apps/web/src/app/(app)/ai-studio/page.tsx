"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Zap, Bot, Image, Code2, FileText, Sparkles, ChevronRight, RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MODELS = [
  { id: "llama3", name: "Llama 3.1", provider: "Meta", desc: "Fast open-source LLM, great for general tasks", badge: "Free", badgeColor: "bg-emerald-500/20 text-emerald-400", gradient: "from-blue-600/20 to-indigo-600/20", border: "border-blue-500/20 hover:border-blue-500/50", icon: "🦙", credits: 0 },
  { id: "mistral", name: "Mistral 7B", provider: "Mistral AI", desc: "Efficient European model, strong at reasoning", badge: "Free", badgeColor: "bg-emerald-500/20 text-emerald-400", gradient: "from-orange-600/20 to-amber-600/20", border: "border-orange-500/20 hover:border-orange-500/50", icon: "🌪️", credits: 0 },
  { id: "gemma", name: "Gemma 2", provider: "Google", desc: "Lightweight Google model, fast responses", badge: "Free", badgeColor: "bg-emerald-500/20 text-emerald-400", gradient: "from-red-600/20 to-pink-600/20", border: "border-red-500/20 hover:border-red-500/50", icon: "💎", credits: 0 },
  { id: "claude-haiku", name: "Claude Haiku", provider: "Anthropic", desc: "Anthropic's fastest model, ideal for chat", badge: "50 credits", badgeColor: "bg-amber-500/20 text-amber-400", gradient: "from-emerald-600/20 to-teal-600/20", border: "border-emerald-500/20 hover:border-emerald-500/50", icon: "🌿", credits: 50 },
  { id: "gpt4o-mini", name: "GPT-4o Mini", provider: "OpenAI", desc: "Compact GPT-4o, powerful and affordable", badge: "80 credits", badgeColor: "bg-amber-500/20 text-amber-400", gradient: "from-violet-600/20 to-purple-600/20", border: "border-violet-500/20 hover:border-violet-500/50", icon: "⚡", credits: 80 },
  { id: "flux", name: "Flux Image Gen", provider: "Black Forest Labs", desc: "High-quality AI image generation", badge: "100 credits", badgeColor: "bg-amber-500/20 text-amber-400", gradient: "from-pink-600/20 to-rose-600/20", border: "border-pink-500/20 hover:border-pink-500/50", icon: "🎨", credits: 100 },
];

const TOOLS = [
  { icon: <FileText className="w-4 h-4" />, label: "Summarize", prompt: "Please summarize the following text concisely:" },
  { icon: <Code2 className="w-4 h-4" />, label: "Explain Code", prompt: "Explain this code in simple terms:" },
  { icon: <Image className="w-4 h-4" />, label: "Describe Image", prompt: "Describe what you see in this image:" },
  { icon: <Sparkles className="w-4 h-4" />, label: "Brainstorm", prompt: "Brainstorm 5 creative ideas for:" },
];

type Msg = { role: "user" | "assistant"; content: string };

const MOCK_RESPONSES: Record<string, string> = {
  llama3: "I'm Llama 3.1, Meta's open-source model! I'm running right here in EduSpark. How can I help you learn today?",
  mistral: "Bonjour! I'm Mistral 7B, built in France for high efficiency. Ask me anything about AI, reasoning, or your course material.",
  gemma: "Hi! I'm Gemma 2 from Google. I'm optimized for speed and accuracy. What would you like to explore today?",
  "claude-haiku": "Hello! I'm Claude Haiku by Anthropic. I'm designed to be helpful, harmless, and honest. What can I help you learn?",
  "gpt4o-mini": "Hey! I'm GPT-4o Mini from OpenAI — compact but powerful. Ready to help with your AI learning journey!",
  flux: "I'm Flux, an image generation model. Describe what you'd like me to create and I'll generate it for you!",
};

export default function AIStudioPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: MOCK_RESPONSES[MODELS[0].id] }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCredits] = useState(320);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleModel = (model: typeof MODELS[0]) => {
    setSelectedModel(model);
    setMessages([{ role: "assistant", content: MOCK_RESPONSES[model.id] }]);
    setInput("");
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const reply = `Great question! As ${selectedModel.name}, I'd say: "${userMsg}" touches on a core concept in AI. In prompt engineering, it's important to be specific, provide context, and iterate on your prompts. Would you like me to elaborate on any aspect of this?`;
    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: "#000" }}>
      <div className="flex h-[calc(100vh-64px)]">

        {/* Model selector sidebar */}
        <div className="hidden lg:flex flex-col w-72 overflow-y-auto p-4 gap-2" style={{ borderRight: "1px solid #1a1a1a" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[13px] font-semibold tracking-wide" style={{ color: "#666" }}>AI MODELS</h2>
            <div className="flex items-center gap-1 text-xs text-amber-400">
              <Zap className="w-3 h-3" />{userCredits}
            </div>
          </div>
          {MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => handleModel(model)}
              className="text-left p-3 rounded-xl transition-all"
              style={selectedModel.id === model.id
                ? { background: "#1a1a1a", border: "1px solid #333" }
                : { background: "#0d0d0d", border: "1px solid #1a1a1a" }
              }
              onMouseEnter={e => { if (selectedModel.id !== model.id) (e.currentTarget as HTMLElement).style.borderColor = "#262626"; }}
              onMouseLeave={e => { if (selectedModel.id !== model.id) (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"; }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{model.icon}</span>
                <span className="text-white text-sm font-medium">{model.name}</span>
              </div>
              <p className="text-zinc-400 text-xs mb-2 line-clamp-2">{model.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-xs">{model.provider}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${model.badgeColor}`}>{model.badge}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}>
            <span className="text-2xl">{selectedModel.icon}</span>
            <div>
              <h3 className="text-white font-semibold">{selectedModel.name}</h3>
              <p className="text-zinc-400 text-xs">{selectedModel.provider} · {selectedModel.badge}</p>
            </div>
            <button
              onClick={() => setMessages([{ role: "assistant", content: MOCK_RESPONSES[selectedModel.id] }])}
              className="ml-auto text-zinc-500 hover:text-white transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick tools */}
          <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none" style={{ borderBottom: "1px solid #111" }}>
            {TOOLS.map(tool => (
              <button
                key={tool.label}
                onClick={() => setInput(tool.prompt + " ")}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
                style={{ background: "#111", color: "#888", border: "1px solid #1a1a1a" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1a1a1a"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#111"; (e.currentTarget as HTMLElement).style.color = "#888"; }}
              >
                {tool.icon}{tool.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin" style={{ background: "#000" }}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${msg.role === "user" ? "bg-violet-600 text-white" : "bg-zinc-800 text-lg"}`}>
                    {msg.role === "user" ? "U" : selectedModel.icon}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-violet-600 text-white rounded-tr-sm"
                      : "text-zinc-200 rounded-tl-sm"
                  } style={msg.role !== "user" ? { background: "#111", border: "1px solid #1a1a1a" } : {}}
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm">{selectedModel.icon}</div>
                <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4" style={{ borderTop: "1px solid #1a1a1a", background: "#000" }}>
            {selectedModel.credits > 0 && (
              <div className="flex items-center gap-2 mb-2 text-xs text-amber-400">
                <Zap className="w-3 h-3" />
                <span>This model costs {selectedModel.credits} credits per message · You have {userCredits}</span>
              </div>
            )}
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Message ${selectedModel.name}…`}
                rows={1}
                className="flex-1 rounded-xl px-4 py-3 text-sm resize-none max-h-32 transition-colors"
                style={{ background: "#0d0d0d", border: "1px solid #262626", color: "#e0e0e0", outline: "none", resize: "none" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#7c3aed")}
                onBlur={e => (e.currentTarget.style.borderColor = "#262626")}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex-shrink-0 w-11 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-xs text-zinc-600 mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>

        {/* Mobile model picker strip */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 flex gap-2 overflow-x-auto scrollbar-none z-30" style={{ background: "rgba(0,0,0,0.92)", borderTop: "1px solid #1a1a1a", backdropFilter: "blur(24px)" }}>
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => handleModel(m)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-all ${
                selectedModel.id === m.id ? "bg-violet-600 border-violet-600 text-white" : "border-zinc-700 text-zinc-400 bg-zinc-800"
              }`}
            >
              <span>{m.icon}</span>{m.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
