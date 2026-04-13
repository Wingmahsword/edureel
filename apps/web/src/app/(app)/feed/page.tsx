"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Play,
  Brain,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock feed data
const feedItems = [
  {
    id: 1,
    type: "lesson",
    title: "Introduction to Neural Networks",
    course: "AI Fundamentals",
    instructor: "Dr. Sarah Chen",
    instructorAvatar: "SC",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    duration: 180,
    likes: 1243,
    comments: 89,
    bookmarks: 456,
    tags: ["AI", "Machine Learning"],
    progress: 0,
    aiSummary: "Learn how neural networks mimic the human brain to solve complex problems...",
  },
  {
    id: 2,
    type: "lesson",
    title: "Building Your First React App",
    course: "Full Stack Development",
    instructor: "Marcus Johnson",
    instructorAvatar: "MJ",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    duration: 240,
    likes: 892,
    comments: 67,
    bookmarks: 234,
    tags: ["React", "Web Dev"],
    progress: 15,
    aiSummary: "Create a modern web application using React hooks and components...",
  },
  {
    id: 3,
    type: "lesson",
    title: "The Psychology of Learning",
    course: "Cognitive Science",
    instructor: "Dr. Priya Sharma",
    instructorAvatar: "PS",
    thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800",
    duration: 150,
    likes: 2156,
    comments: 156,
    bookmarks: 892,
    tags: ["Psychology", "Learning"],
    progress: 45,
    aiSummary: "Discover how your brain forms memories and the best techniques for retention...",
  },
  {
    id: 4,
    type: "lesson",
    title: "Financial Planning for Beginners",
    course: "Personal Finance",
    instructor: "James Wilson",
    instructorAvatar: "JW",
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800",
    duration: 200,
    likes: 3421,
    comments: 234,
    bookmarks: 1567,
    tags: ["Finance", "Money"],
    progress: 0,
    aiSummary: "Master the basics of budgeting, saving, and investing for your future...",
  },
];

export default function FeedPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [showAI, setShowAI] = useState(false);

  const currentItem = feedItems[currentIndex];

  const handleLike = (id: number) => {
    setLiked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBookmark = (id: number) => {
    setBookmarked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % feedItems.length);
    setShowAI(false);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + feedItems.length) % feedItems.length);
    setShowAI(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar Navigation */}
      <aside className="w-16 lg:w-64 border-r border-zinc-800/50 flex flex-col items-center lg:items-start py-6 px-2 lg:px-4">
        <div className="mb-8 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="hidden lg:block text-xl font-bold text-white">EduSpark</span>
        </div>

        <nav className="flex-1 space-y-2 w-full">
          {[
            { icon: Play, label: "Feed", active: true },
            { icon: BookOpen, label: "My Courses" },
            { icon: Brain, label: "AI Tutor" },
            { icon: Clock, label: "History" },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors ${
                item.active
                  ? "bg-violet-600/20 text-violet-400"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Feed Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-4 lg:px-6">
          <h1 className="text-lg font-semibold text-white">For You</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAI(!showAI)}
              className={`${showAI ? "bg-violet-600/20 text-violet-400" : "text-zinc-400"}`}
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Summary
            </Button>
          </div>
        </header>

        {/* Feed Content */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="relative w-full max-w-2xl">
            {/* Navigation Arrows */}
            <button
              onClick={prevItem}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextItem}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-zinc-900">
                  <img
                    src={currentItem.thumbnail}
                    alt={currentItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </button>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
                    {formatDuration(currentItem.duration)}
                  </div>

                  {/* Progress Bar */}
                  {currentItem.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                      <div
                        className="h-full bg-violet-500"
                        style={{ width: `${currentItem.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Instructor */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full gradient-violet flex items-center justify-center text-white font-medium">
                        {currentItem.instructorAvatar}
                      </div>
                      <div>
                        <div className="text-white font-medium">{currentItem.instructor}</div>
                        <div className="text-zinc-500 text-sm">{currentItem.course}</div>
                      </div>
                    </div>
                    <button className="text-zinc-500 hover:text-white">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Title & Tags */}
                  <h2 className="text-xl font-semibold text-white mb-3">{currentItem.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* AI Summary (Collapsible) */}
                  {showAI && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-4 rounded-xl bg-violet-600/10 border border-violet-600/20"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-violet-400 font-medium text-sm">AI Preview</span>
                      </div>
                      <p className="text-zinc-300 text-sm">{currentItem.aiSummary}</p>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(currentItem.id)}
                        className={`flex items-center space-x-2 ${
                          liked.has(currentItem.id) ? "text-rose-500" : "text-zinc-400"
                        }`}
                      >
                        <Heart
                          className={`w-6 h-6 ${liked.has(currentItem.id) ? "fill-current" : ""}`}
                        />
                        <span className="text-sm">
                          {formatNumber(
                            currentItem.likes + (liked.has(currentItem.id) ? 1 : 0)
                          )}
                        </span>
                      </button>
                      <button className="flex items-center space-x-2 text-zinc-400">
                        <MessageCircle className="w-6 h-6" />
                        <span className="text-sm">{formatNumber(currentItem.comments)}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-zinc-400">
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleBookmark(currentItem.id)}
                      className={`${bookmarked.has(currentItem.id) ? "text-amber-500" : "text-zinc-400"}`}
                    >
                      <Bookmark
                        className={`w-6 h-6 ${bookmarked.has(currentItem.id) ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {feedItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-violet-500" : "bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
