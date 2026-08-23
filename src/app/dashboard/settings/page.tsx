"use client";

import React, { useState } from "react";
import { useProductivityStore, ThemeType } from "@/store/useProductivityStore";
import { 
  Palette, 
  Sparkles, 
  User, 
  ShieldAlert, 
  Check, 
  RefreshCw, 
  MousePointerClick, 
  Trophy, 
  Zap, 
  Sliders, 
  Settings2, 
  Database, 
  TrendingUp 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

export default function VisualSettings() {
  const {
    userName,
    setUserName,
    theme,
    setTheme,
    cursorEffect,
    setCursorEffect,
    resetAllData,
    xpConfig,
    updateXPConfig,
    setCustomProgress,
    loadDemoData,
    xp,
    level
  } = useProductivityStore();

  const [nameInput, setNameInput] = useState(userName);
  const [saveNameSuccess, setSaveNameSuccess] = useState(false);

  // RPG local states
  const [xpPerLevelInput, setXpPerLevelInput] = useState(xpConfig?.xpPerLevel ?? 100);
  const [levelingCurveInput, setLevelingCurveInput] = useState(xpConfig?.levelingCurve ?? "linear");
  const [taskXP, setTaskXP] = useState(xpConfig?.taskCompleteXP ?? 50);
  const [subtaskXP, setSubtaskXP] = useState(xpConfig?.subtaskCompleteXP ?? 15);
  const [habitXP, setHabitXP] = useState(xpConfig?.habitCompleteXP ?? 25);
  const [weeklyGoalXP, setWeeklyGoalXP] = useState(xpConfig?.weeklyGoalCompleteXP ?? 30);
  const [focusSessionXP, setFocusSessionXP] = useState(xpConfig?.focusSessionCompleteXP ?? 100);
  const [xpSaveSuccess, setXpSaveSuccess] = useState(false);

  // Override progression states
  const [customLvl, setCustomLvl] = useState(level);
  const [customXp, setCustomXp] = useState(xp);
  const [progSaveSuccess, setProgSaveSuccess] = useState(false);

  // Seeding states
  const [demoLoadSuccess, setDemoLoadSuccess] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setUserName(nameInput);
    setSaveNameSuccess(true);
    showToast("Profile Saved", `Username updated to "${nameInput}".`, "success");
    setTimeout(() => setSaveNameSuccess(false), 2000);
  };

  const handleSaveXPConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateXPConfig({
      xpPerLevel: Number(xpPerLevelInput),
      levelingCurve: levelingCurveInput,
      taskCompleteXP: Number(taskXP),
      subtaskCompleteXP: Number(subtaskXP),
      habitCompleteXP: Number(habitXP),
      weeklyGoalCompleteXP: Number(weeklyGoalXP),
      focusSessionCompleteXP: Number(focusSessionXP)
    });
    setXpSaveSuccess(true);
    showToast("XP Config Saved", "Gamification parameters updated.", "success");
    setTimeout(() => setXpSaveSuccess(false), 2000);
  };

  const handleSaveCustomProgress = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomProgress(Number(customLvl), Number(customXp));
    setProgSaveSuccess(true);
    showToast("Progress Updated", `Level set to ${customLvl}, XP set to ${customXp}.`, "success");
    setTimeout(() => setProgSaveSuccess(false), 2000);
  };

  const handleLoadDemoData = () => {
    loadDemoData();
    setDemoLoadSuccess(true);
    showToast("Demo Data Seeded", "Predefined guides, tasks, and habits loaded.", "success");
    
    // Update override inputs
    setTimeout(() => {
      const freshState = useProductivityStore.getState();
      setCustomLvl(freshState.level);
      setCustomXp(freshState.xp);
      setDemoLoadSuccess(false);
    }, 1000);
  };

  const handleConfirmSystemReset = () => {
    setShowResetModal(false);
    resetAllData();
    showToast("Workspace Reset", `All data erased while preserving your username "${userName}".`, "info");
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
    },
    {
      id: "light",
      name: "Pure Light",
      desc: "Clean, bright mode with soft lavender gradients and indigo accents.",
      colors: ["bg-[#f8fafc]", "bg-[#6366f1]", "bg-[#8b5cf6]"]
    }
  ];

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      {/* Header controls controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Visual & RPG Settings</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure XP parameters, leveling curves, visual accent variables, seed mock backlog collections, or wipe database backlogs.
          </p>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Theme engine, Custom cursor, & RPG config */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* RPG gamification settings panel */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 bg-black/10 text-left">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Sliders size={14} className="text-[var(--accent)]" />
              <span>RPG Leveling & Gamification Controls</span>
            </h3>

            <form onSubmit={handleSaveXPConfig} className="flex flex-col gap-4 mt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Leveling Curve Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wider flex items-center gap-1">
                    <TrendingUp size={11} />
                    <span>Leveling Curve Type</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["linear", "exponential"] as const).map((curve) => (
                      <button
                        key={curve}
                        type="button"
                        onClick={() => setLevelingCurveInput(curve)}
                        className={cn(
                          "py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all",
                          levelingCurveInput === curve
                            ? "bg-accent-gradient text-white border-white/20"
                            : "bg-white/5 text-[var(--text-muted)] border-transparent hover:bg-white/10"
                        )}
                      >
                        {curve}
                      </button>
                    ))}
                  </div>
                  <span className="text-[8px] text-[var(--text-muted)] leading-relaxed">
                    {levelingCurveInput === "linear" 
                      ? "Linear curve: constant XP needed per level (e.g. 100 XP per level)."
                      : "Exponential curve: XP required increases progressively with level (Level^2 * base XP)."
                    }
                  </span>
                </div>

                {/* XP Required per level */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wider flex items-center gap-1">
                    <Trophy size={11} />
                    <span>Base XP Per Level</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {([50, 100, 200, 500] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setXpPerLevelInput(val)}
                        className={cn(
                          "py-1 rounded text-xs font-mono font-semibold border transition-all",
                          xpPerLevelInput === val
                            ? "bg-accent-gradient text-white border-white/20"
                            : "bg-white/5 text-[var(--text-muted)] border-transparent hover:bg-white/10"
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min={10}
                    max={5000}
                    value={xpPerLevelInput}
                    onChange={(e) => setXpPerLevelInput(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[var(--accent)] mt-0.5"
                  />
                </div>
              </div>

              {/* Action specific XP rewards rewards */}
              <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Customize Activity XP Rewards</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-[var(--text-muted)]">Task Complete</span>
                    <input
                      type="number"
                      value={taskXP}
                      onChange={(e) => setTaskXP(Number(e.target.value))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-[var(--text-muted)]">Subtask Checked</span>
                    <input
                      type="number"
                      value={subtaskXP}
                      onChange={(e) => setSubtaskXP(Number(e.target.value))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-[var(--text-muted)]">Habit Checked</span>
                    <input
                      type="number"
                      value={habitXP}
                      onChange={(e) => setHabitXP(Number(e.target.value))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-[var(--text-muted)]">Goal Completed</span>
                    <input
                      type="number"
                      value={weeklyGoalXP}
                      onChange={(e) => setWeeklyGoalXP(Number(e.target.value))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-[var(--text-muted)]">Focus Pomodoro (Completed)</span>
                    <input
                      type="number"
                      value={focusSessionXP}
                      onChange={(e) => setFocusSessionXP(Number(e.target.value))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none font-mono col-span-2 md:col-span-1"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10 shadow flex items-center justify-center gap-1.5 cursor-pointer mt-3"
              >
                {xpSaveSuccess ? (
                  <>
                    <Check size={13} />
                    <span>XP Config Updated!</span>
                  </>
                ) : (
                  <span>Apply Gamification XP Rules</span>
                )}
              </button>
            </form>
          </div>
          
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

        {/* Right 1 Col: User profiles editor, manual progression override, systems restore */}
        <div className="flex flex-col gap-6">
          {/* User profile username editor */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-black/10 text-left">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 border-b border-white/5 pb-3">
              <User size={14} className="text-[var(--accent)]" />
              <span>Identity Profile</span>
            </h3>

            <form onSubmit={handleSaveName} className="flex flex-col gap-3.5 mt-2">
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

          {/* Manual Progress Override */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-black/10 text-left">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Settings2 size={14} className="text-[var(--accent)]" />
              <span>Progression Manual Override</span>
            </h3>

            <form onSubmit={handleSaveCustomProgress} className="flex flex-col gap-3.5 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Level</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={customLvl}
                    onChange={(e) => setCustomLvl(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)] font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Total XP</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={customXp}
                    onChange={(e) => setCustomXp(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)] font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10 shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {progSaveSuccess ? (
                  <>
                    <Check size={13} />
                    <span>Progress Updated!</span>
                  </>
                ) : (
                  <span>Force Override Progress</span>
                )}
              </button>
            </form>
          </div>

          {/* Seed backlog mock data data */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-black/10 text-left flex flex-col gap-3">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Database size={14} className="text-[var(--accent)]" />
              <span>Workspace Data Seeding</span>
            </h3>
            
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Started in a clean canvas state with zero notes/tasks. You can click below to load pre-built demo data guides to explore the UI immediately.
            </p>

            <button
              onClick={handleLoadDemoData}
              className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {demoLoadSuccess ? (
                <>
                  <Check size={13} className="text-[var(--accent)]" />
                  <span className="text-[var(--accent)] animate-pulse">Backlog Loaded!</span>
                </>
              ) : (
                <>
                  <Database size={13} />
                  <span>Seed Mock Backlog & Notes</span>
                </>
              )}
            </button>
          </div>

          {/* Danger zone systems restore */}
          <div className="glass-panel p-5 rounded-2xl border border-red-500/10 bg-red-950/5 text-left flex flex-col gap-3.5">
            <h3 className="text-xs uppercase font-bold tracking-widest text-red-400 flex items-center gap-1.5 border-b border-red-500/10 pb-3">
              <ShieldAlert size={14} />
              <span>System Danger Zone</span>
            </h3>
            
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Wiping workspace data erases all tasks, habits, notes, and XP progress. Your username ({userName}) will remain intact.
            </p>

            <button
              onClick={() => setShowResetModal(true)}
              className="w-full py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw size={13} />
              <span>Wipe App Backlog & Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Wipe Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/10 bg-black/80 shadow-2xl flex flex-col gap-4 text-left z-10 select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Wipe Workspace Data?</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                    Are you sure you want to erase all tasks, habits, notes, streaks, and XP? Your username (<span className="text-white font-bold">{userName}</span>) will be kept.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSystemReset}
                  className="flex-1 py-2 px-4 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                >
                  Yes, Wipe Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
