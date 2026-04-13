"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Play, BookOpen, Zap, Bot, LayoutDashboard } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-lg gradient-violet flex items-center justify-center mb-4">
            <span className="text-white font-bold">E</span>
          </div>
          <div className="text-zinc-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) return null;

  const NAV = [
    { href: "/reels", icon: <Play className="w-5 h-5" />, label: "Reels" },
    { href: "/courses", icon: <BookOpen className="w-5 h-5" />, label: "Learn" },
    { href: "/tasks", icon: <Zap className="w-5 h-5" />, label: "Tasks" },
    { href: "/ai-studio", icon: <Bot className="w-5 h-5" />, label: "AI" },
    { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  ];

  return (
    <>
      {children}
      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: "rgba(0,0,0,0.92)", borderTop: "1px solid #1a1a1a", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-all"
              style={{ color: active ? "#a78bfa" : "#555" }}>
              <span style={{ color: active ? "#a78bfa" : "#555" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="md:hidden h-16" />
    </>
  );
}
