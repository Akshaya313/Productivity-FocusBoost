"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Globe, Code, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#070512] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Visual background lights */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />

      {/* Login box */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-black/40 z-10 flex flex-col gap-6 text-left select-none"
      >
        <div className="flex flex-col gap-1 items-center text-center">
          <Link href="/" className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center font-black border border-white/20 text-white shadow shadow-purple-500/10 mb-3">
            A
          </Link>
          <span className="text-lg font-black text-white leading-none">Welcome Back</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider mt-1">
            Access your focus flow dashboard
          </span>
        </div>

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={14} />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Password</label>
              <span className="text-[9px] text-[var(--accent)] hover:text-white transition-colors cursor-help">Forgot?</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={14} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-accent-gradient text-white text-xs font-bold rounded-xl border border-white/10 shadow-lg shadow-purple-500/5 mt-2 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span>Enter AntiGravity OS</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="relative flex py-1 items-center shrink-0">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-3 text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Or Connect With</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 text-xs font-semibold select-none">
          <button
            onClick={() => router.push("/dashboard")}
            className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Globe size={13} className="text-sky-400" />
            <span>Google</span>
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Code size={13} className="text-white" />
            <span>GitHub</span>
          </button>
        </div>

        <span className="text-[10px] text-center text-[var(--text-muted)] mt-2">
          New to the system?{" "}
          <Link href="/signup" className="text-[var(--accent)] font-bold hover:text-white transition-colors">
            Create an account
          </Link>
        </span>
      </motion.div>
    </div>
  );
}
