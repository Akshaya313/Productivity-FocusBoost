"use client";

import React from "react";
import Link from "next/link";
import { Compass, Timer, CheckSquare, Sparkles, ShieldAlert, Award, ArrowRight, Zap, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070512] text-white relative overflow-hidden font-sans">
      {/* Background decoration elements */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none animate-pulse-slow" />

      {/* Header */}
      <header className="sticky top-0 w-full z-40 border-b border-white/5 bg-black/30 backdrop-blur-xl select-none">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-gradient flex items-center justify-center font-black border border-white/20 text-white shadow-lg shadow-purple-500/10">
              A
            </div>
            <span className="font-bold text-sm tracking-widest text-gradient">ANTIGRAVITY</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="relative group px-4 py-2 rounded-xl bg-accent-gradient text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-20 flex flex-col items-center justify-center relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-8 max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-300 text-[10px] font-bold uppercase tracking-widest"
          >
            <Sparkles size={12} className="animate-spin text-purple-400" />
            <span>Introducing AntiGravity v1.0</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-black leading-tight tracking-tight text-white select-none"
          >
            Defy Distraction. <br />
            <span className="text-gradient">Elevate Your Focus.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-lg text-gray-400 leading-relaxed max-w-2xl"
          >
            A unified, state-persistent productivity operating system combining deep Pomodoro sessions, fluid Kanban cards, live markdown brainstorming, Web Audio synthesized ambiance, and gamified level progressions.
          </motion.p>

          {/* Call to action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-2 justify-center w-full max-w-md"
          >
            <Link
              href="/dashboard"
              className="flex-1 h-12 rounded-xl bg-accent-gradient hover:opacity-90 font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-opacity border border-white/10"
            >
              <Play size={16} fill="white" />
              <span>Enter Workspace</span>
            </Link>
            <Link
              href="/dashboard/timer"
              className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Timer size={16} className="text-[var(--accent)]" />
              <span>Focus Timer</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24 text-left"
        >
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all group flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Timer size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-2">Advanced Pomodoro</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tune in with built-in Ambient Audio waves (Rain, Oceans, Noise) synthesized programmatically using pure HTML5 Web Audio nodes. Eliminate clutter in fullscreen Deep Focus.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all group flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <CheckSquare size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-2">Smart Kanban Boards</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Organize subtasks, categorize priorities, adjust recurrences, and track items on list schedules. Unlock AI subtask breakdowns to easily digest massive milestones.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all group flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-2">RPG Gamification Engine</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Level up by finishing checklists and habits! Earn XP milestones, maintain daily consistency streaks, unlock custom badge accomplishments, and choose your favorite visual themes.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dynamic visual preview panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full max-w-5xl mt-20 rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative"
        >
          <div className="h-8 border-b border-white/5 bg-black/40 px-4 flex items-center gap-1.5 select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            <span className="text-[10px] text-gray-500 font-mono mx-auto">https://antigravity.saas/dashboard</span>
          </div>
          <div className="h-64 sm:h-96 w-full bg-[#0d0a1b] flex flex-col items-center justify-center gap-4 relative overflow-hidden select-none p-6 text-center">
            {/* Mock Dashboard */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)] animate-pulse" />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative p-6 rounded-2xl glass-panel border border-white/10 max-w-sm"
            >
              <Compass className="mx-auto text-[var(--accent)] animate-spin-slow mb-4" size={36} />
              <h4 className="font-bold text-sm text-white mb-1">Focus Dashboard Preview</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                Interactive metrics, progress score ring, daily habits streaks, and Markdown note editing await in your new command center.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent)] hover:text-white transition-colors"
              >
                <span>Launch workspace interface</span>
                <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 py-8 select-none relative z-10 text-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono">AntiGravity</span>
            <span>&copy; {new Date().getFullYear()} SaaS Productivity OS. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-help">Keyboard Shortcuts (Cmd+K)</span>
            <span className="text-white/10">|</span>
            <span className="hover:text-white cursor-help">Synthesized Waves API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
