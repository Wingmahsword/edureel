"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Brain, TrendingUp, Users, Play, ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { value: "50K+", label: "Active Learners", icon: Users },
  { value: "1M+", label: "Lessons Completed", icon: TrendingUp },
  { value: "4.9", label: "App Store Rating", icon: Star },
  { value: "200+", label: "AI Courses", icon: Sparkles },
];

const features = [
  {
    icon: Play,
    title: "Swipe to Learn",
    description: "Instagram-style feed with bite-sized video lessons. Learn on your commute, in line, or during breaks.",
  },
  {
    icon: Brain,
    title: "AI Personal Tutor",
    description: "Ask anything about the lesson. Get instant answers, summaries, and quiz questions tailored to you.",
  },
  {
    icon: Zap,
    title: "Spaced Repetition",
    description: "Our AI remembers what you've learned and brings it back at the perfect time for maximum retention.",
  },
];

const socialProof = [
  { name: "Sarah Chen", role: "Product Manager", avatar: "SC", quote: "I learned Python in 3 weeks. The AI tutor felt like having a personal mentor." },
  { name: "Marcus Johnson", role: "College Student", avatar: "MJ", quote: "Finally, learning that doesn't feel like homework. I'm addicted to my daily streak." },
  { name: "Priya Sharma", role: "Career Changer", avatar: "PS", quote: "Switched from marketing to UX design using EduSpark's AI-generated courses." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-8">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-zinc-300">Now with GPT-4o powered AI tutor</span>
            </div>

            {/* Headline - Zeigarnik effect: incomplete info drives action */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Learn Anything</span>
              <br />
              <span className="text-gradient">The Instagram Way</span>
            </h1>

            {/* Subheadline - FOMO trigger */}
            <p className="max-w-2xl mx-auto text-xl text-zinc-400 mb-4">
              AI-generated courses delivered in bite-sized lessons. 
              <span className="text-amber-400 font-medium"> 50,000+ learners</span> are already ahead of you.
            </p>
            <p className="text-zinc-500 text-sm mb-10">
              Join the waitlist today. First 1,000 get lifetime free access.
            </p>

            {/* CTAs - Dual button strategy */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/sign-up">
                <Button size="lg" className="gradient-violet text-white px-8 py-6 text-lg hover:opacity-90 group">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 px-8 py-6 text-lg hover:bg-zinc-800">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators - Social proof */}
            <div className="flex items-center justify-center space-x-8 text-zinc-500 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>AI tutor included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Authority building */}
      <section className="py-16 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 text-violet-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Learning Reimagined with <span className="text-gradient">AI</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              We combined the addictiveness of social media with the power of personalized AI tutoring.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-8 hover:border-violet-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl gradient-violet flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section - Show, don't tell */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-violet-950/10 to-zinc-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Your Personal <span className="text-gradient-amber">AI Mentor</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Stuck on a concept? Ask our AI tutor anything. Get instant explanations, 
                code examples, or a different perspective. It's like having a world-class 
                professor available 24/7.
              </p>
              <ul className="space-y-4">
                {[
                  "Context-aware answers based on what you're learning",
                  "Generate practice questions on any topic",
                  "Get summaries of complex lessons",
                  "Track your weak areas automatically",
                ].map((item) => (
                  <li key={item} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock Chat Interface */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-800">
                <div className="w-10 h-10 rounded-full gradient-violet flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">AI Tutor</div>
                  <div className="text-xs text-emerald-400 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-violet-600/80 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    Explain neural networks like I'm 5
                  </div>
                </div>
                <div className="flex">
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
                    <p className="text-zinc-300 text-sm">
                      Think of a neural network like a team of tiny decision-makers. Each one looks at 
                      part of the problem and votes on what they think the answer is. The more they 
                      practice, the better they get at voting correctly! 🧠
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-violet-400">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Generate Quiz
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Loved by Learners Worldwide</h2>
            <p className="text-zinc-400">Join thousands who've transformed their learning journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {socialProof.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-zinc-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-zinc-300 italic">"{testimonial.quote}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Urgency */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-violet opacity-10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-zinc-400 mb-8">
                Join <span className="text-amber-400 font-semibold">2,847 learners</span> who signed up this week.
                <br />
                Limited free spots available.
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="gradient-amber text-zinc-950 font-semibold px-8 py-6 text-lg hover:opacity-90">
                  Get Started for Free
                </Button>
              </Link>
              <p className="text-zinc-500 text-sm mt-4">
                No credit card required · Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EduSpark</span>
            </div>
            <div className="text-zinc-500 text-sm">
              © 2024 EduSpark. Learn smarter, not harder.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
