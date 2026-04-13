"use client";

import { SignUp } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-10 h-10 rounded-lg gradient-violet flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">EduSpark</span>
      </div>

      {/* Value Props */}
      <div className="text-center mb-8 max-w-md">
        <h2 className="text-xl font-semibold text-white mb-2">
          Join 50,000+ learners
        </h2>
        <p className="text-zinc-400 text-sm">
          Get unlimited access to AI-powered courses and your personal AI tutor.
          First 1,000 users get lifetime free access.
        </p>
      </div>

      {/* Sign Up Component */}
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-zinc-900 border border-zinc-800 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-zinc-400",
              socialButtonsBlockButton:
                "bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700",
              formFieldLabel: "text-zinc-300",
              formFieldInput: "bg-zinc-800 border-zinc-700 text-white",
              formButtonPrimary: "bg-violet-600 hover:bg-violet-700",
              footerActionLink: "text-violet-400 hover:text-violet-300",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-violet-400",
            },
          }}
          redirectUrl="/feed"
          signInUrl="/sign-in"
        />
      </div>

      <p className="mt-8 text-zinc-500 text-sm">
        Already have an account?{" "}
        <a href="/sign-in" className="text-violet-400 hover:text-violet-300">
          Sign in
        </a>
      </p>
    </div>
  );
}
