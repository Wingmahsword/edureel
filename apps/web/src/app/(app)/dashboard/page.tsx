"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Zap,
  Award,
  Calendar,
  ChevronRight,
  Flame,
} from "lucide-react";
import Link from "next/link";

// Mock data - will be fetched from API
const myCourses = [
  {
    id: "1",
    title: "Introduction to Neural Networks",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    progress: 45,
    lastAccessed: "2 hours ago",
    nextLesson: "Backpropagation Explained",
  },
  {
    id: "2",
    title: "Building Your First React App",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    progress: 72,
    lastAccessed: "Yesterday",
    nextLesson: "State Management with Hooks",
  },
];

const stats = [
  { label: "Courses Enrolled", value: "4", icon: BookOpen, color: "text-violet-400" },
  { label: "Lessons Completed", value: "23", icon: Trophy, color: "text-amber-400" },
  { label: "Learning Hours", value: "12.5", icon: Clock, color: "text-emerald-400" },
  { label: "Current Streak", value: "7 days", icon: Flame, color: "text-rose-400" },
];

const achievements = [
  { icon: Zap, label: "Quick Learner", description: "Complete 3 lessons in a day", unlocked: true },
  { icon: Award, label: "Course Champion", description: "Complete your first course", unlocked: false },
  { icon: TrendingUp, label: "Rising Star", description: "Maintain a 7-day streak", unlocked: true },
];

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.firstName || "Learner"}</h1>
              <p className="text-zinc-400 mt-1">Keep up your momentum! You're making great progress.</p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass">
              <Flame className="w-5 h-5 text-rose-500" />
              <span className="text-white font-medium">7 day streak</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-4"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-zinc-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Continue Learning</h2>
            <div className="space-y-4">
              {myCourses.map((course) => (
                <Link key={course.id} href={`/learn/${course.id}`}>
                  <div className="glass rounded-xl p-4 hover:border-violet-500/30 transition-colors group">
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-24 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-violet-400 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1">Next: {course.nextLesson}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex-1 mr-4">
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-violet-500 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-zinc-400">{course.progress}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-violet-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Weekly Activity */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Weekly Activity</h2>
              <div className="glass rounded-xl p-6">
                <div className="flex items-end justify-between h-32 space-x-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                    const heights = [40, 65, 80, 45, 90, 70, 55];
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-violet-500/20 rounded-t-lg relative group cursor-pointer"
                          style={{ height: `${heights[i]}%` }}
                        >
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-violet-500 rounded-t-lg transition-all group-hover:bg-violet-400"
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 mt-2">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.label}
                    className={`flex items-center space-x-3 p-3 rounded-xl ${
                      achievement.unlocked ? "glass" : "bg-zinc-900/50 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.unlocked ? "gradient-violet" : "bg-zinc-800"
                      }`}
                    >
                      <achievement.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{achievement.label}</div>
                      <div className="text-xs text-zinc-500">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Goal */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Daily Goal</h3>
                <span className="text-sm text-violet-400">2/3 lessons</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-violet-500 to-amber-500 rounded-full" />
              </div>
              <p className="text-xs text-zinc-500 mt-2">Complete 1 more lesson to reach your daily goal!</p>
            </div>

            {/* Upcoming Reviews */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Spaced Repetition</h2>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-white">3 lessons due for review</span>
                </div>
                <button className="w-full py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                  Start Review Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
