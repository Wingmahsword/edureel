import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";
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
          <header className="fixed top-0 left-0 right-0 z-50 glass border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">EduSpark</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <SignedOut>
                    <Link href="/sign-in">
                      <button className="text-zinc-400 hover:text-white text-sm">Sign In</button>
                    </Link>
                    <Link href="/sign-up">
                      <button className="gradient-violet text-white px-4 py-2 rounded-lg text-sm hover:opacity-90">Get Started</button>
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
