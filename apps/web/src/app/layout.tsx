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
          <header style={{ background: "rgba(0,0,0,0.85)", borderBottom: "1px solid #1a1a1a", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
            className="fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[15px] font-bold text-white tracking-tight">EduSpark</span>
                </Link>

                {/* Signed-in nav */}
                <SignedIn>
                  <nav className="hidden md:flex items-center gap-0.5">
                    {[
                      { href: "/reels", icon: <Play className="w-3.5 h-3.5" />, label: "Reels" },
                      { href: "/courses", icon: <BookOpen className="w-3.5 h-3.5" />, label: "Courses" },
                      { href: "/tasks", icon: <Zap className="w-3.5 h-3.5" />, label: "Tasks" },
                      { href: "/ai-studio", icon: <Bot className="w-3.5 h-3.5" />, label: "AI Studio" },
                    ].map(item => (
                      <Link key={item.href} href={item.href}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{ color: "#666" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#666"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        {item.icon}{item.label}
                      </Link>
                    ))}
                  </nav>
                </SignedIn>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <SignedOut>
                    <Link href="/sign-in">
                      <button className="text-sm font-medium transition-colors" style={{ color: "#999" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#999")}>Sign In</button>
                    </Link>
                    <Link href="/sign-up">
                      <button className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-80"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
                        Get Started
                      </button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
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
