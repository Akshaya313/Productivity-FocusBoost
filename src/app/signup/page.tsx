"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Globe, Code, Lock, Mail, User, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useProductivityStore } from "@/store/useProductivityStore";

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail, loginWithGoogle, loginWithGithub, authLoading, syncError } = useProductivityStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Simulated OAuth Modal state
  const [oauthProvider, setOauthProvider] = useState<"google" | "github" | null>(null);
  const [oauthEmail, setOauthEmail] = useState("");
  const [oauthName, setOauthName] = useState("");
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthLoadingLocal, setOauthLoadingLocal] = useState(false);

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

  const handleOAuthClick = (provider: "google" | "github") => {
    setOauthProvider(provider);
    setOauthError(null);
    if (provider === "google") {
      setOauthEmail("google.user@flowzone.app");
      setOauthName("Google Explorer");
    } else {
      setOauthEmail("github.user@flowzone.app");
      setOauthName("GitHub Octocat");
    }
  };

  const handleOAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOauthError(null);
    setOauthLoadingLocal(true);
    try {
      if (oauthProvider === "google") {
        await loginWithGoogle(oauthEmail, oauthName);
      } else {
        await loginWithGithub(oauthEmail, oauthName);
      }
      setOauthLoadingLocal(false);
      setOauthProvider(null);
      router.push("/dashboard");
    } catch (err: any) {
      setOauthLoadingLocal(false);
      setOauthError(err.message || "Failed to register OAuth account");
    }
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
        className="w-full max-w-sm glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-black/40 z-10 flex flex-col gap-6 text-left select-none animate-float"
      >
        <div className="flex flex-col gap-1 items-center text-center">
          <Link href="/" className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center font-black border border-white/20 text-white shadow shadow-purple-500/10 mb-3">
            F
          </Link>
          <span className="text-lg font-black text-white leading-none">Create Account</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider mt-1">
            Initiate your attention catalog
          </span>
        </div>

        {/* Dynamic Error alert banner */}
        {(localError || syncError) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl text-[11px] leading-relaxed"
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{localError || syncError}</span>
          </motion.div>
        )}

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
            className="w-full h-10 bg-accent-gradient text-white text-xs font-bold rounded-xl border border-white/10 shadow-lg shadow-purple-500/5 mt-2 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-all disabled:opacity-50"
          >
            {authLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Creating Profile...</span>
              </>
            ) : (
              <>
                <span>Activate Workspace</span>
                <ArrowRight size={14} />
              </>
            )}
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
            onClick={() => handleOAuthClick("google")}
            className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Globe size={13} className="text-red-400" />
            <span>Google</span>
          </button>
          <button
            onClick={() => handleOAuthClick("github")}
            className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Code size={13} className="text-violet-400" />
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

      {/* Glassmorphic Simulated OAuth Popup */}
      <AnimatePresence>
        {oauthProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOauthProvider(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass-panel p-6 rounded-3xl border border-white/10 bg-black/70 shadow-2xl z-10 flex flex-col gap-5 text-left"
            >
              {/* Pop-up header */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
                  {oauthProvider === "google" ? (
                    <Globe size={18} className="text-red-400 animate-pulse" />
                  ) : (
                    <Code size={18} className="text-violet-400 animate-pulse" />
                  )}
                </div>
                <h3 className="text-sm font-black text-white capitalize">
                  Sign in with {oauthProvider}
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] max-w-[240px]">
                  FlowZone OS will connect to your {oauthProvider} identity provider to build and sync your dashboard cloud backup.
                </p>
              </div>

              {oauthError && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-300 p-2.5 rounded-xl text-[10px] leading-relaxed">
                  <AlertCircle size={12} className="shrink-0 mt-0.5" />
                  <span>{oauthError}</span>
                </div>
              )}

              {/* Account details details */}
              <form onSubmit={handleOAuthSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Display Name</label>
                  <input
                    type="text"
                    required
                    value={oauthName}
                    onChange={(e) => setOauthName(e.target.value)}
                    placeholder="Enter your name..."
                    disabled={oauthLoadingLocal}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={oauthEmail}
                    onChange={(e) => setOauthEmail(e.target.value)}
                    placeholder="name@provider.com"
                    disabled={oauthLoadingLocal}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>

                {/* Account Selection Presets */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Quick Select Presets</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <button
                      type="button"
                      disabled={oauthLoadingLocal}
                      onClick={() => {
                        setOauthName("Creative Innovator");
                        setOauthEmail(oauthProvider === "google" ? "creative.innovator@gmail.com" : "creative.innovator@github.com");
                      }}
                      className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white truncate text-left"
                    >
                      Creative Innovator
                    </button>
                    <button
                      type="button"
                      disabled={oauthLoadingLocal}
                      onClick={() => {
                        setOauthName("Flow Master");
                        setOauthEmail(oauthProvider === "google" ? "flow.master@gmail.com" : "flow.master@github.com");
                      }}
                      className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white truncate text-left"
                    >
                      Flow Master
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={oauthLoadingLocal}
                  className="w-full h-9 bg-accent-gradient text-white text-xs font-bold rounded-xl border border-white/10 shadow-lg mt-3 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-98 transition-all disabled:opacity-50"
                >
                  {oauthLoadingLocal ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Syncing cloud profile...</span>
                    </>
                  ) : (
                    <span>Authenticate & Enter Workspace</span>
                  )}
                </button>
                
                <button
                  type="button"
                  disabled={oauthLoadingLocal}
                  onClick={() => setOauthProvider(null)}
                  className="w-full py-1 text-[10px] text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  Cancel Connection
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
