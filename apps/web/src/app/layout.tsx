import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, Play, BookOpen, Zap, Bot } from "lucide-react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EduSpark — AI-Powered Learning, The Instagram Way",
  description:
    "Learn anything with AI-generated courses. Swipe through bite-sized lessons, chat with an AI tutor, and track your progress.",
  keywords: ["AI learning", "online courses", "education", "microlearning", "EdTech"],
  openGraph: {
    title: "EduSpark — AI-Powered Learning",
    description: "Learn anything with AI-generated courses. The Instagram way to learn.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.variable} font-sans`}>
          <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">EduSpark</span>
                </Link>

                {/* Signed-in nav links */}
                <SignedIn>
                  <nav className="hidden md:flex items-center gap-1">
                    <Link href="/reels" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                      <Play className="w-3.5 h-3.5" />Reels
                    </Link>
                    <Link href="/courses" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                      <BookOpen className="w-3.5 h-3.5" />Courses
                    </Link>
                    <Link href="/tasks" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                      <Zap className="w-3.5 h-3.5" />Tasks
                    </Link>
                    <Link href="/ai-studio" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                      <Bot className="w-3.5 h-3.5" />AI Studio
                    </Link>
                  </nav>
                </SignedIn>

                {/* Right side */}
                <div className="flex items-center gap-3">
                  <SignedOut>
                    <Link href="/sign-in">
                      <button className="text-zinc-400 hover:text-white text-sm transition-colors">Sign In</button>
                    </Link>
                    <Link href="/sign-up">
                      <button className="gradient-violet text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">Get Started</button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/ai-studio" className="md:hidden flex items-center gap-1 text-xs text-zinc-400 hover:text-white">
                      <Bot className="w-4 h-4" />
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
