"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();

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

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
