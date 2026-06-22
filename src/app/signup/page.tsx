"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useProductivityStore } from "@/store/useProductivityStore";

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail, loginWithGoogle, authLoading, syncError } = useProductivityStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await signUpWithEmail(email, password, name);
      router.push("/dashboard");
    } catch (err: any) {
      setLocalError(err.message || "Failed to create account");
    }
  };

  const handleGoogleSignup = async () => {
    setLocalError(null);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setLocalError(err.message || "Google sign-in failed");
      }
    }
  };

  const error = localError || syncError;

  return (
    <div className="min-h-screen bg-[#070512] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glows */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-black/40 z-10 flex flex-col gap-6 text-left select-none animate-float"
      >
        {/* Header */}
        <div className="flex flex-col gap-1 items-center text-center">
          <Link href="/" className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center font-black border border-white/20 text-white shadow shadow-purple-500/10 mb-3">
            F
          </Link>
          <span className="text-lg font-black text-white leading-none">Create Account</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider mt-1">
            Start your productivity journey
          </span>
        </div>

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl text-[11px] leading-relaxed"
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Google Sign-Up — primary action */}
        <button
          onClick={handleGoogleSignup}
          disabled={authLoading}
          id="google-signup-btn"
          className="w-full h-11 rounded-xl bg-white text-gray-900 text-xs font-bold border border-white/10 shadow-lg flex items-center justify-center gap-2.5 cursor-pointer hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
        >
          {authLoading ? (
            <Loader2 size={16} className="animate-spin text-gray-600" />
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center shrink-0">
          <div className="flex-grow border-t border-white/5" />
          <span className="flex-shrink mx-3 text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Or sign up with email</span>
          <div className="flex-grow border-t border-white/5" />
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={14} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Carter"
                disabled={authLoading}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[var(--accent)] transition-all disabled:opacity-50"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                disabled={authLoading}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[var(--accent)] transition-all disabled:opacity-50"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={authLoading}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[var(--accent)] transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full h-10 bg-accent-gradient text-white text-xs font-bold rounded-xl border border-white/10 shadow-lg shadow-purple-500/5 mt-1 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-all disabled:opacity-50"
          >
            {authLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <span className="text-[10px] text-center text-[var(--text-muted)] mt-1">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] font-bold hover:text-white transition-colors">
            Log in
          </Link>
        </span>
      </motion.div>
    </div>
  );
}
