"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Globe, Code, Lock, Mail, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#070512] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Visual background lights */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />

      {/* Signup box */}
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
          <span className="text-lg font-black text-white leading-none">Create Account</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider mt-1">
            Initiate your attention catalog
          </span>
        </div>

        <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={14} />
              <input
                type="text"
                required
                placeholder="Alex Carter"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>
          </div>

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
            <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Password</label>
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
            <span>Activate Workspace</span>
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
            <Globe size={13} className="text-red-400" />
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
          Already registered?{" "}
          <Link href="/login" className="text-[var(--accent)] font-bold hover:text-white transition-colors">
            Log in
          </Link>
        </span>
      </motion.div>
    </div>
  );
}
