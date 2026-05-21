"use client";

import React, { useState } from "react";
import { useProductivityStore, ThemeType } from "@/store/useProductivityStore";
import { Palette, Sparkles, User, Bell, ShieldAlert, Check, RefreshCw, Volume2, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function VisualSettings() {
  const {
    userName,
    setUserName,
    theme,
    setTheme,
    cursorEffect,
    setCursorEffect,
    resetAllData
  } = useProductivityStore();

  const [nameInput, setNameInput] = useState(userName);
  const [saveNameSuccess, setSaveNameSuccess] = useState(false);

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setUserName(nameInput);
    setSaveNameSuccess(true);
    setTimeout(() => setSaveNameSuccess(false), 2000);
  };

  const handleSystemReset = () => {
    if (confirm("Restore all default configurations? This will wipe your active database backlog, notes, habits, streaks, and themes settings.")) {
      resetAllData();
      window.location.reload();
    }
  };

  const themeOptions: { id: ThemeType; name: string; desc: string; colors: string[] }[] = [
    {
      id: "midnight",
      name: "Midnight Nebula",
      desc: "Deep cosmic purple and violet gradients with glassmorphic accents.",
      colors: ["bg-[#070512]", "bg-[#a855f7]", "bg-[#6366f1]"]
    },
    {
      id: "sunset",
      name: "Sunset Synth",
      desc: "Warm dark-navy background blending into coral and roses hues.",
      colors: ["bg-[#0d0914]", "bg-[#f97316]", "bg-[#f43f5e]"]
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk Grid",
      desc: "High-contrast jet dark frames highlighting neon greens and cyans.",
      colors: ["bg-[#08080c]", "bg-[#22c55e]", "bg-[#06b6d4]"]
    },
    {
      id: "aura",
      name: "Aura Glow",
      desc: "Charcoal slates background highlighting color shifting radial overlays.",
      colors: ["bg-[#090a16]", "bg-[#ec4899]", "bg-[#0ea5e9]"]
    }
  ];

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      {/* Header controls controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Visual Settings</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure visual accent variables, custom cursors, usernames, and restore system states.
          </p>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Theme engine & Custom cursor */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Theme customizer cards */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 bg-black/10">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Palette size={14} className="text-[var(--accent)]" />
              <span>Visual Customization Themes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themeOptions.map((opt) => {
                const isActive = theme === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden text-left",
                      isActive
                        ? "bg-white/5 border-[var(--accent)]/55 shadow-lg shadow-purple-500/5"
                        : "bg-white/2 border-transparent hover:bg-white/5 hover:border-white/5"
                    )}
                  >
                    {isActive && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent-gradient flex items-center justify-center border border-white/10 text-white shadow shadow-purple-500/10">
                        <Check size={11} />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {opt.colors.map((c, i) => (
                        <span key={i} className={cn("w-3.5 h-3.5 rounded-full border border-white/5", c)} />
                      ))}
                      <span className="text-xs font-bold text-white ml-1">{opt.name}</span>
                    </div>

                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cursor trail effect & customization customization */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 bg-black/10 text-left">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 border-b border-white/5 pb-3">
              <MousePointerClick size={14} className="text-[var(--accent)]" />
              <span>Workspace Accent Effects</span>
            </h3>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-white">Bespoke Cursor Trail</span>
                <span className="text-[10px] text-[var(--text-muted)] max-w-xs leading-relaxed">
                  Renders a glowing accent trail following your pointer coordinate index for desktop users.
                </span>
              </div>
              <button
                onClick={() => setCursorEffect(!cursorEffect)}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                  cursorEffect 
                    ? "bg-accent-gradient text-white border-white/10" 
                    : "bg-white/5 text-[var(--text-muted)] border-transparent hover:bg-white/10"
                )}
              >
                {cursorEffect ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: User profiles editor & systems restore */}
        <div className="flex flex-col gap-6">
          {/* User profile username editor */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-black/10 text-left">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 border-b border-white/5 pb-3">
              <User size={14} className="text-[var(--accent)]" />
              <span>Identity Profile</span>
            </h3>

            <form onSubmit={handleNameSave} className="flex flex-col gap-3.5 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Username</label>
                <input
                  type="text"
                  required
                  placeholder="Change alias name..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10 shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {saveNameSuccess ? (
                  <>
                    <Check size={13} />
                    <span>Saved successfully!</span>
                  </>
                ) : (
                  <span>Apply Profile Name</span>
                )}
              </button>
            </form>
          </div>

          {/* Danger zone systems restore */}
          <div className="glass-panel p-5 rounded-2xl border border-red-500/10 bg-red-950/5 text-left flex flex-col gap-3.5">
            <h3 className="text-xs uppercase font-bold tracking-widest text-red-400 flex items-center gap-1.5 border-b border-red-500/10 pb-3">
              <ShieldAlert size={14} />
              <span>System Danger Zone</span>
            </h3>
            
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Restoring default settings will wipe all customized boards, checklists, and note records. This operation cannot be undone.
            </p>

            <button
              onClick={handleSystemReset}
              className="w-full py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw size={13} />
              <span>Wipe App Backlog & Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
